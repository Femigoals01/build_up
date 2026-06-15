




// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// const MENTOR_BADGE_TIERS = [
//   {
//     threshold: 1,
//     name: "First Mentorship Review",
//     description: "Received first verified mentorship review",
//     icon: "🏅",
//     category: "MENTORSHIP",
//   },
//   {
//     threshold: 5,
//     name: "Rising Mentor",
//     description: "Received 5 verified mentorship reviews",
//     icon: "🥉",
//     category: "MENTORSHIP",
//   },
//   {
//     threshold: 15,
//     name: "Trusted Mentor",
//     description: "Received 15 verified mentorship reviews",
//     icon: "🥈",
//     category: "MENTORSHIP",
//   },
//   {
//     threshold: 30,
//     name: "Elite Mentor",
//     description: "Received 30 verified mentorship reviews",
//     icon: "🥇",
//     category: "MENTORSHIP",
//   },
//   {
//     threshold: 50,
//     name: "BuildUp Mentor Master",
//     description: "Received 50 verified mentorship reviews",
//     icon: "🏆",
//     category: "MENTORSHIP",
//   },
// ];

// function getSafeRating(value: unknown) {
//   const rating = Number(value);
//   return rating >= 1 && rating <= 5 ? rating : null;
// }

// function getMentorLevel({
//   reviewCount,
//   completedGuidedProjects,
//   averageRating,
//   mentorshipPoints,
// }: {
//   reviewCount: number;
//   completedGuidedProjects: number;
//   averageRating: number;
//   mentorshipPoints: number;
// }) {
//   if (
//     reviewCount >= 50 ||
//     completedGuidedProjects >= 50 ||
//     mentorshipPoints >= 5000 ||
//     (reviewCount >= 30 && averageRating >= 4.8)
//   ) {
//     return 5;
//   }

//   if (
//     reviewCount >= 30 ||
//     completedGuidedProjects >= 30 ||
//     mentorshipPoints >= 3000 ||
//     (reviewCount >= 15 && averageRating >= 4.5)
//   ) {
//     return 4;
//   }

//   if (
//     reviewCount >= 15 ||
//     completedGuidedProjects >= 15 ||
//     mentorshipPoints >= 1500
//   ) {
//     return 3;
//   }

//   if (
//     reviewCount >= 5 ||
//     completedGuidedProjects >= 5 ||
//     mentorshipPoints >= 500
//   ) {
//     return 2;
//   }

//   return 1;
// }

// function calculateMentorshipPoints({
//   reviewCount,
//   completedGuidedProjects,
//   averageRating,
// }: {
//   reviewCount: number;
//   completedGuidedProjects: number;
//   averageRating: number;
// }) {
//   const reviewPoints = reviewCount * 100;
//   const completedProjectPoints = completedGuidedProjects * 150;
//   const qualityBonus = averageRating >= 4.8 ? 300 : averageRating >= 4.5 ? 150 : 0;

//   return reviewPoints + completedProjectPoints + qualityBonus;
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const mentorId = String(body.mentorId || "").trim();
//     const projectId = String(body.projectId || "").trim();

//     const rating = getSafeRating(body.rating);
//     const guidance = getSafeRating(body.guidance);
//     const communication = getSafeRating(body.communication);
//     const availability = getSafeRating(body.availability);
//     const professionalism = getSafeRating(body.professionalism);

//     const comment = String(body.comment || "").trim();

//     if (
//       !mentorId ||
//       !projectId ||
//       !rating ||
//       !guidance ||
//       !communication ||
//       !availability ||
//       !professionalism ||
//       !comment
//     ) {
//       return NextResponse.json(
//         { error: "All rating fields and comment are required." },
//         { status: 400 }
//       );
//     }

//     if (comment.length < 20) {
//       return NextResponse.json(
//         { error: "Please add a more detailed mentor review comment." },
//         { status: 400 }
//       );
//     }

//     const result = await prisma.$transaction(async (tx) => {
//       const project = await tx.project.findFirst({
//         where: {
//           id: projectId,
//           mentorId,
//           status: "COMPLETED",
//           applications: {
//             some: {
//               volunteerId: session.user.id,
//               status: "COMPLETED",
//             },
//           },
//         },
//         select: {
//           id: true,
//           title: true,
//           mentorId: true,
//         },
//       });

//       if (!project) {
//         throw new Error("PROJECT_NOT_ELIGIBLE");
//       }

//       const existingReview = await tx.mentorReview.findUnique({
//         where: {
//           mentorId_volunteerId_projectId: {
//             mentorId,
//             volunteerId: session.user.id,
//             projectId,
//           },
//         },
//       });

//       if (existingReview) {
//         throw new Error("REVIEW_EXISTS");
//       }

//       const mentor = await tx.user.findFirst({
//         where: {
//           id: mentorId,
//           role: "MENTOR",
//           mentorStatus: "APPROVED",
//         },
//         select: {
//           id: true,
//           name: true,
//           username: true,
//           mentorRating: true,
//           mentorRatingCount: true,
//         },
//       });

//       if (!mentor) {
//         throw new Error("MENTOR_NOT_FOUND");
//       }

//       const review = await tx.mentorReview.create({
//         data: {
//           mentorId,
//           volunteerId: session.user.id,
//           projectId,
//           rating,
//           guidance,
//           communication,
//           availability,
//           professionalism,
//           comment,
//         },
//       });

//       const newRatingCount = mentor.mentorRatingCount + 1;
//       const newMentorRating =
//         (mentor.mentorRating * mentor.mentorRatingCount + rating) /
//         newRatingCount;

//       const completedGuidedProjects = await tx.project.count({
//         where: {
//           mentorId,
//           status: "COMPLETED",
//         },
//       });

//       const mentorshipPoints = calculateMentorshipPoints({
//         reviewCount: newRatingCount,
//         completedGuidedProjects,
//         averageRating: newMentorRating,
//       });

//       const mentorLevel = getMentorLevel({
//         reviewCount: newRatingCount,
//         completedGuidedProjects,
//         averageRating: newMentorRating,
//         mentorshipPoints,
//       });

//       await tx.user.update({
//         where: { id: mentorId },
//         data: {
//           mentorRating: newMentorRating,
//           mentorRatingCount: newRatingCount,
//           mentorLevel,
//           mentorshipPoints,
//         },
//       });

//       for (const badge of MENTOR_BADGE_TIERS) {
//         if (newRatingCount >= badge.threshold) {
//           const existingBadge = await tx.badge.findFirst({
//             where: {
//               userId: mentorId,
//               name: badge.name,
//             },
//           });

//           if (!existingBadge) {
//             await tx.badge.create({
//               data: {
//                 userId: mentorId,
//                 name: badge.name,
//                 description: badge.description,
//                 icon: badge.icon,
//                 category: badge.category,
//               },
//             });

//             await tx.notification.create({
//               data: {
//                 userId: mentorId,
//                 title: "New mentor badge earned",
//                 message: `You earned the "${badge.name}" badge on BuildUp.`,
//                 type: "BADGE",
//                 link: mentor.username ? `/mentor/${mentor.username}` : "/dashboard/mentor",
//               },
//             });
//           }
//         }
//       }

//       await tx.notification.create({
//         data: {
//           userId: mentorId,
//           title: "New mentorship review received",
//           message: `You received a mentorship review for "${project.title}".`,
//           type: "REVIEW",
//           link: "/dashboard/mentor",
//         },
//       });

//       return review;
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Mentor review submitted successfully.",
//         review: result,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("MENTOR REVIEW ERROR:", error);

//     if (error.message === "PROJECT_NOT_ELIGIBLE") {
//       return NextResponse.json(
//         {
//           error:
//             "You can only review a mentor after completing a project assigned to that mentor.",
//         },
//         { status: 400 }
//       );
//     }

//     if (error.message === "REVIEW_EXISTS") {
//       return NextResponse.json(
//         { error: "You have already reviewed this mentor for this project." },
//         { status: 400 }
//       );
//     }

//     if (error.message === "MENTOR_NOT_FOUND") {
//       return NextResponse.json(
//         { error: "Mentor not found or not approved." },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Failed to submit mentor review." },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const MENTOR_BADGE_TIERS = [
  {
    threshold: 1,
    name: "First Mentorship Review",
    description: "Received first verified mentorship review",
    icon: "🏅",
    category: "MENTORSHIP",
  },
  {
    threshold: 5,
    name: "Rising Mentor",
    description: "Received 5 verified mentorship reviews",
    icon: "🥉",
    category: "MENTORSHIP",
  },
  {
    threshold: 15,
    name: "Trusted Mentor",
    description: "Received 15 verified mentorship reviews",
    icon: "🥈",
    category: "MENTORSHIP",
  },
  {
    threshold: 30,
    name: "Elite Mentor",
    description: "Received 30 verified mentorship reviews",
    icon: "🥇",
    category: "MENTORSHIP",
  },
  {
    threshold: 50,
    name: "BuildUp Mentor Master",
    description: "Received 50 verified mentorship reviews",
    icon: "🏆",
    category: "MENTORSHIP",
  },
];

function getSafeRating(value: unknown) {
  const rating = Number(value);

  return rating >= 1 && rating <= 5 ? rating : null;
}

function getMentorLevel({
  reviewCount,
  completedGuidedProjects,
  averageRating,
  mentorshipPoints,
}: {
  reviewCount: number;
  completedGuidedProjects: number;
  averageRating: number;
  mentorshipPoints: number;
}) {
  if (
    reviewCount >= 50 ||
    completedGuidedProjects >= 50 ||
    mentorshipPoints >= 5000 ||
    (reviewCount >= 30 && averageRating >= 4.8)
  ) {
    return 5;
  }

  if (
    reviewCount >= 30 ||
    completedGuidedProjects >= 30 ||
    mentorshipPoints >= 3000 ||
    (reviewCount >= 15 && averageRating >= 4.5)
  ) {
    return 4;
  }

  if (
    reviewCount >= 15 ||
    completedGuidedProjects >= 15 ||
    mentorshipPoints >= 1500
  ) {
    return 3;
  }

  if (
    reviewCount >= 5 ||
    completedGuidedProjects >= 5 ||
    mentorshipPoints >= 500
  ) {
    return 2;
  }

  return 1;
}

function calculateMentorshipPoints({
  reviewCount,
  completedGuidedProjects,
  averageRating,
}: {
  reviewCount: number;
  completedGuidedProjects: number;
  averageRating: number;
}) {
  const reviewPoints = reviewCount * 100;
  const completedProjectPoints = completedGuidedProjects * 150;
  const qualityBonus =
    averageRating >= 4.8 ? 300 : averageRating >= 4.5 ? 150 : 0;

  return reviewPoints + completedProjectPoints + qualityBonus;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const mentorId = String(body.mentorId || "").trim();
    const projectId = String(body.projectId || "").trim();

    const rating = getSafeRating(body.rating);
    const guidance = getSafeRating(body.guidance);
    const communication = getSafeRating(body.communication);
    const availability = getSafeRating(body.availability);
    const professionalism = getSafeRating(body.professionalism);

    const comment = String(body.comment || "").trim();

    if (
      !mentorId ||
      !projectId ||
      !rating ||
      !guidance ||
      !communication ||
      !availability ||
      !professionalism ||
      !comment
    ) {
      return NextResponse.json(
        { error: "All rating fields and comment are required." },
        { status: 400 }
      );
    }

    if (comment.length < 20) {
      return NextResponse.json(
        { error: "Please add a more detailed mentor review comment." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const completedBooking = await tx.mentorBooking.findFirst({
        where: {
          mentorId,
          projectId,
          volunteerId: session.user.id,
          status: "COMPLETED",
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              mentorId: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!completedBooking || !completedBooking.project) {
        throw new Error("BOOKING_NOT_COMPLETED");
      }

      const existingReview = await tx.mentorReview.findUnique({
        where: {
          mentorId_volunteerId_projectId: {
            mentorId,
            volunteerId: session.user.id,
            projectId,
          },
        },
      });

      if (existingReview) {
        throw new Error("REVIEW_EXISTS");
      }

      const mentor = await tx.user.findFirst({
        where: {
          id: mentorId,
          role: "MENTOR",
          mentorStatus: "APPROVED",
        },
        select: {
          id: true,
          name: true,
          username: true,
          mentorRating: true,
          mentorRatingCount: true,
        },
      });

      if (!mentor) {
        throw new Error("MENTOR_NOT_FOUND");
      }

      const review = await tx.mentorReview.create({
        data: {
          mentorId,
          volunteerId: session.user.id,
          projectId,
          rating,
          guidance,
          communication,
          availability,
          professionalism,
          comment,
        },
      });

      const newRatingCount = mentor.mentorRatingCount + 1;

      const newMentorRating =
        (mentor.mentorRating * mentor.mentorRatingCount + rating) /
        newRatingCount;

      const completedGuidedProjects = await tx.project.count({
        where: {
          mentorId,
          status: "COMPLETED",
        },
      });

      const mentorshipPoints = calculateMentorshipPoints({
        reviewCount: newRatingCount,
        completedGuidedProjects,
        averageRating: newMentorRating,
      });

      const mentorLevel = getMentorLevel({
        reviewCount: newRatingCount,
        completedGuidedProjects,
        averageRating: newMentorRating,
        mentorshipPoints,
      });

      await tx.user.update({
        where: { id: mentorId },
        data: {
          mentorRating: newMentorRating,
          mentorRatingCount: newRatingCount,
          mentorLevel,
          mentorshipPoints,
        },
      });

      for (const badge of MENTOR_BADGE_TIERS) {
        if (newRatingCount >= badge.threshold) {
          const existingBadge = await tx.badge.findFirst({
            where: {
              userId: mentorId,
              name: badge.name,
            },
          });

          if (!existingBadge) {
            await tx.badge.create({
              data: {
                userId: mentorId,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                category: badge.category,
              },
            });

            await tx.notification.create({
              data: {
                userId: mentorId,
                title: "New mentor badge earned",
                message: `You earned the "${badge.name}" badge on BuildUp.`,
                type: "BADGE",
                link: mentor.username
                  ? `/mentor/${mentor.username}`
                  : "/dashboard/mentor",
              },
            });
          }
        }
      }

      await tx.notification.create({
        data: {
          userId: mentorId,
          title: "New mentorship review received",
          message: `You received a mentorship review for "${completedBooking.project.title}".`,
          type: "REVIEW",
          link: "/dashboard/mentor",
        },
      });

      return review;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mentor review submitted successfully.",
        review: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("MENTOR REVIEW ERROR:", error);

    if (error.message === "BOOKING_NOT_COMPLETED") {
      return NextResponse.json(
        {
          error:
            "You can only review a mentor after a completed mentorship session.",
        },
        { status: 400 }
      );
    }

    if (error.message === "REVIEW_EXISTS") {
      return NextResponse.json(
        { error: "You have already reviewed this mentor for this project." },
        { status: 400 }
      );
    }

    if (error.message === "MENTOR_NOT_FOUND") {
      return NextResponse.json(
        { error: "Mentor not found or not approved." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit mentor review." },
      { status: 500 }
    );
  }
}