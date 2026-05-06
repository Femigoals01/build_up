// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ADMIN" || !session.user.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { withdrawalId } = await req.json();

//     if (!withdrawalId) {
//       return NextResponse.json(
//         { error: "Withdrawal ID is required." },
//         { status: 400 }
//       );
//     }

//     const withdrawal = await prisma.withdrawalRequest.findUnique({
//       where: { id: withdrawalId },
//     });

//     if (!withdrawal) {
//       return NextResponse.json(
//         { error: "Withdrawal request not found." },
//         { status: 404 }
//       );
//     }

//     if (withdrawal.status !== "PENDING") {
//       return NextResponse.json(
//         { error: "Withdrawal has already been processed." },
//         { status: 400 }
//       );
//     }

//     if (!withdrawal.paystackRecipientCode) {
//       return NextResponse.json(
//         { error: "Volunteer does not have a valid Paystack recipient code." },
//         { status: 400 }
//       );
//     }

//     await prisma.withdrawalRequest.update({
//       where: { id: withdrawal.id },
//       data: { status: "PROCESSING" },
//     });

//     const response = await fetch(`${process.env.PAYSTACK_BASE_URL}/transfer`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         source: "balance",
//         amount: withdrawal.amount,
//         recipient: withdrawal.paystackRecipientCode,
//         reason: "BuildUp wallet withdrawal",
//       }),
//     });

//     const data = await response.json();

//     if (!data.status) {
//       await prisma.$transaction(async (tx) => {
//         await tx.withdrawalRequest.update({
//           where: { id: withdrawal.id },
//           data: {
//             status: "FAILED",
//             failureReason: data?.message || "Paystack transfer failed.",
//             processedAt: new Date(),
//           },
//         });

//         await tx.wallet.update({
//           where: { userId: withdrawal.userId },
//           data: {
//             pending: { decrement: withdrawal.amount },
//             balance: { increment: withdrawal.amount },
//           },
//         });

//         if (withdrawal.walletTransactionId) {
//           await tx.walletTransaction.update({
//             where: { id: withdrawal.walletTransactionId },
//             data: { status: "FAILED" },
//           });
//         }
//       });

//       return NextResponse.json(
//         { error: data?.message || "Paystack transfer failed." },
//         { status: 500 }
//       );
//     }

//     await prisma.$transaction(async (tx) => {
//       await tx.withdrawalRequest.update({
//         where: { id: withdrawal.id },
//         data: {
//           status: "COMPLETED",
//           paystackTransferCode: data.data?.transfer_code,
//           processedAt: new Date(),
//         },
//       });

//       await tx.wallet.update({
//         where: { userId: withdrawal.userId },
//         data: {
//           pending: { decrement: withdrawal.amount },
//           withdrawn: { increment: withdrawal.amount },
//         },
//       });

//       if (withdrawal.walletTransactionId) {
//         await tx.walletTransaction.update({
//           where: { id: withdrawal.walletTransactionId },
//           data: { status: "COMPLETED" },
//         });
//       }

//       await tx.notification.create({
//         data: {
//           userId: withdrawal.userId,
//           title: "Withdrawal processed",
//           message: "Your BuildUp wallet withdrawal has been processed.",
//           type: "SYSTEM",
//           link: "/dashboard/wallet",
//         },
//       });
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("PROCESS WITHDRAWAL ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to process withdrawal." },
//       { status: 500 }
//     );
//   }
// }



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

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal request not found." },
        { status: 404 }
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
        { error: "Volunteer does not have a valid Paystack recipient code." },
        { status: 400 }
      );
    }

    const payoutReference = `buildup_withdrawal_${withdrawal.id}_${Date.now()}`;

    await prisma.withdrawalRequest.update({
      where: { id: withdrawal.id },
      data: {
        status: "PROCESSING",
        paystackTransferCode: payoutReference,
      },
    });

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
        reason: "BuildUp wallet withdrawal",
        reference: payoutReference,
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

        await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: {
            pending: { decrement: withdrawal.amount },
            balance: { increment: withdrawal.amount },
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

    await prisma.withdrawalRequest.update({
      where: { id: withdrawal.id },
      data: {
        status: "PROCESSING",
        paystackTransferCode:
          data.data?.transfer_code || data.data?.reference || payoutReference,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Payout has been sent to Paystack and is now processing. Final status will be updated by webhook.",
    });
  } catch (error) {
    console.error("PROCESS WITHDRAWAL ERROR:", error);

    return NextResponse.json(
      { error: "Failed to process withdrawal." },
      { status: 500 }
    );
  }
}