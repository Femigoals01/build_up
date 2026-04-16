

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body?.token || "").trim();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Missing reset token." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          valid: false,
          error: "This reset link is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
    });
  } catch (error) {
    console.error("Validate reset token error:", error);

    return NextResponse.json(
      { valid: false, error: "Failed to validate reset token." },
      { status: 500 }
    );
  }
}