
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId } = await req.json();

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { project: true },
  });

  if (
    !application ||
    application.project.organizationId !== session.user.id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "ACCEPTED" },
  });

  /* Ensure chat exists */
  const chat =
    (await prisma.projectChat.findUnique({
      where: { projectId: application.projectId },
    })) ??
    (await prisma.projectChat.create({
      data: { projectId: application.projectId },
    }));

  await prisma.chatMessage.create({
    data: {
      chatId: chat.id,
      senderId: session.user.id,
      content: "✅ Organization accepted the project application.",
    },
  });

  return NextResponse.json({ success: true });
}
