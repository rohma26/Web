// pages/Home.jsx
import config from '../config';
import api from '../utils/axiosConfig';
import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaFire, FaCalendarCheck } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Home = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0, productivity: 75 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Theme State
  const [themeMode, setThemeMode] = useState('light');
  const [chartTextColor, setChartTextColor] = useState('#64748b');
  const [chartGridColor, setChartGridColor] = useState('rgba(0,0,0,0.1)');

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setThemeMode(isDark ? 'dark' : 'light');
      
      const docStyle = getComputedStyle(document.documentElement);
      setChartTextColor(docStyle.getPropertyValue('--text-body').trim());
      setChartGridColor(docStyle.getPropertyValue('--card-border').trim());
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Fetch Data
  useEffect(() => {
    const apiUrl = config?.API_URL || 'http://localhost:5000';
    
    fetch(`${apiUrl}/api/dashboard/stats`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data) setStats({
          total: data.tasks?.total || 0,
          completed: data.tasks?.completed || 0,
          pending: data.tasks?.pending || 0,
          overdue: data.tasks?.overdue || 0,
          productivity: data.productivityScore || 75
        });
      })
      .catch(console.error);

    fetch(`${apiUrl}/api/tasks/recent`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if(data) setRecentTasks(data.slice(0, 4)); })
      .catch(err => {
        setRecentTasks([
          { _id: 1, title: "Complete project proposal", dueDate: "2024-03-15", priority: "High", status: "Completed" },
          { _id: 2, title: "Team meeting", dueDate: "2024-03-14", priority: "Medium", status: "Pending" },
          { _id: 3, title: "Client presentation", dueDate: "2024-03-13", priority: "Low", status: "Completed" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- PREMIUM COLORS ---
  const chartColors = {
    bar: themeMode === 'dark' ? '#a78bfa' : '#6366f1', // Soft Purple vs Indigo
    pie: [
      themeMode === 'dark' ? '#34d399' : '#10b981', // Emerald
      themeMode === 'dark' ? '#fbbf24' : '#f59e0b', // Amber
      themeMode === 'dark' ? '#f87171' : '#ef4444'  // Red
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: chartTextColor } } },
    scales: {
      x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor, borderDash: [5, 5] } },
      y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor, borderDash: [5, 5] } }
    }
  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Tasks',
      data: [3, 5, 2, 6, 4, 1, 7],
      backgroundColor: chartColors.bar,
      borderRadius: 8,
    }]
  };

  const pieChartData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [{
      data: [stats.completed, stats.pending, stats.overdue],
      backgroundColor: chartColors.pie,
      borderWidth: 0,
    }]
  };

  // Improved Stat Card
  const StatCard = ({ title, value, icon, bgClass, textClass, trend }) => (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className={`rounded-circle p-3 ${bgClass} bg-opacity-10`}>
            <div className={textClass}>{icon}</div>
          </div>
          <span className={`badge rounded-pill ${bgClass} ${textClass} bg-opacity-10`}>{trend}</span>
        </div>
        <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{value}</h3>
        <p className="mb-0 fw-medium" style={{ color: 'var(--text-muted)' }}>{title}</p>
      </div>
    </div>
  );

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid px-4 py-5">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Dashboard</h1>
          <p className="mb-0" style={{ color: 'var(--text-body)' }}>Your daily productivity overview.</p>
        </div>
        <span className="badge px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ background: 'var(--brand-primary)', color: '#fff' }}>
          <FaFire /> {stats.productivity}% Productivity
        </span>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3 col-sm-6"><StatCard title="Total Tasks" value={stats.total} icon={<FaCheckCircle size={22} />} bgClass="bg-primary" textClass="text-primary" trend="+12%" /></div>
        <div className="col-md-3 col-sm-6"><StatCard title="Completed" value={stats.completed} icon={<FaCalendarCheck size={22} />} bgClass="bg-success" textClass="text-success" trend="+5%" /></div>
        <div className="col-md-3 col-sm-6"><StatCard title="Pending" value={stats.pending} icon={<FaClock size={22} />} bgClass="bg-warning" textClass="text-warning" trend="+2%" /></div>
        <div className="col-md-3 col-sm-6"><StatCard title="Overdue" value={stats.overdue} icon={<FaExclamationTriangle size={22} />} bgClass="bg-danger" textClass="text-danger" trend="-1%" /></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Weekly Activity</h5>
              <div style={{ height: 300 }}><Bar data={barChartData} options={commonOptions} /></div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Distribution</h5>
              <div style={{ height: 300 }}><Pie data={pieChartData} options={{ ...commonOptions, plugins: { legend: { position: 'bottom', labels: { color: chartTextColor } } }, scales: {} }} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>Recent Tasks</h5>
                <a href="/tasks" className="btn btn-sm btn-outline-secondary rounded-pill px-3">View All</a>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Due Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map((task) => (
                      <tr key={task._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className={`rounded-circle me-3 ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'}`} style={{ width: 8, height: 8 }} />
                            <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>{task.title}</span>
                          </div>
                        </td>
                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            task.priority === 'High' ? 'bg-danger bg-opacity-10 text-danger' : 
                            task.priority === 'Medium' ? 'bg-warning bg-opacity-10 text-warning' : 
                            'bg-success bg-opacity-10 text-success'
                          } px-3 py-2 rounded-pill`}>{task.priority}</span>
                        </td>
                        <td>
                          <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}`}>{task.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;