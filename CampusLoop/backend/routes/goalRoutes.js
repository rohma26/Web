// routes/goalRoutes.js
const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");

// GET all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ deadline: 1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET active goals
router.get("/active", async (req, res) => {
  try {
    const activeGoals = await Goal.find({ 
      status: "Active",
      deadline: { $gte: new Date() }
    }).sort({ deadline: 1 });
    res.json(activeGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new goal
router.post("/", async (req, res) => {
  try {
    const { title, type, target, deadline, category } = req.body;
    
    const goal = new Goal({
      title,
      type,
      target,
      current: 0,
      deadline: new Date(deadline),
      category: category || "Productivity",
      status: "Active"
    });

    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update goal progress
router.put("/:id/progress", async (req, res) => {
  try {
    const { increment } = req.body;
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.current += parseInt(increment) || 1;
    
    // Check if goal is completed
    if (goal.current >= goal.target) {
      goal.current = goal.target;
      goal.status = "Completed";
    }

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update goal
router.put("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const { title, type, target, current, deadline, category, status } = req.body;

    if (title !== undefined) goal.title = title;
    if (type !== undefined) goal.type = type;
    if (target !== undefined) goal.target = target;
    if (current !== undefined) goal.current = current;
    if (deadline !== undefined) goal.deadline = deadline;
    if (category !== undefined) goal.category = category;
    if (status !== undefined) goal.status = status;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a goal
router.delete("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    await goal.deleteOne();
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;