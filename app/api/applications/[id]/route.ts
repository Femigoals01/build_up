



// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { NotificationType } from "@prisma/client";

// export async function PATCH(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;

//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { status } = await req.json();

//     if (!["ACCEPTED", "REJECTED"].includes(status)) {
//       return NextResponse.json(
//         { error: "Invalid status" },
//         { status: 400 }
//       );
//     }

//     const updatedApplication = await prisma.application.update({
//       where: { id },
//       data: { status },
//       include: {
//         volunteer: true,
//         project: true,
//       },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: updatedApplication.volunteerId,
//         title:
//           status === "ACCEPTED"
//             ? "Application Accepted 🎉"
//             : "Application Update",
//         message:
//           status === "ACCEPTED"
//             ? `You’ve been accepted to work on "${updatedApplication.project.title}".`
//             : `Your application for "${updatedApplication.project.title}" was not selected.`,
//         type: NotificationType.APPLICATION, // ✅ REQUIRED
//         link: `/dashboard/projects`, // ✅ OPTIONAL BUT GOOD UX
//       },
//     });

//     return NextResponse.json(updatedApplication);
//   } catch (error) {
//     console.error("APPLICATION STATUS UPDATE FAILED:", error);

//     return NextResponse.json(
//       { error: "Failed to update status" },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NotificationType } from "@prisma/client";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { status } = await req.json();

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        volunteer: true,
        project: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.project.organizationId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (application.status !== "PENDING") {
      return NextResponse.json(
        { error: "Application already handled" },
        { status: 409 }
      );
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id },
        data: { status },
        include: {
          volunteer: true,
          project: true,
        },
      });

      if (status === "ACCEPTED") {
        // Move project out of public OPEN listing
        await tx.project.update({
          where: { id: updated.projectId },
          data: { status: "IN_PROGRESS" },
        });

        // Reject every other pending application for the same project
        await tx.application.updateMany({
          where: {
            projectId: updated.projectId,
            id: { not: updated.id },
            status: "PENDING",
          },
          data: { status: "REJECTED" },
        });

        // Ensure project chat exists
        const chat =
          (await tx.projectChat.findUnique({
            where: { projectId: updated.projectId },
          })) ??
          (await tx.projectChat.create({
            data: { projectId: updated.projectId },
          }));

        // System message for acceptance
        await tx.chatMessage.create({
          data: {
            chatId: chat.id,
            content: "✅ Volunteer has been accepted into the project.",
            isSystem: true,
          },
        });
      } else if (status === "REJECTED") {
        // Optional: add rejection system message if chat exists
        const chat = await tx.projectChat.findUnique({
          where: { projectId: updated.projectId },
        });

        if (chat) {
          await tx.chatMessage.create({
            data: {
              chatId: chat.id,
              content: "❌ Volunteer application was rejected.",
              isSystem: true,
            },
          });
        }
      }

      // Notify the selected volunteer
      await tx.notification.create({
        data: {
          userId: updated.volunteerId,
          title:
            status === "ACCEPTED"
              ? "Application Accepted 🎉"
              : "Application Update",
          message:
            status === "ACCEPTED"
              ? `You’ve been accepted to work on "${updated.project.title}".`
              : `Your application for "${updated.project.title}" was not selected.`,
          type: NotificationType.APPLICATION,
          link: `/dashboard/projects`,
        },
      });

      // Notify other volunteers automatically rejected because one was accepted
      if (status === "ACCEPTED") {
        const autoRejectedApplications = await tx.application.findMany({
          where: {
            projectId: updated.projectId,
            id: { not: updated.id },
            status: "REJECTED",
          },
          include: {
            volunteer: true,
            project: true,
          },
        });

        for (const rejectedApp of autoRejectedApplications) {
          await tx.notification.create({
            data: {
              userId: rejectedApp.volunteerId,
              title: "Application Update",
              message: `Your application for "${rejectedApp.project.title}" was not selected.`,
              type: NotificationType.APPLICATION,
              link: `/dashboard/projects`,
            },
          });
        }
      }

      return updated;
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("APPLICATION STATUS UPDATE FAILED:", error);

    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}