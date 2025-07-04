// frontend/src/components/organization/AddRoleModal.jsx

import React, { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { validateForm } from "../../lib/validation.js";
import { organizationAPI } from "../../api/organization.api.js";
import { toast } from "react-hot-toast";

export const AddRoleModal = ({
  isOpen,
  onClose,
  onSuccess,
  editRole = null,
}) => {
  const [formData, setFormData] = useState({
    roleName: editRole?.roleName || "",
    roleCode: editRole?.roleCode || "",
    roleLevel: editRole?.roleLevel || "",
    description: editRole?.description || "",
    department: editRole?.department || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const rules = {
    roleName: { required: true, label: "Role Name" },
    roleCode: { required: true, label: "Role Code" },
    roleLevel: { required: true, label: "Role Level" },
  };

  const roleLevels = [
    { value: "1", label: "Level 1 - Individual Contributor" },
    { value: "2", label: "Level 2 - Senior Individual Contributor" },
    { value: "3", label: "Level 3 - Team Lead" },
    { value: "4", label: "Level 4 - Manager" },
    { value: "5", label: "Level 5 - Senior Manager" },
    { value: "6", label: "Level 6 - Director" },
    { value: "7", label: "Level 7 - VP" },
    { value: "8", label: "Level 8 - C-Level" },
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
      if (editRole) {
        await organizationAPI.updateRole(editRole._id, formData);
        toast.success("Role updated successfully");
      } else {
        await organizationAPI.createRole(formData);
        toast.success("Role created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save role:", error);
      toast.error("Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editRole ? "Edit Role" : "Add New Role"}
      size="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Role Name"
          value={formData.roleName}
          onChange={(e) =>
            setFormData({ ...formData, roleName: e.target.value })
          }
          error={errors.roleName}
          theme="company"
        />

        <Input
          label="Role Code"
          value={formData.roleCode}
          onChange={(e) =>
            setFormData({ ...formData, roleCode: e.target.value.toUpperCase() })
          }
          error={errors.roleCode}
          theme="company"
          placeholder="e.g., DEV, MGR, TL"
        />

        <Select
          label="Role Level"
          value={formData.roleLevel}
          onChange={(e) =>
            setFormData({ ...formData, roleLevel: e.target.value })
          }
          options={roleLevels}
          error={errors.roleLevel}
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          theme="company"
          placeholder="Brief description of the role"
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            theme="company"
            loading={loading}
            className="flex-1"
          >
            {editRole ? "Update Role" : "Create Role"}
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
