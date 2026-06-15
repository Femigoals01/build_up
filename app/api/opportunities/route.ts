

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// const VALID_TYPES = ["PROJECT", "JOB", "PROMOTION", "EVENT", "COURSE"];
// const VALID_STATUSES = ["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"];
// const VALID_WORK_MODES = ["REMOTE", "HYBRID", "ONSITE"];

// function clean(value: unknown) {
//   return String(value || "").trim();
// }

// function nullableClean(value: unknown) {
//   const cleaned = clean(value);
//   return cleaned ? cleaned : null;
// }

// function getSafeDate(value: unknown) {
//   const cleaned = clean(value);

//   if (!cleaned) return null;

//   const date = new Date(cleaned);

//   if (Number.isNaN(date.getTime())) {
//     return null;
//   }

//   return date;
// }

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const type = clean(searchParams.get("type"));
//     const status = clean(searchParams.get("status")) || "PUBLISHED";
//     const organizationId = clean(searchParams.get("organizationId"));
//     const featured = clean(searchParams.get("featured"));

//     const where: any = {};

//     if (type && VALID_TYPES.includes(type)) {
//       where.type = type;
//     }

//     if (status && VALID_STATUSES.includes(status)) {
//       where.status = status;
//     }

//     if (organizationId) {
//       where.organizationId = organizationId;
//     }

//     if (featured === "true") {
//       where.featured = true;
//     }

//     const opportunities = await prisma.opportunity.findMany({
//       where,
//       include: {
//         organization: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             profileImageUrl: true,
//             headline: true,
//             country: true,
//           },
//         },
//         _count: {
//           select: {
//             leads: true,
//           },
//         },
//       },
//       orderBy: [
//         {
//           featured: "desc",
//         },
//         {
//           createdAt: "desc",
//         },
//       ],
//       take: 100,
//     });

//     return NextResponse.json(opportunities);
//   } catch (error) {
//     console.error("OPPORTUNITIES GET ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to load opportunities." },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const title = clean(body.title);
//     const description = clean(body.description);
//     const type = clean(body.type);
//     const status = clean(body.status) || "PUBLISHED";
//     const workMode = nullableClean(body.workMode);
//     const location = nullableClean(body.location);
//     const compensation = nullableClean(body.compensation);
//     const applicationUrl = nullableClean(body.applicationUrl);
//     const contactEmail = nullableClean(body.contactEmail);
//     const imageUrl = nullableClean(body.imageUrl);

//     const startDate = getSafeDate(body.startDate);
//     const endDate = getSafeDate(body.endDate);

//     if (!title) {
//       return NextResponse.json(
//         { error: "Opportunity title is required." },
//         { status: 400 }
//       );
//     }

//     if (!description) {
//       return NextResponse.json(
//         { error: "Opportunity description is required." },
//         { status: 400 }
//       );
//     }

//     if (!VALID_TYPES.includes(type)) {
//       return NextResponse.json(
//         { error: "Please select a valid opportunity type." },
//         { status: 400 }
//       );
//     }

//     if (!VALID_STATUSES.includes(status)) {
//       return NextResponse.json(
//         { error: "Please select a valid status." },
//         { status: 400 }
//       );
//     }

//     if (workMode && !VALID_WORK_MODES.includes(workMode)) {
//       return NextResponse.json(
//         { error: "Please select a valid work mode." },
//         { status: 400 }
//       );
//     }

//     if (startDate && endDate && startDate > endDate) {
//       return NextResponse.json(
//         { error: "End date must be after start date." },
//         { status: 400 }
//       );
//     }

//     const opportunity = await prisma.opportunity.create({
//       data: {
//         organizationId: session.user.id,
//         title,
//         description,
//         type: type as any,
//         status: status as any,
//         workMode: workMode as any,
//         location,
//         compensation,
//         applicationUrl,
//         contactEmail,
//         imageUrl,
//         startDate,
//         endDate,
//       },
//       include: {
//         organization: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Opportunity created successfully.",
//         opportunity,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("OPPORTUNITIES POST ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to create opportunity." },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const opportunityId = clean(body.opportunityId);

//     if (!opportunityId) {
//       return NextResponse.json(
//         { error: "Opportunity ID is required." },
//         { status: 400 }
//       );
//     }

//     const existing = await prisma.opportunity.findFirst({
//       where: {
//         id: opportunityId,
//         organizationId: session.user.id,
//       },
//     });

//     if (!existing) {
//       return NextResponse.json(
//         { error: "Opportunity not found." },
//         { status: 404 }
//       );
//     }

//     const data: any = {};

//     if (body.title !== undefined) data.title = clean(body.title);
//     if (body.description !== undefined) data.description = clean(body.description);

//     if (body.type !== undefined) {
//       const type = clean(body.type);

//       if (!VALID_TYPES.includes(type)) {
//         return NextResponse.json(
//           { error: "Please select a valid opportunity type." },
//           { status: 400 }
//         );
//       }

//       data.type = type;
//     }

//     if (body.status !== undefined) {
//       const status = clean(body.status);

//       if (!VALID_STATUSES.includes(status)) {
//         return NextResponse.json(
//           { error: "Please select a valid status." },
//           { status: 400 }
//         );
//       }

//       data.status = status;
//     }

//     if (body.workMode !== undefined) {
//       const workMode = nullableClean(body.workMode);

//       if (workMode && !VALID_WORK_MODES.includes(workMode)) {
//         return NextResponse.json(
//           { error: "Please select a valid work mode." },
//           { status: 400 }
//         );
//       }

//       data.workMode = workMode;
//     }

//     if (body.location !== undefined) data.location = nullableClean(body.location);
//     if (body.compensation !== undefined) {
//       data.compensation = nullableClean(body.compensation);
//     }
//     if (body.applicationUrl !== undefined) {
//       data.applicationUrl = nullableClean(body.applicationUrl);
//     }
//     if (body.contactEmail !== undefined) {
//       data.contactEmail = nullableClean(body.contactEmail);
//     }
//     if (body.imageUrl !== undefined) data.imageUrl = nullableClean(body.imageUrl);

//     if (body.startDate !== undefined) data.startDate = getSafeDate(body.startDate);
//     if (body.endDate !== undefined) data.endDate = getSafeDate(body.endDate);

//     if (data.startDate && data.endDate && data.startDate > data.endDate) {
//       return NextResponse.json(
//         { error: "End date must be after start date." },
//         { status: 400 }
//       );
//     }

//     const opportunity = await prisma.opportunity.update({
//       where: {
//         id: opportunityId,
//       },
//       data,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Opportunity updated successfully.",
//       opportunity,
//     });
//   } catch (error) {
//     console.error("OPPORTUNITIES PATCH ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to update opportunity." },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const opportunityId = clean(body.opportunityId);

//     if (!opportunityId) {
//       return NextResponse.json(
//         { error: "Opportunity ID is required." },
//         { status: 400 }
//       );
//     }

//     const existing = await prisma.opportunity.findFirst({
//       where: {
//         id: opportunityId,
//         organizationId: session.user.id,
//       },
//     });

//     if (!existing) {
//       return NextResponse.json(
//         { error: "Opportunity not found." },
//         { status: 404 }
//       );
//     }

//     await prisma.opportunity.delete({
//       where: {
//         id: opportunityId,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Opportunity deleted successfully.",
//     });
//   } catch (error) {
//     console.error("OPPORTUNITIES DELETE ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to delete opportunity." },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = ["PROJECT", "JOB", "PROMOTION", "EVENT", "COURSE"];
const VALID_STATUSES = ["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"];
const VALID_WORK_MODES = ["REMOTE", "HYBRID", "ONSITE"];

function clean(value: unknown) {
  return String(value || "").trim();
}

function nullableClean(value: unknown) {
  const cleaned = clean(value);
  return cleaned ? cleaned : null;
}

function getSafeDate(value: unknown) {
  const cleaned = clean(value);

  if (!cleaned) return null;

  const date = new Date(cleaned);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

async function attachAnalyticsCounts(opportunities: any[]) {
  const opportunityIds = opportunities.map((item) => item.id);

  if (opportunityIds.length === 0) {
    return opportunities;
  }

  const analytics = await prisma.opportunityAnalytics.groupBy({
    by: ["opportunityId", "eventType"],
    where: {
      opportunityId: {
        in: opportunityIds,
      },
    },
    _count: {
      _all: true,
    },
  });

  const analyticsMap = new Map<string, number>();

  analytics.forEach((item) => {
    analyticsMap.set(
      `${item.opportunityId}:${item.eventType}`,
      item._count._all
    );
  });

  return opportunities.map((opportunity) => ({
    ...opportunity,
    analytics: {
      sponsoredViews:
        analyticsMap.get(`${opportunity.id}:SPONSORED_VIEW`) || 0,
      viewDetailsClicks:
        analyticsMap.get(`${opportunity.id}:VIEW_DETAILS_CLICK`) || 0,
      marketplaceClicks:
        analyticsMap.get(`${opportunity.id}:MARKETPLACE_CLICK`) || 0,
    },
  }));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const type = clean(searchParams.get("type"));
    const status = clean(searchParams.get("status")) || "PUBLISHED";
    const organizationId = clean(searchParams.get("organizationId"));
    const featured = clean(searchParams.get("featured"));

    const where: any = {};

    if (type && VALID_TYPES.includes(type)) {
      where.type = type;
    }

    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (featured === "true") {
      where.featured = true;
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImageUrl: true,
            headline: true,
            country: true,
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
      take: 100,
    });

    const opportunitiesWithAnalytics =
      await attachAnalyticsCounts(opportunities);

    return NextResponse.json(opportunitiesWithAnalytics);
  } catch (error) {
    console.error("OPPORTUNITIES GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load opportunities." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const title = clean(body.title);
    const description = clean(body.description);
    const type = clean(body.type);
    const status = clean(body.status) || "PUBLISHED";
    const workMode = nullableClean(body.workMode);
    const location = nullableClean(body.location);
    const compensation = nullableClean(body.compensation);
    const applicationUrl = nullableClean(body.applicationUrl);
    const contactEmail = nullableClean(body.contactEmail);
    const imageUrl = nullableClean(body.imageUrl);

    const startDate = getSafeDate(body.startDate);
    const endDate = getSafeDate(body.endDate);

    if (!title) {
      return NextResponse.json(
        { error: "Opportunity title is required." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Opportunity description is required." },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Please select a valid opportunity type." },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Please select a valid status." },
        { status: 400 }
      );
    }

    if (workMode && !VALID_WORK_MODES.includes(workMode)) {
      return NextResponse.json(
        { error: "Please select a valid work mode." },
        { status: 400 }
      );
    }

    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json(
        { error: "End date must be after start date." },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        organizationId: session.user.id,
        title,
        description,
        type: type as any,
        status: status as any,
        workMode: workMode as any,
        location,
        compensation,
        applicationUrl,
        contactEmail,
        imageUrl,
        startDate,
        endDate,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Opportunity created successfully.",
        opportunity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("OPPORTUNITIES POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create opportunity." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
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

    const existing = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        organizationId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Opportunity not found." },
        { status: 404 }
      );
    }

    const data: any = {};

    if (body.title !== undefined) data.title = clean(body.title);
    if (body.description !== undefined) {
      data.description = clean(body.description);
    }

    if (body.type !== undefined) {
      const type = clean(body.type);

      if (!VALID_TYPES.includes(type)) {
        return NextResponse.json(
          { error: "Please select a valid opportunity type." },
          { status: 400 }
        );
      }

      data.type = type;
    }

    if (body.status !== undefined) {
      const status = clean(body.status);

      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: "Please select a valid status." },
          { status: 400 }
        );
      }

      data.status = status;
    }

    if (body.workMode !== undefined) {
      const workMode = nullableClean(body.workMode);

      if (workMode && !VALID_WORK_MODES.includes(workMode)) {
        return NextResponse.json(
          { error: "Please select a valid work mode." },
          { status: 400 }
        );
      }

      data.workMode = workMode;
    }

    if (body.location !== undefined) {
      data.location = nullableClean(body.location);
    }

    if (body.compensation !== undefined) {
      data.compensation = nullableClean(body.compensation);
    }

    if (body.applicationUrl !== undefined) {
      data.applicationUrl = nullableClean(body.applicationUrl);
    }

    if (body.contactEmail !== undefined) {
      data.contactEmail = nullableClean(body.contactEmail);
    }

    if (body.imageUrl !== undefined) {
      data.imageUrl = nullableClean(body.imageUrl);
    }

    if (body.startDate !== undefined) {
      data.startDate = getSafeDate(body.startDate);
    }

    if (body.endDate !== undefined) {
      data.endDate = getSafeDate(body.endDate);
    }

    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      return NextResponse.json(
        { error: "End date must be after start date." },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.update({
      where: {
        id: opportunityId,
      },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity updated successfully.",
      opportunity,
    });
  } catch (error) {
    console.error("OPPORTUNITIES PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update opportunity." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
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

    const existing = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        organizationId: session.user.id,
      },
    });

    if (!existing) {
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

    return NextResponse.json({
      success: true,
      message: "Opportunity deleted successfully.",
    });
  } catch (error) {
    console.error("OPPORTUNITIES DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete opportunity." },
      { status: 500 }
    );
  }
}