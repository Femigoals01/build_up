

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const FREE_SPONSORSHIP_DAYS = 30;

function clean(value: unknown) {
  return String(value || "").trim();
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const opportunityId = clean(body.opportunityId);

    if (!opportunityId) {
      return NextResponse.json(
        { error: "Opportunity ID is required." },
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
        status: true,
        featured: true,
        featuredUntil: true,
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

    const now = new Date();

    const currentlyActive =
      opportunity.featuredUntil &&
      new Date(opportunity.featuredUntil).getTime() > now.getTime();

    if (opportunity.featured && currentlyActive) {
      return NextResponse.json(
        { error: "This opportunity is already actively sponsored." },
        { status: 400 }
      );
    }

    const expiresAt = addDays(now, FREE_SPONSORSHIP_DAYS);

    await prisma.$transaction(async (tx) => {
      await tx.opportunitySponsorship.create({
        data: {
          opportunityId: opportunity.id,
          organizationId: session.user.id,
          tier: "FREE_LAUNCH",
          amount: 0,
          days: FREE_SPONSORSHIP_DAYS,
          status: "PAID",
          paystackReference: `free_opp_${opportunity.id}_${Date.now()}`,
          paidAt: now,
          expiresAt,
        },
      });

      await tx.opportunity.update({
        where: {
          id: opportunity.id,
        },
        data: {
          featured: true,
          sponsoredTier: "FREE_LAUNCH",
          sponsoredAt: now,
          featuredUntil: expiresAt,
        },
      });

      await tx.notification.create({
        data: {
          userId: session.user.id,
          title: "Free sponsorship activated",
          message: `"${opportunity.title}" is now sponsored for 30 days on BuildUp.`,
          type: "SYSTEM",
          link: "/dashboard/organization/opportunities",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Free sponsorship activated successfully.",
      expiresAt,
    });
  } catch (error) {
    console.error("FREE OPPORTUNITY SPONSOR ERROR:", error);

    return NextResponse.json(
      { error: "Failed to activate free sponsorship." },
      { status: 500 }
    );
  }
}