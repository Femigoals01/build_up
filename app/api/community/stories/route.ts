



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// function clean(value: unknown) {
//   return String(value || "").trim();
// }




// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     const stories = await prisma.communityStory.findMany({
//       where: {
//         expiresAt: {
//           gt: new Date(),
//         },
//       },

//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             role: true,
//             profileImageUrl: true,
//           },
//         },

//         views: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 profileImageUrl: true,
//               },
//             },
//           },
//         },

//         reactions: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 profileImageUrl: true,
//               },
//             },
//           },
//         },

//         _count: {
//           select: {
//             views: true,
//             reactions: true,
//           },
//         },
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const formatted = stories.map((story) => ({
//       ...story,

//       viewCount: story._count.views,

//       reactionCount: story._count.reactions,

//       viewedByMe: session?.user?.id
//         ? story.views.some(
//             (view) =>
//               view.user.id === session.user.id
//           )
//         : false,

//       reactedByMe: session?.user?.id
//         ? story.reactions.some(
//             (reaction) =>
//               reaction.user.id === session.user.id
//           )
//         : false,
//     }));

//     return NextResponse.json(formatted);
//   } catch (error) {
//     console.error(
//       "COMMUNITY STORIES GET ERROR:",
//       error
//     );

//     return NextResponse.json(
//       {
//         error:
//           "Failed to load stories.",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const content = clean(body.content);
//     const mediaUrl = clean(body.mediaUrl);
//     const mediaType = clean(body.mediaType);

//     if (!content && !mediaUrl) {
//       return NextResponse.json(
//         { error: "Story content or media is required." },
//         { status: 400 }
//       );
//     }

//     if (content.length > 280) {
//       return NextResponse.json(
//         { error: "Story text cannot be more than 280 characters." },
//         { status: 400 }
//       );
//     }

//     if (mediaType && !["IMAGE", "VIDEO"].includes(mediaType)) {
//       return NextResponse.json(
//         { error: "Invalid media type." },
//         { status: 400 }
//       );
//     }

//     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

//    const story =
// await prisma.communityStory.create({
//   data: {
//     userId: session.user.id,

//     content,

//     mediaUrl,

//     mediaType,

//     expiresAt:
//       new Date(
//         Date.now() +
//           24 *
//             60 *
//             60 *
//             1000
//       ),
//   },
// });

// await prisma.user.update({
//   where: {
//     id: session.user.id,
//   },

//   data: {
//     communityPoints: {
//       increment: 10,
//     },
//   },
// });

// return NextResponse.json({
//   success: true,
//   story,
// });

//     await prisma.user.update({
//       where: {
//         id: session.user.id,
//       },
//       data: {
//         communityPoints: {
//           increment: 3,
//         },
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         story,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("COMMUNITY STORIES POST ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to create community story." },
//       { status: 500 }
//     );
//   }
// }



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

    const stories = await prisma.communityStory.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            profileImageUrl: true,
          },
        },
        views: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            views: true,
            reactions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = stories.map((story) => ({
      ...story,
      viewCount: story._count.views,
      reactionCount: story._count.reactions,
      viewedByMe: session?.user?.id
        ? story.views.some((view) => view.user.id === session.user.id)
        : false,
      reactedByMe: session?.user?.id
        ? story.reactions.some(
            (reaction) => reaction.user.id === session.user.id
          )
        : false,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("COMMUNITY STORIES GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load stories." },
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

    const content = clean(body.content);
    const mediaUrl = clean(body.mediaUrl);
    const mediaType = clean(body.mediaType);

    if (!content && !mediaUrl) {
      return NextResponse.json(
        { error: "Story content or media is required." },
        { status: 400 }
      );
    }

    if (content.length > 280) {
      return NextResponse.json(
        { error: "Story text cannot be more than 280 characters." },
        { status: 400 }
      );
    }

    if (mediaType && !["IMAGE", "VIDEO"].includes(mediaType)) {
      return NextResponse.json(
        { error: "Invalid media type." },
        { status: 400 }
      );
    }

    const story = await prisma.communityStory.create({
      data: {
        userId: session.user.id,
        content,
        mediaUrl: mediaUrl || null,
        mediaType: mediaUrl ? mediaType || null : null,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
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
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        communityPoints: {
          increment: 10,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        story,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("COMMUNITY STORIES POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create community story." },
      { status: 500 }
    );
  }
}