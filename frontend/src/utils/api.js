import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Configure outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Configure incoming responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      // Only redirect if we are not already on a public view or login view
      // This helps avoid reload loops
      if (window.location.pathname.startsWith('/admin') || window.location.pathname === '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;