


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { withdrawalId } = await req.json();

    if (!withdrawalId) {
      return NextResponse.json(
        { error: "Withdrawal ID is required." },
        { status: 400 }
      );
    }

    // const withdrawal = await prisma.withdrawalRequest.findUnique({
    //   where: { id: withdrawalId },
    // });

    const withdrawal =
      await prisma.withdrawalRequest.findUnique({
        where: {
          id: withdrawalId,
        },
        include: {
          transfer: true,
        },
      });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal request not found." },
        { status: 404 }
      );
    }


    if (!withdrawal.transfer) {
      return NextResponse.json(
        {
          error: "Transfer record not found.",
        },
        {
          status: 404,
        }
      );
    }


    const transfer = withdrawal.transfer;


    if (
    transfer.status === "PROCESSING" ||
    transfer.status === "SUCCESS"
) {
    return NextResponse.json(
        {
            error: "Transfer has already been initiated.",
        },
        {
            status: 400,
        }
    );
}

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        { error: "Withdrawal has already been processed or is processing." },
        { status: 400 }
      );
    }

    if (!withdrawal.paystackRecipientCode) {
      return NextResponse.json(
        { error: "User does not have a valid Paystack recipient code." },
        { status: 400 }
      );
    }

    // const payoutReference = `buildup_withdrawal_${withdrawal.id}_${Date.now()}`;

    // await prisma.withdrawalRequest.update({
    //   where: { id: withdrawal.id },
    //   data: {
    //     status: "PROCESSING",
    //     paystackTransferCode: payoutReference,
    //   },
    // });

    

    const response = await fetch(`${process.env.PAYSTACK_BASE_URL}/transfer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: withdrawal.amount,
        recipient: withdrawal.paystackRecipientCode,
        reason: "BuildUp Project Payment",
        reference: transfer.id,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      await prisma.$transaction(async (tx) => {
        await tx.withdrawalRequest.update({
          where: { id: withdrawal.id },
          data: {
            status: "FAILED",
            failureReason: data?.message || "Paystack transfer failed.",
            processedAt: new Date(),
          },
        });


        await tx.transfer.update({
    where: {
        id: transfer.id,
    },
    data: {
        status: "FAILED",
        failureReason: data?.message || "Paystack transfer failed.",
        processedAt: new Date(),
    },
});

        await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: {
            pending: { decrement: withdrawal.amount },
            available: { increment: withdrawal.amount },
          },
        });

        if (withdrawal.walletTransactionId) {
          await tx.walletTransaction.update({
            where: { id: withdrawal.walletTransactionId },
            data: {
              status: "FAILED",
            },
          });
        }

        await tx.notification.create({
          data: {
            userId: withdrawal.userId,
            title: "Withdrawal failed",
            message:
              "Your BuildUp wallet withdrawal could not be processed. The amount has been returned to your wallet balance.",
            type: "SYSTEM",
            link: "/dashboard/wallet",
          },
        });
      });

      return NextResponse.json(
        { error: data?.message || "Paystack transfer failed." },
        { status: 500 }
      );
    }

    // await prisma.withdrawalRequest.update({
    //   where: { id: withdrawal.id },
    //   data: {
    //     status: "PROCESSING",
    //     paystackTransferCode:
    //       data.data?.transfer_code || data.data?.reference || payoutReference,
    //   },
    // });


    await prisma.$transaction(async (tx) => {

    await tx.withdrawalRequest.update({
        where: {
            id: withdrawal.id,
        },
        data: {
            status: "PROCESSING",
            paystackTransferCode: data.data.transfer_code,
        },
    });

    await tx.transfer.update({
        where: {
            id: transfer.id,
        },
        data: {
            status: "PROCESSING",
            paystackTransferCode: data.data.transfer_code,
            paystackReference: data.data.reference,
        },
    });

});

    // return NextResponse.json({
    //   success: true,
    //    transferCode: data.data.transfer_code,
    // requiresOtp: true,
    //   message:
    //     "Transfer initiated. Waiting for OTP confirmation.",
    // });

    return NextResponse.json({
  success: true,
  requiresOtp: true,
  transferId: transfer.id,
  transferCode: data.data.transfer_code,
  message: "Transfer initiated. Waiting for OTP confirmation.",
});
  } catch (error) {
    console.error("PROCESS WITHDRAWAL ERROR:", error);

    return NextResponse.json(
      { error: "Failed to process withdrawal." },
      { status: 500 }
    );
  }
}