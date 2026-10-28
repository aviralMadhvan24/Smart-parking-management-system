import { Router } from "express";
import ParkingLot from "../models/ParkingLot.js";
import ParkingSlot from "../models/ParkingSlot.js";
import Reservation from "../models/Reservation.js";
import AuditLog from "../models/AuditLog.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/summary", asyncHandler(async (_req, res) => {
  const [lots, slots, reservations] = await Promise.all([
    ParkingLot.countDocuments({ active: true }),
    ParkingSlot.find({ status: { $ne: "INACTIVE" } }).select("status").lean(),
    Reservation.countDocuments({ status: "CONFIRMED", endTime: { $gt: new Date() } })
  ]);
  res.json({
    success: true,
    data: {
      activeLots: lots,
      activeSlots: slots.length,
      maintenanceSlots: slots.filter(s => s.status === "MAINTENANCE").length,
      activeReservations: reservations
    }
  });
}));

router.post("/parking-lots", asyncHandler(async (req, res) => {
  const { name, address } = req.body || {};
  if (!name?.trim() || !address?.trim()) return res.status(400).json({ success: false, message: "Lot name and address are required." });
  const lot = await ParkingLot.create({ name: name.trim(), address: address.trim() });
  await AuditLog.create({ actorId: req.user._id, action: "PARKING_LOT_CREATED", entityType: "PARKING_LOT", entityId: String(lot._id) });
  res.status(201).json({ success: true, data: lot });
}));

router.post("/slots", asyncHandler(async (req, res) => {
  const { lotId, slotCode, type = "STANDARD", hourlyRate = 20 } = req.body || {};
  if (!/^[a-f\d]{24}$/i.test(String(lotId || "")) || !slotCode?.trim() || !["STANDARD", "ACCESSIBLE", "EV"].includes(type) || !Number.isFinite(Number(hourlyRate)) || Number(hourlyRate) < 0) {
    return res.status(400).json({ success: false, message: "Valid lot, slot code, slot type, and non-negative hourly rate are required." });
  }
  const lot = await ParkingLot.findById(lotId);
  if (!lot || !lot.active) return res.status(404).json({ success: false, message: "Active parking lot not found." });
  const slot = await ParkingSlot.create({ lotId, slotCode: slotCode.trim(), type, hourlyRate: Number(hourlyRate) });
  await AuditLog.create({ actorId: req.user._id, action: "PARKING_SLOT_CREATED", entityType: "PARKING_SLOT", entityId: String(slot._id) });
  res.status(201).json({ success: true, data: slot });
}));

router.patch("/slots/:id/status", asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!["ACTIVE", "MAINTENANCE", "INACTIVE"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be ACTIVE, MAINTENANCE, or INACTIVE." });
  }
  const slot = await ParkingSlot.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!slot) return res.status(404).json({ success: false, message: "Slot not found." });
  await AuditLog.create({ actorId: req.user._id, action: "PARKING_SLOT_STATUS_UPDATED", entityType: "PARKING_SLOT", entityId: String(slot._id), metadata: { status } });
  res.json({ success: true, data: slot });
}));

export default router;
