






// export const runtime = "nodejs";

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
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Volunteer registered successfully",
//         userId: newUser.id,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Volunteer Registration Error:", error);
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
import { sendVerificationOtpEmail } from "@/lib/mailer";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      country,
      countryCode,
      mobileNumber,
      skills,
      experience,
      bio,
    } = body;

    if (!name || !email || !password || !country || !countryCode || !mobileNumber) {
      return NextResponse.json(
        {
          error:
            "Name, email, password, country, country code, and mobile number are required",
        },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedCountry = String(country).trim();
    const trimmedCountryCode = String(countryCode).trim();
    const trimmedMobileNumber = String(mobileNumber).trim();
    const trimmedPassword = String(password);

    if (
      !trimmedName ||
      !normalizedEmail ||
      !trimmedPassword ||
      !trimmedCountry ||
      !trimmedCountryCode ||
      !trimmedMobileNumber
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields properly" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const baseUsername = normalizedEmail
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

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
        username,
        role: "VOLUNTEER",
        country: trimmedCountry,
        countryCode: trimmedCountryCode,
        mobileNumber: trimmedMobileNumber,
        skills: Array.isArray(skills) ? skills.join(", ") : skills?.trim() || null,
        experience: experience?.trim() || null,
        bio: bio?.trim() || null,
        emailVerified: false,
        emailOtp: otp,
        emailOtpExpiry: expiry,
      },
    });

    await sendVerificationOtpEmail(normalizedEmail, otp);

    return NextResponse.json(
      {
        message: "Registration successful. Verification code sent to email.",
        userId: newUser.id,
        email: normalizedEmail,
      },
      { status: 201 }
    );
  } catch (error: any) {
  console.error("Volunteer Registration Error:", error);

  return NextResponse.json(
    {
      error:
        process.env.NODE_ENV === "development"
          ? error?.message || "Something went wrong"
          : "Something went wrong",
    },
    { status: 500 }
  );
}
}