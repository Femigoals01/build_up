

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const conversationId = String(body?.conversationId || "").trim();

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const conversation = await prisma.directConversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await pusherServer.trigger(`direct-${conversationId}`, "typing", {
      userId: session.user.id,
      userName: session.user.name || "User",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Direct chat typing error:", error);

    return NextResponse.json(
      { error: "Failed to send typing event." },
      { status: 500 }
    );
  }
}