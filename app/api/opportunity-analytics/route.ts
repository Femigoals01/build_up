
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const VALID_EVENTS = [
  "SPONSORED_VIEW",
  "VIEW_DETAILS_CLICK",
  "MARKETPLACE_CLICK",
];

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const opportunityId = clean(body.opportunityId);
    const eventType = clean(body.eventType);
    const source = clean(body.source) || null;

    if (!opportunityId) {
      return NextResponse.json(
        { error: "Opportunity ID is required." },
        { status: 400 }
      );
    }

    if (!VALID_EVENTS.includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid analytics event." },
        { status: 400 }
      );
    }

    await prisma.opportunityAnalytics.create({
      data: {
        opportunityId,
        eventType,
        source,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OPPORTUNITY ANALYTICS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save analytics." },
      { status: 500 }
    );
  }
}