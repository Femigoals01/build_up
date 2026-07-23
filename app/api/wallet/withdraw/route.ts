




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const MIN_WITHDRAWAL_KOBO = 2_000_000;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    const amountNaira = Number(amount);
    const amountKobo = Math.round(amountNaira * 100);

    if (!amountNaira || amountKobo < MIN_WITHDRAWAL_KOBO) {
      return NextResponse.json(
        { error: "Minimum withdrawal amount is ₦20,000." },
        { status: 400 }
      );
    }

    const [wallet, bankAccount] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: session.user.id },
      }),

      prisma.bankAccount.findUnique({
        where: { userId: session.user.id },
      }),
    ]);

    if (!bankAccount?.paystackRecipientCode) {
      return NextResponse.json(
        {
          error:
            "Please set up your bank account before requesting withdrawal.",
        },
        { status: 400 }
      );
    }

    if (!wallet || wallet.available < amountKobo) {
      return NextResponse.json(
        { error: "Insufficient available balance." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId: session.user.id },
        data: {
          available: { decrement: amountKobo },
          pending: { increment: amountKobo },
        },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          userId: session.user.id,
          type: "WITHDRAWAL",
          amount: amountKobo,
          status: "PENDING",
          description: "Withdrawal request submitted",
        },
      });

      await tx.withdrawalRequest.create({
        data: {
          userId: session.user.id,
          amount: amountKobo,
          status: "PENDING",
          bankName: bankAccount.bankName,
          accountNumber: bankAccount.accountNumber,
          accountName: bankAccount.accountName,
          paystackRecipientCode: bankAccount.paystackRecipientCode,
          walletTransactionId: transaction.id,
        },
      });

      await tx.notification.create({
        data: {
          userId: session.user.id,
          title: "Withdrawal request submitted",
          message: `Your withdrawal request of ₦${amountNaira.toLocaleString(
            "en-NG"
          )} has been submitted.`,
          type: "SYSTEM",
          link: "/dashboard/wallet",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted.",
    });
  } catch (error) {
    console.error("WITHDRAWAL REQUEST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit withdrawal request." },
      { status: 500 }
    );
  }
}