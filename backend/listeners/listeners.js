const prisma = require("../prisma/prisma");
let onlineUsers = [];

const listeners = (socket, io) => {
  socket.on("connected user", ({ id }) => {
    // change the data type of user
    if (!onlineUsers.find((user) => user.id === id)) {
      onlineUsers.push({ id, socketId: socket.id });
    } else {
      onlineUsers = onlineUsers.map((user) =>
        user.id === id ? { ...user, socketId: socket.id } : user
      );
    }
    console.log(onlineUsers);
  });

  socket.on("disconnect", () => {
    console.log(`user Disconnected with socket id: ${socket.id}`);
    onlineUsers = onlineUsers.filter((item) => item.socketId !== socket.id);
  });

  socket.on("chat message", async ({ userId, friendsId, message }) => {
    const createMsg = await prisma.message.create({
      data: {
        sendersId: userId,
        receiverId: friendsId,
        messageContent: message,
      },
    });

    console.log(
      `message: ${createMsg.messageContent} to: ${friendsId} from:${socket.id}`
    );
    let findOnlineUser = onlineUsers.find((item) => item.id === friendsId);
    console.log(findOnlineUser);
    if (findOnlineUser)
      io.to(findOnlineUser.socketId)
        .to(socket.id)
        .emit("chat message", { message: createMsg });
    else io.to(socket.id).emit("chat message", { message: createMsg });
  });
};

module.exports = listeners;
