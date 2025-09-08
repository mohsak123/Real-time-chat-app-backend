import express from "express";
import http from "http"; // <-- 1. This was missing!
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { initializeSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 2. Configure Socket.IO CORS
const io = new Server(server, {
  cors: {
    origin: "https://real-time-chat-app-frontend-alpha.vercel.app",
    methods: ["GET", "POST"]
  }
});

initializeSocket(io);

// 3. Use ONE specific CORS configuration for Express API routes
// Place this BEFORE your routes
app.use(cors({
  origin: "https://real-time-chat-app-frontend-alpha.vercel.app",
  credentials: true,
}));

// Middlewares for parsing request bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log("server running on PORT: " + PORT);
  connectDB();
});