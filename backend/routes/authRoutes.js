const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", protect, changePassword);
router.get("/me", protect, getMe);

module.exports = router;
