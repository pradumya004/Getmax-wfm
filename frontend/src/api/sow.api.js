// frontend/src/api/sow.api.js

import { apiCall } from './apiClient';

export const sowAPI = {
  // CRUD
  create: (data) => apiCall('post', '/sow', data),
  getAll: () => apiCall('get', '/sow'),
  getById: (id) => apiCall('get', `/sow/${id}`),
  update: (id, data) => apiCall('put', `/sow/${id}`, data),

  // Assign employees
  assignEmployees: (id, employeeList) => apiCall('put', `/sow/${id}/assign`, employeeList),

  // Change SOW status
  updateStatus: (id, statusUpdate) => apiCall('put', `/sow/${id}/status`, statusUpdate),

  // Get SOWs for a specific client
  getByClientId: (clientId) => apiCall('get', `/sow/client/${clientId}`)
};
