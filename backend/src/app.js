import "./models/db.js";
import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event-routes.js";

const app = express();

app.use(cors());
app.use(express.json()); // body -> req.body

// GET /health
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    student: "2416501069",
  });
});

app.use("/events", eventRoutes);

// Eşleşmeyen route'lar için 404
app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
});

// Global hata işleyici
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ error: { message: err.message } });
  }
  res.status(500).json({ error: { message: err.message || "Internal server error" } });
});

export default app;
