// src/api/claim.api.js

import { apiCall } from "./apiClient";

export const claimAPI = {
  // CRUD operations
  createClaim: (data) => apiCall("post", "/claims", data),
  getAllClaims: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall("get", `/claims${query ? `?${query}` : ""}`);
  },
  getClaimById: (id) => apiCall("get", `/claims/${id}`),
  updateClaim: (id, data) => apiCall("put", `/claims/${id}`, data),
  deleteClaim: (id) => apiCall("delete", `/claims/${id}`),

  // Bulk Upload
  bulkUploadClaims: (formData) =>
    apiCall("post", "/claims/upload/bulk", formData),
};
