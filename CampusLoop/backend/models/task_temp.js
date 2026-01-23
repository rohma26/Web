// backend/models/task_temp.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // NEW: Link task to a specific user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Connects to the User model
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Pending", "Completed"], 
      default: "Pending" 
    },
    priority: { 
      type: String, 
      enum: ["Low", "Medium", "High"], 
      default: "Low" 
    },
    category: {
      type: String,
      enum: ["Work", "Personal", "Shopping", "Health", "Other"],
      default: "Other"
    },
    tags: [String]
  },
  { timestamps: true }
);

taskSchema.virtual('isOverdue').get(function() {
  return this.status === "Pending" && new Date(this.dueDate) < new Date();
});

module.exports = mongoose.model("Task", taskSchema);