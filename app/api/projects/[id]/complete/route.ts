



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function POST(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // ✅ NEXT.JS 16 FIX — unwrap params
//     const { id: projectId } = await context.params;

//     // 1️⃣ Mark project as COMPLETED
//     await prisma.project.update({
//       where: { id: projectId },
//       data: { status: "COMPLETED" },
//     });

//     // 2️⃣ Mark accepted applications as COMPLETED
//     await prisma.application.updateMany({
//       where: {
//         projectId,
//         status: "ACCEPTED",
//       },
//       data: { status: "COMPLETED" },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("PROJECT COMPLETE ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to complete project" },
//       { status: 500 }
//     );
//   }
// }




// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function POST(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id: projectId } = await context.params;

//     const project = await prisma.project.findFirst({
//       where: {
//         id: projectId,
//         organizationId: session.user.id,
//       },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         organizationId: true,
//       },
//     });

//     if (!project) {
//       return NextResponse.json(
//         { error: "Project not found." },
//         { status: 404 }
//       );
//     }

//     await prisma.$transaction(async (tx) => {
//       await tx.project.update({
//         where: { id: projectId },
//         data: { status: "COMPLETED" },
//       });

//       const acceptedApplications = await tx.application.findMany({
//         where: {
//           projectId,
//           status: "ACCEPTED",
//         },
//         select: {
//           id: true,
//           volunteerId: true,
//         },
//       });

//       await tx.application.updateMany({
//         where: {
//           projectId,
//           status: "ACCEPTED",
//         },
//         data: {
//           status: "COMPLETED",
//         },
//       });

//       for (const application of acceptedApplications) {
//         const existingPortfolioItem = await tx.portfolioItem.findFirst({
//           where: {
//             volunteerId: application.volunteerId,
//             projectId,
//           },
//         });

//         if (!existingPortfolioItem) {
//           const lastItem = await tx.portfolioItem.findFirst({
//             where: {
//               volunteerId: application.volunteerId,
//             },
//             orderBy: {
//               order: "desc",
//             },
//           });

//           await tx.portfolioItem.create({
//             data: {
//               volunteerId: application.volunteerId,
//               projectId,
//               order: (lastItem?.order ?? -1) + 1,
//               proofUrl: `/projects/${projectId}`,
//             },
//           });
//         }

//         await tx.notification.create({
//           data: {
//             userId: application.volunteerId,
//             title: "Project marked completed",
//             message: `Your project "${project.title}" has been marked completed and added to your verified portfolio.`,
//             type: "PROJECT",
//             link: "/dashboard/portfolio",
//           },
//         });
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Project completed and portfolio updated.",
//     });
//   } catch (error) {
//     console.error("PROJECT COMPLETE ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to complete project." },
//       { status: 500 }
//     );
//   }
// }





// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function POST(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id: projectId } = await context.params;

//     const project = await prisma.project.findFirst({
//       where: {
//         id: projectId,
//         organizationId: session.user.id,
//       },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         organizationId: true,
//       },
//     });

//     if (!project) {
//       return NextResponse.json(
//         { error: "Project not found." },
//         { status: 404 }
//       );
//     }

//     await prisma.$transaction(async (tx) => {
//       await tx.project.update({
//         where: { id: projectId },
//         data: { status: "COMPLETED" },
//       });

//       const acceptedApplications = await tx.application.findMany({
//         where: {
//           projectId,
//           status: {
//             in: ["ACCEPTED", "COMPLETED"],
//           },
//         },
//         select: {
//           id: true,
//           volunteerId: true,
//         },
//       });

//       await tx.application.updateMany({
//         where: {
//           projectId,
//           status: "ACCEPTED",
//         },
//         data: {
//           status: "COMPLETED",
//         },
//       });

//       for (const application of acceptedApplications) {
//         const latestApprovedSubmission = await tx.projectSubmission.findFirst({
//           where: {
//             projectId,
//             volunteerId: application.volunteerId,
//             status: "APPROVED",
//           },
//           orderBy: [{ version: "desc" }, { createdAt: "desc" }],
//           select: {
//             workUrl: true,
//             fileUrl: true,
//             message: true,
//           },
//         });

//         const existingPortfolioItem = await tx.portfolioItem.findFirst({
//           where: {
//             volunteerId: application.volunteerId,
//             projectId,
//           },
//         });

//         const proofUrl =
//           latestApprovedSubmission?.workUrl ||
//           latestApprovedSubmission?.fileUrl ||
//           `/dashboard/projects/${projectId}`;

//         if (!existingPortfolioItem) {
//           const lastItem = await tx.portfolioItem.findFirst({
//             where: {
//               volunteerId: application.volunteerId,
//             },
//             orderBy: {
//               order: "desc",
//             },
//           });

//           await tx.portfolioItem.create({
//             data: {
//               volunteerId: application.volunteerId,
//               projectId,
//               order: (lastItem?.order ?? -1) + 1,
//               proofUrl,
//               imageUrl: latestApprovedSubmission?.fileUrl || null,
//               contribution: latestApprovedSubmission?.message || null,
//             },
//           });
//         } else {
//           await tx.portfolioItem.update({
//             where: {
//               id: existingPortfolioItem.id,
//             },
//             data: {
//               proofUrl: existingPortfolioItem.proofUrl || proofUrl,
//               imageUrl:
//                 existingPortfolioItem.imageUrl ||
//                 latestApprovedSubmission?.fileUrl ||
//                 null,
//               contribution:
//                 existingPortfolioItem.contribution ||
//                 latestApprovedSubmission?.message ||
//                 null,
//             },
//           });
//         }

//         await tx.notification.create({
//           data: {
//             userId: application.volunteerId,
//             title: "Project marked completed",
//             message: `Your project "${project.title}" has been marked completed and added to your verified portfolio.`,
//             type: "PROJECT",
//             link: "/dashboard/portfolio",
//           },
//         });
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Project completed and portfolio updated.",
//     });
//   } catch (error) {
//     console.error("PROJECT COMPLETE ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to complete project." },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await context.params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        organizationId: true,
        status: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    if (project.status === "COMPLETED") {
      return NextResponse.json({
        success: true,
        message: "Project already completed.",
      });
    }

    const approvedSubmissions = await prisma.projectSubmission.findMany({
      where: {
        projectId,
        status: "APPROVED",
      },
      select: {
        id: true,
        volunteerId: true,
        workUrl: true,
        fileUrl: true,
        message: true,
        version: true,
        createdAt: true,
      },
      orderBy: [{ version: "desc" }, { createdAt: "desc" }],
    });

    if (approvedSubmissions.length === 0) {
      return NextResponse.json(
        {
          error:
            "Project cannot be completed until a volunteer submission has been approved.",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: { status: "COMPLETED" },
      });

      const acceptedApplications = await tx.application.findMany({
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

      await tx.application.updateMany({
        where: {
          projectId,
          status: "ACCEPTED",
        },
        data: {
          status: "COMPLETED",
        },
      });

      for (const application of acceptedApplications) {
        const latestApprovedSubmission = approvedSubmissions.find(
          (submission) => submission.volunteerId === application.volunteerId
        );

        if (!latestApprovedSubmission) continue;

        const existingPortfolioItem = await tx.portfolioItem.findFirst({
          where: {
            volunteerId: application.volunteerId,
            projectId,
          },
        });

        const proofUrl =
          latestApprovedSubmission.workUrl ||
          latestApprovedSubmission.fileUrl ||
          `/dashboard/projects/${projectId}`;

        if (!existingPortfolioItem) {
          const lastItem = await tx.portfolioItem.findFirst({
            where: {
              volunteerId: application.volunteerId,
            },
            orderBy: {
              order: "desc",
            },
          });

          await tx.portfolioItem.create({
            data: {
              volunteerId: application.volunteerId,
              projectId,
              order: (lastItem?.order ?? -1) + 1,
              proofUrl,
              imageUrl: latestApprovedSubmission.fileUrl || null,
              contribution: latestApprovedSubmission.message || null,
            },
          });
        } else {
          await tx.portfolioItem.update({
            where: {
              id: existingPortfolioItem.id,
            },
            data: {
              proofUrl: existingPortfolioItem.proofUrl || proofUrl,
              imageUrl:
                existingPortfolioItem.imageUrl ||
                latestApprovedSubmission.fileUrl ||
                null,
              contribution:
                existingPortfolioItem.contribution ||
                latestApprovedSubmission.message ||
                null,
            },
          });
        }

        await tx.notification.create({
          data: {
            userId: application.volunteerId,
            title: "Project marked completed",
            message: `Your project "${project.title}" has been marked completed and added to your verified portfolio.`,
            type: "PROJECT",
            link: "/dashboard/portfolio",
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Project completed and portfolio updated.",
    });
  } catch (error) {
    console.error("PROJECT COMPLETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to complete project." },
      { status: 500 }
    );
  }
}