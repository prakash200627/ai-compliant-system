import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { getToken, clearAuth } from '../utils/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth();
      // Only redirect if we are not already on the login page to avoid loops
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Endpoints
export const authService = {
  register: (name, email, password) => {
    return api.post('/auth/register', { name, email, password });
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  makeAdmin: () => {
    return api.post('/auth/make-admin');
  },
};

export const complaintService = {
  getMyComplaints: () => {
    return api.get('/complaints/my');
  },

  createComplaint: (title, description, category) => {
    return api.post('/complaints', { title, description, category });
  },
};

export const adminService = {
  getEscalations: () => {
    return api.get('/admin/escalations');
  },

  updateComplaintStatus: (complaintId, status) => {
    return api.put(`/admin/complaints/${complaintId}/status`, { status });
  },
};

export default api;
