const User = require("../models/User");
const Report = require("../models/Report");
const Listing = require("../models/Listing");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");

// @desc  Verify admin password for re-auth
// @route POST /api/admin/verify-password
exports.verifyAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    res.status(200).json({ success: true, message: "Admin verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get all users with pagination and search
// @route GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const filter = req.query.filter || "all"; // all, active, banned, premium

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
      ];
    }

    if (filter === "banned") {
      query.isBanned = true;
    } else if (filter === "premium") {
      query.isPremium = true;
    } else if (filter === "active") {
      query.isBanned = false;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Toggle user premium status
// @route PUT /api/admin/users/:id/premium
exports.togglePremium = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isPremium = !user.isPremium;
    await user.save();

    // Notify user
    await Notification.create({
      user: user._id,
      text: user.isPremium
        ? "Your account has been upgraded to Premium! Enjoy the perks."
        : "Your Premium status has been deactivated.",
      type: "system",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Warn a user
// @route PUT /api/admin/users/:id/warn
exports.warnUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: "Warning reason is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.warnings.push({
      reason,
      date: new Date(),
      issuedBy: req.user._id,
    });

    await user.save();

    // Create notification
    await Notification.create({
      user: user._id,
      text: `Warning issued by admin: "${reason}"`,
      type: "system",
    });

    res.status(200).json({ success: true, message: "Warning issued successfully", warnings: user.warnings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Ban a user (temporary or permanent)
// @route PUT /api/admin/users/:id/ban
exports.banUser = async (req, res) => {
  try {
    const { duration, reason } = req.body; // duration: '1', '3', '7', '30', 'permanent'
    if (!reason) {
      return res.status(400).json({ success: false, message: "Ban reason is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let banExpires = null;
    if (duration && duration !== "permanent") {
      const days = parseInt(duration);
      if (!isNaN(days)) {
        banExpires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      }
    }

    user.isBanned = true;
    user.banExpires = banExpires;
    user.banReason = reason;

    await user.save();

    res.status(200).json({ success: true, message: "User banned successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Unban a user
// @route PUT /api/admin/users/:id/unban
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBanned = false;
    user.banExpires = null;
    user.banReason = "";

    await user.save();

    // Create notification
    await Notification.create({
      user: user._id,
      text: "Your account has been unbanned by an admin.",
      type: "system",
    });

    res.status(200).json({ success: true, message: "User unbanned successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Delete user and their data permanently
// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete listings
    await Listing.deleteMany({ seller: userId });

    // Delete events
    await Event.deleteMany({ createdBy: userId });

    // Delete notifications
    await Notification.deleteMany({ user: userId });

    // Delete reports related to user
    await Report.deleteMany({ $or: [{ reporter: userId }, { targetId: userId }] });

    // Delete User
    await User.deleteOne({ _id: userId });

    res.status(200).json({ success: true, message: "User and all their data permanently deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get all reports
// @route GET /api/admin/reports
exports.getReports = async (req, res) => {
  try {
    const status = req.query.status;
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate("reporter", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Review/dismiss a report
// @route PUT /api/admin/reports/:id
exports.reviewReport = async (req, res) => {
  try {
    const { status, adminNote } = req.body; // status: 'reviewed', 'dismissed'
    if (!status || !["reviewed", "dismissed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status is required" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    report.status = status;
    report.reviewedBy = req.user._id;
    if (adminNote !== undefined) {
      report.adminNote = adminNote;
    }

    await report.save();

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Send custom notifications
// @route POST /api/admin/notifications
exports.sendCustomNotification = async (req, res) => {
  try {
    const { recipients, text, type } = req.body; // recipients: 'all', 'premium', or an array of user IDs
    if (!text) {
      return res.status(400).json({ success: false, message: "Notification text is required" });
    }

    let userQuery = {};
    if (recipients === "premium") {
      userQuery = { isPremium: true };
    } else if (Array.isArray(recipients)) {
      userQuery = { _id: { $in: recipients } };
    } else if (recipients !== "all") {
      return res.status(400).json({ success: false, message: "Invalid recipients selection" });
    }

    const users = await User.find(userQuery).select("_id");
    if (users.length === 0) {
      return res.status(200).json({ success: true, message: "No recipients matched selection" });
    }

    const docs = users.map((u) => ({
      user: u._id,
      text,
      type: type || "system",
    }));

    await Notification.insertMany(docs);

    res.status(200).json({ success: true, message: `Notification sent to ${users.length} users` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
