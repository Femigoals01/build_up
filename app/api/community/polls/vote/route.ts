


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const pollId = clean(body.pollId);
    const optionId = clean(body.optionId);

    if (!pollId || !optionId) {
      return NextResponse.json(
        { error: "Poll and option are required." },
        { status: 400 }
      );
    }

    const option = await prisma.communityPollOption.findFirst({
      where: {
        id: optionId,
        pollId,
      },
      select: {
        id: true,
        pollId: true,
      },
    });

    if (!option) {
      return NextResponse.json(
        { error: "Poll option not found." },
        { status: 404 }
      );
    }

    await prisma.communityPollVote.deleteMany({
      where: {
        userId: session.user.id,
        option: {
          pollId,
        },
      },
    });

    await prisma.communityPollVote.create({
      data: {
        optionId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully.",
    });
  } catch (error) {
    console.error("COMMUNITY POLL VOTE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to record vote." },
      { status: 500 }
    );
  }
}