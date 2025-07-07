// frontend/src/pages/company/organization/DesignationManagement.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Briefcase, Award, TrendingUp } from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import StatCard from "../../../components/common/StatCard.jsx";
import { OrgDataTable } from "../../../components/organization/OrgDataTable.jsx";
import { AddDesignationModal } from "../../../components/organization/designations/AddDesignationModal.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { validateForm } from "../../../lib/validation.js";
import { toast } from "react-hot-toast";

const DesignationManagement = () => {
  const [designations, setDesignations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);

  const { loading, execute: fetchDesignations } = useApi(
    organizationAPI.getDesignations
  );

  useEffect(() => {
    loadDesignations();
  }, []);

  const loadDesignations = async () => {
    const data = await fetchDesignations();
    if (data) setDesignations(data);
  };

  const handleAddDesignation = () => {
    setEditingDesignation(null);
    setShowAddModal(true);
  };

  const handleEditDesignation = (designation) => {
    setEditingDesignation(designation);
    setShowAddModal(true);
  };

  const handleDeleteDesignation = async (designationId) => {
    try {
      await organizationAPI.deleteDesignation(designationId);
      toast.success("Designation deleted successfully");
      await loadDesignations();
    } catch (error) {
      console.error("Failed to delete designation:", error);
      toast.error("Failed to delete designation");
    }
  };

  const handleModalSuccess = () => {
    loadDesignations();
  };

  // Calculate stats
  const totalDesignations = designations.length;
  const seniorDesignations = designations.filter(
    (d) => d.level === "Advanced" || d.level === "Expert"
  ).length;
  const technicalDesignations = designations.filter(
    (d) => d.category === "Technical"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
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
            title="Total Designations"
            value={totalDesignations}
            icon={Briefcase}
            theme="company"
          />
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

        {/* Designation Management Table */}
        <Card theme="company" className="p-6">
          <OrgDataTable
            data={designations}
            type="designations"
            onAdd={handleAddDesignation}
            onEdit={handleEditDesignation}
            onDelete={handleDeleteDesignation}
            loading={loading}
          />
        </Card>

        {/* Add/Edit Designation Modal */}
        <AddDesignationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
          editDesignation={editingDesignation}
        />
      </div>
    </div>
  );
};

export default DesignationManagement;
