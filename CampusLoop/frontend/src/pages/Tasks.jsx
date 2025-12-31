import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch {
      alert("Failed to fetch tasks");
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const handleUpdate = (id, status) => {
    setTasks(
      tasks.map((task) => (task._id === id ? { ...task, status } : task))
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-center text-muted">No tasks added yet.</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))
      )}
    </div>
  );
};

export default Tasks;
