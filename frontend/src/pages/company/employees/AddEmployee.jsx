import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Target,
  Settings,
  AlertCircle,
  CheckCircle,
  Award,
  Shield,
} from "lucide-react";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { Checkbox } from "../../../components/ui/Checkbox.jsx";
import { MultiSelectField } from "../../../components/ui/MultiSelectField.jsx";
import { Textarea } from "../../../components/ui/Textarea.jsx";
import { Progress } from "../../../components/ui/Progress.jsx";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useEmployees } from "../../../hooks/useEmployee.jsx";
import { useOrganization } from "../../../hooks/useOrganization.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  EMPLOYMENT_TYPES,
  WORK_LOCATIONS,
  SHIFT_TYPES,
  GENDERS,
  BLOOD_GROUPS,
  CURRENCIES,
  PAY_FREQUENCIES,
  EMPLOYEE_STATUSES,
  TIMEZONES,
  WORKING_DAYS,
  TECHNICAL_SKILLS,
  SOFT_SKILLS,
  LANGUAGES,
  SKILL_LEVELS,
  LANGUAGE_PROFICIENCY,
} from "../../../constants/employee.constants.js";

const EmployeeIntake = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();
  const { addEmployee, employees } = useEmployees();
  const { orgData } = useOrganization();
  console.log("Org Data:", orgData);
  console.log("Employees:", employees);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    personalInfo: {
      firstName: "",
      lastName: "",
      middleName: "",
      displayName: "",
      dateOfBirth: "",
      gender: "Prefer not to say",
      bloodGroup: "",
    },

    // Step 2: Contact Information
    contactInfo: {
      primaryEmail: "",
      personalEmail: "",
      primaryPhone: "",
      alternatePhone: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },

    // Step 3: Employment Information
    employmentInfo: {
      employeeCode: "",
      dateOfJoining: "",
      employmentType: "Full Time",
      workLocation: "Office",
      shiftType: "Day",
    },

    // Organizational assignments
    roleRef: "",
    departmentRef: "",
    subdepartmentRef: "",
    designationRef: "",

    // Reporting structure
    reportingStructure: {
      directManager: "",
      teamLead: "",
    },

    // Step 4: Compensation & Work Schedule
    compensation: {
      baseSalary: "",
      hourlyRate: "",
      currency: "INR",
      payFrequency: "Monthly",
    },

    workSchedule: {
      standardHours: {
        startTime: "09:00",
        endTime: "17:00",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        totalHoursPerWeek: 40,
      },
      timeZone: "IST",
      flexibleHours: false,
    },

    // Step 5: Performance & Skills
    performanceTargets: {
      dailyClaimTarget: 30,
      qualityTarget: 90,
      slaTarget: 95,
    },

    skillsAndQualifications: {
      technicalSkills: [],
      softSkills: [],
      languages: [],
      certifications: [],
      education: [],
    },

    // Step 6: System Configuration
    status: {
      employeeStatus: "Active",
      statusEffectiveDate: new Date().toISOString().split("T")[0],
      statusReason: "",
    },

    systemInfo: {
      isActive: true,
      emailVerified: false,
    },

    // Additional fields
    rampPercentage: 100,
  });

  const handleInputChange = (section, field, value, subField = null) => {
    console.log("handleInputChange:", { section, field, value, subField });

    setFormData((prev) => {
      const newData = { ...prev };

      if (section === "" || section === null) {
        newData[field] = value;
      } else {
        if (!newData[section]) {
          newData[section] = {};
        }

        if (subField) {
          if (!newData[section][field]) {
            newData[section][field] = {};
          }
          newData[section][field][subField] = value;
        } else {
          newData[section][field] = value;
        }
      }

      console.log("Updated formData:", newData);
      return newData;
    });

    // Clear error for this field
    const errorKey =
      section === "" || section === null
        ? field
        : subField
        ? `${section}.${field}.${subField}`
        : `${section}.${field}`;

    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }));
    }
  };

  const validateCurrentStep = () => {
    const stepValidations = {
      1: {
        "personalInfo.firstName": {
          required: true,
          message: "First name is required",
        },
        "personalInfo.lastName": {
          required: true,
          message: "Last name is required",
        },
      },
      2: {
        "contactInfo.primaryEmail": {
          required: true,
          type: "email",
          message: "Valid email is required",
        },
        "contactInfo.primaryPhone": {
          required: true,
          message: "Primary phone is required",
        },
      },
      3: {
        "employmentInfo.dateOfJoining": {
          required: true,
          message: "Date of joining is required",
        },
        roleRef: {
          required: true,
          message: "Role is required",
        },
        departmentRef: {
          required: true,
          message: "Department is required",
        },
        designationRef: {
          required: true,
          message: "Designation is required",
        },
      },
      4: {
        "compensation.baseSalary": {
          required: true,
          message: "Base salary is required",
        },
      },
      5: {
        "performanceTargets.dailyClaimTarget": {
          required: true,
          message: "Daily claim target is required",
        },
      },
    };

    const currentValidations = stepValidations[currentStep];
    const newErrors = {};

    if (currentValidations) {
      Object.entries(currentValidations).forEach(([fieldPath, validation]) => {
        const value = getNestedValue(formData, fieldPath);

        if (validation.required && (!value || value.toString().trim() === "")) {
          newErrors[fieldPath] = validation.message;
        }

        if (validation.type === "email" && value && !isValidEmail(value)) {
          newErrors[fieldPath] = "Please enter a valid email address";
        }
      });
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNestedValue = (obj, path) => {
    try {
      return path.split(".").reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
      }, obj);
    } catch (error) {
      console.warn(`Failed to get nested value for path: ${path}`, error);
      return null;
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);

    try {
      console.log("Submitting form data:", formData);
      await addEmployee(formData);

      toast.success("Employee added successfully!");
      navigate("/company/employees");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 ${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <User className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Personal Information
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Let's start with the basic personal details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name *"
                value={formData.personalInfo.firstName}
                onChange={(e) =>
                  handleInputChange("personalInfo", "firstName", e.target.value)
                }
                error={errors["personalInfo.firstName"]}
                placeholder="Enter first name"
              />

              <Input
                label="Last Name *"
                value={formData.personalInfo.lastName}
                onChange={(e) =>
                  handleInputChange("personalInfo", "lastName", e.target.value)
                }
                error={errors["personalInfo.lastName"]}
                placeholder="Enter last name"
              />

              <Input
                label="Middle Name"
                value={formData.personalInfo.middleName}
                onChange={(e) =>
                  handleInputChange(
                    "personalInfo",
                    "middleName",
                    e.target.value
                  )
                }
                placeholder="Enter middle name"
              />

              <Input
                label="Display Name"
                value={formData.personalInfo.displayName}
                onChange={(e) =>
                  handleInputChange(
                    "personalInfo",
                    "displayName",
                    e.target.value
                  )
                }
                placeholder="Enter display name"
              />

              <Input
                label="Date of Birth"
                type="date"
                value={formData.personalInfo.dateOfBirth}
                onChange={(e) =>
                  handleInputChange(
                    "personalInfo",
                    "dateOfBirth",
                    e.target.value
                  )
                }
                placeholder="Select date of birth"
              />

              <Select
                label="Gender"
                value={formData.personalInfo.gender}
                onChange={(e) =>
                  handleInputChange("personalInfo", "gender", e.target.value)
                }
                options={GENDERS.map((gender) => ({
                  value: gender,
                  label: gender,
                }))}
                placeholder="Select gender"
              />

              <Select
                label="Blood Group"
                value={formData.personalInfo.bloodGroup}
                onChange={(e) =>
                  handleInputChange(
                    "personalInfo",
                    "bloodGroup",
                    e.target.value
                  )
                }
                options={BLOOD_GROUPS.map((group) => ({
                  value: group,
                  label: group,
                }))}
                placeholder="Select blood group"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Mail className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Contact Information
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                How can we reach the employee?
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Primary Contact *
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Primary Email *"
                  type="email"
                  value={formData.contactInfo.primaryEmail}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "primaryEmail",
                      e.target.value
                    )
                  }
                  error={errors["contactInfo.primaryEmail"]}
                  placeholder="Enter primary email"
                />

                <Input
                  label="Personal Email"
                  type="email"
                  value={formData.contactInfo.personalEmail}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "personalEmail",
                      e.target.value
                    )
                  }
                  placeholder="Enter personal email"
                />

                <Input
                  label="Primary Phone *"
                  value={formData.contactInfo.primaryPhone}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "primaryPhone",
                      e.target.value
                    )
                  }
                  error={errors["contactInfo.primaryPhone"]}
                  placeholder="Enter primary phone"
                />

                <Input
                  label="Alternate Phone"
                  value={formData.contactInfo.alternatePhone}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "alternatePhone",
                      e.target.value
                    )
                  }
                  placeholder="Enter alternate phone"
                />
              </div>
            </Card>

            <Card className="bg-gray-800 p-6">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Name"
                  value={formData.contactInfo.emergencyContact.name}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "emergencyContact",
                      e.target.value,
                      "name"
                    )
                  }
                  placeholder="Enter name"
                />

                <Input
                  label="Relationship"
                  value={formData.contactInfo.emergencyContact.relationship}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "emergencyContact",
                      e.target.value,
                      "relationship"
                    )
                  }
                  placeholder="Enter relationship"
                />

                <Input
                  label="Phone"
                  value={formData.contactInfo.emergencyContact.phone}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "emergencyContact",
                      e.target.value,
                      "phone"
                    )
                  }
                  placeholder="Enter phone"
                />
              </div>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Building2 className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Employment Information
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Employment details and organizational assignment
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Employment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Employee Code"
                  value={formData.employmentInfo.employeeCode}
                  onChange={(e) =>
                    handleInputChange(
                      "employmentInfo",
                      "employeeCode",
                      e.target.value
                    )
                  }
                  placeholder="Enter employee code"
                />

                <Input
                  label="Date of Joining *"
                  type="date"
                  value={formData.employmentInfo.dateOfJoining}
                  onChange={(e) =>
                    handleInputChange(
                      "employmentInfo",
                      "dateOfJoining",
                      e.target.value
                    )
                  }
                  error={errors["employmentInfo.dateOfJoining"]}
                />

                <Select
                  label="Employment Type"
                  value={formData.employmentInfo.employmentType}
                  onChange={(e) =>
                    handleInputChange(
                      "employmentInfo",
                      "employmentType",
                      e.target.value
                    )
                  }
                  options={EMPLOYMENT_TYPES.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />

                <Select
                  label="Work Location"
                  value={formData.employmentInfo.workLocation}
                  onChange={(e) =>
                    handleInputChange(
                      "employmentInfo",
                      "workLocation",
                      e.target.value
                    )
                  }
                  options={WORK_LOCATIONS.map((location) => ({
                    value: location,
                    label: location,
                  }))}
                />

                <Select
                  label="Shift Type"
                  value={formData.employmentInfo.shiftType}
                  onChange={(e) =>
                    handleInputChange(
                      "employmentInfo",
                      "shiftType",
                      e.target.value
                    )
                  }
                  options={SHIFT_TYPES.map((shift) => ({
                    value: shift,
                    label: shift,
                  }))}
                />
              </div>
            </Card>

            <Card className="bg-gray-800 p-6">
              <h4 className="text-white text-lg font-semibold mb-4">
                Organizational Assignment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Role *"
                  value={formData.roleRef}
                  onChange={(e) =>
                    handleInputChange("", "roleRef", e.target.value)
                  }
                  options={
                    orgData?.roles?.map((role) => ({
                      value: role._id,
                      label: role.roleName,
                    })) || []
                  }
                  error={errors["roleRef"]}
                  placeholder="Select role"
                />

                <Select
                  label="Department *"
                  value={formData.departmentRef}
                  onChange={(e) => {
                    handleInputChange("", "departmentRef", e.target.value);
                    handleInputChange("", "subdepartmentRef", "");
                  }}
                  options={
                    orgData?.departments?.map((dept) => ({
                      value: dept._id,
                      label: dept.departmentName,
                    })) || []
                  }
                  error={errors["departmentRef"]}
                  placeholder="Select department"
                />

                <Select
                  label="Designation *"
                  value={formData.designationRef}
                  onChange={(e) =>
                    handleInputChange("", "designationRef", e.target.value)
                  }
                  options={
                    orgData?.designations?.map((designation) => ({
                      value: designation._id,
                      label: designation.designationName,
                    })) || []
                  }
                  error={errors["designationRef"]}
                  placeholder="Select designation"
                />

                {orgData?.subdepartments?.filter(
                  (subdept) => subdept.departmentRef === formData.departmentRef
                ).length > 0 && (
                  <Select
                    label="Sub-Department"
                    value={formData.subdepartmentRef}
                    onChange={(e) =>
                      handleInputChange("", "subdepartmentRef", e.target.value)
                    }
                    options={orgData.subdepartments
                      .filter(
                        (subdept) =>
                          subdept.departmentRef === formData.departmentRef
                      )
                      .map((subdept) => ({
                        value: subdept._id,
                        label: subdept.subdepartmentName,
                      }))}
                    placeholder="Select sub-department"
                  />
                )}
              </div>
            </Card>

            <Card className="bg-gray-800 p-6">
              <h4 className="text-white text-lg font-semibold mb-4">
                Reporting Structure
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Direct Manager"
                  value={formData.reportingStructure.directManager}
                  onChange={(e) =>
                    handleInputChange(
                      "reportingStructure",
                      "directManager",
                      e.target.value
                    )
                  }
                  options={
                    employees?.map((emp) => ({
                      value: emp._id,
                      label: `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`,
                    })) || []
                  }
                  placeholder="Select direct manager"
                />

                <Select
                  label="Team Lead"
                  value={formData.reportingStructure.teamLead}
                  onChange={(e) =>
                    handleInputChange(
                      "reportingStructure",
                      "teamLead",
                      e.target.value
                    )
                  }
                  options={
                    employees?.map((emp) => ({
                      value: emp._id,
                      label: `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`,
                    })) || []
                  }
                  placeholder="Select team lead"
                />
              </div>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <DollarSign className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Compensation & Schedule
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Set compensation and work schedule details
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Compensation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Base Salary *"
                  type="number"
                  value={formData.compensation.baseSalary}
                  onChange={(e) =>
                    handleInputChange(
                      "compensation",
                      "baseSalary",
                      e.target.value
                    )
                  }
                  error={errors["compensation.baseSalary"]}
                  placeholder="Enter base salary"
                />

                <Input
                  label="Hourly Rate"
                  type="number"
                  value={formData.compensation.hourlyRate}
                  onChange={(e) =>
                    handleInputChange(
                      "compensation",
                      "hourlyRate",
                      e.target.value
                    )
                  }
                  placeholder="Enter hourly rate"
                />

                <Select
                  label="Currency"
                  value={formData.compensation.currency}
                  onChange={(e) =>
                    handleInputChange(
                      "compensation",
                      "currency",
                      e.target.value
                    )
                  }
                  options={CURRENCIES.map((currency) => ({
                    value: currency,
                    label: currency,
                  }))}
                />

                <Select
                  label="Pay Frequency"
                  value={formData.compensation.payFrequency}
                  onChange={(e) =>
                    handleInputChange(
                      "compensation",
                      "payFrequency",
                      e.target.value
                    )
                  }
                  options={PAY_FREQUENCIES.map((freq) => ({
                    value: freq,
                    label: freq,
                  }))}
                />
              </div>
            </Card>

            <Card className="bg-gray-800 p-6">
              <h4 className="text-white text-lg font-semibold mb-4">
                Work Schedule
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={formData.workSchedule.standardHours.startTime}
                  onChange={(e) =>
                    handleInputChange(
                      "workSchedule",
                      "standardHours",
                      e.target.value,
                      "startTime"
                    )
                  }
                />

                <Input
                  label="End Time"
                  type="time"
                  value={formData.workSchedule.standardHours.endTime}
                  onChange={(e) =>
                    handleInputChange(
                      "workSchedule",
                      "standardHours",
                      e.target.value,
                      "endTime"
                    )
                  }
                />

                <Input
                  label="Total Hours Per Week"
                  type="number"
                  value={formData.workSchedule.standardHours.totalHoursPerWeek}
                  onChange={(e) =>
                    handleInputChange(
                      "workSchedule",
                      "standardHours",
                      parseInt(e.target.value),
                      "totalHoursPerWeek"
                    )
                  }
                />

                <Select
                  label="Time Zone"
                  value={formData.workSchedule.timeZone}
                  onChange={(e) =>
                    handleInputChange(
                      "workSchedule",
                      "timeZone",
                      e.target.value
                    )
                  }
                  options={TIMEZONES.map((tz) => ({
                    value: tz,
                    label: tz,
                  }))}
                />
              </div>

              <div className="mt-6">
                <MultiSelectField
                  label="Working Days"
                  selected={
                    formData.workSchedule.standardHours.workingDays || []
                  }
                  onChange={(selectedDays) =>
                    handleInputChange(
                      "workSchedule",
                      "standardHours",
                      selectedDays,
                      "workingDays"
                    )
                  }
                  options={WORKING_DAYS.map((day) => ({
                    value: day,
                    label: day,
                  }))}
                />
              </div>

              <div className="mt-6">
                <Checkbox
                  label="Flexible Hours"
                  checked={formData.workSchedule.flexibleHours}
                  onChange={(e) =>
                    handleInputChange(
                      "workSchedule",
                      "flexibleHours",
                      e.target.checked
                    )
                  }
                />
              </div>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Target className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Performance & Skills
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Set performance targets and skill assessments
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Performance Targets
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Daily Claim Target *"
                  type="number"
                  value={formData.performanceTargets.dailyClaimTarget}
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "dailyClaimTarget",
                      parseInt(e.target.value)
                    )
                  }
                  error={errors["performanceTargets.dailyClaimTarget"]}
                  placeholder="30"
                />

                <Input
                  label="Quality Target (%)"
                  type="number"
                  value={formData.performanceTargets.qualityTarget}
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "qualityTarget",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="90"
                />

                <Input
                  label="SLA Target (%)"
                  type="number"
                  value={formData.performanceTargets.slaTarget}
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "slaTarget",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="95"
                />
              </div>
            </Card>

            <Card className="bg-gray-800 p-6">
              <h4 className="text-white text-lg font-semibold mb-4">
                Skills Assessment
              </h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technical Skills
                  </label>
                  <MultiSelectField
                    selected={
                      formData.skillsAndQualifications.technicalSkills.map(
                        (skill) => skill.skill
                      ) || []
                    }
                    onChange={(selectedSkills) => {
                      const skillsArray = selectedSkills.map((skill) => ({
                        skill,
                        level: "Beginner",
                      }));
                      handleInputChange(
                        "skillsAndQualifications",
                        "technicalSkills",
                        skillsArray
                      );
                    }}
                    options={TECHNICAL_SKILLS.map((skill) => ({
                      value: skill,
                      label: skill,
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Soft Skills
                  </label>
                  <MultiSelectField
                    selected={
                      formData.skillsAndQualifications.softSkills.map(
                        (skill) => skill.skill
                      ) || []
                    }
                    onChange={(selectedSkills) => {
                      const skillsArray = selectedSkills.map((skill) => ({
                        skill,
                        level: "Beginner",
                      }));
                      handleInputChange(
                        "skillsAndQualifications",
                        "softSkills",
                        skillsArray
                      );
                    }}
                    options={SOFT_SKILLS.map((skill) => ({
                      value: skill,
                      label: skill,
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Languages
                  </label>
                  <MultiSelectField
                    selected={
                      formData.skillsAndQualifications.languages.map(
                        (lang) => lang.languages
                      ) || []
                    }
                    onChange={(selectedLangs) => {
                      const langsArray = selectedLangs.map((lang) => ({
                        languages: lang,
                        proficiency: "Basic",
                      }));
                      handleInputChange(
                        "skillsAndQualifications",
                        "languages",
                        langsArray
                      );
                    }}
                    options={LANGUAGES.map((lang) => ({
                      value: lang,
                      label: lang,
                    }))}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800 p-6">
              <h4 className="text-white text-lg font-semibold mb-4">
                Additional Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ramp Percentage (%)"
                  type="number"
                  value={formData.rampPercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "",
                      "rampPercentage",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="100"
                />
              </div>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Settings className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                System Configuration
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Final configuration and status settings
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Employee Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Employee Status"
                  value={formData.status.employeeStatus}
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      "employeeStatus",
                      e.target.value
                    )
                  }
                  options={EMPLOYEE_STATUSES.map((status) => ({
                    value: status,
                    label: status,
                  }))}
                />

                <Input
                  label="Status Effective Date"
                  type="date"
                  value={formData.status.statusEffectiveDate}
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      "statusEffectiveDate",
                      e.target.value
                    )
                  }
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Status Reason"
                    value={formData.status.statusReason}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        "statusReason",
                        e.target.value
                      )
                    }
                    placeholder="Enter reason for status..."
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800 p-6">
              <h4 className="text-white text-lg font-semibold mb-4">
                System Settings
              </h4>
              <div className="space-y-4">
                <Checkbox
                  label="Active Employee"
                  checked={formData.systemInfo.isActive}
                  onChange={(e) =>
                    handleInputChange(
                      "systemInfo",
                      "isActive",
                      e.target.checked
                    )
                  }
                />

                <Checkbox
                  label="Email Verified"
                  checked={formData.systemInfo.emailVerified}
                  onChange={(e) =>
                    handleInputChange(
                      "systemInfo",
                      "emailVerified",
                      e.target.checked
                    )
                  }
                />
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Personal", icon: User },
      { number: 2, title: "Contact", icon: Mail },
      { number: 3, title: "Employment", icon: Building2 },
      { number: 4, title: "Compensation", icon: DollarSign },
      { number: 5, title: "Performance", icon: Target },
      { number: 6, title: "System", icon: Settings },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex items-center ${
                index < steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.number
                    ? `border-${theme.accent} bg-${theme.accent} text-green-400`
                    : `border-${theme.textSecondary} text-${theme.textSecondary}`
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number
                      ? `bg-${theme.accent}`
                      : `bg-${theme.textSecondary}`
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div
                className={`font-medium ${
                  currentStep >= step.number
                    ? "text-white"
                    : `text-${theme.textSecondary}`
                }`}
              >
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>{`Employee Intake - GetMax`}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/company/employees")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Employees</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Employee Intake</h1>
              <p className={`text-${theme.textSecondary} text-lg`}>
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white text-2xl font-bold">
              {Math.round(progress)}%
            </div>
            <div className={`text-${theme.textSecondary} text-sm`}>
              Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Content */}
        <Card className={`${theme.card} p-8`}>{renderStepContent()}</Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/company/employees")}
            >
              Save as Draft
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Add Employee</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeIntake;
