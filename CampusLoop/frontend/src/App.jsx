// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddTask from "./pages/AddTask";
import Tasks from "./pages/Tasks";
import Pomodoro from "./pages/Pomodoro";
import Goals from "./pages/Goals";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/goals" element={<Goals />} />
          {/* Add a catch-all route for debugging */}
          <Route path="*" element={
            <div className="container py-5">
              <h1>404 - Page Not Found</h1>
              <p>Available routes:</p>
              <ul>
                <li><a href="/">/ - Home</a></li>
                <li><a href="/add-task">/add-task - Add Task</a></li>
                <li><a href="/tasks">/tasks - Tasks</a></li>
                <li><a href="/pomodoro">/pomodoro - Pomodoro</a></li>
                <li><a href="/goals">/goals - Goals</a></li>
              </ul>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;