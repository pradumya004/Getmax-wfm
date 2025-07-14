// frontend/src/pages/company/organization/DepartmentManagement.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Building,
  Users,
  Calendar,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import StatCard from "../../../components/common/StatCard.jsx";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { AddDepartmentModal } from "../../../components/organization/departments/AddDepartmentModal.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { toast } from "react-hot-toast";
import { formatDate } from "../../../lib/utils.js";

const DepartmentManagement = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [departments, setDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    isActive: "all",
    departmentLevel: "all",
  });

  const { loading, execute: fetchDepartments } = useApi(
    organizationAPI.getDepartments
  );

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await fetchDepartments();
    if (data) setDepartments(data.data);
  };

  // Transform department data for DataTable compatibility
  const transformedDepartments = useMemo(() => {
    if (!departments || !Array.isArray(departments)) return [];

    return departments.map((dept) => ({
      ...dept,
      departmentName: dept.departmentName || "N/A",
      departmentCode: dept.departmentCode || "N/A",
      departmentLevel: dept.departmentLevel || 1,
      isActive: dept.isActive !== false,
      description: dept.description || "No description",
      status: dept.isActive !== false ? "Active" : "Inactive",
    }));
  }, [departments]);

  // Event handlers
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setShowAddModal(true);
  };

  const handleViewDepartment = (department) => {
    // Navigate to department details or show details modal
    console.log("View department:", department);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setShowAddModal(true);
  };

  const handleDeleteDepartment = (department) => {
    setDepartmentToDelete(department);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return;

    setIsDeleting(true);
    try {
      await organizationAPI.deleteDepartment(departmentToDelete._id);
      toast.success("Department deleted successfully");
      setShowDeleteDialog(false);
      setDepartmentToDelete(null);
      await loadDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!selectedIds.length) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} department(s)?`
    );

    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) => organizationAPI.deleteDepartment(id))
      );
      toast.success(`${selectedIds.length} department(s) deleted successfully`);
      setSelectedDepartments([]);
      await loadDepartments();
    } catch (error) {
      console.error("Error deleting departments:", error);
      toast.error("Failed to delete selected departments");
    }
  };

  const handleBulkExport = (selectedIds) => {
    const selectedDepartmentsData = transformedDepartments.filter((dept) =>
      selectedIds.includes(dept._id)
    );

    // Create CSV content
    const headers = [
      "Name",
      "Code",
      "Level",
      "Status",
      "Description",
      "Created",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedDepartmentsData.map((dept) =>
        [
          dept.departmentName,
          dept.departmentCode,
          dept.departmentLevel,
          dept.status,
          dept.description,
          formatDate(dept.createdAt),
        ].join(",")
      ),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `departments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Departments exported successfully");
  };

  const handleRowClick = (department) => {
    console.log("Department row clicked:", department);
    // Navigate to department details
  };

  const handleRowSelect = (id) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((deptId) => deptId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids) => {
    setSelectedDepartments(ids);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleExportAll = () => {
    if (!transformedDepartments.length) {
      toast.error("No departments to export");
      return;
    }

    handleBulkExport(transformedDepartments.map((dept) => dept._id));
  };

  const handleModalSuccess = () => {
    loadDepartments();
  };

  // Table columns configuration
  const columns = [
    {
      key: "departmentName",
      label: "Department Name",
      sortable: true,
      render: (value, dept) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
          >
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-gray-400">{dept.departmentCode}</div>
          </div>
        </div>
      ),
      width: "200px",
    },
    {
      key: "departmentLevel",
      label: "Level",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-300">Level {value}</span>
      ),
      width: "100px",
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      render: (value, dept) => (
        <Badge variant={dept.isActive ? "success" : "danger"}>{value}</Badge>
      ),
      width: "100px",
    },
    {
      key: "description",
      label: "Description",
      render: (value) => (
        <span className="text-sm text-gray-300 truncate max-w-xs">
          {value || "No description"}
        </span>
      ),
      width: "200px",
    },
    {
      key: "createdAt",
      label: "Created",
      type: "date",
      render: (value) => (
        <div className="text-sm text-gray-400">{formatDate(value)}</div>
      ),
      width: "120px",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value, dept) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDepartment(dept);
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
              handleEditDepartment(dept);
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
              handleDeleteDepartment(dept);
            }}
            className="p-2 hover:bg-red-500/20 text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      width: "120px",
    },
  ];

  // Filter configurations
  const filters = [
    {
      key: "isActive",
      label: "Status",
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
      ],
    },
    {
      key: "departmentLevel",
      label: "Level",
      options: [
        { value: 1, label: "Level 1" },
        { value: 2, label: "Level 2" },
        { value: 3, label: "Level 3" },
        { value: 4, label: "Level 4" },
      ],
    },
  ];

  // Action buttons configuration
  const actions = [
    {
      label: "Add Department",
      icon: Plus,
      variant: "primary",
      onClick: handleAddDepartment,
      className: `${theme.accent}`,
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
      label: "Delete Selected",
      icon: Trash2,
      onClick: (selectedIds) => handleBulkDelete(selectedIds),
      className: "text-red-400 hover:text-red-300",
    },
  ];

  // Search fields for the DataTable
  const searchFields = ["departmentName", "departmentCode", "description"];

  // Filter the departments based on active filters
  const filteredDepartments = useMemo(() => {
    if (!transformedDepartments) return [];

    return transformedDepartments.filter((dept) => {
      // Status filter
      if (
        activeFilters.isActive !== "all" &&
        dept.isActive !== activeFilters.isActive
      ) {
        return false;
      }

      // Level filter
      if (
        activeFilters.departmentLevel !== "all" &&
        dept.departmentLevel !== activeFilters.departmentLevel
      ) {
        return false;
      }

      return true;
    });
  }, [transformedDepartments, activeFilters]);

  // Calculate stats
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(
    (dept) => dept.isActive !== false
  ).length;
  const maxLevel = Math.max(
    ...departments.map((d) => d.departmentLevel || 1),
    1
  );

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Department Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Department Management
          </h1>
          <p className="text-blue-200">
            Manage company departments and their structure
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Departments"
            value={totalDepartments}
            icon={Building}
            theme="company"
          />
          <StatCard
            title="Active Departments"
            value={activeDepartments}
            icon={Users}
            theme="company"
          />
          <StatCard
            title="Department Levels"
            value={maxLevel}
            icon={Calendar}
            theme="company"
          />
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredDepartments}
          columns={columns}
          loading={loading}
          title="Department Management"
          subtitle="Manage company departments and their organizational structure"
          theme={theme}
          // Search configuration
          searchable={true}
          searchFields={searchFields}
          searchPlaceholder="Search departments by name, code, or description..."
          // Selection configuration
          selectable={true}
          selectedRows={selectedDepartments}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          // Interaction configuration
          onRowClick={handleRowClick}
          onRefresh={loadDepartments}
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
          emptyStateTitle="No departments found"
          emptyStateDescription="Get started by adding your first department to organize your company structure."
          // Row key
          rowKey="_id"
        />

        {/* Add/Edit Department Modal */}
        <AddDepartmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
          editDepartment={editingDepartment}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Department"
          message={`Are you sure you want to delete "${departmentToDelete?.departmentName}"? This action cannot be undone.`}
          type="danger"
          confirmText="Delete"
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default DepartmentManagement;
