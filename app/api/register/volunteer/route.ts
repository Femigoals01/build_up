
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { name, email, password, skills, experience, bio } = await req.json();

//     // Check if user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//   const newUser = await prisma.user.create({
//   data: {
//     name,
//     email,
//     password: hashedPassword,
//     role: "VOLUNTEER",
//     skills,
//     experience,
//     bio,
//   },
// });


//     return NextResponse.json({ message: "User registered", user: newUser });
//   } catch (error) {
//     console.log("Registration Error:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }


// export const runtime = "nodejs";

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { name, email, password, skills, experience, bio } = await req.json();

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: "VOLUNTEER",
//         skills,
//         experience,
//         bio,
//       },
//     });

//     return NextResponse.json(
//       { message: "User registered", user: newUser },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }


export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password, skills, experience, bio } = body;

    /* ================= VALIDATION ================= */

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= CHECK EXISTING USER ================= */

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    /* ================= PASSWORD ================= */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= USERNAME GENERATION ================= */

    const baseUsername = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    let username = baseUsername;
    let counter = 1;

    while (
      await prisma.user.findUnique({
        where: { username },
      })
    ) {
      username = `${baseUsername}${counter++}`;
    }

    /* ================= CREATE USER ================= */

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
        role: "VOLUNTEER",
        skills: Array.isArray(skills) ? skills.join(", ") : skills ?? null,
        experience: experience ?? null,
        bio: bio ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Volunteer registered successfully",
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Volunteer Registration Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
