// pages/Tasks.jsx - ENHANCED UI VERSION
import React, { useEffect, useState } from "react";
import { 
  FaFilter, FaSearch, FaSort, 
  FaFlag, FaCheckCircle, FaClock, FaExclamationTriangle,
  FaEdit, FaEye, FaEyeSlash, FaCalendar, FaTags,
  FaCheck, FaTimes, FaTrash, FaPlus, FaListUl
} from "react-icons/fa";
import api from '../utils/axiosConfig';
// And verify you use 'api.get', 'api.post' instead of 'axios.get'
import { format, isToday, isTomorrow, isPast } from "date-fns";
import config from '../config';

// Enhanced Task Card Component
const EnhancedTaskCard = ({ task, onDelete, onUpdate, dueDateLabel }) => {
  const getPriorityColor = () => {
    switch(task.priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-low';
    }
  };

  const getDueDateClass = () => {
    if (dueDateLabel === 'Today') return 'due-today';
    if (dueDateLabel === 'Tomorrow') return 'due-tomorrow';
    if (dueDateLabel === 'Overdue') return 'due-overdue';
    return 'due-future';
  };

  return (
    <div className={`enhanced-task-card ${task.status.toLowerCase()}`}>
      <div className="task-card-header">
        <div style={{ flex: 1 }}>
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
        <span className={`priority-badge ${getPriorityColor()}`}>
          <FaFlag size={12} /> {task.priority}
        </span>
      </div>

      <div className="task-meta">
        <div className="task-meta-item">
          <FaCalendar className="icon" />
          <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
        </div>
        <div className="task-meta-item">
          <FaTags className="icon" />
          <span>{task.category || 'General'}</span>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className={`due-date-indicator ${getDueDateClass()}`}>
          <FaClock /> {dueDateLabel}
        </span>
        <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
          {task.status}
        </span>
      </div>

      <div className="task-actions">
        <div className="status-toggle">
          <button 
            className={`status-toggle-btn ${task.status === 'Pending' ? 'complete' : 'pending'}`}
            onClick={() => onUpdate(task._id, task.status === 'Pending' ? 'Completed' : 'Pending')}
          >
            {task.status === 'Pending' ? (
              <>✓ Mark Complete</>
            ) : (
              <>↻ Mark Pending</>
            )}
          </button>
        </div>
        <button 
          className="delete-btn"
          onClick={() => onDelete(task._id)}
          title="Delete Task"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

// Enhanced Stat Card for Tasks Page
const EnhancedStatCard = ({ title, value, color, icon }) => (
  <div className="col-md-3 col-sm-6 mb-4">
    <div className="task-stat-card">
      <div className="card-body">
        <div className="task-stat-icon" style={{ backgroundColor: `${color}20`, color }}>
          {icon}
        </div>
        <div>
          <div className="task-stat-value">{value}</div>
          <div className="task-stat-label">{title}</div>
        </div>
      </div>
    </div>
  </div>
);

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
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
      const apiUrl = config?.API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/tasks`);
      const tasksData = res.data;
      setTasks(tasksData);
      updateStats(tasksData);
      filterAndSortTasks(tasksData);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      // Sample data for demo
      const sampleTasks = [
        { _id: 1, title: "Complete project proposal", description: "Finish the client proposal document", dueDate: new Date(Date.now() + 86400000), priority: "High", status: "Pending", category: "Work" },
        { _id: 2, title: "Team meeting", description: "Weekly team sync meeting", dueDate: new Date(), priority: "Medium", status: "Pending", category: "Meeting" },
        { _id: 3, title: "Client presentation", description: "Prepare slides for client demo", dueDate: new Date(Date.now() - 86400000), priority: "High", status: "Completed", category: "Work" },
        { _id: 4, title: "Update documentation", description: "Update API documentation", dueDate: new Date(Date.now() + 172800000), priority: "Low", status: "Pending", category: "Documentation" },
      ];
      setTasks(sampleTasks);
      updateStats(sampleTasks);
      filterAndSortTasks(sampleTasks);
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
      default:
        break;
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
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
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
      updateStats(updatedTasks);
      filterAndSortTasks(updatedTasks);
    }
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
    if (isPast(taskDate) && !isToday(taskDate)) return "Overdue";
    return format(taskDate, "MMM dd");
  };

  // Quick filter tabs
  const filterTabs = [
    { key: "all", label: "All Tasks", icon: <FaListUl /> },
    { key: "pending", label: "Pending", icon: <FaClock /> },
    { key: "completed", label: "Completed", icon: <FaCheckCircle /> },
    { key: "overdue", label: "Overdue", icon: <FaExclamationTriangle /> },
    { key: "today", label: "Due Today", icon: <FaCalendar /> },
    { key: "high", label: "High Priority", icon: <FaFlag /> },
  ];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: 'var(--text-body)' }}>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      {/* Enhanced Page Header */}
      <div className="task-page-header">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div>
            <h1>Task Management</h1>
            <p className="mb-0" style={{ color: 'var(--text-body)', fontSize: '1.1rem' }}>
              Organize, track, and complete your tasks efficiently
            </p>
          </div>
          <button 
            className="btn btn-primary rounded-pill d-flex align-items-center gap-2 px-4 py-3 shadow-lg"
            onClick={() => window.location.href = '/add-task'}
          >
            <FaPlus /> <span>Add New Task</span>
          </button>
        </div>

        {/* Progress Overview */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="task-progress">
              <div className="progress-label">
                <span>Task Completion</span>
                <span>{stats.completed}/{stats.total} tasks</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar completed" 
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row mb-5">
        <EnhancedStatCard title="Total Tasks" value={stats.total} color="#6366f1" icon={<FaListUl size={24} />} />
        <EnhancedStatCard title="Completed" value={stats.completed} color="#10b981" icon={<FaCheckCircle size={24} />} />
        <EnhancedStatCard title="Pending" value={stats.pending} color="#f59e0b" icon={<FaClock size={24} />} />
        <EnhancedStatCard title="Overdue" value={stats.overdue} color="#ef4444" icon={<FaExclamationTriangle size={24} />} />
      </div>

      {/* Enhanced Filter Bar */}
      <div className="filter-bar">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-lg-6">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: '52px' }}
              />
            </div>
          </div>
          
          {/* Filter Actions */}
          <div className="col-lg-6">
            <div className="filter-actions">
              {/* Quick Filter Tabs */}
              <div className="status-filter-tabs">
                {filterTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={`status-tab ${filter === tab.key ? 'active' : ''}`}
                    onClick={() => setFilter(tab.key)}
                  >
                    {tab.icon} <span className="d-none d-md-inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Advanced Controls */}
              <div className="d-flex gap-2">
                <div className="dropdown filter-dropdown">
                  <button className="btn dropdown-toggle d-flex align-items-center gap-2" 
                          type="button" data-bs-toggle="dropdown">
                    <FaSort /> Sort
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={() => setSortBy("dueDate")}>Due Date</button></li>
                    <li><button className="dropdown-item" onClick={() => setSortBy("priority")}>Priority</button></li>
                    <li><button className="dropdown-item" onClick={() => setSortBy("created")}>Recently Added</button></li>
                  </ul>
                </div>

                <button 
                  className={`btn ${showCompleted ? 'btn-outline-primary' : 'btn-outline-secondary'} d-flex align-items-center gap-2`}
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  {showCompleted ? <FaEye /> : <FaEyeSlash />}
                  <span className="d-none d-sm-inline">{showCompleted ? 'Hide' : 'Show'} Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Count Indicator */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0" style={{ color: 'var(--text-main)' }}>
          <strong>{filteredTasks.length}</strong> tasks found
          {filter !== 'all' && ` in ${filter}`}
        </h5>
        <div className="badge px-3 py-2 rounded-pill d-flex align-items-center gap-2" 
             style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', fontWeight: '600' }}>
          <FaFilter /> Filter Applied
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaListUl />
          </div>
          <h4>No tasks found</h4>
          <p>
            {searchTerm 
              ? `No tasks match "${searchTerm}". Try a different search term.`
              : filter !== "all"
              ? `No ${filter} tasks found. Try changing your filter.`
              : "You don't have any tasks yet. Start by creating your first task!"
            }
          </p>
          <button 
            className="btn btn-primary rounded-pill px-4 py-3 d-flex align-items-center gap-2 mx-auto"
            onClick={() => window.location.href = '/add-task'}
          >
            <FaPlus /> Create Your First Task
          </button>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <EnhancedTaskCard 
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              dueDateLabel={getDueDateLabel(task.dueDate)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;