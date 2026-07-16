const express = require("express");
const router = express.Router();
const {
  updateProfile,
  getUserById,
  toggleSavedListing,
  getSavedListings,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.put("/me", protect, updateProfile);
router.get("/saved", protect, getSavedListings);
router.post("/saved/:listingId", protect, toggleSavedListing);
router.get("/:id", getUserById);

module.exports = router;
