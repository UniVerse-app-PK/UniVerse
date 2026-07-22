const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");

router.route("/").get(getEvents).post(protect, createEvent);
router.route("/:id").get(getEventById).put(protect, updateEvent).delete(protect, deleteEvent);

module.exports = router;
