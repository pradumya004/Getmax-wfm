// frontend/src/hooks/usePatients.jsx
import { useState, useCallback } from "react";
import { patientAPI } from "../api/patient.api";
import { toast } from "react-hot-toast";
import { useApi } from "./useApi";

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  // --- MODIFIED: Add state for pagination ---
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { execute: fetchAll } = useApi(patientAPI.getAllPatients);
  const { execute: create } = useApi(patientAPI.createPatient);
  const { execute: update } = useApi(patientAPI.updatePatient);
  const { execute: remove } = useApi(patientAPI.deletePatient);
  const { execute: bulkUpload } = useApi(patientAPI.bulkUpload);
  const { execute: getById } = useApi(patientAPI.getPatientById);

  // --- MODIFIED: Wrap in useCallback and update both patient and pagination state ---
  const loadPatients = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await fetchAll(params);
      console.log("Patient Data.......", res);
      const data = res?.data?.data ?? res?.data ?? [];
      const paginationData = res?.data?.pagination ?? { total: 0, totalPages: 1, currentPage: 1 };
      
      setPatients(Array.isArray(data) ? data : []);
      setPagination(paginationData); // Set the pagination state from the API

    } catch (err) {
      const errorMessage = err.message || "Failed to fetch patients";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchAll]); // fetchAll from useApi is stable

  const addPatient = async (data) => {
    const res = await create(data);
    if (res?.success) {
      toast.success("Patient created successfully");
      await loadPatients(); // Refresh the first page
    }
    return res;
  };

  const editPatient = async (id, data) => {
    const res = await update(id, data);
    if (res?.success) {
      toast.success("Patient updated");
      // Refresh the current page after edit
      await loadPatients({ page: pagination.currentPage, limit: pagination.limit });
    }
    return res;
  };

  const deletePatient = async (id) => {
    const res = await remove(id);
    if (res?.success) {
      toast.success("Patient deleted");
      // Refresh the current page after delete
      await loadPatients({ page: pagination.currentPage, limit: pagination.limit });
    }
    return res;
  };

  const uploadBulkPatients = async (uploadData) => {
    const res = await bulkUpload(uploadData);
    if (res?.success) {
      toast.success("Bulk upload complete");
      await loadPatients();
    }
    return res;
  };

  const fetchPatientById = async (id) => {
    setLoading(true);
    try {
        const res = await getById(id);
        return res?.data?.data ?? null;
    } catch(err) {
        toast.error("Failed to fetch patient details.");
        return null;
    } finally {
        setLoading(false);
    }
  };

  return {
    patients,
    pagination, // --- MODIFIED: Expose pagination state ---
    loading,
    error,
    loadPatients,
    addPatient,
    editPatient,
    deletePatient,
    uploadBulkPatients,
    fetchPatientById,
  };
};