

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const REVIEW_COOLDOWN_DAYS = 30;

function clean(value: unknown) {
  return String(value || "").trim();
}

function toRating(value: unknown) {
  const rating = Number(value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return null;
  }

  return rating;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const easeOfUse = toRating(body.easeOfUse);
    const opportunities = toRating(body.opportunities);
    const communityExperience = toRating(body.communityExperience);
    const overallRating = toRating(body.overallRating);
    const review = clean(body.review);

    if (
      !easeOfUse ||
      !opportunities ||
      !communityExperience ||
      !overallRating
    ) {
      return NextResponse.json(
        { error: "All ratings must be between 1 and 5." },
        { status: 400 }
      );
    }

    if (review && review.length < 10) {
      return NextResponse.json(
        { error: "Review must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (review.length > 800) {
      return NextResponse.json(
        { error: "Review cannot be more than 800 characters." },
        { status: 400 }
      );
    }

    const since = new Date(
      Date.now() - REVIEW_COOLDOWN_DAYS * 24 * 60 * 60 * 1000
    );

    const recentReview = await prisma.platformReview.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: since,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (recentReview) {
      return NextResponse.json(
        {
          error:
            "You have already submitted a platform review recently. You can submit another after 30 days.",
        },
        { status: 429 }
      );
    }

    const platformReview = await prisma.platformReview.create({
      data: {
        userId: session.user.id,
        easeOfUse,
        opportunities,
        communityExperience,
        overallRating,
        review: review || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for your feedback. Your review is pending admin approval.",
        review: platformReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("PLATFORM REVIEW POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit platform review." },
      { status: 500 }
    );
  }
}