// frontend/src/pages/company/organization/SubDepartmentManagement.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Users,
  Building,
  Layers,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import {StatCard} from "../../../components/common/StatCard.jsx";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { AddSubDepartmentModal } from "../../../components/organization/subdepartments/AddSubDepartmentModal.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { toast } from "react-hot-toast";
import { formatDate } from "../../../lib/utils.js";

const SubDepartmentManagement = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [subdepartments, setSubDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubDepartment, setEditingSubDepartment] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subdepartmentToDelete, setSubdepartmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSubDepartments, setSelectedSubDepartments] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    functionType: "all",
    isActive: "all",
    departmentRef: "all",
  });

  const { loading, execute: fetchSubDepartments } = useApi(
    organizationAPI.getSubDepartments
  );

  useEffect(() => {
    loadSubDepartments();
  }, []);

  const loadSubDepartments = async () => {
    const data = await fetchSubDepartments();
    if (data) setSubDepartments(data.data);
  };

  // Transform subdepartment data for DataTable compatibility
  const transformedSubDepartments = useMemo(() => {
    if (!subdepartments || !Array.isArray(subdepartments)) return [];

    return subdepartments.map((subdept) => ({
      ...subdept,
      subdepartmentName: subdept.subdepartmentName || "N/A",
      subdepartmentCode: subdept.subdepartmentCode || "N/A",
      functionType: subdept.functionType || "General",
      isActive: subdept.isActive !== false,
      description: subdept.description || "No description",
      status: subdept.isActive !== false ? "Active" : "Inactive",
      parentDepartment: subdept.departmentRef?.departmentName || "N/A",
    }));
  }, [subdepartments]);

  // Event handlers
  const handleAddSubDepartment = () => {
    setEditingSubDepartment(null);
    setShowAddModal(true);
  };

  const handleViewSubDepartment = (subdepartment) => {
    console.log("View sub-department:", subdepartment);
  };

  const handleEditSubDepartment = (subdepartment) => {
    setEditingSubDepartment(subdepartment);
    setShowAddModal(true);
  };

  const handleDeleteSubDepartment = (subdepartment) => {
    setSubdepartmentToDelete(subdepartment);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!subdepartmentToDelete) return;

    setIsDeleting(true);
    try {
      await organizationAPI.deleteSubDepartment(subdepartmentToDelete._id);
      toast.success("Sub-department deleted successfully");
      setShowDeleteDialog(false);
      setSubdepartmentToDelete(null);
      await loadSubDepartments();
    } catch (error) {
      console.error("Error deleting sub-department:", error);
      toast.error("Failed to delete sub-department");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!selectedIds.length) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} sub-department(s)?`
    );

    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) => organizationAPI.deleteSubDepartment(id))
      );
      toast.success(
        `${selectedIds.length} sub-department(s) deleted successfully`
      );
      setSelectedSubDepartments([]);
      await loadSubDepartments();
    } catch (error) {
      console.error("Error deleting sub-departments:", error);
      toast.error("Failed to delete selected sub-departments");
    }
  };

  const handleBulkExport = (selectedIds) => {
    const selectedSubDepartmentsData = transformedSubDepartments.filter(
      (subdept) => selectedIds.includes(subdept._id)
    );

    // Create CSV content
    const headers = [
      "Name",
      "Code",
      "Parent Department",
      "Function Type",
      "Status",
      "Description",
      "Created",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedSubDepartmentsData.map((subdept) =>
        [
          subdept.subdepartmentName,
          subdept.subdepartmentCode,
          subdept.parentDepartment,
          subdept.functionType,
          subdept.status,
          subdept.description,
          formatDate(subdept.createdAt),
        ].join(",")
      ),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subdepartments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Sub-departments exported successfully");
  };

  const handleRowClick = (subdepartment) => {
    console.log("Sub-department row clicked:", subdepartment);
  };

  const handleRowSelect = (id) => {
    setSelectedSubDepartments((prev) =>
      prev.includes(id)
        ? prev.filter((subdeptId) => subdeptId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (ids) => {
    setSelectedSubDepartments(ids);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleExportAll = () => {
    if (!transformedSubDepartments.length) {
      toast.error("No sub-departments to export");
      return;
    }

    handleBulkExport(transformedSubDepartments.map((subdept) => subdept._id));
  };

  const handleModalSuccess = () => {
    loadSubDepartments();
  };

  // Search fields for the DataTable
  const searchFields = [
    "subdepartmentName",
    "subdepartmentCode",
    "functionType",
    "description",
    "parentDepartment",
  ];

  // Filter the sub-departments based on active filters
  const filteredSubDepartments = useMemo(() => {
    if (!transformedSubDepartments) return [];

    return transformedSubDepartments.filter((subdept) => {
      // Function type filter
      if (
        activeFilters.functionType !== "all" &&
        subdept.functionType !== activeFilters.functionType
      ) {
        return false;
      }

      // Status filter
      if (
        activeFilters.isActive !== "all" &&
        subdept.isActive !== activeFilters.isActive
      ) {
        return false;
      }

      return true;
    });
  }, [transformedSubDepartments, activeFilters]);

  // Table columns configuration
  const columns = [
    {
      key: "subdepartmentName",
      label: "Sub-Department Name",
      sortable: true,
      render: (value, subdept) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
          >
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-gray-400">
              {subdept.subdepartmentCode}
            </div>
          </div>
        </div>
      ),
      width: "250px",
    },
    {
      key: "parentDepartment",
      label: "Parent Department",
      sortable: true,
      render: (value) => <span className="text-blue-400">{value}</span>,
      width: "200px",
    },
    {
      key: "functionType",
      label: "Function Type",
      sortable: true,
      render: (value) => {
        const functionVariants = {
          Technical: "primary",
          Operational: "warning",
          Administrative: "secondary",
          Support: "default",
          General: "default",
        };
        return (
          <Badge variant={functionVariants[value] || "default"}>{value}</Badge>
        );
      },
      width: "150px",
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      render: (value, subdept) => (
        <Badge variant={subdept.isActive ? "success" : "danger"}>{value}</Badge>
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
      render: (value, subdept) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewSubDepartment(subdept);
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
              handleEditSubDepartment(subdept);
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
              handleDeleteSubDepartment(subdept);
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
      key: "functionType",
      label: "Function Type",
      options: [
        { value: "Technical", label: "Technical" },
        { value: "Operational", label: "Operational" },
        { value: "Administrative", label: "Administrative" },
        { value: "Support", label: "Support" },
        { value: "General", label: "General" },
      ],
    },
    {
      key: "isActive",
      label: "Status",
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
      ],
    },
  ];

  // Action buttons configuration
  const actions = [
    {
      label: "Add Sub-Department",
      icon: Plus,
      variant: "primary",
      onClick: handleAddSubDepartment,
      className: "bg-blue-600 hover:bg-blue-700",
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

  // Calculate stats
  const totalSubDepartments = subdepartments.length;
  const technicalSubDepartments = subdepartments.filter(
    (sd) => sd.functionType === "Technical"
  ).length;
  const operationalSubDepartments = subdepartments.filter(
    (sd) => sd.functionType === "Operational"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Sub-Department Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Sub-Department Management
          </h1>
          <p className="text-blue-200">
            Manage teams and units within departments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Sub-Departments"
            value={totalSubDepartments}
            icon={Layers}
            theme="company"
          />
          <StatCard
            title="Technical Units"
            value={technicalSubDepartments}
            icon={Building}
            theme="company"
          />
          <StatCard
            title="Operational Units"
            value={operationalSubDepartments}
            icon={Users}
            theme="company"
          />
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredSubDepartments}
          columns={columns}
          loading={loading}
          title="Sub-Department Management"
          subtitle="Manage teams and units within your organizational departments"
          theme={theme}
          // Search configuration
          searchable={true}
          searchFields={searchFields}
          searchPlaceholder="Search sub-departments by name, code, function type, or description..."
          // Selection configuration
          selectable={true}
          selectedRows={selectedSubDepartments}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          // Interaction configuration
          onRowClick={handleRowClick}
          onRefresh={loadSubDepartments}
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
          emptyStateTitle="No sub-departments found"
          emptyStateDescription="Get started by adding your first sub-department to organize teams within departments."
          // Row key
          rowKey="_id"
        />

        {/* Add/Edit Sub-Department Modal */}
        <AddSubDepartmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
          editSubDepartment={editingSubDepartment}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Sub-Department"
          message={`Are you sure you want to delete "${subdepartmentToDelete?.subdepartmentName}"? This action cannot be undone.`}
          type="danger"
          confirmText="Delete"
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default SubDepartmentManagement;
