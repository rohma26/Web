require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
