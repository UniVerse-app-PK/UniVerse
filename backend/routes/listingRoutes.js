const express = require("express");
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  addReview,
  getMyListings,
} = require("../controllers/listingController");
const { uploadListingPhotos } = require("../controllers/uploadController");
const { protect } = require("../middleware/auth");
const { uploadListingPhotos: uploadListingPhotosMiddleware, requireCloudinaryConfig } = require("../middleware/upload");

// NOTE: /mine and /upload must be registered before /:id so they aren't
// swallowed as an id param
router.get("/mine", protect, getMyListings);

// Upload photos first, get back Cloudinary URLs, then send those URLs in
// the `photos` field when calling POST / or PUT /:id below.
router.post("/upload", protect, requireCloudinaryConfig, uploadListingPhotosMiddleware, uploadListingPhotos);

router.route("/").get(getListings).post(protect, createListing);

router
  .route("/:id")
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

router.post("/:id/reviews", protect, addReview);

module.exports = router;
