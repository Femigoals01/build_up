

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// /* ================= BADGE TIERS ================= */

// const BADGE_TIERS = [
//   {
//     threshold: 1,
//     name: "First Project Completed",
//     description: "Completed and reviewed first project",
//     icon: "🏅",
//   },
//   {
//     threshold: 5,
//     name: "5 Projects Completed",
//     description: "Successfully completed 5 projects",
//     icon: "🥉",
//   },
//   {
//     threshold: 10,
//     name: "10 Projects Completed",
//     description: "Successfully completed 10 projects",
//     icon: "🥈",
//   },
//   {
//     threshold: 20,
//     name: "20 Projects Completed",
//     description: "Successfully completed 20 projects",
//     icon: "🥇",
//   },
// ];

// export async function POST(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     /* ================= AUTH ================= */
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     /* ================= PARAMS ================= */
//     const { id: projectId } = await params;
//     const { rating, comment } = await req.json();

//     if (!rating || !comment) {
//       return NextResponse.json(
//         { error: "Rating and comment are required" },
//         { status: 400 }
//       );
//     }

//     /* ================= FIND ACCEPTED VOLUNTEER ================= */
//     const application = await prisma.application.findFirst({
//       where: {
//         projectId,
//         status: { in: ["ACCEPTED", "COMPLETED"] },
//       },
//       select: { volunteerId: true },
//     });

//     if (!application) {
//       return NextResponse.json(
//         { error: "No accepted volunteer found" },
//         { status: 400 }
//       );
//     }

//     const volunteerId = application.volunteerId;

//     /* ================= LOCK REVIEW (ONE-TIME) ================= */
//     const existingReview = await prisma.review.findFirst({
//       where: {
//         projectId,
//         volunteerId,
//         organizationId: session.user.id,
//       },
//     });

//     if (existingReview) {
//       return NextResponse.json(
//         { error: "Review already submitted for this project" },
//         { status: 400 }
//       );
//     }

//     /* ================= CREATE REVIEW ================= */
//     const review = await prisma.review.create({
//       data: {
//         rating,
//         comment,
//         project: { connect: { id: projectId } },
//         volunteer: { connect: { id: volunteerId } },
//         organization: { connect: { id: session.user.id } },
//       },
//     });

//     /* ================= UPDATE VOLUNTEER RATING ================= */
//     const volunteer = await prisma.user.findUnique({
//       where: { id: volunteerId },
//       select: { rating: true, ratingCount: true },
//     });

//     if (volunteer) {
//       const newCount = volunteer.ratingCount + 1;
//       const newRating =
//         (volunteer.rating * volunteer.ratingCount + rating) / newCount;

//       await prisma.user.update({
//         where: { id: volunteerId },
//         data: {
//           rating: newRating,
//           ratingCount: newCount,
//         },
//       });
//     }

//     /* ================= AUTO-AWARD BADGE TIERS ================= */

//     const reviewCount = await prisma.review.count({
//       where: { volunteerId },
//     });

//     for (const badge of BADGE_TIERS) {
//       if (reviewCount === badge.threshold) {
//         const alreadyHasBadge = await prisma.badge.findFirst({
//           where: {
//             userId: volunteerId,
//             name: badge.name,
//           },
//         });

//         if (!alreadyHasBadge) {
//           await prisma.badge.create({
//             data: {
//               userId: volunteerId,
//               name: badge.name,
//               description: badge.description,
//               icon: badge.icon,
//             },
//           });
//         }
//       }
//     }

//     /* ================= TOP PERFORMER BADGE (5⭐) ================= */

//     if (rating === 5) {
//       const existingFiveStar = await prisma.badge.findFirst({
//         where: {
//           userId: volunteerId,
//           name: "Top Performer",
//         },
//       });

//       if (!existingFiveStar) {
//         await prisma.badge.create({
//           data: {
//             userId: volunteerId,
//             name: "Top Performer",
//             description: "Received a 5-star review",
//             icon: "⭐",
//           },
//         });
//       }
//     }

//     /* ================= SUCCESS ================= */
//     return NextResponse.json({ success: true, review });
//   } catch (error) {
//     console.error("REVIEW ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to submit review" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/* ================= BADGE TIERS ================= */

const BADGE_TIERS = [
  {
    threshold: 1,
    name: "First Project Completed",
    description: "Completed and reviewed first project",
    icon: "🏅",
  },
  {
    threshold: 5,
    name: "5 Projects Completed",
    description: "Successfully completed 5 projects",
    icon: "🥉",
  },
  {
    threshold: 10,
    name: "10 Projects Completed",
    description: "Successfully completed 10 projects",
    icon: "🥈",
  },
  {
    threshold: 20,
    name: "20 Projects Completed",
    description: "Successfully completed 20 projects",
    icon: "🥇",
  },
];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ================= PARAMS ================= */
    const { id: projectId } = await params;
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Rating and comment are required" },
        { status: 400 }
      );
    }

    /* ================= TRANSACTION ================= */
    const result = await prisma.$transaction(async (tx) => {
      /* === FIND ACCEPTED VOLUNTEER === */
      const application = await tx.application.findFirst({
        where: {
          projectId,
          status: { in: ["ACCEPTED", "COMPLETED"] },
        },
        select: { volunteerId: true },
      });

      if (!application) {
        throw new Error("NO_VOLUNTEER");
      }

      const volunteerId = application.volunteerId;

      /* === LOCK REVIEW (ONE-TIME) === */
      const existingReview = await tx.review.findFirst({
        where: {
          projectId,
          volunteerId,
          organizationId: session.user.id,
        },
      });

      if (existingReview) {
        throw new Error("REVIEW_EXISTS");
      }

      /* === CREATE REVIEW === */
      const review = await tx.review.create({
        data: {
          rating,
          comment,
          project: { connect: { id: projectId } },
          volunteer: { connect: { id: volunteerId } },
          organization: { connect: { id: session.user.id } },
        },
      });

      /* === UPDATE VOLUNTEER RATING === */
      const volunteer = await tx.user.findUnique({
        where: { id: volunteerId },
        select: { rating: true, ratingCount: true },
      });

      if (volunteer) {
        const newCount = volunteer.ratingCount + 1;
        const newRating =
          (volunteer.rating * volunteer.ratingCount + rating) / newCount;

        await tx.user.update({
          where: { id: volunteerId },
          data: {
            rating: newRating,
            ratingCount: newCount,
          },
        });
      }

      /* === BADGE TIERS (RESILIENT) === */
      const reviewCount = await tx.review.count({
        where: { volunteerId },
      });

      for (const badge of BADGE_TIERS) {
        if (reviewCount >= badge.threshold) {
          const exists = await tx.badge.findFirst({
            where: {
              userId: volunteerId,
              name: badge.name,
            },
          });

          if (!exists) {
            await tx.badge.create({
              data: {
                userId: volunteerId,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
              },
            });
          }
        }
      }

      /* === TOP PERFORMER (5⭐) === */
      if (rating === 5) {
        const existingFiveStar = await tx.badge.findFirst({
          where: {
            userId: volunteerId,
            name: "Top Performer",
          },
        });

        if (!existingFiveStar) {
          await tx.badge.create({
            data: {
              userId: volunteerId,
              name: "Top Performer",
              description: "Received a 5-star review",
              icon: "⭐",
            },
          });
        }
      }

      return review;
    });

    /* ================= SUCCESS ================= */
    return NextResponse.json({ success: true, review: result });

  } catch (error: any) {
    console.error("REVIEW ERROR:", error);

    if (error.message === "NO_VOLUNTEER") {
      return NextResponse.json(
        { error: "No accepted volunteer found" },
        { status: 400 }
      );
    }

    if (error.message === "REVIEW_EXISTS") {
      return NextResponse.json(
        { error: "Review already submitted for this project" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
