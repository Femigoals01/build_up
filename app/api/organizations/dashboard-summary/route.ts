
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { organizationId: session.user.id },
      select: {
        id: true,
        status: true,
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const projectsPosted = projects.length;
    const activeProjects = projects.filter((p) => p.status !== "COMPLETED").length;
    const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;

    const totalApplicants = projects.reduce(
      (acc, p) => acc + p.applications.length,
      0
    );

    const pendingReviews = projects.flatMap((p) =>
      p.applications.filter((a) => a.status === "PENDING")
    ).length;

    const activeVolunteers = projects.flatMap((p) =>
      p.applications.filter((a) => a.status === "ACCEPTED")
    ).length;

    const acceptedPlacements = activeVolunteers;

    return NextResponse.json({
      projectsPosted,
      activeProjects,
      completedProjects,
      totalApplicants,
      pendingReviews,
      activeVolunteers,
      acceptedPlacements,
    });
  } catch (error) {
    console.error("Organization dashboard summary error:", error);
    return NextResponse.json(
      { error: "Failed to load organization dashboard summary." },
      { status: 500 }
    );
  }
}