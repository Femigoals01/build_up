



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
    const content = clean(body.content);

    if (!postId || !content) {
      return NextResponse.json(
        { error: "Post and comment are required." },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: {
        id: true,
        userId: true,
        content: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        userId: session.user.id,
        content,
      },
    });

    await prisma.user.update({
  where: {
    id: session.user.id,
  },
  data: {
    communityPoints: {
      increment: 2,
    },
  },
});

    if (post.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          title: "New community comment",
          message: `${
            session.user.name || "Someone"
          } commented on your community post.`,
          type: "MESSAGE",
          link: "/dashboard/community",
        },
      });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("COMMUNITY COMMENT CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create comment." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const commentId = clean(body.commentId);

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required." },
        { status: 400 }
      );
    }

    const comment = await prisma.communityComment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    const isOwner = comment.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "You are not allowed to delete this comment." },
        { status: 403 }
      );
    }

    await prisma.communityComment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("COMMUNITY COMMENT DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete comment." },
      { status: 500 }
    );
  }
}