const Event = require("../models/Event");
const { notifyAllExcept } = require("../services/notificationService");

// @desc  Create an event
// @route POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { title, meta, description, photo, url, applicationUrl, whatsapp, org, category } = req.body;

    if (!title || !org) {
      return res.status(400).json({
        success: false,
        message: "Title and organization are required",
      });
    }

    const event = await Event.create({
      title,
      meta,
      description,
      photo,
      url,
      applicationUrl,
      whatsapp,
      org,
      category,
      createdBy: req.user._id,
    });

    notifyAllExcept({
      exceptUserId: req.user._id,
      text: `New event posted: "${title}"`,
      type: "event",
      link: `/events`,
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

// @desc  Update event (creator only)
// @route PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (req.user.role !== "admin" && event.createdBy && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      });
    }

    const { title, meta, description, photo, url, applicationUrl, whatsapp, org, category } = req.body;

    event.title = title !== undefined ? title : event.title;
    event.meta = meta !== undefined ? meta : event.meta;
    event.description = description !== undefined ? description : event.description;
    event.photo = photo !== undefined ? photo : event.photo;
    event.url = url !== undefined ? url : event.url;
    event.applicationUrl = applicationUrl !== undefined ? applicationUrl : event.applicationUrl;
    event.whatsapp = whatsapp !== undefined ? whatsapp : event.whatsapp;
    event.org = org !== undefined ? org : event.org;
    event.category = category !== undefined ? category : event.category;

    await event.save();

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

    if (req.user.role !== "admin" && event.createdBy && event.createdBy.toString() !== req.user._id.toString()) {
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
