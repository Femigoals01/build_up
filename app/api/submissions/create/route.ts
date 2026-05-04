



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";


// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json().catch(() => null);

//     const projectId = String(body?.projectId || "").trim();
//     const message = String(body?.message || "").trim();
//     const workUrl = String(body?.workUrl || "").trim();
//     const fileUrl = String(body?.fileUrl || "").trim();

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Project ID is required." },
//         { status: 400 }
//       );
//     }

//     if (!message && !workUrl && !fileUrl) {
//       return NextResponse.json(
//         { error: "Please add a message, work link, or proof file URL." },
//         { status: 400 }
//       );
//     }

//     const application = await prisma.application.findFirst({
//       where: {
//         projectId,
//         volunteerId: session.user.id,
//         status: "ACCEPTED",
//       },
//       include: {
//         project: {
//           select: {
//             id: true,
//             title: true,
//             status: true,
//             organizationId: true,
//           },
//         },
//       },
//     });

//     if (!application) {
//       return NextResponse.json(
//         { error: "You are not assigned to this project." },
//         { status: 403 }
//       );
//     }

//     if (application.project.status === "COMPLETED") {
//       return NextResponse.json(
//         { error: "This project has already been completed." },
//         { status: 409 }
//       );
//     }

//     const existingPending = await prisma.projectSubmission.findFirst({
//       where: {
//         projectId,
//         volunteerId: session.user.id,
//         status: "PENDING",
//       },
//     });

//     if (existingPending) {
//       return NextResponse.json(
//         { error: "You already have a pending submission for this project." },
//         { status: 409 }
//       );
//     }

//     const lastSubmission = await prisma.projectSubmission.findFirst({
//       where: {
//         projectId,
//         volunteerId: session.user.id,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       select: {
//         version: true,
//       },
//     });

//     const nextVersion = lastSubmission ? lastSubmission.version + 1 : 1;

//     const submission = await prisma.$transaction(async (tx) => {
//       const createdSubmission = await tx.projectSubmission.create({
//         data: {
//           projectId,
//           volunteerId: session.user.id,
//           message: message || null,
//           workUrl: workUrl || null,
//           fileUrl: fileUrl || null,
//           version: nextVersion,
//         },
//       });

//       await tx.project.update({
//         where: { id: projectId },
//         data: { status: "IN_PROGRESS" },
//       });

//       await tx.notification.create({
//         data: {
//           userId: application.project.organizationId,
//           title: `New Work Submission — Version ${nextVersion}`,
//           message: `A volunteer submitted version ${nextVersion} of work for "${application.project.title}".`,
//           type: "PROJECT",
//           link: `/dashboard/organization/projects/${projectId}/submission`,
//         },
//       });

//       const chat = await tx.projectChat.findUnique({
//         where: { projectId },
//       });

//       if (chat) {
//         await tx.chatMessage.create({
//           data: {
//             chatId: chat.id,
//             senderId: session.user.id,
//             content:
//               message ||
//               workUrl ||
//               fileUrl ||
//               `Submitted version ${nextVersion} of completed work for review.`,
//             isSystem: false,
//           },
//         });

//         await tx.chatMessage.create({
//           data: {
//             chatId: chat.id,
//             content: `📦 Work submission v${nextVersion} has been sent for organization review.`,
//             isSystem: true,
//           },
//         });
//       }

//       return createdSubmission;
//     });

//     return NextResponse.json(
//       {
//         message: "Work submitted successfully.",
//         submission,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Create submission error:", error);

//     return NextResponse.json(
//       { error: "Something went wrong while submitting work." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server"; // 🔥 NEW

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);

    const projectId = String(body?.projectId || "").trim();
    const message = String(body?.message || "").trim();
    const workUrl = String(body?.workUrl || "").trim();
    const fileUrl = String(body?.fileUrl || "").trim();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 }
      );
    }

    if (!message && !workUrl && !fileUrl) {
      return NextResponse.json(
        { error: "Please add a message, work link, or proof file URL." },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        projectId,
        volunteerId: session.user.id,
        status: "ACCEPTED",
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            organizationId: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "You are not assigned to this project." },
        { status: 403 }
      );
    }

    if (application.project.status === "COMPLETED") {
      return NextResponse.json(
        { error: "This project has already been completed." },
        { status: 409 }
      );
    }

    const existingPending = await prisma.projectSubmission.findFirst({
      where: {
        projectId,
        volunteerId: session.user.id,
        status: "PENDING",
      },
    });

    if (existingPending) {
      return NextResponse.json(
        { error: "You already have a pending submission for this project." },
        { status: 409 }
      );
    }

    const lastSubmission = await prisma.projectSubmission.findFirst({
      where: {
        projectId,
        volunteerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        version: true,
      },
    });

    const nextVersion = lastSubmission ? lastSubmission.version + 1 : 1;

    const submission = await prisma.$transaction(async (tx) => {
      const createdSubmission = await tx.projectSubmission.create({
        data: {
          projectId,
          volunteerId: session.user.id,
          message: message || null,
          workUrl: workUrl || null,
          fileUrl: fileUrl || null,
          version: nextVersion,
        },
      });

      await tx.project.update({
        where: { id: projectId },
        data: { status: "IN_PROGRESS" },
      });

      await tx.notification.create({
        data: {
          userId: application.project.organizationId,
          title: `New Work Submission — Version ${nextVersion}`,
          message: `A volunteer submitted version ${nextVersion} of work for "${application.project.title}".`,
          type: "PROJECT",
          link: `/dashboard/organization/projects/${projectId}/submission`,
        },
      });

      const chat = await tx.projectChat.findUnique({
        where: { projectId },
      });

      if (chat) {
        await tx.chatMessage.create({
          data: {
            chatId: chat.id,
            senderId: session.user.id,
            content:
              message ||
              workUrl ||
              fileUrl ||
              `Submitted version ${nextVersion} of completed work for review.`,
            isSystem: false,
          },
        });

        await tx.chatMessage.create({
          data: {
            chatId: chat.id,
            content: `📦 Work submission v${nextVersion} has been sent for organization review.`,
            isSystem: true,
          },
        });
      }

      return createdSubmission;
    });

    // 🔥 REAL-TIME PUSHER EVENT (KEY PART)
    await pusherServer.trigger(
      `private-user-notifications-${application.project.organizationId}`,
      "submission:new",
      {
        projectId,
        submissionId: submission.id,
        version: submission.version,
      }
    );

    return NextResponse.json(
      {
        message: "Work submitted successfully.",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create submission error:", error);

    return NextResponse.json(
      { error: "Something went wrong while submitting work." },
      { status: 500 }
    );
  }
}