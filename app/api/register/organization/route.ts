





// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { Role } from "@prisma/client";
// import {
//   generateEmailOtp,
//   sendVerificationEmail,
// } from "@/lib/emailVerification";

// type RegisterOrgBody = {
//   name: string;
//   email: string;
//   password: string;
//   bio?: string;
//   country?: string;
//   countryCode?: string;
//   mobileNumber?: string;
// };

// function generateUsername(name: string, email: string) {
//   const base =
//     name.toLowerCase().replace(/[^a-z0-9]+/g, "").trim() ||
//     email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "");

//   return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
// }

// export async function POST(req: Request) {
//   try {
//     const body: RegisterOrgBody = await req.json();

//     const name = body.name?.trim();
//     const email = body.email?.trim().toLowerCase();
//     const password = body.password;
//     const bio = body.bio?.trim() || undefined;
//     const country = body.country?.trim() || undefined;
//     const countryCode = body.countryCode?.trim() || undefined;
//     const mobileNumber = body.mobileNumber?.trim() || undefined;

//     if (!name || !email || !password || !country || !countryCode || !mobileNumber) {
//       return NextResponse.json(
//         { error: "Name, email, password, country, country code, and mobile number are required." },
//         { status: 400 }
//       );
//     }

//     const existing = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "Email already exists" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let username = generateUsername(name, email);

//     while (await prisma.user.findUnique({ where: { username } })) {
//       username = generateUsername(name, email);
//     }

//     const { otp, expiry } = generateEmailOtp();

//     const org = await prisma.user.create({
//       data: {
//         name,
//         username,
//         email,
//         password: hashedPassword,
//         role: Role.ORGANIZATION,
//         bio,
//         country,
//         countryCode,
//         mobileNumber,
//         emailOtp: otp,
//         emailOtpExpiry: expiry,
//         emailVerified: false,
//       },
//     });

//     await sendVerificationEmail(email, otp);

//     return NextResponse.json(
//       {
//         message: "Organization registered. Please verify your email.",
//         userId: org.id,
//         redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("ORG REGISTER ERROR:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import {
  generateEmailOtp,
  sendVerificationEmail,
} from "@/lib/emailVerification";

type RegisterOrgBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio?: string;
  country?: string;
  countryCode?: string;
  mobileNumber?: string;
};

function generateUsername(name: string, email: string) {
  const base =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "").trim() ||
    email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "");

  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(req: Request) {
  try {
    const body: RegisterOrgBody = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const bio = body.bio?.trim() || undefined;
    const country = body.country?.trim() || undefined;
    const countryCode = body.countryCode?.trim() || undefined;
    const mobileNumber = body.mobileNumber?.trim() || undefined;

    if (!name || !email || !password || !confirmPassword || !country || !countryCode || !mobileNumber) {
      return NextResponse.json(
        {
          error:
            "Name, email, password, confirm password, country, country code, and mobile number are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let username = generateUsername(name, email);

    while (await prisma.user.findUnique({ where: { username } })) {
      username = generateUsername(name, email);
    }

    const { otp, expiry } = generateEmailOtp();

    const org = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: Role.ORGANIZATION,
        bio,
        country,
        countryCode,
        mobileNumber,
        emailOtp: otp,
        emailOtpExpiry: expiry,
        emailVerified: false,
      },
    });

    await sendVerificationEmail(email, otp);

    return NextResponse.json(
      {
        message: "Organization registered. Please verify your email.",
        userId: org.id,
        email,
        redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORG REGISTER ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}