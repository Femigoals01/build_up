


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function getMentorEligibility(mentorId: string) {
  const [mentor, bookings, reviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: mentorId },
      select: {
        id: true,
        mentorRating: true,
        mentorRatingCount: true,
        mentorLevel: true,
      },
    }),

    prisma.mentorBooking.findMany({
      where: { mentorId },
      select: {
        id: true,
        status: true,
      },
    }),

    prisma.mentorReview.findMany({
      where: { mentorId },
      select: {
        id: true,
        rating: true,
        professionalism: true,
      },
    }),
  ]);

  if (!mentor) {
    return null;
  }

  const totalBookings = bookings.length;

  const completedSessions = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  const completionRate =
    totalBookings > 0 ? (completedSessions / totalBookings) * 100 : 0;

  const averageRating =
    mentor.mentorRating || average(reviews.map((review) => review.rating));

  const professionalismAverage = average(
    reviews.map((review) => review.professionalism)
  );

  const eligible =
    completedSessions >= 10 &&
    mentor.mentorRatingCount >= 5 &&
    averageRating >= 4.5 &&
    mentor.mentorLevel >= 2 &&
    completionRate >= 80 &&
    professionalismAverage >= 4.5;

  return {
    eligible,
    completedSessions,
    reviews: mentor.mentorRatingCount,
    averageRating,
    mentorLevel: mentor.mentorLevel,
    completionRate,
    professionalismAverage,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "MENTOR") {
      const certifications = await prisma.mentorCertification.findMany({
        where: {
          mentorId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(certifications);
    }

    if (session.user.role === "ADMIN") {
      const certifications = await prisma.mentorCertification.findMany({
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              mentorRating: true,
              mentorRatingCount: true,
              mentorLevel: true,
              mentorshipPoints: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(certifications);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("MENTOR CERTIFICATION GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load certification applications." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "MENTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const eligibility = await getMentorEligibility(session.user.id);

    if (!eligibility) {
      return NextResponse.json(
        { error: "Mentor profile not found." },
        { status: 404 }
      );
    }

    if (!eligibility.eligible) {
      return NextResponse.json(
        {
          error:
            "You are not eligible for mentor certification yet. Complete all certification requirements first.",
          eligibility,
        },
        { status: 400 }
      );
    }

    const existingPending = await prisma.mentorCertification.findFirst({
      where: {
        mentorId: session.user.id,
        status: "PENDING",
      },
    });

    if (existingPending) {
      return NextResponse.json(
        { error: "You already have a pending certification application." },
        { status: 409 }
      );
    }

    const alreadyApproved = await prisma.mentorCertification.findFirst({
      where: {
        mentorId: session.user.id,
        status: "APPROVED",
      },
    });

    if (alreadyApproved) {
      return NextResponse.json(
        { error: "You are already a certified mentor." },
        { status: 409 }
      );
    }

    const certification = await prisma.mentorCertification.create({
      data: {
        mentorId: session.user.id,
        status: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Certification application submitted",
        message:
          "Your BuildUp mentor certification application has been submitted for admin review.",
        type: "SYSTEM",
        link: "/dashboard/mentor/certification",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Certification application submitted successfully.",
        certification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MENTOR CERTIFICATION POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit certification application." },
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

    const certificationId = String(body.certificationId || "").trim();
    const status = String(body.status || "").trim();
    const notes = body.notes ? String(body.notes).trim() : null;

    if (!certificationId) {
      return NextResponse.json(
        { error: "Certification ID is required." },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be APPROVED or REJECTED." },
        { status: 400 }
      );
    }

    const existing = await prisma.mentorCertification.findUnique({
      where: {
        id: certificationId,
      },
      include: {
        mentor: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Certification application not found." },
        { status: 404 }
      );
    }

    const updated = await prisma.mentorCertification.update({
      where: {
        id: certificationId,
      },
      data: {
        status,
        notes,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });

    if (status === "APPROVED") {
      const existingBadge = await prisma.badge.findFirst({
        where: {
          userId: existing.mentorId,
          name: "BuildUp Certified Mentor",
        },
      });

      if (!existingBadge) {
        await prisma.badge.create({
          data: {
            userId: existing.mentorId,
            name: "BuildUp Certified Mentor",
            description:
              "Awarded to mentors who meet BuildUp certification standards.",
            icon: "🎓",
            category: "CERTIFICATION",
          },
        });
      }
    }

    await prisma.notification.create({
      data: {
        userId: existing.mentorId,
        title:
          status === "APPROVED"
            ? "Certification approved"
            : "Certification rejected",
        message:
          status === "APPROVED"
            ? "Congratulations! You are now a BuildUp Certified Mentor."
            : "Your mentor certification application was not approved at this time.",
        type: "SYSTEM",
        link:
          status === "APPROVED" && existing.mentor.username
            ? `/mentor/${existing.mentor.username}`
            : "/dashboard/mentor/certification",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Certification application updated successfully.",
      certification: updated,
    });
  } catch (error) {
    console.error("MENTOR CERTIFICATION PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update certification application." },
      { status: 500 }
    );
  }
}