const express = require("express");
const router = express.Router();
const {
  getBannerAds,
  getActiveBannerAd,
  createBannerAd,
  updateBannerAd,
  deleteBannerAd,
} = require("../controllers/bannerAdController");
const { protect, adminOnly } = require("../middleware/auth");

// Public route to get active banner ad
router.get("/active", getActiveBannerAd);

// Admin routes for managing banner ads
router.route("/")
  .get(protect, adminOnly, getBannerAds)
  .post(protect, adminOnly, createBannerAd);

router.route("/:id")
  .put(protect, adminOnly, updateBannerAd)
  .delete(protect, adminOnly, deleteBannerAd);

module.exports = router;
