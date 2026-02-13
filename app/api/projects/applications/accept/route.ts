

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

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

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

    // 1️⃣ Accept application
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "ACCEPTED" },
    });

    // 2️⃣ Ensure project chat exists
    const chat =
      (await prisma.projectChat.findUnique({
        where: { projectId: application.projectId },
      })) ??
      (await prisma.projectChat.create({
        data: { projectId: application.projectId },
      }));

    // 3️⃣ System message
    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        content: "✅ Volunteer has been accepted into the project.",
        isSystem: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Accept application error:", error);
    return NextResponse.json(
      { error: "Failed to accept application" },
      { status: 500 }
    );
  }
}
