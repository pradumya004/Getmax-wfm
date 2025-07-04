// frontend/src/hooks/useCompany.jsx

import { useState, useEffect } from "react";
import { companyAPI } from "../api/company.api.js";
import { useApi } from "./useApi.jsx";

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
