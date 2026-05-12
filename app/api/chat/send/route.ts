





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
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { chatId, content, audioUrl, fileUrl, fileName, fileType, fileSize } =
//       await req.json();

//     if (!chatId || (!content && !audioUrl && !fileUrl)) {
//       return NextResponse.json(
//         { error: "Message must contain text, audio, or file." },
//         { status: 400 }
//       );
//     }

//     const chat = await prisma.projectChat.findUnique({
//       where: { id: chatId },
//       include: {
//         project: {
//           include: {
//             applications: {
//               where: { status: "ACCEPTED" },
//               select: { volunteerId: true },
//             },
//           },
//         },
//       },
//     });

//     if (!chat) {
//       return NextResponse.json({ error: "Chat not found" }, { status: 404 });
//     }

//     const receiverIds = new Set<string>();

//     receiverIds.add(chat.project.organizationId);

//     if (chat.project.mentorId) {
//       receiverIds.add(chat.project.mentorId);
//     }

//     chat.project.applications.forEach((app) => {
//       receiverIds.add(app.volunteerId);
//     });

//     receiverIds.delete(session.user.id);

//     const message = await prisma.chatMessage.create({
//       data: {
//         chatId,
//         senderId: session.user.id,
//         content: content?.trim() ?? "",
//         audioUrl: audioUrl ?? null,
//         fileUrl: fileUrl ?? null,
//         fileName: fileName ?? null,
//         fileType: fileType ?? null,
//         fileSize: fileSize ?? null,
//       },
//       include: {
//         sender: {
//           select: { id: true, name: true, role: true },
//         },
//         reads: true,
//       },
//     });

//     await pusher.trigger(`chat-${chatId}`, "new-message", {
//       id: message.id,
//       content: message.content,
//       audioUrl: message.audioUrl,
//       fileUrl: message.fileUrl,
//       fileName: message.fileName,
//       fileType: message.fileType,
//       fileSize: message.fileSize,
//       createdAt: message.createdAt,
//       isSystem: message.isSystem,
//       sender: message.sender,
//       reads: message.reads,
//     });

//     await Promise.all(
//       Array.from(receiverIds).map(async (receiverId) => {
//         await prisma.notification.create({
//           data: {
//             userId: receiverId,
//             title: "New project message",
//             message: `${session.user.name || "Someone"} sent a message in "${chat.project.title}".`,
//             type: "PROJECT",
//             link: `/dashboard/projects/${chat.projectId}/chat`,
//           },
//         });

//         await pusher.trigger(
//           `private-user-notifications-${receiverId}`,
//           "notification:new",
//           {}
//         );
//       })
//     );

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

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

function buildMessagePreview({
  content,
  audioUrl,
  fileUrl,
  fileName,
}: {
  content?: string | null;
  audioUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
}) {
  if (content?.trim()) {
    return content.trim().length > 90
      ? `${content.trim().slice(0, 90)}...`
      : content.trim();
  }

  if (audioUrl) return "Sent an audio message.";
  if (fileUrl) return `Sent a file${fileName ? `: ${fileName}` : "."}`;

  return "Sent a new message.";
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, content, audioUrl, fileUrl, fileName, fileType, fileSize } =
      await req.json();

    if (!chatId || (!content && !audioUrl && !fileUrl)) {
      return NextResponse.json(
        { error: "Message must contain text, audio, or file." },
        { status: 400 }
      );
    }

    const chat = await prisma.projectChat.findUnique({
      where: { id: chatId },
      include: {
        project: {
          include: {
            applications: {
              where: { status: "ACCEPTED" },
              select: { volunteerId: true },
            },
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const receiverIds = new Set<string>();

    receiverIds.add(chat.project.organizationId);

    if (chat.project.mentorId) {
      receiverIds.add(chat.project.mentorId);
    }

    chat.project.applications.forEach((app) => {
      receiverIds.add(app.volunteerId);
    });

    receiverIds.delete(session.user.id);

    const message = await prisma.chatMessage.create({
      data: {
        chatId,
        senderId: session.user.id,
        content: content?.trim() ?? "",
        audioUrl: audioUrl ?? null,
        fileUrl: fileUrl ?? null,
        fileName: fileName ?? null,
        fileType: fileType ?? null,
        fileSize: fileSize ?? null,
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
        reads: true,
      },
    });

    await pusher.trigger(`chat-${chatId}`, "new-message", {
      id: message.id,
      content: message.content,
      audioUrl: message.audioUrl,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileType: message.fileType,
      fileSize: message.fileSize,
      createdAt: message.createdAt,
      isSystem: message.isSystem,
      sender: message.sender,
      reads: message.reads,
    });

    const messagePreview = buildMessagePreview({
      content,
      audioUrl,
      fileUrl,
      fileName,
    });

    await Promise.all(
      Array.from(receiverIds).map(async (receiverId) => {
        await prisma.notification.create({
          data: {
            userId: receiverId,
            title: "New message",
            message: `${session.user.name || "Someone"}: ${messagePreview}`,
            type: "MESSAGE",
            link: `/dashboard/projects/${chat.projectId}/chat`,
          },
        });

        await pusher.trigger(
          `private-user-notifications-${receiverId}`,
          "notification:new",
          { userId: receiverId }
        );
      })
    );

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("CHAT SEND ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}