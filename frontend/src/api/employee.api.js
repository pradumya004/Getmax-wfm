// frontend/src/api/employee.api.js

import { apiCall } from './apiClient.js';

export const employeeAPI = {
    // Employee Management (Company Admin)
    addEmployee: (data) => apiCall('post', '/employees', data),
    bulkUpload: (formData) => apiCall('post', '/employees/bulk', formData),
    getCompanyEmployees: ({ limit, page }) => apiCall('get', '/employees', { params: { limit, page } }),
    getEmployeeDetails: (employeeId) => apiCall('get', `/employees/${employeeId}`),
    updateEmployee: (employeeId, data) => apiCall('put', `/employees/${employeeId}`, data),

    // Employee Status Management
    deactivateEmployee: (employeeId) => apiCall('put', `/employees/${employeeId}/deactivate`),
    reactivateEmployee: (employeeId) => apiCall('put', `/employees/${employeeId}/reactivate`),
    resetEmployeePassword: (employeeId) => apiCall('put', `/employees/${employeeId}/reset-password`),
    deleteEmployee: (employeeId) => apiCall('delete', `/employees/${employeeId}`),

    // Performance & Leaderboard
    getPerformanceLeaderboard: () => apiCall('get', '/employees/leaderboard'),

    // Employee Self-Service
    getMyProfile: () => apiCall('get', '/employees/me'),
    updateMyProfile: (data) => apiCall('put', '/employees/me', data),
    uploadAvatar: (formData) => apiCall('post', '/employees/me/avatar', formData)
};