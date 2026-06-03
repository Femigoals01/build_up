



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Difficulty } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type UpdateProjectBody = {
  title?: string;
  description?: string;
  requirements?: string;
  difficulty?: Difficulty;
  skills?: string[];
  stipendAmount?: number;
  deliveryDays?: number;
};

function isValidDifficulty(value: unknown): value is Difficulty {
  return (
    value === "BEGINNER" ||
    value === "INTERMEDIATE" ||
    value === "ADVANCED"
  );
}

async function getProjectLockStatus(projectId: string) {
  const selectedApplication = await prisma.application.findFirst({
    where: {
      projectId,
      status: {
        in: ["AWAITING_PAYMENT", "ACCEPTED", "COMPLETED"],
      },
    },
    select: {
      id: true,
    },
  });

  const funding = await prisma.projectFunding.findUnique({
    where: { projectId },
    select: {
      id: true,
      status: true,
      paidAt: true,
    },
  });

  return {
    hasSelectedVolunteer: Boolean(selectedApplication),
    hasStartedFunding:
      Boolean(funding?.paidAt) ||
      funding?.status === "HELD" ||
      funding?.status === "RELEASED" ||
      funding?.status === "DISPUTED" ||
      funding?.status === "REFUNDED",
  };
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        status: true,
        organizationId: true,
      },
    });

    if (!project || project.organizationId !== session.user.id) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    if (project.status !== "OPEN") {
      return NextResponse.json(
        {
          error:
            "This project can no longer be edited because it is no longer open.",
        },
        { status: 409 }
      );
    }

    const lockStatus = await getProjectLockStatus(projectId);

    if (lockStatus.hasSelectedVolunteer || lockStatus.hasStartedFunding) {
      return NextResponse.json(
        {
          error:
            "This project is locked because a volunteer has already been selected or funding has started.",
        },
        { status: 409 }
      );
    }

    const body: UpdateProjectBody = await req.json();

    const title = body.title?.trim();
    const description = body.description?.trim();
    const requirements = body.requirements?.trim() || null;
    const difficulty = body.difficulty;
    const skills = Array.isArray(body.skills)
      ? body.skills.map((skill) => skill.trim()).filter(Boolean)
      : [];
    const stipendAmount = Number(body.stipendAmount);
    const deliveryDays = Number(body.deliveryDays);

    if (!title || !description || !difficulty) {
      return NextResponse.json(
        { error: "Title, description, and difficulty are required." },
        { status: 400 }
      );
    }

    if (!isValidDifficulty(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty level." },
        { status: 400 }
      );
    }

    if (!stipendAmount || stipendAmount < 5000) {
      return NextResponse.json(
        { error: "Minimum stipend is ₦5,000." },
        { status: 400 }
      );
    }

    if (!deliveryDays || deliveryDays < 1 || deliveryDays > 60) {
      return NextResponse.json(
        { error: "Delivery time must be between 1 and 60 days." },
        { status: 400 }
      );
    }

    const stipendAmountKobo = Math.round(stipendAmount * 100);
    const platformFee = Math.round(stipendAmountKobo * 0.18);
    const volunteerAmount = stipendAmountKobo - platformFee;

    const updatedProject = await prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: projectId },
        data: {
          title,
          description,
          requirements,
          difficulty,
          skills,
          stipendAmount: stipendAmountKobo,
          deliveryDays,
        },
      });

      await tx.projectFunding.update({
        where: { projectId },
        data: {
          stipendAmount: stipendAmountKobo,
          platformFee,
          volunteerAmount,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully.",
      project: updatedProject,
    });
  } catch (error) {
    console.error("PROJECT UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        status: true,
        organizationId: true,
      },
    });

    if (!project || project.organizationId !== session.user.id) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    if (project.status !== "OPEN") {
      return NextResponse.json(
        {
          error:
            "This project can no longer be deleted because it is no longer open.",
        },
        { status: 409 }
      );
    }

    const lockStatus = await getProjectLockStatus(projectId);

    if (lockStatus.hasSelectedVolunteer || lockStatus.hasStartedFunding) {
      return NextResponse.json(
        {
          error:
            "This project is locked because a volunteer has already been selected or funding has started.",
        },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.projectFunding.deleteMany({
        where: { projectId },
      });

      await tx.chatMessage.deleteMany({
        where: {
          chat: {
            projectId,
          },
        },
      });

      await tx.projectChat.deleteMany({
        where: { projectId },
      });

      await tx.mentorshipRequest.deleteMany({
        where: { projectId },
      });

      await tx.application.deleteMany({
        where: { projectId },
      });

      await tx.project.delete({
        where: { id: projectId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("PROJECT DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete project." },
      { status: 500 }
    );
  }
}