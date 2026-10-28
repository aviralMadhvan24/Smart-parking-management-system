import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSlot", required: true, index: true },
  vehicleNumber: { type: String, required: true, trim: true, uppercase: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED", "CHECKED_IN", "COMPLETED", "NO_SHOW"],
    default: "CONFIRMED",
    index: true
  }
}, { timestamps: true });

reservationSchema.index({ slotId: 1, startTime: 1, endTime: 1 });

export default mongoose.model("Reservation", reservationSchema);
