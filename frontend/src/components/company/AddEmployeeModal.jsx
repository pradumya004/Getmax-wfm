// frontend/src/components/company/AddEmployeeModal.jsx

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { validateForm } from "../../lib/validation.js";
import { employeeAPI } from "../../api/employee.api.js";
import { useOrganization } from "../../hooks/useOrganization.jsx";
import { WORK_LOCATIONS } from "../../lib/constants.js";
import { toast } from "react-hot-toast";

export const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    primaryEmail: "",
    primaryPhone: "",
    roleRef: "",
    departmentRef: "",
    subdepartmentRef: "",
    designationRef: "",
    dateOfJoining: "",
    workLocation: "Office",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { orgData } = useOrganization();

  const rules = {
    firstName: { required: true, label: "First Name" },
    lastName: { required: true, label: "Last Name" },
    primaryEmail: { required: true, type: "email", label: "Email" },
    roleRef: { required: true, label: "Role" },
    departmentRef: { required: true, label: "Department" },
    designationRef: { required: true, label: "Designation" },
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
      await employeeAPI.addEmployee(formData);
      toast.success("Employee added successfully");
      onSuccess();
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        primaryEmail: "",
        primaryPhone: "",
        roleRef: "",
        departmentRef: "",
        subdepartmentRef: "",
        designationRef: "",
        dateOfJoining: "",
        workLocation: "Office",
      });
    } catch (error) {
      toast.error("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = orgData.roles.map((role) => ({
    value: role._id,
    label: role.roleName,
  }));

  const departmentOptions = orgData.departments.map((dept) => ({
    value: dept._id,
    label: dept.departmentName,
  }));

  const designationOptions = orgData.designations.map((designation) => ({
    value: designation._id,
    label: designation.designationName,
  }));

  const subdepartmentOptions = orgData.subdepartments
    .filter((subdept) => subdept.departmentRef === formData.departmentRef)
    .map((subdept) => ({
      value: subdept._id,
      label: subdept.subdepartmentName,
    }));

  const locationOptions = WORK_LOCATIONS.map((location) => ({
    value: location,
    label: location,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      size="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            error={errors.firstName}
            theme="company"
          />

          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            error={errors.lastName}
            theme="company"
          />
        </div>

        <Input
          label="Middle Name (Optional)"
          value={formData.middleName}
          onChange={(e) =>
            setFormData({ ...formData, middleName: e.target.value })
          }
          theme="company"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.primaryEmail}
            onChange={(e) =>
              setFormData({ ...formData, primaryEmail: e.target.value })
            }
            error={errors.primaryEmail}
            theme="company"
          />

          <Input
            label="Phone (Optional)"
            value={formData.primaryPhone}
            onChange={(e) =>
              setFormData({ ...formData, primaryPhone: e.target.value })
            }
            theme="company"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Role"
            value={formData.roleRef}
            onChange={(e) =>
              setFormData({ ...formData, roleRef: e.target.value })
            }
            options={roleOptions}
            error={errors.roleRef}
          />

          <Select
            label="Department"
            value={formData.departmentRef}
            onChange={(e) =>
              setFormData({
                ...formData,
                departmentRef: e.target.value,
                subdepartmentRef: "",
              })
            }
            options={departmentOptions}
            error={errors.departmentRef}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Designation"
            value={formData.designationRef}
            onChange={(e) =>
              setFormData({ ...formData, designationRef: e.target.value })
            }
            options={designationOptions}
            error={errors.designationRef}
          />

          {subdepartmentOptions.length > 0 && (
            <Select
              label="Sub-Department (Optional)"
              value={formData.subdepartmentRef}
              onChange={(e) =>
                setFormData({ ...formData, subdepartmentRef: e.target.value })
              }
              options={subdepartmentOptions}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date of Joining"
            type="date"
            value={formData.dateOfJoining}
            onChange={(e) =>
              setFormData({ ...formData, dateOfJoining: e.target.value })
            }
            theme="company"
          />

          <Select
            label="Work Location"
            value={formData.workLocation}
            onChange={(e) =>
              setFormData({ ...formData, workLocation: e.target.value })
            }
            options={locationOptions}
          />
        </div>

        <div className="flex space-x-3 pt-6">
          <Button
            type="submit"
            theme="company"
            loading={loading}
            className="flex-1"
          >
            Add Employee
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
