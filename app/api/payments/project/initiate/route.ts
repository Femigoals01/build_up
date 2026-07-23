




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      session.user.role !== "ORGANIZATION" ||
      !session.user.id ||
      !session.user.email
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        organizationId: true,
        stipendAmount: true,
      },
    });

    if (!project || project.organizationId !== session.user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.stipendAmount || project.stipendAmount < 500000) {
      return NextResponse.json(
        { error: "This project does not have a valid stipend amount." },
        { status: 400 }
      );
    }

    const platformFee = Math.round(project.stipendAmount * 0.18);
    const volunteerAmount = project.stipendAmount - platformFee;

    const funding =
      (await prisma.projectFunding.findUnique({
        where: { projectId },
      })) ??
      (await prisma.projectFunding.create({
        data: {
          projectId: project.id,
          organizationId: session.user.id,
          stipendAmount: project.stipendAmount,
          platformFee,
          volunteerAmount,
          status: "UNPAID",
        },
      }));

    if (funding.status !== "UNPAID") {
      return NextResponse.json(
        { error: "Project already funded or processed" },
        { status: 400 }
      );
    }

    const reference = `buildup_${funding.projectId}_${Date.now()}`;

    const response = await fetch(
      `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          amount: funding.stipendAmount,
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/project/verify`,
          metadata: {
            projectId: funding.projectId,
            organizationId: session.user.id,
          },
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack init failed:", data);
      return NextResponse.json(
        { error: data?.message || "Failed to initialize payment" },
        { status: 500 }
      );
    }

    await prisma.projectFunding.update({
      where: { projectId },
      data: {
        paystackReference: reference,
      },
    });

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
    });
  } catch (error) {
    console.error("PAYSTACK INIT ERROR:", error);

    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}






// To be deleted later once production paystck is fully tested and live. This is just to temporarily disable funding until we're ready to launch it, while keeping the code in place for easy re-enabling later.


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// /*
// =========================================================
// TEMPORARY FUNDING CONTROL
// Funding is OFF unless this env variable is set to "true".

// To enable later, add this in Vercel env:
// PROJECT_FUNDING_ENABLED=true
// =========================================================
// */
// const PROJECT_FUNDING_ENABLED = process.env.PROJECT_FUNDING_ENABLED === "true";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (
//       !session ||
//       session.user.role !== "ORGANIZATION" ||
//       !session.user.id ||
//       !session.user.email
//     ) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     /*
//     =========================================================
//     TEMPORARY FUNDING DISABLE BLOCK
//     Remove this block or set PROJECT_FUNDING_ENABLED=true
//     when funding goes live.
//     =========================================================
//     */
//     if (!PROJECT_FUNDING_ENABLED) {
//       return NextResponse.json(
//         {
//           error:
//             "Project funding is temporarily unavailable. Funding opens soon.",
//         },
//         { status: 403 }
//       );
//     }

//     const { projectId } = await req.json();

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Project ID is required" },
//         { status: 400 }
//       );
//     }

//     const project = await prisma.project.findUnique({
//       where: { id: projectId },
//       select: {
//         id: true,
//         organizationId: true,
//         stipendAmount: true,
//       },
//     });

//     if (!project || project.organizationId !== session.user.id) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 });
//     }

//     if (!project.stipendAmount || project.stipendAmount < 500000) {
//       return NextResponse.json(
//         { error: "This project does not have a valid stipend amount." },
//         { status: 400 }
//       );
//     }

//     const platformFee = Math.round(project.stipendAmount * 0.18);
//     const volunteerAmount = project.stipendAmount - platformFee;

//     const funding =
//       (await prisma.projectFunding.findUnique({
//         where: { projectId },
//       })) ??
//       (await prisma.projectFunding.create({
//         data: {
//           projectId: project.id,
//           organizationId: session.user.id,
//           stipendAmount: project.stipendAmount,
//           platformFee,
//           volunteerAmount,
//           status: "UNPAID",
//         },
//       }));

//     if (funding.status !== "UNPAID") {
//       return NextResponse.json(
//         { error: "Project already funded or processed" },
//         { status: 400 }
//       );
//     }

//     const reference = `buildup_${funding.projectId}_${Date.now()}`;

//     const response = await fetch(
//       `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: session.user.email,
//           amount: funding.stipendAmount,
//           reference,
//           callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/project/verify`,
//           metadata: {
//             projectId: funding.projectId,
//             organizationId: session.user.id,
//           },
//         }),
//       }
//     );

//     const data = await response.json();

//     if (!data.status) {
//       console.error("Paystack init failed:", data);
//       return NextResponse.json(
//         { error: data?.message || "Failed to initialize payment" },
//         { status: 500 }
//       );
//     }

//     await prisma.projectFunding.update({
//       where: { projectId },
//       data: {
//         paystackReference: reference,
//       },
//     });

//     return NextResponse.json({
//       authorizationUrl: data.data.authorization_url,
//     });
//   } catch (error) {
//     console.error("PAYSTACK INIT ERROR:", error);

//     return NextResponse.json(
//       { error: "Payment initialization failed" },
//       { status: 500 }
//     );
//   }
// }