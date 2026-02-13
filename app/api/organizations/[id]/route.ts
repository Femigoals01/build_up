
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



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function PATCH(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // ✅ Next 15+ requires awaiting params
//   const { id } = await context.params;

//   const { status } = await req.json();

//   const application = await prisma.application.update({
//     where: { id },
//     data: { status },
//   });

//   return NextResponse.json({
//     message: "Updated",
//     application,
//   });
// }


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, password, bio } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔹 Auto-generate username from email
    const baseUsername = email.split("@")[0];
    const username = `${baseUsername}-${Date.now()}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const org = await prisma.user.create({
      data: {
        name,
        username, // ✅ REQUIRED FIX
        email,
        password: hashedPassword,
        role: "ORGANIZATION",
        bio: bio ?? null,
      },
    });

    return NextResponse.json(
      { message: "Organization registered successfully", user: org },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORG REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to register organization" },
      { status: 500 }
    );
  }
}
