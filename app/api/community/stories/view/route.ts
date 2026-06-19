

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const storyId = clean(body.storyId);

    if (!storyId) {
      return NextResponse.json(
        { error: "Story ID is required." },
        { status: 400 }
      );
    }

    const story = await prisma.communityStory.findUnique({
      where: {
        id: storyId,
      },
      select: {
        id: true,
        expiresAt: true,
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }

    if (story.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: "This story has expired." },
        { status: 410 }
      );
    }

    await prisma.communityStoryView.upsert({
      where: {
        storyId_userId: {
          storyId,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        storyId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Story view recorded.",
    });
  } catch (error) {
    console.error("COMMUNITY STORY VIEW ERROR:", error);

    return NextResponse.json(
      { error: "Failed to record story view." },
      { status: 500 }
    );
  }
}