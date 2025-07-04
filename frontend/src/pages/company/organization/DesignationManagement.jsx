// frontend/src/pages/company/organization/DesignationManagement.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Briefcase, Award, TrendingUp } from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import StatCard from "../../../components/common/StatCard.jsx";
import { OrgDataTable } from "../../../components/organization/OrgDataTable.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { validateForm } from "../../../lib/validation.js";
import { toast } from "react-hot-toast";

const AddDesignationModal = ({
  isOpen,
  onClose,
  onSuccess,
  editDesignation = null,
}) => {
  const [formData, setFormData] = useState({
    designationName: editDesignation?.designationName || "",
    designationCode: editDesignation?.designationCode || "",
    level: editDesignation?.level || "Intermediate",
    category: editDesignation?.category || "Technical",
    description: editDesignation?.description || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const rules = {
    designationName: { required: true, label: "Designation Name" },
    designationCode: { required: true, label: "Designation Code" },
  };

  const levelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "Expert", label: "Expert" },
  ];

  const categoryOptions = [
    { value: "Technical", label: "Technical" },
    { value: "Management", label: "Management" },
    { value: "Sales", label: "Sales" },
    { value: "Marketing", label: "Marketing" },
    { value: "Operations", label: "Operations" },
    { value: "Support", label: "Support" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      if (editDesignation) {
        await organizationAPI.updateDesignation(editDesignation._id, formData);
        toast.success("Designation updated successfully");
      } else {
        await organizationAPI.createDesignation(formData);
        toast.success("Designation created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save designation:", error);
      toast.error("Failed to save designation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDesignation ? "Edit Designation" : "Add New Designation"}
      size="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Designation Name"
          value={formData.designationName}
          onChange={(e) =>
            setFormData({ ...formData, designationName: e.target.value })
          }
          error={errors.designationName}
          theme="company"
        />

        <Input
          label="Designation Code"
          value={formData.designationCode}
          onChange={(e) =>
            setFormData({
              ...formData,
              designationCode: e.target.value.toUpperCase(),
            })
          }
          error={errors.designationCode}
          theme="company"
          placeholder="e.g., SE, SM, TL"
        />

        <Select
          label="Level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          options={levelOptions}
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          options={categoryOptions}
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          theme="company"
          placeholder="Brief description of the designation"
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            theme="company"
            loading={loading}
            className="flex-1"
          >
            {editDesignation ? "Update Designation" : "Create Designation"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

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
