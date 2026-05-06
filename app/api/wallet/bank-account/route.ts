

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bankName, bankCode, accountNumber, accountName } = await req.json();

    if (!bankName || !bankCode || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "All bank account fields are required." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      return NextResponse.json(
        { error: "Account number must be 10 digits." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.PAYSTACK_BASE_URL}/transferrecipient`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "nuban",
          name: accountName,
          account_number: accountNumber,
          bank_code: bankCode,
          currency: "NGN",
        }),
      }
    );

    const data = await response.json();

    if (!data.status || !data.data?.recipient_code) {
      console.error("Paystack recipient error:", data);
      return NextResponse.json(
        { error: "Unable to create Paystack transfer recipient." },
        { status: 500 }
      );
    }

    const bankAccount = await prisma.bankAccount.upsert({
      where: { userId: session.user.id },
      update: {
        bankName,
        bankCode,
        accountNumber,
        accountName,
        paystackRecipientCode: data.data.recipient_code,
      },
      create: {
        userId: session.user.id,
        bankName,
        bankCode,
        accountNumber,
        accountName,
        paystackRecipientCode: data.data.recipient_code,
      },
    });

    return NextResponse.json({ success: true, bankAccount });
  } catch (error) {
    console.error("BANK ACCOUNT SAVE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save bank account." },
      { status: 500 }
    );
  }
}