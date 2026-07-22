const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    meta: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    applicationUrl: {
      type: String,
      default: "",
    },
    whatsapp: {
      type: String,
      default: "",
    },
    org: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Research", "Courses", "Societies", "Internships", "Other"],
      default: "Other",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
