// frontend/src/pages/sow/SowIntake.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Building2,
  User,
  Settings,
  Target,
  DollarSign,
  Users,
  Shield,
  Clock,
  BarChart3,
  Zap,
  Award,
} from "lucide-react";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { FileUpload } from "../../components/ui/FileUpload.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useSOWs } from "../../hooks/useSows.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SOWIntake = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();
  const { addSOW } = useSOWs();
  const { clients, fetchClients } = useClients();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    fetchClients();
  }, []);

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    basicInfo: {
      sowName: "",
      sowDescription: "",
      clientCompanyRef: "",
    },

    // Step 2: Service Configuration
    serviceDetails: {
      serviceType: "",
      serviceSubType: "",
      scopeFormatId: "EMSMC",
    },

    // Step 3: Contract & Billing
    contractDetails: {
      contractType: "Transactional",
      billingModel: "Per Transaction",
      ratePerTransaction: 0,
      monthlyFixedRate: 0,
      currency: "USD",
    },

    // Step 4: Performance Targets & SLA
    performanceTargets: {
      dailyTargetPerEmp: 50,
      qualityBenchmark: 95,
      slaConfig: {
        slaHours: 48,
        triggerEvent: "Assign Date",
        warningThresholdPercent: 85,
        resetOnReassign: false,
      },
    },

    // Step 5: Volume Forecasting & Resource Planning
    volumeAndResources: {
      volumeForecasting: {
        expectedDailyVolume: 100,
        expectedMonthlyVolume: 2200,
        peakSeasonMultiplier: 1.2,
      },
      resourcePlanning: {
        plannedHeadcount: 2,
        requiredRoleLevel: 3,
        requiredSkills: [],
        minExperienceYears: 1,
      },
    },

    // Step 6: Work Allocation & QA Configuration
    allocationAndQA: {
      allocationConfig: {
        allocationMode: "Capacity Based",
        priorityFormula: {
          agingWeight: 0.4,
          payerWeight: 0.3,
          denialWeight: 0.3,
        },
        floatingPoolConfig: {
          enabled: true,
          maxClaimsInPool: 50,
          autoReassignAfterHours: 4,
        },
        maxClaimsPerEmp: 50,
      },
      qaConfig: {
        qaRequired: true,
        qaPercentage: 10,
        errorCategories: [
          { category: "Clinical", weightage: 25 },
          { category: "Administrative", weightage: 25 },
          { category: "Technical", weightage: 20 },
          { category: "Compliance", weightage: 20 },
          { category: "Documentation", weightage: 10 },
        ],
        passingScore: 85,
      },
      notesConfig: {
        useStructuredNotes: true,
        requiredNoteCategories: [
          {
            categoryName: "Resolution Notes",
            isRequired: true,
            fieldType: "Textarea",
            options: [],
          },
          {
            categoryName: "Follow-up Required",
            isRequired: false,
            fieldType: "Dropdown",
            options: ["Yes", "No", "Pending"],
          },
        ],
        notesMandatory: true,
      },
    },

    // Step 7: Timeline & System Configuration
    finalConfig: {
      status: {
        sowStatus: "Draft",
        startDate: "",
        endDate: "",
        lastReviewDate: null,
        nextReviewDate: null,
      },
      systemInfo: {
        isActive: true,
        isTemplate: false,
        autoAssignmentEnabled: true,
      },
    },
  });

  // Options for dropdowns
  const serviceTypeOptions = [
    "AR Calling",
    "Medical Coding",
    "Prior Authorization",
    "Eligibility Verification",
    "Charge Entry",
    "Payment Posting",
    "Denial Management",
    "Quality Assurance",
    "Custom Service",
  ];

  const contractTypeOptions = ["End-to-End", "Transactional", "FTE", "Hybrid"];

  const billingModelOptions = [
    "Per Transaction",
    "Monthly Fixed",
    "Hourly",
    "Performance Based",
  ];

  const currencyOptions = ["USD", "INR", "EUR", "GBP", "CAD", "AED"];

  const triggerEventOptions = [
    "Import Date",
    "Assign Date",
    "First Status Update",
  ];

  const allocationModeOptions = [
    "Round Robin",
    "Capacity Based",
    "Priority Based",
    "Skill Based",
  ];

  const scopeFormatOptions = [
    "EMSMC",
    "ClaimMD",
    "Medisoft",
    "Epic",
    "Cerner",
    "AllScripts",
    "Other",
  ];

  const skillOptions = [
    "Medical Coding",
    "ICD-10",
    "CPT",
    "HCPCS",
    "Prior Auth",
    "AR Calling",
    "Denial Management",
    "Payment Posting",
    "Eligibility Verification",
    "Insurance Knowledge",
    "EMR Systems",
    "Excel Advanced",
    "Data Entry",
    "Customer Service",
    "Healthcare RCM",
  ];

  const errorCategoryOptions = [
    "Clinical",
    "Administrative",
    "Technical",
    "Compliance",
    "Documentation",
  ];

  const fieldTypeOptions = [
    "Text",
    "Dropdown",
    "Multi-select",
    "Date",
    "Number",
    "Textarea",
  ];

  const handleInputChange = (
    section,
    field,
    value,
    subField = null,
    index = null
  ) => {
    setFormData((prev) => {
      const newData = { ...prev };

      if (index !== null) {
        // Handle array updates
        if (!newData[section][field][index]) {
          newData[section][field][index] = {};
        }
        newData[section][field][index][subField] = value;
      } else if (subField) {
        // Handle nested object updates
        if (!newData[section][field]) {
          newData[section][field] = {};
        }
        newData[section][field][subField] = value;
      } else {
        // Handle direct field updates
        newData[section][field] = value;
      }

      return newData;
    });

    // Clear error for this field
    const errorKey = subField
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
        "basicInfo.sowName": {
          required: true,
          message: "SOW name is required",
        },
        "basicInfo.sowDescription": {
          required: true,
          message: "SOW description is required",
        },
        "basicInfo.clientCompanyRef": {
          required: true,
          message: "Client selection is required",
        },
      },
      2: {
        "serviceDetails.serviceType": {
          required: true,
          message: "Service type is required",
        },
        "serviceDetails.scopeFormatId": {
          required: true,
          message: "Scope format is required",
        },
      },
      3: {
        "contractDetails.contractType": {
          required: true,
          message: "Contract type is required",
        },
        "contractDetails.billingModel": {
          required: true,
          message: "Billing model is required",
        },
        "contractDetails.ratePerTransaction": {
          required: formData.contractDetails.billingModel === "Per Transaction",
          min: 0,
          message: "Rate per transaction is required and must be positive",
        },
        "contractDetails.monthlyFixedRate": {
          required: formData.contractDetails.billingModel === "Monthly Fixed",
          min: 0,
          message: "Monthly fixed rate is required and must be positive",
        },
      },
      4: {
        "performanceTargets.dailyTargetPerEmp": {
          required: true,
          min: 1,
          max: 500,
          message: "Daily target must be between 1 and 500",
        },
        "performanceTargets.qualityBenchmark": {
          required: true,
          min: 80,
          max: 100,
          message: "Quality benchmark must be between 80% and 100%",
        },
        "performanceTargets.slaConfig.slaHours": {
          required: true,
          min: 1,
          max: 168,
          message: "SLA hours must be between 1 and 168",
        },
      },
      5: {
        "volumeAndResources.volumeForecasting.expectedDailyVolume": {
          required: true,
          min: 1,
          message: "Expected daily volume must be at least 1",
        },
        "volumeAndResources.resourcePlanning.plannedHeadcount": {
          required: true,
          min: 1,
          max: 500,
          message: "Planned headcount must be between 1 and 500",
        },
      },
      6: {
        "allocationAndQA.qaConfig.qaPercentage": {
          required: true,
          min: 5,
          max: 100,
          message: "QA percentage must be between 5% and 100%",
        },
        "allocationAndQA.qaConfig.passingScore": {
          required: true,
          min: 70,
          max: 100,
          message: "Passing score must be between 70% and 100%",
        },
      },
      7: {
        "finalConfig.status.startDate": {
          required: true,
          message: "Start date is required",
        },
      },
    };

    const currentValidations = stepValidations[currentStep];
    const newErrors = {};

    Object.entries(currentValidations).forEach(([fieldPath, validation]) => {
      const value = getNestedValue(formData, fieldPath);

      if (validation.required && (!value || value.toString().trim() === "")) {
        newErrors[fieldPath] = validation.message;
      }

      if (validation.min && value < validation.min) {
        newErrors[fieldPath] = validation.message;
      }

      if (validation.max && value > validation.max) {
        newErrors[fieldPath] = validation.message;
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
      // Prepare final data according to SOW model structure
      const finalData = {
        sowName: formData.basicInfo.sowName,
        sowDescription: formData.basicInfo.sowDescription,
        clientCompanyRef: formData.basicInfo.clientCompanyRef,
        serviceDetails: formData.serviceDetails,
        contractDetails: formData.contractDetails,
        performanceTargets: formData.performanceTargets,
        volumeForecasting: formData.volumeAndResources.volumeForecasting,
        resourcePlanning: formData.volumeAndResources.resourcePlanning,
        allocationConfig: formData.allocationAndQA.allocationConfig,
        qaConfig: formData.allocationAndQA.qaConfig,
        notesConfig: formData.allocationAndQA.notesConfig,
        status: formData.finalConfig.status,
        systemInfo: formData.finalConfig.systemInfo,
        activityMetrics: {
          totalClaimsAssigned: 0,
          totalClaimsCompleted: 0,
          averageCompletionTimeHours: 0,
          currentSlaComplianceRate: 0,
          currentQualityScoreAverage: 0,
          monthlyRevenueGenerated: 0,
        },
        uploadedFiles: uploadedFiles,
      };

      await addSOW(finalData);
      toast.success("SOW created successfully!");
      navigate("/employee/sows/list");
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

  const handleSkillToggle = (skill) => {
    const currentSkills =
      formData.volumeAndResources.resourcePlanning.requiredSkills;
    const skillExists = currentSkills.find((s) => s.skill === skill);

    if (skillExists) {
      const newSkills = currentSkills.filter((s) => s.skill !== skill);
      handleInputChange(
        "volumeAndResources",
        "resourcePlanning",
        newSkills,
        "requiredSkills"
      );
    } else {
      const newSkills = [
        ...currentSkills,
        { skill, proficiencyLevel: "Intermediate" },
      ];
      handleInputChange(
        "volumeAndResources",
        "resourcePlanning",
        newSkills,
        "requiredSkills"
      );
    }
  };

  const addNoteCategory = () => {
    const currentCategories =
      formData.allocationAndQA.notesConfig.requiredNoteCategories;
    const newCategory = {
      categoryName: "",
      isRequired: true,
      fieldType: "Textarea",
      options: [],
    };
    handleInputChange(
      "allocationAndQA",
      "notesConfig",
      [...currentCategories, newCategory],
      "requiredNoteCategories"
    );
  };

  const removeNoteCategory = (index) => {
    const currentCategories =
      formData.allocationAndQA.notesConfig.requiredNoteCategories;
    const newCategories = currentCategories.filter((_, i) => i !== index);
    handleInputChange(
      "allocationAndQA",
      "notesConfig",
      newCategories,
      "requiredNoteCategories"
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                SOW Basic Information
              </h3>
              <p className="text-gray-400">
                Let's start with the basic details about this Statement of Work
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                label="SOW Name *"
                value={formData.basicInfo.sowName}
                onChange={(e) =>
                  handleInputChange("basicInfo", "sowName", e.target.value)
                }
                error={errors["basicInfo.sowName"]}
                placeholder="Enter SOW name (e.g., Medical Coding - ABC Hospital)"
              />

              <Select
                label="Client Company *"
                value={formData.basicInfo.clientCompanyRef}
                onChange={(e) =>
                  handleInputChange(
                    "basicInfo",
                    "clientCompanyRef",
                    e.target.value
                  )
                }
                options={clients.map((client) => ({
                  value: client._id,
                  label: client.clientInfo?.clientName || client.clientName,
                }))}
                error={errors["basicInfo.clientCompanyRef"]}
                placeholder="Select client company"
              />

              <Textarea
                label="SOW Description *"
                value={formData.basicInfo.sowDescription}
                onChange={(e) =>
                  handleInputChange(
                    "basicInfo",
                    "sowDescription",
                    e.target.value
                  )
                }
                error={errors["basicInfo.sowDescription"]}
                placeholder="Provide a detailed description of the services to be provided..."
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Service Configuration
              </h3>
              <p className="text-gray-400">
                Define the specific services and technical requirements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Service Type *"
                value={formData.serviceDetails.serviceType}
                onChange={(e) =>
                  handleInputChange(
                    "serviceDetails",
                    "serviceType",
                    e.target.value
                  )
                }
                options={serviceTypeOptions.map((type) => ({
                  value: type,
                  label: type,
                }))}
                error={errors["serviceDetails.serviceType"]}
              />

              <Input
                label="Service Sub-Type"
                value={formData.serviceDetails.serviceSubType}
                onChange={(e) =>
                  handleInputChange(
                    "serviceDetails",
                    "serviceSubType",
                    e.target.value
                  )
                }
                placeholder="e.g., Emergency Medicine, Cardiology"
              />

              <Select
                label="Scope Format ID *"
                value={formData.serviceDetails.scopeFormatId}
                onChange={(e) =>
                  handleInputChange(
                    "serviceDetails",
                    "scopeFormatId",
                    e.target.value
                  )
                }
                options={scopeFormatOptions.map((format) => ({
                  value: format,
                  label: format,
                }))}
                error={errors["serviceDetails.scopeFormatId"]}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Contract & Billing
              </h3>
              <p className="text-gray-400">
                Set up pricing model and billing configuration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Contract Type *"
                value={formData.contractDetails.contractType}
                onChange={(e) =>
                  handleInputChange(
                    "contractDetails",
                    "contractType",
                    e.target.value
                  )
                }
                options={contractTypeOptions.map((type) => ({
                  value: type,
                  label: type,
                }))}
                error={errors["contractDetails.contractType"]}
              />

              <Select
                label="Billing Model *"
                value={formData.contractDetails.billingModel}
                onChange={(e) =>
                  handleInputChange(
                    "contractDetails",
                    "billingModel",
                    e.target.value
                  )
                }
                options={billingModelOptions.map((model) => ({
                  value: model,
                  label: model,
                }))}
                error={errors["contractDetails.billingModel"]}
              />

              {formData.contractDetails.billingModel === "Per Transaction" && (
                <Input
                  label="Rate Per Transaction *"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.contractDetails.ratePerTransaction}
                  onChange={(e) =>
                    handleInputChange(
                      "contractDetails",
                      "ratePerTransaction",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  error={errors["contractDetails.ratePerTransaction"]}
                  placeholder="0.00"
                />
              )}

              {formData.contractDetails.billingModel === "Monthly Fixed" && (
                <Input
                  label="Monthly Fixed Rate *"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.contractDetails.monthlyFixedRate}
                  onChange={(e) =>
                    handleInputChange(
                      "contractDetails",
                      "monthlyFixedRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  error={errors["contractDetails.monthlyFixedRate"]}
                  placeholder="0.00"
                />
              )}

              <Select
                label="Currency *"
                value={formData.contractDetails.currency}
                onChange={(e) =>
                  handleInputChange(
                    "contractDetails",
                    "currency",
                    e.target.value
                  )
                }
                options={currencyOptions.map((currency) => ({
                  value: currency,
                  label: currency,
                }))}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Performance Targets & SLA
              </h3>
              <p className="text-gray-400">
                Define performance expectations and service level agreements
              </p>
            </div>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance Targets
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Daily Target Per Employee *"
                  type="number"
                  min="1"
                  max="500"
                  value={formData.performanceTargets.dailyTargetPerEmp}
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "dailyTargetPerEmp",
                      parseInt(e.target.value) || 0
                    )
                  }
                  error={errors["performanceTargets.dailyTargetPerEmp"]}
                  placeholder="50"
                />

                <Input
                  label="Quality Benchmark (%) *"
                  type="number"
                  min="80"
                  max="100"
                  value={formData.performanceTargets.qualityBenchmark}
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "qualityBenchmark",
                      parseInt(e.target.value) || 0
                    )
                  }
                  error={errors["performanceTargets.qualityBenchmark"]}
                  placeholder="95"
                />
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                SLA Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SLA Hours *"
                  type="number"
                  min="1"
                  max="168"
                  value={formData.performanceTargets.slaConfig.slaHours}
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "slaConfig",
                      parseInt(e.target.value) || 48,
                      "slaHours"
                    )
                  }
                  error={errors["performanceTargets.slaConfig.slaHours"]}
                  placeholder="48"
                />

                <Select
                  label="SLA Trigger Event *"
                  value={formData.performanceTargets.slaConfig.triggerEvent}
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "slaConfig",
                      e.target.value,
                      "triggerEvent"
                    )
                  }
                  options={triggerEventOptions.map((event) => ({
                    value: event,
                    label: event,
                  }))}
                />

                <Input
                  label="Warning Threshold (%)"
                  type="number"
                  min="50"
                  max="95"
                  value={
                    formData.performanceTargets.slaConfig
                      .warningThresholdPercent
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "slaConfig",
                      parseInt(e.target.value) || 85,
                      "warningThresholdPercent"
                    )
                  }
                  placeholder="85"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="resetOnReassign"
                    checked={
                      formData.performanceTargets.slaConfig.resetOnReassign
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "performanceTargets",
                        "slaConfig",
                        e.target.checked,
                        "resetOnReassign"
                      )
                    }
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="resetOnReassign"
                    className="text-white text-sm"
                  >
                    Reset SLA on Reassignment
                  </label>
                </div>
              </div>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Volume Forecasting & Resource Planning
              </h3>
              <p className="text-gray-400">
                Plan capacity and resource requirements
              </p>
            </div>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Volume Forecasting
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Expected Daily Volume *"
                  type="number"
                  min="1"
                  value={
                    formData.volumeAndResources.volumeForecasting
                      .expectedDailyVolume
                  }
                  onChange={(e) => {
                    const dailyVolume = parseInt(e.target.value) || 0;
                    handleInputChange(
                      "volumeAndResources",
                      "volumeForecasting",
                      dailyVolume,
                      "expectedDailyVolume"
                    );
                    // Auto-calculate monthly volume
                    handleInputChange(
                      "volumeAndResources",
                      "volumeForecasting",
                      dailyVolume * 22,
                      "expectedMonthlyVolume"
                    );
                  }}
                  error={
                    errors[
                      "volumeAndResources.volumeForecasting.expectedDailyVolume"
                    ]
                  }
                  placeholder="100"
                />

                <Input
                  label="Expected Monthly Volume"
                  type="number"
                  min="1"
                  value={
                    formData.volumeAndResources.volumeForecasting
                      .expectedMonthlyVolume
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "volumeAndResources",
                      "volumeForecasting",
                      parseInt(e.target.value) || 0,
                      "expectedMonthlyVolume"
                    )
                  }
                  placeholder="2200"
                  disabled
                />

                <Input
                  label="Peak Season Multiplier"
                  type="number"
                  min="1"
                  max="3"
                  step="0.1"
                  value={
                    formData.volumeAndResources.volumeForecasting
                      .peakSeasonMultiplier
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "volumeAndResources",
                      "volumeForecasting",
                      parseFloat(e.target.value) || 1.2,
                      "peakSeasonMultiplier"
                    )
                  }
                  placeholder="1.2"
                />
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Resource Planning
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Planned Headcount *"
                  type="number"
                  min="1"
                  max="500"
                  value={
                    formData.volumeAndResources.resourcePlanning
                      .plannedHeadcount
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "volumeAndResources",
                      "resourcePlanning",
                      parseInt(e.target.value) || 0,
                      "plannedHeadcount"
                    )
                  }
                  error={
                    errors[
                      "volumeAndResources.resourcePlanning.plannedHeadcount"
                    ]
                  }
                  placeholder="2"
                />

                <Input
                  label="Required Role Level"
                  type="number"
                  min="1"
                  max="10"
                  value={
                    formData.volumeAndResources.resourcePlanning
                      .requiredRoleLevel
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "volumeAndResources",
                      "resourcePlanning",
                      parseInt(e.target.value) || 3,
                      "requiredRoleLevel"
                    )
                  }
                  placeholder="3"
                />

                <Input
                  label="Min Experience (Years)"
                  type="number"
                  min="0"
                  max="20"
                  value={
                    formData.volumeAndResources.resourcePlanning
                      .minExperienceYears
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "volumeAndResources",
                      "resourcePlanning",
                      parseInt(e.target.value) || 1,
                      "minExperienceYears"
                    )
                  }
                  placeholder="1"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Required Skills
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {skillOptions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        checked={formData.volumeAndResources.resourcePlanning.requiredSkills.some(
                          (s) => s.skill === skill
                        )}
                        onChange={() => handleSkillToggle(skill)}
                        className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`skill-${skill}`}
                        className="text-sm text-gray-300 cursor-pointer"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Work Allocation & QA Configuration
              </h3>
              <p className="text-gray-400">
                Configure work distribution and quality assurance
              </p>
            </div>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Allocation Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Allocation Mode *"
                  value={
                    formData.allocationAndQA.allocationConfig.allocationMode
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "allocationAndQA",
                      "allocationConfig",
                      e.target.value,
                      "allocationMode"
                    )
                  }
                  options={allocationModeOptions.map((mode) => ({
                    value: mode,
                    label: mode,
                  }))}
                />

                <Input
                  label="Max Claims Per Employee"
                  type="number"
                  min="1"
                  max="200"
                  value={
                    formData.allocationAndQA.allocationConfig.maxClaimsPerEmp
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "allocationAndQA",
                      "allocationConfig",
                      parseInt(e.target.value) || 50,
                      "maxClaimsPerEmp"
                    )
                  }
                  placeholder="50"
                />
              </div>

              <div className="mt-6">
                <h5 className="text-white font-medium mb-3">
                  Priority Formula Weights
                </h5>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Aging Weight"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      formData.allocationAndQA.allocationConfig.priorityFormula
                        .agingWeight
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "allocationAndQA",
                        "allocationConfig",
                        parseFloat(e.target.value) || 0.4,
                        "priorityFormula",
                        "agingWeight"
                      )
                    }
                    placeholder="0.4"
                  />
                  <Input
                    label="Payer Weight"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      formData.allocationAndQA.allocationConfig.priorityFormula
                        .payerWeight
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "allocationAndQA",
                        "allocationConfig",
                        parseFloat(e.target.value) || 0.3,
                        "priorityFormula",
                        "payerWeight"
                      )
                    }
                    placeholder="0.3"
                  />
                  <Input
                    label="Denial Weight"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      formData.allocationAndQA.allocationConfig.priorityFormula
                        .denialWeight
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "allocationAndQA",
                        "allocationConfig",
                        parseFloat(e.target.value) || 0.3,
                        "priorityFormula",
                        "denialWeight"
                      )
                    }
                    placeholder="0.3"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h5 className="text-white font-medium mb-3">
                  Floating Pool Configuration
                </h5>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="floatingPoolEnabled"
                      checked={
                        formData.allocationAndQA.allocationConfig
                          .floatingPoolConfig.enabled
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "allocationAndQA",
                          "allocationConfig",
                          e.target.checked,
                          "floatingPoolConfig",
                          "enabled"
                        )
                      }
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="floatingPoolEnabled"
                      className="text-white text-sm"
                    >
                      Enable Floating Pool
                    </label>
                  </div>

                  {formData.allocationAndQA.allocationConfig.floatingPoolConfig
                    .enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Max Claims in Pool"
                        type="number"
                        min="1"
                        value={
                          formData.allocationAndQA.allocationConfig
                            .floatingPoolConfig.maxClaimsInPool
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "allocationAndQA",
                            "allocationConfig",
                            parseInt(e.target.value) || 50,
                            "floatingPoolConfig",
                            "maxClaimsInPool"
                          )
                        }
                        placeholder="50"
                      />
                      <Input
                        label="Auto Reassign After (Hours)"
                        type="number"
                        min="1"
                        value={
                          formData.allocationAndQA.allocationConfig
                            .floatingPoolConfig.autoReassignAfterHours
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "allocationAndQA",
                            "allocationConfig",
                            parseInt(e.target.value) || 4,
                            "floatingPoolConfig",
                            "autoReassignAfterHours"
                          )
                        }
                        placeholder="4"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Quality Assurance Configuration
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="qaRequired"
                    checked={formData.allocationAndQA.qaConfig.qaRequired}
                    onChange={(e) =>
                      handleInputChange(
                        "allocationAndQA",
                        "qaConfig",
                        e.target.checked,
                        "qaRequired"
                      )
                    }
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="qaRequired" className="text-white text-sm">
                    QA Required
                  </label>
                </div>

                {formData.allocationAndQA.qaConfig.qaRequired && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="QA Percentage *"
                        type="number"
                        min="5"
                        max="100"
                        value={formData.allocationAndQA.qaConfig.qaPercentage}
                        onChange={(e) =>
                          handleInputChange(
                            "allocationAndQA",
                            "qaConfig",
                            parseInt(e.target.value) || 10,
                            "qaPercentage"
                          )
                        }
                        error={errors["allocationAndQA.qaConfig.qaPercentage"]}
                        placeholder="10"
                      />

                      <Input
                        label="Passing Score (%) *"
                        type="number"
                        min="70"
                        max="100"
                        value={formData.allocationAndQA.qaConfig.passingScore}
                        onChange={(e) =>
                          handleInputChange(
                            "allocationAndQA",
                            "qaConfig",
                            parseInt(e.target.value) || 85,
                            "passingScore"
                          )
                        }
                        error={errors["allocationAndQA.qaConfig.passingScore"]}
                        placeholder="85"
                      />
                    </div>

                    <div className="mt-6">
                      <h5 className="text-white font-medium mb-3">
                        Error Categories & Weightages
                      </h5>
                      <div className="space-y-3">
                        {formData.allocationAndQA.qaConfig.errorCategories.map(
                          (category, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-2 gap-4 p-3 bg-gray-700/50 rounded-lg"
                            >
                              <div>
                                <label className="text-sm text-gray-300">
                                  Category
                                </label>
                                <span className="block text-white">
                                  {category.category}
                                </span>
                              </div>
                              <Input
                                label="Weightage (%)"
                                type="number"
                                min="0"
                                max="100"
                                value={category.weightage}
                                onChange={(e) =>
                                  handleInputChange(
                                    "allocationAndQA",
                                    "qaConfig",
                                    parseInt(e.target.value) || 20,
                                    "errorCategories",
                                    index,
                                    "weightage"
                                  )
                                }
                                placeholder="20"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Notes Configuration
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useStructuredNotes"
                      checked={
                        formData.allocationAndQA.notesConfig.useStructuredNotes
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "allocationAndQA",
                          "notesConfig",
                          e.target.checked,
                          "useStructuredNotes"
                        )
                      }
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="useStructuredNotes"
                      className="text-white text-sm"
                    >
                      Use Structured Notes
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notesMandatory"
                      checked={
                        formData.allocationAndQA.notesConfig.notesMandatory
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "allocationAndQA",
                          "notesConfig",
                          e.target.checked,
                          "notesMandatory"
                        )
                      }
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="notesMandatory"
                      className="text-white text-sm"
                    >
                      Notes Mandatory
                    </label>
                  </div>
                </div>

                {formData.allocationAndQA.notesConfig.useStructuredNotes && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-white font-medium">
                        Note Categories
                      </h5>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addNoteCategory}
                        className="text-blue-400 border-blue-400"
                      >
                        Add Category
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formData.allocationAndQA.notesConfig.requiredNoteCategories.map(
                        (category, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-700/50 rounded-lg"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                label="Category Name"
                                value={category.categoryName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "allocationAndQA",
                                    "notesConfig",
                                    e.target.value,
                                    "requiredNoteCategories",
                                    index,
                                    "categoryName"
                                  )
                                }
                                placeholder="Enter category name"
                              />

                              <Select
                                label="Field Type"
                                value={category.fieldType}
                                onChange={(e) =>
                                  handleInputChange(
                                    "allocationAndQA",
                                    "notesConfig",
                                    e.target.value,
                                    "requiredNoteCategories",
                                    index,
                                    "fieldType"
                                  )
                                }
                                options={fieldTypeOptions.map((type) => ({
                                  value: type,
                                  label: type,
                                }))}
                              />

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`required-${index}`}
                                    checked={category.isRequired}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "allocationAndQA",
                                        "notesConfig",
                                        e.target.checked,
                                        "requiredNoteCategories",
                                        index,
                                        "isRequired"
                                      )
                                    }
                                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                  />
                                  <label
                                    htmlFor={`required-${index}`}
                                    className="text-white text-sm"
                                  >
                                    Required
                                  </label>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeNoteCategory(index)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>

                            {(category.fieldType === "Dropdown" ||
                              category.fieldType === "Multi-select") && (
                              <div className="mt-4">
                                <Input
                                  label="Options (comma-separated)"
                                  value={category.options.join(", ")}
                                  onChange={(e) => {
                                    const options = e.target.value
                                      .split(",")
                                      .map((opt) => opt.trim())
                                      .filter((opt) => opt);
                                    handleInputChange(
                                      "allocationAndQA",
                                      "notesConfig",
                                      options,
                                      "requiredNoteCategories",
                                      index,
                                      "options"
                                    );
                                  }}
                                  placeholder="Option 1, Option 2, Option 3"
                                />
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Timeline & System Configuration
              </h3>
              <p className="text-gray-400">
                Final configuration and timeline setup
              </p>
            </div>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                SOW Timeline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date *"
                  type="date"
                  value={formData.finalConfig.status.startDate}
                  onChange={(e) =>
                    handleInputChange(
                      "finalConfig",
                      "status",
                      e.target.value,
                      "startDate"
                    )
                  }
                  error={errors["finalConfig.status.startDate"]}
                />

                <Input
                  label="End Date (Optional)"
                  type="date"
                  value={formData.finalConfig.status.endDate}
                  onChange={(e) =>
                    handleInputChange(
                      "finalConfig",
                      "status",
                      e.target.value,
                      "endDate"
                    )
                  }
                />
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                System Configuration
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.finalConfig.systemInfo.isActive}
                      onChange={(e) =>
                        handleInputChange(
                          "finalConfig",
                          "systemInfo",
                          e.target.checked,
                          "isActive"
                        )
                      }
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-white text-sm">
                      SOW Active
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoAssignmentEnabled"
                      checked={
                        formData.finalConfig.systemInfo.autoAssignmentEnabled
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "finalConfig",
                          "systemInfo",
                          e.target.checked,
                          "autoAssignmentEnabled"
                        )
                      }
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="autoAssignmentEnabled"
                      className="text-white text-sm"
                    >
                      Auto Assignment Enabled
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isTemplate"
                      checked={formData.finalConfig.systemInfo.isTemplate}
                      onChange={(e) =>
                        handleInputChange(
                          "finalConfig",
                          "systemInfo",
                          e.target.checked,
                          "isTemplate"
                        )
                      }
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="isTemplate" className="text-white text-sm">
                      Save as Template
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Document Upload
              </h4>
              <FileUpload
                onUpload={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple={true}
                maxSize={10 * 1024 * 1024} // 10MB
                description="Upload SOW documents, contracts, or other relevant files"
              />

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-white font-medium mb-2">
                    Uploaded Files:
                  </h5>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-white text-sm">
                            {file.name}
                          </span>
                        </div>
                        <Badge variant="secondary" size="sm">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-blue-500/10 border-blue-500/30">
              <h4 className="text-blue-300 text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                SOW Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SOW Name:</span>
                    <span className="text-white font-medium">
                      {formData.basicInfo.sowName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service Type:</span>
                    <span className="text-white">
                      {formData.serviceDetails.serviceType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contract Type:</span>
                    <span className="text-white">
                      {formData.contractDetails.contractType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Billing Model:</span>
                    <span className="text-white">
                      {formData.contractDetails.billingModel}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Volume:</span>
                    <span className="text-white">
                      {
                        formData.volumeAndResources.volumeForecasting
                          .expectedDailyVolume
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Planned Headcount:</span>
                    <span className="text-white">
                      {
                        formData.volumeAndResources.resourcePlanning
                          .plannedHeadcount
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality Target:</span>
                    <span className="text-white">
                      {formData.performanceTargets.qualityBenchmark}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SLA Hours:</span>
                    <span className="text-white">
                      {formData.performanceTargets.slaConfig.slaHours}h
                    </span>
                  </div>
                </div>
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
      { number: 1, title: "Basic Info", icon: Building2 },
      { number: 2, title: "Service", icon: Settings },
      { number: 3, title: "Contract", icon: DollarSign },
      { number: 4, title: "Targets", icon: Target },
      { number: 5, title: "Resources", icon: Users },
      { number: 6, title: "QA Config", icon: Award },
      { number: 7, title: "Timeline", icon: Shield },
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
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-600 text-gray-400"
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
                    currentStep > step.number ? "bg-blue-500" : "bg-gray-600"
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
                  currentStep >= step.number ? "text-white" : "text-gray-400"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <Helmet>
        <title>SOW Intake - GetMax</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/employee/sows/list")}
              className="flex items-center space-x-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to SOWs</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">SOW Intake</h1>
              <p className="text-gray-400 text-lg">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Content */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-8">
          {renderStepContent()}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 text-gray-300 border-gray-600 hover:border-gray-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/employee/sows/list")}
              className="text-gray-400 hover:text-white"
            >
              Save as Draft
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Creating..." : "Create SOW"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOWIntake;
