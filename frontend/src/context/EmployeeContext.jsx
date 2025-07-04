// frontend/src/context/EmployeeContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { employeeAPI } from "../api/employee.api.js";
import { useAuth } from "../hooks/useAuth.js";

const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, userType } = useAuth();

  useEffect(() => {
    if (userType === "employee" && user) {
      loadEmployeeData();
    }
  }, [user, userType]);

  const loadEmployeeData = async () => {
    if (userType !== "employee") return;

    setLoading(true);
    try {
      const result = await employeeAPI.getMyProfile();
      if (result.success) {
        setEmployee(result.data);
      }
    } catch (error) {
      console.error("Failed to load employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = (updatedData) => {
    setEmployee((prev) => ({ ...prev, ...updatedData }));
  };

  const updatePerformance = (performanceData) => {
    setPerformance(performanceData);
  };

  return (
    <EmployeeContext.Provider
      value={{
        employee,
        performance,
        loading,
        updateEmployee,
        updatePerformance,
        refresh: loadEmployeeData,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployee must be used within EmployeeProvider");
  }
  return context;
};