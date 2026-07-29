const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    university: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationOTP: {
      type: String,
      select: false,
    },
    verificationOTPExpires: {
      type: Date,
      select: false,
    },
    resetPasswordOTP: {
      type: String,
      select: false,
    },
    resetPasswordOTPExpires: {
      type: Date,
      select: false,
    },
    savedListings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumExpiresAt: {
      type: Date,
      default: null,
    },
    premiumWarned: {
      type: Boolean,
      default: false,
    },
    verifiedSeller: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    banExpires: {
      type: Date,
      default: null,
    },
    banReason: {
      type: String,
      default: "",
    },
    warnings: [
      {
        reason: { type: String, required: true },
        date: { type: Date, default: Date.now },
        issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
