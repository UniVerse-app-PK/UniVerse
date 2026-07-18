const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { createMessage } = require("../services/chatService");

// @desc  Get or create a chat between logged-in user and another user
// @route POST /api/chats
exports.getOrCreateChat = async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
      ...(listingId && { listing: listingId }),
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, userId],
        listing: listingId || undefined,
      });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get all chats for logged-in user
// @route GET /api/chats
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("participants", "name avatar")
      .populate("listing", "title photos")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get messages for a chat
// @route GET /api/chats/:chatId/messages
exports.getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (!chat.participants.some((p) => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Delete a chat entirely (removes the chat + all its messages)
// @route DELETE /api/chats/:chatId
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (!chat.participants.some((p) => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Message.deleteMany({ chat: chat._id });
    await chat.deleteOne();

    const io = req.app.get("io");
    if (io) {
      io.to(`chat:${chat._id}`).emit("chat_deleted", { chatId: chat._id.toString() });
    }

    res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Clear all messages in a chat (keeps the chat itself around)
// @route DELETE /api/chats/:chatId/messages
exports.clearMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (!chat.participants.some((p) => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Message.deleteMany({ chat: chat._id });
    chat.lastMessage = "";
    chat.lastMessageAt = null;
    await chat.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`chat:${chat._id}`).emit("chat_cleared", { chatId: chat._id.toString() });
    }

    res.status(200).json({ success: true, message: "Conversation cleared" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Send a message in a chat
// @route POST /api/chats/:chatId/messages
// @note  Uses the same createMessage service as the socket "send_message"
//        event, and also broadcasts to the socket room - so it stays in
//        sync in real time whether a client uses REST or sockets.
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    const { message, chat } = await createMessage({
      chatId: req.params.chatId,
      senderId: req.user._id,
      text,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(`chat:${chat._id}`).emit("new_message", message);
      io.to(`chat:${chat._id}`).emit("chat_updated", {
        chatId: chat._id,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
      });
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error(error);
    const status =
      error.message === "Chat not found"
        ? 404
        : error.message === "Not authorized"
        ? 403
        : 400;
    res.status(status).json({ success: false, message: error.message || "Server Error" });
  }
};
