



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        applications: true,
      },
    });

    if (!project || project.organizationId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const acceptedApplication = project.applications.find(
      (app) => app.status === "ACCEPTED" || app.status === "COMPLETED"
    );

    if (!acceptedApplication) {
      return NextResponse.json(
        { error: "No accepted volunteer found for this project." },
        { status: 400 }
      );
    }

    const funding = await prisma.projectFunding.findUnique({
      where: { projectId },
    });

    if (!funding) {
      return NextResponse.json(
        { error: "Funding record not found." },
        { status: 404 }
      );
    }

    if (funding.status !== "HELD") {
      return NextResponse.json(
        { error: "Project funds must be held before release." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: {
          status: "COMPLETED",
        },
      });

      await tx.application.update({
        where: { id: acceptedApplication.id },
        data: {
          status: "COMPLETED",
        },
      });

      await tx.projectFunding.update({
        where: { id: funding.id },
        data: {
          status: "RELEASED",
          volunteerId: acceptedApplication.volunteerId,
          releasedAt: new Date(),
        },
      });

      await tx.wallet.upsert({
        where: {
          userId: acceptedApplication.volunteerId,
        },
        update: {
          balance: {
            increment: funding.volunteerAmount,
          },
        },
        create: {
          userId: acceptedApplication.volunteerId,
          balance: funding.volunteerAmount,
          pending: 0,
          withdrawn: 0,
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: acceptedApplication.volunteerId,
          projectId,
          type: "PROJECT_EARNING",
          amount: funding.volunteerAmount,
          status: "COMPLETED",
          description: `Earning released for completed project: ${project.title}`,
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: session.user.id,
          projectId,
          type: "PLATFORM_FEE",
          amount: funding.platformFee,
          status: "COMPLETED",
          description: `BuildUp 18% platform fee for project: ${project.title}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: acceptedApplication.volunteerId,
          title: "Project earning released",
          message: `Your earning for "${project.title}" has been added to your wallet.`,
          type: "PROJECT",
          link: "/dashboard/wallet",
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PROJECT RELEASE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to release project payment." },
      { status: 500 }
    );
  }
}