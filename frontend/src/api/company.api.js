// frontend/src/api/company.api.js

import { apiCall } from './apiClient.js';

export const companyAPI = {
    // Profile Management
    getProfile: () => apiCall('get', '/companies/profile'),
    updateProfile: (data) => apiCall('put', '/companies/profile', data),

    // Organizational Data
    getOrgData: () => apiCall('get', '/companies/org-data'),
    downloadEmployeeTemplate: () => apiCall('get', '/companies/employee-template')
};