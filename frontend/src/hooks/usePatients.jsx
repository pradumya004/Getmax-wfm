// frontend/src/hooks/usePatients.jsx
import { useState, useEffect } from "react";
import { patientAPI } from "../api/patient.api";
import { toast } from "react-hot-toast";
import { useApi } from "./useApi";

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { execute: fetchAll } = useApi(patientAPI.getAllPatients);
  const { execute: create } = useApi(patientAPI.createPatient);
  const { execute: update } = useApi(patientAPI.updatePatient);
  const { execute: remove } = useApi(patientAPI.deletePatient);
  const { execute: bulkUpload } = useApi(patientAPI.bulkUpload);
  const { execute: getById } = useApi(patientAPI.getPatientById);

  const loadPatients = async (params = {}) => {
    setLoading(true);
    try {
      const res = await fetchAll(params);
      const data = res?.data?.data ?? res?.data ?? [];
      setPatients(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch patients");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (data) => {
    const res = await create(data);
    console.log("Patient added response:", res);
    
    if (res?.success) {
      toast.success("Patient created successfully");
      await loadPatients();
    }
    return res;
  };

  const editPatient = async (id, data) => {
    const res = await update(id, data);
    if (res?.success) {
      toast.success("Patient updated");
      await loadPatients();
    }
    return res;
  };

  const deletePatient = async (id) => {
    const res = await remove(id);
    if (res?.success) {
      toast.success("Patient deleted");
      await loadPatients();
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
    const res = await getById(id);
    return res?.data?.data ?? null;
  };

  return {
    patients,
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
