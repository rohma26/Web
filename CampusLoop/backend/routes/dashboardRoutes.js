// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const Task = require("../models/task_temp");
const Goal = require("../models/Goal");
const PomodoroSession = require("../models/PomodoroSession");

// GET comprehensive dashboard stats
router.get("/stats", async (req, res) => {
  try {
    // Task Statistics
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const overdueTasks = await Task.countDocuments({
      status: "Pending",
      dueDate: { $lt: new Date() }
    });

    // Priority Distribution
    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    // Weekly Completion Trends (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const completedCount = await Task.countDocuments({
        status: "Completed",
        updatedAt: {
          $gte: date,
          $lt: nextDay
        }
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        completed: completedCount
      });
    }

    // Goal Statistics
    const activeGoals = await Goal.countDocuments({ status: "Active" });
    const completedGoals = await Goal.countDocuments({ status: "Completed" });

    // Pomodoro Statistics (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await PomodoroSession.countDocuments({
      completedAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const totalFocusTime = await PomodoroSession.aggregate([
      {
        $match: {
          type: "Work",
          completedAt: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: "$duration" }
        }
      }
    ]);

    res.json({
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
      },
      priorityDistribution: priorityStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      weeklyTrends: last7Days,
      goals: {
        active: activeGoals,
        completed: completedGoals
      },
      pomodoro: {
        sessionsToday: todaySessions,
        focusTimeToday: totalFocusTime[0]?.totalMinutes || 0
      },
      productivityScore: calculateProductivityScore(
        completedTasks,
        overdueTasks,
        activeGoals,
        todaySessions
      )
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate productivity score
function calculateProductivityScore(completedTasks, overdueTasks, activeGoals, pomodoroSessions) {
  let score = 0;
  
  // Points for completed tasks
  score += completedTasks * 10;
  
  // Penalty for overdue tasks
  score -= overdueTasks * 5;
  
  // Points for active goals
  score += activeGoals * 15;
  
  // Points for pomodoro sessions
  score += pomodoroSessions * 8;
  
  // Cap score at 100
  return Math.min(100, Math.max(0, score));
}

module.exports = router;