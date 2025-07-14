import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Building,
  Users,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Crown,
  Star,
  Package,
  Pause,
  Play,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  ArrowUpDown,
  FileText,
  Mail,
  Phone,
  Globe,
  MapPin,
  Activity,
  X,
  Check,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  UserCheck,
  Shield,
  Zap,
  Database,
  Server,
  Wifi,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { masterAdminAPI } from "../../../api/masterAdmin.api.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useApi } from "../../../hooks/useApi.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import ExportCompanies from "./ExportCompanies"; // Adjust path as needed

const EnhancedCompanyManagement = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  // State management
  const [filters, setFilters] = useState({
    search: "",
    subscriptionPlan: "",
    subscriptionStatus: "",
    isActive: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    companySize: "",
    region: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showExportModal, setShowExportModal] = useState(false);

  // API hooks
  const {
    data: companiesData,
    loading: companiesLoading,
    execute: fetchCompanies,
    // error: companiesError,
  } = useApi(masterAdminAPI.getAllCompanies);

  useEffect(() => {
    loadCompanies();
  }, [filters, currentPage]);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    // const interval = setInterval(loadCompanies, 30000);
    // return () => clearInterval(interval);
  }, []);

  const loadCompanies = async () => {
    try {
      await fetchCompanies({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      // console.log(object);
    } catch (error) {
      console.error("Failed to load companies:", error);
      toast.error("Failed to load companies");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange("search", searchTerm);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      subscriptionPlan: "",
      subscriptionStatus: "",
      isActive: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      companySize: "",
      region: "",
    });
    setCurrentPage(1);
  };

  const handleSelectCompany = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    const allCompanyIds = companies.map((company) => company._id);
    setSelectedCompanies(
      selectedCompanies.length === companies.length ? [] : allCompanyIds
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedCompanies.length === 0) {
      toast.error("Please select companies first");
      return;
    }

    setBulkAction(action);
    setShowBulkModal(true);
  };

  const executeBulkAction = async () => {
    try {
      // Implementation for bulk actions
      const promises = selectedCompanies.map((companyId) => {
        switch (bulkAction) {
          case "suspend":
            return masterAdminAPI.toggleCompanyStatus(companyId, {
              status: "suspended",
            });
          case "activate":
            return masterAdminAPI.toggleCompanyStatus(companyId, {
              status: "active",
            });
          case "export":
            setShowExportModal(true);
            setShowBulkModal(false);
            return Promise.resolve();
          default:
            return Promise.resolve();
        }
      });

      if (bulkAction !== "export") {
        await Promise.all(promises);
        toast.success(
          `${bulkAction} completed for ${selectedCompanies.length} companies`
        );
        setSelectedCompanies([]);
        setShowBulkModal(false);
        loadCompanies();
      } else {
        setShowBulkModal(false);
      }
    } catch (error) {
      console.error(`Failed to ${bulkAction} companies:`, error);
      toast.error(`Failed to ${bulkAction} companies`);
    }
  };

  const handleExport = async () => {
    setShowExportModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: `${theme.statusActive} border`,
      trial: `${theme.statusTrial} border`,
      suspended: `${theme.statusSuspended} border`,
    };
    return badges[status] || badges.active;
  };

  const getPlanBadge = (plan) => {
    const badges = {
      Enterprise: `${theme.planEnterprise} border`,
      Professional: `${theme.planProfessional} border`,
      Basic: `${theme.planBasic} border`,
    };
    return badges[plan] || badges.Basic;
  };

  const getCompanyHealth = (company) => {
    const employeeCount = company.employeeCount || 0;
    const isActive = company.isActive;
    const hasRecentActivity = true; // Mock data

    if (!isActive) return { score: 0, label: "Inactive", color: "red" };
    if (employeeCount > 100 && hasRecentActivity)
      return { score: 100, label: "Excellent", color: "green" };
    if (employeeCount > 50) return { score: 75, label: "Good", color: "blue" };
    if (employeeCount > 10)
      return { score: 50, label: "Fair", color: "yellow" };
    return { score: 25, label: "Poor", color: "orange" };
  };

  // Mock data fallback
  const companies = companiesData?.data?.companies || [];
  console.log("company Data" ,companiesData);

  console.log("Companies:", companies);

  const pagination = companiesData?.pagination || {
    currentPage: 1,
    totalPages: 5,
    totalCompanies: companies.length,
    hasNext: true,
    hasPrev: false,
  };

  if (companiesLoading && companies.length === 0) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} text-${theme.text}`}
    >
      <Helmet>
        <title>Company Management | Master Admin</title>
      </Helmet>

      {/* Header */}
      <div
        className={`top-0 z-40 ${theme.glass} backdrop-blur-xl border-b border-${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent`}
              >
                Company Management
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Manage all companies using your platform (
                {pagination.totalCompanies} total)
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button
                variant="primary"
                size="sm"
                theme={userType}
                onClick={loadCompanies}
                disabled={companiesLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    companiesLoading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <Card theme={userType} className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${theme.textSecondary}`}
                />
                <Input
                  placeholder="Search companies by name, email, or ID..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  theme={userType}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.subscriptionPlan}
                onChange={(e) =>
                  handleFilterChange("subscriptionPlan", e.target.value)
                }
                theme={userType}
                className="min-w-[120px]"
              >
                <option value="">All Plans</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Professional">Professional</option>
                <option value="Basic">Basic</option>
              </Select>

              <Select
                value={filters.subscriptionStatus}
                onChange={(e) =>
                  handleFilterChange("subscriptionStatus", e.target.value)
                }
                theme={userType}
                className="min-w-[120px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended</option>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                theme={userType}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {(filters.search ||
                filters.subscriptionPlan ||
                filters.subscriptionStatus) && (
                <Button
                  variant="ghost"
                  size="sm"
                  theme={userType}
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className={`mt-4 pt-4 border-t border-${theme.border}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  theme={userType}
                >
                  <option value="createdAt">Created Date</option>
                  <option value="companyName">Company Name</option>
                  <option value="employeeCount">Employee Count</option>
                  <option value="subscriptionPlan">Plan</option>
                </Select>

                <Select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange("sortOrder", e.target.value)
                  }
                  theme={userType}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </Select>

                <Select
                  value={filters.companySize}
                  onChange={(e) =>
                    handleFilterChange("companySize", e.target.value)
                  }
                  theme={userType}
                >
                  <option value="">All Sizes</option>
                  <option value="small">Small (1-50)</option>
                  <option value="medium">Medium (51-200)</option>
                  <option value="large">Large (201+)</option>
                </Select>

                <Select
                  value={filters.isActive}
                  onChange={(e) =>
                    handleFilterChange("isActive", e.target.value)
                  }
                  theme={userType}
                >
                  <option value="">All Companies</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </Select>
              </div>
            </div>
          )}
        </Card>

        {/* Bulk Actions */}
        {selectedCompanies.length > 0 && (
          <Card theme={userType} className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className={`text-${theme.text} font-medium`}>
                {selectedCompanies.length} companies selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  theme={userType}
                  onClick={() => handleBulkAction("activate")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  theme={userType}
                  onClick={() => handleBulkAction("suspend")}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Suspend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  theme={userType}
                  onClick={() => handleBulkAction("export")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  theme={userType}
                  onClick={() => setSelectedCompanies([])}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Companies Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => {
              const health = getCompanyHealth(company);
              const isSelected = selectedCompanies.includes(company._id);

              return (
                <Card
                  key={company._id}
                  theme={userType}
                  className={`p-6 relative transition-all duration-200 ${
                    isSelected ? "ring-2 ring-red-400" : ""
                  } hover:scale-105 cursor-pointer`}
                  onClick={() => handleSelectCompany(company._id)}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4">
                    <div
                      className={`w-5 h-5 rounded border-2 border-${
                        theme.border
                      } ${
                        isSelected
                          ? "bg-red-500 border-red-500"
                          : "bg-transparent"
                      } flex items-center justify-center`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  {/* Company Header */}
                  <div className="ml-8">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${theme.secondary} rounded-lg flex items-center justify-center`}
                        >
                          <Building className={`w-5 h-5 text-${theme.text}`} />
                        </div>
                        <div>
                          <h3
                            className={`text-${theme.text} font-semibold text-lg truncate`}
                          >
                            {company.companyName}
                          </h3>
                          <p className={`text-${theme.textSecondary} text-sm`}>
                            {company.companyId}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-1">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getPlanBadge(
                            company.subscriptionPlan
                          )}`}
                        >
                          {company.subscriptionPlan}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${getStatusBadge(
                            company.subscriptionStatus
                          )}`}
                        >
                          {company.subscriptionStatus}
                        </span>
                      </div>
                    </div>

                    {/* Company Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`p-3 ${theme.glass} rounded-lg`}>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <div>
                            <p
                              className={`text-${theme.textSecondary} text-xs`}
                            >
                              Employees
                            </p>
                            <p className={`text-${theme.text} font-semibold`}>
                              {company.stats.totalEmployees || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 ${theme.glass} rounded-lg`}>
                        <div className="flex items-center space-x-2">
                          <Activity
                            className={`w-4 h-4 text-${health.color}-400`}
                          />
                          <div>
                            <p
                              className={`text-${theme.textSecondary} text-xs`}
                            >
                              Health
                            </p>
                            <p
                              className={`text-${health.color}-400 font-semibold text-sm`}
                            >
                              {health.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail
                          className={`w-3 h-3 text-${theme.textSecondary}`}
                        />
                        <span
                          className={`text-${theme.textSecondary} text-xs truncate`}
                        >
                          {company.billingEmail}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone
                          className={`w-3 h-3 text-${theme.textSecondary}`}
                        />
                        <span className={`text-${theme.textSecondary} text-xs`}>
                          {company.contactPhone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin
                          className={`w-3 h-3 text-${theme.textSecondary}`}
                        />
                        <span className={`text-${theme.textSecondary} text-xs`}>
                          {company.address?.city}, {company.address?.country}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        theme={userType}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/master-admin/companies/${company.companyId}`);
                        }}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        theme={userType}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Quick action menu
                        }}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* List View */
          <Card theme={userType} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`bg-${theme.glass} border-b border-${theme.border}`}
                >
                  <tr>
                    <th className="p-4 text-left">
                      <div
                        className={`w-5 h-5 rounded border-2 border-${
                          theme.border
                        } ${
                          selectedCompanies.length === companies.length
                            ? "bg-red-500 border-red-500"
                            : "bg-transparent"
                        } flex items-center justify-center cursor-pointer`}
                        onClick={handleSelectAll}
                      >
                        {selectedCompanies.length === companies.length && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Company
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Plan
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Status
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Employees
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Created
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => {
                    const isSelected = selectedCompanies.includes(company._id);

                    return (
                      <tr
                        key={company._id}
                        className={`border-b border-${theme.border} hover:bg-white/5 transition-colors`}
                      >
                        <td className="p-4">
                          <div
                            className={`w-5 h-5 rounded border-2 border-${
                              theme.border
                            } ${
                              isSelected
                                ? "bg-red-500 border-red-500"
                                : "bg-transparent"
                            } flex items-center justify-center cursor-pointer`}
                            onClick={() => handleSelectCompany(company._id)}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${theme.secondary} rounded-lg flex items-center justify-center`}
                            >
                              <Building
                                className={`w-4 h-4 text-${theme.text}`}
                              />
                            </div>
                            <div>
                              <p className={`text-${theme.text} font-medium`}>
                                {company.companyName}
                              </p>
                              <p
                                className={`text-${theme.textSecondary} text-sm`}
                              >
                                {company.companyEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getPlanBadge(
                              company.subscriptionPlan
                            )}`}
                          >
                            {company.subscriptionPlan}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusBadge(
                              company.subscriptionStatus
                            )}`}
                          >
                            {company.subscriptionStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-${theme.text} font-medium`}>
                            {company.stats.totalEmployees || 0}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-${theme.textSecondary} text-sm`}
                          >
                            {new Date(company.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              theme={userType}
                              onClick={() =>
                                navigate(
                                  `/master-admin/companies/${company._id}`
                                )
                              }
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" theme={userType}>
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className={`text-${theme.textSecondary} text-sm`}>
            Showing {(currentPage - 1) * 20 + 1} to{" "}
            {Math.min(currentPage * 20, pagination.totalCompanies)} of{" "}
            {pagination.totalCompanies} companies
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              theme={userType}
              disabled={!pagination.hasPrev}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.totalPages))].map(
                (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        page === currentPage
                          ? `${theme.button}`
                          : `text-${theme.textSecondary} hover:text-${theme.text}`
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              theme={userType}
              disabled={!pagination.hasNext}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages)
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Action Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title={`Bulk ${bulkAction || "Export"} companies`}
      >
        <div className="space-y-4">
          <p className={`text-${theme.text}`}>
            Are you sure you want to {bulkAction} {selectedCompanies.length}{" "}
            selected companies?
          </p>

          <div className="flex items-center space-x-3 justify-end">
            <Button
              variant="outline"
              theme={userType}
              onClick={() => setShowBulkModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              theme={userType}
              onClick={executeBulkAction}
              // loading={actionLoading}
            >
              Confirm {bulkAction}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <ExportCompanies
        companies={
          selectedCompanies.length > 0
            ? companies.filter((company) =>
                selectedCompanies.includes(company._id)
              )
            : companies
        }
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        theme={theme}
      />
    </div>
  );
};

export default EnhancedCompanyManagement;
