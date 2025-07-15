// src/hooks/useClaims.jsx

import { useState } from "react";
import { claimAPI } from "../api/claim.api";
import { useApi } from "./useApi";
import { toast } from "react-hot-toast";

export const useClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { execute: fetchAll } = useApi(claimAPI.getAllClaims);
  const { execute: create } = useApi(claimAPI.createClaim);
  const { execute: update } = useApi(claimAPI.updateClaim);
  const { execute: remove } = useApi(claimAPI.deleteClaim);
  const { execute: bulkUpload } = useApi(claimAPI.bulkUploadClaims);
  const { execute: getById } = useApi(claimAPI.getClaimById);

  const loadClaims = async (params = {}) => {
    setLoading(true);
    try {
      const res = await fetchAll(params);
      const data = res?.data?.data ?? res?.data ?? [];
      setClaims(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch claims");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addClaim = async (data) => {
    const res = await create(data);
    if (res?.success) {
      toast.success("Claim created successfully");
      await loadClaims();
    }
    return res;
  };

  const editClaim = async (id, data) => {
    const res = await update(id, data);
    if (res?.success) {
      toast.success("Claim updated");
      await loadClaims();
    }
    return res;
  };

  const deleteClaim = async (id) => {
    const res = await remove(id);
    if (res?.success) {
      toast.success("Claim deleted");
      await loadClaims();
    }
    return res;
  };

  const uploadBulkClaims = async (formData) => {
    const res = await bulkUpload(formData);
    if (res?.success) {
      toast.success(`${res.data?.length || 0} claims uploaded`);
      await loadClaims();
    }
    return res;
  };

  const fetchClaimById = async (id) => {
    const res = await getById(id);
    return res?.data?.data ?? null;
  };

  return {
    claims,
    loading,
    error,
    loadClaims,
    addClaim,
    editClaim,
    deleteClaim,
    uploadBulkClaims,
    fetchClaimById,
  };
};
