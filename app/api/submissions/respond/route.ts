





// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type RespondBody = {
//   submissionId?: string;
//   projectId?: string;
//   volunteerId?: string;
//   action?: "approve" | "reject";
//   feedback?: string;
// };

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body: RespondBody = await req.json();

//     const submissionId = body.submissionId?.trim();
//     const action = body.action;
//     const feedback = body.feedback?.trim() || "";

//     if (!submissionId || !action) {
//       return NextResponse.json(
//         { error: "Submission ID and action are required." },
//         { status: 400 }
//       );
//     }

//     if (action !== "approve" && action !== "reject") {
//       return NextResponse.json({ error: "Invalid action." }, { status: 400 });
//     }

//     if (action === "reject" && !feedback) {
//       return NextResponse.json(
//         { error: "Revision feedback is required." },
//         { status: 400 }
//       );
//     }

//     const submission = await prisma.projectSubmission.findUnique({
//       where: { id: submissionId },
//       include: {
//         project: {
//           include: {
//             applications: true,
//             chat: true,
//           },
//         },
//         volunteer: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!submission) {
//       return NextResponse.json(
//         { error: "Submission not found." },
//         { status: 404 }
//       );
//     }

//     if (submission.project.organizationId !== session.user.id) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     if (submission.status !== "PENDING") {
//       return NextResponse.json(
//         { error: "This submission has already been reviewed." },
//         { status: 400 }
//       );
//     }

//     if (action === "reject") {
//       await prisma.$transaction(async (tx) => {
//         await tx.projectSubmission.update({
//           where: { id: submission.id },
//           data: {
//             status: "REJECTED",
//             feedback,
//             reviewedAt: new Date(),
//           },
//         });

//         await tx.projectSubmissionComment.create({
//           data: {
//             submissionId: submission.id,
//             userId: session.user.id,
//             message: feedback,
//           },
//         });

//         await tx.notification.create({
//           data: {
//             userId: submission.volunteerId,
//             title: "Revision requested",
//             message: `Revision was requested for "${submission.project.title}".`,
//             type: "PROJECT",
//             link: "/dashboard/volunteer",
//           },
//         });

//         if (submission.project.chat) {
//           await tx.chatMessage.create({
//             data: {
//               chatId: submission.project.chat.id,
//               senderId: session.user.id,
//               content: `🔁 Revision requested: ${feedback}`,
//             },
//           });
//         }
//       });

//       return NextResponse.json({ success: true });
//     }

//     const funding = await prisma.projectFunding.findUnique({
//       where: {
//         projectId: submission.projectId,
//       },
//     });

//     if (!funding) {
//       return NextResponse.json(
//         { error: "Funding record not found for this project." },
//         { status: 404 }
//       );
//     }

//     if (funding.status !== "HELD") {
//       return NextResponse.json(
//         {
//           error:
//             "Project funds must be HELD before approval can release payment. Please fund the project first.",
//         },
//         { status: 400 }
//       );
//     }

//     const acceptedApplication = submission.project.applications.find(
//       (application) =>
//         application.volunteerId === submission.volunteerId &&
//         (application.status === "ACCEPTED" ||
//           application.status === "COMPLETED")
//     );

//     if (!acceptedApplication) {
//       return NextResponse.json(
//         { error: "No accepted application found for this volunteer." },
//         { status: 400 }
//       );
//     }

//     await prisma.$transaction(async (tx) => {
//       await tx.projectSubmission.update({
//         where: { id: submission.id },
//         data: {
//           status: "APPROVED",
//           feedback: feedback || null,
//           reviewedAt: new Date(),
//         },
//       });

//       await tx.project.update({
//         where: { id: submission.projectId },
//         data: {
//           status: "COMPLETED",
//         },
//       });

//       await tx.application.update({
//         where: { id: acceptedApplication.id },
//         data: {
//           status: "COMPLETED",
//         },
//       });

//       await tx.projectFunding.update({
//         where: { id: funding.id },
//         data: {
//           status: "RELEASED",
//           volunteerId: submission.volunteerId,
//           releasedAt: new Date(),
//         },
//       });

//       await tx.wallet.upsert({
//         where: {
//           userId: submission.volunteerId,
//         },
//         update: {
//           balance: {
//             increment: funding.volunteerAmount,
//           },
//         },
//         create: {
//           userId: submission.volunteerId,
//           balance: funding.volunteerAmount,
//           pending: 0,
//           withdrawn: 0,
//         },
//       });

//       await tx.walletTransaction.create({
//         data: {
//           userId: submission.volunteerId,
//           projectId: submission.projectId,
//           type: "PROJECT_EARNING",
//           amount: funding.volunteerAmount,
//           status: "COMPLETED",
//           description: `Earning released for completed project: ${submission.project.title}`,
//         },
//       });

//       await tx.walletTransaction.create({
//         data: {
//           userId: session.user.id,
//           projectId: submission.projectId,
//           type: "PLATFORM_FEE",
//           amount: funding.platformFee,
//           status: "COMPLETED",
//           description: `BuildUp 18% platform fee for project: ${submission.project.title}`,
//         },
//       });

//       await tx.notification.create({
//         data: {
//           userId: submission.volunteerId,
//           title: "Project earning released",
//           message: `Your earning for "${submission.project.title}" has been added to your wallet.`,
//           type: "PROJECT",
//           link: "/dashboard/wallet",
//         },
//       });

//       if (submission.project.chat) {
//         await tx.chatMessage.create({
//           data: {
//             chatId: submission.project.chat.id,
//             senderId: session.user.id,
//             content:
//               "✅ Work approved. Project completed and payment released to the volunteer wallet.",
//           },
//         });
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       redirectTo: `/dashboard/organization/projects/${submission.projectId}/review?volunteerId=${submission.volunteerId}`,
//     });
//   } catch (error) {
//     console.error("SUBMISSION RESPOND ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to respond to submission." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

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

      return NextResponse.json({ success: true });
    }

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
            "Project funds must be HELD before approval can release payment. Please fund the project first.",
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

      await tx.project.update({
        where: { id: submission.projectId },
        data: {
          status: "COMPLETED",
        },
      });

      await tx.application.update({
        where: { id: acceptedApplication.id },
        data: {
          status: "COMPLETED",
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
              "✅ Work approved. Project completed and payment released to the volunteer wallet.",
          },
        });

        await tx.chatMessage.create({
          data: {
            chatId: submission.project.chat.id,
            content:
              "🎉 Project completed. The volunteer has been notified and the earning has been released to wallet.",
            isSystem: true,
          },
        });
      }
    });

    await notifyUser(submission.volunteerId);

    return NextResponse.json({
      success: true,
      redirectTo: `/dashboard/organization/projects/${submission.projectId}/review?volunteerId=${submission.volunteerId}`,
    });
  } catch (error) {
    console.error("SUBMISSION RESPOND ERROR:", error);

    return NextResponse.json(
      { error: "Failed to respond to submission." },
      { status: 500 }
    );
  }
}