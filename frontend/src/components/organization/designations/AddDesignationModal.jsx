// frontend/src/components/organization/designations/AddDesignationModal.jsx

import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/Modal.jsx";
import { Button } from "../../ui/Button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Select } from "../../ui/Select.jsx";
import { Checkbox } from "../../ui/Checkbox.jsx";
import { CustomCreatableSelect } from "../../ui/CreatableSelect.jsx";
import { validateForm } from "../../../lib/validation.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useOrganization } from "../../../hooks/useOrganization.jsx";
import { useOrganizationEnums } from "../../../hooks/useOrganization.jsx";
import { toast } from "react-hot-toast";

export const AddDesignationModal = ({
  isOpen,
  onClose,
  onSuccess,
  editDesignation = null,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { addDesignation, updateDesignation, orgData } = useOrganization();
  const {
    enums,
    getDesignationLevelOptions,
    designationCategories,
    educationOptions,
  } = useOrganizationEnums();

  const [formData, setFormData] = useState({
    designationName: "",
    designationCode: "",
    description: "",
    level: 1,
    category: "Entry Level",
    applicableDepartments: [],
    compatibleRoles: [],
    reportsTo: [],
    requirements: {
      minimumExperience: 0,
      requiredEducation: "None",
      requiredSkills: [],
    },
    systemPrivileges: {
      canApproveLeave: false,
      canApproveExpenses: false,
      canAccessFinancials: false,
      canManageTeam: false,
    },
    isActive: true,
    isLeadershipRole: false,
    allowsRemoteWork: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editDesignation) {
      setFormData({
        designationName: editDesignation.designationName || "",
        designationCode: editDesignation.designationCode || "",
        description: editDesignation.description || "",
        level: editDesignation.level || 1,
        category: editDesignation.category || "Entry Level",
        applicableDepartments:
          editDesignation.applicableDepartments?.map((d) => d._id) || [],
        compatibleRoles:
          editDesignation.compatibleRoles?.map((r) => r._id) || [],
        reportsTo: editDesignation.reportsTo?.map((r) => r._id) || [],
        requirements: {
          minimumExperience:
            editDesignation.requirements?.minimumExperience || 0,
          requiredEducation:
            editDesignation.requirements?.requiredEducation || "None",
          requiredSkills: editDesignation.requirements?.requiredSkills?.length
            ? editDesignation.requirements.requiredSkills
            : [{ skill: "", level: "Beginner" }],
        },
        systemPrivileges: {
          canApproveLeave:
            editDesignation.systemPrivileges?.canApproveLeave ?? false,
          canApproveExpenses:
            editDesignation.systemPrivileges?.canApproveExpenses ?? false,
          canAccessFinancials:
            editDesignation.systemPrivileges?.canAccessFinancials ?? false,
          canManageTeam:
            editDesignation.systemPrivileges?.canManageTeam ?? false,
        },
        isActive: editDesignation.isActive ?? true,
        isLeadershipRole: editDesignation.isLeadershipRole ?? false,
        allowsRemoteWork: editDesignation.allowsRemoteWork ?? false,
      });
    } else {
      setFormData({
        designationName: "",
        designationCode: "",
        description: "",
        level: 1,
        category: "Entry Level",
        applicableDepartments: [],
        compatibleRoles: [],
        reportsTo: "",
        requirements: {
          minimumExperience: 0,
          requiredEducation: "None",
          requiredSkills: [],
        },
        systemPrivileges: {
          canApproveLeave: false,
          canApproveExpenses: false,
          canAccessFinancials: false,
          canManageTeam: false,
        },
        isActive: true,
        isLeadershipRole: false,
        allowsRemoteWork: false,
      });
    }
  }, [editDesignation, isOpen, enums]);

  // Validation Rules (based on backend model)
  const rules = {
    designationName: {
      required: true,
      label: "Designation Name",
      maxLength: 100,
    },
    designationCode: {
      required: true,
      label: "Designation Code",
      maxLength: 15,
    },
    level: { required: true, label: "Designation Level" },
    category: { required: true, label: "Category" },
  };

  // Department options
  const departmentOptions = orgData.departments.map((dept) => ({
    value: dept._id,
    label: dept.departmentName,
  }));

  // Role options
  const roleOptions = orgData.roles.map((role) => ({
    value: role._id,
    label: role.roleName,
  }));

  // Designation options for reporting structure (exclude current when editing)
  const designationOptions = orgData.designations
    .filter((desig) =>
      editDesignation ? desig._id !== editDesignation._id : true
    )
    .map((desig) => ({
      value: desig._id,
      label: desig.designationName,
    }));

  // Existing designation names for CreatableSelect
  const existingDesignationNames = [
    ...new Set(
      orgData.designations.map((desig) => desig.designationName).filter(Boolean)
    ),
  ].map((name) => ({ value: name, label: name }));

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
      if (editDesignation) {
        result = await updateDesignation(editDesignation._id, formData);
        toast.success("Designation updated successfully");
      } else {
        result = await addDesignation(formData);
        toast.success("Designation created successfully");
      }

      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Failed to save designation:", error);
      toast.error("Failed to save designation");
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

  const handleMultiSelectChange = (field, values) => {
    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDesignation ? "Edit Designation" : "Add New Designation"}
      size="max-w-7xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div>
          <h3 className={`text-lg font-semibold mb-2 text-${theme.text}`}>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomCreatableSelect
              label="Designation Name *"
              value={formData.designationName}
              onChange={(value) => handleInputChange("designationName", value)}
              options={existingDesignationNames}
              error={errors.designationName}
              placeholder="Type to search existing or create new designation..."
              helperText="Select existing or create new designation name"
            />

            <Input
              label="Designation Code *"
              value={formData.designationCode}
              onChange={(e) =>
                handleInputChange(
                  "designationCode",
                  e.target.value.toUpperCase()
                )
              }
              error={errors.designationCode}
              theme={userType}
              placeholder="e.g., SSE"
              maxLength={15}
            />
          </div>

          {/* Designation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-2">
            <Select
              label="Level *"
              value={formData.level}
              onChange={(e) =>
                handleInputChange("level", parseInt(e.target.value))
              }
              options={getDesignationLevelOptions()}
              error={errors.level}
              theme={userType}
            />

            <Select
              label="Category *"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              options={designationCategories}
              error={errors.category}
              theme={userType}
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            theme={userType}
            placeholder="Designation description and key responsibilities"
            type="textarea"
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Organization Structure */}
        <div className="border-t pt-4">
          <h3 className={`text-lg font-semibold mb-4 text-${theme.text}`}>
            Organizational Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Applicable Departments */}
            <div>
              <label
                className={`block text-sm font-medium text-${theme.text} mb-2`}
              >
                Applicable Departments
              </label>
              <Select
                value=""
                onChange={(e) => {
                  const deptId = e.target.value;
                  handleMultiSelectChange("applicableDepartments", [
                    ...formData.applicableDepartments,
                    deptId,
                  ]);
                }}
                options={[
                  ...departmentOptions.filter(
                    (opt) => !formData.applicableDepartments.includes(opt.value)
                  ),
                ]}
                theme={userType}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.applicableDepartments.map((deptId) => {
                  const dept = departmentOptions.find(
                    (d) => d.value === deptId
                  );
                  return dept ? (
                    <span
                      key={deptId}
                      className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm flex items-center"
                    >
                      {dept.label}
                      <button
                        type="button"
                        onClick={() =>
                          handleMultiSelectChange(
                            "applicableDepartments",
                            formData.applicableDepartments.filter(
                              (id) => id !== deptId
                            )
                          )
                        }
                        className="ml-2 text-blue-400 hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {/* Compatible Roles */}
            <div>
              <label
                className={`block text-sm font-medium text-${theme.text} mb-2`}
              >
                Compatible Roles
              </label>
              <Select
                value=""
                onChange={(e) => {
                  const roleId = e.target.value;
                  handleMultiSelectChange("compatibleRoles", [
                    ...formData.compatibleRoles,
                    roleId,
                  ]);
                }}
                options={[
                  ...roleOptions.filter(
                    (opt) => !formData.compatibleRoles.includes(opt.value)
                  ),
                ]}
                theme={userType}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.compatibleRoles.map((roleId) => {
                  const role = roleOptions.find((r) => r.value === roleId);
                  return role ? (
                    <span
                      key={roleId}
                      className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm flex items-center"
                    >
                      {role.label}
                      <button
                        type="button"
                        onClick={() =>
                          handleMultiSelectChange(
                            "compatibleRoles",
                            formData.compatibleRoles.filter(
                              (id) => id !== roleId
                            )
                          )
                        }
                        className="ml-2 text-green-400 hover:text-green-200"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Reports To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
            <Select
              label="Reports To"
              value={formData.reportsTo}
              onChange={(e) => handleInputChange("reportsTo", e.target.value)}
              options={[...designationOptions]}
              error={errors.reportsTo}
              theme={userType}
            />
          </div>

          {/* Requirements */}
          <div className="border-t pt-6">
            <h3 className={`text-lg font-semibold mb-4 text-${theme.text}`}>
              Experience Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Minimum Years Experience"
                type="number"
                value={formData.requirements.minimumExperience}
                onChange={(e) =>
                  handleInputChange(
                    "requirements.minimumExperience",
                    parseInt(e.target.value)
                  )
                }
                error={errors["requirements.minimumExperience"]}
                theme={userType}
                min="0"
              />

              <Select
                label="Required Education"
                value={formData.requirements.requiredEducation}
                onChange={(e) =>
                  handleInputChange(
                    "requirements.requiredEducation",
                    e.target.value
                  )
                }
                options={educationOptions}
                error={errors["requirements.requiredEducation"]}
                theme={userType}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
