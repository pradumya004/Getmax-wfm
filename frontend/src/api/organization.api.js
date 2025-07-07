// frontend/src/api/organization.api.js

// NOTE: These endpoints need to be created in backend
import { apiCall } from './apiClient.js';

export const organizationAPI = {
    // Organization Enums
    getOrganizationEnums: () => apiCall('get', '/org-data/enums'),

    // Roles Management  
    getRoles: () => apiCall('get', '/org-data/roles'),
    createRole: (data) => apiCall('post', '/org-data/roles', data),
    updateRole: (roleId, data) => apiCall('put', `/org-data/roles/${roleId}`, data),
    deleteRole: (roleId) => apiCall('delete', `/org-data/roles/${roleId}`),

    // Departments Management
    getDepartments: () => apiCall('get', '/org-data/departments'),
    createDepartment: (data) => apiCall('post', '/org-data/departments', data),
    updateDepartment: (deptId, data) => apiCall('put', `/org-data/departments/${deptId}`, data),
    deleteDepartment: (deptId) => apiCall('delete', `/org-data/departments/${deptId}`),

    // Designations Management
    getDesignations: () => apiCall('get', '/org-data/designations'),
    createDesignation: (data) => apiCall('post', '/org-data/designations', data),
    updateDesignation: (designationId, data) => apiCall('put', `/org-data/designations/${designationId}`, data),
    deleteDesignation: (designationId) => apiCall('delete', `/org-data/designations/${designationId}`),

    // SubDepartments Management
    getSubDepartments: () => apiCall('get', '/org-data/subdepartments'),
    createSubDepartment: (data) => apiCall('post', '/org-data/subdepartments', data),
    updateSubDepartment: (subDeptId, data) => apiCall('put', `/org-data/subdepartments/${subDeptId}`, data),
    deleteSubDepartment: (subDeptId) => apiCall('delete', `/org-data/subdepartments/${subDeptId}`)
};