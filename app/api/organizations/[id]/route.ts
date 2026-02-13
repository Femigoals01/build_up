
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { status } = await req.json();

//   const application = await prisma.application.update({
//     where: { id: params.id },
//     data: { status },
//   });

//   return NextResponse.json({ message: "Updated", application });
// }



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Next 15+ requires awaiting params
  const { id } = await context.params;

  const { status } = await req.json();

  const application = await prisma.application.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({
    message: "Updated",
    application,
  });
}
