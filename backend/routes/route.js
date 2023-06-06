const router = require("express").Router();
const {
  getUser,
  createUserFriends,
  getFriends,
  getMessage,
  sendFriendRequest,
  showFriendRequest,
  addFriend,
  declineRequest,
} = require("../controllers/user");

router.get("/", getUser);
router.post("/", createUserFriends);
router.get("/friends", getFriends);
router.get("/message", getMessage);
router.post("/sendRequest", sendFriendRequest);
router.get("/getRequest", showFriendRequest);
router.post("/acceptRequest", addFriend);
router.post("/declineRequest", declineRequest);

module.exports = router;
