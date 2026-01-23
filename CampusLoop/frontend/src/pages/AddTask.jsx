// pages/AddTask.jsx - THEME AWARE VERSION
import React, { useState, useRef, memo } from "react";
import api from '../utils/axiosConfig';
// And verify you use 'api.get', 'api.post' instead of 'axios.get'
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, FaFlag, FaAlignLeft, 
  FaClock, FaPaperPlane, FaArrowLeft 
} from "react-icons/fa";
import { format } from "date-fns";
import config from '../config';

// Memoized FormGroup
const FormGroup = memo(({ label, icon, children, error }) => (
  <div className="mb-4">
    <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem' }}>
      {icon}
      {label}
    </label>
    {children}
    {error && <div className="text-danger small mt-2 fw-bold">{error}</div>}
  </div>
));

const AddTask = () => {
  const navigate = useNavigate();
  
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const dueDateRef = useRef("");
  const priorityRef = useRef("Medium");
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState({
    title: "",
    dueDate: "",
    description: "",
    priority: "Medium"
  });

  const updatePreview = () => {
    setPreviewData({
      title: titleRef.current,
      dueDate: dueDateRef.current,
      description: descriptionRef.current,
      priority: priorityRef.current
    });
  };

  const handleTitleChange = (e) => { titleRef.current = e.target.value; updatePreview(); };
  const handleDescriptionChange = (e) => { descriptionRef.current = e.target.value; updatePreview(); };
  const handleDueDateChange = (e) => { dueDateRef.current = e.target.value; updatePreview(); };
  const handlePriorityChange = (priority) => { priorityRef.current = priority; updatePreview(); };

  const validateForm = () => {
    const newErrors = {};
    if (!titleRef.current.trim()) newErrors.title = "Title is required";
    if (!dueDateRef.current) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(dueDateRef.current) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    if (!descriptionRef.current.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const apiUrl = config?.API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/tasks`, {
        title: titleRef.current,
        dueDate: dueDateRef.current,
        description: descriptionRef.current,
        priority: priorityRef.current,
        status: "Pending"
      });
      navigate("/tasks");
    } catch (error) {
      alert("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary rounded-circle p-0 me-3 d-flex align-items-center justify-content-center"
              onClick={() => navigate(-1)}
              type="button"
              style={{ width: '48px', height: '48px' }}
            >
              <FaArrowLeft size={16} />
            </button>
            <div>
              <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Create New Task</h2>
              <p className="mb-0 small fw-bold" style={{ color: 'var(--text-muted)' }}>Organize your schedule effectively</p>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="card border-0 shadow-lg mb-4">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                
                {/* Title */}
                <FormGroup label="Task Title" icon={<FaFlag className="text-primary" />} error={errors.title}>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="E.g., Complete Project Documentation"
                    onChange={handleTitleChange}
                    style={{ fontWeight: '600' }}
                  />
                </FormGroup>

                {/* Date & Priority */}
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <FormGroup label="Due Date" icon={<FaCalendarAlt className="text-primary" />} error={errors.dueDate}>
                      <input
                        type="date"
                        className={`form-control form-control-lg ${errors.dueDate ? 'is-invalid' : ''}`}
                        onChange={handleDueDateChange}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        style={{ fontWeight: '600' }}
                      />
                    </FormGroup>
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem' }}>
                      <FaClock className="text-primary" />
                      Priority Level
                    </label>
                    <div className="d-flex gap-2">
                      {['Low', 'Medium', 'High'].map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          className={`btn flex-fill`}
                          onClick={() => handlePriorityChange(priority)}
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: '2px solid',
                            // Logic: If selected, hide border. If not selected, use standard input border.
                            borderColor: previewData.priority === priority ? 'transparent' : 'var(--input-border)',
                            // Logic: If selected, use specific color. If not, use standard input background.
                            background: previewData.priority === priority ? 
                              (priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 
                               priority === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)') : 
                              'var(--input-bg)',
                            color: previewData.priority === priority ? 
                              (priority === 'High' ? '#ef4444' : 
                               priority === 'Medium' ? '#f59e0b' : '#10b981') : 
                              'var(--text-body)',
                            fontWeight: '700',
                            transition: 'all 0.2s'
                          }}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem' }}>
                    <FaAlignLeft className="text-primary" />
                    Description
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows="5"
                    placeholder="Add details about your task..."
                    onChange={handleDescriptionChange}
                    style={{ resize: 'vertical', minHeight: '120px' }}
                  />
                  {errors.description && <div className="text-danger small mt-2 fw-bold">{errors.description}</div>}
                </div>

                {/* Preview Section - NOW DYNAMIC */}
                <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--bg-app)', border: '2px dashed var(--card-border)' }}>
                  <h6 className="fw-bold mb-3 text-uppercase small" style={{ letterSpacing: '1px', color: 'var(--text-muted)' }}>Live Preview</h6>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>{previewData.title || "Untitled Task"}</h5>
                      <p className="mb-2 small" style={{ maxWidth: '400px', color: 'var(--text-body)', fontWeight: '500' }}>
                        {previewData.description ? 
                          (previewData.description.length > 80 ? previewData.description.substring(0, 80) + "..." : previewData.description) : 
                          "No description added yet."}
                      </p>
                      {previewData.dueDate && (
                        <span className="badge border shadow-sm" style={{ background: 'var(--card-bg)', color: 'var(--text-main)', borderColor: 'var(--card-border)' }}>
                          <FaCalendarAlt className="me-1" /> {format(new Date(previewData.dueDate), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                    <span className={`badge ${
                      previewData.priority === 'High' ? 'bg-danger' : 
                      previewData.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-success'
                    }`}>
                      {previewData.priority}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex gap-3 pt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-fill"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Create Task
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddTask;