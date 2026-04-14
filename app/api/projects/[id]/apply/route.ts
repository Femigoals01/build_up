


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function POST(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // ✅ FIX: unwrap params
//   const { id: projectId } = await context.params;

//   // ✅ SAFETY: ensure IDs exist
//   if (!session.user.id || !projectId) {
//     return NextResponse.json(
//       { error: "Invalid session or project" },
//       { status: 400 }
//     );
//   }

//   // ✅ Ensure project exists
//   const project = await prisma.project.findUnique({
//     where: { id: projectId },
//   });

//   if (!project) {
//     return NextResponse.json(
//       { error: "Project not found" },
//       { status: 404 }
//     );
//   }

//   // ✅ Prevent duplicate applications
//   const existing = await prisma.application.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//     },
//   });

//   if (existing) {
//     return NextResponse.json(
//       { error: "Already applied" },
//       { status: 400 }
//     );
//   }

//   // ✅ CREATE APPLICATION
//   const application = await prisma.application.create({
//     data: {
//       volunteerId: session.user.id,
//       projectId,
//     },
//   });

//   return NextResponse.json({
//     message: "Application submitted",
//     application,
//   });
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

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
        status: true,
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

    const application = await prisma.application.create({
      data: {
        volunteerId: session.user.id,
        projectId,
        status: "PENDING",
        source: "VOLUNTEER",
      },
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