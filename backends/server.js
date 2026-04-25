import http from "http";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import connectDatabase from "./config/database.js";
import app from "./app.js";
import { initSocket } from "./socket/connection.js";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDatabase();

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const server = http.createServer(app);
    const io = initSocket(server);
    app.set("io", io);

    const PORT = Number(process.env.PORT) || 4000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // ✅ Graceful shutdown
    process.on("SIGINT", () => {
      console.log("⚠️ SIGINT received. Closing server...");
      server.close(() => process.exit(0));
    });

  } catch (err) {
    console.error(`❌ Startup Error: ${err.message}`);
    process.exit(1);
  }
};

startServer();

export default startServer;