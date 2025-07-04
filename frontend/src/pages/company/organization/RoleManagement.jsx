// frontend/src/pages/company/organization/RoleManagement.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Users, Shield, Settings } from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import StatCard from "../../../components/common/StatCard.jsx";
import { OrgDataTable } from "../../../components/organization/OrgDataTable.jsx";
import { AddRoleModal } from "../../../components/organization/AddRoleModal.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { toast } from "react-hot-toast";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const { loading, execute: fetchRoles } = useApi(organizationAPI.getRoles);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const data = await fetchRoles();
    if (data) setRoles(data);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setShowAddModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowAddModal(true);
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await organizationAPI.deleteRole(roleId);
      toast.success("Role deleted successfully");
      await loadRoles();
    } catch (error) {
      console.error(`Failed to delete role: ${error}`);
      toast.error("Failed to delete role");
    }
  };

  const handleModalSuccess = () => {
    loadRoles();
  };

  // Calculate stats
  const totalRoles = roles.length;
  const leadershipRoles = roles.filter((role) => role.roleLevel >= 3).length;
  const activeRoles = roles.filter((role) => role.isActive !== false).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
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

        {/* Role Management Table */}
        <Card theme="company" className="p-6">
          <OrgDataTable
            data={roles}
            type="roles"
            onAdd={handleAddRole}
            onEdit={handleEditRole}
            onDelete={handleDeleteRole}
            loading={loading}
          />
        </Card>

        {/* Add/Edit Role Modal */}
        <AddRoleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
          editRole={editingRole}
        />
      </div>
    </div>
  );
};

export default RoleManagement;
