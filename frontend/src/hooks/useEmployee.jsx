// frontend/src/hooks/useEmployee.jsx

import { useState, useEffect, useCallback } from "react";
import { employeeAPI } from "../api/employee.api.js";
import { useApi } from "./useApi.jsx";

// ============= COMPANY ADMIN HOOKS (for managing employees) =============
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const { loading, error } = useApi(employeeAPI);
  const { execute: fetchEmployees } = useApi(employeeAPI.getCompanyEmployees);
  const { execute: add } = useApi(employeeAPI.addEmployee);
  const { execute: update } = useApi(employeeAPI.updateEmployee);
  const { execute: deactivate } = useApi(employeeAPI.deactivateEmployee);
  const { execute: reactivate } = useApi(employeeAPI.reactivateEmployee);
  const { execute: resetPassword } = useApi(employeeAPI.resetEmployeePassword);
  const { execute: deleteEmployee } = useApi(employeeAPI.deleteEmployee);

  const loadEmployees = async (params = { limit: 100, page: 1 }) => {
    const res = await fetchEmployees(params); // ✅ FIXED
    console.log("Fetched Employees:", res);
    const employeeList = res?.employees || res?.data?.employees;
    if (Array.isArray(employeeList)) {
      setEmployees(employeeList);
    } else {
      setEmployees([]);
    }
    return res;
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

  const deactivateEmployee = async (employeeId) => {
    const result = await deactivate(employeeId);
    if (result) await loadEmployees();
    return result;
  };

  const reactivateEmployee = async (employeeId) => {
    const result = await reactivate(employeeId);
    if (result) await loadEmployees();
    return result;
  };

  const resetEmployeePassword = async (employeeId) => {
    const result = await resetPassword(employeeId);
    return result;
  };

  const deleteEmployeeById = async (employeeId) => {
    const result = await deleteEmployee(employeeId);
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
    deactivateEmployee,
    reactivateEmployee,
    resetEmployeePassword,
    deleteEmployee: deleteEmployeeById,
  };
};

// ============= EMPLOYEE SELF-SERVICE HOOKS =============

// Hook for employee's own profile management
export const useEmployee = () => {
  const [employee, setEmployee] = useState(null);

  const {
    loading,
    error,
    execute: fetchProfile,
  } = useApi(employeeAPI.getMyProfile);

  const {
    loading: updateLoading,
    error: updateError,
    execute: updateProfile,
  } = useApi(employeeAPI.updateMyProfile);

  const {
    loading: uploadLoading,
    error: uploadError,
    execute: uploadAvatarApi,
  } = useApi(employeeAPI.uploadAvatar);

  const loadEmployee = async () => {
    try {
      const res = await fetchProfile();
      console.log("Fetched Employee Profile:", res);

      if (res) {
        setEmployee(res);
      } else {
        setEmployee(null);
      }
    } catch (err) {
      console.error("Failed to load employee profile:", err);
      setEmployee(null);
    }
  };

  const updateEmployee = async (updateData) => {
    try {
      const res = await updateProfile(updateData);
      console.log("Updated Employee Profile:", res);

      if (res) {
        setEmployee(res);
        await loadEmployee(); // Refresh profile
      }
      return res;
    } catch (err) {
      console.error("Failed to update employee profile:", err);
      throw err;
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await uploadAvatarApi(formData);
      console.log("Uploaded Avatar:", res);

      if (res) {
        // Update employee with new avatar
        setEmployee((prev) => ({
          ...prev,
          personalInfo: {
            ...prev?.personalInfo,
            profilePicture: res.avatarUrl || res.data?.avatarUrl,
          },
        }));
        await loadEmployee(); // Refresh profile
      }
      return res;
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadEmployee();
  }, []);

  return {
    employee,
    loading,
    error,
    updateLoading,
    updateError,
    uploadLoading,
    uploadError,
    updateEmployee,
    uploadAvatar,
    refreshEmployee: loadEmployee,
  };
};

// Hook for employee performance data
export const useEmployeePerformance = () => {
  const [performance, setPerformance] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    overall: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerformance = useCallback(async (period = "monthly") => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call when backend endpoint is ready
      // For now, using mock data
      const mockPerformanceData = {
        daily: [],
        weekly: [],
        monthly: [],
        overall: {
          tasksCompleted: 487,
          qualityScore: 94.5,
          productivity: 89.2,
          slaCompliance: 96.8,
          averageTaskTime: 2.3,
          averageTasksPerDay: 22,
          averageCompletionTime: 2.1,
          improvement: 12.5,
        },
      };

      setPerformance(mockPerformanceData);
    } catch (err) {
      console.error("Failed to fetch performance data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  return {
    performance,
    loading,
    error,
    fetchPerformance,
  };
};

// Hook for employee gamification data
export const useEmployeeGamification = () => {
  const [gamification, setGamification] = useState({
    experience: {},
    achievements: [],
    badges: [],
    leaderboard: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGamification = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call when backend endpoint is ready
      // For now, using mock data
      const mockGamificationData = {
        experience: {
          currentLevel: 5,
          currentXP: 2340,
          xpToNextLevel: 2500,
          totalXP: 12340,
        },
        achievements: [
          {
            id: 1,
            title: "Quality Champion",
            description: "Maintained 95%+ quality score for 30 days",
            earnedDate: "2024-01-15",
            category: "Quality",
          },
          {
            id: 2,
            title: "Speed Master",
            description: "Completed 500+ tasks in a month",
            earnedDate: "2024-01-10",
            category: "Productivity",
          },
        ],
        badges: [
          {
            id: 1,
            name: "Top Performer",
            description: "Consistently high performance",
            isNew: true,
          },
          {
            id: 2,
            name: "Team Player",
            description: "Great collaboration skills",
            isNew: false,
          },
        ],
        leaderboard: [],
      };

      setGamification(mockGamificationData);
    } catch (err) {
      console.error("Failed to fetch gamification data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGamification();
  }, [fetchGamification]);

  return {
    gamification,
    loading,
    error,
    refreshGamification: fetchGamification,
  };
};

// Hook for employee tasks/claims
export const useEmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call when backend endpoint is ready
      // For now, using mock data
      const mockTasksData = {
        tasks: [
          {
            id: 1,
            taskId: "CLM-2024-001",
            title: "Medical Claim Review",
            description:
              "Review and process medical claim for patient ID PAT-001",
            status: "in_progress",
            priority: "high",
            dueDate: "2024-01-20",
            assignedDate: "2024-01-18",
            claimId: "CLM-2024-001",
          },
          {
            id: 2,
            taskId: "CLM-2024-002",
            title: "Dental Claim Processing",
            description: "Process dental claim for routine checkup",
            status: "completed",
            priority: "medium",
            dueDate: "2024-01-19",
            assignedDate: "2024-01-17",
            claimId: "CLM-2024-002",
          },
        ],
        stats: {
          todayCompleted: 5,
          todayIncrease: 12,
          totalAssigned: 25,
          totalCompleted: 487,
          pendingTasks: 3,
          overdueTask: 1,
        },
      };

      setTasks(mockTasksData.tasks);
      setStats(mockTasksData.stats);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    stats,
    loading,
    error,
    fetchTasks,
    refreshTasks: () => fetchTasks(),
  };
};

// Hook for getting employee leaderboard
export const useEmployeeLeaderboard = () => {
  const {
    data: leaderboard,
    loading,
    error,
    execute: fetchLeaderboard,
  } = useApi(employeeAPI.getPerformanceLeaderboard);

  const [leaderboardData, setLeaderboardData] = useState([]);

  const loadLeaderboard = async () => {
    try {
      const res = await fetchLeaderboard();
      console.log("Fetched Leaderboard:", res);

      if (res) {
        setLeaderboardData(res);
      }
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return {
    leaderboard: leaderboardData,
    loading,
    error,
    refreshLeaderboard: loadLeaderboard,
  };
};

// Hook for specific employee details (for admin use)
export const useEmployeeDetails = (employeeId) => {
  const [employee, setEmployee] = useState(null);
  const {
    loading,
    error,
    execute: fetchEmployeeDetails,
  } = useApi(employeeAPI.getEmployeeDetails);

  const loadEmployeeDetails = async () => {
    if (!employeeId) return;

    try {
      const res = await fetchEmployeeDetails(employeeId);
      console.log("Fetched Employee Details:", res);

      if (res) {
        setEmployee(res);
      }
    } catch (err) {
      console.error("Failed to load employee details:", err);
      setEmployee(null);
    }
  };

  useEffect(() => {
    loadEmployeeDetails();
  }, [employeeId]);

  return {
    employee,
    loading,
    error,
    refreshEmployee: loadEmployeeDetails,
  };
};
