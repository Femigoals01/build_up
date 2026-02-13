// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     return NextResponse.json([], { status: 401 });
//   }

//   const projects = await prisma.project.findMany({
//     where: {
//       applications: {
//         some: {
//           volunteerId: session.user.id,
//           status: "ACCEPTED",
//         },
//       },
//     },
//     select: { id: true, title: true },
//   });

//   return NextResponse.json(projects);
// }


import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  // 🔐 Guard: only logged-in volunteers
  if (!session || session.user.role !== "VOLUNTEER") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  /**
   * A volunteer can request mentorship ONLY on:
   * - projects they were ACCEPTED into
   * - projects that are still OPEN or IN_PROGRESS
   */
  const projects = await prisma.project.findMany({
    where: {
      status: {
        in: ["OPEN", "IN_PROGRESS"],
      },
      applications: {
        some: {
          volunteerId: session.user.id,
          status: "ACCEPTED",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      difficulty: true,
      mentorId: true, // 👀 useful to disable request if mentor already assigned
    },
  });

  return NextResponse.json(projects);
}
