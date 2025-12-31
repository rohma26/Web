import React, { useState } from "react";
import { FaBullseye, FaPlus, FaCheckCircle, FaCalendarAlt, FaTrash } from "react-icons/fa";

const Goals = () => {
  const [goals] = useState([
    { id: 1, title: "Complete 10 Tasks", type: "Weekly", target: 10, current: 7, deadline: "2024-03-20", progress: 70 },
    { id: 2, title: "30 Pomodoro Sessions", type: "Monthly", target: 30, current: 18, deadline: "2024-03-31", progress: 60 },
    { id: 3, title: "Learn React Hooks", type: "Custom", target: 15, current: 15, deadline: "2024-03-15", progress: 100 },
  ]);

  return (
    <div className="container py-4">
      <h1 className="mb-4"><FaBullseye className="me-2" />Goals</h1>
      <div className="row">
        {goals.map(goal => (
          <div key={goal.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{goal.title}</h5>
                <p className="card-text">
                  <small className="text-muted">
                    <FaCalendarAlt className="me-1" /> Due: {goal.deadline}
                  </small>
                </p>
                <div className="progress mb-3">
                  <div className="progress-bar" style={{ width: `${goal.progress}%` }}>
                    {goal.progress}%
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <span>{goal.current}/{goal.target} completed</span>
                  {goal.progress === 100 && <FaCheckCircle className="text-success" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;