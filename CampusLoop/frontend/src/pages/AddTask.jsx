// pages/AddTask.jsx - FIXED VERSION
import React, { useState, useRef, useEffect, memo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, FaCalendarAlt, FaFlag, FaAlignLeft, 
  FaClock, FaPaperPlane, FaArrowLeft 
} from "react-icons/fa";
import { format } from "date-fns";

// Create a memoized FormGroup component OUTSIDE the main component
const FormGroup = memo(({ label, icon, name, children, error }) => (
  <div className="mb-4">
    <label className="form-label fw-semibold d-flex align-items-center gap-2 mb-3" style={{ color: '#475569' }}>
      {icon}
      {label}
    </label>
    {children}
    {error && <div className="text-danger small mt-2">{error}</div>}
  </div>
));

const AddTask = () => {
  const navigate = useNavigate();
  
  // Use refs to track input values without state updates
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const dueDateRef = useRef("");
  const priorityRef = useRef("Medium");
  
  // State only for validation and UI
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState({
    title: "",
    dueDate: "",
    description: "",
    priority: "Medium"
  });

  // Update preview data without re-rendering inputs
  const updatePreview = () => {
    setPreviewData({
      title: titleRef.current,
      dueDate: dueDateRef.current,
      description: descriptionRef.current,
      priority: priorityRef.current
    });
  };

  const handleTitleChange = (e) => {
    titleRef.current = e.target.value;
    updatePreview();
  };

  const handleDescriptionChange = (e) => {
    descriptionRef.current = e.target.value;
    updatePreview();
  };

  const handleDueDateChange = (e) => {
    dueDateRef.current = e.target.value;
    updatePreview();
  };

  const handlePriorityChange = (priority) => {
    priorityRef.current = priority;
    updatePreview();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!titleRef.current.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!dueDateRef.current) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(dueDateRef.current) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    
    if (!descriptionRef.current.trim()) {
      newErrors.description = "Description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/tasks", {
        title: titleRef.current,
        dueDate: dueDateRef.current,
        description: descriptionRef.current,
        priority: priorityRef.current,
        status: "Pending"
      });
      
      alert("Task added successfully!");
      navigate("/tasks");
      
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-4" style={{ 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      minHeight: '100vh'
    }}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary rounded-circle p-2 me-3"
              onClick={() => navigate(-1)}
              type="button"
              style={{ width: '40px', height: '40px' }}
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="fw-bold mb-2" style={{ color: '#1e293b' }}>Create New Task</h1>
              <p className="text-muted">Add details and set priority for your new task</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Title Field */}
                <FormGroup 
                  label="Task Title" 
                  icon={<FaFlag className="text-primary" />}
                  name="title"
                  error={errors.title}
                >
                  <input
                    type="text"
                    name="title"
                    className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="Enter task title"
                    onChange={handleTitleChange}
                    style={{ 
                      padding: '12px 16px',
                      border: errors.title ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      borderRadius: '12px'
                    }}
                  />
                </FormGroup>

                {/* Due Date Field */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <FormGroup 
                      label="Due Date" 
                      icon={<FaCalendarAlt className="text-primary" />}
                      name="dueDate"
                      error={errors.dueDate}
                    >
                      <input
                        type="date"
                        name="dueDate"
                        className={`form-control form-control-lg ${errors.dueDate ? 'is-invalid' : ''}`}
                        onChange={handleDueDateChange}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        style={{ 
                          padding: '12px 16px',
                          border: errors.dueDate ? '2px solid #ef4444' : '1px solid #e2e8f0',
                          borderRadius: '12px'
                        }}
                      />
                    </FormGroup>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label fw-semibold d-flex align-items-center gap-2 mb-3" style={{ color: '#475569' }}>
                        <FaClock className="text-primary" />
                        Priority Level
                      </label>
                      <div className="d-flex gap-2">
                        {['Low', 'Medium', 'High'].map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            className={`btn flex-fill ${previewData.priority === priority ? 'active' : ''}`}
                            onClick={() => handlePriorityChange(priority)}
                            style={{
                              padding: '12px',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              background: previewData.priority === priority ? 
                                (priority === 'High' ? '#ef4444' : 
                                 priority === 'Medium' ? '#f59e0b' : '#10b981') : 
                                '#ffffff',
                              color: previewData.priority === priority ? '#ffffff' : '#475569',
                              transition: 'all 0.3s'
                            }}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold d-flex align-items-center gap-2 mb-3" style={{ color: '#475569' }}>
                    <FaAlignLeft className="text-primary" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows="5"
                    placeholder="Describe your task in detail..."
                    onChange={handleDescriptionChange}
                    style={{ 
                      padding: '16px',
                      border: errors.description ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      resize: 'vertical'
                    }}
                  />
                  {errors.description && <div className="text-danger small mt-2">{errors.description}</div>}
                </div>

                {/* Preview Card */}
                <div className="card border-dashed mb-4" style={{ 
                  border: '2px dashed #e2e8f0',
                  borderRadius: '12px',
                  background: 'transparent'
                }}>
                  <div className="card-body p-4">
                    <h6 className="fw-semibold mb-3" style={{ color: '#64748b' }}>Task Preview</h6>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{previewData.title || "Your Task Title"}</h5>
                        <p className="text-muted mb-2 small">
                          {previewData.description ? 
                            previewData.description.substring(0, 100) + (previewData.description.length > 100 ? "..." : "") : 
                            "Task description will appear here"}
                        </p>
                        {previewData.dueDate && (
                          <span className="badge bg-light text-dark d-inline-flex align-items-center gap-1">
                            <FaCalendarAlt size={12} />
                            {format(new Date(previewData.dueDate), 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                      {previewData.priority && (
                        <span className={`badge ${previewData.priority === 'High' ? 'bg-danger' : 
                                          previewData.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}>
                          {previewData.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex gap-3 pt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-fill rounded-pill py-3"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-fill rounded-pill py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      border: 'none'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Add Task
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
              <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                <span className="rounded-circle bg-primary bg-opacity-10 p-2">
                  <FaClock className="text-primary" size={16} />
                </span>
                Tips for Effective Task Management
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2 d-flex align-items-start gap-2">
                  <div className="rounded-circle bg-success bg-opacity-10 p-1 mt-1">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  </div>
                  <span>Be specific with your task titles</span>
                </li>
                <li className="mb-2 d-flex align-items-start gap-2">
                  <div className="rounded-circle bg-success bg-opacity-10 p-1 mt-1">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  </div>
                  <span>Set realistic due dates</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <div className="rounded-circle bg-success bg-opacity-10 p-1 mt-1">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  </div>
                  <span>Use priority levels to focus on what matters most</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;