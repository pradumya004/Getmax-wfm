// frontend/src/pages/sow/SOWEdit.jsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Minus,
  Upload,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings,
  Users,
  Target,
  DollarSign,
  BarChart3,
  Shield,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Checkbox } from "../../components/ui/Checkbox.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs.jsx";
import { SOWStatusBadge } from "../../components/sow/SOWStatusBadge.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { useSOWs } from "../../hooks/useSows.jsx";
import { useClients } from "../../hooks/useClient.jsx";

const SOWEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { getSOW, updateSOW } = useSOWs();
  const { clients, fetchClients } = useClients();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    sowName: "",
    sowDescription: "",
    clientRef: "",
    serviceDetails: {
      serviceType: "",
      serviceSubType: "",
      scopeFormatId: "EMSMC",
    },
    contractDetails: {
      contractType: "Transactional",
      billingModel: "Per Transaction",
      ratePerTransaction: 0,
      monthlyFixedRate: 0,
      currency: "USD",
    },
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
  });

  // Load SOW data
  useEffect(() => {
    const loadSOWData = async () => {
      try {
        setLoading(true);
        const [sowData] = await Promise.all([getSOW(id), fetchClients()]);
        setFormData(sowData);
      } catch (error) {
        console.error("Failed to load SOW data:", error);
        toast.error("Failed to load SOW data");
        navigate("/company/sow/list");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSOWData();
    }
  }, [id, getSOW, fetchClients, navigate]);

  const handleInputChange = (section, field, value, subField = null) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (subField) {
        if (!newData[section][field]) {
          newData[section][field] = {};
        }
        newData[section][field][subField] = value;
      } else if (section) {
        newData[section][field] = value;
      } else {
        newData[field] = value;
      }
      return newData;
    });

    // Clear errors for this field
    const errorKey = subField
      ? `${section}.${field}.${subField}`
      : section
      ? `${section}.${field}`
      : field;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }));
    }
  };

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sowName?.trim()) {
      newErrors["sowName"] = "SOW name is required";
    }
    if (!formData.clientRef) {
      newErrors["clientRef"] = "Client selection is required";
    }
    if (!formData.serviceDetails?.serviceType) {
      newErrors["serviceDetails.serviceType"] = "Service type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setSaving(true);
    try {
      await updateSOW(id, formData);
      toast.success("SOW updated successfully!");
      navigate(`/company/sow/details/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update SOW. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <span className="ml-3 text-white">Loading SOW data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 p-6">
      <Helmet>
        <title>Edit SOW - {formData.sowName} - GetMax</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/company/sow/list")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-white">Edit SOW</h1>
                <SOWStatusBadge
                  status={formData.status?.sowStatus || "Draft"}
                />
              </div>
              <p className="text-emerald-200">
                SOW ID: {formData.sowId} • {formData.sowName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              theme={theme}
              onClick={() => navigate(`/company/sow/details/${id}`)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button theme={theme} onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 rounded-lg p-1">
            <TabsTrigger
              value="basic"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger
              value="service"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Service
            </TabsTrigger>
            <TabsTrigger
              value="contract"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Contract
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Resources
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Configuration
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card className={`${theme.card} p-6`}>
              <h3 className="text-white text-lg font-semibold mb-6">
                Basic Information
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="SOW Name *"
                    value={formData.sowName}
                    onChange={(e) =>
                      handleInputChange(null, "sowName", e.target.value)
                    }
                    error={errors["sowName"]}
                    placeholder="Enter SOW name"
                  />

                  <Select
                    label="Client *"
                    value={formData.clientRef}
                    onChange={(e) =>
                      handleInputChange(null, "clientRef", e.target.value)
                    }
                    options={clients.map((client) => ({
                      value: client._id,
                      label: `${client.clientInfo.clientName} (${client.clientInfo.clientType})`,
                    }))}
                    error={errors["clientRef"]}
                  />
                </div>

                <Textarea
                  label="SOW Description"
                  value={formData.sowDescription}
                  onChange={(e) =>
                    handleInputChange(null, "sowDescription", e.target.value)
                  }
                  placeholder="Describe the scope and objectives of this SOW..."
                  rows={4}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    label="SOW Status"
                    value={formData.status.sowStatus}
                    onChange={(e) =>
                      handleInputChange("status", "sowStatus", e.target.value)
                    }
                    options={[
                      { value: "Draft", label: "Draft" },
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                      { value: "Suspended", label: "Suspended" },
                      { value: "Completed", label: "Completed" },
                    ]}
                  />

                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.status.startDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleInputChange("status", "startDate", e.target.value)
                    }
                  />

                  <Input
                    label="End Date"
                    type="date"
                    value={formData.status.endDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleInputChange("status", "endDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Service Details Tab */}
          <TabsContent value="service">
            <Card className={`${theme.card} p-6`}>
              <h3 className="text-white text-lg font-semibold mb-6">
                Service Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  options={[
                    "AR Calling",
                    "Medical Coding",
                    "Prior Authorization",
                    "Eligibility Verification",
                    "Charge Entry",
                    "Payment Posting",
                    "Denial Management",
                    "Quality Assurance",
                    "Custom Service",
                  ].map((type) => ({ value: type, label: type }))}
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
                  label="Scope Format ID"
                  value={formData.serviceDetails.scopeFormatId}
                  onChange={(e) =>
                    handleInputChange(
                      "serviceDetails",
                      "scopeFormatId",
                      e.target.value
                    )
                  }
                  options={[
                    "EMSMC",
                    "ClaimMD",
                    "Medisoft",
                    "Epic",
                    "Cerner",
                    "AllScripts",
                    "Other",
                  ].map((format) => ({ value: format, label: format }))}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Contract Details Tab */}
          <TabsContent value="contract">
            <Card className={`${theme.card} p-6`}>
              <h3 className="text-white text-lg font-semibold mb-6">
                Contract & Billing
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    label="Contract Type"
                    value={formData.contractDetails.contractType}
                    onChange={(e) =>
                      handleInputChange(
                        "contractDetails",
                        "contractType",
                        e.target.value
                      )
                    }
                    options={[
                      "End-to-End",
                      "Transactional",
                      "FTE",
                      "Hybrid",
                    ].map((type) => ({
                      value: type,
                      label: type,
                    }))}
                  />

                  <Select
                    label="Billing Model"
                    value={formData.contractDetails.billingModel}
                    onChange={(e) =>
                      handleInputChange(
                        "contractDetails",
                        "billingModel",
                        e.target.value
                      )
                    }
                    options={[
                      "Per Transaction",
                      "Monthly Fixed",
                      "Hourly",
                      "Performance Based",
                    ].map((model) => ({ value: model, label: model }))}
                  />

                  <Select
                    label="Currency"
                    value={formData.contractDetails.currency}
                    onChange={(e) =>
                      handleInputChange(
                        "contractDetails",
                        "currency",
                        e.target.value
                      )
                    }
                    options={["USD", "INR", "EUR", "GBP", "CAD", "AED"].map(
                      (currency) => ({
                        value: currency,
                        label: currency,
                      })
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Rate Per Transaction"
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
                    placeholder="0.00"
                  />

                  <Input
                    label="Monthly Fixed Rate"
                    type="number"
                    step="0.01"
                    value={formData.contractDetails.monthlyFixedRate}
                    onChange={(e) =>
                      handleInputChange(
                        "contractDetails",
                        "monthlyFixedRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="space-y-6">
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  Performance Targets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Daily Target Per Employee"
                    type="number"
                    value={formData.performanceTargets.dailyTargetPerEmp}
                    onChange={(e) =>
                      handleInputChange(
                        "performanceTargets",
                        "dailyTargetPerEmp",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Number of tasks/claims per day"
                  />

                  <Input
                    label="Quality Benchmark (%)"
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
                    placeholder="95"
                  />
                </div>
              </Card>

              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  SLA Configuration
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="SLA Hours"
                      type="number"
                      min="1"
                      max="168"
                      value={formData.performanceTargets.slaConfig.slaHours}
                      onChange={(e) =>
                        handleInputChange(
                          "performanceTargets",
                          "slaConfig",
                          parseInt(e.target.value) || 24,
                          "slaHours"
                        )
                      }
                      placeholder="24"
                    />

                    <Textarea
                      label="SLA Description"
                      value={
                        formData.performanceTargets.slaConfig.slaDescription
                      }
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
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-white font-medium">
                        Penalty Configuration
                      </label>
                      <Checkbox
                        checked={
                          formData.performanceTargets.slaConfig.penaltyConfig
                            .penaltyEnabled
                        }
                        theme={theme}
                        onChange={(checked) =>
                          handleInputChange(
                            "performanceTargets",
                            "slaConfig",
                            checked,
                            "penaltyConfig.penaltyEnabled"
                          )
                        }
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
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="space-y-6">
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  Volume Forecasting
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Expected Daily Volume"
                    type="number"
                    min="1"
                    value={formData.volumeForecasting.expectedDailyVolume}
                    onChange={(e) => {
                      const dailyVolume = parseInt(e.target.value) || 0;
                      handleInputChange(
                        "volumeForecasting",
                        "expectedDailyVolume",
                        dailyVolume
                      );
                      handleInputChange(
                        "volumeForecasting",
                        "expectedMonthlyVolume",
                        dailyVolume * 22
                      );
                    }}
                    placeholder="Number of claims/tasks per day"
                  />

                  <Input
                    label="Expected Monthly Volume"
                    type="number"
                    value={formData.volumeForecasting.expectedMonthlyVolume}
                    placeholder="Auto-calculated"
                    disabled
                  />

                  <Input
                    label="Peak Season Multiplier"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.volumeForecasting.peakSeasonMultiplier}
                    onChange={(e) =>
                      handleInputChange(
                        "volumeForecasting",
                        "peakSeasonMultiplier",
                        parseFloat(e.target.value) || 1.2
                      )
                    }
                    placeholder="1.2"
                  />
                </div>
              </Card>

              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  Resource Planning
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Planned Headcount"
                    type="number"
                    min="1"
                    max="500"
                    value={formData.resourcePlanning.plannedHeadcount}
                    onChange={(e) =>
                      handleInputChange(
                        "resourcePlanning",
                        "plannedHeadcount",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="Number of employees needed"
                  />

                  <Input
                    label="Required Role Level"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.resourcePlanning.requiredRoleLevel}
                    onChange={(e) =>
                      handleInputChange(
                        "resourcePlanning",
                        "requiredRoleLevel",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="Minimum role level (1-10)"
                  />

                  <Input
                    label="Budgeted Cost Per Month"
                    type="number"
                    step="0.01"
                    value={formData.resourcePlanning.budgetedCostPerMonth}
                    onChange={(e) =>
                      handleInputChange(
                        "resourcePlanning",
                        "budgetedCostPerMonth",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config">
            <div className="space-y-6">
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  QA Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="QA Percentage (%)"
                    type="number"
                    min="5"
                    max="100"
                    value={formData.qaConfig.qaPercentage}
                    onChange={(e) =>
                      handleInputChange(
                        "qaConfig",
                        "qaPercentage",
                        parseInt(e.target.value) || 10
                      )
                    }
                    placeholder="10"
                  />

                  <Input
                    label="Passing Score (%)"
                    type="number"
                    min="70"
                    max="100"
                    value={formData.qaConfig.passingScore}
                    onChange={(e) =>
                      handleInputChange(
                        "qaConfig",
                        "passingScore",
                        parseInt(e.target.value) || 90
                      )
                    }
                    placeholder="90"
                  />

                  <Select
                    label="QA Frequency"
                    value={formData.qaConfig.qaFrequency}
                    onChange={(e) =>
                      handleInputChange(
                        "qaConfig",
                        "qaFrequency",
                        e.target.value
                      )
                    }
                    options={["Daily", "Weekly", "Bi-weekly", "Monthly"].map(
                      (freq) => ({
                        value: freq,
                        label: freq,
                      })
                    )}
                  />

                  <Textarea
                    label="QA Template"
                    value={formData.qaConfig.qaTemplate}
                    onChange={(e) =>
                      handleInputChange(
                        "qaConfig",
                        "qaTemplate",
                        e.target.value
                      )
                    }
                    placeholder="QA checklist or template..."
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
                      <label className="text-white font-medium">
                        Active Status
                      </label>
                      <p className="text-sm text-gray-400">
                        Enable this SOW for claim processing
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.systemInfo.isActive}
                      theme={theme}
                      onChange={(checked) =>
                        handleInputChange("systemInfo", "isActive", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">
                        Auto Assignment
                      </label>
                      <p className="text-sm text-gray-400">
                        Automatically assign claims to employees
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.systemInfo.autoAssignmentEnabled}
                      theme={theme}
                      onChange={(checked) =>
                        handleInputChange(
                          "systemInfo",
                          "autoAssignmentEnabled",
                          checked
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">
                        Requires Approval
                      </label>
                      <p className="text-sm text-gray-400">
                        SOW changes require management approval
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.systemInfo.requiresApproval}
                      theme={theme}
                      onChange={(checked) =>
                        handleInputChange(
                          "systemInfo",
                          "requiresApproval",
                          checked
                        )
                      }
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <Card className={`${theme.card} p-4 border-red-500/50`}>
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

export default SOWEdit;
