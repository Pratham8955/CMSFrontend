import axios from 'axios';

// Base URLs from Environment Variables with Fallbacks
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7133/api';
export const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://localhost:7133';

// Pre-configured Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatic Bearer Token Authorization Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
