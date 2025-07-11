// frontend/src/hooks/useCompany.jsx

import { useState, useEffect, useCallback } from "react";
import { companyAPI } from "../api/company.api.js";
import { useAuth } from "./useAuth.jsx";
import { useApi } from "./useApi.jsx";
import { toast } from "react-hot-toast";

export const useCompanyPortal = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Dashboard data management
  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await companyPortalAPI.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Employee management
  const loadEmployees = useCallback(
    async (params = {}) => {
      if (!user) return;

      try {
        const response = await companyPortalAPI.getEmployees(params);
        setEmployees(response.data || []);
        return response;
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load employees");
      }
    },
    [user]
  );

  const addEmployee = useCallback(
    async (employeeData) => {
      try {
        const response = await companyPortalAPI.addEmployee(employeeData);
        if (response.success) {
          await loadEmployees(); // Refresh employee list
          toast.success("Employee added successfully");
        }
        return response;
      } catch (err) {
        toast.error(err.message || "Failed to add employee");
        throw err;
      }
    },
    [loadEmployees]
  );

  const updateEmployee = useCallback(
    async (employeeId, data) => {
      try {
        const response = await companyPortalAPI.updateEmployee(
          employeeId,
          data
        );
        if (response.success) {
          await loadEmployees(); // Refresh employee list
          toast.success("Employee updated successfully");
        }
        return response;
      } catch (err) {
        toast.error(err.message || "Failed to update employee");
        throw err;
      }
    },
    [loadEmployees]
  );

  const deleteEmployee = useCallback(
    async (employeeId) => {
      try {
        const response = await companyPortalAPI.deleteEmployee(employeeId);
        if (response.success) {
          await loadEmployees(); // Refresh employee list
          toast.success("Employee deleted successfully");
        }
        return response;
      } catch (err) {
        toast.error(err.message || "Failed to delete employee");
        throw err;
      }
    },
    [loadEmployees]
  );

  // Bulk operations
  const bulkUploadEmployees = useCallback(
    async (file) => {
      try {
        const response = await companyPortalAPI.bulkUploadEmployees(file);
        if (response.success) {
          await loadEmployees(); // Refresh employee list
          toast.success(
            `Successfully uploaded ${response.data.successCount} employees`
          );
          if (response.data.failedCount > 0) {
            toast.warning(
              `${response.data.failedCount} employees failed to upload`
            );
          }
        }
        return response;
      } catch (err) {
        toast.error(err.message || "Failed to upload employees");
        throw err;
      }
    },
    [loadEmployees]
  );

  // Notifications
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const response = await companyPortalAPI.getNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }, [user]);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      await companyPortalAPI.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  }, []);

  // Search and filter
  const searchEmployees = useCallback(async (query) => {
    try {
      const response = await companyPortalAPI.searchEmployees(query);
      return response.data || [];
    } catch (err) {
      toast.error("Search failed");
      return [];
    }
  }, []);

  // Reports and exports
  const generateEmployeeReport = useCallback(async (params) => {
    try {
      const response = await companyPortalAPI.generateEmployeeReport(params);
      toast.success("Report generated successfully");
      return response;
    } catch (err) {
      toast.error("Failed to generate report");
      throw err;
    }
  }, []);

  const exportEmployees = useCallback(async (format = "csv", filters = {}) => {
    try {
      const response = await companyPortalAPI.exportEmployees(format, filters);
      toast.success("Export completed successfully");
      return response;
    } catch (err) {
      toast.error("Export failed");
      throw err;
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadEmployees();
      loadNotifications();
    }
  }, [user, loadDashboardData, loadEmployees, loadNotifications]);

  return {
    // State
    dashboardData,
    employees,
    notifications,
    loading,
    error,

    // Dashboard
    loadDashboardData,

    // Employee management
    loadEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,

    // Bulk operations
    bulkUploadEmployees,

    // Notifications
    loadNotifications,
    markNotificationAsRead,

    // Reports
    generateEmployeeReport,
    exportEmployees,

    // Utilities
    refresh: () => {
      loadDashboardData();
      loadEmployees();
      loadNotifications();
    },
  };
};

export const useCompany = () => {
  const [company, setCompany] = useState(null);

  const {
    loading,
    error,
    execute: fetchCompanyProfile,
  } = useApi(companyAPI.getProfile);

  const {
    loading: updateLoading,
    error: updateError,
    execute: updateCompanyProfile,
  } = useApi(companyAPI.updateProfile);

  const loadCompanyProfile = async () => {
    try {
      const res = await fetchCompanyProfile();
      console.log("Fetched Company Profile:", res);

      if (res) {
        setCompany(res);
      } else {
        setCompany(null);
      }
    } catch (err) {
      console.error("Failed to load company profile:", err);
      setCompany(null);
    }
  };

  const updateCompany = async (formData) => {
    try {
      const res = await updateCompanyProfile(formData);
      console.log("Updated Company Profile:", res);
      await loadCompanyProfile();
      return res;
    } catch (err) {
      console.error("Failed to update company profile:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  return {
    company,
    loading,
    error,
    updateLoading,
    updateError,
    updateCompany,
    reload: loadCompanyProfile,
  };
};
