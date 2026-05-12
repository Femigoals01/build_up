




// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { pusherServer } from "@/lib/pusher-server";

// async function notifyUser(userId: string) {
//   try {
//     await pusherServer.trigger(
//       `private-user-notifications-${userId}`,
//       "notification:new",
//       { userId }
//     );
//   } catch (error) {
//     console.error("Failed to push notification:", error);
//   }
// }

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

//     const rejectedVolunteerIds: string[] = [];

//     const updatedApplication = await prisma.$transaction(async (tx) => {
//       const updated = await tx.application.update({
//         where: { id: applicationId },
//         data: { status: "AWAITING_PAYMENT" },
//         include: {
//           volunteer: true,
//           project: true,
//         },
//       });

//       const otherPendingApplications = await tx.application.findMany({
//         where: {
//           projectId: application.projectId,
//           id: { not: applicationId },
//           status: "PENDING",
//         },
//         select: {
//           volunteerId: true,
//         },
//       });

//       rejectedVolunteerIds.push(
//         ...otherPendingApplications.map((item) => item.volunteerId)
//       );

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
//           userId: application.volunteerId,
//           type: "PAYMENT",
//           title: "You were selected",
//           message: `You were selected for "${application.project.title}". The organization needs to fund the project before work starts.`,
//           link: `/dashboard/volunteer/projects/${application.projectId}`,
//         },
//       });

//       await tx.notification.create({
//         data: {
//           userId: session.user.id,
//           type: "PAYMENT",
//           title: "Payment required",
//           message: `You selected ${
//             application.volunteer.name ?? "a volunteer"
//           } for "${application.project.title}". Fund the project to start work.`,
//           link: "/dashboard/organization",
//         },
//       });

//       for (const volunteerId of rejectedVolunteerIds) {
//         await tx.notification.create({
//           data: {
//             userId: volunteerId,
//             type: "APPLICATION",
//             title: "Application not selected",
//             message: `Your application for "${application.project.title}" was not selected this time.`,
//             link: "/projects",
//           },
//         });
//       }

//       return updated;
//     });

//     await notifyUser(application.volunteerId);
//     await notifyUser(session.user.id);

//     await Promise.all(
//       rejectedVolunteerIds.map((volunteerId) => notifyUser(volunteerId))
//     );

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
import { sendEmail } from "@/lib/sendEmail";

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

    await sendEmail({
      to: application.volunteer.email,
      subject: "You were selected for a BuildUp project",
      text: `Congratulations! You were selected for "${application.project.title}". The organization needs to fund the project before work begins.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #2563eb;">🎉 You were selected</h2>

          <p style="line-height: 1.7; color: #475569;">
            Hi ${application.volunteer.name || "there"},
          </p>

          <p style="line-height: 1.7; color: #475569;">
            Congratulations! You were selected for:
          </p>

          <div style="background: #eff6ff; padding: 16px; border-radius: 16px; margin: 16px 0;">
            <strong style="font-size: 18px; color: #1e3a8a;">
              ${application.project.title}
            </strong>
          </div>

          <p style="line-height: 1.7; color: #475569;">
            The organization must now fund the project before work officially starts.
          </p>

          <a
            href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/volunteer"
            style="display:inline-block;margin-top:20px;background:#2563eb;color:white;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:bold;"
          >
            Open BuildUp
          </a>
        </div>
      `,
    });

    if (rejectedVolunteerIds.length > 0) {
      const rejectedVolunteers = await prisma.user.findMany({
        where: {
          id: {
            in: rejectedVolunteerIds,
          },
        },
        select: {
          email: true,
          name: true,
        },
      });

      await Promise.all(
        rejectedVolunteers.map((volunteer) =>
          sendEmail({
            to: volunteer.email,
            subject: "BuildUp project application update",
            text: `Your application for "${application.project.title}" was not selected this time.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #0f172a;">Application update</h2>

                <p style="line-height: 1.7; color: #475569;">
                  Hi ${volunteer.name || "there"},
                </p>

                <p style="line-height: 1.7; color: #475569;">
                  Your application for:
                </p>

                <div style="background:#f8fafc;padding:16px;border-radius:16px;margin:16px 0;">
                  <strong style="font-size:18px;color:#1e293b;">
                    ${application.project.title}
                  </strong>
                </div>

                <p style="line-height: 1.7; color: #475569;">
                  was not selected this time.
                </p>

                <p style="line-height: 1.7; color: #475569;">
                  Keep applying to opportunities that match your skills — more projects are coming.
                </p>

                <a
                  href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/projects"
                  style="display:inline-block;margin-top:20px;background:#2563eb;color:white;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:bold;"
                >
                  Explore Projects
                </a>
              </div>
            `,
          })
        )
      );
    }

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