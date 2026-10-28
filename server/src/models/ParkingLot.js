import mongoose from "mongoose";

const parkingLotSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("ParkingLot", parkingLotSchema);
