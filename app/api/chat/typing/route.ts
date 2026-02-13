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
//     return NextResponse.json({}, { status: 401 });
//   }

//   const { chatId } = await req.json();

//   await pusher.trigger(`chat-${chatId}`, "typing", {
//     userName: session.user.name,
//   });

//   return NextResponse.json({ ok: true });
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = await req.json();

  if (!chatId) {
    return NextResponse.json({ error: "chatId required" }, { status: 400 });
  }

  // 🔔 Broadcast typing event
  await pusher.trigger(`chat-${chatId}`, "typing", {
    userId: session.user.id,
    userName: session.user.name,
  });

  return NextResponse.json({ success: true });
}
