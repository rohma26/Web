import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
   const [dueDate, setDueDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Title and description required");

    try {
      await axios.post("http://localhost:5000/api/tasks", { title,dueDate, description, priority, status: "Pending" });
      navigate("/tasks");
    } catch {
      alert("Failed to add task.");
    }
  };

  return (
    <div
      className="container mt-5 d-flex justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="p-4 rounded-4 shadow-sm"
        style={{ backgroundColor: "#f8f9fa", width: "100%", maxWidth: "500px" }}
      >
        <h2 className="mb-4 text-center text-dark">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-dark">Title</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
   <div className="mb-3">
            <label className="form-label text-dark">Due Date</label>
            <input
              type="date"
              className="form-control rounded-3"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-dark">Description</label>
            <textarea
              className="form-control rounded-3"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label text-dark">Priority</label>
            <select
              className="form-select rounded-3"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn w-100 rounded-3 fw-bold"
            style={{
              backgroundColor: "#ffc107",
              color: "#212529",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6b800")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffc107")}
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
