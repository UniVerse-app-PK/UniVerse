const express = require("express");
const router = express.Router();
const {
  getOrCreateChat,
  getMyChats,
  getMessages,
  sendMessage,
  deleteChat,
  clearMessages,
} = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getMyChats).post(protect, getOrCreateChat);
router.route("/:chatId").delete(protect, deleteChat);
router
  .route("/:chatId/messages")
  .get(protect, getMessages)
  .post(protect, sendMessage)
  .delete(protect, clearMessages);

module.exports = router;
