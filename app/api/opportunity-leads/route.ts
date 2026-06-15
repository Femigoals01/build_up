


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// function clean(value: unknown) {
//   return String(value || "").trim();
// }

// function nullableClean(value: unknown) {
//   const cleaned = clean(value);
//   return cleaned ? cleaned : null;
// }

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const opportunityId = clean(searchParams.get("opportunityId"));

//     const where: any = {
//       opportunity: {
//         organizationId: session.user.id,
//       },
//     };

//     if (opportunityId) {
//       where.opportunityId = opportunityId;
//     }

//     const leads = await prisma.opportunityLead.findMany({
//       where,
//       include: {
//         opportunity: {
//           select: {
//             id: true,
//             title: true,
//             type: true,
//             status: true,
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//             username: true,
//             profileImageUrl: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json(leads);
//   } catch (error) {
//     console.error("OPPORTUNITY LEADS GET ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to load opportunity leads." },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         {
//           error:
//             "Please login or create a BuildUp account before sending interest.",
//         },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();

//     const opportunityId = clean(body.opportunityId);
//     const phone = nullableClean(body.phone);
//     const message = nullableClean(body.message);

//     if (!opportunityId) {
//       return NextResponse.json(
//         { error: "Opportunity ID is required." },
//         { status: 400 }
//       );
//     }

//     const opportunity = await prisma.opportunity.findFirst({
//       where: {
//         id: opportunityId,
//         status: "PUBLISHED",
//       },
//       select: {
//         id: true,
//         title: true,
//         organizationId: true,
//       },
//     });

//     if (!opportunity) {
//       return NextResponse.json(
//         { error: "Opportunity not found or not currently available." },
//         { status: 404 }
//       );
//     }

//     if (opportunity.organizationId === session.user.id) {
//       return NextResponse.json(
//         { error: "You cannot send interest to your own opportunity." },
//         { status: 400 }
//       );
//     }

//     const existingLead = await prisma.opportunityLead.findFirst({
//       where: {
//         opportunityId,
//         userId: session.user.id,
//       },
//     });

//     if (existingLead) {
//       return NextResponse.json(
//         { error: "You have already shown interest in this opportunity." },
//         { status: 400 }
//       );
//     }

//     const lead = await prisma.opportunityLead.create({
//       data: {
//         opportunityId,
//         userId: session.user.id,
//         name: session.user.name || null,
//         email: session.user.email || null,
//         phone,
//         message,
//         source: "BUILDUP",
//       },
//       include: {
//         opportunity: {
//           select: {
//             id: true,
//             title: true,
//             organizationId: true,
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//             username: true,
//             profileImageUrl: true,
//           },
//         },
//       },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: opportunity.organizationId,
//         title: "New opportunity lead",
//         message: `${
//           session.user.name || "A BuildUp user"
//         } showed interest in "${opportunity.title}".`,
//         type: "SYSTEM",
//         link: "/dashboard/organization/opportunities",
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Your interest has been sent successfully.",
//         lead,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("OPPORTUNITY LEADS POST ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to submit opportunity lead." },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return String(value || "").trim();
}

function nullableClean(value: unknown) {
  const cleaned = clean(value);
  return cleaned ? cleaned : null;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const opportunityId = clean(searchParams.get("opportunityId"));

    const where: any = {
      opportunity: {
        organizationId: session.user.id,
      },
    };

    if (opportunityId) {
      where.opportunityId = opportunityId;
    }

    const leads = await prisma.opportunityLead.findMany({
      where,
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            username: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("OPPORTUNITY LEADS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load opportunity leads." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const opportunityId = clean(body.opportunityId);
    const guestName = nullableClean(body.name);
    const guestEmail = nullableClean(body.email);
    const phone = nullableClean(body.phone);
    const message = nullableClean(body.message);

    if (!opportunityId) {
      return NextResponse.json(
        { error: "Opportunity ID is required." },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        type: true,
        organizationId: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found or not currently available." },
        { status: 404 }
      );
    }

    const isJob = opportunity.type === "JOB";

    if (isJob && !session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "Please login or create a BuildUp account before applying for this job.",
        },
        { status: 401 }
      );
    }

    if (session?.user?.id && opportunity.organizationId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot send interest to your own opportunity." },
        { status: 400 }
      );
    }

    if (!session?.user?.id) {
      if (!guestName || !guestEmail) {
        return NextResponse.json(
          { error: "Please provide your name and email." },
          { status: 400 }
        );
      }

      if (!isValidEmail(guestEmail)) {
        return NextResponse.json(
          { error: "Please provide a valid email address." },
          { status: 400 }
        );
      }
    }

    if (session?.user?.id) {
      const existingLead = await prisma.opportunityLead.findFirst({
        where: {
          opportunityId,
          userId: session.user.id,
        },
      });

      if (existingLead) {
        return NextResponse.json(
          { error: "You have already shown interest in this opportunity." },
          { status: 400 }
        );
      }
    }

    const lead = await prisma.opportunityLead.create({
      data: {
        opportunityId,
        userId: session?.user?.id || null,
        name: session?.user?.name || guestName,
        email: session?.user?.email || guestEmail,
        phone,
        message,
        source: session?.user?.id ? "BUILDUP" : "GUEST",
      },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            organizationId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            username: true,
            profileImageUrl: true,
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: opportunity.organizationId,
        title: isJob ? "New job application" : "New opportunity request",
        message: `${
          session?.user?.name || guestName || "Someone"
        } ${isJob ? "applied for" : "showed interest in"} "${
          opportunity.title
        }".`,
        type: "SYSTEM",
        link: "/dashboard/organization/opportunities",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: isJob
          ? "Your application has been sent successfully."
          : "Your request has been sent successfully.",
        lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("OPPORTUNITY LEADS POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit opportunity lead." },
      { status: 500 }
    );
  }
}