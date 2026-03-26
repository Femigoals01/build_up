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

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        volunteerId: session.user.id,
        projectId,
        status: "COMPLETED",
        project: {
          status: "COMPLETED",
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Only completed projects can be added to portfolio" },
        { status: 403 }
      );
    }

    const existingPortfolioItem = await prisma.portfolioItem.findFirst({
      where: {
        volunteerId: session.user.id,
        projectId,
      },
    });

    if (existingPortfolioItem) {
      return NextResponse.json(
        { error: "Project already added to portfolio" },
        { status: 409 }
      );
    }

    const review = await prisma.review.findFirst({
      where: {
        volunteerId: session.user.id,
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        volunteerId: session.user.id,
        projectId,
        reviewId: review?.id,
      },
    });

    return NextResponse.json({ success: true, portfolioItem }, { status: 201 });
  } catch (error) {
    console.error("PORTFOLIO CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add portfolio item" },
      { status: 500 }
    );
  }
}