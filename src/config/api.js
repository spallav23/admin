import axios from 'axios';
import { message } from 'antd';
import { getAdminData, logout } from '../utils/auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const adminData = getAdminData();
    if (adminData && adminData.token) {
      config.headers.Authorization = `Bearer ${adminData.token}`;
    }
    
    // Log API calls in development
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    }

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          message.error('Session expired. Please login again.');
          logout();
          window.location.href = '/login';
          break;
        case 403:
          message.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          message.error('Resource not found.');
          break;
        case 422:
          message.error(data.message || 'Validation error occurred.');
          break;
        case 500:
          message.error('Server error. Please try again later.');
          break;
        default:
          message.error(data.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      message.error('Network error. Please check your connection.');
    } else {
      message.error('Request failed. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;
