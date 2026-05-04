



// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import Pusher from "pusher";

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//   useTLS: true,
// });

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const {
//     conversationId,
//     content,
//     audioUrl,
//     fileUrl,
//     fileName,
//     fileType,
//     fileSize,
//   } = await req.json();

//   if (!conversationId) {
//     return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
//   }

//   const message = await prisma.directMessage.create({
//     data: {
//       conversationId,
//       senderId: session.user.id,
//       content: content?.trim() || "",
//       audioUrl: audioUrl || null,
//       fileUrl: fileUrl || null,
//       fileName: fileName || null,
//       fileType: fileType || null,
//       fileSize: fileSize || null,
//     },
//     include: {
//       sender: {
//         select: { id: true, name: true, role: true },
//       },
//       reads: true,
//     },
//   });

//   await pusher.trigger(`direct-${conversationId}`, "new-message", message);

//   return NextResponse.json(message);
// }






import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      conversationId,
      content,
      audioUrl,
      fileUrl,
      fileName,
      fileType,
      fileSize,
    } = await req.json();

    if (!conversationId || (!content && !audioUrl && !fileUrl)) {
      return NextResponse.json(
        { error: "Message must contain text, audio, or file." },
        { status: 400 }
      );
    }

    const conversation = await prisma.directConversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.userId === session.user.id
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await prisma.directMessage.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: content?.trim() || "",
        audioUrl: audioUrl || null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        fileSize: fileSize || null,
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
        reads: true,
      },
    });

    await pusher.trigger(`direct-${conversationId}`, "new-message", message);

    const receivers = conversation.participants.filter(
      (p) => p.userId !== session.user.id
    );

    await Promise.all(
      receivers.map(async (receiver) => {
        await prisma.notification.create({
          data: {
            userId: receiver.userId,
            title: "New message",
            message: `${session.user.name || "Someone"} sent you a message.`,
            type: "SYSTEM",
            link: `/dashboard/messages/${conversationId}`,
          },
        });

        await pusher.trigger(
          `private-user-notifications-${receiver.userId}`,
          "notification:new",
          {}
        );
      })
    );

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("DIRECT CHAT SEND ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send direct message" },
      { status: 500 }
    );
  }
}