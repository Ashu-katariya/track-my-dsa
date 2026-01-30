const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    // ===== PROFILE FIELDS =====
    bio: {
      type: String,
      default: ""
    },

    goal: {
      type: String,
      default: ""
    },

    level: {
      type: String,
      default: ""
    },

    dailyTarget: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
