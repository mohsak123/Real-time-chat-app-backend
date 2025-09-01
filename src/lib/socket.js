import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:3000", 
  "https://real-time-chat-app-frontend-alpha.vercel.app"
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});

export function getReceiveSocketId(userId){
  return userSocketMap[userId]
}

const userSocketMap = {};

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if(userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers",Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    // console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

export { server, io, app };