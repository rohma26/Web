// models/task_temp.js - Just add category and tags fields
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
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
    // Add these two optional fields for better organization
    category: {
      type: String,
      enum: ["Work", "Personal", "Shopping", "Health", "Other"],
      default: "Other"
    },
    tags: [String] // Simple array of strings
  },
  { timestamps: true }
);

// Add a virtual property for overdue status
taskSchema.virtual('isOverdue').get(function() {
  return this.status === "Pending" && new Date(this.dueDate) < new Date();
});

module.exports = mongoose.model("Task", taskSchema);