// frontend/src/pages/company/organization/DesignationManagement.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Briefcase,
  Award,
  TrendingUp,
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
import { AddDesignationModal } from "../../../components/organization/designations/AddDesignationModal.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { toast } from "react-hot-toast";
import { formatDate } from "../../../lib/utils.js";

const DesignationManagement = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [designations, setDesignations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    level: "all",
    category: "all",
    isActive: "all",
  });

  const { loading, execute: fetchDesignations } = useApi(
    organizationAPI.getDesignations
  );

  useEffect(() => {
    loadDesignations();
  }, []);

  const loadDesignations = async () => {
    const data = await fetchDesignations();
    if (data) setDesignations(data.data);
  };

  // Transform designation data for DataTable compatibility
  const transformedDesignations = useMemo(() => {
    if (!designations || !Array.isArray(designations)) return [];

    return designations.map((designation) => ({
      ...designation,
      designationName: designation.designationName || "N/A",
      designationCode: designation.designationCode || "N/A",
      level: designation.level || "Entry",
      category: designation.category || "General",
      isActive: designation.isActive !== false,
      description: designation.description || "No description",
      status: designation.isActive !== false ? "Active" : "Inactive",
    }));
  }, [designations]);

  // Event handlers
  const handleAddDesignation = () => {
    setEditingDesignation(null);
    setShowAddModal(true);
  };

  const handleViewDesignation = (designation) => {
    console.log("View designation:", designation);
  };

  const handleEditDesignation = (designation) => {
    setEditingDesignation(designation);
    setShowAddModal(true);
  };

  const handleDeleteDesignation = (designation) => {
    setDesignationToDelete(designation);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!designationToDelete) return;

    setIsDeleting(true);
    try {
      await organizationAPI.deleteDesignation(designationToDelete._id);
      toast.success("Designation deleted successfully");
      setShowDeleteDialog(false);
      setDesignationToDelete(null);
      await loadDesignations();
    } catch (error) {
      console.error("Failed to delete designation:", error);
      toast.error("Failed to delete designation");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!selectedIds.length) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} designation(s)?`
    );

    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) => organizationAPI.deleteDesignation(id))
      );
      toast.success(
        `${selectedIds.length} designation(s) deleted successfully`
      );
      setSelectedDesignations([]);
      await loadDesignations();
    } catch (error) {
      console.error("Error deleting designations:", error);
      toast.error("Failed to delete selected designations");
    }
  };

  const handleBulkExport = (selectedIds) => {
    const selectedDesignationsData = transformedDesignations.filter(
      (designation) => selectedIds.includes(designation._id)
    );

    // Create CSV content
    const headers = [
      "Name",
      "Code",
      "Level",
      "Category",
      "Status",
      "Description",
      "Created",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedDesignationsData.map((designation) =>
        [
          designation.designationName,
          designation.designationCode,
          designation.level,
          designation.category,
          designation.status,
          designation.description,
          formatDate(designation.createdAt),
        ].join(",")
      ),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `designations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Designations exported successfully");
  };

  const handleRowClick = (designation) => {
    console.log("Designation row clicked:", designation);
  };

  const handleRowSelect = (id) => {
    setSelectedDesignations((prev) =>
      prev.includes(id)
        ? prev.filter((designationId) => designationId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (ids) => {
    setSelectedDesignations(ids);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleExportAll = () => {
    if (!transformedDesignations.length) {
      toast.error("No designations to export");
      return;
    }

    handleBulkExport(
      transformedDesignations.map((designation) => designation._id)
    );
  };

  const handleModalSuccess = () => {
    loadDesignations();
  };

  // Search fields for the DataTable
  const searchFields = [
    "designationName",
    "designationCode",
    "level",
    "category",
    "description",
  ];

  // Filter the designations based on active filters
  const filteredDesignations = useMemo(() => {
    if (!transformedDesignations) return [];

    return transformedDesignations.filter((designation) => {
      // Level filter
      if (
        activeFilters.level !== "all" &&
        designation.level !== activeFilters.level
      ) {
        return false;
      }

      // Category filter
      if (
        activeFilters.category !== "all" &&
        designation.category !== activeFilters.category
      ) {
        return false;
      }

      // Status filter
      if (
        activeFilters.isActive !== "all" &&
        designation.isActive !== activeFilters.isActive
      ) {
        return false;
      }

      return true;
    });
  }, [transformedDesignations, activeFilters]);

  // Table columns configuration
  const columns = [
    {
      key: "designationName",
      label: "Designation Name",
      sortable: true,
      render: (value, designation) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
          >
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-gray-400">
              {designation.designationCode}
            </div>
          </div>
        </div>
      ),
      width: "200px",
    },
    {
      key: "level",
      label: "Level",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-300">Level {value}</span>
      ),
      width: "100px",
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-300">{value}</span>,
      width: "150px",
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      render: (value, designation) => (
        <Badge variant={designation.isActive ? "success" : "danger"}>
          {value}
        </Badge>
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
      render: (value, designation) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDesignation(designation);
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
              handleEditDesignation(designation);
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
              handleDeleteDesignation(designation);
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
      key: "level",
      label: "Level",
      options: [
        { value: "Entry", label: "Entry" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
        { value: "Expert", label: "Expert" },
      ],
    },
    {
      key: "category",
      label: "Category",
      options: [
        { value: "Technical", label: "Technical" },
        { value: "Management", label: "Management" },
        { value: "Sales", label: "Sales" },
        { value: "Marketing", label: "Marketing" },
        { value: "HR", label: "HR" },
        { value: "Finance", label: "Finance" },
        { value: "Operations", label: "Operations" },
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
      label: "Add Designation",
      icon: Plus,
      variant: "primary",
      onClick: handleAddDesignation,
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
  const totalDesignations = designations.length;
  const seniorDesignations = designations.filter(
    (d) => d.level === "Advanced" || d.level === "Expert"
  ).length;
  const technicalDesignations = designations.filter(
    (d) => d.category === "Technical"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Designation Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Designation Management
          </h1>
          <p className="text-blue-200">
            Manage job designations and career levels
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Senior Positions"
            value={seniorDesignations}
            icon={Award}
            theme="company"
          />
          <StatCard
            title="Technical Roles"
            value={technicalDesignations}
            icon={TrendingUp}
            theme="company"
          />
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredDesignations}
          columns={columns}
          loading={loading}
          title="Designation Management"
          subtitle="Manage job designations and career progression paths"
          theme={theme}
          // Search configuration
          searchable={true}
          searchFields={searchFields}
          searchPlaceholder="Search designations by name, code, level, or category..."
          // Selection configuration
          selectable={true}
          selectedRows={selectedDesignations}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          // Interaction configuration
          onRowClick={handleRowClick}
          onRefresh={loadDesignations}
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
          emptyStateTitle="No designations found"
          emptyStateDescription="Get started by adding your first designation to define career paths."
          // Row key
          rowKey="_id"
        />

        {/* Add/Edit Designation Modal */}
        <AddDesignationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
          editDesignation={editingDesignation}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Designation"
          message={`Are you sure you want to delete "${designationToDelete?.designationName}"? This action cannot be undone.`}
          type="danger"
          confirmText="Delete"
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default DesignationManagement;
