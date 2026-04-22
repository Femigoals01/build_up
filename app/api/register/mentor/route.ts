



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  generateEmailOtp,
  sendVerificationEmail,
} from "@/lib/emailVerification";

type MentorRegisterBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  expertise: string;
  experience: string;
  bio: string;
  portfolio?: string;
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
    const body: MentorRegisterBody = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const expertise = body.expertise?.trim();
    const experience = body.experience?.trim();
    const bio = body.bio?.trim();
    const portfolio = body.portfolio?.trim() || undefined;
    const country = body.country?.trim() || undefined;
    const countryCode = body.countryCode?.trim() || undefined;
    const mobileNumber = body.mobileNumber?.trim() || undefined;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !expertise ||
      !experience ||
      !bio ||
      !country ||
      !countryCode ||
      !mobileNumber
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email, password, confirm password, expertise, experience, bio, country, country code, and mobile number are required.",
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
        { error: "User already exists" },
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
        email,
        password: hashedPassword,
        role: "MENTOR",
        mentorStatus: "PENDING",
        skills: expertise,
        experience,
        bio,
        username,
        linkedinUrl: portfolio || null,
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
        message: "Mentor registered. Please verify your email first.",
        email,
        redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
      },
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