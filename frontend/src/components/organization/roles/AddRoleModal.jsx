// frontend/src/components/organization/roles/AddRoleModal.jsx

import React, { use, useEffect, useState } from "react";
import { Modal } from "../../ui/Modal.jsx";
import { Button } from "../../ui/Button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Select } from "../../ui/Select.jsx";
import { CustomCreatableSelect } from "../../ui/CreatableSelect.jsx";
import {
  useOrganization,
  useOrganizationEnums,
} from "../../../hooks/useOrganization.jsx";
import { validateForm } from "../../../lib/validation.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { toast } from "react-hot-toast";

export const AddRoleModal = ({
  isOpen,
  onClose,
  onSuccess,
  editRole = null,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { addRole, updateRole, orgData } = useOrganization();
  console.log("Org Data:", orgData);
  
  const {
    enums,
    loading: enumsLoading,
    refresh,
    getRoleLevelOptions,
    getPermissionOptions,
    getDataAccessOptions,
  } = useOrganizationEnums();

  const [formData, setFormData] = useState({
    roleName: "",
    roleDescription: "",
    roleLevel: 1,
    permissions: {
      employeePermissions: "None",
      clientPermissions: "None",
      sowPermissions: "None",
      claimPermissions: "ViewOwn",
      reportPermissions: "None",
    },
    dataAccess: {
      clientRestriction: "Assigned",
      claimRestriction: "Assigned",
      sowRestriction: "Assigned",
      reportScope: "Self",
      financialDataAccess: false,
    },
    isActive: true,
    isSystemDefault: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   refresh();
  // }, [refresh]);

  useEffect(() => {
    if (editRole) {
      setFormData({
        roleName: editRole.roleName || "",
        roleDescription: editRole.roleDescription || "",
        roleLevel: editRole.roleLevel || 1,
        permissions: {
          employeePermissions:
            editRole.permissions?.employeePermissions || "None",
          clientPermissions: editRole.permissions?.clientPermissions || "None",
          sowPermissions: editRole.permissions?.sowPermissions || "None",
          claimPermissions: editRole.permissions?.claimPermissions || "ViewOwn",
          reportPermissions: editRole.permissions?.reportPermissions || "None",
        },
        dataAccess: {
          clientRestriction:
            editRole.dataAccess?.clientRestriction || "Assigned",
          claimRestriction: editRole.dataAccess?.claimRestriction || "Assigned",
          sowRestriction: editRole.dataAccess?.sowRestriction || "Assigned",
          reportScope: editRole.dataAccess?.reportScope || "Self",
          financialDataAccess:
            editRole.dataAccess?.financialDataAccess || false,
        },
        isActive: editRole.isActive !== undefined ? editRole.isActive : true,
        isSystemDefault:
          editRole.isSystemDefault !== undefined
            ? editRole.isSystemDefault
            : false,
      });
    } else {
      // Set defaults based on enums when available
      const defaultPermissions = enums?.role?.permissions || {};
      const defaultDataAccess = enums?.role?.dataAccess || {};

      setFormData({
        roleName: "",
        roleDescription: "",
        roleLevel: enums?.role?.roleLevel?.min || 1,
        permissions: {
          employeePermissions:
            defaultPermissions.employeePermissions?.[0] || "None",
          clientPermissions:
            defaultPermissions.clientPermissions?.[0] || "None",
          sowPermissions: defaultPermissions.sowPermissions?.[0] || "None",
          claimPermissions:
            defaultPermissions.claimPermissions?.[1] || "ViewOwn",
          reportPermissions:
            defaultPermissions.reportPermissions?.[0] || "None",
        },
        dataAccess: {
          clientRestriction:
            defaultDataAccess.clientRestriction?.[1] || "Assigned",
          claimRestriction:
            defaultDataAccess.claimRestriction?.[1] || "Assigned",
          sowRestriction: defaultDataAccess.sowRestriction?.[1] || "Assigned",
          reportScope: defaultDataAccess.reportScope?.[2] || "Self",
          financialDataAccess: false,
        },
        isActive: true,
        isSystemDefault: false,
      });
    }
  }, [editRole, isOpen, enums]);

  // Validation Rules
  const rules = {
    roleName: { required: true, label: "Role Name" },
    roleLevel: { required: true, label: "Role Level" },
    // All permission fields are required in backend
    "permissions.employeePermissions": {
      required: true,
      label: "Employee Permissions",
    },
    "permissions.clientPermissions": {
      required: true,
      label: "Client Permissions",
    },
    "permissions.sowPermissions": { required: true, label: "SOW Permissions" },
    "permissions.claimPermissions": {
      required: true,
      label: "Claim Permissions",
    },
    "permissions.reportPermissions": {
      required: true,
      label: "Report Permissions",
    },
    // All dataAccess fields are required in backend
    "dataAccess.clientRestriction": {
      required: true,
      label: "Client Restriction",
    },
    "dataAccess.claimRestriction": {
      required: true,
      label: "Claim Restriction",
    },
    "dataAccess.sowRestriction": { required: true, label: "SOW Restriction" },
    "dataAccess.reportScope": { required: true, label: "Report Scope" },
    "dataAccess.financialDataAccess": {
      required: true,
      label: "Financial Data Access",
    },
  };

  // Get Existing Role Names
  const existingRoleNames = [
    ...new Set(orgData.roles.map((role) => role.roleName).filter(Boolean)),
  ].map((roleName) => ({ value: roleName, label: roleName }));

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
      if (editRole) {
        result = await updateRole(editRole._id, formData);
        toast.success("Role updated successfully");
      } else {
        result = await addRole(formData);
        toast.success("Role created successfully");
      }

      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Failed to save role:", error);
      toast.error("Failed to save role");
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

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Show loading state while enums are being fetched
  if (enumsLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Loading..."
        size="max-w-md"
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-white">Loading role configuration...</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editRole ? "Edit Role" : "Add New Role"}
      size="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomCreatableSelect
            label="Role Name *"
            value={formData.roleName}
            onChange={(value) => handleInputChange("roleName", value)}
            options={existingRoleNames}
            error={errors.roleName}
            placeholder="Type to search existing or create new role..."
            helperText="Select existing or create new role name"
          />

          <Select
            label="Role Level *"
            value={formData.roleLevel}
            onChange={(e) =>
              handleInputChange("roleLevel", parseInt(e.target.value))
            }
            options={getRoleLevelOptions()}
            error={errors.roleLevel}
            theme={userType}
            className={`bg-${theme.glass} border-${theme.border} text-${theme.text}`}
          />
        </div>

        <Input
          label="Role Description"
          value={formData.roleDescription}
          onChange={(e) => handleInputChange("roleDescription", e.target.value)}
          theme={userType}
          placeholder="Brief description of the role (optional)"
          as="textarea"
          rows={3}
          className={`bg-${theme.glass} border-${theme.border} text-${theme.text}`}
        />

        {/* Permissions */}
        <div
          className={`p-4 rounded-lg bg-${theme.card} border border-${theme.border}`}
        >
          <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
            Permissions <span className="text-red-400">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Employee Permissions *"
              value={formData.permissions.employeePermissions}
              onChange={(e) =>
                handleInputChange(
                  "permissions.employeePermissions",
                  e.target.value
                )
              }
              options={getPermissionOptions("employeePermissions")}
              error={errors["permissions.employeePermissions"]}
              theme={userType}
            />

            <Select
              label="Client Permissions *"
              value={formData.permissions.clientPermissions}
              onChange={(e) =>
                handleInputChange(
                  "permissions.clientPermissions",
                  e.target.value
                )
              }
              options={getPermissionOptions("clientPermissions")}
              error={errors["permissions.clientPermissions"]}
              theme={userType}
            />

            <Select
              label="SOW Permissions *"
              value={formData.permissions.sowPermissions}
              onChange={(e) =>
                handleInputChange("permissions.sowPermissions", e.target.value)
              }
              options={getPermissionOptions("sowPermissions")}
              error={errors["permissions.sowPermissions"]}
              theme={userType}
            />

            <Select
              label="Claim Permissions *"
              value={formData.permissions.claimPermissions}
              onChange={(e) =>
                handleInputChange(
                  "permissions.claimPermissions",
                  e.target.value
                )
              }
              options={getPermissionOptions("claimPermissions")}
              error={errors["permissions.claimPermissions"]}
              theme={userType}
            />

            <Select
              label="Report Permissions *"
              value={formData.permissions.reportPermissions}
              onChange={(e) =>
                handleInputChange(
                  "permissions.reportPermissions",
                  e.target.value
                )
              }
              options={getPermissionOptions("reportPermissions")}
              error={errors["permissions.reportPermissions"]}
              theme={userType}
            />
          </div>
        </div>

        {/* Data Access */}
        <div
          className={`p-4 rounded-lg bg-${theme.card} border border-${theme.border}`}
        >
          <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
            Data Access Restrictions <span className="text-red-400">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Client Restriction *"
              value={formData.dataAccess.clientRestriction}
              onChange={(e) =>
                handleInputChange(
                  "dataAccess.clientRestriction",
                  e.target.value
                )
              }
              options={getDataAccessOptions("clientRestriction")}
              error={errors["dataAccess.clientRestriction"]}
              theme={userType}
            />

            <Select
              label="Claim Restriction *"
              value={formData.dataAccess.claimRestriction}
              onChange={(e) =>
                handleInputChange("dataAccess.claimRestriction", e.target.value)
              }
              options={getDataAccessOptions("claimRestriction")}
              error={errors["dataAccess.claimRestriction"]}
              theme={userType}
            />

            <Select
              label="SOW Restriction *"
              value={formData.dataAccess.sowRestriction}
              onChange={(e) =>
                handleInputChange("dataAccess.sowRestriction", e.target.value)
              }
              options={getDataAccessOptions("sowRestriction")}
              error={errors["dataAccess.sowRestriction"]}
              theme={userType}
            />

            <Select
              label="Report Scope *"
              value={formData.dataAccess.reportScope}
              onChange={(e) =>
                handleInputChange("dataAccess.reportScope", e.target.value)
              }
              options={getDataAccessOptions("reportScope")}
              error={errors["dataAccess.reportScope"]}
              theme={userType}
            />
          </div>

          <div className="mt-4 flex items-center space-x-3">
            <input
              type="checkbox"
              id="financialDataAccess"
              checked={formData.dataAccess.financialDataAccess}
              onChange={(e) =>
                handleInputChange(
                  "dataAccess.financialDataAccess",
                  e.target.checked
                )
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="financialDataAccess"
              className={`text-sm font-medium text-${theme.text}`}
            >
              Financial Data Access
            </label>
          </div>
        </div>

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
            className={`text-sm font-medium text-${theme.text}`}
          >
            Active Role
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isSystemDefault"
            checked={formData.isSystemDefault}
            onChange={(e) =>
              handleInputChange("isSystemDefault", e.target.checked)
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="isSystemDefault"
            className={`text-sm font-medium text-${theme.text}`}
          >
            System Default Role
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            theme={userType}
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
