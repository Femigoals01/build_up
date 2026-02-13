

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "VOLUNTEER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { mentorId, projectId } = await req.json();

//     // 🔴 HARD VALIDATION
//     if (!mentorId || !projectId) {
//       return NextResponse.json(
//         { error: "mentorId and projectId are required" },
//         { status: 400 }
//       );
//     }

//     // ✅ Ensure mentor exists & is approved
//     const mentor = await prisma.user.findFirst({
//       where: {
//         id: mentorId,
//         role: "MENTOR",
//         mentorStatus: "APPROVED",
//       },
//     });

//     if (!mentor) {
//       return NextResponse.json(
//         { error: "Mentor not approved" },
//         { status: 403 }
//       );
//     }

//     // ✅ Ensure volunteer belongs to project
//     const application = await prisma.application.findFirst({
//       where: {
//         projectId,
//         volunteerId: session.user.id,
//         status: "ACCEPTED",
//       },
//     });

//     if (!application) {
//       return NextResponse.json(
//         { error: "You are not accepted into this project" },
//         { status: 403 }
//       );
//     }

//     // ✅ Prevent duplicates
//     const existing = await prisma.mentorshipRequest.findFirst({
//       where: {
//         projectId,
//         mentorId,
//         volunteerId: session.user.id,
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "Request already sent" },
//         { status: 409 }
//       );
//     }

//     // ✅ CREATE REQUEST
//     const request = await prisma.mentorshipRequest.create({
//       data: {
//         projectId,
//         mentorId,
//         volunteerId: session.user.id,
//         senderRole: "VOLUNTEER",
//       },
//     });

//     // 🔔 Notify mentor
//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "New Mentorship Request",
//         message: "A volunteer has requested your mentorship.",
//         type: "SYSTEM",
//         link: "/dashboard/mentor/requests",
//       },
//     });

//     return NextResponse.json(request, { status: 201 });
//   } catch (error) {
//     console.error("Mentorship request error:", error);
//     return NextResponse.json(
//       { error: "Failed to send request" },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* =========================
   GET — Mentor Inbox
========================= */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.mentorshipRequest.findMany({
    where: {
      mentorId: session.user.id,
      status: "PENDING",
    },
    include: {
      volunteer: {
        select: { id: true, name: true, email: true },
      },
      project: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}

/* =========================
   POST — Volunteer Request
========================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "VOLUNTEER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mentorId, projectId } = await req.json();

    if (!mentorId || !projectId) {
      return NextResponse.json(
        { error: "mentorId and projectId are required" },
        { status: 400 }
      );
    }

    // ✅ Mentor must be approved
    const mentor = await prisma.user.findFirst({
      where: {
        id: mentorId,
        role: "MENTOR",
        mentorStatus: "APPROVED",
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { error: "Mentor not approved" },
        { status: 403 }
      );
    }

    // ✅ Volunteer must be accepted into project
    const application = await prisma.application.findFirst({
      where: {
        projectId,
        volunteerId: session.user.id,
        status: "ACCEPTED",
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "You are not accepted into this project" },
        { status: 403 }
      );
    }

    // ✅ Prevent duplicates
    const existing = await prisma.mentorshipRequest.findFirst({
      where: {
        projectId,
        mentorId,
        volunteerId: session.user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Request already sent" },
        { status: 409 }
      );
    }

    const request = await prisma.mentorshipRequest.create({
      data: {
        projectId,
        mentorId,
        volunteerId: session.user.id,
        senderRole: "VOLUNTEER",
      },
    });

    await prisma.notification.create({
      data: {
        userId: mentorId,
        title: "New Mentorship Request",
        message: "A volunteer has requested your mentorship.",
        type: "SYSTEM",
        link: "/dashboard/mentor/requests",
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("Mentorship request error:", error);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}
