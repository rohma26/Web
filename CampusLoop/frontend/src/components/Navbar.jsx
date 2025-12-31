import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Add Task", path: "/add-task" },
    { name: "Tasks", path: "/tasks" },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#1f1f1f", padding: "0.8rem 1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{ color: "#ffc107", fontSize: "1.5rem" }}
        >
          TaskManager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li className="nav-item" key={link.name}>
                  <Link
                    to={link.path}
                    className="nav-link px-3 rounded"
                    style={{
                      color: isActive ? "#1f1f1f" : "#ffffff",
                      backgroundColor: isActive ? "#ffc107" : "transparent",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.target.style.backgroundColor = "#ffc10733";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    {link.name}
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
