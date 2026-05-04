


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

//   if (request.status !== "PENDING") {
//     return NextResponse.json(
//       { error: "Request already handled" },
//       { status: 400 }
//     );
//   }

//   try {
//     await prisma.$transaction(async (tx) => {
//       /* 1️⃣ Accept request */
//       await tx.mentorshipRequest.update({
//         where: { id: requestId },
//         data: { status: "ACCEPTED" },
//       });

//       /* 2️⃣ Assign mentor to project */
//       await tx.project.update({
//         where: { id: request.projectId },
//         data: { mentorId: session.user.id },
//       });

//       /* 3️⃣ Ensure chat exists (SAFE) */
//       const chat = await tx.projectChat.upsert({
//         where: { projectId: request.projectId },
//         update: {},
//         create: { projectId: request.projectId },
//       });

//       /* 4️⃣ System message */
//       await tx.chatMessage.create({
//         data: {
//           chatId: chat.id,
//           content: "✅ Mentor accepted the mentorship request.",
//           isSystem: true,
//         },
//       });

//       /* 5️⃣ Notify volunteer */
//       if (request.volunteerId) {
//         await tx.notification.create({
//           data: {
//             userId: request.volunteerId,
//             title: "Mentorship Accepted 🎉",
//             message: "Your mentor has accepted the mentorship request.",
//             type: "SYSTEM",
//             link: `/dashboard/projects/${request.projectId}/chat`,
//           },
//         });
//       }
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("MENTOR ACCEPT ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to accept mentorship request" },
//       { status: 500 }
//     );
//   }
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

  try {
    await prisma.$transaction(async (tx) => {
      await tx.mentorshipRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });

      await tx.project.update({
        where: { id: request.projectId },
        data: { mentorId: session.user.id },
      });

      const chat = await tx.projectChat.upsert({
        where: { projectId: request.projectId },
        update: {},
        create: { projectId: request.projectId },
      });

      await tx.chatMessage.create({
        data: {
          chatId: chat.id,
          content: "✅ Mentor accepted the mentorship request.",
          isSystem: true,
        },
      });

      // ✅ FIXED LINK
      if (request.volunteerId) {
        await tx.notification.create({
          data: {
            userId: request.volunteerId,
            title: "Mentorship Accepted 🎉",
            message: "Your mentor has accepted the mentorship request.",
            type: "SYSTEM",
            link: `/dashboard/volunteer/projects/${request.projectId}`,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("MENTOR ACCEPT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to accept mentorship request" },
      { status: 500 }
    );
  }
}