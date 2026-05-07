


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { applicationId } = await req.json();

//   const application = await prisma.application.findUnique({
//     where: { id: applicationId },
//     include: { project: true },
//   });

//   if (
//     !application ||
//     application.project.organizationId !== session.user.id
//   ) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   await prisma.application.update({
//     where: { id: applicationId },
//     data: { status: "ACCEPTED" },
//   });

//   /* Ensure chat exists */
//   const chat =
//     (await prisma.projectChat.findUnique({
//       where: { projectId: application.projectId },
//     })) ??
//     (await prisma.projectChat.create({
//       data: { projectId: application.projectId },
//     }));

//   await prisma.chatMessage.create({
//     data: {
//       chatId: chat.id,
//       senderId: session.user.id,
//       content: "✅ Organization accepted the project application.",
//     },
//   });

//   return NextResponse.json({ success: true });
// }




import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId } = await req.json();

  if (!applicationId) {
    return NextResponse.json(
      { error: "Application ID is required" },
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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (application.status !== "PENDING") {
    return NextResponse.json(
      { error: "Application already handled" },
      { status: 409 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedApplication = await tx.application.update({
      where: { id: applicationId },
      data: { status: "AWAITING_PAYMENT" },
    });

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
        senderId: session.user.id,
        content:
          "✅ Volunteer selected. Payment is required before this project can start.",
        isSystem: true,
      },
    });

    await tx.notification.create({
      data: {
        userId: session.user.id,
        type: "SYSTEM",
        title: "Payment required",
        message: `You selected a volunteer for "${application.project.title}". Fund the project to start work.`,
        link: "/dashboard/organization",
      },
    });

    return updatedApplication;
  });

  return NextResponse.json({
    success: true,
    message: "Volunteer selected. Payment is required to start the project.",
    application: result,
  });
}