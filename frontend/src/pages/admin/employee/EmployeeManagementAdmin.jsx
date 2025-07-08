import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Users,
  Building,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Clock,
  Activity,
  Target,
  TrendingUp,
  ArrowUpDown,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Check,
  Pause,
  Play,
  Edit,
  Trash2,
  Send,
  AlertTriangle,
  CheckCircle,
  Globe,
  Star,
  Crown,
  Package,
  Zap,
  Database,
  Server,
  Wifi,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useMasterAdmin } from "../../../hooks/useMasterAdmin.jsx";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";

const EnhancedEmployeeManagementAdmin = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  // Using the new useMasterAdmin hook
  const {
    employees,
    companies,
    employeesLoading,
    companiesLoading,
    loadEmployees,
    loadCompanies,
  } = useMasterAdmin();

  // Local state for employee management
  const [filters, setFilters] = useState({
    search: "",
    company: "",
    role: "",
    department: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEmployeesData();
  }, [filters, currentPage]);

  useEffect(() => {
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadEmployeesData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadEmployeesData = async () => {
    try {
      await Promise.all([
        loadEmployees({
          page: currentPage,
          limit: 20,
          search: filters.search,
          company: filters.company,
          role: filters.role,
          department: filters.department,
          status: filters.status,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        }),
        loadCompanies({ limit: 1000 }), // Load all companies for filtering
      ]);
    } catch (error) {
      console.error("Failed to load employee data:", error);
      toast.error("Failed to load employee data");
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
      company: "",
      role: "",
      department: "",
      status: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    const allEmployeeIds = mockEmployees.map((employee) => employee._id);
    setSelectedEmployees(
      selectedEmployees.length === mockEmployees.length ? [] : allEmployeeIds
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select employees first");
      return;
    }

    setBulkAction(action);
    setShowBulkModal(true);
  };

  const executeBulkAction = async () => {
    try {
      // Implementation for bulk actions
      console.log(
        `Executing ${bulkAction} for ${selectedEmployees.length} employees`
      );

      toast.success(
        `${bulkAction} completed for ${selectedEmployees.length} employees`
      );
      setSelectedEmployees([]);
      setShowBulkModal(false);
      loadEmployeesData();
    } catch (error) {
      toast.error(`Failed to ${bulkAction} employees`);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEmployeesData();
    setRefreshing(false);
    toast.success("Employee data refreshed!");
  };

  const handleExport = async () => {
    try {
      const exportData = mockEmployees.map((employee) => ({
        ID: employee.employeeId,
        Name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
        Email: employee.personalInfo.primaryEmail,
        Company: employee.company?.companyName || "N/A",
        Role: employee.role?.roleName || "N/A",
        Department: employee.department?.departmentName || "N/A",
        Status: employee.status.employeeStatus,
        JoinDate: new Date(employee.createdAt).toLocaleDateString(),
      }));

      const csv = [
        Object.keys(exportData[0]).join(","),
        ...exportData.map((row) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `platform-employees-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();

      toast.success("Employee data exported successfully");
    } catch (error) {
      toast.error("Failed to export employee data");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Active: `${theme.statusActive} border`,
      Inactive: `${theme.statusSuspended} border`,
      Suspended: `${theme.statusSuspended} border`,
      Pending: `${theme.statusTrial} border`,
    };
    return badges[status] || badges.Active;
  };

  const getCompanyBadge = (company) => {
    if (!company) return `${theme.badge} border`;

    const colors = {
      Enterprise: `${theme.planEnterprise} border`,
      Professional: `${theme.planProfessional} border`,
      Basic: `${theme.planBasic} border`,
    };
    return colors[company.subscriptionPlan] || `${theme.badge} border`;
  };

  // Mock employee data (replace with real data from API)
  const mockEmployees =
    employees.length > 0
      ? employees
      : [
          {
            _id: "1",
            employeeId: "EMP001",
            personalInfo: {
              firstName: "John",
              lastName: "Doe",
              primaryEmail: "john.doe@techcorp.com",
              primaryPhone: "+1-555-0123",
            },
            company: {
              _id: "comp1",
              companyName: "TechCorp Solutions",
              subscriptionPlan: "Enterprise",
            },
            role: {
              roleName: "Software Engineer",
            },
            department: {
              departmentName: "Engineering",
            },
            status: {
              employeeStatus: "Active",
            },
            lastLoginAt: "2024-01-20T10:30:00Z",
            createdAt: "2024-01-15T00:00:00Z",
            workLocation: "Office",
          },
          {
            _id: "2",
            employeeId: "EMP002",
            personalInfo: {
              firstName: "Jane",
              lastName: "Smith",
              primaryEmail: "jane.smith@digitalinnovations.com",
              primaryPhone: "+1-555-0124",
            },
            company: {
              _id: "comp2",
              companyName: "Digital Innovations",
              subscriptionPlan: "Professional",
            },
            role: {
              roleName: "Product Manager",
            },
            department: {
              departmentName: "Product",
            },
            status: {
              employeeStatus: "Active",
            },
            lastLoginAt: "2024-01-21T08:45:00Z",
            createdAt: "2024-01-10T00:00:00Z",
            workLocation: "Remote",
          },
          {
            _id: "3",
            employeeId: "EMP003",
            personalInfo: {
              firstName: "Mike",
              lastName: "Johnson",
              primaryEmail: "mike.johnson@globalmanufacturing.com",
              primaryPhone: "+1-555-0125",
            },
            company: {
              _id: "comp3",
              companyName: "Global Manufacturing",
              subscriptionPlan: "Enterprise",
            },
            role: {
              roleName: "Operations Manager",
            },
            department: {
              departmentName: "Operations",
            },
            status: {
              employeeStatus: "Active",
            },
            lastLoginAt: "2024-01-19T14:20:00Z",
            createdAt: "2024-01-08T00:00:00Z",
            workLocation: "Hybrid",
          },
        ];

  const pagination = {
    currentPage: 1,
    totalPages: 5,
    totalEmployees: mockEmployees.length,
    hasNext: true,
    hasPrev: false,
  };

  const employeeStats = {
    total: mockEmployees.length,
    active: mockEmployees.filter(
      (emp) => emp.status.employeeStatus === "Active"
    ).length,
    inactive: mockEmployees.filter(
      (emp) => emp.status.employeeStatus !== "Active"
    ).length,
    companies: new Set(mockEmployees.map((emp) => emp.company?._id)).size,
  };

  if (employeesLoading && mockEmployees.length === 0) {
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
        <title>Employee Management | Master Admin</title>
      </Helmet>

      {/* Header */}
      <div
        className={`sticky top-0 z-40 ${theme.glass} backdrop-blur-xl border-b border-${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent`}
              >
                Employee Management
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Cross-platform employee oversight ({pagination.totalEmployees}{" "}
                total across {employeeStats.companies} companies)
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
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Employee Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Total Employees
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {employeeStats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Active Employees
                </p>
                <p className={`text-2xl font-bold text-green-400`}>
                  {employeeStats.active}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Inactive Employees
                </p>
                <p className={`text-2xl font-bold text-red-400`}>
                  {employeeStats.inactive}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-400" />
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Companies
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {employeeStats.companies}
                </p>
              </div>
              <Building className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
        </div>

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
                  placeholder="Search employees by name, email, or ID..."
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
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                theme={userType}
                className="min-w-[140px]"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                theme={userType}
                className="min-w-[120px]"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
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

              {(filters.search || filters.company || filters.status) && (
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  theme={userType}
                >
                  <option value="createdAt">Join Date</option>
                  <option value="personalInfo.firstName">First Name</option>
                  <option value="personalInfo.lastName">Last Name</option>
                  <option value="lastLoginAt">Last Login</option>
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
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  theme={userType}
                >
                  <option value="">All Roles</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Operations Manager">Operations Manager</option>
                </Select>

                <Select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  theme={userType}
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Operations">Operations</option>
                </Select>
              </div>
            </div>
          )}
        </Card>

        {/* Bulk Actions */}
        {selectedEmployees.length > 0 && (
          <Card theme={userType} className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className={`text-${theme.text} font-medium`}>
                {selectedEmployees.length} employees selected
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
                  onClick={() => handleBulkAction("deactivate")}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  theme={userType}
                  onClick={() => handleBulkAction("message")}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Message
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
                  onClick={() => setSelectedEmployees([])}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Employees Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEmployees.map((employee) => {
              const isSelected = selectedEmployees.includes(employee._id);

              return (
                <Card
                  key={employee._id}
                  theme={userType}
                  className={`p-6 relative transition-all duration-200 ${
                    isSelected ? "ring-2 ring-red-400" : ""
                  } hover:scale-105 cursor-pointer`}
                  onClick={() => handleSelectEmployee(employee._id)}
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

                  {/* Employee Header */}
                  <div className="ml-8">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${theme.secondary} rounded-lg flex items-center justify-center`}
                        >
                          <Users className={`w-5 h-5 text-${theme.text}`} />
                        </div>
                        <div>
                          <h3
                            className={`text-${theme.text} font-semibold text-lg`}
                          >
                            {employee.personalInfo.firstName}{" "}
                            {employee.personalInfo.lastName}
                          </h3>
                          <p className={`text-${theme.textSecondary} text-sm`}>
                            {employee.employeeId}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusBadge(
                          employee.status.employeeStatus
                        )}`}
                      >
                        {employee.status.employeeStatus}
                      </span>
                    </div>

                    {/* Company Info */}
                    <div className="mb-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getCompanyBadge(
                          employee.company
                        )}`}
                      >
                        {employee.company?.companyName || "No Company"}
                      </span>
                    </div>

                    {/* Employee Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail
                          className={`w-3 h-3 text-${theme.textSecondary}`}
                        />
                        <span
                          className={`text-${theme.textSecondary} text-xs truncate`}
                        >
                          {employee.personalInfo.primaryEmail}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building
                          className={`w-3 h-3 text-${theme.textSecondary}`}
                        />
                        <span className={`text-${theme.textSecondary} text-xs`}>
                          {employee.role?.roleName || "No Role"} •{" "}
                          {employee.department?.departmentName || "No Dept"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock
                          className={`w-3 h-3 text-${theme.textSecondary}`}
                        />
                        <span className={`text-${theme.textSecondary} text-xs`}>
                          Last login:{" "}
                          {new Date(employee.lastLoginAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin
                          className={`w-3 h-3 text-${theme.textSecondary}`}
                        />
                        <span className={`text-${theme.textSecondary} text-xs`}>
                          {employee.workLocation}
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
                          navigate(`/master-admin/employees/${employee._id}`);
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
                          selectedEmployees.length === mockEmployees.length
                            ? "bg-red-500 border-red-500"
                            : "bg-transparent"
                        } flex items-center justify-center cursor-pointer`}
                        onClick={handleSelectAll}
                      >
                        {selectedEmployees.length === mockEmployees.length && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Employee
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Company
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Role
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Status
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Last Login
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockEmployees.map((employee) => {
                    const isSelected = selectedEmployees.includes(employee._id);

                    return (
                      <tr
                        key={employee._id}
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
                            onClick={() => handleSelectEmployee(employee._id)}
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
                              <Users className={`w-4 h-4 text-${theme.text}`} />
                            </div>
                            <div>
                              <p className={`text-${theme.text} font-medium`}>
                                {employee.personalInfo.firstName}{" "}
                                {employee.personalInfo.lastName}
                              </p>
                              <p
                                className={`text-${theme.textSecondary} text-sm`}
                              >
                                {employee.personalInfo.primaryEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getCompanyBadge(
                              employee.company
                            )}`}
                          >
                            {employee.company?.companyName || "No Company"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-${theme.text} font-medium`}>
                            {employee.role?.roleName || "No Role"}
                          </span>
                          <p className={`text-${theme.textSecondary} text-sm`}>
                            {employee.department?.departmentName || "No Dept"}
                          </p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusBadge(
                              employee.status.employeeStatus
                            )}`}
                          >
                            {employee.status.employeeStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-${theme.textSecondary} text-sm`}
                          >
                            {new Date(
                              employee.lastLoginAt
                            ).toLocaleDateString()}
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
                                  `/master-admin/employees/${employee._id}`
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
            {Math.min(currentPage * 20, pagination.totalEmployees)} of{" "}
            {pagination.totalEmployees} employees
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
        title={`Bulk ${bulkAction}`}
      >
        <div className="space-y-4">
          <p className={`text-${theme.text}`}>
            Are you sure you want to {bulkAction} {selectedEmployees.length}{" "}
            selected employees?
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
            >
              Confirm {bulkAction}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EnhancedEmployeeManagementAdmin;
