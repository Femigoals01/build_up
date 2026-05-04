


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function GET(
  req: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await context.params;

    const conversation = await prisma.directConversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
            reads: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 🔐 Access control
    const isParticipant = conversation.participants.some(
      (p) => p.userId === session.user.id
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Mark read
    const unread = conversation.messages.filter(
      (msg) =>
        !msg.isSystem &&
        msg.senderId !== session.user.id &&
        !msg.reads.some((r) => r.userId === session.user.id)
    );

    if (unread.length > 0) {
      await prisma.directMessageRead.createMany({
        data: unread.map((m) => ({
          messageId: m.id,
          userId: session.user.id,
        })),
        skipDuplicates: true,
      });

      await pusher.trigger(`direct-${conversationId}`, "messages-read", {
        readerId: session.user.id,
        messageIds: unread.map((m) => m.id),
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}