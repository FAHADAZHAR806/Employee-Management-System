// test-conn.js
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function test() {
  console.log("Connecting to:", process.env.MONGODB_URI?.split("@")[1]); // Logs cluster only for safety

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ SUCCESS: Your project is connected to MongoDB Atlas!");
    console.log("Database Name:", mongoose.connection.name);
    process.exit(0);
  } catch (err) {
    console.error("❌ CONNECTION ERROR:", err.message);
    process.exit(1);
  }
}

test();
