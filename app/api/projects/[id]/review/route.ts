


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

//     if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     /* ================= PARAMS ================= */
//     const { id: projectId } = await params;
//     const body = await req.json();

//     const rating = Number(body.rating);
//     const comment = String(body.comment || "").trim();

//     if (!rating || rating < 1 || rating > 5 || !comment) {
//       return NextResponse.json(
//         { error: "A valid rating and comment are required." },
//         { status: 400 }
//       );
//     }

//     if (comment.length < 20) {
//       return NextResponse.json(
//         { error: "Please add a more detailed review comment." },
//         { status: 400 }
//       );
//     }

//     /* ================= SECURITY: VERIFY PROJECT OWNER ================= */
//     const project = await prisma.project.findFirst({
//       where: {
//         id: projectId,
//         organizationId: session.user.id,
//       },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         status: true,
//         organizationId: true,
//       },
//     });

//     if (!project) {
//       return NextResponse.json(
//         { error: "Project not found." },
//         { status: 404 }
//       );
//     }

//     /* ================= TRANSACTION ================= */
//     const result = await prisma.$transaction(async (tx) => {
//       /* === FIND ACCEPTED VOLUNTEER === */
//       const application = await tx.application.findFirst({
//         where: {
//           projectId,
//           status: {
//             in: ["ACCEPTED", "COMPLETED"],
//           },
//         },
//         select: {
//           id: true,
//           volunteerId: true,
//           status: true,
//         },
//       });

//       if (!application) {
//         throw new Error("NO_VOLUNTEER");
//       }

//       const volunteerId = application.volunteerId;

//       /* === LOCK REVIEW (ONE-TIME) === */
//       const existingReview = await tx.review.findFirst({
//         where: {
//           projectId,
//           volunteerId,
//           organizationId: session.user.id,
//         },
//       });

//       if (existingReview) {
//         throw new Error("REVIEW_EXISTS");
//       }

//       /* === CREATE REVIEW === */
//       const review = await tx.review.create({
//         data: {
//           rating,
//           comment,
//           project: {
//             connect: {
//               id: projectId,
//             },
//           },
//           volunteer: {
//             connect: {
//               id: volunteerId,
//             },
//           },
//           organization: {
//             connect: {
//               id: session.user.id,
//             },
//           },
//         },
//       });

//       /* === MARK PROJECT + APPLICATION AS COMPLETED === */
//       await tx.project.update({
//         where: {
//           id: projectId,
//         },
//         data: {
//           status: "COMPLETED",
//         },
//       });

//       await tx.application.update({
//         where: {
//           id: application.id,
//         },
//         data: {
//           status: "COMPLETED",
//         },
//       });

//       /* === CREATE VERIFIED PORTFOLIO PROOF IF NOT EXISTS === */
//       const existingPortfolioItem = await tx.portfolioItem.findFirst({
//         where: {
//           volunteerId,
//           projectId,
//         },
//       });

//       let portfolioItem = existingPortfolioItem;

//       if (!existingPortfolioItem) {
//         portfolioItem = await tx.portfolioItem.create({
//           data: {
//             volunteerId,
//             projectId,
//             reviewId: review.id,
//             contribution: comment,
//             proofUrl: `/projects/${projectId}`,
//           },
//         });
//       } else if (!existingPortfolioItem.reviewId) {
//         portfolioItem = await tx.portfolioItem.update({
//           where: {
//             id: existingPortfolioItem.id,
//           },
//           data: {
//             reviewId: review.id,
//             contribution: existingPortfolioItem.contribution || comment,
//             proofUrl: existingPortfolioItem.proofUrl || `/projects/${projectId}`,
//           },
//         });
//       }

//       /* === UPDATE VOLUNTEER RATING === */
//       const volunteer = await tx.user.findUnique({
//         where: {
//           id: volunteerId,
//         },
//         select: {
//           rating: true,
//           ratingCount: true,
//           name: true,
//         },
//       });

//       if (volunteer) {
//         const newCount = volunteer.ratingCount + 1;
//         const newRating =
//           (volunteer.rating * volunteer.ratingCount + rating) / newCount;

//         await tx.user.update({
//           where: {
//             id: volunteerId,
//           },
//           data: {
//             rating: newRating,
//             ratingCount: newCount,
//           },
//         });
//       }

//       /* === BADGE TIERS === */
//       const completedReviewCount = await tx.review.count({
//         where: {
//           volunteerId,
//         },
//       });

//       for (const badge of BADGE_TIERS) {
//         if (completedReviewCount >= badge.threshold) {
//           const exists = await tx.badge.findFirst({
//             where: {
//               userId: volunteerId,
//               name: badge.name,
//             },
//           });

//           if (!exists) {
//             await tx.badge.create({
//               data: {
//                 userId: volunteerId,
//                 name: badge.name,
//                 description: badge.description,
//                 icon: badge.icon,
//               },
//             });

//             await tx.notification.create({
//               data: {
//                 userId: volunteerId,
//                 title: "New badge earned",
//                 message: `You earned the "${badge.name}" badge on BuildUp.`,
//                 type: "BADGE",
//                 link: "/dashboard/portfolio",
//               },
//             });
//           }
//         }
//       }

//       /* === TOP PERFORMER (5⭐) === */
//       if (rating === 5) {
//         const existingFiveStar = await tx.badge.findFirst({
//           where: {
//             userId: volunteerId,
//             name: "Top Performer",
//           },
//         });

//         if (!existingFiveStar) {
//           await tx.badge.create({
//             data: {
//               userId: volunteerId,
//               name: "Top Performer",
//               description: "Received a 5-star review",
//               icon: "⭐",
//             },
//           });

//           await tx.notification.create({
//             data: {
//               userId: volunteerId,
//               title: "Top Performer badge earned",
//               message:
//                 "You received a 5-star review and earned the Top Performer badge.",
//               type: "BADGE",
//               link: "/dashboard/portfolio",
//             },
//           });
//         }
//       }

//       /* === MAIN REVIEW NOTIFICATION === */
//       await tx.notification.create({
//         data: {
//           userId: volunteerId,
//           title: "New project review received",
//           message: `Your completed project "${project.title}" has received a review.`,
//           type: "REVIEW",
//           link: "/portfolio",
//         },
//       });

//       /* === PROOF-OF-WORK NOTIFICATION === */
//       await tx.notification.create({
//         data: {
//           userId: volunteerId,
//           title: "Portfolio proof unlocked",
//           message:
//             "Your completed project has been added to your proof-of-work portfolio.",
//           type: "SYSTEM",
//           link: "/portfolio",
//         },
//       });

//       return {
//         review,
//         portfolioItem,
//       };
//     });

//     /* ================= SUCCESS ================= */
//     return NextResponse.json({
//       success: true,
//       message: "Review submitted successfully.",
//       review: result.review,
//       portfolioItem: result.portfolioItem,
//     });
//   } catch (error: any) {
//     console.error("REVIEW ERROR:", error);

//     if (error.message === "NO_VOLUNTEER") {
//       return NextResponse.json(
//         { error: "No accepted volunteer found for this project." },
//         { status: 400 }
//       );
//     }

//     if (error.message === "REVIEW_EXISTS") {
//       return NextResponse.json(
//         { error: "Review already submitted for this project." },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Failed to submit review." },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const BADGE_TIERS = [
  {
    threshold: 1,
    name: "First Project Completed",
    description: "Completed and reviewed first project",
    icon: "🏅",
    category: "PROJECT_MILESTONE",
  },
  {
    threshold: 5,
    name: "Rising Professional",
    description: "Successfully completed 5 projects",
    icon: "🥉",
    category: "PROJECT_MILESTONE",
  },
  {
    threshold: 15,
    name: "Experienced Contributor",
    description: "Successfully completed 15 projects",
    icon: "🥈",
    category: "PROJECT_MILESTONE",
  },
  {
    threshold: 30,
    name: "Elite Volunteer",
    description: "Successfully completed 30 projects",
    icon: "🥇",
    category: "PROJECT_MILESTONE",
  },
  {
    threshold: 50,
    name: "BuildUp Master",
    description: "Successfully completed 50 projects",
    icon: "🏆",
    category: "PROJECT_MILESTONE",
  },
];

function getVolunteerLevel(completedProjects: number) {
  if (completedProjects >= 50) return 5;
  if (completedProjects >= 30) return 4;
  if (completedProjects >= 15) return 3;
  if (completedProjects >= 5) return 2;
  return 1;
}

function getSafeRating(value: unknown) {
  const rating = Number(value);
  return rating >= 1 && rating <= 5 ? rating : null;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;
    const body = await req.json();

    const rating = getSafeRating(body.rating);
    const technicalSkill = getSafeRating(body.technicalSkill) ?? rating;
    const communication = getSafeRating(body.communication) ?? rating;
    const professionalism = getSafeRating(body.professionalism) ?? rating;
    const timeliness = getSafeRating(body.timeliness) ?? rating;

    const comment = String(body.comment || "").trim();
    const strengths =
      typeof body.strengths === "string" && body.strengths.trim()
        ? body.strengths.trim()
        : null;

    const improvementAreas =
      typeof body.improvementAreas === "string" && body.improvementAreas.trim()
        ? body.improvementAreas.trim()
        : null;

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "A valid rating and comment are required." },
        { status: 400 }
      );
    }

    if (comment.length < 20) {
      return NextResponse.json(
        { error: "Please add a more detailed review comment." },
        { status: 400 }
      );
    }

    const overallRating =
      (technicalSkill! + communication! + professionalism! + timeliness!) / 4;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        status: true,
        organizationId: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const application = await tx.application.findFirst({
        where: {
          projectId,
          status: {
            in: ["ACCEPTED", "COMPLETED"],
          },
        },
        select: {
          id: true,
          volunteerId: true,
        },
      });

      if (!application) {
        throw new Error("NO_VOLUNTEER");
      }

      const volunteerId = application.volunteerId;

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

      const review = await tx.review.create({
        data: {
          rating,
          overallRating,
          technicalSkill,
          communication,
          professionalism,
          timeliness,
          strengths,
          improvementAreas,
          comment,
          project: {
            connect: { id: projectId },
          },
          volunteer: {
            connect: { id: volunteerId },
          },
          organization: {
            connect: { id: session.user.id },
          },
        },
      });

      await tx.project.update({
        where: { id: projectId },
        data: { status: "COMPLETED" },
      });

      await tx.application.update({
        where: { id: application.id },
        data: { status: "COMPLETED" },
      });

      const existingPortfolioItem = await tx.portfolioItem.findFirst({
        where: {
          volunteerId,
          projectId,
        },
      });

      let portfolioItem = existingPortfolioItem;

      if (!existingPortfolioItem) {
        portfolioItem = await tx.portfolioItem.create({
          data: {
            volunteerId,
            projectId,
            reviewId: review.id,
            contribution: comment,
            proofUrl: `/projects/${projectId}`,
          },
        });
      } else if (!existingPortfolioItem.reviewId) {
        portfolioItem = await tx.portfolioItem.update({
          where: { id: existingPortfolioItem.id },
          data: {
            reviewId: review.id,
            contribution: existingPortfolioItem.contribution || comment,
            proofUrl: existingPortfolioItem.proofUrl || `/projects/${projectId}`,
          },
        });
      }

      const volunteer = await tx.user.findUnique({
        where: { id: volunteerId },
        select: {
          rating: true,
          ratingCount: true,
          name: true,
        },
      });

      if (volunteer) {
        const newCount = volunteer.ratingCount + 1;
        const newRating =
          (volunteer.rating * volunteer.ratingCount + overallRating) / newCount;

        const completedReviewCount = await tx.review.count({
          where: { volunteerId },
        });

        const level = getVolunteerLevel(completedReviewCount);
        const points = completedReviewCount * 100;

        await tx.user.update({
          where: { id: volunteerId },
          data: {
            rating: newRating,
            ratingCount: newCount,
            level,
            points,
          },
        });

        for (const badge of BADGE_TIERS) {
          if (completedReviewCount >= badge.threshold) {
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
                  category: badge.category,
                },
              });

              await tx.notification.create({
                data: {
                  userId: volunteerId,
                  title: "New badge earned",
                  message: `You earned the "${badge.name}" badge on BuildUp.`,
                  type: "BADGE",
                  link: "/dashboard/portfolio",
                },
              });
            }
          }
        }

        if (overallRating >= 4.8) {
          const existingTopPerformer = await tx.badge.findFirst({
            where: {
              userId: volunteerId,
              name: "Top Performer",
            },
          });

          if (!existingTopPerformer) {
            await tx.badge.create({
              data: {
                userId: volunteerId,
                name: "Top Performer",
                description: "Received an excellent project review",
                icon: "⭐",
                category: "PERFORMANCE",
              },
            });

            await tx.notification.create({
              data: {
                userId: volunteerId,
                title: "Top Performer badge earned",
                message:
                  "You received an excellent review and earned the Top Performer badge.",
                type: "BADGE",
                link: "/dashboard/portfolio",
              },
            });
          }
        }
      }

      await tx.notification.create({
        data: {
          userId: volunteerId,
          title: "New project review received",
          message: `Your completed project "${project.title}" has received a review.`,
          type: "REVIEW",
          link: "/portfolio",
        },
      });

      await tx.notification.create({
        data: {
          userId: volunteerId,
          title: "Portfolio proof unlocked",
          message:
            "Your completed project has been added to your proof-of-work portfolio.",
          type: "SYSTEM",
          link: "/portfolio",
        },
      });

      return {
        review,
        portfolioItem,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully.",
      review: result.review,
      portfolioItem: result.portfolioItem,
    });
  } catch (error: any) {
    console.error("REVIEW ERROR:", error);

    if (error.message === "NO_VOLUNTEER") {
      return NextResponse.json(
        { error: "No accepted volunteer found for this project." },
        { status: 400 }
      );
    }

    if (error.message === "REVIEW_EXISTS") {
      return NextResponse.json(
        { error: "Review already submitted for this project." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit review." },
      { status: 500 }
    );
  }
}