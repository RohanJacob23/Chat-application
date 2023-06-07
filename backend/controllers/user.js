const prisma = require("../prisma/prisma");
const { deleteFriendRequest } = require("../utils/functions");

const getUser = async (req, res) => {
  const { email } = req.query;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  res.json(user);
};

const createUserFriends = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  const friends = await prisma.friends.create({
    data: { userId: user.id },
  });

  res.json(friends);
};

const getFriends = async (req, res) => {
  const { email } = req.query;

  if (email === undefined || email === "") {
    res.json([]);
    return;
  }

  const friendsList = await prisma.user.findUnique({
    where: { email },
    include: { friends: true },
  });

  if (!friendsList.friends) {
    res.json([]);
    return;
  }

  const promiseFriends = friendsList.friends.friendId.map(async (id) => {
    return await prisma.user.findUnique({ where: { id } });
  });
  let friends = await Promise.all(promiseFriends);
  res.json(friends);
};

const getMessage = async (req, res) => {
  const { userId, receiverId } = req.query;
  const data = await prisma.message.findMany({
    where: {
      OR: [
        {
          sendersId: userId,
          receiverId,
        },
        {
          sendersId: receiverId,
          receiverId: userId,
        },
      ],
    },
    orderBy: {
      time: "asc",
    },
  });
  res.json(data);
};

const sendFriendRequest = async (req, res) => {
  const { senderId, toEmail } = req.body;
  const findFriend = await prisma.user.findUnique({
    where: { email: toEmail },
    include: { friends: true },
  });

  if (!findFriend) {
    res.json({ error: "email not registered" });
    return;
  }

  // check if the sender is already friend with the receiver
  const checkIfAlreadyFriends = findFriend.friends.friendId.filter(
    (id) => id === senderId
  );
  const alreadySentFriendRequest = findFriend.friends.friendRequest.filter(
    (id) => id === senderId
  );
  console.log(checkIfAlreadyFriends, alreadySentFriendRequest);
  if (checkIfAlreadyFriends.length > 0) {
    res.json({ error: "already friend" });
    return;
  } else if (alreadySentFriendRequest.length > 0) {
    res.json({ error: "Already sent a friend request" });
    return;
  }

  const friendList = await prisma.friends.update({
    where: { userId: findFriend.id },
    data: { friendRequest: { push: senderId } },
  });

  res.json(friendList);
};

const showFriendRequest = async (req, res) => {
  const { userId } = req.query;
  const allFriendRequest = await prisma.friends.findUnique({
    where: { userId },
  });

  if (!allFriendRequest) {
    res.json([]);
    return;
  }

  const userPromise = allFriendRequest.friendRequest.map(async (id) => {
    return await prisma.user.findUnique({ where: { id } });
  });
  let allUsers = await Promise.all(userPromise);
  res.json(allUsers);
};

const addFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  await prisma.user.update({
    where: { id: userId },
    data: {
      friends: {
        update: {
          friendId: { push: friendId },
        },
      },
    },
    include: { friends: true },
  });

  await prisma.user.update({
    where: { id: friendId },
    data: {
      friends: {
        update: {
          friendId: { push: userId },
        },
      },
    },
    include: { friends: true },
  });

  // deleting the friend request
  deleteFriendRequest(userId, friendId);
  res.json({ message: "Friend added successfully" });
};

const declineRequest = async (req, res) => {
  const { userId, friendId } = req.body;
  deleteFriendRequest(userId, friendId);
  res.json({ message: "Friend Request Declined" });
};

module.exports = {
  getUser,
  createUserFriends,
  getFriends,
  getMessage,
  sendFriendRequest,
  showFriendRequest,
  addFriend,
  declineRequest,
};
