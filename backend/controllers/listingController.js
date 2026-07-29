const Listing = require("../models/Listing");
const Notification = require("../models/Notification");
const { notifyAllExcept } = require("../services/notificationService");

// @desc  Create a new listing
// @route POST /api/listings
const FREE_MONTHLY_LISTING_LIMIT = 5;

exports.createListing = async (req, res) => {
  try {
    const { title, category, description, price, condition, location, photos, featured, urgent } =
      req.body;

    if (!title || !category || !description || !price || !condition || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.user.isPremium) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const listingsThisMonth = await Listing.countDocuments({
        seller: req.user._id,
        createdAt: { $gte: startOfMonth },
      });

      if (listingsThisMonth >= FREE_MONTHLY_LISTING_LIMIT) {
        return res.status(403).json({
          success: false,
          message: `Free plan is limited to ${FREE_MONTHLY_LISTING_LIMIT} listings per month. Upgrade to Premium for unlimited listings.`,
        });
      }
    }

    // Featured/urgent boosts are a Premium perk - silently ignore the flag
    // for free users rather than trusting whatever the client sent.
    const canBoost = !!req.user.isPremium;

    const isFeatured = canBoost ? Boolean(featured) : false;
    const isUrgent = canBoost ? Boolean(urgent) : false;
    const now = Date.now();

    const listing = await Listing.create({
      title,
      category,
      description,
      price,
      condition,
      location,
      photos: photos || [],
      featured: isFeatured,
      featuredExpiresAt: isFeatured ? new Date(now + 15 * 24 * 60 * 60 * 1000) : null,
      urgent: isUrgent,
      urgentExpiresAt: isUrgent ? new Date(now + 7 * 24 * 60 * 60 * 1000) : null,
      seller: req.user._id,
    });

    res.status(201).json({ success: true, listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get all listings (with optional filters)
// @route GET /api/listings?category=&search=&minPrice=&maxPrice=
exports.getListings = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, status } = req.query;

    const filter = { status: status || "active" };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter)
      .populate("seller", "name university avatar isPremium verifiedSeller")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: listings.length, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get a single listing by id (increments view count)
// @route GET /api/listings/:id
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("seller", "name university avatar phone isPremium verifiedSeller")
      .populate("reviews.user", "name avatar");

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const sellerListings = await Listing.find({ seller: listing.seller._id }).populate("reviews.user", "name avatar");
    const sellerReviews = sellerListings.reduce((acc, l) => acc.concat(l.reviews), []);
    sellerReviews.sort((a, b) => b.createdAt - a.createdAt);

    let sellerRating = { score: 0, count: 0 };
    if (sellerReviews.length > 0) {
      const total = sellerReviews.reduce((sum, r) => sum + r.score, 0);
      sellerRating = {
        score: Math.round((total / sellerReviews.length) * 10) / 10,
        count: sellerReviews.length,
      };
    }

    const listingObj = listing.toObject();
    listingObj.reviews = sellerReviews;
    listingObj.sellerRating = sellerRating;

    res.status(200).json({ success: true, listing: listingObj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Update a listing (owner only)
// @route PUT /api/listings/:id
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this listing",
      });
    }

    const allowedFields = [
      "title",
      "category",
      "description",
      "price",
      "condition",
      "location",
      "photos",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    // Featured/urgent boosts are a Premium perk.
    if (req.user.isPremium) {
      if (req.body.featured !== undefined) {
        const newFeatured = Boolean(req.body.featured);
        listing.featured = newFeatured;
        listing.featuredExpiresAt = newFeatured
          ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          : null;
        listing.featuredWarned = false; // reset warning for new cycle
      }
      if (req.body.urgent !== undefined) {
        const newUrgent = Boolean(req.body.urgent);
        listing.urgent = newUrgent;
        listing.urgentExpiresAt = newUrgent
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          : null;
        listing.urgentWarned = false; // reset warning for new cycle
      }
    }

    await listing.save();

    // Notify users who saved this listing
    const User = require("../models/User");
    const usersWhoSaved = await User.find({ savedListings: listing._id }).select("_id");
    if (usersWhoSaved.length > 0) {
      const notificationDocs = usersWhoSaved.map((u) => ({
        user: u._id,
        text: `Your saved item "${listing.title}" has been updated.`,
        type: "listing",
        link: `/marketplace/${listing._id}`,
      }));
      await Notification.insertMany(notificationDocs).catch((err) =>
        console.error("Failed to send update notifications to savers:", err.message)
      );
    }

    res.status(200).json({ success: true, listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc Delete a listing (owner or admin)
// @route DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check if user is the listing owner OR has an admin role
    const isOwner = listing.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }

    await listing.deleteOne();

    res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Add a review to a listing
// @route POST /api/listings/:id/reviews
exports.addReview = async (req, res) => {
  try {
    const { score, comment } = req.body;

    if (!score) {
      return res.status(400).json({ success: false, message: "Score is required" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    listing.reviews.push({ user: req.user._id, score, comment });
    await listing.save();

    if (listing.seller.toString() !== req.user._id.toString()) {
      Notification.create({
        user: listing.seller,
        text: `${req.user.name} left a ${score}★ review on "${listing.title}"`,
        type: "review",
        link: `/marketplace/${listing._id}`,
      }).catch((err) => console.error("Failed to create review notification:", err.message));
    }

    const sellerListings = await Listing.find({ seller: listing.seller }).populate("reviews.user", "name avatar");
    const sellerReviews = sellerListings.reduce((acc, l) => acc.concat(l.reviews), []);
    sellerReviews.sort((a, b) => b.createdAt - a.createdAt);

    res.status(201).json({ success: true, reviews: sellerReviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get listings created by the logged-in user
// @route GET /api/listings/mine
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id })
      .populate("reviews.user", "name avatar")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
