



// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const {
//       title,
//       description,
//       difficulty,
//       skills,
//       requirements,
//       stipendAmount,
//     } = await req.json();

//     if (!title || !description || !difficulty) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     if (!stipendAmount || stipendAmount < 5000) {
//       return NextResponse.json(
//         { error: "Minimum stipend is ₦5,000" },
//         { status: 400 }
//       );
//     }

//     const stipendAmountKobo = Math.round(stipendAmount * 100);
//     const platformFee = Math.round(stipendAmountKobo * 0.18);
//     const volunteerAmount = stipendAmountKobo - platformFee;

//     const project = await prisma.project.create({
//       data: {
//         title,
//         description,
//         requirements,
//         difficulty,
//         skills: skills ?? [],
//         organizationId: session.user.id,
//         stipendAmount: stipendAmountKobo,
//       },
//     });

//     await prisma.projectChat.create({
//       data: {
//         projectId: project.id,
//       },
//     });

//     await prisma.projectFunding.create({
//       data: {
//         projectId: project.id,
//         organizationId: session.user.id,
//         stipendAmount: stipendAmountKobo,
//         platformFee,
//         volunteerAmount,
//         status: "UNPAID",
//       },
//     });

//     return NextResponse.json(project, { status: 201 });
//   } catch (error) {
//     console.error("Create project error:", error);
//     return NextResponse.json(
//       { error: "Failed to create project" },
//       { status: 500 }
//     );
//   }
// }



// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const {
//       title,
//       description,
//       difficulty,
//       skills,
//       requirements,
//       stipendAmount,
//       deliveryDays,
//     } = await req.json();

//     if (!title || !description || !difficulty) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     if (!stipendAmount || stipendAmount < 5000) {
//       return NextResponse.json(
//         { error: "Minimum stipend is ₦5,000" },
//         { status: 400 }
//       );
//     }

//     const safeDeliveryDays = Number(deliveryDays);

//     if (!safeDeliveryDays || safeDeliveryDays < 1 || safeDeliveryDays > 60) {
//       return NextResponse.json(
//         { error: "Delivery time must be between 1 and 60 days" },
//         { status: 400 }
//       );
//     }

//     const stipendAmountKobo = Math.round(stipendAmount * 100);
//     const platformFee = Math.round(stipendAmountKobo * 0.18);
//     const volunteerAmount = stipendAmountKobo - platformFee;

//     const project = await prisma.$transaction(async (tx) => {
//       const createdProject = await tx.project.create({
//         data: {
//           title,
//           description,
//           requirements,
//           difficulty,
//           skills: skills ?? [],
//           organizationId: session.user.id,
//           stipendAmount: stipendAmountKobo,
//           deliveryDays: safeDeliveryDays,
//         },
//       });

//       await tx.projectChat.create({
//         data: {
//           projectId: createdProject.id,
//         },
//       });

//       await tx.projectFunding.create({
//         data: {
//           projectId: createdProject.id,
//           organizationId: session.user.id,
//           stipendAmount: stipendAmountKobo,
//           platformFee,
//           volunteerAmount,
//           status: "UNPAID",
//         },
//       });

//       return createdProject;
//     });

//     return NextResponse.json(project, { status: 201 });
//   } catch (error) {
//     console.error("Create project error:", error);

//     return NextResponse.json(
//       { error: "Failed to create project" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      title,
      description,
      difficulty,
      skills,
      requirements,
      stipendAmount,
      deliveryDays,
    } = await req.json();

    if (!title || !description || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!stipendAmount || stipendAmount < 500) {
      return NextResponse.json(
        { error: "Minimum stipend is ₦5,000" },
        { status: 400 }
      );
    }

    const safeDeliveryDays = Number(deliveryDays);

    if (!safeDeliveryDays || safeDeliveryDays < 1 || safeDeliveryDays > 60) {
      return NextResponse.json(
        { error: "Delivery time must be between 1 and 60 days" },
        { status: 400 }
      );
    }

    const stipendAmountKobo = Math.round(stipendAmount * 100);
    const platformFee = Math.round(stipendAmountKobo * 0.18);
    const volunteerAmount = stipendAmountKobo - platformFee;

    const project = await prisma.$transaction(async (tx) => {
      const createdProject = await tx.project.create({
        data: {
          title,
          description,
          requirements,
          difficulty,
          skills: skills ?? [],
          organizationId: session.user.id,
          stipendAmount: stipendAmountKobo,
          deliveryDays: safeDeliveryDays,
        },
      });

      await tx.projectChat.create({
        data: {
          projectId: createdProject.id,
        },
      });

      await tx.projectFunding.create({
        data: {
          projectId: createdProject.id,
          organizationId: session.user.id,
          stipendAmount: stipendAmountKobo,
          platformFee,
          volunteerAmount,
          status: "UNPAID",
        },
      });

      return createdProject;
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}