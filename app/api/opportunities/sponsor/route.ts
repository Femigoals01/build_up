

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const SPONSORSHIP_TIERS = {
  STARTER: {
    days: 7,
    price: 5000,
  },

  PROFESSIONAL: {
    days: 30,
    price: 15000,
  },

  ENTERPRISE: {
    days: 90,
    price: 35000,
  },
} as const;

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.id ||
      session.user.role !== "ORGANIZATION"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const opportunityId = String(
      body.opportunityId || ""
    ).trim();

    const tier = String(
      body.tier || ""
    ).toUpperCase() as keyof typeof SPONSORSHIP_TIERS;

    if (!opportunityId) {
      return NextResponse.json(
        {
          error: "Opportunity ID is required.",
        },
        { status: 400 }
      );
    }

    if (!SPONSORSHIP_TIERS[tier]) {
      return NextResponse.json(
        {
          error:
            "Invalid sponsorship tier selected.",
        },
        { status: 400 }
      );
    }

    const opportunity =
      await prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          organizationId: session.user.id,
        },
        select: {
          id: true,
          title: true,
          organizationId: true,
          featured: true,
          sponsoredTier: true,
          featuredUntil: true,
        },
      });

    if (!opportunity) {
      return NextResponse.json(
        {
          error:
            "Opportunity not found.",
        },
        { status: 404 }
      );
    }

    const selectedTier =
      SPONSORSHIP_TIERS[tier];

    const featuredUntil = addDays(
      selectedTier.days
    );

    const updatedOpportunity =
      await prisma.opportunity.update({
        where: {
          id: opportunity.id,
        },
        data: {
          featured: true,
          sponsoredTier: tier,
          sponsoredAt: new Date(),
          featuredUntil,
        },
      });

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title:
          "Opportunity promoted successfully",
        message: `"${opportunity.title}" is now featured until ${featuredUntil.toLocaleDateString()}.`,
        type: "SYSTEM",
        link: "/dashboard/organization/opportunities",
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Opportunity successfully upgraded.",
      tier,
      expiresAt: featuredUntil,
      opportunity: updatedOpportunity,
    });
  } catch (error) {
    console.error(
      "OPPORTUNITY SPONSOR ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to sponsor opportunity.",
      },
      { status: 500 }
    );
  }
}