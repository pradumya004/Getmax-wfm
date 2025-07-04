// frontend/src/api/organization.api.js

// NOTE: These endpoints need to be created in backend
import { apiCall } from './apiClient.js';

export const organizationAPI = {
    // Roles Management  
    getRoles: () => apiCall('get', '/roles'),
    createRole: (data) => apiCall('post', '/roles', data),
    updateRole: (roleId, data) => apiCall('put', `/roles/${roleId}`, data),
    deleteRole: (roleId) => apiCall('delete', `/roles/${roleId}`),

    // Departments Management
    getDepartments: () => apiCall('get', '/departments'),
    createDepartment: (data) => apiCall('post', '/departments', data),
    updateDepartment: (deptId, data) => apiCall('put', `/departments/${deptId}`, data),
    deleteDepartment: (deptId) => apiCall('delete', `/departments/${deptId}`),

    // Designations Management
    getDesignations: () => apiCall('get', '/designations'),
    createDesignation: (data) => apiCall('post', '/designations', data),
    updateDesignation: (designationId, data) => apiCall('put', `/designations/${designationId}`, data),
    deleteDesignation: (designationId) => apiCall('delete', `/designations/${designationId}`),

    // SubDepartments Management
    getSubDepartments: () => apiCall('get', '/subdepartments'),
    createSubDepartment: (data) => apiCall('post', '/subdepartments', data),
    updateSubDepartment: (subDeptId, data) => apiCall('put', `/subdepartments/${subDeptId}`, data),
    deleteSubDepartment: (subDeptId) => apiCall('delete', `/subdepartments/${subDeptId}`)
};