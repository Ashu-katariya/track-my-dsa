console.log("🔥 PROFILE ROUTE FILE LOADED");

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

/* =========================
   GET PROFILE
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   UPDATE PROFILE
========================= */
router.put("/", auth, async (req, res) => {
  try {
    const { bio, goal, level, dailyTarget, name } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (goal !== undefined) user.goal = goal;
    if (level !== undefined) user.level = level;
    if (dailyTarget !== undefined) user.dailyTarget = dailyTarget;

    await user.save();

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
