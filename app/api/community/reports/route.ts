


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

    const postId = clean(body.postId);
    const reason = clean(body.reason);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: "Please provide a reason for reporting this post." },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const report = await prisma.communityReport.upsert({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
      update: {
        reason,
        status: "PENDING",
      },
      create: {
        postId,
        userId: session.user.id,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Post reported successfully.",
      report,
    });
  } catch (error) {
    console.error("COMMUNITY REPORT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to report post." },
      { status: 500 }
    );
  }
}