const User = require("../models/User");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

// @desc  Update logged-in user's profile
// @route PUT /api/users/me
exports.updateProfile = async (req, res) => {
  try {
    const { name, university, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (university) user.university = university;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Upload/update logged-in user's avatar
// @route PUT /api/users/me/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const user = await User.findById(req.user._id);
    user.avatar = req.file.path;
    await user.save();

    res.status(200).json({ success: true, avatar: user.avatar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get any user's public profile
// @route GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name university avatar createdAt"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Save/unsave a listing
// @route POST /api/users/saved/:listingId
exports.toggleSavedListing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { listingId } = req.params;

    const index = user.savedListings.findIndex(
      (id) => id.toString() === listingId
    );

    let saved;
    if (index > -1) {
      user.savedListings.splice(index, 1);
      saved = false;
    } else {
      user.savedListings.push(listingId);
      saved = true;
    }

    await user.save();

    if (saved) {
      const listing = await Listing.findById(listingId);
      if (listing && listing.seller.toString() !== req.user._id.toString()) {
        Notification.create({
          user: listing.seller,
          text: `${req.user.name} saved your item "${listing.title}"`,
          type: "listing",
          link: `/marketplace/${listing._id}`,
        }).catch((err) => console.error("Failed to create save notification:", err.message));
      }
    }

    res.status(200).json({ success: true, saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get logged-in user's saved listings
// @route GET /api/users/saved
exports.getSavedListings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedListings");
    res.status(200).json({ success: true, listings: user.savedListings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Permanently delete the logged-in user's account and their data
// @route DELETE /api/users/me
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Clean up everything this user owns/participates in so we don't leave
    // dangling references pointing at a deleted account.
    await Listing.deleteMany({ seller: userId });

    const chats = await Chat.find({ participants: userId });
    const chatIds = chats.map((c) => c._id);
    await Message.deleteMany({ chat: { $in: chatIds } });
    await Chat.deleteMany({ participants: userId });

    await Notification.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
