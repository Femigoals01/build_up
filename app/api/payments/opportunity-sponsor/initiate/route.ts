


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const SPONSORSHIP_TIERS = {
  STARTER: {
    days: 7,
    amount: 5000 * 100,
  },
  PROFESSIONAL: {
    days: 30,
    amount: 15000 * 100,
  },
  ENTERPRISE: {
    days: 90,
    amount: 35000 * 100,
  },
} as const;

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.id ||
      !session.user.email ||
      session.user.role !== "ORGANIZATION"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const opportunityId = clean(body.opportunityId);
    const tier = clean(body.tier).toUpperCase() as keyof typeof SPONSORSHIP_TIERS;

    if (!opportunityId) {
      return NextResponse.json(
        { error: "Opportunity ID is required." },
        { status: 400 }
      );
    }

    if (!SPONSORSHIP_TIERS[tier]) {
      return NextResponse.json(
        { error: "Invalid sponsorship plan selected." },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        organizationId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        organizationId: true,
        status: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found." },
        { status: 404 }
      );
    }

    if (opportunity.status === "CLOSED") {
      return NextResponse.json(
        { error: "Closed opportunities cannot be sponsored." },
        { status: 400 }
      );
    }

    const selectedTier = SPONSORSHIP_TIERS[tier];
    const reference = `buildup_opp_${opportunity.id}_${Date.now()}`;

    await prisma.opportunitySponsorship.create({
      data: {
        opportunityId: opportunity.id,
        organizationId: session.user.id,
        tier,
        amount: selectedTier.amount,
        days: selectedTier.days,
        status: "UNPAID",
        paystackReference: reference,
      },
    });

    const response = await fetch(
      `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          amount: selectedTier.amount,
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/opportunity-sponsor/verify`,
          metadata: {
            paymentType: "OPPORTUNITY_SPONSORSHIP",
            opportunityId: opportunity.id,
            organizationId: session.user.id,
            tier,
            days: selectedTier.days,
          },
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack opportunity sponsor init failed:", data);

      await prisma.opportunitySponsorship.update({
        where: {
          paystackReference: reference,
        },
        data: {
          status: "FAILED",
        },
      });

      return NextResponse.json(
        { error: data?.message || "Failed to initialize sponsorship payment." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error("OPPORTUNITY SPONSOR INIT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to initialize sponsorship payment." },
      { status: 500 }
    );
  }
}