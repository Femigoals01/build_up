




// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const contentType = req.headers.get("content-type") || "";
//     let applicationId = "";

//     if (contentType.includes("application/json")) {
//       const body = await req.json();
//       applicationId = body.applicationId;
//     } else if (
//       contentType.includes("application/x-www-form-urlencoded") ||
//       contentType.includes("multipart/form-data")
//     ) {
//       const formData = await req.formData();
//       applicationId = String(formData.get("applicationId") || "");
//     }

//     if (!applicationId) {
//       return NextResponse.json(
//         { error: "applicationId is required" },
//         { status: 400 }
//       );
//     }

//     const application = await prisma.application.findUnique({
//       where: { id: applicationId },
//       include: {
//         project: true,
//         volunteer: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!application || application.project.organizationId !== session.user.id) {
//       return NextResponse.json(
//         { error: "Invalid application" },
//         { status: 403 }
//       );
//     }

//     if (application.status !== "PENDING") {
//       return NextResponse.json(
//         { error: "Application already handled" },
//         { status: 409 }
//       );
//     }

//     const updatedApplication = await prisma.$transaction(async (tx) => {
//       const updated = await tx.application.update({
//         where: { id: applicationId },
//         data: { status: "AWAITING_PAYMENT" },
//         include: {
//           volunteer: true,
//           project: true,
//         },
//       });

//       await tx.application.updateMany({
//         where: {
//           projectId: application.projectId,
//           id: { not: applicationId },
//           status: "PENDING",
//         },
//         data: { status: "REJECTED" },
//       });

//       const funding = await tx.projectFunding.findUnique({
//         where: { projectId: application.projectId },
//       });

//       if (!funding) {
//         const stipendAmount = application.project.stipendAmount;
//         const platformFee = Math.round(stipendAmount * 0.18);
//         const volunteerAmount = stipendAmount - platformFee;

//         await tx.projectFunding.create({
//           data: {
//             projectId: application.projectId,
//             organizationId: session.user.id,
//             volunteerId: application.volunteerId,
//             stipendAmount,
//             platformFee,
//             volunteerAmount,
//             status: "UNPAID",
//           },
//         });
//       } else {
//         await tx.projectFunding.update({
//           where: { id: funding.id },
//           data: {
//             volunteerId: application.volunteerId,
//           },
//         });
//       }

//       const chat =
//         (await tx.projectChat.findUnique({
//           where: { projectId: application.projectId },
//         })) ??
//         (await tx.projectChat.create({
//           data: { projectId: application.projectId },
//         }));

//       await tx.chatMessage.create({
//         data: {
//           chatId: chat.id,
//           content:
//             "✅ Volunteer selected. Payment is required before this project can start.",
//           isSystem: true,
//         },
//       });

//       await tx.notification.create({
//         data: {
//           userId: session.user.id,
//           type: "SYSTEM",
//           title: "Payment required",
//           message: `You selected ${application.volunteer.name ?? "a volunteer"} for "${application.project.title}". Fund the project to start work.`,
//           link: "/dashboard/organization",
//         },
//       });

//       return updated;
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Volunteer selected. Payment is required to start the project.",
//       application: updatedApplication,
//     });
//   } catch (error) {
//     console.error("Accept application error:", error);
//     return NextResponse.json(
//       { error: "Failed to accept application" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher-server";

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
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let applicationId = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      applicationId = body.applicationId;
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await req.formData();
      applicationId = String(formData.get("applicationId") || "");
    }

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        project: true,
        volunteer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!application || application.project.organizationId !== session.user.id) {
      return NextResponse.json(
        { error: "Invalid application" },
        { status: 403 }
      );
    }

    if (application.status !== "PENDING") {
      return NextResponse.json(
        { error: "Application already handled" },
        { status: 409 }
      );
    }

    const rejectedVolunteerIds: string[] = [];

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: { status: "AWAITING_PAYMENT" },
        include: {
          volunteer: true,
          project: true,
        },
      });

      const otherPendingApplications = await tx.application.findMany({
        where: {
          projectId: application.projectId,
          id: { not: applicationId },
          status: "PENDING",
        },
        select: {
          volunteerId: true,
        },
      });

      rejectedVolunteerIds.push(
        ...otherPendingApplications.map((item) => item.volunteerId)
      );

      await tx.application.updateMany({
        where: {
          projectId: application.projectId,
          id: { not: applicationId },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });

      const funding = await tx.projectFunding.findUnique({
        where: { projectId: application.projectId },
      });

      if (!funding) {
        const stipendAmount = application.project.stipendAmount;
        const platformFee = Math.round(stipendAmount * 0.18);
        const volunteerAmount = stipendAmount - platformFee;

        await tx.projectFunding.create({
          data: {
            projectId: application.projectId,
            organizationId: session.user.id,
            volunteerId: application.volunteerId,
            stipendAmount,
            platformFee,
            volunteerAmount,
            status: "UNPAID",
          },
        });
      } else {
        await tx.projectFunding.update({
          where: { id: funding.id },
          data: {
            volunteerId: application.volunteerId,
          },
        });
      }

      const chat =
        (await tx.projectChat.findUnique({
          where: { projectId: application.projectId },
        })) ??
        (await tx.projectChat.create({
          data: { projectId: application.projectId },
        }));

      await tx.chatMessage.create({
        data: {
          chatId: chat.id,
          content:
            "✅ Volunteer selected. Payment is required before this project can start.",
          isSystem: true,
        },
      });

      await tx.notification.create({
        data: {
          userId: application.volunteerId,
          type: "PAYMENT",
          title: "You were selected",
          message: `You were selected for "${application.project.title}". The organization needs to fund the project before work starts.`,
          link: `/dashboard/volunteer/projects/${application.projectId}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: session.user.id,
          type: "PAYMENT",
          title: "Payment required",
          message: `You selected ${
            application.volunteer.name ?? "a volunteer"
          } for "${application.project.title}". Fund the project to start work.`,
          link: "/dashboard/organization",
        },
      });

      for (const volunteerId of rejectedVolunteerIds) {
        await tx.notification.create({
          data: {
            userId: volunteerId,
            type: "APPLICATION",
            title: "Application not selected",
            message: `Your application for "${application.project.title}" was not selected this time.`,
            link: "/projects",
          },
        });
      }

      return updated;
    });

    await notifyUser(application.volunteerId);
    await notifyUser(session.user.id);

    await Promise.all(
      rejectedVolunteerIds.map((volunteerId) => notifyUser(volunteerId))
    );

    return NextResponse.json({
      success: true,
      message: "Volunteer selected. Payment is required to start the project.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Accept application error:", error);
    return NextResponse.json(
      { error: "Failed to accept application" },
      { status: 500 }
    );
  }
}