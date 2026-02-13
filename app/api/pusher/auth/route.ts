

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

//   const body = await req.text();
//   const params = new URLSearchParams(body);

//   const socket_id = params.get("socket_id");
//   const channel_name = params.get("channel_name");

//   if (!socket_id || !channel_name) {
//     return NextResponse.json({}, { status: 400 });
//   }

//   const auth = pusher.authorizeChannel(socket_id, channel_name, {
//     user_id: session.user.id,
//     user_info: {
//       name: session.user.name,
//       role: session.user.role,
//     },
//   });

//   return NextResponse.json(auth);
// }


import { NextResponse } from "next/server";
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 403 });
  }

  const formData = await req.formData();
  const socket_id = formData.get("socket_id") as string;
  const channel_name = formData.get("channel_name") as string;

  const authResponse = pusher.authorizeChannel(
    socket_id,
    channel_name,
    {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        role: session.user.role,
      },
    }
  );

  return NextResponse.json(authResponse);
}
