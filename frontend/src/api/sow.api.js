// frontend/src/api/sow.api.js

import { apiCall } from './apiClient';

export const sowAPI = {
  // ============= BASIC CRUD OPERATIONS =============
  // Create new SOW
  create: (data) => apiCall('post', '/sow', data),

  // Get all SOWs
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall('get', `/sow${queryString ? `?${queryString}` : ''}`);
  },

  // Get SOW by ID
  getById: (id) => apiCall('get', `/sow/${id}`),

  // Update SOW
  update: (id, data) => apiCall('put', `/sow/${id}`, data),

  // Delete SOW
  delete: (id) => apiCall('delete', `/sow/${id}`),


  // ============= EMPLOYEE ASSIGNMENT =============
  assignEmployees: (id, employeeData) => apiCall('put', `/sow/${id}/assign`, employeeData),
  unassignEmployees: (id, employeeData) => apiCall('put', `/sow/${id}/unassign`, employeeData),

  // ============= STATUS MANAGEMENT =============
  updateStatus: (id, statusData) => apiCall('put', `/sow/${id}/status`, statusData),
  activateSOW: (id) => apiCall('put', `/sow/${id}/activate`),
  pauseSOW: (id) => apiCall('put', `/sow/${id}/pause`),
  completeSOW: (id) => apiCall('put', `/sow/${id}/complete`),

  // Client-specific SOWs
  getByClientId: (clientId) => apiCall('get', `/sow/client/${clientId}`),

  // Analytics and Reporting
  getMetrics: (id) => apiCall('get', `/sow/${id}/metrics`),
  getPerformanceReport: (id, dateRange) => apiCall('get', `/sow/${id}/performance`, null, dateRange),

  // Bulk Operations
  bulkUpdate: (ids, updateData) => apiCall('put', '/sow/bulk-update', { ids, updateData }),
  bulkDelete: (ids) => apiCall('delete', '/sow/bulk-delete', { ids }),

  // Templates
  getTemplates: () => apiCall('get', '/sow/templates'),
  createFromTemplate: (templateId, data) => apiCall('post', `/sow/templates/${templateId}/create`, data),

  // Validation
  validateSOW: (data) => apiCall('post', '/sow/validate', data),
  checkConflicts: (data) => apiCall('post', '/sow/check-conflicts', data),
};