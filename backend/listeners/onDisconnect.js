const onDisconnect = (socket, onlineUsers) => {
  socket.on("disconnect", () => {
    console.log(`user Disconnected with socket id: ${socket.id}`);
    onlineUsers = onlineUsers.filter((item) => item.socketId !== socket.id);
    console.log(onlineUsers);
  });
};

module.exports = onDisconnect;
