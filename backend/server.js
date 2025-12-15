// backend/server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/trackmydsa";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
  // don't exit immediately so you can see error in console;
  // process.exit(1);
});

// Mongoose schema & model
const { Schema, model } = mongoose;

const problemSchema = new Schema({
  title: { type: String, required: true },
  platform: { type: String, default: "" },
  topic: { type: String, default: "" },
  difficulty: { type: String, default: "Medium" },
  status: { type: String, default: "todo" },
  notes: { type: String, default: "" }, // 🆕 user notes
}, { timestamps: true });


const Problem = model("Problem", problemSchema);

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TrackMyDSA backend is running",
    time: new Date().toISOString(),
  });
});

// GET all problems
app.get("/api/problems", async (req, res) => {
  try {
    const list = await Problem.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("GET /api/problems error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create
app.post("/api/problems", async (req, res) => {
  try {
    const { title, platform, topic, difficulty, status } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const doc = await Problem.create({ title, platform, topic, difficulty, status });
    res.status(201).json(doc);
  } catch (err) {
    console.error("POST /api/problems error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update
app.put("/api/problems/:id", async (req, res) => {
  try {
    const doc = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: "Problem not found" });
    res.json(doc);
  } catch (err) {
    console.error("PUT /api/problems/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE
app.delete("/api/problems/:id", async (req, res) => {
  try {
    const doc = await Problem.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Problem not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/problems/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Listen
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
