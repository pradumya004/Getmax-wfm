// frontend/src/hooks/useMasterAdmin.jsx

import { useState, useEffect, useCallback } from "react";
import { masterAdminAPI } from "../api/masterAdmin.api.js";
import { useApi } from "./useApi.jsx";
import { useAuth } from "./useAuth.jsx";

export const useMasterAdmin = () => {
  // ============= STATE MANAGEMENT =============
  const [platformStats, setPlatformStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    subscriptionPlan: "",
    subscriptionStatus: "",
    isActive: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalCompanies: 0,
  });

  const { userType } = useAuth();

  // ============= API HOOKS =============
  const {
    loading: statsLoading,
    error: statsError,
    execute: fetchPlatformStats,
  } = useApi(masterAdminAPI.getPlatformStats);

  const {
    loading: companiesLoading,
    error: companiesError,
    execute: fetchCompanies,
  } = useApi(masterAdminAPI.getAllCompanies);

  const {
    loading: companyDetailsLoading,
    error: companyDetailsError,
    execute: fetchCompanyDetails,
  } = useApi(masterAdminAPI.getCompanyDetails);

  const {
    loading: employeesLoading,
    error: employeesError,
    execute: fetchEmployees,
  } = useApi(masterAdminAPI.getAllEmployees);

  const {
    loading: toggleStatusLoading,
    error: toggleStatusError,
    execute: executeToggleStatus,
  } = useApi(masterAdminAPI.toggleCompanyStatus);

  const {
    loading: changeSubscriptionLoading,
    error: changeSubscriptionError,
    execute: executeChangeSubscription,
  } = useApi(masterAdminAPI.changeSubscriptionPlan);

  const {
    loading: systemHealthLoading,
    error: systemHealthError,
    execute: fetchSystemHealth,
  } = useApi(masterAdminAPI.getSystemHealth);

  // ============= PLATFORM STATISTICS =============
  const loadPlatformStats = useCallback(
    async (period = "30d") => {
      try {
        const result = await fetchPlatformStats(period);
        if (result) {
          setPlatformStats(result);
        }
      } catch (error) {
        console.error("Failed to load platform stats:", error);
      }
    },
    [fetchPlatformStats]
  );

  // ============= COMPANY MANAGEMENT =============
  const loadCompanies = useCallback(
    async (params = {}) => {
      try {
        const queryParams = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
          ...params,
        };

        const result = await fetchCompanies(queryParams);
        if (result) {
          setCompanies(result.companies || []);
          setPagination((prev) => ({
            ...prev,
            ...result.pagination,
          }));
        }
      } catch (error) {
        console.error("Failed to load companies:", error);
      }
    },
    [fetchCompanies, filters, pagination.page, pagination.limit]
  );

  const loadCompanyDetails = useCallback(
    async (companyId) => {
      try {
        const result = await fetchCompanyDetails(companyId);
        if (result) {
          setSelectedCompany(result);
        }
        return result;
      } catch (error) {
        console.error("Failed to load company details:", error);
        return null;
      }
    },
    [fetchCompanyDetails]
  );

  const toggleCompanyStatus = useCallback(
    async (companyId, action, reason = null) => {
      try {
        const result = await executeToggleStatus(companyId, action, reason);
        if (result) {
          // Update local state
          setCompanies((prev) =>
            prev.map((company) =>
              company.companyId === companyId
                ? {
                    ...company,
                    isActive: action === "activate",
                    subscriptionStatus:
                      action === "activate" ? "Active" : "Suspended",
                  }
                : company
            )
          );

          // Update selected company if it matches
          if (selectedCompany?.companyId === companyId) {
            setSelectedCompany((prev) => ({
              ...prev,
              isActive: action === "activate",
              subscriptionStatus:
                action === "activate" ? "Active" : "Suspended",
            }));
          }
        }
        return result;
      } catch (error) {
        console.error("Failed to toggle company status:", error);
        return null;
      }
    },
    [executeToggleStatus, selectedCompany]
  );

  const changeSubscriptionPlan = useCallback(
    async (companyId, newPlan, effectiveDate = null, reason = null) => {
      try {
        const result = await executeChangeSubscription(
          companyId,
          newPlan,
          effectiveDate,
          reason
        );
        if (result) {
          // Update local state
          setCompanies((prev) =>
            prev.map((company) =>
              company.companyId === companyId
                ? { ...company, subscriptionPlan: newPlan }
                : company
            )
          );

          // Update selected company if it matches
          if (selectedCompany?.companyId === companyId) {
            setSelectedCompany((prev) => ({
              ...prev,
              subscriptionPlan: newPlan,
            }));
          }
        }
        return result;
      } catch (error) {
        console.error("Failed to change subscription plan:", error);
        return null;
      }
    },
    [executeChangeSubscription, selectedCompany]
  );

  // ============= EMPLOYEE MANAGEMENT =============
  const loadEmployees = useCallback(
    async (params = {}) => {
      try {
        const queryParams = {
          page: 1,
          limit: 50,
          ...params,
        };

        const result = await fetchEmployees(queryParams);
        if (result) {
          setEmployees(result.employees || []);
        }
      } catch (error) {
        console.error("Failed to load employees:", error);
      }
    },
    [fetchEmployees]
  );

  // ============= SYSTEM MONITORING =============
  const loadSystemHealth = useCallback(async () => {
    try {
      const result = await fetchSystemHealth();
      if (result) {
        setSystemHealth(result);
      }
    } catch (error) {
      console.error("Failed to load system health:", error);
    }
  }, [fetchSystemHealth]);

  // ============= FILTERS & SEARCH =============
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      subscriptionPlan: "",
      subscriptionStatus: "",
      isActive: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const changePage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  // ============= BULK OPERATIONS =============
  const suspendCompany = useCallback(
    (companyId, reason) => toggleCompanyStatus(companyId, "suspend", reason),
    [toggleCompanyStatus]
  );

  const activateCompany = useCallback(
    (companyId, reason) => toggleCompanyStatus(companyId, "activate", reason),
    [toggleCompanyStatus]
  );

  // ============= ANALYTICS HELPERS =============
  const getCompanyGrowthRate = useCallback(() => {
    if (!platformStats?.overview) return 0;
    return platformStats.overview.companyGrowthRate || 0;
  }, [platformStats]);

  const getEmployeeGrowthRate = useCallback(() => {
    if (!platformStats?.overview) return 0;
    return platformStats.overview.employeeGrowthRate || 0;
  }, [platformStats]);

  const getTopCompanies = useCallback(() => {
    if (!platformStats?.topCompanies) return [];
    return platformStats.topCompanies;
  }, [platformStats]);

  // ============= REFRESH FUNCTIONS =============
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadPlatformStats(),
      loadCompanies(),
      loadSystemHealth(),
    ]);
  }, [loadPlatformStats, loadCompanies, loadSystemHealth]);

  const refreshCompanies = useCallback(() => {
    loadCompanies();
  }, [loadCompanies]);

  const refreshStats = useCallback(
    (period = "30d") => {
      loadPlatformStats(period);
    },
    [loadPlatformStats]
  );

  // ============= INITIAL LOAD =============
  useEffect(() => {
    if (userType === "master_admin") {
      loadPlatformStats();
      loadSystemHealth();
    }
  }, [userType, loadPlatformStats, loadSystemHealth]);

  // Load companies when filters or pagination change
  useEffect(() => {
    if (userType === "master_admin") {
      loadCompanies();
    }
  }, [userType, filters, pagination.page, pagination.limit, loadCompanies]);

  // ============= COMPUTED VALUES =============
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.isActive).length;
  const suspendedCompanies = companies.filter((c) => !c.isActive).length;

  // ============= LOADING STATES =============
  const isLoading = statsLoading || companiesLoading || systemHealthLoading;
  const isCompanyActionLoading =
    toggleStatusLoading || changeSubscriptionLoading;

  // ============= ERROR STATES =============
  const hasError = statsError || companiesError || systemHealthError;
  const companyActionError = toggleStatusError || changeSubscriptionError;

  // ============= RETURN OBJECT =============
  return {
    // Data
    platformStats,
    companies,
    selectedCompany,
    employees,
    systemHealth,
    filters,
    pagination,

    // Loading states
    isLoading,
    isCompanyActionLoading,
    statsLoading,
    companiesLoading,
    companyDetailsLoading,
    employeesLoading,
    systemHealthLoading,
    toggleStatusLoading,
    changeSubscriptionLoading,

    // Error states
    hasError,
    companyActionError,
    statsError,
    companiesError,
    companyDetailsError,
    employeesError,
    systemHealthError,
    toggleStatusError,
    changeSubscriptionError,

    // Core functions
    loadPlatformStats,
    loadCompanies,
    loadCompanyDetails,
    loadEmployees,
    loadSystemHealth,

    // Company management
    toggleCompanyStatus,
    suspendCompany,
    activateCompany,
    changeSubscriptionPlan,

    // Filters & pagination
    updateFilters,
    clearFilters,
    changePage,

    // Analytics helpers
    getCompanyGrowthRate,
    getEmployeeGrowthRate,
    getTopCompanies,

    // Computed values
    totalCompanies,
    activeCompanies,
    suspendedCompanies,

    // Refresh functions
    refreshAll,
    refreshCompanies,
    refreshStats,

    // Utility functions
    clearSelectedCompany: () => setSelectedCompany(null),

    // State setters (for advanced use cases)
    setFilters,
    setPagination,
    setSelectedCompany,
  };
};

// ============= SPECIALIZED HOOKS =============

// Hook specifically for platform statistics
export const usePlatformStats = (period = "30d") => {
  const { execute: fetchStats } = useApi(masterAdminAPI.getPlatformStats);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(
    async (newPeriod = period) => {
      setLoading(true);
      try {
        const result = await fetchStats(newPeriod);
        if (result) {
          setStats(result);
        }
      } catch (error) {
        console.error("Failed to load platform stats:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchStats, period]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, refresh: loadStats };
};

// Hook specifically for company management
export const useCompanyManagement = () => {
  const { execute: fetchCompanies } = useApi(masterAdminAPI.getAllCompanies);
  const { execute: toggleStatus } = useApi(masterAdminAPI.toggleCompanyStatus);
  const { execute: changeSubscription } = useApi(
    masterAdminAPI.changeSubscriptionPlan
  );

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCompanies = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const result = await fetchCompanies(params);
        if (result) {
          setCompanies(result.companies || []);
        }
      } catch (error) {
        console.error("Failed to load companies:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchCompanies]
  );

  const suspendCompany = useCallback(
    async (companyId, reason) => {
      const result = await toggleStatus(companyId, "suspend", reason);
      if (result) {
        await loadCompanies();
      }
      return result;
    },
    [toggleStatus, loadCompanies]
  );

  const activateCompany = useCallback(
    async (companyId, reason) => {
      const result = await toggleStatus(companyId, "activate", reason);
      if (result) {
        await loadCompanies();
      }
      return result;
    },
    [toggleStatus, loadCompanies]
  );

  const updateSubscription = useCallback(
    async (companyId, newPlan, effectiveDate, reason) => {
      const result = await changeSubscription(
        companyId,
        newPlan,
        effectiveDate,
        reason
      );
      if (result) {
        await loadCompanies();
      }
      return result;
    },
    [changeSubscription, loadCompanies]
  );

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  return {
    companies,
    loading,
    loadCompanies,
    suspendCompany,
    activateCompany,
    updateSubscription,
    refresh: loadCompanies,
  };
};
