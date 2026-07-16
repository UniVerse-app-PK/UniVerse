const User = require("../models/User");

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

    res.status(200).json({ success: true, user });
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
