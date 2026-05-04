





import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: applicationId } = await context.params;
    const body = await req.json().catch(() => null);
    const action = String(body?.action || "").trim();

    if (!applicationId || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        volunteerId: session.user.id,
        status: "PENDING",
        source: "ORGANIZATION",
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            organizationId: true,
          },
        },
        volunteer: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Invite not found or no longer pending" },
        { status: 404 }
      );
    }

    const volunteerDisplayName =
      application.volunteer.name?.trim() ||
      application.volunteer.username ||
      "A volunteer";

    if (action === "accept") {
      const updated = await prisma.$transaction(async (tx) => {
        const acceptedApplication = await tx.application.update({
          where: { id: applicationId },
          data: { status: "ACCEPTED" },
        });

        await tx.project.update({
          where: { id: application.project.id },
          data: { status: "IN_PROGRESS" },
        });

        await tx.application.updateMany({
          where: {
            projectId: application.project.id,
            id: { not: applicationId },
            status: "PENDING",
          },
          data: { status: "REJECTED" },
        });

        const chat =
          (await tx.projectChat.findUnique({
            where: { projectId: application.project.id },
          })) ??
          (await tx.projectChat.create({
            data: { projectId: application.project.id },
          }));

        await tx.chatMessage.create({
          data: {
            chatId: chat.id,
            content: "✅ Volunteer accepted the organization invite.",
            isSystem: true,
          },
        });

        await tx.notification.create({
          data: {
            userId: application.project.organizationId,
            type: "APPLICATION",
            title: "Invite accepted",
            message: `${volunteerDisplayName} accepted your invite for "${application.project.title}".`,
            // link: `/dashboard/projects/${application.project.id}?focus=invite-accepted`,
            link: `/dashboard/organization/projects/${application.project.id}`,
          },
        });

        return acceptedApplication;
      });

      await pusherServer.trigger(
        `private-user-notifications-${application.project.organizationId}`,
        "notification:new",
        {
          userId: application.project.organizationId,
        }
      );

      return NextResponse.json({
        message: "Invite accepted",
        application: updated,
      });
    }

    await prisma.notification.create({
      data: {
        userId: application.project.organizationId,
        type: "APPLICATION",
        title: "Invite declined",
        message: `${volunteerDisplayName} declined your invite for "${application.project.title}".`,
        // link: `/dashboard/projects/${application.project.id}?focus=invite-declined`,
        link: `/dashboard/organization/projects/${application.project.id}`,
      },
    });

    await pusherServer.trigger(
      `private-user-notifications-${application.project.organizationId}`,
      "notification:new",
      {
        userId: application.project.organizationId,
      }
    );

    await prisma.application.delete({
      where: { id: applicationId },
    });

    return NextResponse.json({
      message: "Invite declined",
    });
  } catch (error) {
    console.error("Invite response error:", error);

    return NextResponse.json(
      { error: "Something went wrong while responding to the invite." },
      { status: 500 }
    );
  }
}