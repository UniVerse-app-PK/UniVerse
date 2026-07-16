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
const { protect } = require("../middleware/auth");

// NOTE: /mine must be registered before /:id so it isn't swallowed as an id param
router.get("/mine", protect, getMyListings);

router.route("/").get(getListings).post(protect, createListing);

router
  .route("/:id")
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

router.post("/:id/reviews", protect, addReview);

module.exports = router;
