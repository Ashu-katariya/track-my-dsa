// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/authMiddleware");


require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);



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
  notes: { type: String, default: "" },

  // 🔐 owner of this problem
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

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



// ✅ GET only logged-in user's problems
app.get("/api/problems", authMiddleware, async (req, res) => {
  try {
    const list = await Problem.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ CREATE problem for logged-in user
app.post("/api/problems", authMiddleware, async (req, res) => {
  try {
    const { title, platform, topic, difficulty, status, notes } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const problem = await Problem.create({
      title,
      platform,
      topic,
      difficulty,
      status,
      notes,
      user: req.userId   // 🔥 CORE LINE
    });

    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ UPDATE only own problem
app.put("/api/problems/:id", authMiddleware, async (req, res) => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // 🔐 ownership check
      req.body,
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ DELETE only own problem
app.delete("/api/problems/:id", authMiddleware, async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



// Listen
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
