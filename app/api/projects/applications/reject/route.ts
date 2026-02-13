

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { applicationId } = await req.json();

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { project: true },
    });

    if (
      !application ||
      application.project.organizationId !== session.user.id
    ) {
      return NextResponse.json({ error: "Invalid application" }, { status: 403 });
    }

    if (application.status !== "PENDING") {
      return NextResponse.json(
        { error: "Application already handled" },
        { status: 409 }
      );
    }

    // 1️⃣ Reject application
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "REJECTED" },
    });

    // 2️⃣ System message
    const chat = await prisma.projectChat.findUnique({
      where: { projectId: application.projectId },
    });

    if (chat) {
      await prisma.chatMessage.create({
        data: {
          chatId: chat.id,
          content: "❌ Volunteer application was rejected.",
          isSystem: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject application error:", error);
    return NextResponse.json(
      { error: "Failed to reject application" },
      { status: 500 }
    );
  }
}
