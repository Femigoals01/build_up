




export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const REFERRAL_REWARD_THRESHOLD = 20;
const REFERRAL_REWARD_NAIRA = 1000;
const REFERRAL_REWARD_KOBO = REFERRAL_REWARD_NAIRA * 100;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    if (!user.emailOtp || !user.emailOtpExpiry) {
      return NextResponse.json(
        { error: "No active verification code found" },
        { status: 400 }
      );
    }

    if (user.emailOtp !== otp) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (user.emailOtpExpiry.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const verifiedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailOtp: null,
          emailOtpExpiry: null,
        },
      });

      const referredByCode = verifiedUser.referredByCode?.trim().toUpperCase();

      if (!referredByCode) return;

      const referrer = await tx.user.findFirst({
        where: {
          referralCode: referredByCode,
          id: {
            not: verifiedUser.id,
          },
        },
        select: {
          id: true,
          name: true,
          referralCode: true,
        },
      });

      if (!referrer?.referralCode) return;

      const existingReferral = await tx.referral.findUnique({
        where: {
          referredId: verifiedUser.id,
        },
        select: {
          id: true,
        },
      });

      if (!existingReferral) {
        await tx.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: verifiedUser.id,
            code: referrer.referralCode,
          },
        });
      }

      const verifiedReferralCount = await tx.referral.count({
        where: {
          referrerId: referrer.id,
          referred: {
            emailVerified: true,
          },
        },
      });

      await tx.user.update({
        where: { id: referrer.id },
        data: {
          referralCount: verifiedReferralCount,
        },
      });

      const unpaidVerifiedReferrals = await tx.referral.findMany({
        where: {
          referrerId: referrer.id,
          rewardPaid: false,
          referred: {
            emailVerified: true,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: REFERRAL_REWARD_THRESHOLD,
        select: {
          id: true,
        },
      });

      if (unpaidVerifiedReferrals.length < REFERRAL_REWARD_THRESHOLD) return;

      await tx.referral.updateMany({
        where: {
          id: {
            in: unpaidVerifiedReferrals.map((referral) => referral.id),
          },
        },
        data: {
          rewardPaid: true,
        },
      });

      await tx.user.update({
        where: { id: referrer.id },
        data: {
          referralBalance: {
            increment: REFERRAL_REWARD_NAIRA,
          },
        },
      });

      await tx.wallet.upsert({
        where: {
          userId: referrer.id,
        },
        create: {
          userId: referrer.id,
          available: REFERRAL_REWARD_KOBO,
          pending: 0,
          withdrawn: 0,
        },
        update: {
          available: {
            increment: REFERRAL_REWARD_KOBO,
          },
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: referrer.id,
          type: "PROJECT_EARNING",
          amount: REFERRAL_REWARD_KOBO,
          status: "COMPLETED",
          description: `Referral reward: ₦${REFERRAL_REWARD_NAIRA.toLocaleString(
            "en-NG"
          )} for ${REFERRAL_REWARD_THRESHOLD} verified referrals.`,
        },
      });

      await tx.notification.create({
        data: {
          userId: referrer.id,
          type: "PAYMENT",
          title: "Referral reward unlocked 🎉",
          message: `You earned ₦${REFERRAL_REWARD_NAIRA.toLocaleString(
            "en-NG"
          )} for bringing ${REFERRAL_REWARD_THRESHOLD} verified users to BuildUp.`,
          link: "/dashboard/referrals",
        },
      });
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify Email Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}