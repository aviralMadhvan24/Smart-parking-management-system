import { Router } from "express";
import mongoose from "mongoose";
import Reservation from "../models/Reservation.js";
import ParkingSlot from "../models/ParkingSlot.js";
import AuditLog from "../models/AuditLog.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, isValidDate } from "../utils/http.js";

const router = Router();
router.use(requireAuth);

router.post("/", asyncHandler(async (req, res) => {
  const { slotId, vehicleNumber, startTime, endTime } = req.body || {};
  if (!/^[a-f\d]{24}$/i.test(String(slotId || "")) || !vehicleNumber?.trim() || !isValidDate(startTime) || !isValidDate(endTime)) {
    return res.status(400).json({ success: false, message: "A valid slot, vehicle number, start time, and end time are required." });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  if (start <= new Date() || end <= start) {
    return res.status(400).json({ success: false, message: "Start time must be in the future and end time must be after start time." });
  }

  const slot = await ParkingSlot.findById(slotId);
  if (!slot || slot.status !== "ACTIVE") {
    return res.status(404).json({ success: false, message: "Parking slot not found or not active." });
  }

  // MongoDB transaction is used so reservation writes and conflict checks participate
  // in a transaction. MongoDB must be configured as a replica set.
  const session = await mongoose.startSession();
  let created;
  try {
    await session.withTransaction(async () => {
      const conflict = await Reservation.findOne({
        slotId,
        status: { $in: ["CONFIRMED", "CHECKED_IN"] },
        startTime: { $lt: end },
        endTime: { $gt: start }
      }).session(session);

      if (conflict) {
        const err = new Error("This slot is already reserved for an overlapping time.");
        err.status = 409;
        throw err;
      }

      [created] = await Reservation.create([{
        userId: req.user._id,
        slotId,
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        startTime: start,
        endTime: end,
        status: "CONFIRMED"
      }], { session });

      await AuditLog.create([{
        actorId: req.user._id,
        action: "RESERVATION_CREATED",
        entityType: "RESERVATION",
        entityId: String(created._id),
        metadata: { slotId: String(slotId) }
      }], { session });
    });
  } finally {
    await session.endSession();
  }

  res.status(201).json({ success: true, data: created });
}));

router.get("/me", asyncHandler(async (req, res) => {
  const data = await Reservation.find({ userId: req.user._id })
    .populate({ path: "slotId", populate: { path: "lotId", select: "name address" } })
    .sort({ createdAt: -1 });
  res.json({ success: true, data });
}));

router.patch("/:id/cancel", asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!/^[a-f\d]{24}$/i.test(id)) return res.status(400).json({ success: false, message: "Invalid reservation ID." });

  const reservation = await Reservation.findById(id);
  if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found." });

  const isOwner = String(reservation.userId) === String(req.user._id);
  if (!isOwner && req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "You cannot cancel this reservation." });
  if (reservation.status !== "CONFIRMED") return res.status(409).json({ success: false, message: "Only confirmed reservations can be cancelled." });

  reservation.status = "CANCELLED";
  await reservation.save();
  await AuditLog.create({
    actorId: req.user._id,
    action: "RESERVATION_CANCELLED",
    entityType: "RESERVATION",
    entityId: String(reservation._id)
  });

  res.json({ success: true, data: reservation });
}));

export default router;
