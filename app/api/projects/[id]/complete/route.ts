

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

//     const { id } = await context.params;

//     // ✅ Mark project + applications completed
//     await prisma.project.update({
//       where: { id },
//       data: {
//         status: "COMPLETED",
//         applications: {
//           updateMany: {
//             where: { status: "ACCEPTED" },
//             data: { status: "COMPLETED" },
//           },
//         },
//       },
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

    if (!session || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ NEXT.JS 16 FIX — unwrap params
    const { id: projectId } = await context.params;

    // 1️⃣ Mark project as COMPLETED
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "COMPLETED" },
    });

    // 2️⃣ Mark accepted applications as COMPLETED
    await prisma.application.updateMany({
      where: {
        projectId,
        status: "ACCEPTED",
      },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PROJECT COMPLETE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to complete project" },
      { status: 500 }
    );
  }
}
