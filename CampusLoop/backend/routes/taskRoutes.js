// backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const Task = require("../models/task_temp"); // Or "../models/Task" if you renamed it
const { protect } = require("../middleware/authMiddleware"); // Import the guard

// 1. GET all tasks (Only for logged-in user)
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. POST create a task (Attach user ID)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, dueDate, status, priority, category, tags } = req.body;
    
    const task = new Task({ 
      user: req.user.id, // <--- IMPORTANT: Link task to user
      title, 
      dueDate, 
      description, 
      status, 
      priority,
      category: category || "Other",
      tags: tags || []
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. PUT update a task (Ensure ownership)
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the user owns this task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { title, description, status, priority, category, tags } = req.body;
    
    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (category) task.category = category;
    if (tags) task.tags = tags;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE a task (Ensure ownership)
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. GET recent tasks
router.get("/recent", protect, async (req, res) => {
  try {
    const recentTasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(recentTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;