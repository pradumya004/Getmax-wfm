// frontend/src/api/apiClient.js
import { getUserType } from '../lib/auth.js';
// Base API client - clean and simple

import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
// const apiClient = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // Increased for file uploads
    withCredentials: true,
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
apiClient.interceptors.request.use(
    (config) => {
        const userType = getUserType(); // should return 'employee' or 'company'
        let token = null;

        if (userType === 'company') {
            token = localStorage.getItem('companyToken');
        } else if (userType === 'employee') {
            token = localStorage.getItem('employeeToken');
        }

        // Ensure token is valid
        if (token && token !== "undefined" && token !== "null") {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;

// Helper function for API calls
// export const apiCall = async (method, url, data = null) => {
//     try {
//         const config = { method, url };
//         if (data) config.data = data;

//         const response = await apiClient(config);
//         console.log("API Response:......", response);
//         return { success: true, data: response };
//     } catch (error) {
//         return {
//             success: false,
//             error:
//                 error.response?.data?.message ||
//                 error.response?.data?.error || // 👈 add this
//                 'Request failed'
//         };
//     }
// };


export const apiCall = async (method, url, data = null, config = {}) => {
    try {
        const requestConfig = { ...config, method, url };

        if (data) {
            requestConfig.data = data;
        }

        // 💡 This is the crucial logic:
        // If data is FormData, we DO NOT set a Content-Type header.
        // The browser will add the correct 'multipart/form-data' with a boundary.
        if (!(data instanceof FormData)) {
            requestConfig.headers = {
                ...requestConfig.headers,
                'Content-Type': 'application/json',
            };
        }
        
        const response = await apiClient(requestConfig);
        return { success: true, data: response };

    } catch (error) {
        console.error("API call failed:", error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Request failed'
        };
    }
};