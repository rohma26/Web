// frontend/src/utils/axiosConfig.js
import axios from 'axios';
import config from '../config'; // Ensure this points to your config file

const api = axios.create({
  baseURL: config.API_URL || 'http://localhost:5000',
});

// Automatically add the token to every request if it exists
api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default api;