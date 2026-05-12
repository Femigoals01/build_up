






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

//     if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id: projectId } = await context.params;

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Invalid project id" },
//         { status: 400 }
//       );
//     }

//     const project = await prisma.project.findUnique({
//       where: { id: projectId },
//       select: {
//         id: true,
//         status: true,
//       },
//     });

//     if (!project) {
//       return NextResponse.json(
//         { error: "Project not found" },
//         { status: 404 }
//       );
//     }

//     if (project.status !== "OPEN") {
//       return NextResponse.json(
//         { error: "This project is not open for applications" },
//         { status: 400 }
//       );
//     }

//     const existing = await prisma.application.findFirst({
//       where: {
//         volunteerId: session.user.id,
//         projectId,
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "Already applied" },
//         { status: 400 }
//       );
//     }

//     const application = await prisma.application.create({
//       data: {
//         volunteerId: session.user.id,
//         projectId,
//         status: "PENDING",
//         source: "VOLUNTEER",
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Application submitted",
//         application,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Apply to project error:", error);

//     return NextResponse.json(
//       { error: "Something went wrong while applying" },
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
    console.error("Application notification pusher error:", error);
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await context.params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Invalid project id" },
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
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.status !== "OPEN") {
      return NextResponse.json(
        { error: "This project is not open for applications" },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findFirst({
      where: {
        volunteerId: session.user.id,
        projectId,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already applied" },
        { status: 400 }
      );
    }

    const volunteer = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        username: true,
      },
    });

    const application = await prisma.$transaction(async (tx) => {
      const createdApplication = await tx.application.create({
        data: {
          volunteerId: session.user.id,
          projectId,
          status: "PENDING",
          source: "VOLUNTEER",
        },
      });

      await tx.notification.create({
        data: {
          userId: project.organizationId,
          type: "APPLICATION",
          title: "New project application",
          message: `${volunteer?.name || "A volunteer"} applied to "${project.title}".`,
          link: "/dashboard/organization",
        },
      });

      await tx.notification.create({
        data: {
          userId: session.user.id,
          type: "APPLICATION",
          title: "Application submitted",
          message: `Your application for "${project.title}" has been submitted successfully.`,
          link: `/dashboard/volunteer/projects/${project.id}`,
        },
      });

      return createdApplication;
    });

    await Promise.all([
      notifyUser(project.organizationId),
      notifyUser(session.user.id),
    ]);

    await sendEmail({
      to: project.organization.email,
      subject: "New volunteer application on BuildUp",
      text: `${volunteer?.name || "A volunteer"} applied to "${project.title}". Log in to BuildUp to review the application.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;">
          <h2 style="color:#2563eb;">New project application</h2>

          <p style="line-height:1.7;color:#475569;">
            Hi ${project.organization.name || "there"},
          </p>

          <p style="line-height:1.7;color:#475569;">
            <strong>${volunteer?.name || "A volunteer"}</strong> just applied to your project:
          </p>

          <div style="background:#eff6ff;padding:16px;border-radius:16px;margin:16px 0;">
            <strong style="font-size:18px;color:#1e3a8a;">
              ${project.title}
            </strong>
          </div>

          <p style="line-height:1.7;color:#475569;">
            Log in to BuildUp to review the application and select the best fit.
          </p>

          <a
            href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/organization"
            style="display:inline-block;margin-top:20px;background:#2563eb;color:white;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:bold;"
          >
            Review Application
          </a>
        </div>
      `,
    });

    return NextResponse.json(
      {
        message: "Application submitted",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply to project error:", error);

    return NextResponse.json(
      { error: "Something went wrong while applying" },
      { status: 500 }
    );
  }
}