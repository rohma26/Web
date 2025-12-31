// backend/routes/taskRoutes.js - UPDATED VERSION
const express = require("express");
const router = express.Router();
const Task = require("../models/task_temp");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a task
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, status, priority, category, tags } = req.body;
    const task = new Task({ 
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

// PUT update a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, description, status, priority, category, tags } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (tags !== undefined) task.tags = tags;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW: GET recent tasks for dashboard
router.get("/recent", async (req, res) => {
  try {
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(recentTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW: GET tasks stats for dashboard
router.get("/stats", async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    
    // Calculate overdue tasks
    const overdueTasks = await Task.countDocuments({
      status: "Pending",
      dueDate: { $lt: new Date() }
    });

    // Calculate weekly completion
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyCompleted = await Task.countDocuments({
      status: "Completed",
      updatedAt: { $gte: oneWeekAgo }
    });

    res.json({
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
      weeklyCompleted: weeklyCompleted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW: GET tasks by filter
router.get("/filter/:filter", async (req, res) => {
  try {
    let query = {};
    const { filter } = req.params;

    switch (filter) {
      case "completed":
        query = { status: "Completed" };
        break;
      case "pending":
        query = { status: "Pending" };
        break;
      case "overdue":
        query = { 
          status: "Pending",
          dueDate: { $lt: new Date() }
        };
        break;
      case "today":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        query = {
          dueDate: {
            $gte: today,
            $lt: tomorrow
          }
        };
        break;
      case "high":
        query = { priority: "High" };
        break;
      default:
        // Return all tasks
        break;
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;