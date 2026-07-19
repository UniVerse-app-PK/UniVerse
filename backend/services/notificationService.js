const User = require("../models/User");
const Notification = require("../models/Notification");

// Sends the same notification to every user except the one who triggered
// it (e.g. don't notify a seller about their own new listing). Used for
// campus-wide things like new listings/events where there's no single
// specific recipient.
const notifyAllExcept = async ({ exceptUserId, text, type, link }) => {
  try {
    const users = await User.find({ _id: { $ne: exceptUserId } }).select("_id");
    if (users.length === 0) return;

    const docs = users.map((u) => ({
      user: u._id,
      text,
      type,
      link: link || "",
    }));

    await Notification.insertMany(docs);
  } catch (error) {
    // Never let a notification failure break the actual create/post action.
    console.error("Failed to broadcast notification:", error.message);
  }
};

module.exports = { notifyAllExcept };
