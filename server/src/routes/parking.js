import { Router } from "express";
import ParkingLot from "../models/ParkingLot.js";
import ParkingSlot from "../models/ParkingSlot.js";
import Reservation from "../models/Reservation.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.get("/parking-lots", asyncHandler(async (_req, res) => {
  const lots = await ParkingLot.find({ active: true }).sort({ name: 1 }).lean();
  res.json({ success: true, data: lots });
}));

router.get("/parking-lots/:lotId/slots", asyncHandler(async (req, res) => {
  const { lotId } = req.params;
  if (!/^[a-f\d]{24}$/i.test(lotId)) return res.status(400).json({ success: false, message: "Invalid parking lot ID." });

  const slots = await ParkingSlot.find({ lotId, status: { $ne: "INACTIVE" } }).sort({ slotCode: 1 }).lean();
  const now = new Date();
  const activeReservations = await Reservation.find({
    slotId: { $in: slots.map(s => s._id) },
    status: { $in: ["CONFIRMED", "CHECKED_IN"] },
    endTime: { $gt: now }
  }).select("slotId startTime endTime status").lean();

  const data = slots.map(slot => ({
    ...slot,
    currentlyOccupiedOrReserved: activeReservations.some(r => String(r.slotId) === String(slot._id) && r.startTime <= now && r.endTime > now),
    upcomingReservations: activeReservations.filter(r => String(r.slotId) === String(slot._id)).length
  }));
  res.json({ success: true, data });
}));

export default router;
