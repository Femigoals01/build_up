

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return String(value || "").trim();
}

const ALLOWED_REACTIONS = ["LOVE", "FIRE", "CELEBRATE", "SUPPORT"];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const storyId = clean(body.storyId);
    const type = clean(body.type);

    if (!storyId) {
      return NextResponse.json(
        { error: "Story ID is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_REACTIONS.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reaction type." },
        { status: 400 }
      );
    }

    const story = await prisma.communityStory.findUnique({
      where: {
        id: storyId,
      },
      select: {
        id: true,
        userId: true,
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

    const existingReaction = await prisma.communityStoryReaction.findUnique({
      where: {
        storyId_userId: {
          storyId,
          userId: session.user.id,
        },
      },
    });

    if (existingReaction?.type === type) {
      await prisma.communityStoryReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });

      return NextResponse.json({
        success: true,
        action: "removed",
      });
    }

    await prisma.communityStoryReaction.upsert({
      where: {
        storyId_userId: {
          storyId,
          userId: session.user.id,
        },
      },
      update: {
        type,
      },
      create: {
        storyId,
        userId: session.user.id,
        type,
      },
    });

    if (story.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: story.userId,
          title: "New story reaction",
          message: `${session.user.name || "Someone"} reacted to your community story.`,
          type: "MESSAGE",
          link: "/dashboard/community",
        },
      });
    }

    return NextResponse.json({
      success: true,
      action: existingReaction ? "updated" : "added",
    });
  } catch (error) {
    console.error("COMMUNITY STORY REACTION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to react to story." },
      { status: 500 }
    );
  }
}