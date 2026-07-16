const Chat = require("../models/Chat");
const Message = require("../models/Message");

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

// @desc  Send a message in a chat
// @route POST /api/chats/:chatId/messages
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (!chat.participants.some((p) => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const message = await Message.create({
      chat: chat._id,
      sender: req.user._id,
      text,
    });

    chat.lastMessage = text;
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
