// server.js
require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");

// Import routes
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");
const goalRoutes = require("./routes/goalRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/pomodoro", pomodoroRoutes);

app.get("/", (req, res) => {
  res.json({ 
    message: "Task Manager API is running",
    endpoints: {
      tasks: "/api/tasks",
      dashboard: "/api/dashboard",
      goals: "/api/goals",
      pomodoro: "/api/pomodoro"
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard API: http://localhost:${PORT}/api/dashboard/stats`);
});