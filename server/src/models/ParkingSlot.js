import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema({
  lotId: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingLot", required: true, index: true },
  slotCode: { type: String, required: true, trim: true, uppercase: true },
  type: { type: String, enum: ["STANDARD", "ACCESSIBLE", "EV"], default: "STANDARD" },
  status: { type: String, enum: ["ACTIVE", "MAINTENANCE", "INACTIVE"], default: "ACTIVE" },
  hourlyRate: { type: Number, min: 0, default: 20 }
}, { timestamps: true });

parkingSlotSchema.index({ lotId: 1, slotCode: 1 }, { unique: true });

export default mongoose.model("ParkingSlot", parkingSlotSchema);
