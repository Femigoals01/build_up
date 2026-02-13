// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// /* ================= HELPER ================= */

// function generateUsername(name: string) {
//   const base = name
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, "")
//     .slice(0, 12);

//   const random = Math.floor(100 + Math.random() * 900);
//   return `${base}${random}`;
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       name,
//       email,
//       password,
//       expertise,
//       experience,
//       bio,
//     } = body;

//     /* ================= VALIDATION ================= */

//     if (!name || !email || !password || !expertise || !experience || !bio) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     /* ================= CHECK EMAIL ================= */

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Email already registered" },
//         { status: 409 }
//       );
//     }

//     /* ================= PASSWORD ================= */

//     const hashedPassword = await bcrypt.hash(password, 10);

//     /* ================= USERNAME ================= */

//     let username = generateUsername(name);

//     // ensure uniqueness
//     while (await prisma.user.findUnique({ where: { username } })) {
//       username = generateUsername(name);
//     }

//     /* ================= CREATE MENTOR ================= */

//     const mentor = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         username,
//         role: "MENTOR",

//         // schema-aligned fields
//         skills: expertise,
//         experience,
//         bio,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Mentor registered successfully",
//         mentorId: mentor.id,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("MENTOR REGISTRATION ERROR:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// /* ================= REGISTER MENTOR ================= */

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       name,
//       email,
//       password,
//       expertise,
//       experience,
//       portfolio,
//       bio,
//     } = body;

//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     /* 🔎 Check if user exists */
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 409 }
//       );
//     }

//     /* 🔐 Hash password */
//     const hashedPassword = await bcrypt.hash(password, 10);

//     /* 🆔 Generate username */
//     const baseUsername = name.toLowerCase().replace(/\s+/g, "");
//     const uniqueUsername = `${baseUsername}${Math.floor(
//       1000 + Math.random() * 9000
//     )}`;

//     /* ✅ Create mentor */
//     const mentor = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         username: uniqueUsername,
//         role: "MENTOR",
//         skills: expertise,
//         experience: experience?.toString(),
//         bio,
//       },
//     });

//     return NextResponse.json(
//       { success: true, mentorId: mentor.id },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("MENTOR REGISTRATION FAILED:", error);

//     return NextResponse.json(
//       { error: "Mentor registration failed" },
//       { status: 500 }
//     );
//   }
// }




// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       name,
//       email,
//       password,
//       expertise,
//       experience,
//       portfolio,
//       bio,
//     } = body;

//     /* ================= VALIDATION ================= */

//     if (!name || !email || !password || !expertise || !experience || !bio) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     /* ================= CHECK EXISTING USER ================= */

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Email already in use" },
//         { status: 409 }
//       );
//     }

//     /* ================= PASSWORD HASH ================= */

//     const hashedPassword = await bcrypt.hash(password, 10);

//     /* ================= USERNAME GENERATION ================= */

//     const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
//     let username = baseUsername;
//     let counter = 1;

//     while (
//       await prisma.user.findUnique({
//         where: { username },
//       })
//     ) {
//       username = `${baseUsername}${counter++}`;
//     }

//     /* ================= CREATE MENTOR ================= */

//     await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         username,
//         role: "MENTOR",
//         experience: `${experience} years`,
//         skills: expertise,
//         bio,
//       },
//     });

//     return NextResponse.json(
//       { success: true },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Mentor registration error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      expertise,
      experience,
      bio,
    } = await req.json();

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MENTOR",
        mentorStatus: "PENDING", // 🔒 IMPORTANT
        skills: expertise,
        experience,
        bio,
        username: email.split("@")[0],
      },
    });

    return NextResponse.json(
      { message: "Mentor registered. Awaiting approval." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Mentor Registration Error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
