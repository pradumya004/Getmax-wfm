import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  FileText,
  DollarSign,
  Target,
  BarChart3,
  Users,
  Shield,
  Settings,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Plus,
  Minus,
  Clock,
  Zap,
  Star,
  Calendar,
  Globe,
  Activity,
  TrendingUp,
  Award,
  Briefcase,
  Package,
  Layers,
  Database,
  Filter,
  Search,
  Eye,
  Edit,
  Save,
  Send,
  ChevronRight,
  ChevronLeft,
  Info,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Checkbox } from "../../components/ui/Checkbox.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { useSOWs } from '../../hooks/useSows.jsx';
import { useClients } from "../../hooks/useClient.jsx";

const SOWIntake = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);
  // console.log("Current Theme:", theme);
  
  const { addSOW } = useSOWs();
  const { clients, loadClients } = useClients();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const totalSteps = 7;

  // Initialize form data with SOW model structure
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    basicInfo: {
      sowName: "",
      sowDescription: "",
      clientRef: "",
    },
    // Step 2: Service Details
    serviceDetails: {
      serviceType: "",
      serviceSubType: "",
      scopeFormatId: "EMSMC",
    },
    // Step 3: Contract Details
    contractDetails: {
      contractType: "Transactional",
      billingModel: "Per Transaction",
      ratePerTransaction: 0,
      monthlyFixedRate: 0,
      currency: "USD",
    },
    // Step 4: Performance Targets
    performanceTargets: {
      dailyTargetPerEmp: 0,
      qualityBenchmark: 95,
      slaConfig: {
        slaHours: 24,
        slaDescription: "",
        penaltyConfig: {
          penaltyEnabled: false,
          penaltyPercentage: 0,
          maxPenaltyAmount: 0,
        },
      },
    },
    // Step 5: Volume & Resources
    volumeAndResources: {
      volumeForecasting: {
        expectedDailyVolume: 0,
        expectedMonthlyVolume: 0,
        peakSeasonMultiplier: 1.2,
        seasonalVariations: [],
      },
      resourcePlanning: {
        plannedHeadcount: 1,
        requiredSkills: [],
        requiredRoleLevel: 1,
        budgetedCostPerMonth: 0,
      },
    },
    // Step 6: Allocation & QA
    allocationAndQA: {
      allocationConfig: {
        autoAssignmentEnabled: true,
        priorityFormula: {
          agingWeight: 0.4,
          payerWeight: 0.3,
          denialWeight: 0.3,
        },
        workLoadBalancing: {
          maxClaimsPerEmployee: 50,
          balancingStrategy: "Even Distribution",
        },
      },
      qaConfig: {
        qaPercentage: 10,
        passingScore: 90,
        qaFrequency: "Daily",
        qaTemplate: "",
      },
      notesConfig: {
        noteTemplate: "",
        mandatoryFields: [],
        autoSaveInterval: 30,
      },
    },
    // Step 7: Final Configuration
    finalConfig: {
      status: {
        sowStatus: "Draft",
        startDate: "",
        endDate: "",
        statusReason: "",
      },
      systemInfo: {
        isActive: true,
        autoAssignmentEnabled: true,
        requiresApproval: false,
      },
    },
  });

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

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

  const scopeFormatOptions = [
    "EMSMC",
    "ClaimMD",
    "Medisoft",
    "Epic",
    "Cerner",
    "AllScripts",
    "Other",
  ];

  const contractTypeOptions = ["End-to-End", "Transactional", "FTE", "Hybrid"];

  const billingModelOptions = [
    "Per Transaction",
    "Monthly Fixed",
    "Hourly",
    "Performance Based",
  ];

  const currencyOptions = ["USD", "INR", "EUR", "GBP", "CAD", "AED"];

  const balancingStrategyOptions = [
    "Even Distribution",
    "Skill Based",
    "Performance Based",
    "Random Assignment",
  ];

  const qaFrequencyOptions = ["Daily", "Weekly", "Bi-weekly", "Monthly"];

  const statusOptions = [
    "Draft",
    "Active",
    "Inactive",
    "Suspended",
    "Completed",
  ];

  // Handle input changes
  const handleInputChange = (section, field, value, subField = null) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (subField) {
        if (!newData[section][field]) {
          newData[section][field] = {};
        }
        newData[section][field][subField] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });

    // Clear errors for this field
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

  // Handle array field changes (skills, variations)
  const handleArrayFieldChange = (
    section,
    field,
    index,
    value,
    subField = null
  ) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (!newData[section][field]) {
        newData[section][field] = [];
      }
      if (subField) {
        if (!newData[section][field][index]) {
          newData[section][field][index] = {};
        }
        newData[section][field][index][subField] = value;
      } else {
        newData[section][field][index] = value;
      }
      return newData;
    });
  };

  // Add/Remove array items
  const addArrayItem = (section, field, defaultItem = {}) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (!newData[section][field]) {
        newData[section][field] = [];
      }
      newData[section][field].push(defaultItem);
      return newData;
    });
  };

  const removeArrayItem = (section, field, index) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (newData[section][field]) {
        newData[section][field].splice(index, 1);
      }
      return newData;
    });
  };

  // Validation
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
        "basicInfo.clientRef": {
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
          default: 0,
          message: "Monthly fixed rate is required and must be positive",
        },
      },
      4: {
        "performanceTargets.dailyTargetPerEmp": {
          required: true,
          min: 1,
          default: 1,
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
          default: 24,
          max: 168,
          message: "SLA hours must be between 1 and 168",
        },
      },
      5: {
        "volumeAndResources.volumeForecasting.expectedDailyVolume": {
          required: true,
          default: 1,
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

  // Navigation
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      // Prepare final data according to SOW model structure
      const finalData = {
        sowName: formData.basicInfo.sowName,
        sowDescription: formData.basicInfo.sowDescription,
        clientRef: formData.basicInfo.clientRef,
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
      navigate("/company/sows/list");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create SOW. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // File upload handler
  const handleFileUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderServiceDetails();
      case 3:
        return renderContractDetails();
      case 4:
        return renderPerformanceTargets();
      case 5:
        return renderVolumeAndResources();
      case 6:
        return renderAllocationAndQA();
      case 7:
        return renderFinalConfiguration();
      default:
        return null;
    }
  };

  // Step 1: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <Building2 className={`w-8 h-8 text-${theme.accent}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          SOW Basic Information
        </h3>
        <p className={`text-${theme.textSecondary}`}>
          Let's start with the basic details about your Statement of Work
        </p>
      </div>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          SOW Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="SOW Name *"
              value={formData.basicInfo.sowName}
              onChange={(e) =>
                handleInputChange("basicInfo", "sowName", e.target.value)
              }
              error={errors["basicInfo.sowName"]}
              placeholder="Enter SOW name"
            />
          </div>

          <div className="md:col-span-2">
            <Select
              label="Client *"
              value={formData.basicInfo.clientRef}
              onChange={(e) =>
                handleInputChange("basicInfo", "clientRef", e.target.value)
              }
              options={clients.map((client) => ({
                value: client._id,
                label: `${client.clientInfo.clientName} (${client.clientInfo.clientType})`,
              }))}
              error={errors["basicInfo.clientRef"]}
              placeholder="Select a client"
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="SOW Description *"
              value={formData.basicInfo.sowDescription}
              onChange={(e) =>
                handleInputChange("basicInfo", "sowDescription", e.target.value)
              }
              error={errors["basicInfo.sowDescription"]}
              placeholder="Describe the scope and objectives of this SOW..."
              rows={4}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  // Step 2: Service Details
  const renderServiceDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <FileText className={`w-8 h-8 text-${theme.accent}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Service Details</h3>
        <p className={`text-${theme.textSecondary}`}>
          Define the type of services and technical requirements
        </p>
      </div>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Service Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Service Type *"
            value={formData.serviceDetails.serviceType}
            onChange={(e) =>
              handleInputChange("serviceDetails", "serviceType", e.target.value)
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
            placeholder="e.g., Specialist AR, Complex Coding"
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
      </Card>
    </div>
  );

  // Step 3: Contract Details
  const renderContractDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <DollarSign className={`w-8 h-8 text-${theme.accent}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Contract & Billing
        </h3>
        <p className={`text-${theme.textSecondary}`}>
          Configure contract type and billing structure
        </p>
      </div>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Contract Configuration
        </h3>
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
              step="0.01"
              value={formData.contractDetails.monthlyFixedRate}
              onChange={(e) =>
                handleInputChange(
                  "contractDetails",
                  "monthlyFixedRate",
                  parseFloat(e.target.value)
                )
              }
              error={errors["contractDetails.monthlyFixedRate"]}
              placeholder="0.00"
            />
          )}

          <Select
            label="Currency"
            value={formData.contractDetails.currency}
            onChange={(e) =>
              handleInputChange("contractDetails", "currency", e.target.value)
            }
            options={currencyOptions.map((currency) => ({
              value: currency,
              label: currency,
            }))}
          />
        </div>
      </Card>
    </div>
  );

  // Step 4: Performance Targets
  const renderPerformanceTargets = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <Target className={`w-8 h-8 text-${theme.accent}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Performance Targets
        </h3>
        <p className={`text-${theme.textSecondary}`}>
          Set performance benchmarks and SLA requirements
        </p>
      </div>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Daily Target Per Employee *"
            type="number"
            value={formData.performanceTargets.dailyTargetPerEmp}
            onChange={(e) =>
              handleInputChange(
                "performanceTargets",
                "dailyTargetPerEmp",
                parseInt(e.target.value)
              )
            }
            error={errors["performanceTargets.dailyTargetPerEmp"]}
            placeholder="Number of tasks/claims per day"
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
                parseInt(e.target.value) || 95
              )
            }
            error={errors["performanceTargets.qualityBenchmark"]}
            placeholder="95"
          />
        </div>
      </Card>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          SLA Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                parseInt(e.target.value),
                "slaHours"
              )
            }
            error={errors["performanceTargets.slaConfig.slaHours"]}
            placeholder="24"
          />

          <Textarea
            label="SLA Description"
            value={formData.performanceTargets.slaConfig.slaDescription}
            onChange={(e) =>
              handleInputChange(
                "performanceTargets",
                "slaConfig",
                e.target.value,
                "slaDescription"
              )
            }
            placeholder="Describe SLA requirements..."
            rows={3}
          />

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <label className="text-white font-medium">
                Penalty Configuration
              </label>
              <Checkbox
                checked={
                  formData.performanceTargets.slaConfig.penaltyConfig
                    .penaltyEnabled
                }
                onChange={(checked) =>
                  handleInputChange(
                    "performanceTargets",
                    "slaConfig",
                    checked,
                    "penaltyConfig.penaltyEnabled"
                  )
                }
                label="Enable Penalty"
                theme={theme}
              />
            </div>

            {formData.performanceTargets.slaConfig.penaltyConfig
              .penaltyEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Penalty Percentage (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={
                    formData.performanceTargets.slaConfig.penaltyConfig
                      .penaltyPercentage
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "slaConfig",
                      parseFloat(e.target.value) || 0,
                      "penaltyConfig.penaltyPercentage"
                    )
                  }
                  placeholder="5"
                />

                <Input
                  label="Max Penalty Amount"
                  type="number"
                  step="0.01"
                  value={
                    formData.performanceTargets.slaConfig.penaltyConfig
                      .maxPenaltyAmount
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "performanceTargets",
                      "slaConfig",
                      parseFloat(e.target.value) || 0,
                      "penaltyConfig.maxPenaltyAmount"
                    )
                  }
                  placeholder="1000.00"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  // Step 5: Volume & Resources
  const renderVolumeAndResources = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <BarChart3 className={`w-8 h-8 text-${theme.accent}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Volume & Resources
        </h3>
        <p className={`text-${theme.textSecondary}`}>
          Define volume forecasting and resource planning
        </p>
      </div>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Volume Forecasting
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Expected Daily Volume *"
            type="number"
            value={
              formData.volumeAndResources.volumeForecasting.expectedDailyVolume
            }
            onChange={(e) => {
              const dailyVolume = parseInt(e.target.value);
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
              errors["volumeAndResources.volumeForecasting.expectedDailyVolume"]
            }
            placeholder="Number of claims/tasks per day"
          />

          <Input
            label="Expected Monthly Volume"
            type="number"
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
            placeholder="Auto-calculated"
            disabled
          />

          <Input
            label="Peak Season Multiplier"
            type="number"
            step="0.1"
            min="1"
            max="5"
            value={
              formData.volumeAndResources.volumeForecasting.peakSeasonMultiplier
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

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-white font-medium">
              Seasonal Variations
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              theme={theme}
              onClick={() =>
                addArrayItem(
                  "volumeAndResources",
                  "volumeForecasting.seasonalVariations",
                  {
                    season: "",
                    multiplier: 1.0,
                    description: "",
                  }
                )
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Variation
            </Button>
          </div>

          {formData.volumeAndResources.volumeForecasting.seasonalVariations?.map(
            (variation, index) => (
              <div key={index} className="flex items-center space-x-4 mb-3">
                <Input
                  placeholder="Season (e.g., Q4)"
                  value={variation.season}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "volumeAndResources",
                      "volumeForecasting.seasonalVariations",
                      index,
                      e.target.value,
                      "season"
                    )
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Multiplier"
                  value={variation.multiplier}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "volumeAndResources",
                      "volumeForecasting.seasonalVariations",
                      index,
                      parseFloat(e.target.value) || 1.0,
                      "multiplier"
                    )
                  }
                  className="w-24"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeArrayItem(
                      "volumeAndResources",
                      "volumeForecasting.seasonalVariations",
                      index
                    )
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )
          )}
        </div>
      </Card>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Resource Planning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Planned Headcount *"
            type="number"
            min="1"
            max="500"
            value={
              formData.volumeAndResources.resourcePlanning.plannedHeadcount
            }
            onChange={(e) =>
              handleInputChange(
                "volumeAndResources",
                "resourcePlanning",
                parseInt(e.target.value) || 1,
                "plannedHeadcount"
              )
            }
            error={
              errors["volumeAndResources.resourcePlanning.plannedHeadcount"]
            }
            placeholder="Number of employees needed"
          />

          <Input
            label="Required Role Level"
            type="number"
            min="1"
            max="10"
            value={
              formData.volumeAndResources.resourcePlanning.requiredRoleLevel
            }
            onChange={(e) =>
              handleInputChange(
                "volumeAndResources",
                "resourcePlanning",
                parseInt(e.target.value) || 1,
                "requiredRoleLevel"
              )
            }
            placeholder="Minimum role level (1-10)"
          />

          <Input
            label="Budgeted Cost Per Month"
            type="number"
            step="0.01"
            value={
              formData.volumeAndResources.resourcePlanning.budgetedCostPerMonth
            }
            onChange={(e) =>
              handleInputChange(
                "volumeAndResources",
                "resourcePlanning",
                parseFloat(e.target.value) || 0,
                "budgetedCostPerMonth"
              )
            }
            placeholder="0.00"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-white font-medium">Required Skills</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              theme={theme}
              onClick={() =>
                addArrayItem(
                  "volumeAndResources",
                  "resourcePlanning.requiredSkills",
                  {
                    skill: "",
                    proficiencyLevel: "Intermediate",
                    mandatory: true,
                  }
                )
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>

          {formData.volumeAndResources.resourcePlanning.requiredSkills?.map(
            (skill, index) => (
              <div key={index} className="flex items-center space-x-4 mb-3">
                <Input
                  placeholder="Skill name"
                  value={skill.skill}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "volumeAndResources",
                      "resourcePlanning.requiredSkills",
                      index,
                      e.target.value,
                      "skill"
                    )
                  }
                  className="flex-1"
                />
                <Select
                  value={skill.proficiencyLevel}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "volumeAndResources",
                      "resourcePlanning.requiredSkills",
                      index,
                      e.target.value,
                      "proficiencyLevel"
                    )
                  }
                  options={[
                    { value: "Beginner", label: "Beginner" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced" },
                    { value: "Expert", label: "Expert" },
                  ]}
                  className="w-32"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeArrayItem(
                      "volumeAndResources",
                      "resourcePlanning.requiredSkills",
                      index
                    )
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );

  // Step 6: Allocation & QA
  const renderAllocationAndQA = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <Users className={`w-8 h-8 text-${theme.accent}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Allocation & Quality
        </h3>
        <p className={`text-${theme.textSecondary}`}>
          Configure work allocation and quality assurance settings
        </p>
      </div>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Work Allocation Configuration
        </h3>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-white font-medium">
              Auto Assignment Enabled
            </label>
            <Checkbox
              checked={
                formData.allocationAndQA.allocationConfig.autoAssignmentEnabled
              }
              onChange={(checked) =>
                handleInputChange(
                  "allocationAndQA",
                  "allocationConfig",
                  checked,
                  "autoAssignmentEnabled"
                )
              }
              label="Enable Auto Assignment"
              theme={theme}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-white font-medium mb-2 block">
              Priority Formula Weights
            </label>
            <div className="space-y-3">
              <Input
                label="Aging Weight"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={
                  formData.allocationAndQA.allocationConfig.priorityFormula
                    .agingWeight
                }
                onChange={(e) =>
                  handleInputChange(
                    "allocationAndQA",
                    "allocationConfig",
                    parseFloat(e.target.value) || 0.4,
                    "priorityFormula.agingWeight"
                  )
                }
                placeholder="0.4"
              />
              <Input
                label="Payer Weight"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={
                  formData.allocationAndQA.allocationConfig.priorityFormula
                    .payerWeight
                }
                onChange={(e) =>
                  handleInputChange(
                    "allocationAndQA",
                    "allocationConfig",
                    parseFloat(e.target.value) || 0.3,
                    "priorityFormula.payerWeight"
                  )
                }
                placeholder="0.3"
              />
              <Input
                label="Denial Weight"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={
                  formData.allocationAndQA.allocationConfig.priorityFormula
                    .denialWeight
                }
                onChange={(e) =>
                  handleInputChange(
                    "allocationAndQA",
                    "allocationConfig",
                    parseFloat(e.target.value) || 0.3,
                    "priorityFormula.denialWeight"
                  )
                }
                placeholder="0.3"
              />
            </div>
          </div>

          <div>
            <label className="text-white font-medium mb-2 block">
              Workload Balancing
            </label>
            <div className="space-y-3">
              <Input
                label="Max Claims Per Employee"
                type="number"
                min="1"
                max="200"
                value={
                  formData.allocationAndQA.allocationConfig.workLoadBalancing
                    .maxClaimsPerEmployee
                }
                onChange={(e) =>
                  handleInputChange(
                    "allocationAndQA",
                    "allocationConfig",
                    parseInt(e.target.value) || 50,
                    "workLoadBalancing.maxClaimsPerEmployee"
                  )
                }
                placeholder="50"
              />
              <Select
                label="Balancing Strategy"
                value={
                  formData.allocationAndQA.allocationConfig.workLoadBalancing
                    .balancingStrategy
                }
                onChange={(e) =>
                  handleInputChange(
                    "allocationAndQA",
                    "allocationConfig",
                    e.target.value,
                    "workLoadBalancing.balancingStrategy"
                  )
                }
                options={balancingStrategyOptions.map((strategy) => ({
                  value: strategy,
                  label: strategy,
                }))}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Quality Assurance Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="QA Percentage (%) *"
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
                parseInt(e.target.value) || 90,
                "passingScore"
              )
            }
            error={errors["allocationAndQA.qaConfig.passingScore"]}
            placeholder="90"
          />

          <Select
            label="QA Frequency"
            value={formData.allocationAndQA.qaConfig.qaFrequency}
            onChange={(e) =>
              handleInputChange(
                "allocationAndQA",
                "qaConfig",
                e.target.value,
                "qaFrequency"
              )
            }
            options={qaFrequencyOptions.map((freq) => ({
              value: freq,
              label: freq,
            }))}
          />

          <Textarea
            label="QA Template"
            value={formData.allocationAndQA.qaConfig.qaTemplate}
            onChange={(e) =>
              handleInputChange(
                "allocationAndQA",
                "qaConfig",
                e.target.value,
                "qaTemplate"
              )
            }
            placeholder="QA checklist or template..."
            rows={3}
          />
        </div>
      </Card>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Notes Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Auto-Save Interval (seconds)"
            type="number"
            min="10"
            max="300"
            value={formData.allocationAndQA.notesConfig.autoSaveInterval}
            onChange={(e) =>
              handleInputChange(
                "allocationAndQA",
                "notesConfig",
                parseInt(e.target.value) || 30,
                "autoSaveInterval"
              )
            }
            placeholder="30"
          />

          <Textarea
            label="Note Template"
            value={formData.allocationAndQA.notesConfig.noteTemplate}
            onChange={(e) =>
              handleInputChange(
                "allocationAndQA",
                "notesConfig",
                e.target.value,
                "noteTemplate"
              )
            }
            placeholder="Default note template..."
            rows={3}
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-white font-medium">
              Mandatory Note Fields
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              theme={theme}
              onClick={() =>
                addArrayItem(
                  "allocationAndQA",
                  "notesConfig.mandatoryFields",
                  ""
                )
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>

          {formData.allocationAndQA.notesConfig.mandatoryFields?.map(
            (field, index) => (
              <div key={index} className="flex items-center space-x-4 mb-3">
                <Input
                  placeholder="Field name"
                  value={field}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "allocationAndQA",
                      "notesConfig.mandatoryFields",
                      index,
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeArrayItem(
                      "allocationAndQA",
                      "notesConfig.mandatoryFields",
                      index
                    )
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );

  // Step 7: Final Configuration
  const renderFinalConfiguration = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <Settings className={`w-8 h-8 text-${theme.accent}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Final Configuration
        </h3>
        <p className={`text-${theme.textSecondary}`}>
          Complete the SOW setup with status and system settings
        </p>
      </div>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          SOW Status Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="SOW Status"
            value={formData.finalConfig.status.sowStatus}
            onChange={(e) =>
              handleInputChange(
                "finalConfig",
                "status",
                e.target.value,
                "sowStatus"
              )
            }
            options={statusOptions.map((status) => ({
              value: status,
              label: status,
            }))}
          />

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
            label="End Date"
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

          <Textarea
            label="Status Reason"
            value={formData.finalConfig.status.statusReason}
            onChange={(e) =>
              handleInputChange(
                "finalConfig",
                "status",
                e.target.value,
                "statusReason"
              )
            }
            placeholder="Reason for current status..."
            rows={3}
          />
        </div>
      </Card>

      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          System Configuration
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Active Status</label>
              <p className={`text-sm text-${theme.textSecondary}`}>
                Enable this SOW for claim processing
              </p>
            </div>
            <Checkbox
              checked={formData.finalConfig.systemInfo.isActive}
              onChange={(checked) =>
                handleInputChange(
                  "finalConfig",
                  "systemInfo",
                  checked,
                  "isActive"
                )
              }
              label="Active"
              theme={theme}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Auto Assignment</label>
              <p className={`text-sm text-${theme.textSecondary}`}>
                Automatically assign claims to employees
              </p>
            </div>
            <Checkbox
              checked={formData.finalConfig.systemInfo.autoAssignmentEnabled}
              onChange={(checked) =>
                handleInputChange(
                  "finalConfig",
                  "systemInfo",
                  checked,
                  "autoAssignmentEnabled"
                )
              }
              label="Enable Auto Assignment"
              theme={theme}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">
                Requires Approval
              </label>
              <p className={`text-sm text-${theme.textSecondary}`}>
                SOW changes require management approval
              </p>
            </div>
            <Checkbox
              checked={formData.finalConfig.systemInfo.requiresApproval}
              onChange={(checked) =>
                handleInputChange(
                  "finalConfig",
                  "systemInfo",
                  checked,
                  "requiresApproval"
                )
              }
              label="Requires Approval"
              theme={theme}
            />
          </div>
        </div>
      </Card>

      {/* File Upload Section */}
      <Card className={`${theme.card} p-6`}>
        <h3 className="text-white text-lg font-semibold mb-6">
          Supporting Documents
        </h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 mb-2">
              Drag & drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX
            </p>
            <Button
              type="button"
              variant="outline"
              theme={theme}
              className="mt-4"
              onClick={() => {
                // File upload logic would go here
                handleFileUpload([{ name: "sample.pdf", size: "1.2 MB" }]);
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Uploaded Files:</h4>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 p-3 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-white">{file.name}</span>
                    <span className="text-gray-400 text-sm">{file.size}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setUploadedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className={`bg-${theme.background} min-h-screen p-6`}>
      <Helmet>
        <title>SOW Intake - GetMax</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/company/sows/list")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">SOW Intake</h1>
            <p className="text-emerald-200">
              Create a new Statement of Work for client services
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className={`${theme.card} p-6 mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">
              Step {currentStep} of {totalSteps}
            </h2>
            <span className="text-emerald-400 font-medium">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="h-2"
            indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-500"
          />
          <div className="flex justify-between mt-4 text-sm">
            {[
              "Basic Info",
              "Service Details",
              "Contract",
              "Performance",
              "Volume & Resources",
              "Allocation & QA",
              "Final Config",
            ].map((step, index) => (
              <span
                key={index}
                className={`${
                  index + 1 <= currentStep
                    ? "text-emerald-400"
                    : "text-gray-500"
                } ${index + 1 === currentStep ? "font-semibold" : ""}`}
              >
                {step}
              </span>
            ))}
          </div>
        </Card>

        {/* Step Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <Card className={`${theme.card} p-6`}>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              theme={theme}
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-4">
              {/* Draft Save Button */}
              <Button
                variant="ghost"
                theme={theme}
                onClick={() => {
                  // Save as draft logic
                  toast.success("Draft saved successfully!");
                }}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  theme={theme}
                  onClick={handleNext}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  theme={theme}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating SOW...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Create SOW</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <Card className={`${theme.card} p-4 mt-4 border-red-500/50`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <h4 className="text-red-400 font-medium mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="space-y-1 text-sm text-red-300">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>• {message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SOWIntake;
