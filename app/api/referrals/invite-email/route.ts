

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        referralCode: true,
      },
    });

    if (!user?.referralCode) {
      return NextResponse.json(
        { error: "Referral code not found." },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://build-up-nine.vercel.app";

    const referralLink = `${appUrl}/register/volunteer?ref=${user.referralCode}`;

    await sendEmail({
      to: email,
      subject: `${user.name} invited you to join BuildUp`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2>You’re invited to BuildUp</h2>
          <p>${user.name} invited you to join BuildUp — a platform for building real experience through projects, mentorship, and proof-of-work portfolios.</p>
          <p>
            <a href="${referralLink}" style="display:inline-block;background:#2563eb;color:white;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:bold">
              Join BuildUp
            </a>
          </p>
          <p>Referral link: ${referralLink}</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Invitation sent successfully.",
    });
  } catch (error) {
    console.error("Invite email error:", error);

    return NextResponse.json(
      { error: "Failed to send invitation." },
      { status: 500 }
    );
  }
}