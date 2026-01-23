// frontend/src/config.js
const config = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://campusloop-backend.onrender.com' // We will get this URL in the next step
};

export default config;