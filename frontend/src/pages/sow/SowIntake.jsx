// frontend/src/pages/sow/SowIntake.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Custom hooks
import { useAuth } from "../../hooks/useAuth.jsx";
import { useSOWs } from "../../hooks/useSows.jsx";

// Utility
import { getTheme } from "../../lib/theme";

// UI Components (you may need to adjust the import path if using a UI library or custom card)
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";

const SOWIntake = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();
  const { addSOW } = useSOWs(); // Assuming you have a useSOWs hook
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      description: "SOW details and client",
    },
    { id: 2, title: "Service Details", description: "Service configuration" },
    {
      id: 3,
      title: "Volume & Forecasting",
      description: "Capacity and targets",
    },
    { id: 4, title: "Financial Terms", description: "Pricing and payment" },
    {
      id: 5,
      title: "Resource Planning",
      description: "Skills and assignments",
    },
    { id: 6, title: "Review & Submit", description: "Final review" },
  ];

  const [formData, setFormData] = useState({
    // Basic Information
    basicInfo: {
      sowTitle: "",
      sowDescription: "",
      clientCompanyRef: "",
      sowType: "Fixed",
      priority: "Medium",
    },

    // Service Details
    serviceDetails: {
      serviceType: "",
      serviceDescription: "",
      deliverables: [],
      qualityMetrics: {
        accuracyTarget: 95,
        turnaroundTime: 24,
        qualityCheckpoints: [],
      },
      complianceRequirements: [],
      specialInstructions: "",
    },

    // Volume & Forecasting
    volumeForecasting: {
      expectedDailyVolume: 0,
      peakVolumeExpected: 0,
      minimumVolumeGuaranteed: 0,
      volumeVariabilityFactor: 1.0,
      historicalVolumeData: [],
      seasonalityFactors: {
        quarterlyMultipliers: [1.0, 1.0, 1.0, 1.0],
        monthlyPatterns: [],
      },
    },

    // Financial Terms
    financialTerms: {
      pricingModel: "PerUnit",
      baseRate: 0,
      currency: "USD",
      volumeDiscounts: [],
      paymentTerms: {
        paymentSchedule: "Monthly",
        paymentDueDays: 30,
        lateFeePercentage: 0,
        earlyPaymentDiscount: 0,
      },
      invoicingDetails: {
        invoiceFrequency: "Monthly",
        invoiceDeliveryMethod: "Email",
        billingContact: "",
      },
    },

    // Resource Planning
    resourcePlanning: {
      estimatedFTE: 0,
      requiredSkills: [],
      preferredEmployees: [],
      workingHours: {
        startTime: "09:00",
        endTime: "17:00",
        timeZone: "UTC",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      capacityAllocation: {
        maxConcurrentTasks: 10,
        bufferCapacityPercentage: 20,
      },
    },

    // Status (will be set automatically)
    status: {
      sowStatus: "Draft",
      startDate: "",
      endDate: "",
      autoRenewal: false,
      renewalTerms: "",
    },

    // System Info (will be set automatically)
    systemInfo: {
      isActive: true,
      autoAssignmentEnabled: false,
      notificationSettings: {
        volumeThresholds: true,
        qualityAlerts: true,
        deadlineReminders: true,
      },
    },
  });

  // Validation rules for each step
  const validationRules = {
    1: {
      "basicInfo.sowTitle": { required: true },
      "basicInfo.sowDescription": { required: true },
      "basicInfo.clientCompanyRef": { required: true },
      "basicInfo.sowType": { required: true },
      "basicInfo.priority": { required: true },
    },
    2: {
      "serviceDetails.serviceType": { required: true },
      "serviceDetails.serviceDescription": { required: true },
      "serviceDetails.qualityMetrics.accuracyTarget": {
        required: true,
        min: 0,
        max: 100,
      },
      "serviceDetails.qualityMetrics.turnaroundTime": {
        required: true,
        min: 1,
      },
    },
    3: {
      "volumeForecasting.expectedDailyVolume": { required: true, min: 1 },
      "volumeForecasting.peakVolumeExpected": { required: true, min: 1 },
      "volumeForecasting.volumeVariabilityFactor": {
        required: true,
        min: 0.1,
        max: 5.0,
      },
    },
    4: {
      "financialTerms.pricingModel": { required: true },
      "financialTerms.baseRate": { required: true, min: 0 },
      "financialTerms.currency": { required: true },
      "financialTerms.paymentTerms.paymentSchedule": { required: true },
      "financialTerms.paymentTerms.paymentDueDays": { required: true, min: 1 },
    },
    5: {
      "resourcePlanning.estimatedFTE": { required: true, min: 0.1 },
      "resourcePlanning.workingHours.startTime": { required: true },
      "resourcePlanning.workingHours.endTime": { required: true },
      "resourcePlanning.workingHours.timeZone": { required: true },
    },
    6: {
      "status.startDate": { required: true },
      "status.endDate": { required: true },
    },
  };

  // Options for dropdowns
  const sowTypeOptions = ["Fixed", "Time & Material", "Hybrid", "Subscription"];
  const priorityOptions = ["Low", "Medium", "High", "Critical"];
  const serviceTypeOptions = [
    "Medical Coding",
    "Claims Processing",
    "Prior Authorization",
    "Billing",
    "Auditing",
    "Data Entry",
  ];
  const pricingModelOptions = [
    "PerUnit",
    "Hourly",
    "Monthly",
    "Annual",
    "Milestone",
  ];
  const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AUD"];
  const paymentScheduleOptions = [
    "Weekly",
    "Bi-weekly",
    "Monthly",
    "Quarterly",
    "Annual",
  ];
  const invoiceFrequencyOptions = ["Weekly", "Monthly", "Quarterly"];
  const invoiceDeliveryOptions = ["Email", "Portal", "Mail"];
  const timeZoneOptions = ["UTC", "EST", "PST", "CST", "MST", "IST"];
  const workingDaysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const complianceOptions = ["HIPAA", "SOX", "GDPR", "ISO 27001", "PCI DSS"];
  const skillOptions = [
    "Medical Coding",
    "ICD-10",
    "CPT",
    "HCPCS",
    "Claims Processing",
    "Prior Auth",
    "Billing",
    "Auditing",
  ];

  const handleInputChange = (section, field, value, subField = null) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: subField
          ? {
              ...prev[section][field],
              [subField]: value,
            }
          : value,
      },
    }));

    // Clear error for this field
    const errorKey = subField
      ? `${section}.${field}.${subField}`
      : `${section}.${field}`;
    setErrors((prev) => ({
      ...prev,
      [errorKey]: null,
    }));
  };

  const validateCurrentStep = () => {
    const currentValidations = validationRules[currentStep] || {};
    const newErrors = {};

    Object.entries(currentValidations).forEach(([fieldPath, validation]) => {
      const value = getNestedValue(formData, fieldPath);

      if (validation.required && (!value || value.toString().trim() === "")) {
        newErrors[fieldPath] = "This field is required";
      }

      if (validation.min && value < validation.min) {
        newErrors[fieldPath] = `Minimum value is ${validation.min}`;
      }

      if (validation.max && value > validation.max) {
        newErrors[fieldPath] = `Maximum value is ${validation.max}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
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
      const finalData = {
        ...formData,
        auditInfo: {
          createdAt: new Date(),
          createdBy: userType.id, // Assuming userType has id
          lastModifiedAt: new Date(),
          lastModifiedBy: userType.id,
        },
        activityMetrics: {
          totalClaimsAssigned: 0,
          totalClaimsCompleted: 0,
          averageCompletionTime: 0,
          qualityScore: 0,
          employeeUtilization: 0,
        },
        uploadedFiles: uploadedFiles,
      };

      await addSOW(finalData);
      toast.success("SOW created successfully!");
      //   navigate("/employee");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create SOW. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const handleArrayAdd = (section, field, item) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], item],
      },
    }));
  };

  const handleArrayRemove = (section, field, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index),
      },
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SOW Title *
                </label>
                <input
                  type="text"
                  value={formData.basicInfo.sowTitle}
                  onChange={(e) =>
                    handleInputChange("basicInfo", "sowTitle", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["basicInfo.sowTitle"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter SOW title"
                />
                {errors["basicInfo.sowTitle"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["basicInfo.sowTitle"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Company *
                </label>
                <select
                  value={formData.basicInfo.clientCompanyRef}
                  onChange={(e) =>
                    handleInputChange(
                      "basicInfo",
                      "clientCompanyRef",
                      e.target.value
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["basicInfo.clientCompanyRef"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select client company</option>
                  <option value="client">Company 1</option>
                </select>
                {errors["basicInfo.clientCompanyRef"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["basicInfo.clientCompanyRef"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SOW Type *
                </label>
                <select
                  value={formData.basicInfo.sowType}
                  onChange={(e) =>
                    handleInputChange("basicInfo", "sowType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sowTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.basicInfo.priority}
                  onChange={(e) =>
                    handleInputChange("basicInfo", "priority", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SOW Description *
              </label>
              <textarea
                value={formData.basicInfo.sowDescription}
                onChange={(e) =>
                  handleInputChange(
                    "basicInfo",
                    "sowDescription",
                    e.target.value
                  )
                }
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors["basicInfo.sowDescription"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter detailed SOW description"
              />
              {errors["basicInfo.sowDescription"] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors["basicInfo.sowDescription"]}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Service Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  value={formData.serviceDetails.serviceType}
                  onChange={(e) =>
                    handleInputChange(
                      "serviceDetails",
                      "serviceType",
                      e.target.value
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["serviceDetails.serviceType"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select service type</option>
                  {serviceTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors["serviceDetails.serviceType"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["serviceDetails.serviceType"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accuracy Target (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.serviceDetails.qualityMetrics.accuracyTarget}
                  onChange={(e) =>
                    handleInputChange(
                      "serviceDetails",
                      "qualityMetrics",
                      parseInt(e.target.value),
                      "accuracyTarget"
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["serviceDetails.qualityMetrics.accuracyTarget"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["serviceDetails.qualityMetrics.accuracyTarget"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["serviceDetails.qualityMetrics.accuracyTarget"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Turnaround Time (hours) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.serviceDetails.qualityMetrics.turnaroundTime}
                  onChange={(e) =>
                    handleInputChange(
                      "serviceDetails",
                      "qualityMetrics",
                      parseInt(e.target.value),
                      "turnaroundTime"
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["serviceDetails.qualityMetrics.turnaroundTime"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["serviceDetails.qualityMetrics.turnaroundTime"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["serviceDetails.qualityMetrics.turnaroundTime"]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Description *
              </label>
              <textarea
                value={formData.serviceDetails.serviceDescription}
                onChange={(e) =>
                  handleInputChange(
                    "serviceDetails",
                    "serviceDescription",
                    e.target.value
                  )
                }
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors["serviceDetails.serviceDescription"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter detailed service description"
              />
              {errors["serviceDetails.serviceDescription"] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors["serviceDetails.serviceDescription"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance Requirements
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {complianceOptions.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`compliance-${option}`}
                      checked={formData.serviceDetails.complianceRequirements.includes(
                        option
                      )}
                      onChange={(e) => {
                        const newRequirements = e.target.checked
                          ? [
                              ...formData.serviceDetails.complianceRequirements,
                              option,
                            ]
                          : formData.serviceDetails.complianceRequirements.filter(
                              (item) => item !== option
                            );
                        handleInputChange(
                          "serviceDetails",
                          "complianceRequirements",
                          newRequirements
                        );
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`compliance-${option}`}
                      className="text-sm text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                value={formData.serviceDetails.specialInstructions}
                onChange={(e) =>
                  handleInputChange(
                    "serviceDetails",
                    "specialInstructions",
                    e.target.value
                  )
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter any special instructions or requirements"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Volume & Forecasting
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Daily Volume *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.volumeForecasting.expectedDailyVolume}
                  onChange={(e) =>
                    handleInputChange(
                      "volumeForecasting",
                      "expectedDailyVolume",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["volumeForecasting.expectedDailyVolume"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter expected daily volume"
                />
                {errors["volumeForecasting.expectedDailyVolume"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["volumeForecasting.expectedDailyVolume"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peak Volume Expected *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.volumeForecasting.peakVolumeExpected}
                  onChange={(e) =>
                    handleInputChange(
                      "volumeForecasting",
                      "peakVolumeExpected",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["volumeForecasting.peakVolumeExpected"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter peak volume expected"
                />
                {errors["volumeForecasting.peakVolumeExpected"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["volumeForecasting.peakVolumeExpected"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Volume Guaranteed
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.volumeForecasting.minimumVolumeGuaranteed}
                  onChange={(e) =>
                    handleInputChange(
                      "volumeForecasting",
                      "minimumVolumeGuaranteed",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter minimum volume guaranteed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume Variability Factor *
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={formData.volumeForecasting.volumeVariabilityFactor}
                  onChange={(e) =>
                    handleInputChange(
                      "volumeForecasting",
                      "volumeVariabilityFactor",
                      parseFloat(e.target.value) || 1.0
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["volumeForecasting.volumeVariabilityFactor"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter volume variability factor"
                />
                {errors["volumeForecasting.volumeVariabilityFactor"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["volumeForecasting.volumeVariabilityFactor"]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quarterly Multipliers
              </label>
              <div className="grid grid-cols-4 gap-4">
                {["Q1", "Q2", "Q3", "Q4"].map((quarter, index) => (
                  <div key={quarter}>
                    <label className="block text-xs text-gray-600 mb-1">
                      {quarter}
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      max="3.0"
                      step="0.1"
                      value={
                        formData.volumeForecasting.seasonalityFactors
                          .quarterlyMultipliers[index]
                      }
                      onChange={(e) => {
                        const newMultipliers = [
                          ...formData.volumeForecasting.seasonalityFactors
                            .quarterlyMultipliers,
                        ];
                        newMultipliers[index] =
                          parseFloat(e.target.value) || 1.0;
                        handleInputChange(
                          "volumeForecasting",
                          "seasonalityFactors",
                          newMultipliers,
                          "quarterlyMultipliers"
                        );
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Financial Terms
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Model *
                </label>
                <select
                  value={formData.financialTerms.pricingModel}
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "pricingModel",
                      e.target.value
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["financialTerms.pricingModel"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select pricing model</option>
                  {pricingModelOptions.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                {errors["financialTerms.pricingModel"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["financialTerms.pricingModel"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Rate *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.financialTerms.baseRate}
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "baseRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["financialTerms.baseRate"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter base rate"
                />
                {errors["financialTerms.baseRate"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["financialTerms.baseRate"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  value={formData.financialTerms.currency}
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "currency",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Schedule *
                </label>
                <select
                  value={formData.financialTerms.paymentTerms.paymentSchedule}
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "paymentTerms",
                      e.target.value,
                      "paymentSchedule"
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["financialTerms.paymentTerms.paymentSchedule"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select payment schedule</option>
                  {paymentScheduleOptions.map((schedule) => (
                    <option key={schedule} value={schedule}>
                      {schedule}
                    </option>
                  ))}
                </select>
                {errors["financialTerms.paymentTerms.paymentSchedule"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["financialTerms.paymentTerms.paymentSchedule"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Due Days *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.financialTerms.paymentTerms.paymentDueDays}
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "paymentTerms",
                      parseInt(e.target.value) || 30,
                      "paymentDueDays"
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["financialTerms.paymentTerms.paymentDueDays"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter payment due days"
                />
                {errors["financialTerms.paymentTerms.paymentDueDays"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["financialTerms.paymentTerms.paymentDueDays"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Late Fee Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.financialTerms.paymentTerms.lateFeePercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "paymentTerms",
                      parseFloat(e.target.value) || 0,
                      "lateFeePercentage"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter late fee percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Early Payment Discount
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={
                    formData.financialTerms.paymentTerms.earlyPaymentDiscount
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "paymentTerms",
                      parseFloat(e.target.value) || 0,
                      "earlyPaymentDiscount"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter early payment discount"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Frequency
                </label>
                <select
                  value={
                    formData.financialTerms.invoicingDetails.invoiceFrequency
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "invoicingDetails",
                      e.target.value,
                      "invoiceFrequency"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {invoiceFrequencyOptions.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Delivery Method
                </label>
                <select
                  value={
                    formData.financialTerms.invoicingDetails
                      .invoiceDeliveryMethod
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "financialTerms",
                      "invoicingDetails",
                      e.target.value,
                      "invoiceDeliveryMethod"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {invoiceDeliveryOptions.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Contact
              </label>
              <input
                type="email"
                value={formData.financialTerms.invoicingDetails.billingContact}
                onChange={(e) =>
                  handleInputChange(
                    "financialTerms",
                    "invoicingDetails",
                    e.target.value,
                    "billingContact"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter billing contact email"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Resource Planning
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated FTE *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.resourcePlanning.estimatedFTE}
                  onChange={(e) =>
                    handleInputChange(
                      "resourcePlanning",
                      "estimatedFTE",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["resourcePlanning.estimatedFTE"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter estimated FTE"
                />
                {errors["resourcePlanning.estimatedFTE"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["resourcePlanning.estimatedFTE"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Concurrent Tasks
                </label>
                <input
                  type="number"
                  min="1"
                  value={
                    formData.resourcePlanning.capacityAllocation
                      .maxConcurrentTasks
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "resourcePlanning",
                      "capacityAllocation",
                      parseInt(e.target.value) || 10,
                      "maxConcurrentTasks"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter max concurrent tasks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buffer Capacity Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    formData.resourcePlanning.capacityAllocation
                      .bufferCapacityPercentage
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "resourcePlanning",
                      "capacityAllocation",
                      parseInt(e.target.value) || 20,
                      "bufferCapacityPercentage"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter buffer capacity percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone *
                </label>
                <select
                  value={formData.resourcePlanning.workingHours.timeZone}
                  onChange={(e) =>
                    handleInputChange(
                      "resourcePlanning",
                      "workingHours",
                      e.target.value,
                      "timeZone"
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["resourcePlanning.workingHours.timeZone"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {timeZoneOptions.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                {errors["resourcePlanning.workingHours.timeZone"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["resourcePlanning.workingHours.timeZone"]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.resourcePlanning.workingHours.startTime}
                  onChange={(e) =>
                    handleInputChange(
                      "resourcePlanning",
                      "workingHours",
                      e.target.value,
                      "startTime"
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["resourcePlanning.workingHours.startTime"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["resourcePlanning.workingHours.startTime"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["resourcePlanning.workingHours.startTime"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.resourcePlanning.workingHours.endTime}
                  onChange={(e) =>
                    handleInputChange(
                      "resourcePlanning",
                      "workingHours",
                      e.target.value,
                      "endTime"
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["resourcePlanning.workingHours.endTime"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["resourcePlanning.workingHours.endTime"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["resourcePlanning.workingHours.endTime"]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {workingDaysOptions.map((day) => (
                  <div key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`working-day-${day}`}
                      checked={formData.resourcePlanning.workingHours.workingDays.includes(
                        day
                      )}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [
                              ...formData.resourcePlanning.workingHours
                                .workingDays,
                              day,
                            ]
                          : formData.resourcePlanning.workingHours.workingDays.filter(
                              (d) => d !== day
                            );
                        handleInputChange(
                          "resourcePlanning",
                          "workingHours",
                          newDays,
                          "workingDays"
                        );
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`working-day-${day}`}
                      className="text-sm text-gray-700"
                    >
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skillOptions.map((skill) => (
                  <div key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`skill-${skill}`}
                      checked={formData.resourcePlanning.requiredSkills.some(
                        (s) => s.skill === skill
                      )}
                      onChange={(e) => {
                        const newSkills = e.target.checked
                          ? [
                              ...formData.resourcePlanning.requiredSkills,
                              {
                                skill,
                                proficiencyLevel: "Intermediate",
                                mandatory: true,
                              },
                            ]
                          : formData.resourcePlanning.requiredSkills.filter(
                              (s) => s.skill !== skill
                            );
                        handleInputChange(
                          "resourcePlanning",
                          "requiredSkills",
                          newSkills
                        );
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`skill-${skill}`}
                      className="text-sm text-gray-700"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Review & Submit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.status.startDate}
                  onChange={(e) =>
                    handleInputChange("status", "startDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["status.startDate"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["status.startDate"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["status.startDate"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.status.endDate}
                  onChange={(e) =>
                    handleInputChange("status", "endDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["status.endDate"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors["status.endDate"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["status.endDate"]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-renewal"
                  checked={formData.status.autoRenewal}
                  onChange={(e) =>
                    handleInputChange("status", "autoRenewal", e.target.checked)
                  }
                  className="mr-2"
                />
                <label htmlFor="auto-renewal" className="text-sm text-gray-700">
                  Auto Renewal
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-assignment"
                  checked={formData.systemInfo.autoAssignmentEnabled}
                  onChange={(e) =>
                    handleInputChange(
                      "systemInfo",
                      "autoAssignmentEnabled",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="auto-assignment"
                  className="text-sm text-gray-700"
                >
                  Auto Assignment Enabled
                </label>
              </div>
            </div>

            {formData.status.autoRenewal && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renewal Terms
                </label>
                <textarea
                  value={formData.status.renewalTerms}
                  onChange={(e) =>
                    handleInputChange("status", "renewalTerms", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter renewal terms and conditions"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Settings
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="volume-thresholds"
                    checked={
                      formData.systemInfo.notificationSettings.volumeThresholds
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "systemInfo",
                        "notificationSettings",
                        e.target.checked,
                        "volumeThresholds"
                      )
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="volume-thresholds"
                    className="text-sm text-gray-700"
                  >
                    Volume Threshold Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="quality-alerts"
                    checked={
                      formData.systemInfo.notificationSettings.qualityAlerts
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "systemInfo",
                        "notificationSettings",
                        e.target.checked,
                        "qualityAlerts"
                      )
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="quality-alerts"
                    className="text-sm text-gray-700"
                  >
                    Quality Alerts
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="deadline-reminders"
                    checked={
                      formData.systemInfo.notificationSettings.deadlineReminders
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "systemInfo",
                        "notificationSettings",
                        e.target.checked,
                        "deadlineReminders"
                      )
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="deadline-reminders"
                    className="text-sm text-gray-700"
                  >
                    Deadline Reminders
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Click to upload files or drag and drop
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PDF, DOC, DOCX, XLS, XLSX up to 10MB each
                </p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Uploaded Files:
                  </h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Summary</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>SOW Title:</strong> {formData.basicInfo.sowTitle}
                </p>
                <p>
                  <strong>Service Type:</strong>{" "}
                  {formData.serviceDetails.serviceType}
                </p>
                <p>
                  <strong>Expected Daily Volume:</strong>{" "}
                  {formData.volumeForecasting.expectedDailyVolume}
                </p>
                <p>
                  <strong>Estimated FTE:</strong>{" "}
                  {formData.resourcePlanning.estimatedFTE}
                </p>
                <p>
                  <strong>Base Rate:</strong> {formData.financialTerms.currency}{" "}
                  {formData.financialTerms.baseRate}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id === currentStep
                  ? "bg-blue-600 text-white"
                  : step.id < currentStep
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.id < currentStep ? "✓" : step.id}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  step.id < currentStep ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New SOW
              </h1>
              <p className="mt-2 text-gray-600">
                Set up a new Statement of Work for your client
              </p>
            </div>
            <Button
              onClick={() => navigate("/employee/sows/list")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
            >
              ← Back to SOW List
            </Button>
          </div>

          <div className="mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <Card className={`${theme.card} p-8`}>{renderStepContent()}</Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Previous
          </Button>

          <div className="flex space-x-4">
            {steps.map((step) => (
              <Button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  step.id === currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {step.id}
              </Button>
            ))}
          </div>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create SOW"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOWIntake;
