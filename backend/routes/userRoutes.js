const express = require("express");
const router = express.Router();
const {
  updateProfile,
  uploadAvatar,
  getUserById,
  toggleSavedListing,
  getSavedListings,
  deleteAccount,
  subscribePremium,
  unsubscribePremium,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { uploadAvatar: uploadAvatarMiddleware, requireCloudinaryConfig } = require("../middleware/upload");

router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteAccount);
router.put("/me/avatar", protect, requireCloudinaryConfig, uploadAvatarMiddleware, uploadAvatar);
router.put("/me/premium", protect, subscribePremium);
router.delete("/me/premium", protect, unsubscribePremium);
router.get("/saved", protect, getSavedListings);
router.post("/saved/:listingId", protect, toggleSavedListing);
router.get("/:id", getUserById);

module.exports = router;
