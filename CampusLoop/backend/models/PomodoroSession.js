// models/PomodoroSession.js
const mongoose = require("mongoose");

const pomodoroSessionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Work", "Short Break", "Long Break"],
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PomodoroSession", pomodoroSessionSchema);