
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { name, email, password, bio } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const existing = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existing) {
//       return NextResponse.json({ error: "Email already exists" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const org = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: "ORGANIZATION",
//         bio,
//       },
//     });

//     return NextResponse.json({ message: "Organization registered", org });
//   } catch (error) {
//     console.error("ORG REGISTER ERROR:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

type RegisterOrgBody = {
  name: string;
  email: string;
  password: string;
  bio?: string;
};

function generateUsername(name: string, email: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .trim() ||
    email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "");

  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(req: Request) {
  try {
    const body: RegisterOrgBody = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const bio = body.bio?.trim() || undefined;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let username = generateUsername(name, email);

    while (await prisma.user.findUnique({ where: { username } })) {
      username = generateUsername(name, email);
    }

    const org = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: Role.ORGANIZATION,
        bio,
      },
    });

    return NextResponse.json(
      { message: "Organization registered", org },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORG REGISTER ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}