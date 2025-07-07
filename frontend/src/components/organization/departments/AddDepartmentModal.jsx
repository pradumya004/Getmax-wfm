// frontend/src/components/organization/departments/AddDepartmentModal.jsx

import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/Modal.jsx";
import { Button } from "../../ui/Button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Select } from "../../ui/Select.jsx";
import { Checkbox } from "../../ui/Checkbox.jsx";
import { CustomCreatableSelect } from "../../ui/CreatableSelect.jsx";
import {
  useOrganization,
  useOrganizationEnums,
} from "../../../hooks/useOrganization.jsx";
import { useEmployees } from "../../../hooks/useEmployee.jsx";
import { validateForm } from "../../../lib/validation.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { toast } from "react-hot-toast";

export const AddDepartmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  editDepartment = null,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { addDepartment, updateDepartment, orgData } = useOrganization();
  const {
    enums,
    loading: enumsLoading,
    refresh,
    getDepartmentLevelOptions,
    currencyOptions,
    // timeZoneOptions,
  } = useOrganizationEnums();
  const { employees } = useEmployees();

  console.log("Employees:", employees);
  

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    departmentDescription: "",
    parentDepartment: "",
    departmentLevel: 1,
    departmentPath: "",
    departmentHead: "",
    assistantHead: "",
    functionType: "",
    costCenter: "",
    budget: {
      allocated: 0,
      currency: "INR",
    },
    currentEmployeeCount: 0,
    allowSubdepartments: false,
    requireApproval: false,
    isActive: true,
    isSystemDefault: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editDepartment) {
      setFormData({
        departmentName: editDepartment.departmentName || "",
        departmentCode: editDepartment.departmentCode || "",
        departmentDescription: editDepartment.departmentDescription || "",
        parentDepartment: editDepartment.parentDepartment?._id || "",
        departmentLevel: editDepartment.departmentLevel || 1,
        departmentPath: editDepartment.departmentPath || "",
        departmentHead: editDepartment.departmentHead?._id || "",
        assistantHead: editDepartment.assistantHead?._id || "",
        costCenter: editDepartment.costCenter || "",
        budget: {
          allocated: editDepartment.budget?.allocated || 0,
          currency: editDepartment.budget?.currency || "INR",
        },
        currentEmployeeCount: editDepartment.currentEmployeeCount || 0,
        allowSubdepartments:
          editDepartment.allowSubdepartments !== undefined
            ? editDepartment.allowSubdepartments
            : false,
        isActive:
          editDepartment.isActive !== undefined
            ? editDepartment.isActive
            : true,
        isSystemDefault:
          editDepartment.isSystemDefault !== undefined
            ? editDepartment.isSystemDefault
            : false,
      });
    } else {
      setFormData({
        departmentName: "",
        departmentCode: "",
        departmentDescription: "",
        parentDepartment: "",
        departmentLevel: 1,
        departmentPath: "",
        departmentHead: "",
        assistantHead: "",
        costCenter: "",
        budget: {
          allocated: 0,
          currency: "INR",
        },
        currentEmployeeCount: 0,
        allowSubdepartments: false,
        isActive: true,
        isSystemDefault: false,
      });
    }
    setErrors({});
  }, [editDepartment, isOpen]);

  // Validation Rules
  const rules = {
    departmentName: { required: true, label: "Department Name" },
    departmentCode: { required: true, label: "Department Code" },
    departmentLevel: { required: true, label: "Department Level" },
  };

  // Get existing department names for creatable select
  const existingDepartmentNames = [
    ...new Set(
      orgData.departments.map((dept) => dept.departmentName).filter(Boolean)
    ),
  ].map((name) => ({ value: name, label: name }));

  // Get parent department options (exclude current department if editing)
  const parentDepartmentOptions = orgData.departments
    .filter((dept) => {
      if (editDepartment && dept._id === editDepartment._id) return false;

      if (editDepartment && dept.parentDepartment === editDepartment._id)
        return false;

      return true;
    })
    .map((dept) => ({
      value: dept._id,
      label: `${dept.departmentName} (Level ${dept.departmentLevel})`,
    }));

  // Get employee options for department heads
  const employeeOptions = employees?.map((emp) => ({
    value: emp._id,
    label: `${emp.personalInfo?.firstName || ""} ${emp.personalInfo?.lastName || ""}`.trim(),
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Prevent creating circular dependencies
    if (formData.parentDepartment === editDepartment?._id) {
      setErrors({
        parentDepartment: "Cannot set department as its own parent",
      });
      return;
    }

    setLoading(true);
    try {
      let result;
      if (editDepartment) {
        result = await updateDepartment(editDepartment._id, formData);
        toast.success("Department updated successfully");
      } else {
        result = await addDepartment(formData);
        toast.success("Department created successfully");
      }

      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Failed to save department:", error);
      toast.error("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

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
      title={editDepartment ? "Edit Department" : "Add New Department"}
      size="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 text-${theme.text}`}>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomCreatableSelect
              label="Department Name *"
              value={formData.departmentName}
              onChange={(value) => handleInputChange("departmentName", value)}
              options={existingDepartmentNames}
              error={errors.departmentName}
              placeholder="Type to search existing or create new department..."
              helperText="Select existing or create new department name"
            />

            <Input
              label="Department Code *"
              value={formData.departmentCode}
              onChange={(e) =>
                handleInputChange(
                  "departmentCode",
                  e.target.value.toUpperCase()
                )
              }
              error={errors.departmentCode}
              theme={userType}
              placeholder="e.g., ENG"
              maxLength={10}
            />
          </div>

          <Input
            label="Description"
            value={formData.departmentDescription}
            onChange={(e) =>
              handleInputChange("departmentDescription", e.target.value)
            }
            error={errors.departmentDescription}
            theme={userType}
            placeholder="Department description and responsibilities"
            type="textarea"
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Hierarchy */}
        <div className="border-t pt-6">
          <h3 className={`text-lg font-semibold mb-4 text-${theme.text}`}>
            Hierarchy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Department Level *"
              value={formData.departmentLevel}
              onChange={(e) =>
                handleInputChange("departmentLevel", parseInt(e.target.value))
              }
              options={getDepartmentLevelOptions()}
              error={errors.departmentLevel}
              theme={userType}
            />

            {parentDepartmentOptions.length > 0 && (
              <Select
                label="Parent Department (Optional)"
                value={formData.parentDepartment}
                onChange={(e) =>
                  handleInputChange("parentDepartment", e.target.value)
                }
                options={[
                  { value: "", label: "None - Top Level Department" },
                  ...parentDepartmentOptions,
                ]}
                error={errors.parentDepartment}
                theme={userType}
              />
            )}
          </div>
        </div>

        {/* Management */}
        <div className="border-t pt-6">
          <h3 className={`text-lg font-semibold mb-4 text-${theme.text}`}>
            Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Department Head"
              value={formData.departmentHead}
              onChange={(e) =>
                handleInputChange("departmentHead", e.target.value)
              }
              options={employeeOptions}
              error={errors.departmentHead}
              theme={userType}
            />

            <Select
              label="Assistant Head"
              value={formData.assistantHead}
              onChange={(e) =>
                handleInputChange("assistantHead", e.target.value)
              }
              options={employeeOptions}
              error={errors.assistantHead}
              theme={userType}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="border-t pt-6">
          <h3 className={`text-lg font-semibold mb-4 text-${theme.text}`}>
            Financial Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Cost Center"
              value={formData.costCenter}
              onChange={(e) => handleInputChange("costCenter", e.target.value)}
              error={errors.costCenter}
              theme={userType}
              placeholder="e.g., CC-ENG-001"
            />

            <Input
              label="Budget Allocated"
              type="number"
              value={formData.budget.allocated}
              onChange={(e) =>
                handleInputChange(
                  "budgetAllocated",
                  parseFloat(e.target.value) || 0
                )
              }
              error={errors.allocated}
              theme={userType}
              placeholder="0"
              min="0"
            />

            <Select
              label="Currency"
              value={formData.budget.currency}
              onChange={(e) => handleInputChange("currency", e.target.value)}
              options={currencyOptions}
              error={errors.currency}
              theme={userType}
            />
          </div>
        </div>

        {/* Status */}
        <div className="border-t pt-6">
          <div className="flex items-center space-x-6">
            <Checkbox
              label="Active Department"
              checked={formData.isActive}
              onChange={(checked) => handleInputChange("isActive", checked)}
              theme={userType}
            />

            <Checkbox
              label="Head Office Department"
              checked={formData.isHeadOffice}
              onChange={(checked) => handleInputChange("isHeadOffice", checked)}
              theme={userType}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} theme={userType}>
            {editDepartment ? "Update Department" : "Create Department"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
