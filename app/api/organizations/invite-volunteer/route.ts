


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const formData = await req.formData();

//     const projectId = String(formData.get("projectId") || "").trim();
//     const volunteerId = String(formData.get("volunteerId") || "").trim();
//     const username = String(formData.get("username") || "").trim();

//     if (!projectId || !volunteerId || !username) {
//       return NextResponse.redirect(
//         new URL(
//           `/dashboard/organization/invite?username=${encodeURIComponent(
//             username || ""
//           )}&error=missing-data`,
//           req.url
//         )
//       );
//     }

//     const project = await prisma.project.findFirst({
//       where: {
//         id: projectId,
//         organizationId: session.user.id,
//         status: {
//           in: ["OPEN", "IN_PROGRESS"],
//         },
//       },
//       select: {
//         id: true,
//         title: true,
//       },
//     });

//     if (!project) {
//       return NextResponse.redirect(
//         new URL(
//           `/dashboard/organization/invite?username=${encodeURIComponent(
//             username
//           )}&error=project-not-found`,
//           req.url
//         )
//       );
//     }

//     const volunteer = await prisma.user.findFirst({
//       where: {
//         id: volunteerId,
//         username,
//         role: "VOLUNTEER",
//       },
//       select: {
//         id: true,
//         username: true,
//       },
//     });

//     if (!volunteer) {
//       return NextResponse.redirect(
//         new URL(
//           `/dashboard/organization/invite?username=${encodeURIComponent(
//             username
//           )}&error=volunteer-not-found`,
//           req.url
//         )
//       );
//     }

//     const existingApplication = await prisma.application.findFirst({
//       where: {
//         projectId: project.id,
//         volunteerId: volunteer.id,
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (existingApplication) {
//       return NextResponse.redirect(
//         new URL(
//           `/dashboard/organization/invite?username=${encodeURIComponent(
//             volunteer.username
//           )}&error=already-linked`,
//           req.url
//         )
//       );
//     }

//     await prisma.application.create({
//       data: {
//         projectId: project.id,
//         volunteerId: volunteer.id,
//         status: "PENDING",
//         source: "ORGANIZATION",
//       },
//     });

//     return NextResponse.redirect(
//       new URL(
//         `/dashboard/organization/invite?username=${encodeURIComponent(
//           volunteer.username
//         )}&success=invite-sent`,
//         req.url
//       )
//     );
//   } catch (error) {
//     console.error("Invite volunteer error:", error);

//     return NextResponse.redirect(
//       new URL(`/dashboard/organization?error=failed`, req.url)
//     );
//   }
// }







import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export const runtime = "nodejs";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendInviteEmail(params: {
  to: string;
  volunteerName: string;
  organizationName: string;
  projectTitle: string;
  username: string;
}) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.SMTP_FROM
  ) {
    console.warn("Invite email skipped: SMTP env vars missing.");
    return;
  }

  const transporter = getTransporter();

  const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${params.username}`;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects?tab=PENDING`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: params.to,
    subject: `New BuildUp project invitation from ${params.organizationName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">You have received a new invitation</h2>
        <p>Hi ${params.volunteerName || "there"},</p>
        <p>
          <strong>${params.organizationName}</strong> invited you to join
          <strong>${params.projectTitle}</strong> on BuildUp.
        </p>
        <p>
          You can review and respond to the invitation from your dashboard.
        </p>
        <p style="margin: 20px 0;">
          <a href="${dashboardUrl}" style="background:#2563eb;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:600;">
            Review Invitation
          </a>
        </p>
        <p>
          Public portfolio: <a href="${portfolioUrl}">${portfolioUrl}</a>
        </p>
        <p style="color:#475569;">Build real experience. Not just certificates.</p>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const projectId = String(formData.get("projectId") || "").trim();
    const volunteerId = String(formData.get("volunteerId") || "").trim();
    const username = String(formData.get("username") || "").trim();

    if (!projectId || !volunteerId || !username) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/organization/invite?username=${encodeURIComponent(
            username || ""
          )}&error=missing-data`,
          req.url
        )
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: session.user.id,
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!project) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/organization/invite?username=${encodeURIComponent(
            username
          )}&error=project-not-found`,
          req.url
        )
      );
    }

    const volunteer = await prisma.user.findFirst({
      where: {
        id: volunteerId,
        username,
        role: "VOLUNTEER",
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
      },
    });

    if (!volunteer) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/organization/invite?username=${encodeURIComponent(
            username
          )}&error=volunteer-not-found`,
          req.url
        )
      );
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        projectId: project.id,
        volunteerId: volunteer.id,
      },
      select: {
        id: true,
      },
    });

    if (existingApplication) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/organization/invite?username=${encodeURIComponent(
            volunteer.username
          )}&error=already-linked`,
          req.url
        )
      );
    }

    await prisma.application.create({
      data: {
        projectId: project.id,
        volunteerId: volunteer.id,
        status: "PENDING",
        source: "ORGANIZATION",
      },
    });

//     await prisma.notification.create({
//   data: {
//     userId: volunteer.id,
//     type: "INVITE",
//     title: "Invitation received",
//     message: `${session.user.name} invited you to join "${project.title}"`,
//     link: `/dashboard/projects?tab=PENDING`,
//   },
// });


await prisma.notification.create({
  data: {
    userId: volunteer.id,
    type: "APPLICATION",
    title: "Invitation received",
    message: `${session.user.name || "An organization"} invited you to join "${project.title}".`,
    link: "/dashboard/projects?tab=PENDING",
  },
});


// await pusherServer.trigger("private-user-notifications", "notification:new", {
//   userId: volunteer.id,
// });

await pusherServer.trigger(
  `private-user-notifications-${volunteer.id}`,
  "notification:new",
  {
    userId: volunteer.id,
  }
);

    try {
      await sendInviteEmail({
        to: volunteer.email,
        volunteerName: volunteer.name || volunteer.username,
        organizationName: session.user.name || "An organization",
        projectTitle: project.title,
        username: volunteer.username,
      });
    } catch (mailError) {
      console.error("Invite email send error:", mailError);
    }

    return NextResponse.redirect(
      new URL(
        `/dashboard/organization/invite?username=${encodeURIComponent(
          volunteer.username
        )}&success=invite-sent`,
        req.url
      )
    );
  } catch (error) {
    console.error("Invite volunteer error:", error);

    return NextResponse.redirect(
      new URL(`/dashboard/organization?error=failed`, req.url)
    );
  }
}