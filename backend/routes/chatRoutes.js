const express = require("express");
const router = express.Router();
const {
  getOrCreateChat,
  getMyChats,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getMyChats).post(protect, getOrCreateChat);
router
  .route("/:chatId/messages")
  .get(protect, getMessages)
  .post(protect, sendMessage);

module.exports = router;
