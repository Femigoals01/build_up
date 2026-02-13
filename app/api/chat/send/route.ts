

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import Pusher from "pusher";

// /* ================= PUSHER ================= */

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//   useTLS: true,
// });

// /* ================= POST ================= */

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { chatId, content, audioUrl } = await req.json();

//     // ✅ ALLOW TEXT OR AUDIO
//     if (!chatId || (!content && !audioUrl)) {
//   return NextResponse.json(
//     { error: "Message must have text or audio" },
//     { status: 400 }
//   );
// }

//     /* ================= CREATE MESSAGE ================= */

//     const message = await prisma.chatMessage.create({
//       data: {
//         chatId,
//         senderId: session.user.id,
//         content: content?.trim() || null,
//         audioUrl: audioUrl || null,
//       },
//       include: {
//         sender: {
//           select: { id: true, name: true, role: true },
//         },
//         reads: true,
//       },
//     });

//     /* ================= REAL-TIME BROADCAST ================= */

//     await pusher.trigger(`chat-${chatId}`, "new-message", {
//       id: message.id,
//       content: message.content,
//       audioUrl: message.audioUrl,
//       createdAt: message.createdAt,
//       isSystem: message.isSystem,
//       sender: message.sender,
//       reads: message.reads,
//     });

//     return NextResponse.json(message, { status: 201 });
//   } catch (error) {
//     console.error("CHAT SEND ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to send message" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Pusher from "pusher";

/* ================= PUSHER ================= */

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, content, audioUrl } = await req.json();

    // ✅ Allow text OR audio
    if (!chatId || (!content && !audioUrl)) {
      return NextResponse.json(
        { error: "Message must contain text or audio" },
        { status: 400 }
      );
    }

    /* ================= CREATE MESSAGE ================= */

    const message = await prisma.chatMessage.create({
      data: {
        chatId,
        senderId: session.user.id,
        content: content?.trim() ?? "", // ✅ NEVER NULL
        audioUrl: audioUrl ?? null,
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
        reads: true,
      },
    });

    /* ================= REAL-TIME ================= */

    await pusher.trigger(`chat-${chatId}`, "new-message", {
      id: message.id,
      content: message.content,
      audioUrl: message.audioUrl,
      createdAt: message.createdAt,
      isSystem: message.isSystem,
      sender: message.sender,
      reads: message.reads,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("CHAT SEND ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
