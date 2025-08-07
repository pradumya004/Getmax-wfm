// frontend/src/pages/company/employees/EmployeeManagement.jsx

import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Plus,
  Upload,
  Users,
  UserCheck,
  UserX,
  Eye,
  Edit,
  UserMinus,
  Download,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {StatCard} from "../../../components/common/StatCard.jsx";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { AddEmployeeModal } from "../../../components/company/AddEmployeeModal.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";
import { useEmployees } from "../../../hooks/useEmployee.jsx";
import { employeeAPI } from "../../../api/employee.api.js";
import { formatDate, getInitials } from "../../../lib/utils.js";
import { getTheme } from "../../../lib/theme.js";
import { toast } from "react-hot-toast";

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const { employees, loading, error, refresh } = useEmployees();
  const theme = getTheme("company");

  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    roleName: "all",
    departmentName: "all",
  });
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Transform employee data for DataTable compatibility
  const transformedEmployees = useMemo(() => {
    if (!employees || !Array.isArray(employees)) return [];

    return employees.map((employee) => ({
      ...employee,
      // Add flattened fields for easier access in DataTable
      fullName: `${employee.personalInfo?.firstName || ""} ${
        employee.personalInfo?.lastName || ""
      }`.trim(),
      firstName: employee.personalInfo?.firstName || "N/A",
      lastName: employee.personalInfo?.lastName || "N/A",
      email: employee.contactInfo?.primaryEmail || "N/A",
      phone:
        employee.contactInfo?.primaryPhone || employee.contactInfo?.phone || "",
      roleName: employee.roleRef?.roleName || "Not assigned",
      departmentName: employee.departmentRef?.departmentName || "Not assigned",
      joinDate: employee.employmentInfo?.dateOfJoining || null,
      isActive: employee.systemInfo?.isActive || false,
      status: employee.systemInfo?.isActive ? "Active" : "Inactive",
      emergencyContact: employee.contactInfo?.emergencyContact || null,
      address: employee.contactInfo?.address || null,
    }));
  }, [employees]);

  // Calculate stats
  const totalEmployees = transformedEmployees?.length || 0;
  const activeEmployees = transformedEmployees.filter(
    (emp) => emp.isActive
  ).length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  // Table columns configuration
  const columns = [
    {
      key: "fullName",
      label: "Employee",
      sortable: true,
      render: (value, employee) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xs">
              {getInitials(employee.fullName)}
            </span>
          </div>
          <div>
            <div className="font-medium text-white">{employee.fullName}</div>
            <div className="text-sm text-gray-400">{employee.employeeId}</div>
          </div>
        </div>
      ),
      width: "250px",
    },
    {
      key: "email",
      label: "Contact",
      render: (value, employee) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{value}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{employee.phone}</span>
            </div>
          )}
        </div>
      ),
      width: "200px",
    },
    {
      key: "roleName",
      label: "Role",
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400">{value}</span>
        </div>
      ),
      width: "150px",
    },
    {
      key: "departmentName",
      label: "Department",
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400">{value}</span>
        </div>
      ),
      width: "150px",
    },
    {
      key: "joinDate",
      label: "Join Date",
      type: "date",
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">
            {value ? formatDate(value, "short") : "N/A"}
          </span>
        </div>
      ),
      width: "130px",
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      render: (value, employee) => (
        <Badge variant={employee.isActive ? "success" : "secondary"}>
          {value}
        </Badge>
      ),
      width: "100px",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value, employee) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/company/employees/${employee.employeeId}`);
            }}
            className="p-2 hover:bg-blue-500/20"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/company/employees/${employee.employeeId}/edit`);
            }}
            className="p-2 hover:bg-green-500/20"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeactivateEmployee(employee);
            }}
            disabled={!employee.isActive}
            className={`p-2 ${
              employee.isActive
                ? "hover:bg-red-500/20 text-red-400"
                : "text-gray-500 cursor-not-allowed"
            }`}
          >
            <UserMinus className="w-4 h-4" />
          </Button>
        </div>
      ),
      width: "130px",
    },
  ];

  // Filter configurations
  const filters = useMemo(() => {
    const roles = [
      ...new Set(transformedEmployees.map((emp) => emp.roleName)),
    ].filter(Boolean);
    const departments = [
      ...new Set(transformedEmployees.map((emp) => emp.departmentName)),
    ].filter(Boolean);

    return [
      {
        key: "status",
        label: "Status",
        options: [
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
        ],
      },
      {
        key: "roleName",
        label: "Role",
        options: roles.map((role) => ({ value: role, label: role })),
      },
      {
        key: "departmentName",
        label: "Department",
        options: departments.map((dept) => ({ value: dept, label: dept })),
      },
    ];
  }, [transformedEmployees]);

  // Action buttons configuration
  const actions = [
    {
      label: "Add Employee",
      icon: Plus,
      variant: "primary",
      onClick: () => setShowAddModal(true),
      className: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      label: "Bulk Upload",
      icon: Upload,
      variant: "outline",
      onClick: () => navigate("/company/employees/bulk"),
    },
  ];

  // Bulk actions configuration
  const bulkActions = [
    {
      label: "Export Selected",
      icon: Download,
      onClick: (selectedIds) => handleBulkExport(selectedIds),
    },
    {
      label: "Deactivate Selected",
      icon: UserMinus,
      onClick: (selectedIds) => handleBulkDeactivate(selectedIds),
      className: "text-red-400 hover:text-red-300",
    },
  ];

  // Event handlers
  const handleDeactivateEmployee = (employee) => {
    setEmployeeToDeactivate(employee);
  };

  const handleConfirmDeactivate = async () => {
    if (!employeeToDeactivate) return;

    setIsDeactivating(true);
    try {
      await employeeAPI.deactivateEmployee(employeeToDeactivate.employeeId);
      toast.success("Employee deactivated successfully");
      await refresh();
      setEmployeeToDeactivate(null);
    } catch (error) {
      console.error("Failed to deactivate employee:", error);
      toast.error("Failed to deactivate employee");
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleBulkDeactivate = async (selectedIds) => {
    if (!selectedIds.length) return;

    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${selectedIds.length} employee(s)?`
    );

    if (!confirmed) return;

    try {
      const selectedEmployees = transformedEmployees.filter((emp) =>
        selectedIds.includes(emp.employeeId)
      );

      await Promise.all(
        selectedEmployees.map((emp) =>
          employeeAPI.deactivateEmployee(emp.employeeId)
        )
      );

      toast.success(
        `${selectedIds.length} employee(s) deactivated successfully`
      );
      setSelectedEmployees([]);
      await refresh();
    } catch (error) {
      console.error("Failed to deactivate employees:", error);
      toast.error("Failed to deactivate selected employees");
    }
  };

  const handleBulkExport = (selectedIds) => {
    const selectedEmployeesData = transformedEmployees.filter((emp) =>
      selectedIds.includes(emp.employeeId)
    );

    // Create CSV content
    const headers = [
      "Employee ID",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Department",
      "Join Date",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedEmployeesData.map((emp) =>
        [
          emp.employeeId,
          emp.fullName,
          emp.email,
          emp.phone || "",
          emp.roleName,
          emp.departmentName,
          emp.joinDate ? formatDate(emp.joinDate) : "",
          emp.status,
        ].join(",")
      ),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Employees exported successfully");
  };

  const handleRowClick = (employee) => {
    navigate(`/company/employees/${employee.employeeId}`);
  };

  const handleRowSelect = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids) => {
    setSelectedEmployees(ids);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleExportAll = () => {
    if (!transformedEmployees.length) {
      toast.error("No employees to export");
      return;
    }

    handleBulkExport(transformedEmployees.map((emp) => emp.employeeId));
  };

  // Search fields for the DataTable
  const searchFields = [
    "fullName",
    "firstName",
    "lastName",
    "email",
    "employeeId",
    "roleName",
    "departmentName",
  ];

  // Filter the employees based on active filters
  const filteredEmployees = useMemo(() => {
    if (!transformedEmployees) return [];

    return transformedEmployees.filter((employee) => {
      // Status filter
      if (
        activeFilters.status !== "all" &&
        employee.status !== activeFilters.status
      ) {
        return false;
      }

      // Role filter
      if (
        activeFilters.roleName !== "all" &&
        employee.roleName !== activeFilters.roleName
      ) {
        return false;
      }

      // Department filter
      if (
        activeFilters.departmentName !== "all" &&
        employee.departmentName !== activeFilters.departmentName
      ) {
        return false;
      }

      return true;
    });
  }, [transformedEmployees, activeFilters]);

  return (
    <div className={`min-h-screen bg-gradient-to-br p-6`}>
      <Helmet>
        <title>Employee Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Employee Management
            </h1>
            <p className="text-blue-200">Manage your company employees</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            icon={Users}
            theme="company"
          />
          <StatCard
            title="Active Employees"
            value={activeEmployees}
            icon={UserCheck}
            theme="company"
          />
          <StatCard
            title="Inactive Employees"
            value={inactiveEmployees}
            icon={UserX}
            theme="company"
          />
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredEmployees}
          columns={columns}
          loading={loading}
          error={error}
          title="Employee Directory"
          subtitle="Comprehensive employee information and management"
          theme={theme}
          // Search configuration
          searchable={true}
          searchFields={searchFields}
          searchPlaceholder="Search employees by name, ID, email, role, or department..."
          // Selection configuration
          selectable={true}
          selectedRows={selectedEmployees}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          // Interaction configuration
          onRowClick={handleRowClick}
          onRefresh={refresh}
          onExport={handleExportAll}
          // Actions configuration
          actions={actions}
          bulkActions={bulkActions}
          // Filter configuration
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          // Pagination configuration
          paginated={true}
          itemsPerPage={15}
          itemsPerPageOptions={[10, 15, 25, 50]}
          // Styling configuration
          responsive={true}
          stickyHeader={true}
          // Empty state configuration
          emptyStateTitle="No employees found"
          emptyStateDescription="Get started by adding your first employee or importing from a file."
          // Row key
          rowKey="employeeId"
        />

        {/* Add Employee Modal */}
        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            refresh();
            setShowAddModal(false);
          }}
        />

        {/* Deactivate Confirmation */}
        <ConfirmDialog
          isOpen={!!employeeToDeactivate}
          onClose={() => setEmployeeToDeactivate(null)}
          onConfirm={handleConfirmDeactivate}
          title="Deactivate Employee"
          message={`Are you sure you want to deactivate ${employeeToDeactivate?.fullName}? They will lose access to the system.`}
          type="warning"
          confirmText="Deactivate"
          loading={isDeactivating}
        />
      </div>
    </div>
  );
};

export default EmployeeManagement;
