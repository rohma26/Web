// components/TaskCard.jsx
import React, { useState } from "react";
import axios from "axios";
import { 
  FaCalendarAlt, FaFlag, FaCheckCircle, FaClock, 
  FaEdit, FaTrash, FaEllipsisH, FaExternalLinkAlt 
} from "react-icons/fa";
import { format, isToday, isTomorrow, isPast } from "date-fns";

const TaskCard = ({ task, onDelete, onUpdate, dueDateLabel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { status: newStatus });
      onUpdate(task._id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
      onDelete(task._id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task.");
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getDueDateColor = () => {
    const taskDate = new Date(task.dueDate);
    if (isPast(taskDate) && task.status !== "Completed") return "#ef4444";
    if (isToday(taskDate)) return "#f59e0b";
    if (isTomorrow(taskDate)) return "#3b82f6";
    return "#6b7280";
  };

  const priorityColor = getPriorityColor();
  const dueDateColor = getDueDateColor();

  return (
    <div 
      className="card border-0 shadow-sm h-100 position-relative"
      style={{ 
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        borderLeft: `4px solid ${priorityColor}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Task Status Indicator */}
      <div className="position-absolute top-0 end-0 p-3">
        <div className={`rounded-circle ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'}`} 
             style={{ width: '12px', height: '12px' }} />
      </div>

      <div className="card-body p-4">
        {/* Task Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h5 className="fw-bold mb-2" style={{ color: '#1e293b' }}>
              {task.title}
              {task.status === 'Completed' && (
                <FaCheckCircle className="ms-2 text-success" size={16} />
              )}
            </h5>
            
            {/* Tags */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge rounded-pill d-flex align-items-center gap-1" 
                    style={{ backgroundColor: `${priorityColor}15`, color: priorityColor }}>
                <FaFlag size={12} /> {task.priority}
              </span>
              <span className="badge rounded-pill d-flex align-items-center gap-1" 
                    style={{ backgroundColor: `${dueDateColor}15`, color: dueDateColor }}>
                <FaCalendarAlt size={12} /> 
                {dueDateLabel || format(new Date(task.dueDate), 'MMM dd')}
              </span>
            </div>
          </div>

          {/* Actions Dropdown */}
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-light rounded-circle"
              onClick={() => setShowActions(!showActions)}
              onBlur={() => setTimeout(() => setShowActions(false), 200)}
              style={{ width: '32px', height: '32px' }}
            >
              <FaEllipsisH />
            </button>
            {showActions && (
              <div className="dropdown-menu show" style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate(-120px, 32px)' }}>
                <button className="dropdown-item d-flex align-items-center gap-2">
                  <FaEdit size={14} /> Edit
                </button>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={handleDeleteClick}>
                  <FaTrash size={14} /> Delete
                </button>
                <button className="dropdown-item d-flex align-items-center gap-2">
                  <FaExternalLinkAlt size={14} /> View Details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted mb-4" style={{ 
          fontSize: '0.9rem',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {task.description}
        </p>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <div className="d-flex align-items-center gap-2">
            <FaCalendarAlt className="text-muted" size={14} />
            <small className="text-muted">
              Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </small>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <select 
              className={`form-select form-select-sm ${isUpdating ? 'opacity-50' : ''}`}
              value={task.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              style={{ 
                width: 'auto',
                borderRadius: '20px',
                borderColor: task.status === 'Completed' ? '#10b981' : '#f59e0b',
                color: task.status === 'Completed' ? '#10b981' : '#f59e0b'
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            
            <button 
              className="btn btn-sm btn-outline-danger rounded-circle"
              onClick={handleDeleteClick}
              style={{ width: '32px', height: '32px' }}
            >
              <FaTrash size={12} />
            </button>
          </div>
        </div>

        {/* Progress Bar (for subtasks if you add them later) */}
        <div className="mt-3">
          <div className="d-flex justify-content-between mb-1 small">
            <span>Progress</span>
            <span>0/0</span>
          </div>
          <div className="progress" style={{ height: '4px', borderRadius: '2px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ 
                width: task.status === 'Completed' ? '100%' : '0%',
                backgroundColor: task.status === 'Completed' ? '#10b981' : '#3b82f6'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      {isHovered && (
        <div className="position-absolute top-0 start-0 w-100 h-100" 
             style={{ 
               background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
               pointerEvents: 'none',
               borderRadius: '16px'
             }} />
      )}
    </div>
  );
};

export default TaskCard;