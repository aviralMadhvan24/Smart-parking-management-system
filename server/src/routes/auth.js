import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/http.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name?.trim() || !email?.trim() || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ success: false, message: "Name, valid email, and password of at least 8 characters are required." });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) return res.status(409).json({ success: false, message: "An account with this email already exists." });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, role: "USER" });
  res.status(201).json({
    success: true,
    token: issueToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required." });

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select("+passwordHash");
  const valid = user && await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) return res.status(401).json({ success: false, message: "Invalid email or password." });

  res.json({
    success: true,
    token: issueToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}));

router.get("/me", requireAuth, (req, res) => {
  res.json({ success: true, user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

export default router;
