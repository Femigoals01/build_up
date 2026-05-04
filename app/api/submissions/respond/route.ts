


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const submissionId = String(body?.submissionId || "").trim();
    const action = String(body?.action || "").trim();
    const feedback = String(body?.feedback || "").trim();

    if (!submissionId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (action === "reject" && !feedback) {
      return NextResponse.json(
        { error: "Revision feedback is required." },
        { status: 400 }
      );
    }

    const submission = await prisma.projectSubmission.findFirst({
      where: {
        id: submissionId,
        status: "PENDING",
        project: {
          organizationId: session.user.id,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found or already reviewed." },
        { status: 404 }
      );
    }

    // const volunteerNotificationLink = `/dashboard/volunteer/projects/${submission.projectId}`;

    // const volunteerNotificationLink = `/dashboard/volunteer/projects/${submission.projectId}#submission-${submission.id}`;

    const volunteerNotificationLink = `/dashboard/volunteer/projects/${submission.projectId}#submission-${submission.id}`;
    if (action === "approve") {
      const result = await prisma.$transaction(async (tx) => {
        const approvedSubmission = await tx.projectSubmission.update({
          where: { id: submission.id },
          data: {
            status: "APPROVED",
            reviewedAt: new Date(),
            feedback: feedback || null,
          },
        });

        await tx.project.update({
          where: { id: submission.projectId },
          data: { status: "COMPLETED" },
        });

        await tx.application.updateMany({
          where: {
            projectId: submission.projectId,
            volunteerId: submission.volunteerId,
            status: "ACCEPTED",
          },
          data: { status: "COMPLETED" },
        });

        const existingPortfolioItem = await tx.portfolioItem.findFirst({
          where: {
            volunteerId: submission.volunteerId,
            projectId: submission.projectId,
          },
        });

        if (existingPortfolioItem) {
          await tx.portfolioItem.update({
            where: { id: existingPortfolioItem.id },
            data: {
              proofUrl: submission.workUrl || submission.fileUrl || null,
              contribution:
                submission.message ||
                "Completed project work submitted and approved.",
            },
          });
        } else {
          await tx.portfolioItem.create({
            data: {
              volunteerId: submission.volunteerId,
              projectId: submission.projectId,
              proofUrl: submission.workUrl || submission.fileUrl || null,
              contribution:
                submission.message ||
                "Completed project work submitted and approved.",
            },
          });
        }

        await tx.notification.create({
          data: {
            userId: submission.volunteerId,
            title: "Work approved",
            message: feedback
              ? `Your submitted work for "${submission.project.title}" has been approved. Feedback: ${feedback}`
              : `Your submitted work for "${submission.project.title}" has been approved.`,
            type: "PROJECT",
            link: volunteerNotificationLink,
          },
        });

        const chat = await tx.projectChat.findUnique({
          where: { projectId: submission.projectId },
        });

        if (chat) {
          await tx.chatMessage.create({
            data: {
              chatId: chat.id,
              content: feedback
                ? `✅ Submitted work has been approved by the organization.\n\nFeedback: ${feedback}`
                : "✅ Submitted work has been approved by the organization.",
              isSystem: true,
            },
          });
        }

        return approvedSubmission;
      });

      await pusherServer.trigger(
        `private-user-notifications-${submission.volunteerId}`,
        "notification:new",
        {}
      );

      await pusherServer.trigger(
        `private-user-notifications-${submission.volunteerId}`,
        "submission:reviewed",
        {
          projectId: submission.projectId,
          submissionId: submission.id,
          status: "APPROVED",
          feedback: feedback || null,
        }
      );

      return NextResponse.json({
        message: "Submission approved successfully.",
        submission: result,
        redirectTo: `/dashboard/organization/projects/${submission.projectId}/review?volunteerId=${submission.volunteerId}`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const rejectedSubmission = await tx.projectSubmission.update({
        where: { id: submission.id },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
          feedback: feedback || null,
        },
      });

      await tx.project.update({
        where: { id: submission.projectId },
        data: { status: "IN_PROGRESS" },
      });

      await tx.notification.create({
        data: {
          userId: submission.volunteerId,
          title: "Revision requested",
          message: `The organization requested revisions for "${submission.project.title}". Feedback: ${feedback}`,
          type: "PROJECT",
          link: volunteerNotificationLink,
        },
      });

      const chat = await tx.projectChat.findUnique({
        where: { projectId: submission.projectId },
      });

      if (chat) {
        await tx.chatMessage.create({
          data: {
            chatId: chat.id,
            content: `🔁 Revision requested by the organization.\n\nFeedback: ${feedback}`,
            isSystem: true,
          },
        });
      }

      return rejectedSubmission;
    });

    await pusherServer.trigger(
      `private-user-notifications-${submission.volunteerId}`,
      "notification:new",
      {}
    );

    await pusherServer.trigger(
      `private-user-notifications-${submission.volunteerId}`,
      "submission:reviewed",
      {
        projectId: submission.projectId,
        submissionId: submission.id,
        status: "REJECTED",
        feedback,
      }
    );

    return NextResponse.json({
      message: "Revision requested successfully.",
      submission: result,
    });
  } catch (error) {
    console.error("Submission response error:", error);

    return NextResponse.json(
      { error: "Something went wrong while reviewing the submission." },
      { status: 500 }
    );
  }
}