


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "MENTOR") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { requestId } = await req.json();

//   const request = await prisma.mentorshipRequest.findUnique({
//     where: { id: requestId },
//   });

//   if (!request || request.mentorId !== session.user.id) {
//     return NextResponse.json({ error: "Invalid request" }, { status: 403 });
//   }

//   await prisma.mentorshipRequest.update({
//     where: { id: requestId },
//     data: { status: "REJECTED" },
//   });

//   const chat = await prisma.projectChat.findUnique({
//     where: { projectId: request.projectId },
//   });

//   if (chat) {
//     await prisma.chatMessage.create({
//       data: {
//         chatId: chat.id,
//         content: "❌ Mentor rejected the mentorship request.",
//         isSystem: true,
//       },
//     });
//   }

//   return NextResponse.json({ success: true });
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId } = await req.json();

  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.mentorId !== session.user.id) {
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  }

  if (request.status !== "PENDING") {
    return NextResponse.json(
      { error: "Request already handled" },
      { status: 400 }
    );
  }

  /* Reject */
  await prisma.mentorshipRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });

  /* System message (chat-first UX) */
  const chat =
    (await prisma.projectChat.findUnique({
      where: { projectId: request.projectId },
    })) ??
    (await prisma.projectChat.create({
      data: { projectId: request.projectId },
    }));

  await prisma.chatMessage.create({
    data: {
      chatId: chat.id,
      senderId: session.user.id,
      content: "❌ Mentor rejected the mentorship request.",
    },
  });

  return NextResponse.json({ success: true });
}
