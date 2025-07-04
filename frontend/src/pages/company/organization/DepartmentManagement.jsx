// frontend/src/pages/company/organization/DepartmentManagement.jsx

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Building, Users, Calendar } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import StatCard from '../../../components/common/StatCard.jsx';
import { OrgDataTable } from '../../../components/organization/OrgDataTable.jsx';
import { AddDepartmentModal } from '../../../components/organization/AddDepartmentModal.jsx';
import { organizationAPI } from '../../../api/organization.api.js';
import { useApi } from '../../../hooks/useApi.jsx';
import { toast } from 'react-hot-toast';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  
  const { loading, execute: fetchDepartments } = useApi(organizationAPI.getDepartments);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await fetchDepartments();
    if (data) setDepartments(data);
  };

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setShowAddModal(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setShowAddModal(true);
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      await organizationAPI.deleteDepartment(departmentId);
      toast.success('Department deleted successfully');
      await loadDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  const handleModalSuccess = () => {
    loadDepartments();
  };

  // Calculate stats
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(dept => dept.isActive !== false).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <Helmet>
        <title>Department Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Department Management</h1>
          <p className="text-blue-200">Manage company departments and their structure</p>
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
            value={Math.max(...departments.map(d => d.departmentLevel || 1), 1)}
            icon={Calendar}
            theme="company"
          />
        </div>

        {/* Department Management Table */}
        <Card theme="company" className="p-6">
          <OrgDataTable
            data={departments}
            type="departments"
            onAdd={handleAddDepartment}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
            loading={loading}
          />
        </Card>

        {/* Add/Edit Department Modal */}
        <AddDepartmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
          editDepartment={editingDepartment}
        />
      </div>
    </div>
  );
};

export default DepartmentManagement;