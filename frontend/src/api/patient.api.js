// frontend/src/api/patient.api.js
import { apiCall } from './apiClient';

export const patientAPI = {
  // Basic CRUD
  createPatient: (data) => apiCall('post', '/patients', data),
  getAllPatients: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall('get', `/patients${queryString ? `?${queryString}` : ''}`);
  },
  getPatientById: (id) => apiCall('get', `/patients/${id}`),
  updatePatient: (id, data) => apiCall('put', `/patients/${id}`, data),
  deletePatient: (id) => apiCall('delete', `/patients/${id}`),

  // Bulk Upload
  bulkUpload: (data) => apiCall('post', '/patients/upload/bulk', data)
};
