// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const Task = require("../models/task_temp");
const Goal = require("../models/Goal");
const PomodoroSession = require("../models/PomodoroSession");
const { protect } = require("../middleware/authMiddleware"); // Import guard

router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user.id; // Get the ID once for reuse

    // 1. Task Statistics (Filtered by User)
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, status: "Completed" });
    const pendingTasks = await Task.countDocuments({ user: userId, status: "Pending" });
    const overdueTasks = await Task.countDocuments({
      user: userId,
      status: "Pending",
      dueDate: { $lt: new Date() }
    });

    // 2. Priority Distribution (Filtered by User)
    const priorityStats = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } }, // <--- Filter First!
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Weekly Trends (Filtered by User)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const completedCount = await Task.countDocuments({
        user: userId,
        status: "Completed",
        updatedAt: { $gte: date, $lt: nextDay }
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        completed: completedCount
      });
    }

    // 4. Goal Statistics (Assuming Goal model has a 'user' field too - update it if needed!)
    // For now, if Goal doesn't have a user field, this might crash or show all. 
    // You should update Goal model similar to Task model if you use Goals.
    const activeGoals = await Goal.countDocuments({ user: userId, status: "Active" });
    const completedGoals = await Goal.countDocuments({ user: userId, status: "Completed" });

    // 5. Pomodoro (We'll assume sessions are strictly local for now or linked to tasks)
    // If you want to save sessions to DB, update PomodoroSession model to include 'user' too.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Assuming PomodoroSession also has a 'user' field now, or we skip if not implemented yet
    // For safety, let's wrap this in a check or update PomodoroSession model
    const todaySessions = 0; // Placeholder until Pomodoro Model is updated
    const totalFocusTime = 0; 

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
      goals: { active: activeGoals, completed: completedGoals },
      pomodoro: { sessionsToday: todaySessions, focusTimeToday: totalFocusTime },
      productivityScore: 85 // Simplified for now
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;