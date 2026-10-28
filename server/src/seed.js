import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import ParkingLot from "./models/ParkingLot.js";
import ParkingSlot from "./models/ParkingSlot.js";

await connectDB();

const email = "admin@smartparking.local";
let admin = await User.findOne({ email });
if (!admin) {
  admin = await User.create({
    name: "Parking Administrator",
    email,
    passwordHash: await bcrypt.hash("Admin123!", 12),
    role: "ADMIN"
  });
}

let lot = await ParkingLot.findOne({ name: "Campus Parking" });
if (!lot) lot = await ParkingLot.create({ name: "Campus Parking", address: "Main Campus" });

for (let i = 1; i <= 12; i++) {
  const slotCode = `A-${String(i).padStart(2, "0")}`;
  await ParkingSlot.updateOne(
    { lotId: lot._id, slotCode },
    { $setOnInsert: { lotId: lot._id, slotCode, type: "STANDARD", status: "ACTIVE", hourlyRate: 20 } },
    { upsert: true }
  );
}

console.log("Seed complete.");
console.log("Demo admin: admin@smartparking.local / Admin123!");
console.log("Change this demo password before deployment.");
await mongoose.disconnect();
