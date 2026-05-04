

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: session.user.id,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: 12,
//     });

//     const unreadCount = notifications.filter((n) => !n.isRead).length;

//     return NextResponse.json({
//       notifications,
//       unreadCount,
//     });
//   } catch (error) {
//     console.error("Notifications fetch error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch notifications." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function normalizeNotificationLink(link: string | null) {
  if (!link) return null;

  const oldSubmitMatch = link.match(/^\/dashboard\/projects\/([^/]+)\/submit/);
  if (oldSubmitMatch?.[1]) {
    return `/dashboard/volunteer/projects/${oldSubmitMatch[1]}`;
  }

  const oldInviteMatch = link.match(/^\/dashboard\/projects\/([^/?]+)/);
  if (oldInviteMatch?.[1] && link.includes("focus=invite")) {
    return `/dashboard/organization/projects/${oldInviteMatch[1]}`;
  }

  return link;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      }),

      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
    ]);

    return NextResponse.json({
      notifications: notifications.map((notification) => ({
        ...notification,
        link: normalizeNotificationLink(notification.link),
      })),
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch notifications." },
      { status: 500 }
    );
  }
}