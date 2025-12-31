import React from "react";
import axios from "axios";

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { status: newStatus });
      onUpdate(task._id, newStatus);
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
      onDelete(task._id);
    } catch {
      alert("Failed to delete task.");
    }
  };

  const statusClass = task.status === "Completed" ? "badge bg-success" : "badge bg-warning";
  const priorityClass =
    task.priority === "High" ? "text-danger fw-bold" :
    task.priority === "Medium" ? "text-warning fw-bold" :
    "text-secondary fw-bold";

  return (
    <div
      className="card mb-3 rounded-4 shadow-sm"
      style={{ backgroundColor: "#f8f9fa", color: "#212529", transition: "transform 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text text-muted">{task.description}</p>
<p className="card-text text-muted">
  Due date: {new Date(task.dueDate).toLocaleDateString("en-GB")}
</p>
            <p className="mb-2">
              <span className={statusClass}>{task.status}</span> |{" "}
              <span className={priorityClass}>{task.priority}</span>
            </p>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
        <div className="mt-2">
          <select className="form-select form-select-sm w-auto" value={task.status} onChange={handleStatusChange}>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

