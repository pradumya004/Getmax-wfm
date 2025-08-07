// frontend/src/pages/company/organization/RoleManagement.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Users,
  Shield,
  Settings,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Badge } from "../../../components/ui/Badge.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import {StatCard} from "../../../components/common/StatCard.jsx";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { AddRoleModal } from "../../../components/organization/roles/AddRoleModal.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { toast } from "react-hot-toast";
import { formatDate } from "../../../lib/utils.js";

const RoleManagement = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    accessLevel: "all",
    roleLevel: "all",
    isActive: "all",
  });

  const { loading, execute: fetchRoles } = useApi(organizationAPI.getRoles);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const data = await fetchRoles();
    console.log("Roles data:", data);
    if (data && data.data) setRoles(data.data);
  };

  // Transform role data for DataTable compatibility
  const transformedRoles = useMemo(() => {
    if (!roles || !Array.isArray(roles)) return [];

    return roles.map((role) => ({
      ...role,
      roleName: role.roleName || "N/A",
      roleLevel: role.roleLevel || 1,
      accessLevel: role.accessLevel || "Viewer",
      isActive: role.isActive !== false,
      description: role.description || "No description",
      status: role.isActive !== false ? "Active" : "Inactive",
    }));
  }, [roles]);

  // Event handlers
  const handleAddRole = () => {
    setEditingRole(null);
    setShowAddModal(true);
  };

  const handleViewRole = (role) => {
    console.log("View role:", role);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowAddModal(true);
  };

  const handleDeleteRole = (role) => {
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    setIsDeleting(true);
    try {
      await organizationAPI.deleteRole(roleToDelete._id);
      toast.success("Role deleted successfully");
      setShowDeleteDialog(false);
      setRoleToDelete(null);
      await loadRoles();
    } catch (error) {
      console.error(`Failed to delete role: ${error}`);
      toast.error("Failed to delete role");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!selectedIds.length) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} role(s)?`
    );

    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) => organizationAPI.deleteRole(id))
      );
      toast.success(`${selectedIds.length} role(s) deleted successfully`);
      setSelectedRoles([]);
      await loadRoles();
    } catch (error) {
      console.error("Error deleting roles:", error);
      toast.error("Failed to delete selected roles");
    }
  };

  const handleBulkExport = (selectedIds) => {
    const selectedRolesData = transformedRoles.filter((role) =>
      selectedIds.includes(role._id)
    );

    // Create CSV content
    const headers = [
      "Name",
      "Level",
      "Access Level",
      "Status",
      "Description",
      "Created",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedRolesData.map((role) =>
        [
          role.roleName,
          role.roleLevel,
          role.accessLevel,
          role.status,
          role.description,
          formatDate(role.createdAt),
        ].join(",")
      ),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roles_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Roles exported successfully");
  };

  const handleRowClick = (role) => {
    console.log("Role row clicked:", role);
  };

  const handleRowSelect = (id) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((roleId) => roleId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids) => {
    setSelectedRoles(ids);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleExportAll = () => {
    if (!transformedRoles.length) {
      toast.error("No roles to export");
      return;
    }

    handleBulkExport(transformedRoles.map((role) => role._id));
  };

  const handleModalSuccess = () => {
    loadRoles();
  };

  // Search fields for the DataTable
  const searchFields = ["roleName", "accessLevel", "description"];

  // Filter the roles based on active filters
  const filteredRoles = useMemo(() => {
    if (!transformedRoles) return [];

    return transformedRoles.filter((role) => {
      // Access level filter
      if (
        activeFilters.accessLevel !== "all" &&
        role.accessLevel !== activeFilters.accessLevel
      ) {
        return false;
      }

      // Role level filter
      if (
        activeFilters.roleLevel !== "all" &&
        role.roleLevel !== activeFilters.roleLevel
      ) {
        return false;
      }

      // Status filter
      if (
        activeFilters.isActive !== "all" &&
        role.isActive !== activeFilters.isActive
      ) {
        return false;
      }

      return true;
    });
  }, [transformedRoles, activeFilters]);

  // Table columns configuration
  const columns = [
    {
      key: "roleName",
      label: "Role Name",
      sortable: true,
      render: (value, role) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-gray-400">Level {role.roleLevel}</div>
          </div>
        </div>
      ),
      width: "250px",
    },
    {
      key: "roleLevel",
      label: "Level",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-300">Level {value}</span>
      ),
      width: "100px",
    },
    {
      key: "accessLevel",
      label: "Access",
      type: "badge",
      render: (value) => {
        const variants = {
          Full: "success",
          Manager: "warning",
          Creator: "secondary",
          Viewer: "default",
        };
        return <Badge variant={variants[value] || "default"}>{value}</Badge>;
      },
      width: "120px",
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      render: (value, role) => (
        <Badge variant={role.isActive ? "success" : "danger"}>{value}</Badge>
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
      render: (value, role) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewRole(role);
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
              handleEditRole(role);
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
              handleDeleteRole(role);
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
      key: "accessLevel",
      label: "Access Level",
      options: [
        { value: "Full", label: "Full Access" },
        { value: "Manager", label: "Manager" },
        { value: "Creator", label: "Creator" },
        { value: "Viewer", label: "Viewer" },
      ],
    },
    {
      key: "roleLevel",
      label: "Role Level",
      options: [
        { value: 1, label: "Level 1" },
        { value: 2, label: "Level 2" },
        { value: 3, label: "Level 3" },
        { value: 4, label: "Level 4" },
        { value: 5, label: "Level 5" },
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
      label: "Add Role",
      icon: Plus,
      variant: "primary",
      onClick: handleAddRole,
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
  const totalRoles = roles.length;
  const leadershipRoles = roles.filter((role) => role.roleLevel >= 3).length;
  const activeRoles = roles.filter((role) => role.isActive !== false).length;

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Role Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Role Management
          </h1>
          <p className="text-blue-200">
            Manage company roles and their permissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Roles"
            value={totalRoles}
            icon={Users}
            theme="company"
          />
          <StatCard
            title="Leadership Roles"
            value={leadershipRoles}
            icon={Shield}
            theme="company"
          />
          <StatCard
            title="Active Roles"
            value={activeRoles}
            icon={Settings}
            theme="company"
          />
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredRoles}
          columns={columns}
          loading={loading}
          title="Role Management"
          subtitle="Manage role access and permissions across the organization"
          theme={theme}
          // Search configuration
          searchable={true}
          searchFields={searchFields}
          searchPlaceholder="Search roles by name, access level, or description..."
          // Selection configuration
          selectable={true}
          selectedRows={selectedRoles}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          // Interaction configuration
          onRowClick={handleRowClick}
          onRefresh={loadRoles}
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
          emptyStateTitle="No roles found"
          emptyStateDescription="Get started by adding your first role to define permissions and access levels."
          // Row key
          rowKey="_id"
        />

        {/* Add/Edit Role Modal */}
        <AddRoleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
          editRole={editingRole}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Role"
          message={`Are you sure you want to delete "${roleToDelete?.roleName}"? This action cannot be undone.`}
          type="danger"
          confirmText="Delete"
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default RoleManagement;
