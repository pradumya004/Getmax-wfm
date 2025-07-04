// frontend/src/pages/company/organization/SubDepartmentManagement.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Users, Building, Layers } from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import StatCard from "../../../components/common/StatCard.jsx";
import { OrgDataTable } from "../../../components/organization/OrgDataTable.jsx";
import { AddSubDepartmentModal } from "../../../components/organization/AddSubDepartmentModal.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { toast } from "react-hot-toast";

const SubDepartmentManagement = () => {
  const [subdepartments, setSubDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubDepartment, setEditingSubDepartment] = useState(null);

  const { loading, execute: fetchSubDepartments } = useApi(
    organizationAPI.getSubDepartments
  );

  useEffect(() => {
    loadSubDepartments();
  }, []);

  const loadSubDepartments = async () => {
    const data = await fetchSubDepartments();
    if (data) setSubDepartments(data);
  };

  const handleAddSubDepartment = () => {
    setEditingSubDepartment(null);
    setShowAddModal(true);
  };

  const handleEditSubDepartment = (subdepartment) => {
    setEditingSubDepartment(subdepartment);
    setShowAddModal(true);
  };

  const handleDeleteSubDepartment = async (subdepartmentId) => {
    try {
      await organizationAPI.deleteSubDepartment(subdepartmentId);
      toast.success("Sub-department deleted successfully");
      await loadSubDepartments();
    } catch (error) {
      toast.error("Failed to delete sub-department");
    }
  };

  const handleModalSuccess = () => {
    loadSubDepartments();
  };

  // Calculate stats
  const totalSubDepartments = subdepartments.length;
  const technicalSubDepartments = subdepartments.filter(
    (sd) => sd.functionType === "Technical"
  ).length;
  const operationalSubDepartments = subdepartments.filter(
    (sd) => sd.functionType === "Operational"
  ).length;

  // Custom columns for subdepartments
  const columns = [
    { key: "subdepartmentName", label: "Sub-Department Name" },
    { key: "subdepartmentCode", label: "Code" },
    {
      key: "departmentRef",
      label: "Parent Department",
      render: (_, subdept) => (
        <span className="text-blue-400">
          {subdept.departmentRef?.departmentName || "N/A"}
        </span>
      ),
    },
    { key: "functionType", label: "Function Type" },
    { key: "description", label: "Description" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
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

        {/* Sub-Department Management */}
        <Card theme="company" className="p-6">
          <div className="mb-6">
            <Button
              onClick={handleAddSubDepartment}
              theme="company"
              className="inline-flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Add Sub-Department</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left py-3 px-4 text-gray-300 font-medium"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="text-right py-3 px-4 text-gray-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subdepartments.map((subdept, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-4">
                        {column.render ? (
                          column.render(subdept[column.key], subdept)
                        ) : (
                          <span className="text-gray-300">
                            {subdept[column.key] || "N/A"}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="ghost"
                          onClick={() => handleEditSubDepartment(subdept)}
                          className="p-2 hover:bg-blue-500/20"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteSubDepartment(subdept._id)}
                          className="p-2 hover:bg-red-500/20 text-red-400"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          )}
        </Card>

        {/* Add/Edit Sub-Department Modal */}
        <AddSubDepartmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
          editSubDepartment={editingSubDepartment}
        />
      </div>
    </div>
  );
};

export default SubDepartmentManagement;