

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
//         status: true,
//         source: true,
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
//         volunteer: {
//           select: {
//             name: true,
//             email: true,
//           },
//         },
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
//         status: true,
//         source: true,
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

export const runtime = "nodejs";

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

    if (!projectId) {
      return NextResponse.json(
        { error: "Invalid project id" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const volunteerId = body?.volunteerId as string | undefined;

    if (!volunteerId) {
      return NextResponse.json(
        { error: "Volunteer id is required" },
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
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
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
          in: ["ACCEPTED", "COMPLETED"],
        },
      },
      select: {
        id: true,
      },
    });

    if (assignedVolunteer) {
      return NextResponse.json(
        {
          error:
            "This project already has an assigned volunteer. Only one volunteer is allowed per project.",
        },
        { status: 400 }
      );
    }

    const volunteer = await prisma.user.findUnique({
      where: { id: volunteerId },
      select: {
        id: true,
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
      select: {
        id: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This volunteer has already been added or invited to the project" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        volunteerId,
        projectId,
        status: "PENDING",
        source: "ORGANIZATION",
      },
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