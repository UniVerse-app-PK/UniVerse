const express = require("express");
const router = express.Router();
const { createReport } = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createReport);

module.exports = router;
