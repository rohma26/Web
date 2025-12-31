const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    dueDate: { 
      type: Date, 
      required: true 
    }, // ✅ NEW DATE FIELD

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
