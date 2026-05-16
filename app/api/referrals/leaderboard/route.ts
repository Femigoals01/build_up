

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topReferrers = await prisma.user.findMany({
      where: {
        referralCount: {
          gt: 0,
        },
      },

      orderBy: [
        {
          referralCount: "desc",
        },
        {
          referralBalance: "desc",
        },
      ],

      take: 20,

      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        referralCode: true,
        referralCount: true,
        referralBalance: true,
        profileImageUrl: true,
      },
    });

    return NextResponse.json({
      leaderboard: topReferrers,
    });
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load leaderboard",
      },
      {
        status: 500,
      }
    );
  }
}