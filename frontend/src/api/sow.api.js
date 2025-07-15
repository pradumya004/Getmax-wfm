// frontend/src/api/sow.api.js

import { apiCall } from './apiClient';

export const sowAPI = {
  // ============= BASIC CRUD OPERATIONS =============
  // Create new SOW
  create: (data) => apiCall('post', '/sows', data),

  // Get all SOWs
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall('get', `/sows${queryString ? `?${queryString}` : ''}`);
  },

  // Get SOW by ID
  getById: (id) => apiCall('get', `/sows/${id}`),

  // Update SOW
  update: (id, data) => apiCall('put', `/sows/${id}`, data),

  // Delete SOW
  delete: (id) => apiCall('delete', `/sows/${id}`),


  // ============= EMPLOYEE ASSIGNMENT =============
  assignEmployees: (id, employeeData) => apiCall('put', `/sows/${id}/assign`, employeeData),
  unassignEmployees: (id, employeeData) => apiCall('put', `/sows/${id}/unassign`, employeeData),

  // ============= STATUS MANAGEMENT =============
  updateStatus: (id, statusData) => apiCall('put', `/sows/${id}/status`, statusData),
  activateSOW: (id) => apiCall('put', `/sows/${id}/activate`),
  pauseSOW: (id) => apiCall('put', `/sows/${id}/pause`),
  completeSOW: (id) => apiCall('put', `/sows/${id}/complete`),

  // Client-specific SOWs
  getByClientId: (clientId) => apiCall('get', `/sows/client/${clientId}`),

  // Analytics and Reporting
  getMetrics: (id) => apiCall('get', `/sows/${id}/metrics`),
  getPerformanceReport: (id, dateRange) => apiCall('get', `/sows/${id}/performance`, null, dateRange),

  // Bulk Operations
  bulkUpdate: (ids, updateData) => apiCall('put', '/sows/bulk-update', { ids, updateData }),
  bulkDelete: (ids) => apiCall('delete', '/sows/bulk-delete', { ids }),

  // Templates
  getTemplates: () => apiCall('get', '/sows/templates'),
  createFromTemplate: (templateId, data) => apiCall('post', `/sows/templates/${templateId}/create`, data),

  // Validation
  validateSOW: (data) => apiCall('post', '/sows/validate', data),
  checkConflicts: (data) => apiCall('post', '/sows/check-conflicts', data),
};