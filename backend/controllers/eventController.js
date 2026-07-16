const Event = require("../models/Event");

// @desc  Create an event
// @route POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { title, meta, org, category } = req.body;

    if (!title || !org) {
      return res.status(400).json({
        success: false,
        message: "Title and organization are required",
      });
    }

    const event = await Event.create({
      title,
      meta,
      org,
      category,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get all events (optional category filter)
// @route GET /api/events?category=
exports.getEvents = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get single event
// @route GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Delete event (creator only)
// @route DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.createdBy && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      });
    }

    await event.deleteOne();

    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
