const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like new", "Good condition", "Fair condition"],
    },
    location: {
      type: String,
      required: true,
    },
    photos: [
      {
        type: String,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "sold", "removed"],
      default: "active",
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    featuredExpiresAt: {
      type: Date,
      default: null,
    },
    featuredWarned: {
      type: Boolean,
      default: false,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    urgentExpiresAt: {
      type: Date,
      default: null,
    },
    urgentWarned: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

listingSchema.virtual("sellerRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) {
    return { score: 0, count: 0 };
  }
  const total = this.reviews.reduce((sum, r) => sum + r.score, 0);
  return {
    score: Math.round((total / this.reviews.length) * 10) / 10,
    count: this.reviews.length,
  };
});

listingSchema.set("toJSON", { virtuals: true });
listingSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Listing", listingSchema);
