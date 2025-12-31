// pages/Home.jsx
import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaChartLine, FaFire, FaCalendarCheck } from "react-icons/fa";
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    productivity: 75
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Only ONE useEffect hook
  useEffect(() => {
    // Try to fetch real data
    fetch('http://localhost:5000/api/dashboard/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setStats({
          total: data.tasks?.total || 0,
          completed: data.tasks?.completed || 0,
          pending: data.tasks?.pending || 0,
          overdue: data.tasks?.overdue || 0,
          productivity: data.productivityScore || 75
        });
      })
      .catch(error => {
        console.log('Using mock data due to error:', error);
        // Use mock data if API fails
        setStats({
          total: 24,
          completed: 18,
          pending: 4,
          overdue: 2,
          productivity: 82
        });
      });

    // Load recent tasks
    fetch('http://localhost:5000/api/tasks/recent')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setRecentTasks(data.slice(0, 4).map(task => ({
          id: task._id,
          title: task.title,
          dueDate: task.dueDate,
          priority: task.priority.toLowerCase(),
          status: task.status === "Completed" ? "completed" : "pending"
        })));
      })
      .catch(error => {
        console.log('Using mock tasks:', error);
        setRecentTasks([
          { id: 1, title: "Complete project proposal", dueDate: "2024-03-15", priority: "high", status: "completed" },
          { id: 2, title: "Team meeting preparation", dueDate: "2024-03-14", priority: "medium", status: "pending" },
          { id: 3, title: "Client presentation", dueDate: "2024-03-13", priority: "high", status: "completed" },
          { id: 4, title: "Update documentation", dueDate: "2024-03-12", priority: "low", status: "pending" },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [3, 5, 2, 6, 4, 1, 7],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 8,
      }
    ]
  };

  const pieChartData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [stats.completed, stats.pending, stats.overdue],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0,
      }
    ]
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="card border-0 shadow-sm h-100" style={{ 
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      borderLeft: `4px solid ${color}` 
    }}>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="rounded-circle p-3" style={{ backgroundColor: `${color}20` }}>
            <div style={{ color }}>{icon}</div>
          </div>
          <span className="badge rounded-pill" style={{ backgroundColor: `${color}20`, color }}>
            {trend}
          </span>
        </div>
        <h3 className="display-6 fw-bold mb-1">{value}</h3>
        <p className="text-muted mb-0">{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="text-white fw-bold mb-2">Welcome back! 👋</h1>
              <p className="text-white-50">Here's what's happening with your tasks today</p>
            </div>
            <div className="text-white">
              <span className="badge bg-white-20 px-3 py-2 rounded-pill">
                <FaFire className="me-2" />
                {stats.productivity}% Productivity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3 col-sm-6">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<FaCheckCircle size={24} />}
            color="#6366f1"
            trend="+12%"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<FaCalendarCheck size={24} />}
            color="#10b981"
            trend="+8%"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<FaClock size={24} />}
            color="#f59e0b"
            trend="+3%"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={<FaExclamationTriangle size={24} />}
            color="#ef4444"
            trend="-2%"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">Weekly Progress</h5>
              <div style={{ height: 300 }}>
                <Bar 
                  data={barChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">Task Distribution</h5>
              <div style={{ height: 300 }}>
                <Pie 
                  data={pieChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title fw-bold mb-0">Recent Tasks</h5>
                <a href="/tasks" className="btn btn-sm btn-outline-primary rounded-pill">
                  View All
                </a>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
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
                      <tr key={task.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className={`rounded-circle me-3 ${task.status === 'completed' ? 'bg-success' : 'bg-warning'}`} 
                                 style={{ width: 8, height: 8 }} />
                            <span>{task.title}</span>
                          </div>
                        </td>
                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning' : 'bg-secondary'}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${task.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                            {task.status}
                          </span>
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