const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Notification = require("../models/Notification");

// Shared by the REST endpoint (controllers/chatController.js) and the
// socket "send_message" event so both paths save + validate messages
// exactly the same way instead of duplicating the logic twice.
const createMessage = async ({ chatId, senderId, text }) => {
  if (!text || !text.trim()) {
    throw new Error("Message text is required");
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (p) => p.toString() === senderId.toString()
  );
  if (!isParticipant) {
    throw new Error("Not authorized");
  }

  const message = await Message.create({
    chat: chat._id,
    sender: senderId,
    text,
  });
  await message.populate("sender", "name avatar");

  chat.lastMessage = text;
  chat.lastMessageAt = new Date();
  await chat.save();

  const recipientId = chat.participants.find(
    (p) => p.toString() !== senderId.toString()
  );

  // Fire-and-forget - a failed notification shouldn't block the message
  // from sending.
  if (recipientId) {
    Notification.create({
      user: recipientId,
      text: `New message from ${message.sender.name}`,
      type: "message",
      link: `/chats?chatId=${chat._id}`,
    }).catch((err) =>
      console.error("Failed to create message notification:", err.message)
    );
  }

  return { message, chat, recipientId };
};

module.exports = { createMessage };
