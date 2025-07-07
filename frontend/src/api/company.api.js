// frontend/src/api/company.api.js

import { apiCall } from './apiClient.js';

export const companyAPI = {
    // Profile Management
    getProfile: () => apiCall('get', '/company/profile'),
    updateProfile: (data) => apiCall('put', '/company/profile', data),

    // Organizational Data
    getOrgData: () => apiCall('get', '/company/org-data'),
    downloadEmployeeTemplate: () => apiCall('get', '/company/employee-template')
};