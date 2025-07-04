// frontend/src/hooks/useEmployee.jsx

import { useState, useEffect } from "react";
import { employeeAPI } from "../api/employee.api.js";
import { useApi } from "./useApi.jsx";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const { loading, error } = useApi(employeeAPI);
  const { execute: fetchEmployees } = useApi(employeeAPI.getCompanyEmployees);
  const { execute: add } = useApi(employeeAPI.addEmployee);
  const { execute: update } = useApi(employeeAPI.updateEmployee);

  const loadEmployees = async () => {
    const res = await fetchEmployees({ limit: 100, page: 1 }); // ✅ FIXED
    console.log("Fetched Employees:", res);
    
    const employeeList = res?.employees;

    if (Array.isArray(employeeList)) {
      setEmployees(employeeList);
    } else {
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const addEmployee = async (employeeData) => {
    const result = await add(employeeData);
    if (result) await loadEmployees();
    return result;
  };

  const updateEmployee = async (employeeId, updateData) => {
    const result = await update(employeeId, updateData);
    if (result) await loadEmployees();
    return result;
  };

  return {
    employees,
    loading,
    error,
    refresh: loadEmployees,
    addEmployee,
    updateEmployee,
  };
};
