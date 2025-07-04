// frontend/src/api/masterAdmin.api.js

import { apiCall } from './apiClient.js';

export const masterAdminAPI = {
    // ============= COMPANY MANAGEMENT =============
    // Get all companies using the platform with filtering and pagination
    getAllCompanies: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall('get', `/master-admin/companies${queryString ? `?${queryString}` : ''}`);
    },

    // Get specific company details with full analytics
    getCompanyDetails: (companyId) =>
        apiCall('get', `/master-admin/companies/${companyId}`),

    // Suspend or activate company
    toggleCompanyStatus: (companyId, action, reason = null) =>
        apiCall('put', `/master-admin/companies/${companyId}/status`, { action, reason }),

    // Change company subscription plan
    changeSubscriptionPlan: (companyId, newPlan, effectiveDate = null, reason = null) =>
        apiCall('put', `/master-admin/companies/${companyId}/subscription`, {
            newPlan,
            effectiveDate,
            reason
        }),

    // ============= PLATFORM ANALYTICS =============
    // Get comprehensive platform statistics
    getPlatformStats: (period = '30d') =>
        apiCall('get', `/master-admin/platform-stats?period=${period}`),

    // Alternative shorter endpoint
    getStats: (period = '30d') =>
        apiCall('get', `/master-admin/stats?period=${period}`),

    // ============= EMPLOYEE MANAGEMENT ACROSS PLATFORM =============
    // Get all employees across all companies
    getAllEmployees: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall('get', `/master-admin/employees${queryString ? `?${queryString}` : ''}`);
    },

    // ============= SYSTEM MONITORING =============
    // Get system health status
    getSystemHealth: () => apiCall('get', '/master-admin/system-health'),

    // Get financial stats (placeholder)
    getFinancialStats: () => apiCall('get', '/master-admin/financial-stats'),

    // ============= DASHBOARD UTILITIES =============
    // Get combined dashboard data
    getDashboardData: () => apiCall('get', '/master-admin/dashboard-data'),

    // ============= BULK OPERATIONS (Future) =============
    // Bulk suspend companies
    bulkUpdateCompanyStatus: (companyIds, action, reason) =>
        apiCall('put', '/master-admin/companies/bulk-status', {
            companyIds,
            action,
            reason
        }),

    // ============= ANALYTICS & REPORTS =============
    // Get growth analytics with different periods
    getGrowthAnalytics: (period = '30d') =>
        apiCall('get', `/master-admin/stats?period=${period}`),

    // Export platform data
    exportPlatformData: (format = 'csv', dataType = 'companies') =>
        apiCall('get', `/master-admin/export?format=${format}&type=${dataType}`, {}, {
            responseType: 'blob'
        }),

    // ============= PROFILE MANAGEMENT =============
    // Get master admin profile
    getProfile: () => apiCall('get', '/master-admin/profile')
};

export default masterAdminAPI;