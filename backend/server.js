require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { initSocket } = require("./socket");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const eventRoutes = require("./routes/eventRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const bannerAdRoutes = require("./routes/bannerAds");
const seedAdmins = require("./utils/seedAdmins");

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  seedAdmins();
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send("UniVerse API Running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/banner-ads", bannerAdRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

// Wrap express in a plain http server so Socket.io can share the same port
const server = http.createServer(app);
const io = initSocket(server);

// Makes io reachable inside REST controllers via req.app.get("io"), so a
// message sent over plain HTTP still broadcasts live to connected sockets.
app.set("io", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for real-time connections`);
});
