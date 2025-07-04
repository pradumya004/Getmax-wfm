// frontend/src/components/organization/AddDepartmentModal.jsx

import React, { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { validateForm } from "../../lib/validation.js";
import { organizationAPI } from "../../api/organization.api.js";
import { toast } from "react-hot-toast";

export const AddDepartmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  editDepartment = null,
}) => {
  const [formData, setFormData] = useState({
    departmentName: editDepartment?.departmentName || "",
    departmentCode: editDepartment?.departmentCode || "",
    description: editDepartment?.description || "",
    costCenter: editDepartment?.costCenter || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const rules = {
    departmentName: { required: true, label: "Department Name" },
    departmentCode: { required: true, label: "Department Code" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      if (editDepartment) {
        await organizationAPI.updateDepartment(editDepartment._id, formData);
        toast.success("Department updated successfully");
      } else {
        await organizationAPI.createDepartment(formData);
        toast.success("Department created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDepartment ? "Edit Department" : "Add New Department"}
      size="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Department Name"
          value={formData.departmentName}
          onChange={(e) =>
            setFormData({ ...formData, departmentName: e.target.value })
          }
          error={errors.departmentName}
          theme="company"
        />

        <Input
          label="Department Code"
          value={formData.departmentCode}
          onChange={(e) =>
            setFormData({
              ...formData,
              departmentCode: e.target.value.toUpperCase(),
            })
          }
          error={errors.departmentCode}
          theme="company"
          placeholder="e.g., IT, HR, FIN"
        />

        <Input
          label="Cost Center"
          value={formData.costCenter}
          onChange={(e) =>
            setFormData({ ...formData, costCenter: e.target.value })
          }
          theme="company"
          placeholder="Optional cost center code"
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          theme="company"
          placeholder="Brief description of the department"
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            theme="company"
            loading={loading}
            className="flex-1"
          >
            {editDepartment ? "Update Department" : "Create Department"}
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