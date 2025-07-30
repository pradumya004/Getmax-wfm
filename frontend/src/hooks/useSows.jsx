// frontend/src/hooks/useSows.jsx

import { useState, useEffect, useCallback } from "react";
import { sowAPI } from "../api/sow.api";
import { toast } from "react-hot-toast";

export const useSOWs = () => {
  const [sows, setSOWs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({});

  // Fetch all SOWs with optional filters
  const fetchSOWs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sowAPI.getAll(params);
      console.log("Response from fetchSOWs:", response);

      const data =
        response && response.data && response.data.data && response.data.data.data ? response.data.data.data : response.data.data;
      console.log("SOWs data:", data);
      setSOWs(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch SOWs";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Fetch SOWs error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new SOW
  const addSOW = async (sowData) => {
    try {
      setLoading(true);
      const response = await sowAPI.create(sowData);
      const newSOW = response?.data || response;

      setSOWs((prev) => [newSOW, ...prev]);
      toast.success("SOW created successfully!");
      return newSOW;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create SOW";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Create SOW error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing SOW
  const updateSOW = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await sowAPI.update(id, updatedData);
      const updatedSOW = response?.data || response;

      setSOWs((prev) => prev.map((sow) => (sow._id === id ? updatedSOW : sow)));
      toast.success("SOW updated successfully!");
      return updatedSOW;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update SOW";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Update SOW error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single SOW by ID
  const getSOW = async (id) => {
    try {
      setLoading(true);
      const response = await sowAPI.getById(id);
      return response?.data || response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to retrieve SOW";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Get SOW error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete SOW
  const removeSOW = async (id) => {
    try {
      console.log("Removing SOW with ID:", id);
      await sowAPI.delete(id);
      setSOWs((prev) => prev.filter((sow) => sow.sowId !== id));
      toast.success("SOW deleted successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete SOW";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Delete SOW error:", err);
      throw err;
    }
  };

  // Assign employees to SOW
  const assignEmployees = async (sowId, employeeData) => {
    try {
      const response = await sowAPI.assignEmployees(sowId, employeeData);
      const updatedSOW = response?.data || response;

      setSOWs((prev) =>
        prev.map((sow) => (sow._id === sowId ? updatedSOW : sow))
      );
      toast.success("Employees assigned successfully!");
      return updatedSOW;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to assign employees";
      toast.error(errorMessage);
      console.error("Assign employees error:", err);
      throw err;
    }
  };

  // Unassign employees from SOW
  const unassignEmployees = async (sowId, employeeData) => {
    try {
      const response = await sowAPI.unassignEmployees(sowId, employeeData);
      const updatedSOW = response?.data || response;

      setSOWs((prev) =>
        prev.map((sow) => (sow._id === sowId ? updatedSOW : sow))
      );
      toast.success("Employees unassigned successfully!");
      return updatedSOW;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to unassign employees";
      toast.error(errorMessage);
      console.error("Unassign employees error:", err);
      throw err;
    }
  };

  // Update SOW status
  const updateStatus = async (id, statusData) => {
    try {
      const response = await sowAPI.updateStatus(id, statusData);
      const updatedSOW = response?.data || response;

      setSOWs((prev) => prev.map((sow) => (sow._id === id ? updatedSOW : sow)));
      toast.success(
        `SOW status updated to ${statusData.newStatus || statusData.sowStatus}`
      );
      return updatedSOW;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update SOW status";
      toast.error(errorMessage);
      console.error("Update status error:", err);
      throw err;
    }
  };

  // Activate SOW
  const activateSOW = async (id) => {
    try {
      const response = await sowAPI.activateSOW(id);
      const updatedSOW = response?.data || response;

      setSOWs((prev) => prev.map((sow) => (sow._id === id ? updatedSOW : sow)));
      toast.success("SOW activated successfully!");
      return updatedSOW;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to activate SOW";
      toast.error(errorMessage);
      console.error("Activate SOW error:", err);
      throw err;
    }
  };

  // Pause a SOW
  const pauseSOW = async (id) => {
    try {
      const response = await sowAPI.pauseSOW(id);
      const updatedSOW = response?.data || response;

      setSOWs((prev) => prev.map((sow) => (sow._id === id ? updatedSOW : sow)));
      toast.success("SOW paused successfully!");
      return updatedSOW;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to pause SOW";
      toast.error(errorMessage);
      console.error("Pause SOW error:", err);
      throw err;
    }
  };

  // Complete a SOW (uses dedicated API call)
  const completeSOW = async (id) => {
    try {
      const response = await sowAPI.completeSOW(id);
      const updatedSOW = response?.data || response;

      setSOWs((prev) => prev.map((sow) => (sow._id === id ? updatedSOW : sow)));
      toast.success("SOW completed successfully!");
      return updatedSOW;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to complete SOW";
      toast.error(errorMessage);
      console.error("Complete SOW error:", err);
      throw err;
    }
  };

  // Get SOWs for specific client
  const getClientSOWs = useCallback(async (clientId) => {
    if (!clientId) return []; // Add a guard clause

    try {
      setLoading(true);
      const response = await sowAPI.getByClientId(clientId);

      // Assuming your API returns { success: true, data: [...] }
      const data = response?.data?.data?.data ;
      console.log("RAW SOWs RESPONSE:", response); 
      
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch client SOWs";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Get client SOWs error:", err);
      return [];
    } finally {
      setLoading(false);
    }
    // 3. Add a dependency array. It's empty because the function doesn't depend on any props or state from this hook.
  }, []); 

  // Get SOW metrics
  const getSOWMetrics = async (id) => {
    try {
      const response = await sowAPI.getMetrics(id);
      const metricsData = response?.data || response;
      setMetrics((prev) => ({ ...prev, [id]: metricsData }));
      return metricsData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch SOW metrics";
      toast.error(errorMessage);
      console.error("Get SOW metrics error:", err);
      return null;
    }
  };

  // Get SOW performance report
  const getPerformanceReport = async (id, dateRange) => {
    try {
      const response = await sowAPI.getPerformanceReport(id, dateRange);
      const reportData = response?.data || response;
      return reportData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch performance report";
      toast.error(errorMessage);
      console.error("Get performance report error:", err);
      return null;
    }
  };

  // Bulk operations
  const bulkUpdateSOWs = async (ids, updateData) => {
    try {
      setLoading(true);
      await sowAPI.bulkUpdate(ids, updateData);
      // Refresh SOWs list to reflect changes
      await fetchSOWs();
      toast.success(`${ids.length} SOW(s) updated successfully!`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to bulk update SOWs";
      toast.error(errorMessage);
      console.error("Bulk update error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete SOWs
  const bulkDeleteSOWs = async (ids) => {
    try {
      setLoading(true);
      await sowAPI.bulkDelete(ids);
      setSOWs((prev) => prev.filter((sow) => !ids.includes(sow._id)));
      toast.success(`${ids.length} SOW(s) deleted successfully!`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to bulk delete SOWs";
      toast.error(errorMessage);
      console.error("Bulk delete error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const validateSOW = async (sowData) => {
    try {
      const response = await sowAPI.validateSOW(sowData);
      return response?.data || response;
    } catch (err) {
      console.error("SOW validation error:", err);
      return { isValid: false, errors: err.response?.data?.errors || [] };
    }
  };

  // Check for SOW conflicts
  const checkConflicts = async (sowData) => {
    try {
      const response = await sowAPI.checkConflicts(sowData);
      return response?.data || response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to check SOW conflicts";
      toast.error(errorMessage);
      console.error("Check conflicts error:", err);
      return { hasConflicts: false, conflicts: [] };
    }
  };

  // Templates
  const getTemplates = async () => {
    try {
      const response = await sowAPI.getTemplates();
      return response?.data || response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch SOW templates";
      toast.error(errorMessage);
      console.error("Get templates error:", err);
      return [];
    }
  };

  // Create SOW from template
  const createFromTemplate = async (templateId, sowData) => {
    try {
      setLoading(true);
      const response = await sowAPI.createFromTemplate(templateId, sowData);
      const newSOW = response?.data || response;

      setSOWs((prev) => [newSOW, ...prev]);
      toast.success("SOW created from template successfully!");
      return newSOW;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create SOW from template";
      toast.error(errorMessage);
      console.error("Create from template error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchSOWs();
  }, [fetchSOWs]);

  return {
    // State
    sows,
    loading,
    error,
    metrics,

    // CRUD Operations
    fetchSOWs,
    addSOW,
    updateSOW,
    getSOW,
    removeSOW,

    // Employee Management
    assignEmployees,
    unassignEmployees,

    // Status Management
    updateStatus,
    activateSOW,
    pauseSOW,
    completeSOW,

    // Client Operations
    getClientSOWs,

    // Analytics & Reporting
    getSOWMetrics,
    getPerformanceReport,

    // Bulk Operations
    bulkUpdateSOWs,
    bulkDeleteSOWs,

    // Validation & Templates
    validateSOW,
    checkConflicts,
    getTemplates,
    createFromTemplate,

    // Utility
    refresh: fetchSOWs,
  };
};
