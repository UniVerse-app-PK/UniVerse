const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");

router.route("/").get(getEvents).post(protect, createEvent);
router.route("/:id").get(getEventById).delete(protect, deleteEvent);

module.exports = router;
