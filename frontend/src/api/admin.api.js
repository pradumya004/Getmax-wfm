// frontend/src/api/admin.api.js
import { apiCall } from './apiClient.js';

export const adminAPI = {
    // Company Management
    getAllCompanies: () => apiCall('get', '/admin/companies'),
    suspendCompany: (companyId) => apiCall('put', `/admin/companies/${companyId}/suspend`),
    changeSubscriptionPlan: (companyId, newPlan) =>
        apiCall('put', `/admin/companies/${companyId}/plan`, { newPlan }),

    // Platform Stats
    getPlatformStats: () => apiCall('get', '/admin/stats')
};