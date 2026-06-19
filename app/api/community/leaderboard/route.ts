


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



function getCommunityBadge(points: number) {
  if (points >= 1000) {
    return {
      title: "Community Legend",
      icon: "🏆",
    };
  }

  if (points >= 600) {
    return {
      title: "BuildUp Champion",
      icon: "🥇",
    };
  }

  if (points >= 300) {
    return {
      title: "Community Builder",
      icon: "🥈",
    };
  }

  if (points >= 150) {
    return {
      title: "Active Contributor",
      icon: "🥉",
    };
  }

  if (points >= 50) {
    return {
      title: "Community Starter",
      icon: "⭐",
    };
  }

  return {
    title: "New Member",
    icon: "🌱",
  };
}

export async function GET() {
  try {
    const [posts, comments] = await Promise.all([
      prisma.communityPost.groupBy({
        by: ["userId"],
        _count: {
          _all: true,
        },
      }),

      prisma.communityComment.groupBy({
        by: ["userId"],
        _count: {
          _all: true,
        },
      }),
    ]);

    const scoreMap = new Map<
      string,
      {
        userId: string;
        posts: number;
        comments: number;
      }
    >();

    posts.forEach((item) => {
      scoreMap.set(item.userId, {
        userId: item.userId,
        posts: item._count._all,
        comments: 0,
      });
    });

    comments.forEach((item) => {
      const existing = scoreMap.get(item.userId);

      if (existing) {
        existing.comments = item._count._all;
      } else {
        scoreMap.set(item.userId, {
          userId: item.userId,
          posts: 0,
          comments: item._count._all,
        });
      }
    });

    const scores = Array.from(scoreMap.values())
      .map((item) => ({
        ...item,
        score: item.posts * 3 + item.comments,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // const users = await prisma.user.findMany({
    //   where: {
    //     id: {
    //       in: scores.map((item) => item.userId),
    //     },
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     role: true,
    //     profileImageUrl: true,
    //   },
    // });

    const users = await prisma.user.findMany({
  where: {
    communityPoints: {
      gt: 0,
    },
  },

  orderBy: {
    communityPoints: "desc",
  },

  take: 50,

  select: {
    id: true,
    name: true,
    role: true,
    profileImageUrl: true,
    communityPoints: true,
  },
});

    const userMap = new Map(users.map((user) => [user.id, user]));

    // const leaderboard = scores.map((item, index) => ({
    //   rank: index + 1,
    //   score: item.score,
    //   posts: item.posts,
    //   comments: item.comments,
    //   user: userMap.get(item.userId),
    // }));

    // return NextResponse.json(leaderboard);



    const leaderboard = users.map((user, index) => ({
  rank: index + 1,

  points: user.communityPoints,

  badge: getCommunityBadge(user.communityPoints),

  user: {
    id: user.id,
    name: user.name,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
  },
}));

return NextResponse.json(leaderboard);



  } catch (error) {
    console.error("COMMUNITY LEADERBOARD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load community leaderboard." },
      { status: 500 }
    );
  }
}