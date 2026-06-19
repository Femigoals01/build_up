




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
    const type = clean(body.type) || "LIKE";

    const allowedTypes = ["LIKE", "LOVE", "FIRE", "CELEBRATE", "SUPPORT"];

if (!allowedTypes.includes(type)) {
  return NextResponse.json(
    { error: "Invalid reaction type." },
    { status: 400 }
  );
}

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const existingReaction = await prisma.communityReaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    });

    if (existingReaction) {
      await prisma.communityReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });

      return NextResponse.json({
        success: true,
        action: "removed",
      });
    }

    await prisma.communityReaction.create({
      data: {
        postId,
        userId: session.user.id,
        type,
      },
    });


    if (post.userId !== session.user.id) {
  await prisma.user.update({
    where: {
      id: post.userId,
    },
    data: {
      communityPoints: {
        increment: 1,
      },
    },
  });
}

    if (post.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          title: "New community reaction",
          message: `${session.user.name || "Someone"} liked your community post.`,
          type: "MESSAGE",
          link: "/dashboard/community",
        },
      });
    }

    return NextResponse.json({
      success: true,
      action: "added",
    });
  } catch (error) {
    console.error("COMMUNITY REACTION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update reaction." },
      { status: 500 }
    );
  }
}