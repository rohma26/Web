// pages/Tasks.jsx
import React, { useEffect, useState } from "react";
import { 
  FaFilter, FaSearch, FaSort, FaCalendarAlt, 
  FaFlag, FaCheckCircle, FaClock, FaExclamationTriangle,
  FaEdit, FaTrash, FaEye, FaEyeSlash 
} from "react-icons/fa";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import { format, isToday, isTomorrow, isPast } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, completed, pending, overdue
  const [sortBy, setSortBy] = useState("dueDate"); // dueDate, priority, created
  const [showCompleted, setShowCompleted] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/tasks");
      const tasksData = res.data;
      setTasks(tasksData);
      updateStats(tasksData);
      filterAndSortTasks(tasksData);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (tasksData) => {
    const total = tasksData.length;
    const completed = tasksData.filter(t => t.status === "Completed").length;
    const pending = tasksData.filter(t => t.status === "Pending").length;
    const overdue = tasksData.filter(t => 
      t.status === "Pending" && 
      new Date(t.dueDate) < new Date()
    ).length;
    
    setStats({ total, completed, pending, overdue });
  };

  const filterAndSortTasks = (tasksList = tasks) => {
    let result = tasksList;

    // Apply filters
    switch (filter) {
      case "completed":
        result = result.filter(t => t.status === "Completed");
        break;
      case "pending":
        result = result.filter(t => t.status === "Pending");
        break;
      case "overdue":
        result = result.filter(t => 
          t.status === "Pending" && 
          new Date(t.dueDate) < new Date()
        );
        break;
      case "today":
        result = result.filter(t => isToday(new Date(t.dueDate)));
        break;
      case "high":
        result = result.filter(t => t.priority === "High");
        break;
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }

    // Hide completed if needed
    if (!showCompleted) {
      result = result.filter(t => t.status !== "Completed");
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter(task => task._id !== id);
    setTasks(updatedTasks);
    updateStats(updatedTasks);
    filterAndSortTasks(updatedTasks);
  };

  const handleUpdate = (id, status) => {
    const updatedTasks = tasks.map(task => 
      task._id === id ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    updateStats(updatedTasks);
    filterAndSortTasks(updatedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [searchTerm, filter, sortBy, showCompleted]);

  const getDueDateLabel = (date) => {
    const taskDate = new Date(date);
    if (isToday(taskDate)) return "Today";
    if (isTomorrow(taskDate)) return "Tomorrow";
    if (isPast(taskDate)) return "Overdue";
    return format(taskDate, "MMM dd");
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className="col-md-3 col-sm-6 mb-3">
      <div className="card border-0 shadow-sm h-100" style={{ 
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        borderLeft: `4px solid ${color}` 
      }}>
        <div className="card-body d-flex align-items-center p-3">
          <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${color}20` }}>
            <div style={{ color }}>{icon}</div>
          </div>
          <div>
            <h3 className="mb-0 fw-bold">{value}</h3>
            <p className="text-muted mb-0 small">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh'
    }}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold mb-2" style={{ color: '#1e293b' }}>Your Tasks</h1>
              <p className="text-muted">Manage and organize all your tasks in one place</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary rounded-pill d-flex align-items-center gap-2"
                onClick={() => window.location.href = '/add-task'}
              >
                <FaEdit /> Add New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row mb-4">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          color="#6366f1" 
          icon={<FaFlag size={20} />} 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          color="#10b981" 
          icon={<FaCheckCircle size={20} />} 
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          color="#f59e0b" 
          icon={<FaClock size={20} />} 
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue} 
          color="#ef4444" 
          icon={<FaExclamationTriangle size={20} />} 
        />
      </div>

      {/* Filters & Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: '48px' }}
                />
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="d-flex flex-wrap gap-2">
                <div className="dropdown">
                  <button className="btn btn-outline-secondary rounded-pill dropdown-toggle d-flex align-items-center gap-2" 
                          type="button" data-bs-toggle="dropdown">
                    <FaFilter /> Filter
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={() => setFilter("all")}>All Tasks</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter("completed")}>Completed</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter("pending")}>Pending</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter("overdue")}>Overdue</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter("today")}>Due Today</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter("high")}>High Priority</button></li>
                  </ul>
                </div>

                <div className="dropdown">
                  <button className="btn btn-outline-secondary rounded-pill dropdown-toggle d-flex align-items-center gap-2" 
                          type="button" data-bs-toggle="dropdown">
                    <FaSort /> Sort By
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={() => setSortBy("dueDate")}>Due Date</button></li>
                    <li><button className="dropdown-item" onClick={() => setSortBy("priority")}>Priority</button></li>
                    <li><button className="dropdown-item" onClick={() => setSortBy("created")}>Recently Added</button></li>
                  </ul>
                </div>

                <button 
                  className={`btn ${showCompleted ? 'btn-outline-primary' : 'btn-outline-secondary'} rounded-pill d-flex align-items-center gap-2`}
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  {showCompleted ? <FaEye /> : <FaEyeSlash />}
                  {showCompleted ? 'Hide Completed' : 'Show Completed'}
                </button>

                <div className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 d-flex align-items-center">
                  {filteredTasks.length} tasks found
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="row">
        <div className="col-12">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <div className="rounded-circle bg-light p-4 d-inline-flex">
                  <FaFlag className="text-muted" size={48} />
                </div>
              </div>
              <h4 className="mb-3">No tasks found</h4>
              <p className="text-muted mb-4">
                {searchTerm || filter !== "all" 
                  ? "Try changing your search or filter criteria"
                  : "Start by adding your first task!"
                }
              </p>
              {!searchTerm && filter === "all" && (
                <button 
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => window.location.href = '/add-task'}
                >
                  Add Your First Task
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {filteredTasks.map((task) => (
                <div key={task._id} className="col-lg-4 col-md-6">
                  <TaskCard 
                    task={task}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    dueDateLabel={getDueDateLabel(task.dueDate)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;