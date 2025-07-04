// frontend/src/components/organization/AddSubDepartmentModal.jsx

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { validateForm } from "../../lib/validation.js";
import { organizationAPI } from "../../api/organization.api.js";
import { useOrganization } from "../../hooks/useOrganization.jsx";
import { toast } from "react-hot-toast";

export const AddSubDepartmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  editSubDepartment = null,
}) => {
  const [formData, setFormData] = useState({
    subdepartmentName: editSubDepartment?.subdepartmentName || "",
    subdepartmentCode: editSubDepartment?.subdepartmentCode || "",
    departmentRef: editSubDepartment?.departmentRef || "",
    description: editSubDepartment?.description || "",
    functionType: editSubDepartment?.functionType || "Operational",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { orgData } = useOrganization();

  const rules = {
    subdepartmentName: { required: true, label: "Sub-Department Name" },
    subdepartmentCode: { required: true, label: "Sub-Department Code" },
    departmentRef: { required: true, label: "Department" },
  };

  const functionTypeOptions = [
    { value: "Operational", label: "Operational" },
    { value: "Support", label: "Support" },
    { value: "Administrative", label: "Administrative" },
    { value: "Technical", label: "Technical" },
    { value: "Quality", label: "Quality" },
    { value: "Training", label: "Training" },
  ];

  const departmentOptions = orgData.departments.map((dept) => ({
    value: dept._id,
    label: dept.departmentName,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      if (editSubDepartment) {
        await organizationAPI.updateSubDepartment(
          editSubDepartment._id,
          formData
        );
        toast.success("Sub-department updated successfully");
      } else {
        await organizationAPI.createSubDepartment(formData);
        toast.success("Sub-department created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save sub-department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editSubDepartment ? "Edit Sub-Department" : "Add New Sub-Department"
      }
      size="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Sub-Department Name"
          value={formData.subdepartmentName}
          onChange={(e) =>
            setFormData({ ...formData, subdepartmentName: e.target.value })
          }
          error={errors.subdepartmentName}
          theme="company"
        />

        <Input
          label="Sub-Department Code"
          value={formData.subdepartmentCode}
          onChange={(e) =>
            setFormData({
              ...formData,
              subdepartmentCode: e.target.value.toUpperCase(),
            })
          }
          error={errors.subdepartmentCode}
          theme="company"
          placeholder="e.g., DEV-FE, HR-REC"
        />

        <Select
          label="Parent Department"
          value={formData.departmentRef}
          onChange={(e) =>
            setFormData({ ...formData, departmentRef: e.target.value })
          }
          options={departmentOptions}
          error={errors.departmentRef}
        />

        <Select
          label="Function Type"
          value={formData.functionType}
          onChange={(e) =>
            setFormData({ ...formData, functionType: e.target.value })
          }
          options={functionTypeOptions}
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          theme="company"
          placeholder="Brief description of the sub-department"
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            theme="company"
            loading={loading}
            className="flex-1"
          >
            {editSubDepartment
              ? "Update Sub-Department"
              : "Create Sub-Department"}
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