const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { createMessage } = require("../services/chatService");

// userId -> Set of socket ids (a user can have the app open in multiple
// tabs/devices at once, so we track sockets, not just a single boolean)
const onlineUsers = new Map();

const addOnlineSocket = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

const removeOnlineSocket = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) onlineUsers.delete(userId);
};

const isUserOnline = (userId) => onlineUsers.has(userId.toString());

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    },
  });

  // Auth every socket connection with the same JWT used for REST routes.
  // Frontend passes it as: io(URL, { auth: { token } })
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) return next(new Error("Not authorized, no token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) return next(new Error("User no longer exists"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Not authorized, invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // Personal room - lets us push events (new message, notification) to
    // this user from anywhere without knowing which socket/tab they're on.
    socket.join(`user:${userId}`);

    addOnlineSocket(userId, socket.id);
    io.emit("user_online", { userId });

    // --- Join / leave a specific chat's room ---
    socket.on("join_chat", async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;
        const isParticipant = chat.participants.some(
          (p) => p.toString() === userId
        );
        if (!isParticipant) return;
        socket.join(`chat:${chatId}`);
      } catch (error) {
        console.error("join_chat error:", error.message);
      }
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(`chat:${chatId}`);
    });

    // --- Send a message in real time (no HTTP round trip needed) ---
    // Pass an optional ack callback to get a direct success/error response.
    socket.on("send_message", async ({ chatId, text }, callback) => {
      try {
        const { message, chat } = await createMessage({
          chatId,
          senderId: userId,
          text,
        });

        io.to(`chat:${chatId}`).emit("new_message", message);

        // Lets chat-list screens update their preview/order live too
        io.to(`chat:${chatId}`).emit("chat_updated", {
          chatId,
          lastMessage: chat.lastMessage,
          lastMessageAt: chat.lastMessageAt,
        });

        if (typeof callback === "function") callback({ success: true, message });
      } catch (error) {
        console.error("send_message error:", error.message);
        if (typeof callback === "function") {
          callback({ success: false, message: error.message || "Failed to send message" });
        }
      }
    });

    // --- Typing indicators ---
    socket.on("typing", ({ chatId }) => {
      socket.to(`chat:${chatId}`).emit("typing", { chatId, userId });
    });

    socket.on("stop_typing", ({ chatId }) => {
      socket.to(`chat:${chatId}`).emit("stop_typing", { chatId, userId });
    });

    // --- Read receipts ---
    socket.on("mark_read", async ({ chatId }) => {
      try {
        await Message.updateMany(
          { chat: chatId, sender: { $ne: userId }, read: false },
          { $set: { read: true } }
        );
        io.to(`chat:${chatId}`).emit("messages_read", { chatId, readBy: userId });
      } catch (error) {
        console.error("mark_read error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      removeOnlineSocket(userId, socket.id);
      if (!onlineUsers.has(userId)) {
        io.emit("user_offline", { userId });
      }
    });
  });

  return io;
};

module.exports = { initSocket, isUserOnline };
