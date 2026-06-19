







import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const posts = await prisma.communityPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            profileImageUrl: true,
          },
        },

        poll: {
  include: {
    options: {
      include: {
        votes: {
          select: {
            userId: true,
          },
        },
      },
    },
  },
},

        comments: {
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
          orderBy: {
            createdAt: "asc",
          },
        },

        // reactions: {
        //   select: {
        //     id: true,
        //     type: true,
        //     userId: true,
        //   },
        // },

        reactions: {
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

        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },

      orderBy: [
        {
          isPinned: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 100,
    });

    // const formattedPosts = posts.map((post) => ({
    //   ...post,
    //   reactionCount: post._count.reactions,
    //   commentCount: post._count.comments,
    //   reactedByMe: session?.user?.id
    //     ? post.reactions.some((reaction) => reaction.userId === session.user.id)
    //     : false,
    //   canPin: session?.user?.role === "ADMIN",
    //   canDelete:
    //     session?.user?.role === "ADMIN" ||
    //     (session?.user?.id ? post.userId === session.user.id : false),
    // }));



    const formattedPosts = posts.map((post) => ({
  ...post,

  poll: post.poll
    ? {
        ...post.poll,

        totalVotes: post.poll.options.reduce(
          (sum, option) => sum + option.votes.length,
          0
        ),

        hasVoted: session?.user?.id
          ? post.poll.options.some((option) =>
              option.votes.some(
                (vote) => vote.userId === session.user.id
              )
            )
          : false,
      }
    : null,

  reactionCount: post._count.reactions,
  commentCount: post._count.comments,

  reactedByMe: session?.user?.id
    ? post.reactions.some(
        (reaction) => reaction.userId === session.user.id
      )
    : false,

  canPin: session?.user?.role === "ADMIN",

  canDelete:
    session?.user?.role === "ADMIN" ||
    (session?.user?.id
      ? post.userId === session.user.id
      : false),
}));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("COMMUNITY POSTS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load community posts." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const category = clean(body.category);
    const content = clean(body.content);
    const imageUrl = clean(body.imageUrl);

    const pollQuestion = clean(body.pollQuestion);
const pollOptions = Array.isArray(body.pollOptions)
  ? body.pollOptions
  : [];

    // if (!content && !imageUrl) {

    if (!content && !imageUrl && !pollQuestion) {
      return NextResponse.json(
        {
          error: "Please provide post content or an image.",
        },
        { status: 400 }
      );
    }

    

//     const post = await prisma.communityPost.create({
//   data: {
//     userId: session.user.id,
//     category: category || "GENERAL",
//     content,
//     imageUrl: imageUrl || null,
//   },
// });

const post = await prisma.communityPost.create({
  data: {
    userId: session.user.id,
    category: category || "GENERAL",
    content,
    imageUrl: imageUrl || null,

    poll:
      pollQuestion && pollOptions.length >= 2
        ? {
            create: {
              question: pollQuestion,

              options: {
                create: pollOptions
                  .filter((option: string) => option.trim())
                  .map((option: string) => ({
                    text: option.trim(),
                  })),
              },
            },
          }
        : undefined,
  },
});

await prisma.user.update({
  where: {
    id: session.user.id,
  },
  data: {
    communityPoints: {
      increment: 5,
    },
  },
});

    return NextResponse.json(post);
  } catch (error) {
    console.error("COMMUNITY POSTS POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const postId = clean(body.postId);
    const action = clean(body.action);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    if (!["PIN", "UNPIN"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

   const post = await prisma.communityPost.findUnique({
  where: {
    id: postId,
  },
  select: {
    id: true,
    userId: true,
    isPinned: true,
  },
});

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    // const updatedPost = await prisma.communityPost.update({
    //   where: {
    //     id: postId,
    //   },
    //   data: {
    //     isPinned: action === "PIN",
    //   },
    // });

    const shouldPin = action === "PIN";

const updatedPost = await prisma.communityPost.update({
  where: {
    id: postId,
  },
  data: {
    isPinned: shouldPin,
  },
});

// if (shouldPin && post.userId !== session.user.id && !post.isPinned) {
//   await prisma.notification.create({
//     data: {
//       userId: post.userId,
//       title: "Your community post was pinned",
//       message: "An admin pinned your community post as an important announcement.",
//       type: "SYSTEM",
//       link: "/dashboard/community",
//     },
//   });
// }

if (shouldPin && post.userId !== session.user.id && !post.isPinned) {
  await prisma.notification.create({
    data: {
      userId: post.userId,
      title: "Your community post was pinned",
      message: "An admin pinned your community post as an important announcement.",
      type: "SYSTEM",
      link: "/dashboard/community",
    },
  });

  await prisma.user.update({
    where: {
      id: post.userId,
    },
    data: {
      communityPoints: {
        increment: 10,
      },
    },
  });
}

    return NextResponse.json({
      success: true,
      message:
        action === "PIN"
          ? "Post pinned successfully."
          : "Post unpinned successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("COMMUNITY POST PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update post." },
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
    const postId = clean(body.postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const isOwner = post.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "You are not allowed to delete this post." },
        { status: 403 }
      );
    }

    await prisma.communityPost.delete({
      where: {
        id: postId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("COMMUNITY POST DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete post." },
      { status: 500 }
    );
  }
}