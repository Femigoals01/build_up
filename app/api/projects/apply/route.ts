import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    // Prevent duplicate applications
    const existing = await prisma.application.findFirst({
      where: {
        projectId,
        volunteerId: session.user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already applied to this project" },
        { status: 409 }
      );
    }

    // 1️⃣ Create application
    await prisma.application.create({
      data: {
        projectId,
        volunteerId: session.user.id,
      },
    });

    // 2️⃣ Add system message to chat
    const chat = await prisma.projectChat.findUnique({
      where: { projectId },
    });

    if (chat) {
      await prisma.chatMessage.create({
        data: {
          chatId: chat.id,
          content: "📨 A volunteer applied to this project.",
          isSystem: true,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Apply project error:", error);
    return NextResponse.json(
      { error: "Failed to apply to project" },
      { status: 500 }
    );
  }
}
