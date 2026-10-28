import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import parkingRoutes from "./routes/parking.js";
import reservationRoutes from "./routes/reservations.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api", parkingRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found." }));

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || (err.code === 11000 ? 409 : 500);
  const message = status >= 500 ? "An unexpected server error occurred." : err.message;
  res.status(status).json({ success: false, message });
});

export default app;
