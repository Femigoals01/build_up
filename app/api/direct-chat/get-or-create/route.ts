

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

function isAllowedDirectChat(currentRole: string, targetRole: string) {
  const pair = [currentRole, targetRole].sort().join("-");

  return pair === "ORGANIZATION-VOLUNTEER" || pair === "MENTOR-VOLUNTEER";
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const targetUserId = String(body?.targetUserId || "").trim();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user is required." },
        { status: 400 }
      );
    }

    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot start a chat with yourself." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found." },
        { status: 404 }
      );
    }

    if (!isAllowedDirectChat(session.user.role, targetUser.role)) {
      return NextResponse.json(
        {
          error:
            "Direct chat is only allowed between volunteer and organization, or volunteer and mentor.",
        },
        { status: 403 }
      );
    }

    const existingConversation = await prisma.directConversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: session.user.id,
              },
            },
          },
          {
            participants: {
              some: {
                userId: targetUserId,
              },
            },
          },
        ],
      },
      include: {
        participants: true,
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    const conversation = await prisma.directConversation.create({
      data: {
        participants: {
          create: [
            { userId: session.user.id },
            { userId: targetUserId },
          ],
        },
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Get or create direct chat error:", error);

    return NextResponse.json(
      { error: "Failed to start direct chat." },
      { status: 500 }
    );
  }
}