import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, difficulty, skills, requirements } =
      await req.json();

    if (!title || !description || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Create project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        requirements,
        difficulty,
        skills: skills ?? [],
        organizationId: session.user.id,
      },
    });

    // 2️⃣ Create project chat immediately
    await prisma.projectChat.create({
      data: {
        projectId: project.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
