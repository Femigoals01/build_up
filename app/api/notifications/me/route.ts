

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return NextResponse.json({ notifications: [], unreadCount: 0 });
//   }

//   const notifications = await prisma.notification.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "desc" },
//     take: 10,
//   });

//   const unreadCount = notifications.filter((item) => !item.isRead).length;

//   return NextResponse.json({
//     notifications,
//     unreadCount,
//   });
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
    });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return NextResponse.json({
    notifications,
    unreadCount,
  });
}