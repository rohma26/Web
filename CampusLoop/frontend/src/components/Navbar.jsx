// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaTasks, 
  FaClock, 
  FaChartBar, 
  FaUser, 
  FaSignOutAlt, 
  FaBars,
  FaTimes,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user_info');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          {/* Brand */}
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                 style={{ width: '36px', height: '36px' }}>
              <FaClock style={{ color: 'white', fontSize: '1.2rem' }} />
            </div>
            <span className="fw-bold">ProductivityPro</span>
          </Link>

          {/* Mobile Toggle */}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Collapsible Content */}
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
            {/* Navigation Links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  className={`nav-link d-flex align-items-center gap-2 ${isActive('/')}`} 
                  to="/"
                  onClick={() => setIsOpen(false)}
                >
                  <FaHome /> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link d-flex align-items-center gap-2 ${isActive('/tasks')}`} 
                  to="/tasks"
                  onClick={() => setIsOpen(false)}
                >
                  <FaTasks /> Tasks
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link d-flex align-items-center gap-2 ${isActive('/pomodoro')}`} 
                  to="/pomodoro"
                  onClick={() => setIsOpen(false)}
                >
                  <FaClock /> Pomodoro
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link d-flex align-items-center gap-2 ${isActive('/analytics')}`} 
                  to="/analytics"
                  onClick={() => setIsOpen(false)}
                >
                  <FaChartBar /> Analytics
                </Link>
              </li>
            </ul>

            {/* Right Side Items */}
            <div className="d-flex align-items-center gap-3">
              {/* Theme Toggle */}
              <button 
                className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                onClick={toggleTheme}
                style={{ width: '40px', height: '40px' }}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>

              {/* User Profile Section */}
              <div className="d-flex align-items-center gap-3">
                {/* User Profile Pic */}
                {user?.picture ? (
                  <div className="position-relative">
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      className="rounded-circle"
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        objectFit: 'cover',
                        border: `2px solid var(--brand-primary)`,
                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
                      }}
                    />
                    <div className="position-absolute bottom-0 end-0 rounded-circle bg-success" 
                         style={{ width: '10px', height: '10px', border: '2px solid white' }} />
                  </div>
                ) : user?.name ? (
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                       style={{ 
                         width: '40px', 
                         height: '40px',
                         background: 'var(--brand-primary)',
                         color: 'white',
                         fontWeight: 'bold',
                         fontSize: '1rem'
                       }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : null}

                {/* User Info Dropdown on Desktop */}
                <div className="d-none d-md-block">
                  <div className="dropdown">
                    <button 
                      className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center gap-2 p-0"
                      type="button" 
                      data-bs-toggle="dropdown"
                      style={{ color: 'var(--text-body)' }}
                    >
                      <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>
                        {user?.name || 'User'}
                      </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg">
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile">
                          <FaUser /> Profile
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item d-flex align-items-center gap-2 text-danger"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Logout Button on Mobile */}
                <div className="d-block d-md-none">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="d-lg-none overlay-backdrop" 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}

      <style jsx>{`
        .navbar {
          padding: 0.75rem 2rem;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
        }
        
        .nav-link {
          padding: 0.75rem 1.25rem !important;
          border-radius: 12px;
          transition: all 0.2s ease;
          margin: 0.125rem;
        }
        
        .nav-link:hover {
          background: var(--brand-light);
          transform: translateY(-1px);
        }
        
        .nav-link.active {
          background: var(--brand-primary) !important;
          color: white !important;
          font-weight: 600;
        }
        
        .dropdown-menu {
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 0.5rem;
          min-width: 200px;
        }
        
        .dropdown-item {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          background: var(--brand-light);
          color: var(--brand-primary);
        }
        
        @media (max-width: 768px) {
          .navbar {
            padding: 0.75rem 1rem;
          }
          
          .navbar-collapse {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: var(--card-bg);
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border-top: 1px solid var(--card-border);
            z-index: 1000;
            max-height: calc(100vh - 70px);
            overflow-y: auto;
          }
          
          .navbar-nav {
            margin-bottom: 1.5rem;
          }
          
          .nav-item {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;