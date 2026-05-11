// seed.js
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected for seeding...");

    // 1. Clear existing users to avoid "Email already exists" errors
    await mongoose.connection.db.collection("users").deleteMany({});

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // 3. Create the Admin object
    const adminUser = {
      name: "System Admin",
      email: "admin@company.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
      createdAt: new Date(),
    };

    // 4. INSERT and WAIT (The await is crucial)
    await mongoose.connection.db.collection("users").insertOne(adminUser);

    console.log("✅ Admin created: admin@company.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

runSeed();
