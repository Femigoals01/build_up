




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { sendEmail } from "@/lib/sendEmail";


type RespondBody = {
  submissionId?: string;
  projectId?: string;
  volunteerId?: string;
  action?: "approve" | "reject";
  feedback?: string;
};

async function notifyUser(userId: string) {
  try {
    await pusherServer.trigger(
      `private-user-notifications-${userId}`,
      "notification:new",
      { userId }
    );
  } catch (error) {
    console.error("Failed to push notification:", error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: RespondBody = await req.json();

    const submissionId = body.submissionId?.trim();
    const action = body.action;
    const feedback = body.feedback?.trim() || "";

    if (!submissionId || !action) {
      return NextResponse.json(
        { error: "Submission ID and action are required." },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    if (action === "reject" && !feedback) {
      return NextResponse.json(
        { error: "Revision feedback is required." },
        { status: 400 }
      );
    }

    const submission = await prisma.projectSubmission.findUnique({
      where: { id: submissionId },
      include: {
        project: {
          include: {
            applications: true,
            chat: true,
          },
        },
        volunteer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: 404 }
      );
    }

    if (submission.project.organizationId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { error: "This submission has already been reviewed." },
        { status: 400 }
      );
    }

    // =========================
    // REVISION REQUEST
    // =========================

    if (action === "reject") {
      await prisma.$transaction(async (tx) => {
        await tx.projectSubmission.update({
          where: { id: submission.id },
          data: {
            status: "REJECTED",
            feedback,
            reviewedAt: new Date(),
          },
        });

        await tx.projectSubmissionComment.create({
          data: {
            submissionId: submission.id,
            userId: session.user.id,
            message: feedback,
          },
        });

        await tx.notification.create({
          data: {
            userId: submission.volunteerId,
            title: "Revision requested",
            message: `Your submission for "${submission.project.title}" needs revision. Please check the feedback and resubmit.`,
            type: "SUBMISSION",
            link: `/dashboard/volunteer/projects/${submission.projectId}`,
          },
        });

        if (submission.project.chat) {
          await tx.chatMessage.create({
            data: {
              chatId: submission.project.chat.id,
              senderId: session.user.id,
              content: `🔁 Revision requested: ${feedback}`,
            },
          });

          await tx.chatMessage.create({
            data: {
              chatId: submission.project.chat.id,
              content:
                "🔔 Revision requested. The volunteer has been notified and can submit an updated version.",
              isSystem: true,
            },
          });
        }
      });

      await notifyUser(submission.volunteerId);

      await sendEmail({
        to: submission.volunteer.email,
        subject: "Revision requested on your BuildUp submission",
        text: `Revision was requested for "${submission.project.title}". Feedback: ${feedback}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;">
            <h2 style="color:#dc2626;">
              🔁 Revision Requested
            </h2>

            <p style="line-height:1.7;color:#475569;">
              Hi ${submission.volunteer.name || "there"},
            </p>

            <p style="line-height:1.7;color:#475569;">
              Your submission for:
            </p>

            <div style="background:#f8fafc;padding:16px;border-radius:16px;margin:16px 0;">
              <strong style="font-size:18px;color:#0f172a;">
                ${submission.project.title}
              </strong>
            </div>

            <p style="line-height:1.7;color:#475569;">
              requires some updates before approval.
            </p>

            <div style="background:#fef2f2;padding:16px;border-radius:16px;margin-top:20px;">
              <strong style="display:block;margin-bottom:8px;color:#991b1b;">
                Feedback:
              </strong>

              <p style="margin:0;color:#7f1d1d;">
                ${feedback}
              </p>
            </div>

            <a
              href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/volunteer/projects/${submission.projectId}"
              style="
                display:inline-block;
                margin-top:24px;
                background:#2563eb;
                color:white;
                padding:12px 18px;
                border-radius:12px;
                text-decoration:none;
                font-weight:bold;
              "
            >
              View Project
            </a>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    }

    // =========================
    // APPROVAL FLOW
    // =========================

    const funding = await prisma.projectFunding.findUnique({
      where: {
        projectId: submission.projectId,
      },
    });

    if (!funding) {
      return NextResponse.json(
        { error: "Funding record not found for this project." },
        { status: 404 }
      );
    }

    if (funding.status !== "HELD") {
      return NextResponse.json(
        {
          error:
            "Project funds must be HELD before approval can release payment.",
        },
        { status: 400 }
      );
    }

    const acceptedApplication = submission.project.applications.find(
      (application) =>
        application.volunteerId === submission.volunteerId &&
        (application.status === "ACCEPTED" ||
          application.status === "COMPLETED")
    );

    if (!acceptedApplication) {
      return NextResponse.json(
        { error: "No accepted application found for this volunteer." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.projectSubmission.update({
        where: { id: submission.id },
        data: {
          status: "APPROVED",
          feedback: feedback || null,
          reviewedAt: new Date(),
        },
      });

      await tx.projectFunding.update({
        where: { id: funding.id },
        data: {
          status: "RELEASED",
          volunteerId: submission.volunteerId,
          releasedAt: new Date(),
        },
      });

      await tx.wallet.upsert({
        where: {
          userId: submission.volunteerId,
        },
        update: {
          balance: {
            increment: funding.volunteerAmount,
          },
        },
        create: {
          userId: submission.volunteerId,
          balance: funding.volunteerAmount,
          pending: 0,
          withdrawn: 0,
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: submission.volunteerId,
          projectId: submission.projectId,
          type: "PROJECT_EARNING",
          amount: funding.volunteerAmount,
          status: "COMPLETED",
          description: `Earning released for completed project: ${submission.project.title}`,
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: session.user.id,
          projectId: submission.projectId,
          type: "PLATFORM_FEE",
          amount: funding.platformFee,
          status: "COMPLETED",
          description: `BuildUp 18% platform fee for project: ${submission.project.title}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: submission.volunteerId,
          title: "Submission approved",
          message: `Your work for "${submission.project.title}" was approved.`,
          type: "SUBMISSION",
          link: `/dashboard/volunteer/projects/${submission.projectId}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: submission.volunteerId,
          title: "Project earning released",
          message: `Your earning for "${submission.project.title}" has been added to your wallet.`,
          type: "PAYMENT",
          link: "/dashboard/wallet",
        },
      });

      if (submission.project.chat) {
        await tx.chatMessage.create({
          data: {
            chatId: submission.project.chat.id,
            senderId: session.user.id,
            content:
              "✅ Work approved. Payment released. Proceeding to completion verification.",
          },
        });

        await tx.chatMessage.create({
          data: {
            chatId: submission.project.chat.id,
            content:
              "🎉 Submission approved. The organization can now finalize project completion and review.",
            isSystem: true,
          },
        });
      }
    });

    await notifyUser(submission.volunteerId);

    await sendEmail({
      to: submission.volunteer.email,
      subject: "Your BuildUp submission was approved",
      text: `Your submission for "${submission.project.title}" was approved and your earning has been released.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;">
          <h2 style="color:#16a34a;">
            🎉 Submission Approved
          </h2>

          <p style="line-height:1.7;color:#475569;">
            Hi ${submission.volunteer.name || "there"},
          </p>

          <p style="line-height:1.7;color:#475569;">
            Your work for:
          </p>

          <div style="background:#ecfdf5;padding:16px;border-radius:16px;margin:16px 0;">
            <strong style="font-size:18px;color:#166534;">
              ${submission.project.title}
            </strong>
          </div>

          <p style="line-height:1.7;color:#475569;">
            has been approved successfully.
          </p>

          <div style="background:#eff6ff;padding:16px;border-radius:16px;margin-top:20px;">
            <strong style="color:#1d4ed8;">
              💰 Your earning has been released to your wallet.
            </strong>
          </div>

          <a
            href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/wallet"
            style="
              display:inline-block;
              margin-top:24px;
              background:#2563eb;
              color:white;
              padding:12px 18px;
              border-radius:12px;
              text-decoration:none;
              font-weight:bold;
            "
          >
            Open Wallet
          </a>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      redirectTo: `/dashboard/organization/projects/${submission.projectId}/complete`,
    });
  } catch (error) {
    console.error("SUBMISSION RESPOND ERROR:", error);

    return NextResponse.json(
      { error: "Failed to respond to submission." },
      { status: 500 }
    );
  }
}