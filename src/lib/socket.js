export function getReceiveSocketId(userId){
  return userSocketMap[userId]
}

const userSocketMap = {};

export function initializeSocket(io) {
  io.on("connection", (socket) => {
    // console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    // إرسال قائمة المستخدمين المتصلين للجميع
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      // console.log("A user disconnected", socket.id);
      if (userId && userId !== "undefined") {
        delete userSocketMap[userId];
      }
      // تحديث قائمة المستخدمين المتصلين للجميع
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}
