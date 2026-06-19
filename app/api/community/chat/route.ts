




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

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const messages = await prisma.communityMessage.findMany({
//       orderBy: {
//         createdAt: "asc",
//       },
//       take: 100,
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             role: true,
//             profileImageUrl: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(messages);
//   } catch (error) {
//     console.error("COMMUNITY CHAT GET ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to load community chat messages." },
//       { status: 500 }
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

//     if (!content) {
//       return NextResponse.json(
//         { error: "Message is required." },
//         { status: 400 }
//       );
//     }

//     if (content.length > 1000) {
//       return NextResponse.json(
//         { error: "Message cannot be more than 1000 characters." },
//         { status: 400 }
//       );
//     }

//     const message = await prisma.communityMessage.create({
//       data: {
//         userId: session.user.id,
//         content,
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
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("COMMUNITY CHAT POST ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to send community chat message." },
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.communityMessage.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 100,
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

    return NextResponse.json(messages);
  } catch (error) {
    console.error("COMMUNITY CHAT GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load community chat messages." },
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
        { error: "Message or media is required." },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Message cannot be more than 1000 characters." },
        { status: 400 }
      );
    }

    if (mediaType && !["IMAGE", "VIDEO"].includes(mediaType)) {
      return NextResponse.json(
        { error: "Invalid media type." },
        { status: 400 }
      );
    }

    const message = await prisma.communityMessage.create({
      data: {
        userId: session.user.id,
        content,
        mediaUrl: mediaUrl || null,
        mediaType: mediaUrl ? mediaType || null : null,
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

    return NextResponse.json(
      {
        success: true,
        message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("COMMUNITY CHAT POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to send community chat message." },
      { status: 500 }
    );
  }
}