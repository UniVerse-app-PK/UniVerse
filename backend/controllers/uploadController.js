// @desc  Upload one or more listing photos to Cloudinary
// @route POST /api/listings/upload
// @note  This only uploads the images and returns their URLs. Send those
//        URLs in the `photos` array when creating/updating a listing.
exports.uploadListingPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No photos uploaded" });
    }

    const urls = req.files.map((file) => file.path);

    res.status(200).json({ success: true, count: urls.length, urls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
