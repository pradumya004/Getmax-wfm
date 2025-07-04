// frontend/src/context/OrganizationContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { organizationAPI } from "../api/organization.api.js";
import { useAuth } from "../hooks/useAuth.js";

const OrganizationContext = createContext(null);

export const OrganizationProvider = ({ children }) => {
  const [orgData, setOrgData] = useState({
    departments: [],
    roles: [],
    designations: [],
    subdepartments: [],
  });
  const [loading, setLoading] = useState(false);
  const { userType } = useAuth();

  useEffect(() => {
    if (userType === "company") {
      loadOrgData();
    }
  }, [userType]);

  const loadOrgData = async () => {
    setLoading(true);
    try {
      const [departments, roles, designations, subdepartments] =
        await Promise.all([
          organizationAPI.getDepartments(),
          organizationAPI.getRoles(),
          organizationAPI.getDesignations(),
          organizationAPI.getSubDepartments(),
        ]);

      setOrgData({
        departments: departments.success ? departments.data : [],
        roles: roles.success ? roles.data : [],
        designations: designations.success ? designations.data : [],
        subdepartments: subdepartments.success ? subdepartments.data : [],
      });
    } catch (error) {
      console.error("Failed to load organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addRole = async (roleData) => {
    try {
      const result = await organizationAPI.createRole(roleData);
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          roles: [...prev.roles, result.data],
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to add role:", error);
      return { success: false, error: error.message };
    }
  };

  const updateRole = async (roleId, roleData) => {
    try {
      const result = await organizationAPI.updateRole(roleId, roleData);
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          roles: prev.roles.map((role) =>
            role._id === roleId ? { ...role, ...result.data } : role
          ),
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to update role:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteRole = async (roleId) => {
    try {
      const result = await organizationAPI.deleteRole(roleId);
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          roles: prev.roles.filter((role) => role._id !== roleId),
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to delete role:", error);
      return { success: false, error: error.message };
    }
  };

  // Departments CRUD
  const addDepartment = async (departmentData) => {
    try {
      const result = await organizationAPI.createDepartment(departmentData);
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          departments: [...prev.departments, result.data],
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to add department:", error);
      return { success: false, error: error.message };
    }
  };

  const updateDepartment = async (departmentId, departmentData) => {
    try {
      const result = await organizationAPI.updateDepartment(
        departmentId,
        departmentData
      );
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          departments: prev.departments.map((dept) =>
            dept._id === departmentId ? { ...dept, ...result.data } : dept
          ),
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to update department:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteDepartment = async (departmentId) => {
    try {
      const result = await organizationAPI.deleteDepartment(departmentId);
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          departments: prev.departments.filter(
            (dept) => dept._id !== departmentId
          ),
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to delete department:", error);
      return { success: false, error: error.message };
    }
  };

  // Designations CRUD
  const addDesignation = async (designationData) => {
    try {
      const result = await organizationAPI.createDesignation(designationData);
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          designations: [...prev.designations, result.data],
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to add designation:", error);
      return { success: false, error: error.message };
    }
  };

  const updateDesignation = async (designationId, designationData) => {
    try {
      const result = await organizationAPI.updateDesignation(
        designationId,
        designationData
      );
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          designations: prev.designations.map((desig) =>
            desig._id === designationId ? { ...desig, ...result.data } : desig
          ),
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to update designation:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteDesignation = async (designationId) => {
    try {
      const result = await organizationAPI.deleteDesignation(designationId);
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          designations: prev.designations.filter(
            (desig) => desig._id !== designationId
          ),
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to delete designation:", error);
      return { success: false, error: error.message };
    }
  };

  // Subdepartments CRUD
  const addSubDepartment = async (subDepartmentData) => {
    try {
      const result = await organizationAPI.createSubDepartment(
        subDepartmentData
      );
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          subdepartments: [...prev.subdepartments, result.data],
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to add subdepartment:", error);
      return { success: false, error: error.message };
    }
  };

  const updateSubDepartment = async (subDepartmentId, subDepartmentData) => {
    try {
      const result = await organizationAPI.updateSubDepartment(
        subDepartmentId,
        subDepartmentData
      );
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          subdepartments: prev.subdepartments.map((subdept) =>
            subdept._id === subDepartmentId
              ? { ...subdept, ...result.data }
              : subdept
          ),
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to update subdepartment:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteSubDepartment = async (subDepartmentId) => {
    try {
      const result = await organizationAPI.deleteSubDepartment(subDepartmentId);
      if (result.success) {
        setOrgData((prev) => ({
          ...prev,
          subdepartments: prev.subdepartments.filter(
            (subdept) => subdept._id !== subDepartmentId
          ),
        }));
      }
      return result;
    } catch (error) {
      console.error("Failed to delete subdepartment:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        orgData,
        loading,
        loadOrgData,
        addRole,
        updateRole,
        deleteRole,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addDesignation,
        updateDesignation,
        deleteDesignation,
        addSubDepartment,
        updateSubDepartment,
        deleteSubDepartment,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganizationContext must be used within OrganizationProvider"
    );
  }
  return context;
};
