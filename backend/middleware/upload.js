const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Storage for listing photos - up to 5 images, resized so nothing huge
// ends up on Cloudinary by accident.
const listingStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "universe/listings",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  },
});

// Storage for profile avatars - square crop centered on the face.
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "universe/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "fill", gravity: "face" }],
  },
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// If Cloudinary credentials are missing, fail fast with a clear message
// instead of letting multer-storage-cloudinary throw an obscure SDK error.
const requireCloudinaryConfig = (req, res, next) => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return res.status(500).json({
      success: false,
      message:
        "Image uploads aren't configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env (see .env.example).",
    });
  }
  next();
};

// Field name "photos", max 5 files, 5MB each
const uploadListingPhotos = multer({
  storage: listingStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("photos", 5);

// Field name "avatar", single file, 3MB max
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
}).single("avatar");

module.exports = { uploadListingPhotos, uploadAvatar, requireCloudinaryConfig };
