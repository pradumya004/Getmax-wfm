// frontend/src/hooks/useOrganization.jsx

import { useState, useEffect } from "react";
import { organizationAPI } from "../api/organization.api.js";
import { useApi } from "./useApi.jsx";
import { toast } from "react-hot-toast";

export const useOrganization = () => {
  const [orgData, setOrgData] = useState({
    departments: [],
    roles: [],
    designations: [],
    subdepartments: [],
  });

  const { loading, execute: fetchDepartments } = useApi(
    organizationAPI.getDepartments
  );
  const { execute: fetchRoles } = useApi(organizationAPI.getRoles);
  const { execute: fetchDesignations } = useApi(
    organizationAPI.getDesignations
  );
  const { execute: fetchSubDepartments } = useApi(
    organizationAPI.getSubDepartments
  );

  const { execute: createRole } = useApi(organizationAPI.createRole);
  const { execute: createDepartment } = useApi(
    organizationAPI.createDepartment
  );
  const { execute: createDesignation } = useApi(
    organizationAPI.createDesignation
  );
  const { execute: createSubDepartment } = useApi(
    organizationAPI.createSubDepartment
  );

  const { execute: updateRoleAPI } = useApi(organizationAPI.updateRole);
  const { execute: updateDepartmentAPI } = useApi(
    organizationAPI.updateDepartment
  );
  const { execute: updateDesignationAPI } = useApi(
    organizationAPI.updateDesignation
  );
  const { execute: updateSubDepartmentAPI } = useApi(
    organizationAPI.updateSubDepartment
  );

  const { execute: deleteRoleAPI } = useApi(organizationAPI.deleteRole);
  const { execute: deleteDepartmentAPI } = useApi(
    organizationAPI.deleteDepartment
  );
  const { execute: deleteDesignationAPI } = useApi(
    organizationAPI.deleteDesignation
  );
  const { execute: deleteSubDepartmentAPI } = useApi(
    organizationAPI.deleteSubDepartment
  );

  useEffect(() => {
    loadOrgData();
  }, []);

  const loadOrgData = async () => {
    try {
      const [roles, departments, designations, subdepartments] =
        await Promise.all([
          fetchRoles({ silent: true }),
          fetchDepartments({ silent: true }),
          fetchDesignations({ silent: true }),
          fetchSubDepartments({ silent: true }),
        ]);

      // console.log("Roles:", roles);
      // console.log("Departments:", departments);
      // console.log("Designations:", designations);
      // console.log("SubDepartments:", subdepartments);

      const anyNull =
        !roles || !departments || !designations || !subdepartments;

      if (anyNull) {
        toast.error("Organization data not fully loaded");
        console.warn("❌ Some organization data failed to load.");
      }

      const newData = {
        roles: roles.data ?? [],
        departments: departments.data ?? [],
        designations: designations.data ?? [],
        subdepartments: subdepartments.data ?? [],
      };

      setOrgData(newData);
      console.log("Fetched Organization data:", newData);
    } catch (error) {
      console.error("Failed to load organization data:", error);
      toast.error("Failed to load organization data");
    }
  };

  //   ADD

  const addRole = async (roleData) => {
    const result = await createRole(roleData);
    if (result) {
      setOrgData((prev) => ({
        ...prev,
        roles: [...prev.roles, result],
      }));
    }
    return result;
  };

  const addDepartment = async (data) => {
    const result = await createDepartment(data);
    if (result) {
      setOrgData((prev) => ({
        ...prev,
        departments: [...prev.departments, result],
      }));
    }
    return result;
  };

  const addDesignation = async (data) => {
    const result = await createDesignation(data);
    if (result) {
      setOrgData((prev) => ({
        ...prev,
        designations: [...prev.designations, result],
      }));
    }
    return result;
  };

  const addSubDepartment = async (data) => {
    const result = await createSubDepartment(data);
    if (result) {
      setOrgData((prev) => ({
        ...prev,
        subdepartments: [...prev.subdepartments, result],
      }));
    }
    return result;
  };

  // UPDATE
  const updateRole = async (id, updated) => {
    const result = await updateRoleAPI(id, updated);
    if (result) {
      setOrgData((prev) => ({
        ...prev,
        roles: prev.roles.map((r) => (r._id === id ? result : r)),
      }));
    }
    return result;
  };

  const updateDepartment = async (id, updated) => {
    const result = await updateDepartmentAPI(id, updated);
    if (result) {
      setOrgData((prev) => ({
        ...prev,
        departments: prev.departments.map((d) => (d._id === id ? result : d)),
      }));
    }
    return result;
  };

  const updateDesignation = async (id, updated) => {
    const result = await updateDesignationAPI(id, updated);
    if (result) {
      setOrgData((prev) => ({
        ...prev,
        designations: prev.designations.map((d) => (d._id === id ? result : d)),
      }));
    }
    return result;
  };

  const updateSubDepartment = async (id, updated) => {
    const result = await updateSubDepartmentAPI(id, updated);
    if (result) {
      setOrgData((prev) => ({
        ...prev,
        subdepartments: prev.subdepartments.map((s) =>
          s._id === id ? result : s
        ),
      }));
    }
    return result;
  };

  // DELETE
  const deleteRole = async (id) => {
    const success = await deleteRoleAPI(id);
    if (success) {
      setOrgData((prev) => ({
        ...prev,
        roles: prev.roles.filter((r) => r._id !== id),
      }));
    }
    return success;
  };

  const deleteDepartment = async (id) => {
    const success = await deleteDepartmentAPI(id);
    if (success) {
      setOrgData((prev) => ({
        ...prev,
        departments: prev.departments.filter((d) => d._id !== id),
      }));
    }
    return success;
  };

  const deleteDesignation = async (id) => {
    const success = await deleteDesignationAPI(id);
    if (success) {
      setOrgData((prev) => ({
        ...prev,
        designations: prev.designations.filter((d) => d._id !== id),
      }));
    }
    return success;
  };

  const deleteSubDepartment = async (id) => {
    const success = await deleteSubDepartmentAPI(id);
    if (success) {
      setOrgData((prev) => ({
        ...prev,
        subdepartments: prev.subdepartments.filter((s) => s._id !== id),
      }));
    }
    return success;
  };

  return {
    orgData,
    loading,
    refresh: loadOrgData,

    // Add
    addRole,
    addDepartment,
    addDesignation,
    addSubDepartment,

    // Update
    updateRole,
    updateDepartment,
    updateDesignation,
    updateSubDepartment,

    // Delete
    deleteRole,
    deleteDepartment,
    deleteDesignation,
    deleteSubDepartment,
  };
};

export const useOrganizationEnums = () => {
  const [enums, setEnums] = useState(null);

  const { loading, execute: fetchEnums } = useApi(
    organizationAPI.getOrganizationEnums
  );

  useEffect(() => {
    loadEnums();
  }, []);

  const loadEnums = async () => {
    try {
      const data = await fetchEnums();
      console.log("Organization enums:", data);

      if (data) {
        setEnums(data);
      }
    } catch (error) {
      console.error("Failed to load organization enums:", error);
      toast.error("Failed to load organization configuration");
    }
  };

  // Helper functions to get specific enum options formatted for dropdowns
  const getRoleLevelOptions = () => {
    if (!enums?.role?.roleLevel) return [];
    const { min, max } = enums.role.roleLevel;
    return Array.from({ length: max - min + 1 }, (_, i) => ({
      value: min + i,
      label: `Level ${min + i}`,
    }));
  };

  const getDesignationLevelOptions = () => {
    if (!enums?.designation?.level) return [];
    const { min, max } = enums.designation.level;
    return Array.from({ length: max - min + 1 }, (_, i) => ({
      value: min + i,
      label: `Level ${min + i}`,
    }));
  };

  const getDepartmentLevelOptions = () => {
    if (!enums?.department?.departmentLevel) return [];
    const { min, max } = enums.department.departmentLevel;
    return Array.from({ length: max - min + 1 }, (_, i) => ({
      value: min + i,
      label: `Level ${min + i}`,
    }));
  };

  const getPermissionOptions = (permissionType) => {
    if (!enums?.role?.permissions?.[permissionType]) return [];
    return enums.role.permissions[permissionType].map((option) => ({
      value: option,
      label: option,
    }));
  };

  const getDataAccessOptions = (accessType) => {
    if (!enums?.role?.dataAccess?.[accessType]) return [];
    return enums.role.dataAccess[accessType].map((option) => ({
      value: option,
      label: option,
    }));
  };

  const getEnumOptions = (entityType, fieldName) => {
    if (!enums?.[entityType]?.[fieldName]) return [];
    return enums[entityType][fieldName].map((option) => ({
      value: option,
      label: option,
    }));
  };

  return {
    enums,
    loading,
    refresh: loadEnums,

    // Helper methods
    getRoleLevelOptions,
    getDesignationLevelOptions,
    getDepartmentLevelOptions,
    getPermissionOptions,
    getDataAccessOptions,
    getEnumOptions,

    // Quick access to common options
    currencyOptions: getEnumOptions("common", "currency"),
    timeZoneOptions: getEnumOptions("common", "timeZone"),

    // Role specific
    rolePermissions: enums?.role?.permissions || {},
    roleDataAccess: enums?.role?.dataAccess || {},

    // Designation specific
    designationCategories: getEnumOptions("designation", "category"),
    educationOptions: getEnumOptions("designation", "requiredEducation"),

    // SubDepartment specific
    workingDaysOptions: getEnumOptions("subdepartment", "workingDays"),
  };
};
