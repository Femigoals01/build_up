

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(body)
      .digest("hex");

    const signature = req.headers.get("x-paystack-signature");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    switch (event.event) {

      case "transfer.success":
        await handleTransferSuccess(event.data);
        break;

      case "transfer.failed":
        await handleTransferFailed(event.data);
        break;

      case "transfer.reversed":
        await handleTransferReversed(event.data);
        break;

      default:
        console.log("Unhandled event:", event.event);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}


async function handleTransferSuccess(data: any) {
  const transferCode = data.transfer_code;

  if (!transferCode) return;

  const transfer = await prisma.transfer.findFirst({
    where: {
      paystackTransferCode: transferCode,
    },
    include: {
      funding: true,
    },
  });

  if (!transfer) {
    console.log("Transfer not found:", transferCode);
    return;
  }

  // Prevent duplicate processing
  if (transfer.status === "SUCCESS") {
    return;
  }

  
await prisma.$transaction(async (tx) => {
  // Transfer
  await tx.transfer.update({
    where: {
      id: transfer.id,
    },
    data: {
      status: "SUCCESS",
      processedAt: new Date(),
    },
  });

  // Withdrawal request
  await tx.withdrawalRequest.updateMany({
    where: {
      transferId: transfer.id,
    },
    data: {
      status: "COMPLETED",
      processedAt: new Date(),
    },
  });

  // Wallet transaction
  await tx.walletTransaction.updateMany({
    where: {
      projectId: transfer.funding.projectId,
      userId: transfer.volunteerId,
    },
    data: {
      status: "COMPLETED",
    },
  });

  // Funding
  await tx.projectFunding.update({
    where: {
      id: transfer.fundingId,
    },
    data: {
      status: "RELEASED",
      releasedAt: new Date(),
    },
  });

  // Wallet
  await tx.wallet.update({
    where: {
      userId: transfer.volunteerId,
    },
    data: {
      pending: {
        decrement: transfer.amount,
      },
      withdrawn: {
        increment: transfer.amount,
      },
      totalEarned: {
        increment: transfer.amount,
      },
    },
  });

  // Notification
  await tx.notification.create({
    data: {
      userId: transfer.volunteerId,
      title: "Payment Completed",
      message:
        "Your payment has been successfully transferred to your bank account.",
      type: "PAYMENT",
      link: "/dashboard/wallet",
    },
  });
});

  

  console.log("Transfer completed:", transferCode);
}



async function handleTransferFailed(data: any) {
  const transferCode = data.transfer_code;

  if (!transferCode) return;

  const transfer = await prisma.transfer.findFirst({
    where: {
      paystackTransferCode: transferCode,
    },
    include: {
      funding: true,
    },
  });

  if (!transfer) return;

  if (transfer.status === "FAILED") return;

  await prisma.transfer.update({
    where: {
      id: transfer.id,
    },
    data: {
      status: "FAILED",
      processedAt: new Date(),
      failureReason:
        data.failure_reason ??
        data.reason ??
        "Transfer failed",
    },
  });

  await prisma.withdrawalRequest.updateMany({
    where: {
      transferId: transfer.id,
    },
    data: {
      status: "FAILED",
      processedAt: new Date(),
      failureReason:
        data.failure_reason ??
        data.reason ??
        "Transfer failed",
    },
  });

  await prisma.walletTransaction.updateMany({
    where: {
      projectId: transfer.funding.projectId,
      userId: transfer.volunteerId,
    },
    data: {
      status: "FAILED",
    },
  });

  await prisma.projectFunding.update({
    where: {
      id: transfer.fundingId,
    },
    data: {
      status: "APPROVED",
    },
  });

  await prisma.notification.create({
    data: {
      userId: transfer.volunteerId,
      title: "Payment Failed",
      message:
        "Your payment could not be completed. BuildUp has been notified and will retry.",
      type: "PAYMENT",
      link: "/dashboard/wallet",
    },
  });

  console.log("Transfer failed:", transferCode);
}

async function handleTransferReversed(data: any) {
  const transferCode = data.transfer_code;

  if (!transferCode) return;

  const transfer = await prisma.transfer.findFirst({
    where: {
      paystackTransferCode: transferCode,
    },
    include: {
      funding: true,
    },
  });

  if (!transfer) return;

  if (transfer.status === "REVERSED") return;

  await prisma.transfer.update({
    where: {
      id: transfer.id,
    },
    data: {
      status: "REVERSED",
      failureReason: "Transfer reversed by Paystack",
      processedAt: new Date(),
    },
  });

  await prisma.withdrawalRequest.updateMany({
    where: {
      transferId: transfer.id,
    },
    data: {
      status: "REVERSED",
      failureReason: "Transfer reversed by Paystack",
      processedAt: new Date(),
    },
  });

  await prisma.wallet.update({
    where: {
      userId: transfer.volunteerId,
    },
    data: {
      withdrawn: {
        decrement: transfer.amount,
      },
      pending: {
        increment: transfer.amount,
      },
    },
  });

  await prisma.projectFunding.update({
    where: {
      id: transfer.fundingId,
    },
    data: {
      status: "APPROVED",
      releasedAt: null,
    },
  });

  await prisma.notification.create({
    data: {
      userId: transfer.volunteerId,
      title: "Payment Reversed",
      message:
        "Your bank transfer was reversed by Paystack. BuildUp will review and process it again shortly.",
      type: "PAYMENT",
      link: "/dashboard/wallet",
    },
  });

  console.log("Transfer reversed:", transferCode);
}