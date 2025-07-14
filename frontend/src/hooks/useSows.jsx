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
      const data = response?.data || response;
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
      await sowAPI.delete(id);
      setSOWs((prev) => prev.filter((sow) => sow._id !== id));
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

  // Get SOWs for specific client
  const getClientSOWs = async (clientId) => {
    try {
      setLoading(true);
      const response = await sowAPI.getByClientId(clientId);
      const data = response?.data || response;
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
  };

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
      console.error("Get SOW metrics error:", err);
      return null;
    }
  };

  // Bulk operations
  const bulkUpdateSOWs = async (ids, updateData) => {
    try {
      setLoading(true);
      await sowAPI.bulkUpdate(ids, updateData);
      // Refresh SOWs list
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

  // Status-specific actions
  const activateSOW = async (id) => {
    return updateStatus(id, { newStatus: "Active" });
  };

  const pauseSOW = async (id) => {
    return updateStatus(id, { newStatus: "On Hold" });
  };

  const completeSOW = async (id) => {
    return updateStatus(id, { newStatus: "Completed" });
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

    // Status Management
    updateStatus,
    activateSOW,
    pauseSOW,
    completeSOW,

    // Client Operations
    getClientSOWs,

    // Analytics
    getSOWMetrics,

    // Bulk Operations
    bulkUpdateSOWs,
    bulkDeleteSOWs,

    // Validation & Templates
    validateSOW,
    getTemplates,
    createFromTemplate,

    // Utility
    refresh: fetchSOWs,
  };
};