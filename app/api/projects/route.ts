// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type CreateProjectBody = {
//   title: string;
//   description: string;
//   difficulty: string;
//   skills: string[];
// };

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const body: CreateProjectBody = await req.json();
//   const { title, description, difficulty, skills } = body;

//   if (!title || !description || !difficulty) {
//     return NextResponse.json(
//       { error: "Missing required fields" },
//       { status: 400 }
//     );
//   }

//   const project = await prisma.project.create({
//     data: {
//       title,
//       description,
//       difficulty, // ✅ now correctly typed
//       skills,
//       organizationId: session.user.id,
//     },
//   });

//   return NextResponse.json({ project });
// }


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Difficulty } from "@prisma/client";

type CreateProjectBody = {
  title: string;
  description: string;
  difficulty: Difficulty;
  skills: string[];
};

export async function POST(req: Request) {
  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ================= BODY ================= */
    const body: CreateProjectBody = await req.json();
    const { title, description, difficulty, skills } = body;

    if (!title || !description || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= CREATE ================= */
    const project = await prisma.project.create({
      data: {
        title,
        description,
        difficulty,
        skills: skills ?? [],
        organizationId: session.user.id,
      },
    });

    /* ================= SUCCESS ================= */
    return NextResponse.json(
      {
        success: true,
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
