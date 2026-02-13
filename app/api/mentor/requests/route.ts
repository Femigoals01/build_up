

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "MENTOR") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const requests = await prisma.mentorshipRequest.findMany({
//     where: {
//       mentorId: session.user.id,
//       status: "PENDING",
//     },
//     include: {
//       volunteer: {
//         select: { id: true, name: true, email: true },
//       },
//       project: {
//         select: { id: true, title: true },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   return NextResponse.json(requests);
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* =========================
   GET → Mentor Inbox
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
   POST → Create Request
   ========================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "VOLUNTEER" &&
        session.user.role !== "MENTOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mentorId, projectId } = await req.json();

    if (!mentorId || !projectId) {
      return NextResponse.json(
        { error: "mentorId and projectId required" },
        { status: 400 }
      );
    }

    const request = await prisma.mentorshipRequest.create({
      data: {
        mentorId,
        projectId,
        volunteerId:
          session.user.role === "VOLUNTEER"
            ? session.user.id
            : null,
        senderRole:
          session.user.role === "VOLUNTEER"
            ? "VOLUNTEER"
            : "MENTOR",
      },
    });

    await prisma.notification.create({
      data: {
        userId: mentorId,
        title: "New Mentorship Request",
        message: "You received a mentorship request.",
        type: "SYSTEM",
        link: "/dashboard/mentor/requests",
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("Mentorship request error:", error);
    return NextResponse.json(
      { error: "Failed to create mentorship request" },
      { status: 500 }
    );
  }
}
