




// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { pusherServer } from "@/lib/pusher-server";

// export const runtime = "nodejs";

// export async function POST(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id: applicationId } = await context.params;
//     const body = await req.json().catch(() => null);
//     const action = String(body?.action || "").trim();

//     if (!applicationId || !["accept", "decline"].includes(action)) {
//       return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//     }

//     const application = await prisma.application.findFirst({
//       where: {
//         id: applicationId,
//         volunteerId: session.user.id,
//         status: "PENDING",
//         source: "ORGANIZATION",
//       },
//       include: {
//         project: {
//           select: {
//             id: true,
//             title: true,
//             organizationId: true,
//             stipendAmount: true,
//           },
//         },
//         volunteer: {
//           select: {
//             name: true,
//             username: true,
//           },
//         },
//       },
//     });

//     if (!application) {
//       return NextResponse.json(
//         { error: "Invite not found or no longer pending" },
//         { status: 404 }
//       );
//     }

//     const volunteerDisplayName =
//       application.volunteer.name?.trim() ||
//       application.volunteer.username ||
//       "A volunteer";

//     if (action === "accept") {
//       const updated = await prisma.$transaction(async (tx) => {
//         const acceptedApplication = await tx.application.update({
//           where: { id: applicationId },
//           data: { status: "AWAITING_PAYMENT" },
//         });

//         await tx.application.updateMany({
//           where: {
//             projectId: application.project.id,
//             id: { not: applicationId },
//             status: "PENDING",
//           },
//           data: { status: "REJECTED" },
//         });

//         const funding = await tx.projectFunding.findUnique({
//           where: { projectId: application.project.id },
//         });

//         if (!funding) {
//           const stipendAmount = application.project.stipendAmount;
//           const platformFee = Math.round(stipendAmount * 0.18);
//           const volunteerAmount = stipendAmount - platformFee;

//           await tx.projectFunding.create({
//             data: {
//               projectId: application.project.id,
//               organizationId: application.project.organizationId,
//               volunteerId: session.user.id,
//               stipendAmount,
//               platformFee,
//               volunteerAmount,
//               status: "UNPAID",
//             },
//           });
//         } else {
//           await tx.projectFunding.update({
//             where: { id: funding.id },
//             data: {
//               volunteerId: session.user.id,
//             },
//           });
//         }

//         const chat =
//           (await tx.projectChat.findUnique({
//             where: { projectId: application.project.id },
//           })) ??
//           (await tx.projectChat.create({
//             data: { projectId: application.project.id },
//           }));

//         await tx.chatMessage.create({
//           data: {
//             chatId: chat.id,
//             content:
//               "✅ Volunteer accepted the invite. Payment is required before this project can start.",
//             isSystem: true,
//           },
//         });

//         await tx.notification.create({
//           data: {
//             userId: application.project.organizationId,
//             type: "APPLICATION",
//             title: "Invite accepted — payment required",
//             message: `${volunteerDisplayName} accepted your invite for "${application.project.title}". Fund the project to start work.`,
//             link: "/dashboard/organization",
//           },
//         });

//         return acceptedApplication;
//       });

//       await pusherServer.trigger(
//         `private-user-notifications-${application.project.organizationId}`,
//         "notification:new",
//         {
//           userId: application.project.organizationId,
//         }
//       );

//       return NextResponse.json({
//         message:
//           "Invite accepted. Organization must fund the project before work starts.",
//         application: updated,
//       });
//     }

//     await prisma.notification.create({
//       data: {
//         userId: application.project.organizationId,
//         type: "APPLICATION",
//         title: "Invite declined",
//         message: `${volunteerDisplayName} declined your invite for "${application.project.title}".`,
//         link: `/dashboard/organization/projects/${application.project.id}`,
//       },
//     });

//     await pusherServer.trigger(
//       `private-user-notifications-${application.project.organizationId}`,
//       "notification:new",
//       {
//         userId: application.project.organizationId,
//       }
//     );

//     await prisma.application.delete({
//       where: { id: applicationId },
//     });

//     return NextResponse.json({
//       message: "Invite declined",
//     });
//   } catch (error) {
//     console.error("Invite response error:", error);

//     return NextResponse.json(
//       { error: "Something went wrong while responding to the invite." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export const runtime = "nodejs";

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
            stipendAmount: true,
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
      const alreadySelectedApplication = await prisma.application.findFirst({
        where: {
          projectId: application.project.id,
          id: {
            not: applicationId,
          },
          status: {
            in: ["AWAITING_PAYMENT", "ACCEPTED", "COMPLETED"],
          },
        },
        select: {
          id: true,
        },
      });

      if (alreadySelectedApplication) {
        return NextResponse.json(
          {
            error:
              "This project has already been awarded to another volunteer.",
          },
          { status: 409 }
        );
      }

      const rejectedVolunteerIds: string[] = [];

      const updated = await prisma.$transaction(async (tx) => {
        const otherPendingApplications = await tx.application.findMany({
          where: {
            projectId: application.project.id,
            id: {
              not: applicationId,
            },
            status: "PENDING",
          },
          select: {
            volunteerId: true,
          },
        });

        rejectedVolunteerIds.push(
          ...otherPendingApplications.map((item) => item.volunteerId)
        );

        const acceptedApplication = await tx.application.update({
          where: { id: applicationId },
          data: { status: "AWAITING_PAYMENT" },
        });

        if (rejectedVolunteerIds.length > 0) {
          await tx.application.updateMany({
            where: {
              projectId: application.project.id,
              id: {
                not: applicationId,
              },
              status: "PENDING",
            },
            data: { status: "REJECTED" },
          });

          await tx.notification.createMany({
            data: rejectedVolunteerIds.map((volunteerId) => ({
              userId: volunteerId,
              type: "APPLICATION",
              title: "Project awarded to another volunteer",
              message: `The project "${application.project.title}" has been awarded to another volunteer. Thank you for your interest — keep checking BuildUp for more opportunities that match your skills.`,
              link: "/projects",
            })),
          });
        }

        const funding = await tx.projectFunding.findUnique({
          where: { projectId: application.project.id },
        });

        if (!funding) {
          const stipendAmount = application.project.stipendAmount;
          const platformFee = Math.round(stipendAmount * 0.18);
          const volunteerAmount = stipendAmount - platformFee;

          await tx.projectFunding.create({
            data: {
              projectId: application.project.id,
              organizationId: application.project.organizationId,
              volunteerId: session.user.id,
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
              volunteerId: session.user.id,
            },
          });
        }

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
            content:
              "✅ Volunteer accepted the invite. Payment is required before this project can start.",
            isSystem: true,
          },
        });

        await tx.notification.create({
          data: {
            userId: application.project.organizationId,
            type: "APPLICATION",
            title: "Invite accepted — payment required",
            message: `${volunteerDisplayName} accepted your invite for "${application.project.title}". Fund the project to start work.`,
            link: "/dashboard/organization",
          },
        });

        return acceptedApplication;
      });

      await Promise.all([
        notifyUser(application.project.organizationId),
        ...rejectedVolunteerIds.map((volunteerId) => notifyUser(volunteerId)),
      ]);

      return NextResponse.json({
        success: true,
        message:
          "Invite accepted. Other pending applicants have been notified. Organization must fund the project before work starts.",
        application: updated,
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.notification.create({
        data: {
          userId: application.project.organizationId,
          type: "APPLICATION",
          title: "Invite declined",
          message: `${volunteerDisplayName} declined your invite for "${application.project.title}".`,
          link: `/dashboard/organization/projects/${application.project.id}`,
        },
      });

      await tx.application.delete({
        where: { id: applicationId },
      });
    });

    await notifyUser(application.project.organizationId);

    return NextResponse.json({
      success: true,
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