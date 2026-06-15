
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"];

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const opportunities = await prisma.opportunity.findMany({
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            organizationVerified: true,
          },
        },
        _count: {
          select: {
            leads: true,
          },
        },
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 200,
    });

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("ADMIN OPPORTUNITIES GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load admin opportunities." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const opportunityId = clean(body.opportunityId);
    const status = clean(body.status);

    if (!opportunityId) {
      return NextResponse.json(
        { error: "Opportunity ID is required." },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid opportunity status." },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.update({
      where: {
        id: opportunityId,
      },
      data: {
        status: status as any,
      },
    });

    await prisma.notification.create({
      data: {
        userId: opportunity.organizationId,
        title: "Opportunity status updated",
        message: `Your opportunity "${opportunity.title}" has been marked as ${status}.`,
        type: "SYSTEM",
        link: "/dashboard/organization/opportunities",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity updated successfully.",
      opportunity,
    });
  } catch (error) {
    console.error("ADMIN OPPORTUNITIES PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update opportunity." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const opportunityId = clean(body.opportunityId);

    if (!opportunityId) {
      return NextResponse.json(
        { error: "Opportunity ID is required." },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: {
        id: opportunityId,
      },
      select: {
        id: true,
        title: true,
        organizationId: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found." },
        { status: 404 }
      );
    }

    await prisma.opportunity.delete({
      where: {
        id: opportunityId,
      },
    });

    await prisma.notification.create({
      data: {
        userId: opportunity.organizationId,
        title: "Opportunity removed",
        message: `Your opportunity "${opportunity.title}" was removed by BuildUp admin.`,
        type: "SYSTEM",
        link: "/dashboard/organization/opportunities",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN OPPORTUNITIES DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete opportunity." },
      { status: 500 }
    );
  }
}