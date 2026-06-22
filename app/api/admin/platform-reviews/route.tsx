

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const reviewId = clean(body.reviewId);
    const action = clean(body.action);

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required." },
        { status: 400 }
      );
    }

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    const review = await prisma.platformReview.findUnique({
      where: {
        id: reviewId,
      },
      select: {
        id: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    const updatedReview = await prisma.platformReview.update({
      where: {
        id: reviewId,
      },
      data: {
        status: action === "APPROVE" ? "APPROVED" : "REJECTED",
      },
    });

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? "Review approved successfully."
          : "Review rejected successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error("ADMIN PLATFORM REVIEW PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update platform review." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const reviewId = clean(body.reviewId);

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required." },
        { status: 400 }
      );
    }

    const review = await prisma.platformReview.findUnique({
      where: {
        id: reviewId,
      },
      select: {
        id: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    await prisma.platformReview.delete({
      where: {
        id: reviewId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN PLATFORM REVIEW DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete platform review." },
      { status: 500 }
    );
  }
}