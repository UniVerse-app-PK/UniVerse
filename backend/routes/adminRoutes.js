const express = require("express");
const router = express.Router();
const {
  verifyAdminPassword,
  getAllUsers,
  togglePremium,
  warnUser,
  banUser,
  unbanUser,
  deleteUser,
  getReports,
  reviewReport,
  sendCustomNotification,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

// Protect all routes under this router with both authentication and admin checks
router.use(protect);
router.use(adminOnly);

router.post("/verify-password", verifyAdminPassword);

router.route("/users")
  .get(getAllUsers);

router.route("/users/:id")
  .delete(deleteUser);

router.put("/users/:id/premium", togglePremium);
router.put("/users/:id/warn", warnUser);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);

router.route("/reports")
  .get(getReports);

router.route("/reports/:id")
  .put(reviewReport);

router.post("/notifications", sendCustomNotification);

module.exports = router;
