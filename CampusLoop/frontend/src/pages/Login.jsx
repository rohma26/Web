// frontend/src/pages/Login.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
// And verify you use 'api.get', 'api.post' instead of 'axios.get'

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // 1. Send the Google Token to your Backend
      const res = await api.post('/api/auth/google', {
        token: credentialResponse.credential
      });

      // 2. Save the APP Token (not Google's) to storage
      localStorage.setItem('user_token', res.data.token);
      
      // 3. Save user info for display
      localStorage.setItem('user_info', JSON.stringify(res.data.user));

      // 4. Go to Dashboard
      navigate('/');
      window.location.reload(); // Refresh to update Navbar state
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" 
         style={{ background: 'var(--bg-app)' }}>
      <div className="card shadow-lg p-5 text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>TaskFlow</h1>
        <p className="text-muted mb-4">Boost your productivity with focus.</p>
        
        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
            theme="filled_blue"
            shape="pill"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;