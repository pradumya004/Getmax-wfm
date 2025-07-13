// frontend/src/api/apiClient.js
import { getUserType } from '../lib/auth.js';
// Base API client - clean and simple

import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        const userType = getUserType(); // 'company' | 'employee' | 'master_admin'
        let token = null;

        if (userType === 'company' || userType === 'admin') {
            token = localStorage.getItem('companyToken');
        } else if (userType === 'employee' || userType === 'master_admin') {
            token = localStorage.getItem('employeeToken');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';

        // Handle specific status codes
        if (error.response?.status === 401) {
            toast.error('Session expired or unauthorized. Please refresh the page.');
            return Promise.reject({ ...error, unauthorized: true });
        }

        toast.error(message);
        return Promise.reject(error);
    }
);

export default apiClient;

// Helper function for API calls
export const apiCall = async (method, url, data = null) => {
    try {
        const config = { method, url };
        if (data) config.data = data;

        const response = await apiClient(config);
        return { success: true, data: response };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.response?.data?.error || // 👈 add this
                'Request failed'
        };
    }
};