const Report = require("../models/Report");

// @desc  Create a report
// @route POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { targetType, targetId, targetName, reason, description } = req.body;

    if (!targetType || !targetId || !targetName || !reason) {
      return res.status(400).json({
        success: false,
        message: "Target type, target ID, target name, and reason are required",
      });
    }

    // Rate-limiting check: Prevent more than 1 report per minute per user
    const recentReport = await Report.findOne({
      reporter: req.user._id,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });

    if (recentReport) {
      return res.status(429).json({
        success: false,
        message: "You are submitting reports too quickly. Please wait a minute.",
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      targetName,
      reason,
      description: description || "",
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
