

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const ACCOUNT_AGE_DAYS = 14;
const REVIEW_COOLDOWN_DAYS = 30;
const PROMPT_COOLDOWN_DAYS = 14;

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ showPrompt: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        createdAt: true,
        lastPlatformReviewPromptAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ showPrompt: false });
    }

    if (user.createdAt > daysAgo(ACCOUNT_AGE_DAYS)) {
      return NextResponse.json({ showPrompt: false });
    }

    if (
      user.lastPlatformReviewPromptAt &&
      user.lastPlatformReviewPromptAt > daysAgo(PROMPT_COOLDOWN_DAYS)
    ) {
      return NextResponse.json({ showPrompt: false });
    }

    const recentReview = await prisma.platformReview.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: daysAgo(REVIEW_COOLDOWN_DAYS),
        },
      },
      select: { id: true },
    });

    if (recentReview) {
      return NextResponse.json({ showPrompt: false });
    }

    return NextResponse.json({ showPrompt: true });
  } catch (error) {
    console.error("PLATFORM REVIEW PROMPT GET ERROR:", error);

    return NextResponse.json({ showPrompt: false });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        lastPlatformReviewPromptAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PLATFORM REVIEW PROMPT POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update review prompt." },
      { status: 500 }
    );
  }
}