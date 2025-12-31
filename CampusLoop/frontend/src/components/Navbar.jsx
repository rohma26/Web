// components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaPlus, FaTasks, FaChartBar, FaClock, FaBullseye, FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);

  // In your existing Navbar.jsx, ensure this is in the links array:
const links = [
  { name: "Home", path: "/" },
  { name: "Add Task", path: "/add-task" },
  { name: "Tasks", path: "/tasks" },
  { name: "Pomodoro", path: "/pomodoro" },
  { name: "Goals", path: "/goals" },
];

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'bg-dark' : 'bg-light'} shadow-sm`} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <div className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
            <FaChartBar className="text-white" />
          </div>
          <span className={darkMode ? "text-white" : "text-dark"}>TaskFlow</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-2"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? "Light" : "Dark"}
          </button>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className={`navbar-toggler-icon ${darkMode ? 'text-white' : ''}`}></span>
          </button>
        </div>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li className="nav-item" key={link.name}>
                  <Link
                    to={link.path}
                    className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${isActive ? 'active' : ''}`}
                    style={{
                      backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: isActive ? '#6366f1' : darkMode ? '#e2e8f0' : '#4a5568',
                      border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                        e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    {link.icon}
                    <span className="d-none d-md-inline">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;