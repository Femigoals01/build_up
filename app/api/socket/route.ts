// import { Server } from "socket.io";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// let io: Server | null = null;

// export async function GET(req: Request) {
//   if (!io) {
//     const server = (global as any).httpServer;

//     io = new Server(server, {
//       path: "/api/socket",
//       cors: {
//         origin: "*",
//       },
//     });

//     io.on("connection", (socket) => {
//       console.log("🟢 Socket connected:", socket.id);

//       socket.on("join", (chatId: string) => {
//         socket.join(chatId);
//         console.log(`Socket joined chat ${chatId}`);
//       });

//       socket.on(
//         "message",
//         async ({
//           chatId,
//           content,
//           senderId,
//         }: {
//           chatId: string;
//           content: string;
//           senderId: string;
//         }) => {
//           const message = await prisma.chatMessage.create({
//             data: {
//               chatId,
//               senderId,
//               content,
//             },
//             include: {
//               sender: {
//                 select: { id: true, name: true, role: true },
//               },
//             },
//           });

//           io?.to(chatId).emit("message", message);
//         }
//       );

//       socket.on("disconnect", () => {
//         console.log("🔴 Socket disconnected:", socket.id);
//       });
//     });
//   }

//   return NextResponse.json({ ok: true });
// }
