// frontend/src/api/client.api.js

import { apiCall } from './apiClient.js';

export const clientAPI = {
    // 🔹 Client CRUD
    createClient: (data) => apiCall('post', '/clients', data),
    bulkUpload: (clients) => apiCall('post', '/clients/bulk-upload', clients),
    getAllClients: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall('get', `/clients${queryString ? `?${queryString}` : ''}`);
    },
    getClientById: (clientId) => apiCall('get', `/clients/details/${clientId}`),
    updateClient: (clientId, data) => apiCall('put', `/clients/${clientId}`, data),
    deleteClient: (clientId) => apiCall('delete', `/clients/${clientId}`),

    // ============= CONFIGURATION UPDATES =============
    // Update integration configuration
    updateIntegration: (id, data) => apiCall('put', `/clients/${id}/integration`, data),

    // Update processing configuration
    updateProcessing: (id, data) => apiCall('put', `/clients/${id}/processing`, data),

    // Update financial information
    updateFinancial: (id, data) => apiCall('put', `/clients/${id}/financial`, data),

    // Update sync status
    updateSyncStatus: (id, data) => apiCall('put', `/clients/${id}/sync-status`, data),


    // ============= AGREEMENTS =============
    // Update agreements
    updateAgreements: (id, data) => apiCall('put', `/clients/${id}/agreements`, data),

    // ============= FILTERING & SPECIALIZED QUERIES =============
    getClientsByEHR: (ehrSystem) => apiCall('get', `/clients/ehr/${ehrSystem}`),
    getClientsNeedingOnboarding: () => apiCall('get', '/clients/onboarding/pending'),
    getActiveClients: () => apiCall('get', '/clients/active/list'),
    checkSOWReadiness: (clientId) => apiCall('get', `/clients/${clientId}/sow-ready`),

    // ============= SENSITIVE ACCESS =============
    // Get decrypted credentials (admin only)
    getDecryptedCredentials: (id) => apiCall('get', `/clients/${id}/decrypted-creds`)
};