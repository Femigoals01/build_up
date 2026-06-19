

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalPosts,
      totalComments,
      totalReactions,
      totalMessages,
      pendingReports,
      reports,
      recentPosts,
    ] = await Promise.all([
      prisma.communityPost.count(),
      prisma.communityComment.count(),
      prisma.communityReaction.count(),
      prisma.communityMessage.count(),
      prisma.communityReport.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.communityReport.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
              profileImageUrl: true,
            },
          },
          post: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
      }),

      prisma.communityPost.findMany({
        orderBy: [
          {
            isPinned: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        take: 50,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
              profileImageUrl: true,
            },
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
              reports: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalPosts,
        totalComments,
        totalReactions,
        totalMessages,
        pendingReports,
      },
      reports,
      recentPosts,
    });
  } catch (error) {
    console.error("ADMIN COMMUNITY GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load community admin data." },
      { status: 500 }
    );
  }
}