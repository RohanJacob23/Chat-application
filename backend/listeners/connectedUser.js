const connectedUser = (socket, onlineUsers) => {
  socket.on("connected user", ({ id }) => {
    // change the data type of user
    if (!onlineUsers.find((user) => user.id === id)) {
      onlineUsers.push({ id, socketId: socket.id });
    } else
      onlineUsers = onlineUsers.map((user) =>
        user.id === id ? { ...user, socketId: socket.id } : user
      );
    console.log(onlineUsers);
  });
};

module.exports = connectedUser;
