



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
  ref?: string;
  referralCode?: string;
};

function generateUsername(name: string, email: string) {
  const base =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "").trim() ||
    email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "");

  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateReferralCode(name: string) {
  const base =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 6) || "user";

  return `${base}${Math.floor(100000 + Math.random() * 900000)}`;
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
    const referredByCode = body.ref?.trim() || undefined;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !country ||
      !countryCode ||
      !mobileNumber
    ) {
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


    let referrer = null;

if (referredByCode) {
  referrer = await prisma.user.findFirst({
    where: {
      referralCode: referredByCode,
    },
  });
}

    let username = generateUsername(name, email);

    while (await prisma.user.findUnique({ where: { username } })) {
      username = generateUsername(name, email);
    }

  //   const referralCode =
  // username.toUpperCase() +
  // Math.floor(100 + Math.random() * 900);

  //   let referralCode = generateReferralCode(name);

  //   while (await prisma.user.findFirst({ where: { referralCode } })) {
  //     referralCode = generateReferralCode(name);
  //   }


  let referralCode =
  username.toUpperCase() +
  Math.floor(100 + Math.random() * 900);

while (await prisma.user.findFirst({ where: { referralCode } })) {
  referralCode =
    username.toUpperCase() +
    Math.floor(100 + Math.random() * 900);
}

    const { otp, expiry } = generateEmailOtp();

    const newUser = await prisma.user.create({
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
        referralCode,
        referredByCode: referredByCode?.toUpperCase() || null,
      },
    });


    if (referrer) {
  await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredId: newUser.id,
      code: referredByCode!,
    },
  });

  await prisma.user.update({
    where: {
      id: referrer.id,
    },
    data: {
      referralCount: {
        increment: 1,
      },
    },
  });
}

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