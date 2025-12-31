// models/Goal.js
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Weekly", "Monthly", "Yearly", "Custom"],
      default: "Weekly"
    },
    target: {
      type: Number,
      required: true,
      min: 1
    },
    current: {
      type: Number,
      default: 0,
      min: 0
    },
    deadline: {
      type: Date,
      required: true
    },
    category: {
      type: String,
      enum: ["Tasks", "Learning", "Fitness", "Productivity", "Other"],
      default: "Productivity"
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Failed"],
      default: "Active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);