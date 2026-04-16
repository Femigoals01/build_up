



// export const runtime = "nodejs";

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { sendVerificationOtpEmail } from "@/lib/mailer";

// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       name,
//       email,
//       password,
//       country,
//       countryCode,
//       mobileNumber,
//       skills,
//       experience,
//       bio,
//     } = body;

//     if (!name || !email || !password || !country || !countryCode || !mobileNumber) {
//       return NextResponse.json(
//         {
//           error:
//             "Name, email, password, country, country code, and mobile number are required",
//         },
//         { status: 400 }
//       );
//     }

//     const trimmedName = String(name).trim();
//     const normalizedEmail = String(email).trim().toLowerCase();
//     const trimmedCountry = String(country).trim();
//     const trimmedCountryCode = String(countryCode).trim();
//     const trimmedMobileNumber = String(mobileNumber).trim();
//     const trimmedPassword = String(password);

//     if (
//       !trimmedName ||
//       !normalizedEmail ||
//       !trimmedPassword ||
//       !trimmedCountry ||
//       !trimmedCountryCode ||
//       !trimmedMobileNumber
//     ) {
//       return NextResponse.json(
//         { error: "Please fill in all required fields properly" },
//         { status: 400 }
//       );
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: { email: normalizedEmail },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 409 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

//     const baseUsername = normalizedEmail
//       .split("@")[0]
//       .toLowerCase()
//       .replace(/[^a-z0-9]/g, "");

//     let username = baseUsername;
//     let counter = 1;

//     while (
//       await prisma.user.findUnique({
//         where: { username },
//       })
//     ) {
//       username = `${baseUsername}${counter++}`;
//     }

//     const otp = generateOtp();
//     const expiry = new Date(Date.now() + 10 * 60 * 1000);

//     const newUser = await prisma.user.create({
//       data: {
//         name: trimmedName,
//         email: normalizedEmail,
//         password: hashedPassword,
//         username,
//         role: "VOLUNTEER",
//         country: trimmedCountry,
//         countryCode: trimmedCountryCode,
//         mobileNumber: trimmedMobileNumber,
//         skills: Array.isArray(skills) ? skills.join(", ") : skills?.trim() || null,
//         experience: experience?.trim() || null,
//         bio: bio?.trim() || null,
//         emailVerified: false,
//         emailOtp: otp,
//         emailOtpExpiry: expiry,
//       },
//     });

//     await sendVerificationOtpEmail(normalizedEmail, otp);

//     return NextResponse.json(
//       {
//         message: "Registration successful. Verification code sent to email.",
//         userId: newUser.id,
//         email: normalizedEmail,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//   console.error("Volunteer Registration Error:", error);

//   return NextResponse.json(
//     {
//       error:
//         process.env.NODE_ENV === "development"
//           ? error?.message || "Something went wrong"
//           : "Something went wrong",
//     },
//     { status: 500 }
//   );
// }
// }




import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import {
  generateEmailOtp,
  sendVerificationEmail,
} from "@/lib/emailVerification";

type RegisterVolunteerBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country?: string;
  countryCode?: string;
  mobileNumber?: string;
  skills?: string;
  experience?: string;
  bio?: string;
};

function generateUsername(name: string, email: string) {
  const base =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "").trim() ||
    email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "");

  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(req: Request) {
  try {
    const body: RegisterVolunteerBody = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const country = body.country?.trim() || undefined;
    const countryCode = body.countryCode?.trim() || undefined;
    const mobileNumber = body.mobileNumber?.trim() || undefined;
    const skills = body.skills?.trim() || undefined;
    const experience = body.experience?.trim() || undefined;
    const bio = body.bio?.trim() || undefined;

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

    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: Role.VOLUNTEER,
        country,
        countryCode,
        mobileNumber,
        skills,
        experience,
        bio,
        emailOtp: otp,
        emailOtpExpiry: expiry,
        emailVerified: false,
      },
    });

    await sendVerificationEmail(email, otp);

    return NextResponse.json(
      {
        message: "Volunteer registered. Please verify your email.",
        email,
        redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("VOLUNTEER REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}