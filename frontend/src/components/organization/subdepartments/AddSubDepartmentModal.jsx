// frontend/src/components/organization/subdepartments/AddSubDepartmentModal.jsx

import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/Modal.jsx";
import { Button } from "../../ui/Button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Select } from "../../ui/Select.jsx";
import { validateForm } from "../../../lib/validation.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useOrganization } from "../../../hooks/useOrganization.jsx";

export const AddSubDepartmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  editSubDepartment = null,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { addSubDepartment, updateSubDepartment, orgData } = useOrganization();

  const [formData, setFormData] = useState({
    subdepartmentName: editSubDepartment?.subdepartmentName || "",
    subdepartmentCode: editSubDepartment?.subdepartmentCode || "",
    departmentRef: editSubDepartment?.departmentRef?._id || "",
    functionType: editSubDepartment?.functionType || "Technical",
    teamSize: editSubDepartment?.teamSize || 0,
    teamLead: editSubDepartment?.teamLead || "",
    description: editSubDepartment?.description || "",
    isActive:
      editSubDepartment?.isActive !== undefined
        ? editSubDepartment.isActive
        : true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editSubDepartment) {
      setFormData({
        subdepartmentName: editSubDepartment.subdepartmentName || "",
        subdepartmentCode: editSubDepartment.subdepartmentCode || "",
        departmentRef: editSubDepartment.departmentRef?._id || "",
        functionType: editSubDepartment.functionType || "Technical",
        teamSize: editSubDepartment.teamSize || 0,
        teamLead: editSubDepartment.teamLead || "",
        description: editSubDepartment.description || "",
        isActive:
          editSubDepartment.isActive !== undefined
            ? editSubDepartment.isActive
            : true,
      });
    } else {
      setFormData({
        subdepartmentName: "",
        subdepartmentCode: "",
        departmentRef: "",
        functionType: "Technical",
        teamSize: 0,
        teamLead: "",
        description: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [editSubDepartment, isOpen]);

  const rules = {
    subdepartmentName: { required: true, label: "Sub-Department Name" },
    subdepartmentCode: { required: true, label: "Sub-Department Code" },
    departmentRef: { required: true, label: "Parent Department" },
    functionType: { required: true, label: "Function Type" },
  };

  const functionTypeOptions = [
    { value: "Technical", label: "Technical" },
    { value: "Operational", label: "Operational" },
    { value: "Administrative", label: "Administrative" },
    { value: "Support", label: "Support" },
    { value: "Research", label: "Research" },
    { value: "Quality", label: "Quality" },
  ];

  // Convert departments to options
  const departmentOptions = orgData.departments.map((dept) => ({
    value: dept._id,
    label: `${dept.departmentName} (${dept.departmentCode})`,
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
      let result;
      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Failed to save sub-department:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editSubDepartment ? "Edit Sub-Department" : "Add New Sub-Department"
      }
      size="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Sub-Department Name"
            value={formData.subdepartmentName}
            onChange={(e) =>
              handleInputChange("subdepartmentName", e.target.value)
            }
            error={errors.subdepartmentName}
            theme={userType}
            placeholder="e.g., Frontend Development"
          />

          <Input
            label="Sub-Department Code"
            value={formData.subdepartmentCode}
            onChange={(e) =>
              handleInputChange(
                "subdepartmentCode",
                e.target.value.toUpperCase()
              )
            }
            error={errors.subdepartmentCode}
            theme={userType}
            placeholder="e.g., FE"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Parent Department"
            value={formData.departmentRef}
            onChange={(e) => handleInputChange("departmentRef", e.target.value)}
            options={departmentOptions}
            error={errors.departmentRef}
            theme={userType}
            placeholder="Select department"
          />

          <Select
            label="Function Type"
            value={formData.functionType}
            onChange={(e) => handleInputChange("functionType", e.target.value)}
            options={functionTypeOptions}
            error={errors.functionType}
            theme={userType}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Team Size"
            type="number"
            value={formData.teamSize}
            onChange={(e) =>
              handleInputChange("teamSize", parseInt(e.target.value) || 0)
            }
            theme={userType}
            placeholder="Number of team members"
          />

          <Input
            label="Team Lead"
            value={formData.teamLead}
            onChange={(e) => handleInputChange("teamLead", e.target.value)}
            theme={userType}
            placeholder="Team lead name"
          />
        </div>

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          theme={userType}
          placeholder="Brief description of the sub-department"
          as="textarea"
          rows={3}
        />

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-700"
          >
            Active Sub-Department
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            theme={userType}
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
