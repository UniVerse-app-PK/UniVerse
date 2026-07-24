const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/auth");

router.route("/").get(getEvents).post(protect, adminOnly, createEvent);
router.route("/:id").get(getEventById).put(protect, adminOnly, updateEvent).delete(protect, adminOnly, deleteEvent);

module.exports = router;
