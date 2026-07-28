const BannerAd = require("../models/BannerAd");

// @desc    Get all banner ads
// @route   GET /api/banner-ads
// @access  Private/Admin
const getBannerAds = async (req, res, next) => {
  try {
    const bannerAds = await BannerAd.find().sort({ createdAt: -1 });
    res.json(bannerAds);
  } catch (error) {
    next(error);
  }
};

// @desc    Get active banner ad
// @route   GET /api/banner-ads/active
// @access  Public
const getActiveBannerAd = async (req, res, next) => {
  try {
    const orientation = req.query.orientation || 'horizontal';
    
    // Find active ads matching orientation that haven't expired
    const activeAds = await BannerAd.find({ 
      isActive: true, 
      orientation,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    });
    
    if (activeAds.length === 0) {
      return res.json(null);
    }
    
    // Shuffle: randomly pick one
    const randomIndex = Math.floor(Math.random() * activeAds.length);
    res.json(activeAds[randomIndex]);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a banner ad
// @route   POST /api/banner-ads
// @access  Private/Admin
const createBannerAd = async (req, res, next) => {
  try {
    const { title, description, imageUrl, targetUrl, isActive, orientation, durationDays } = req.body;

    let expiresAt = undefined;
    if (durationDays && !isNaN(parseInt(durationDays))) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(durationDays));
    }

    const bannerAd = new BannerAd({
      title,
      description,
      imageUrl,
      targetUrl,
      isActive: isActive || false,
      orientation: orientation || 'horizontal',
      expiresAt,
    });

    const createdBannerAd = await bannerAd.save();
    res.status(201).json(createdBannerAd);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a banner ad (e.g. toggle active)
// @route   PUT /api/banner-ads/:id
// @access  Private/Admin
const updateBannerAd = async (req, res, next) => {
  try {
    const bannerAd = await BannerAd.findById(req.params.id);

    if (bannerAd) {
      bannerAd.title = req.body.title !== undefined ? req.body.title : bannerAd.title;
      bannerAd.description = req.body.description !== undefined ? req.body.description : bannerAd.description;
      bannerAd.imageUrl = req.body.imageUrl !== undefined ? req.body.imageUrl : bannerAd.imageUrl;
      bannerAd.targetUrl = req.body.targetUrl !== undefined ? req.body.targetUrl : bannerAd.targetUrl;
      bannerAd.isActive = req.body.isActive !== undefined ? req.body.isActive : bannerAd.isActive;
      bannerAd.orientation = req.body.orientation !== undefined ? req.body.orientation : bannerAd.orientation;
      
      if (req.body.durationDays !== undefined && !isNaN(parseInt(req.body.durationDays))) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(req.body.durationDays));
        bannerAd.expiresAt = expiresAt;
      }

      const updatedBannerAd = await bannerAd.save();
      res.json(updatedBannerAd);
    } else {
      res.status(404);
      throw new Error("Banner ad not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a banner ad
// @route   DELETE /api/banner-ads/:id
// @access  Private/Admin
const deleteBannerAd = async (req, res, next) => {
  try {
    const bannerAd = await BannerAd.findById(req.params.id);

    if (bannerAd) {
      await bannerAd.deleteOne();
      res.json({ message: "Banner ad removed" });
    } else {
      res.status(404);
      throw new Error("Banner ad not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBannerAds,
  getActiveBannerAd,
  createBannerAd,
  updateBannerAd,
  deleteBannerAd,
};
