



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Pusher from "pusher";

/* ================= PUSHER ================= */

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

/* ================= GET ================= */

export async function GET(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await context.params;
    if (!projectId || projectId === "[projectId]") {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    /* ================= LOAD PROJECT ================= */

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        applications: {
          where: { status: "ACCEPTED" },
          select: { volunteerId: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const acceptedVolunteerIds = project.applications.map(
      (a) => a.volunteerId
    );

    const isOrganization = project.organizationId === session.user.id;
    const isVolunteer = acceptedVolunteerIds.includes(session.user.id);
    const isMentor = project.mentorId === session.user.id;

    if (!isOrganization && !isVolunteer && !isMentor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    /* ================= ENSURE CHAT ================= */

    let chat = await prisma.projectChat.findUnique({
      where: { projectId },
    });

    if (!chat) {
      chat = await prisma.projectChat.create({
        data: { projectId },
      });
    }

    /* ================= LOAD CHAT ================= */

    const fullChat = await prisma.projectChat.findUnique({
      where: { id: chat.id },
      include: {
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

    if (!fullChat) {
      return NextResponse.json(
        { error: "Chat initialization failed" },
        { status: 500 }
      );
    }

    /* ================= MARK AS READ ================= */

    const unreadMessages = fullChat.messages.filter(
      (msg) =>
        !msg.isSystem &&
        msg.senderId !== session.user.id &&
        !msg.reads.some((r) => r.userId === session.user.id)
    );

    if (unreadMessages.length > 0) {
      await prisma.chatMessageRead.createMany({
        data: unreadMessages.map((msg) => ({
          messageId: msg.id,
          userId: session.user.id,
        })),
        skipDuplicates: true,
      });

      /* 🔴 REAL-TIME READ RECEIPT */
      await pusher.trigger(`chat-${fullChat.id}`, "messages-read", {
        readerId: session.user.id,
        messageIds: unreadMessages.map((m) => m.id),
      });
    }

    return NextResponse.json(fullChat);
  } catch (error) {
    console.error("CHAT API ERROR:", error);
    return NextResponse.json(
      { error: "Unable to load chat" },
      { status: 500 }
    );
  }
}
