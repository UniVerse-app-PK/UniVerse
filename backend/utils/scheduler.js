const cron = require("node-cron");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

// ─── Helper: days between two dates ────────────────────────────────────────
function daysUntil(date) {
  return Math.ceil((new Date(date) - Date.now()) / (1000 * 60 * 60 * 24));
}

// ─── Premium expiry ─────────────────────────────────────────────────────────
async function expirePremiumAccounts() {
  try {
    const now = new Date();

    // Find premium users whose subscription has expired
    const expiredUsers = await User.find({
      isPremium: true,
      premiumExpiresAt: { $lte: now },
    });

    for (const user of expiredUsers) {
      user.isPremium = false;
      user.premiumExpiresAt = null;
      await user.save();

      await Notification.create({
        user: user._id,
        text: "Your UniVerse Premium subscription has expired. Your account is now on the free plan.",
        type: "system",
        link: "/premium",
      });

      console.log(`[Scheduler] Premium expired for user ${user._id}`);
    }
  } catch (err) {
    console.error("[Scheduler] Error expiring premium accounts:", err.message);
  }
}

// ─── Urgent badge expiry ────────────────────────────────────────────────────
async function expireUrgentBadges() {
  try {
    const now = new Date();

    const expiredListings = await Listing.find({
      urgent: true,
      urgentExpiresAt: { $lte: now },
    });

    for (const listing of expiredListings) {
      listing.urgent = false;
      listing.urgentExpiresAt = null;
      await listing.save();

      await Notification.create({
        user: listing.seller,
        text: `The Urgent Sale badge on your listing "${listing.title}" has expired and has been removed.`,
        type: "listing",
        link: `/marketplace/${listing._id}`,
      });

      console.log(`[Scheduler] Urgent badge expired for listing ${listing._id}`);
    }
  } catch (err) {
    console.error("[Scheduler] Error expiring urgent badges:", err.message);
  }
}

// ─── Featured listing expiry ─────────────────────────────────────────────────
async function expireFeaturedListings() {
  try {
    const now = new Date();

    const expiredListings = await Listing.find({
      featured: true,
      featuredExpiresAt: { $lte: now },
    });

    for (const listing of expiredListings) {
      listing.featured = false;
      listing.featuredExpiresAt = null;
      await listing.save();

      await Notification.create({
        user: listing.seller,
        text: `The Featured boost on your listing "${listing.title}" has expired. It is now a regular listing.`,
        type: "listing",
        link: `/marketplace/${listing._id}`,
      });

      console.log(`[Scheduler] Featured expired for listing ${listing._id}`);
    }
  } catch (err) {
    console.error("[Scheduler] Error expiring featured listings:", err.message);
  }
}

// ─── 3-day expiry warnings ───────────────────────────────────────────────────
async function sendExpiryWarnings() {
  try {
    const now = new Date();
    // Window: between now and 3 days + 1 hour from now (gives a ~1-hour window to catch)
    const warningStart = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000);
    const warningEnd   = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000);

    // Premium warnings
    const warnPremiumUsers = await User.find({
      isPremium: true,
      premiumExpiresAt: { $gte: warningStart, $lte: warningEnd },
      premiumWarned: { $ne: true },
    });

    for (const user of warnPremiumUsers) {
      const days = daysUntil(user.premiumExpiresAt);
      await Notification.create({
        user: user._id,
        text: `⚠️ Your UniVerse Premium subscription expires in ${days} day${days !== 1 ? "s" : ""}. Renew to keep your perks.`,
        type: "system",
        link: "/premium",
      });

      // Mark as warned so we don't spam
      user.premiumWarned = true;
      await user.save();

      console.log(`[Scheduler] Premium warning sent for user ${user._id}`);
    }

    // Urgent badge warnings
    const warnUrgentListings = await Listing.find({
      urgent: true,
      urgentExpiresAt: { $gte: warningStart, $lte: warningEnd },
      urgentWarned: { $ne: true },
    });

    for (const listing of warnUrgentListings) {
      const days = daysUntil(listing.urgentExpiresAt);
      await Notification.create({
        user: listing.seller,
        text: `⚠️ The Urgent Sale badge on "${listing.title}" expires in ${days} day${days !== 1 ? "s" : ""}.`,
        type: "listing",
        link: `/marketplace/${listing._id}`,
      });

      listing.urgentWarned = true;
      await listing.save();
    }

    // Featured listing warnings
    const warnFeaturedListings = await Listing.find({
      featured: true,
      featuredExpiresAt: { $gte: warningStart, $lte: warningEnd },
      featuredWarned: { $ne: true },
    });

    for (const listing of warnFeaturedListings) {
      const days = daysUntil(listing.featuredExpiresAt);
      await Notification.create({
        user: listing.seller,
        text: `⚠️ The Featured boost on "${listing.title}" expires in ${days} day${days !== 1 ? "s" : ""}.`,
        type: "listing",
        link: `/marketplace/${listing._id}`,
      });

      listing.featuredWarned = true;
      await listing.save();
    }
  } catch (err) {
    console.error("[Scheduler] Error sending expiry warnings:", err.message);
  }
}

// ─── Start all cron jobs ─────────────────────────────────────────────────────
function startScheduler() {
  // Run every hour on the hour
  cron.schedule("0 * * * *", async () => {
    console.log("[Scheduler] Running expiry checks...");
    await Promise.all([
      expirePremiumAccounts(),
      expireUrgentBadges(),
      expireFeaturedListings(),
      sendExpiryWarnings(),
    ]);
    console.log("[Scheduler] Expiry checks done.");
  });

  console.log("✅ Scheduler started — expiry checks run every hour.");
}

module.exports = { startScheduler };
