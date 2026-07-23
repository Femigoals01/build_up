import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { fundingId } = await req.json();

    if (!fundingId) {
      return NextResponse.json(
        { error: "Funding ID required" },
        { status: 400 }
      );
    }

    //------------------------------------
    // Funding
    //------------------------------------

    const funding = await prisma.projectFunding.findUnique({
      where: {
        id: fundingId,
      },
      include: {
        volunteer: true,
        project: true,
      },
    });

    if (!funding) {
      return NextResponse.json(
        { error: "Funding not found." },
        { status: 404 }
      );
    }

    if (!funding.volunteerId) {
      return NextResponse.json(
        { error: "Volunteer missing." },
        { status: 400 }
      );
    }

    //------------------------------------
    // Bank
    //------------------------------------

    const bank = await prisma.bankAccount.findUnique({
      where: {
        userId: funding.volunteerId,
      },
    });

    if (!bank) {
      return NextResponse.json(
        { error: "Volunteer has no bank account." },
        { status: 400 }
      );
    }

    if (!bank.paystackRecipientCode) {
      return NextResponse.json(
        {
          error: "Volunteer recipient code missing.",
        },
        { status: 400 }
      );
    }

    //------------------------------------
    // Transfer Record
    //------------------------------------

    const transfer = await prisma.transfer.create({
      data: {
        volunteerId: funding.volunteerId,
        fundingId: funding.id,
        amount: funding.volunteerAmount,
        status: "PROCESSING",
      },
    });

    //------------------------------------
    // Paystack Transfer
    //------------------------------------

    const response = await fetch(
      `${process.env.PAYSTACK_BASE_URL}/transfer`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          source: "balance",

          amount: funding.volunteerAmount,

          recipient: bank.paystackRecipientCode,

          reason: `BuildUp Project Payment - ${funding.project.title}`,

          reference: transfer.id,
        }),
      }
    );

    const data = await response.json();

    //------------------------------------
    // Failed
    //------------------------------------

    if (!data.status) {
      await prisma.transfer.update({
        where: {
          id: transfer.id,
        },
        data: {
          status: "FAILED",
          failureReason:
            data.message ?? "Transfer failed",
        },
      });

      return NextResponse.json(
        {
          error: data.message ?? "Transfer failed.",
        },
        {
          status: 400,
        }
      );
    }

    //------------------------------------
    // Save Paystack Details
    //------------------------------------

    await prisma.transfer.update({
      where: {
        id: transfer.id,
      },
      data: {
        paystackTransferCode:
          data.data.transfer_code,

        paystackReference:
          data.data.reference,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Transfer failed",
      },
      {
        status: 500,
      }
    );
  }
}