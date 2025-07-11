// frontend/src/api/client.api.js

import { apiCall } from './apiClient.js';

export const clientAPI = {
    // 🔹 Client CRUD
    createClient: (data) => apiCall('post', '/clients', data),
    bulkUploadClients: (formData) => apiCall('post', '/clients/bulk-upload', formData),
    getAllClients: (params = {}) => apiCall('get', '/clients', { params }),
    getClientById: (clientId) => apiCall('get', `/clients/details/${clientId}`),
    updateClient: (clientId, data) => apiCall('put', `/clients/${clientId}`, data),
    deleteClient: (clientId) => apiCall('delete', `/clients/${clientId}`),

    // 🔧 Config Updates
    updateIntegrationConfig: (clientId, data) => apiCall('put', `/clients/${clientId}/integration`, data),
    updateProcessingConfig: (clientId, data) => apiCall('put', `/clients/${clientId}/processing`, data),
    updateFinancialInfo: (clientId, data) => apiCall('put', `/clients/${clientId}/financial`, data),
    updateSyncStatus: (clientId, data) => apiCall('put', `/clients/${clientId}/sync-status`, data),

    // 📄 Agreements
    uploadAgreements: (clientId, data) => apiCall('put', `/clients/${clientId}/agreements`, data),

    // 📊 Filtering
    getClientsByEHR: (ehr) => apiCall('get', `/clients/ehr/${ehr}`),
    getClientsNeedingOnboarding: () => apiCall('get', '/clients/onboarding/pending'),
    getActiveClients: () => apiCall('get', '/clients/active/list'),
    checkSOWReadiness: (clientId) => apiCall('get', `/clients/${clientId}/sow-ready`),

    // 🔒 Decryption (Admin Only)
    getDecryptedCredentials: (clientId) => apiCall('get', `/clients/${clientId}/decrypted-creds`)
};
