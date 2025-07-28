
export const registerSocketServer = (io) => {
  const onlineUsers= new Map(); 
  io.on("connection", (socket) => { 
    console.log("User connected", socket.id);

    //  Register user with token-based auth (you can improve this)
    socket.on("register", (userId) => {
      if (!userId) return;

      const existingSockets = onlineUsers.get(userId) || new Set();
      existingSockets.add(socket.id);
      onlineUsers.set(userId, existingSockets);
    });

    //  Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      for (const [userId, socketSet] of onlineUsers.entries()) {
        socketSet.delete(socket.id);
        if (socketSet.size === 0) {
          onlineUsers.delete(userId);
        } else {
          onlineUsers.set(userId, socketSet);
        }
      }
    });
  });
};
