import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // ✅ AUTH MIDDLEWARE
  io.use((socket, next) => {
    const userId = socket.handshake.auth?.userId;

    if (!userId) {
      console.log("❌ Socket rejected: no userId");
      return next(new Error("Unauthorized"));
    }

    socket.userId = userId;
    next();
  });

  console.log(" Socket.IO Initialized");

  io.on("connection", (socket) => {
    console.log(`⚡ Connected: ${socket.id} | user: ${socket.userId}`);

    // ✅ AUTO JOIN ROOM
    socket.join(socket.userId.toString());

    console.log(`📦 Joined room: ${socket.userId}`);

    // ✅ OPTIONAL DEBUG
    socket.emit("connected", {
      userId: socket.userId,
      socketId: socket.id,
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Disconnected: ${socket.id} | ${reason}`);
    });
  });

  return io;
};

export default initSocket;