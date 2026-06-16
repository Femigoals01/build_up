


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const expiredOpportunities = await prisma.opportunity.updateMany({
      where: {
        featured: true,
        featuredUntil: {
          lte: now,
        },
      },
      data: {
        featured: false,
        sponsoredTier: null,
        sponsoredAt: null,
      },
    });

    const expiredSponsorships = await prisma.opportunitySponsorship.updateMany({
      where: {
        status: "PAID",
        expiresAt: {
          lte: now,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Expired sponsorships cleaned successfully.",
      expiredOpportunities: expiredOpportunities.count,
      expiredSponsorships: expiredSponsorships.count,
    });
  } catch (error) {
    console.error("EXPIRE SPONSORSHIPS CRON ERROR:", error);

    return NextResponse.json(
      { error: "Failed to expire sponsorships." },
      { status: 500 }
    );
  }
}