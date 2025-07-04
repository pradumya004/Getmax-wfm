// frontend/src/api/auth.api.js

import { apiCall } from './apiClient.js';

export const authAPI = {
    // ============= COMPANY AUTHENTICATION =============
    companyLogin: (credentials) => apiCall('post', '/companies/login', credentials),
    companyRegister: (data) => apiCall('post', '/companies/register', data),
    companyLogout: () => apiCall('post', '/companies/logout'),

    // ============= EMPLOYEE AUTHENTICATION =============
    employeeLogin: (credentials) => apiCall('post', '/employees/login', credentials),
    employeeLogout: () => apiCall('post', '/employees/logout'),

    // ============= MASTER ADMIN AUTHENTICATION =============
    // 🔥 NEW: Master Admin Auth (Sriram - hardcoded credentials)
    masterAdminLogin: (credentials) => apiCall('post', '/master-admin/login', credentials),
    masterAdminLogout: () => apiCall('post', '/master-admin/logout'),

    // ============= AUTH HELPERS =============
    // Get the right auth API based on user type
    getAuthAPI: (userType) => {
        switch (userType) {
            case 'master_admin':
                return {
                    login: authAPI.masterAdminLogin,
                    logout: authAPI.masterAdminLogout
                };
            case 'company':
            case 'admin': // Company-level admin
                return {
                    login: authAPI.companyLogin,
                    logout: authAPI.companyLogout
                };
            case 'employee':
                return {
                    login: authAPI.employeeLogin,
                    logout: authAPI.employeeLogout
                };
            default:
                throw new Error(`Unsupported user type: ${userType}`);
        }
    },

    // Get login form configurations
    getLoginConfig: (userType) => {
        switch (userType) {
            case 'master_admin':
                return {
                    email: 'sriram@getmaxsolutions.com',
                    passwordPlaceholder: 'Enter master admin password',
                    title: 'Master Admin Login',
                    subtitle: 'Platform Owner Access',
                    buttonText: 'Access Master Dashboard',
                    theme: 'from-purple-600 to-pink-600'
                };
            case 'company':
                return {
                    email: 'admin@company.com',
                    passwordPlaceholder: 'Enter company password',
                    title: 'Company Login',
                    subtitle: 'Access your company dashboard',
                    buttonText: 'Login to Company Dashboard',
                    theme: 'from-blue-600 to-blue-700'
                };
            case 'employee':
                return {
                    email: 'employee@company.com',
                    passwordPlaceholder: 'Enter employee password',
                    title: 'Employee Login',
                    subtitle: 'Access your employee portal',
                    buttonText: 'Login to Employee Portal',
                    theme: 'from-green-600 to-green-700'
                };
            default:
                return {
                    email: 'Enter your email',
                    passwordPlaceholder: 'Enter your password',
                    title: 'Login',
                    subtitle: 'Access your account',
                    buttonText: 'Login',
                    theme: 'from-gray-600 to-gray-700'
                };
        }
    }
};