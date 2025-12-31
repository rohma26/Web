// routes/pomodoroRoutes.js
const express = require("express");
const router = express.Router();
const PomodoroSession = require("../models/PomodoroSession");

// POST log a pomodoro session
router.post("/session", async (req, res) => {
  try {
    const { type, duration, taskId } = req.body;
    
    const session = new PomodoroSession({
      type,
      duration,
      taskId: taskId || null,
      completedAt: new Date()
    });

    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET today's pomodoro sessions
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessions = await PomodoroSession.find({
      completedAt: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ completedAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET weekly pomodoro stats
router.get("/weekly-stats", async (req, res) => {
  try {
    const last7Days = [];
    const stats = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySessions = await PomodoroSession.aggregate([
        {
          $match: {
            completedAt: {
              $gte: date,
              $lt: nextDay
            }
          }
        },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            totalDuration: { $sum: "$duration" }
          }
        }
      ]);

      const workSessions = daySessions.find(s => s._id === "Work") || { count: 0, totalDuration: 0 };
      const shortBreakSessions = daySessions.find(s => s._id === "Short Break") || { count: 0, totalDuration: 0 };
      const longBreakSessions = daySessions.find(s => s._id === "Long Break") || { count: 0, totalDuration: 0 };

      stats.push({
        date: date.toISOString().split('T')[0],
        workSessions: workSessions.count,
        workTime: workSessions.totalDuration,
        shortBreaks: shortBreakSessions.count,
        longBreaks: longBreakSessions.count
      });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;