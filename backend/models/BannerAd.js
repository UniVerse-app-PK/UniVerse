const mongoose = require("mongoose");

const bannerAdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    targetUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    orientation: {
      type: String,
      enum: ['horizontal', 'vertical'],
      default: 'horizontal',
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const BannerAd = mongoose.model("BannerAd", bannerAdSchema);
module.exports = BannerAd;
