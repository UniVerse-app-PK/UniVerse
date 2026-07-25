const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // Ban check
    if (user.isBanned) {
      if (user.banExpires && new Date(user.banExpires) < new Date()) {
        // Temp ban expired, unban user
        user.isBanned = false;
        user.banExpires = null;
        user.banReason = "";
        await user.save();
      } else {
        return res.status(403).json({
          success: false,
          message: user.banReason 
            ? `Your account has been banned: ${user.banReason}` 
            : "Your account has been banned.",
          isBanned: true,
          banReason: user.banReason,
          banExpires: user.banExpires,
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid or expired token",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied, admin privileges required",
    });
  }
};

module.exports = { protect, adminOnly };
