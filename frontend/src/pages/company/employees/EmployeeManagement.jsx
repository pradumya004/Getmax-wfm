// frontend/src/pages/company/employees/EmployeeManagement.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Plus, Upload, Users, UserCheck, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../components/common/StatCard.jsx";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { AddEmployeeModal } from "../../../components/company/AddEmployeeModal.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";
import { useEmployees } from "../../../hooks/useEmployee.jsx";
import { employeeAPI } from "../../../api/employee.api.js";
import { formatDate, getInitials } from "../../../lib/utils.js";
import { toast } from "react-hot-toast";

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const { employees, loading, refresh } = useEmployees();
  const [showAddModal, setShowAddModal] = useState(false);
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState(null);

  const handleDeactivateEmployee = async () => {
    if (employeeToDeactivate) {
      try {
        await employeeAPI.deactivateEmployee(employeeToDeactivate.employeeId);
        toast.success("Employee deactivated successfully");
        await refresh();
        setEmployeeToDeactivate(null);
      } catch (error) {
        console.error("Failed to deactivate employee:", error);
        setEmployeeToDeactivate(null);
        toast.error("Failed to deactivate employee");
      }
    }
  };

  console.log("Employees:", employees);
  

// Calculate stats
  const totalEmployees = employees?.length;
  console.log("Total Employees:", totalEmployees);
  
  const activeEmployees = employees.filter(
    (emp) => emp.systemInfo?.isActive
  ).length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  const columns = [
    {
      key: "name",
      label: "Employee",
      render: (_, employee) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xs">
              {getInitials(
                `${employee.personalInfo?.firstName} ${employee.personalInfo?.lastName}`
              )}
            </span>
          </div>
          <div>
            <div className="text-white font-medium">
              {employee.personalInfo?.firstName}{" "}
              {employee.personalInfo?.lastName}
            </div>
            <div className="text-gray-400 text-sm">{employee.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (_, employee) => (
        <span className="text-gray-300">
          {employee.contactInfo?.primaryEmail}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (_, employee) => (
        <span className="text-blue-400">
          {employee.roleRef?.roleName || "N/A"}
        </span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (_, employee) => (
        <span className="text-purple-400">
          {employee.departmentRef?.departmentName || "N/A"}
        </span>
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (_, employee) => (
        <span className="text-gray-300">
          {formatDate(employee.employmentInfo?.dateOfJoining, "short")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      render: (_, employee) => (
        <Badge status={employee.systemInfo?.isActive ? "active" : "inactive"}>
          {employee.systemInfo?.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const actions = (employee) => (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        onClick={() => navigate(`/company/employees/${employee.employeeId}`)}
        className="p-2 hover:bg-blue-500/20"
      >
        View
      </Button>
      <Button
        variant="ghost"
        onClick={() => setEmployeeToDeactivate(employee)}
        className="p-2 hover:bg-red-500/20 text-red-400"
        disabled={!employee.systemInfo?.isActive}
      >
        {employee.systemInfo?.isActive ? "Deactivate" : "Inactive"}
      </Button>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br p-6`}>
      <Helmet>
        <title>Employee Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Employee Management
            </h1>
            <p className="text-blue-200">Manage your company employees</p>
          </div>

          <div className="flex space-x-3">
            <Button
              theme="company"
              variant="outline"
              onClick={() => navigate("/company/employees/bulk")}
              className="inline-flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Bulk Upload</span>
            </Button>
            <Button
              theme="company"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Employee Table */}
        <DataTable
          data={employees}
          columns={columns}
          searchFields={[
            "personalInfo.firstName",
            "personalInfo.lastName",
            "contactInfo.primaryEmail",
            "employeeId",
          ]}
          theme="company"
          title="All Employees"
          actions={actions}
          loading={loading}
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
          onConfirm={handleDeactivateEmployee}
          title="Deactivate Employee"
          message={`Are you sure you want to deactivate ${employeeToDeactivate?.personalInfo?.firstName} ${employeeToDeactivate?.personalInfo?.lastName}? They will lose access to the system.`}
          type="warning"
          confirmText="Deactivate"
        />
      </div>
    </div>
  );
};

export default EmployeeManagement;
