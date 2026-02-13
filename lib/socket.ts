
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export function getSocketServer(server: HTTPServer) {
  if (!io) {
    io = new IOServer(server, {
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 Socket connected:", socket.id);

      socket.on("join-project", (projectId: string) => {
        socket.join(projectId);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
      });
    });
  }

  return io;
}
