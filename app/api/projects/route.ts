


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
  requirements?: string;
  stipendAmount: number; // 👈 NEW
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateProjectBody = await req.json();

    const {
      title,
      description,
      difficulty,
      skills,
      requirements,
      stipendAmount,
    } = body;

    // ✅ VALIDATION
    if (!title || !description || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!stipendAmount || stipendAmount < 5000) {
      return NextResponse.json(
        { error: "Minimum stipend is ₦5,000" },
        { status: 400 }
      );
    }

    // ✅ CONVERT TO KOBO
    const stipendAmountKobo = Math.round(stipendAmount * 100);

    const platformFee = Math.round(stipendAmountKobo * 0.18);
    const volunteerAmount = stipendAmountKobo - platformFee;

    const project = await prisma.$transaction(async (tx) => {
      const createdProject = await tx.project.create({
        data: {
          title,
          description,
          requirements,
          difficulty,
          skills: skills ?? [],
          organizationId: session.user.id,
          stipendAmount: stipendAmountKobo, // 👈 STORE KOBO
        },
      });

      // ✅ CREATE CHAT
      await tx.projectChat.create({
        data: {
          projectId: createdProject.id,
        },
      });

      // ✅ CREATE FUNDING RECORD
      await tx.projectFunding.create({
        data: {
          projectId: createdProject.id,
          organizationId: session.user.id,
          stipendAmount: stipendAmountKobo,
          platformFee,
          volunteerAmount,
          status: "UNPAID",
        },
      });

      return createdProject;
    });

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