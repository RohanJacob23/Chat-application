const prisma = require("../prisma/prisma");

const deleteFriendRequest = async (userId, friendId) => {
  const { friendRequest } = await prisma.friends.findUnique({
    where: { userId },
  });
  await prisma.friends.update({
    where: { userId },
    data: {
      friendRequest: { set: friendRequest.filter((id) => id !== friendId) },
    },
  });
};

module.exports = { deleteFriendRequest };
