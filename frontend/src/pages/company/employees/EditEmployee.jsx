// frontend/src/pages/company/employees/EditEmployee.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { ArrowLeft, Save, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { validateForm } from "../../../lib/validation.js";
import { employeeAPI } from "../../../api/employee.api.js";
import { useOrganization } from "../../../hooks/useOrganization.jsx";
import { useApi } from "../../../hooks/useApi.jsx";
import { WORK_LOCATIONS } from "../../../lib/constants.js";
import { toast } from "react-hot-toast";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
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
  const { loading: fetchLoading, execute: fetchEmployee } = useApi(
    employeeAPI.getEmployeeDetails
  );

  useEffect(() => {
    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId]);

  const loadEmployee = async () => {
    const data = await fetchEmployee(employeeId);
    if (data) {
      setEmployee(data);
      setFormData({
        firstName: data.personalInfo?.firstName || "",
        lastName: data.personalInfo?.lastName || "",
        middleName: data.personalInfo?.middleName || "",
        primaryEmail: data.contactInfo?.primaryEmail || "",
        primaryPhone: data.contactInfo?.primaryPhone || "",
        roleRef: data.roleRef?._id || "",
        departmentRef: data.departmentRef?._id || "",
        subdepartmentRef: data.subdepartmentRef?._id || "",
        designationRef: data.designationRef?._id || "",
        dateOfJoining: data.employmentInfo?.dateOfJoining?.split("T")[0] || "",
        workLocation: data.employmentInfo?.workLocation || "Office",
      });
    }
  };

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
      await employeeAPI.updateEmployee(employeeId, {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
        },
        contactInfo: {
          primaryEmail: formData.primaryEmail,
          primaryPhone: formData.primaryPhone,
        },
        roleRef: formData.roleRef,
        departmentRef: formData.departmentRef,
        subdepartmentRef: formData.subdepartmentRef,
        designationRef: formData.designationRef,
        employmentInfo: {
          dateOfJoining: formData.dateOfJoining,
          workLocation: formData.workLocation,
        },
      });

      toast.success("Employee updated successfully");
      navigate(`/company/employees/${employeeId}`);
    } catch (error) {
      console.error("Failed to update employee:", error);
      toast.error("Failed to update employee");
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

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Loading employee...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <Card theme="company" className="p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Employee Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The requested employee could not be found.
          </p>
          <Button
            theme="company"
            onClick={() => navigate("/company/employees")}
          >
            Back to Employees
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <Helmet>
        <title>
          Edit Employee - {employee.personalInfo?.firstName}{" "}
          {employee.personalInfo?.lastName}
        </title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/company/employees/${employeeId}`)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Employee</h1>
              <p className="text-blue-200">
                {employee.personalInfo?.firstName}{" "}
                {employee.personalInfo?.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card theme="company" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Info Header */}
            <div className="flex items-center space-x-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">Employee Information</h3>
                <p className="text-blue-400 text-sm">Update employee details</p>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  label="Middle Name (Optional)"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
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
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Contact Information
              </h3>
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
            </div>

            {/* Organizational Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Organizational Information
              </h3>
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
                      setFormData({
                        ...formData,
                        subdepartmentRef: e.target.value,
                      })
                    }
                    options={subdepartmentOptions}
                  />
                )}
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Employment Information
              </h3>
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
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6 border-t border-slate-700">
              <Button
                type="submit"
                theme="company"
                loading={loading}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(`/company/employees/${employeeId}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditEmployee;
