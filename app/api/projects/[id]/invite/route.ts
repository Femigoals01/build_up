



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

// export async function POST(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id: projectId } = await context.params;

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Invalid project id" },
//         { status: 400 }
//       );
//     }

//     const body = await req.json().catch(() => null);
//     const volunteerId = body?.volunteerId as string | undefined;

//     if (!volunteerId) {
//       return NextResponse.json(
//         { error: "Volunteer id is required" },
//         { status: 400 }
//       );
//     }

//     const project = await prisma.project.findUnique({
//       where: { id: projectId },
//       select: {
//         id: true,
//         title: true,
//         status: true,
//         organizationId: true,
//       },
//     });

//     if (!project) {
//       return NextResponse.json(
//         { error: "Project not found" },
//         { status: 404 }
//       );
//     }

//     if (project.organizationId !== session.user.id) {
//       return NextResponse.json(
//         { error: "You can only invite volunteers to your own project" },
//         { status: 403 }
//       );
//     }

//     if (project.status === "COMPLETED") {
//       return NextResponse.json(
//         { error: "Cannot invite volunteers to a completed project" },
//         { status: 400 }
//       );
//     }

//     const assignedVolunteer = await prisma.application.findFirst({
//       where: {
//         projectId,
//         status: {
//           in: ["ACCEPTED", "COMPLETED"],
//         },
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (assignedVolunteer) {
//       return NextResponse.json(
//         {
//           error:
//             "This project already has an assigned volunteer. Only one volunteer is allowed per project.",
//         },
//         { status: 400 }
//       );
//     }

//     const volunteer = await prisma.user.findUnique({
//       where: { id: volunteerId },
//       select: {
//         id: true,
//         role: true,
//       },
//     });

//     if (!volunteer || volunteer.role !== "VOLUNTEER") {
//       return NextResponse.json(
//         { error: "Volunteer not found" },
//         { status: 404 }
//       );
//     }

//     const existing = await prisma.application.findFirst({
//       where: {
//         volunteerId,
//         projectId,
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "This volunteer has already been added or invited to the project" },
//         { status: 400 }
//       );
//     }

//     const application = await prisma.application.create({
//       data: {
//         volunteerId,
//         projectId,
//         status: "PENDING",
//         source: "ORGANIZATION",
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Volunteer invited successfully",
//         application,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Invite volunteer error:", error);

//     return NextResponse.json(
//       { error: "Something went wrong while inviting the volunteer" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { sendEmail } from "@/lib/sendEmail";

export const runtime = "nodejs";

async function notifyUser(userId: string) {
  try {
    await pusherServer.trigger(
      `private-user-notifications-${userId}`,
      "notification:new",
      { userId }
    );
  } catch (error) {
    console.error("Invite notification pusher error:", error);
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await context.params;

    const body = await req.json().catch(() => null);
    const volunteerId = body?.volunteerId as string | undefined;

    if (!projectId || !volunteerId) {
      return NextResponse.json(
        { error: "Project id and volunteer id are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        status: true,
        organizationId: true,
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.organizationId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only invite volunteers to your own project" },
        { status: 403 }
      );
    }

    if (project.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot invite volunteers to a completed project" },
        { status: 400 }
      );
    }

    const assignedVolunteer = await prisma.application.findFirst({
      where: {
        projectId,
        status: {
          in: ["ACCEPTED", "COMPLETED", "AWAITING_PAYMENT"],
        },
      },
      select: { id: true },
    });

    if (assignedVolunteer) {
      return NextResponse.json(
        {
          error:
            "This project already has an assigned or selected volunteer. Only one volunteer is allowed per project.",
        },
        { status: 400 }
      );
    }

    const volunteer = await prisma.user.findUnique({
      where: { id: volunteerId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!volunteer || volunteer.role !== "VOLUNTEER") {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.application.findFirst({
      where: {
        volunteerId,
        projectId,
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This volunteer has already been added or invited to the project" },
        { status: 400 }
      );
    }

    const application = await prisma.$transaction(async (tx) => {
      const createdApplication = await tx.application.create({
        data: {
          volunteerId,
          projectId,
          status: "PENDING",
          source: "ORGANIZATION",
        },
      });

      await tx.notification.create({
        data: {
          userId: volunteerId,
          type: "APPLICATION",
          title: "New project invite",
          message: `${project.organization.name} invited you to work on "${project.title}".`,
          link: "/dashboard/volunteer",
        },
      });

      return createdApplication;
    });

    await notifyUser(volunteerId);

    await sendEmail({
      to: volunteer.email,
      subject: `You have a new BuildUp project invite`,
      text: `${project.organization.name} invited you to work on "${project.title}". Log in to BuildUp to accept or decline the invite.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;">
          <h2 style="margin: 0 0 12px; color: #0f172a;">New project invite</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${volunteer.name || "there"},
          </p>
          <p style="color: #475569; line-height: 1.6;">
            <strong>${project.organization.name}</strong> invited you to work on:
          </p>
          <p style="font-size: 18px; font-weight: 700; color: #2563eb;">
            ${project.title}
          </p>
          <p style="color: #475569; line-height: 1.6;">
            Log in to BuildUp to accept or decline this invite.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/volunteer"
             style="display: inline-block; margin-top: 16px; background: #2563eb; color: white; padding: 12px 18px; border-radius: 12px; text-decoration: none; font-weight: 700;">
            Open BuildUp
          </a>
        </div>
      `,
    });

    return NextResponse.json(
      {
        message: "Volunteer invited successfully",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invite volunteer error:", error);

    return NextResponse.json(
      { error: "Something went wrong while inviting the volunteer" },
      { status: 500 }
    );
  }
}