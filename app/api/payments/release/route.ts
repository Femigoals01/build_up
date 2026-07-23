


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {

    const session = await getServerSession(authOptions);

if (!session || session.user.role !== "ADMIN") {
  return NextResponse.json(
    {
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 }
      );
    }

    const funding = await prisma.projectFunding.findUnique({
      where: {
        projectId,
      },
    });

    if (!funding) {
      return NextResponse.json(
        { error: "Funding not found" },
        { status: 404 }
      );
    }

    if (funding.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Only approved projects can be released." },
        { status: 400 }
      );
    }

    if (!funding.volunteerId) {
      return NextResponse.json(
        { error: "Volunteer missing." },
        { status: 400 }
      );
    }

    const bank = await prisma.bankAccount.findUnique({
      where: {
        userId: funding.volunteerId,
      },
    });

    if (!bank) {
      return NextResponse.json(
        { error: "Volunteer bank account not found." },
        { status: 400 }
      );
    }

    if (!bank.paystackRecipientCode) {
      return NextResponse.json(
        { error: "Recipient has not been created." },
        { status: 400 }
      );
    }


    const existingTransfer = await prisma.transfer.findFirst({
  where: {
    fundingId: funding.id,
    status: {
      in: [
        "PROCESSING",
        "SUCCESS",
      ],
    },
  },
});

if (existingTransfer) {
  return NextResponse.json(
    {
      error:
        "This project has already been released.",
    },
    {
      status: 400,
    }
  );
}


const walletTransaction = await prisma.walletTransaction.create({
  data: {
    userId: funding.volunteerId,
    projectId: funding.projectId,
    amount: funding.volunteerAmount,
    type: "PROJECT_RELEASED",
    status: "PROCESSING",
    description: "Admin approved payout",
  },
});

const transfer = await prisma.transfer.create({
  data: {
    fundingId: funding.id,
    volunteerId: funding.volunteerId,
    amount: funding.volunteerAmount,
    status: "PROCESSING",
  },
});

await prisma.withdrawalRequest.create({
  data: {
    userId: funding.volunteerId,
    amount: funding.volunteerAmount,
    bankName: bank.bankName,
    accountName: bank.accountName,
    accountNumber: bank.accountNumber,
    paystackRecipientCode: bank.paystackRecipientCode,
    transferId: transfer.id,
    walletTransactionId: walletTransaction.id,
    status: "PROCESSING",
  },
});

await prisma.projectFunding.update({
  where: {
    id: funding.id,
  },
  data: {
    status: "TRANSFER_PENDING",
  },
});

    const reference =
      "BLD-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 8);

    const response = await fetch(
      "https://api.paystack.co/transfer",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "balance",
          amount: funding.volunteerAmount,
          recipient: bank.paystackRecipientCode,
          reason: "BuildUp Project Payment",
          reference,
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        {
          error:
            data.message ??
            "Unable to initiate transfer.",
        },
        { status: 400 }
      );
    }

    // const transfer = await prisma.transfer.create({
    //   data: {
    //     fundingId: funding.id,
    //     volunteerId: funding.volunteerId,
    //     amount: funding.volunteerAmount,
    //     paystackReference: reference,
    //     paystackTransferCode:
    //       data.data.transfer_code,
    //     status: "PROCESSING",
    //   },
    // });

    // await prisma.projectFunding.update({
    //   where: {
    //     id: funding.id,
    //   },
    //   data: {
    //     status: "TRANSFER_PENDING",
    //     transferReference: reference,
    //     transferStatus: "PROCESSING",
    //   },
    // });

    await prisma.notification.create({
      data: {
        userId: funding.volunteerId,
        title: "Payment is on the way",
        message:
          "Your project has been approved. Your payment is currently being processed.",
        type: "PAYMENT",
        link: "/dashboard/wallet",
      },
    });

    return NextResponse.json({
      success: true,
      transfer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}