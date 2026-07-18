const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

// @desc  Create a new listing
// @route POST /api/listings
exports.createListing = async (req, res) => {
  try {
    const { title, category, description, price, condition, location, photos, featured } =
      req.body;

    if (!title || !category || !description || !price || !condition || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const listing = await Listing.create({
      title,
      category,
      description,
      price,
      condition,
      location,
      photos: photos || [],
      featured: Boolean(featured),
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
      filter.title = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter)
      .populate("seller", "name university avatar")
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
      .populate("seller", "name university avatar phone")
      .populate("reviews.user", "name avatar");

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.status(200).json({ success: true, listing });
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
      "featured",
      "urgent",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    await listing.save();

    res.status(200).json({ success: true, listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Delete a listing (owner only)
// @route DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
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

    res.status(201).json({ success: true, reviews: listing.reviews });
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
