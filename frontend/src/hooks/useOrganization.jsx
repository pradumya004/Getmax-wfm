// frontend/src/hooks/useOrganization.jsx

import { useState, useEffect } from 'react';
import { organizationAPI } from '../api/organization.api.js';
import { useApi } from './useApi.jsx';

export const useOrganization = () => {
    const [orgData, setOrgData] = useState({
        departments: [],
        roles: [],
        designations: [],
        subdepartments: []
    });

    const { loading, execute: fetchOrgData } = useApi(organizationAPI.getOrganizationalData);
    const { execute: addRoles } = useApi(organizationAPI.createRole);
    const { execute: addDepartments } = useApi(organizationAPI.createDepartment);
    const { execute: addDesignations } = useApi(organizationAPI.createDesignation);
    const { execute: addSubDepartments } = useApi(organizationAPI.createSubDepartment);


    useEffect(() => {
        loadOrgData();
    }, []);

    const loadOrgData = async () => {
        const data = await fetchOrgData();
        if (data) setOrgData(data);
    };

    const addRole = async (roleData) => {
        const result = await addRoles(roleData);
        if (result) {
            setOrgData(prev => ({
                ...prev,
                roles: [...prev.roles, result]
            }));
        }
        return result;
    };

    const addDepartment = async (departmentData) => {
        const result = await addDepartments(departmentData);
        if (result) {
            setOrgData(prev => ({
                ...prev,
                departments: [...prev.departments, result]
            }));
        }
        return result;
    };

    const addDesignation = async (designationData) => {
        const result = await addDesignations(designationData);
        if (result) {
            setOrgData(prev => ({
                ...prev,
                designations: [...prev.designations, result]
            }));
        }
        return result;
    };

    const addSubDepartment = async (subDepartmentData) => {
        const result = await addSubDepartments(subDepartmentData);
        if (result) {
            setOrgData(prev => ({
                ...prev,
                subdepartments: [...prev.subdepartments, result]
            }));
        }
        return result;
    };

    return {
        orgData,
        loading,
        refresh: loadOrgData,
        addRole,
        addDepartment,
        addDesignation,
        addSubDepartment
    };
};