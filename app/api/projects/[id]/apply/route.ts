import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ FIX: unwrap params
  const { id: projectId } = await context.params;

  // ✅ SAFETY: ensure IDs exist
  if (!session.user.id || !projectId) {
    return NextResponse.json(
      { error: "Invalid session or project" },
      { status: 400 }
    );
  }

  // ✅ Ensure project exists
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  // ✅ Prevent duplicate applications
  const existing = await prisma.application.findFirst({
    where: {
      volunteerId: session.user.id,
      projectId,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already applied" },
      { status: 400 }
    );
  }

  // ✅ CREATE APPLICATION
  const application = await prisma.application.create({
    data: {
      volunteerId: session.user.id,
      projectId,
    },
  });

  return NextResponse.json({
    message: "Application submitted",
    application,
  });
}
