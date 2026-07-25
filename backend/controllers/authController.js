const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const { otpEmailTemplate } = require("../utils/emailTemplates");

// @desc  Register a new user
// @route POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, university, phone } = req.body;

    if (!name || !email || !password || !university) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    let user;

    if (existingUser) {
      if (existingUser.verified) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
      
      // Overwrite unverified account details
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.university = university;
      existingUser.phone = phone || "";
      existingUser.verificationOTP = otp;
      existingUser.verificationOTPExpires = otpExpires;
      await existingUser.save();
      user = existingUser;
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        university,
        phone: phone || "",
        verificationOTP: otp,
        verificationOTPExpires: otpExpires,
      });
    }

    // Always log the OTP too, so local testing still works even if the
    // email provider isn't configured yet or is momentarily down.
    console.log(`📩 Verification OTP for ${user.email}: ${otp}`);

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your UniVerse account",
        html: otpEmailTemplate({
          name: user.name,
          otp,
          message:
            "Use the code below to verify your email and activate your UniVerse account.",
        }),
      });
    } catch (emailError) {
      // Don't fail registration just because the email didn't go out -
      // the OTP is still valid and logged above for dev/testing.
      console.error("⚠️  Failed to send verification email:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Check console for OTP (dev mode).",
      userId: user._id,
      ...(process.env.NODE_ENV !== "production" && { devOTP: otp }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Verify email using OTP
// @route POST /api/auth/verify
exports.verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+verificationOTP +verificationOTPExpires"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    if (
      !user.verificationOTP ||
      user.verificationOTP !== otp ||
      user.verificationOTPExpires < new Date()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        isPremium: user.isPremium,
        verifiedSeller: user.verifiedSeller,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Resend verification OTP
// @route POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ success: false, message: "User is already verified" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.verificationOTP = otp;
    user.verificationOTPExpires = otpExpires;
    await user.save();

    console.log(`📩 Resent Verification OTP for ${user.email}: ${otp}`);

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your UniVerse account",
        html: otpEmailTemplate({
          name: user.name,
          otp,
          message: "Here is your new verification code to activate your UniVerse account.",
        }),
      });
    } catch (emailError) {
      console.error("⚠️  Failed to resend verification email:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Verification code resent successfully. Check console for OTP (dev mode).",
      ...(process.env.NODE_ENV !== "production" && { devOTP: otp }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Login user
// @route POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
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

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        avatar: user.avatar,
        isPremium: user.isPremium,
        verifiedSeller: user.verifiedSeller,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Request password reset (sends OTP)
// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Avoid leaking which emails exist
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset code has been sent",
      });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`🔑 Password reset OTP for ${user.email}: ${otp}`);

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your UniVerse password",
        html: otpEmailTemplate({
          name: user.name,
          otp,
          message:
            "Use the code below to reset your UniVerse password. If you didn't request this, please ignore.",
        }),
      });
    } catch (emailError) {
      console.error("⚠️  Failed to send password reset email:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "If that email is registered, a reset code has been sent",
      ...(process.env.NODE_ENV !== "production" && { devOTP: otp }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Reset password using OTP
// @route POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetPasswordOTP +resetPasswordOTPExpires"
    );

    if (
      !user ||
      !user.resetPasswordOTP ||
      user.resetPasswordOTP !== otp ||
      user.resetPasswordOTPExpires < new Date()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Change password while logged in (requires current password)
// @route PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc  Get logged-in user's profile
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
