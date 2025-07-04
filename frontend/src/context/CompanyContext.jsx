// frontend/src/context/CompanyContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { companyAPI } from "../api/company.api.js";
import { useAuth } from "../hooks/useAuth.js";

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, userType } = useAuth();

  useEffect(() => {
    if (userType === "company" && user) {
      loadCompanyProfile();
    }
  }, [user, userType]);

  const loadCompanyProfile = async () => {
    if (userType !== "company") return;

    setLoading(true);
    try {
      const result = await companyAPI.getProfile();
      if (result.success) {
        setCompany(result.data);
      }
    } catch (error) {
      console.error("Failed to load company profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = (updatedData) => {
    setCompany((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <CompanyContext.Provider
      value={{
        company,
        loading,
        updateCompany,
        refresh: loadCompanyProfile,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within CompanyProvider");
  }
  return context;
};