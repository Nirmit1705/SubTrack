import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, { hasToken: !!token });
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`API Error ${error.response?.status}:`, error.message);
    
    if (error.response?.status === 401) {
      console.warn('Authentication error - redirecting to home');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home page on authentication errors
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default api;