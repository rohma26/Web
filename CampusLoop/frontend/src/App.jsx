// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import Pomodoro from "./pages/Pomodoro";
import Login from "./pages/Login";

function App() {
  // Check if token exists
  const isAuthenticated = !!localStorage.getItem('user_token');

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar />}
        
        <div className={isAuthenticated ? "main-content" : ""}>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

            {/* Protected Routes */}
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />} />
            <Route path="/add-task" element={isAuthenticated ? <AddTask /> : <Navigate to="/login" />} />
            <Route path="/pomodoro" element={isAuthenticated ? <Pomodoro /> : <Navigate to="/login" />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;