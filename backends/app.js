import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import productRoutes from "./routes/productRoute.js";
import userRoutes from "./routes/userRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import notificationRoutes from "./routes/notificationRoute.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import roleRoutes from "./routes/roleRoute.js"
dotenv.config();

const app = express();

// ✅ SECURITY
app.use(helmet());

// ✅ CORS (DEV + PROD SAFE)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

// ✅ BODY LIMIT
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

// ✅ RATE LIMIT (global light)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// ✅ ROUTES
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", brandRoutes);
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/roles", roleRoutes);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("✅ Backend running perfectly!");
});

// ✅ 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;