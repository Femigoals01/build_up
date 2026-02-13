
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ count: 0 });
//   }

//   const userId = session.user.id;

//   // Count messages NOT sent by user AND not marked as read
//   const unreadCount = await prisma.chatMessage.count({
//     where: {
//       isSystem: false,
//       senderId: { not: userId },
//       reads: {
//         none: {
//           userId,
//         },
//       },
//       chat: {
//         project: {
//           OR: [
//             { organizationId: userId },
//             { mentorId: userId },
//             {
//               applications: {
//                 some: {
//                   volunteerId: userId,
//                   status: "ACCEPTED",
//                 },
//               },
//             },
//           ],
//         },
//       },
//     },
//   });

//   return NextResponse.json({ count: unreadCount });
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ count: 0 });
  }

  const userId = session.user.id;

  /**
   * Count unread messages:
   * - not sent by current user
   * - not system messages
   * - not marked as read by user
   * - user must be allowed in the project chat
   */
  const unreadCount = await prisma.chatMessage.count({
    where: {
      isSystem: false,

      // not sent by me
      senderId: { not: userId },

      // unread by me
      reads: {
        none: {
          userId,
        },
      },

      // permission rules (️(same as chat access)
      chat: {
        project: {
          OR: [
            // Organization
            { organizationId: userId },

            // Mentor
            { mentorId: userId },

            // Accepted volunteer
            {
              applications: {
                some: {
                  volunteerId: userId,
                  status: "ACCEPTED",
                },
              },
            },
          ],
        },
      },
    },
  });

  return NextResponse.json({ count: unreadCount });
}
