const prisma = require("../prisma/prisma");

const chatMessage = (socket, io, onlineUsers) => {
  socket.on("chat message", async ({ userId, friendsId, message }) => {
    const createMsg = await prisma.message.create({
      data: {
        sendersId: userId,
        receiverId: friendsId,
        messageContent: message,
      },
    });

    let findOnlineUser = onlineUsers.find((item) => item.id === friendsId);
    if (findOnlineUser)
      io.to(findOnlineUser.socketId)
        .to(socket.id)
        .emit("chat message", { message: createMsg });
    else io.to(socket.id).emit("chat message", { message: createMsg });
  });
};

module.exports = chatMessage;
