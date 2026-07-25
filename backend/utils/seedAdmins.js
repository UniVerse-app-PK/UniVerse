const User = require("../models/User");
const bcrypt = require("bcryptjs");

const admins = [
  { email: "kavindu@universe.nust.edu.pk", name: "Kavindu" },
  { email: "ammara@universe.nust.edu.pk", name: "Ammara" },
  { email: "namra@universe.nust.edu.pk", name: "Namra" },
  { email: "amna@universe.nust.edu.pk", name: "Amna" },
];

const seedAdmins = async () => {
  try {
    const hashedPassword = await bcrypt.hash("12345678", 10);

    for (const admin of admins) {
      const existingUser = await User.findOne({ email: admin.email });

      if (!existingUser) {
        await User.create({
          name: admin.name,
          email: admin.email,
          password: hashedPassword,
          university: "NUST",
          role: "admin",
          verified: true,
        });
        console.log(`👤 Admin account seeded: ${admin.email}`);
      } else {
        let updated = false;
        if (existingUser.role !== "admin") {
          existingUser.role = "admin";
          updated = true;
        }
        if (!existingUser.verified) {
          existingUser.verified = true;
          updated = true;
        }
        if (updated) {
          await existingUser.save();
          console.log(`👤 Admin account updated to admin role: ${admin.email}`);
        }
      }
    }
    console.log("✅ Admin seeding check complete.");
  } catch (error) {
    console.error("❌ Error seeding admin accounts:", error);
  }
};

module.exports = seedAdmins;
