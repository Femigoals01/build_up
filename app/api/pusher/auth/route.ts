

// import { NextResponse } from "next/server";
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
//     return NextResponse.json({}, { status: 403 });
//   }

//   const formData = await req.formData();
//   const socket_id = formData.get("socket_id") as string;
//   const channel_name = formData.get("channel_name") as string;

//   const authResponse = pusher.authorizeChannel(
//     socket_id,
//     channel_name,
//     {
//       user_id: session.user.id,
//       user_info: {
//         name: session.user.name,
//         role: session.user.role,
//       },
//     }
//   );

//   return NextResponse.json(authResponse);
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const socketId = String(formData.get("socket_id") || "");
    const channelName = String(formData.get("channel_name") || "");

    if (!socketId || !channelName) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const expectedChannel = `private-user-notifications-${session.user.id}`;

    if (channelName !== expectedChannel) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channelName);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}