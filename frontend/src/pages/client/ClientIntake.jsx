// frontend/src/pages/client/ClientIntake.jsx

import React, { useState } from "react";
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
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Zap,
  Settings,
  Shield,
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
import { useClients } from "../../hooks/useClient.jsx";
import { validateForm } from "../../lib/validation.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ClientIntake = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();
  const { addClient } = useClients();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    clientInfo: {
      clientName: "",
      legalName: "",
      clientType: "",
      clientSubType: "",
      taxId: "",
      npiNumber: "",
      description: "",
    },

    // Step 2: Contact Information
    contactInfo: {
      primaryContact: {
        name: "",
        title: "",
        email: "",
        phone: "",
        department: "",
      },
      billingContact: {
        name: "",
        email: "",
        phone: "",
        department: "",
      },
      technicalContact: {
        name: "",
        email: "",
        phone: "",
        department: "",
      },
    },

    // Step 3: Address Information
    addressInfo: {
      businessAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
      billingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        sameAsBusinessAddress: true,
      },
    },

    // Step 4: Integration & Technical Setup
    integrationStrategy: {
      workflowType: "",
      ehrPmSystem: {
        systemName: "",
        systemVersion: "",
        vendorContact: {
          name: "",
          email: "",
          phone: "",
        },
      },
      apiConfig: {
        requiresApiAccess: false,
        apiEndpoint: "",
        authMethod: "",
      },
    },

    // Step 5: Financial Information
    financialInfo: {
      billingCurrency: "USD",
      paymentTerms: "Net 30",
      creditLimit: "",
      billingFrequency: "Monthly",
      invoiceFormat: "PDF",
      specialInstructions: "",
    },

    // Step 6: Service Configuration
    serviceConfig: {
      serviceType: "",
      expectedVolume: "",
      startDate: "",
      specialRequirements: "",
      complianceRequirements: [],
    },
  });

  const clientTypeOptions = [
    "Healthcare Provider",
    "Billing Company",
    "Hospital System",
    "Multi-Specialty Clinic",
    "Individual Practice",
    "DME Company",
    "Laboratory",
    "Dental Practice",
    "Behavioral Health",
  ];

  const clientSubTypeOptions = {
    "Healthcare Provider": [
      "Clinic",
      "Hospital",
      "Specialty Practice",
      "Urgent Care",
      "Other",
    ],
    "Billing Company": [
      "Small Practice",
      "Large Group",
      "Hospital System",
      "Specialty Focused",
      "Other",
    ],
    "Hospital System": ["Regional", "National", "Academic", "Private", "Other"],
    "Multi-Specialty Clinic": [
      "Primary Care",
      "Specialty Care",
      "Mixed",
      "Other",
    ],
    "Individual Practice": ["Solo", "Small Group", "Other"],
    "DME Company": ["Equipment", "Supplies", "Both", "Other"],
    Laboratory: ["Clinical", "Pathology", "Radiology", "Other"],
    "Dental Practice": ["General", "Specialty", "Orthodontics", "Other"],
    "Behavioral Health": ["Mental Health", "Substance Abuse", "Mixed", "Other"],
  };

  const workflowTypeOptions = [
    "API Integration",
    "File-based Transfer",
    "Manual Entry",
    "Hybrid Approach",
  ];

  const ehrSystemOptions = [
    "Epic",
    "Cerner",
    "Allscripts",
    "eClinicalWorks",
    "NextGen",
    "AthenaHealth",
    "Practice Fusion",
    "Meditech",
    "Other",
  ];

  const authMethodOptions = [
    "OAuth 2.0",
    "API Key",
    "Basic Authentication",
    "Token-based",
    "Certificate-based",
  ];

  const paymentTermsOptions = [
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
    "Due on Receipt",
    "Custom",
  ];

  const serviceTypeOptions = [
    "Revenue Cycle Management",
    "Medical Coding",
    "Claims Processing",
    "Denial Management",
    "Patient Collections",
    "Credentialing",
    "Consulting",
    "Full Service",
  ];

  const complianceOptions = [
    "HIPAA",
    "SOX",
    "HITECH",
    "PCI DSS",
    "ISO 27001",
    "SOC 2",
    "Other",
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
        "clientInfo.clientName": {
          required: true,
          message: "Client name is required",
        },
        "clientInfo.clientType": {
          required: true,
          message: "Client type is required",
        },
        "clientInfo.legalName": { required: false },
      },
      2: {
        "contactInfo.primaryContact.name": {
          required: true,
          message: "Primary contact name is required",
        },
        "contactInfo.primaryContact.email": {
          required: true,
          type: "email",
          message: "Valid email is required",
        },
        "contactInfo.primaryContact.phone": {
          required: true,
          message: "Phone number is required",
        },
      },
      3: {
        "addressInfo.businessAddress.street": {
          required: true,
          message: "Business address is required",
        },
        "addressInfo.businessAddress.city": {
          required: true,
          message: "City is required",
        },
        "addressInfo.businessAddress.state": {
          required: true,
          message: "State is required",
        },
        "addressInfo.businessAddress.zipCode": {
          required: true,
          message: "ZIP code is required",
        },
      },
      4: {
        "integrationStrategy.workflowType": {
          required: true,
          message: "Workflow type is required",
        },
      },
      5: {
        "financialInfo.billingCurrency": {
          required: true,
          message: "Billing currency is required",
        },
        "financialInfo.paymentTerms": {
          required: true,
          message: "Payment terms are required",
        },
      },
      6: {
        "serviceConfig.serviceType": {
          required: true,
          message: "Service type is required",
        },
        "serviceConfig.expectedVolume": {
          required: true,
          message: "Expected volume is required",
        },
        "serviceConfig.startDate": {
          required: true,
          message: "Start date is required",
        },
      },
    };

    const currentValidations = stepValidations[currentStep];
    const newErrors = {};

    Object.entries(currentValidations).forEach(([fieldPath, validation]) => {
      const value = getNestedValue(formData, fieldPath);

      if (validation.required && (!value || value.trim() === "")) {
        newErrors[fieldPath] = validation.message;
      }

      if (validation.type === "email" && value && !isValidEmail(value)) {
        newErrors[fieldPath] = "Please enter a valid email address";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
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
      // Prepare final data
      const finalData = {
        ...formData,
        status: {
          clientStatus: "Prospect",
          onboardingStatus: "Not Started",
          onboardingProgress: 0,
          riskLevel: "Low",
          lastActivityDate: new Date(),
        },
        systemInfo: {
          isActive: true,
          timezone: "EST",
          businessHours: {
            start: "09:00",
            end: "17:00",
            workingDays: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
          },
          dataRetentionPeriod: 2555,
        },
        files: uploadedFiles,
      };

      await addClient(finalData);
      toast.success("Client created successfully!");
      navigate("/employee/clients/list");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Building2 className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Client Basic Information
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Let's start with the basic details about your client
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Client Name *"
                value={formData.clientInfo.clientName}
                onChange={(e) =>
                  handleInputChange("clientInfo", "clientName", e.target.value)
                }
                error={errors["clientInfo.clientName"]}
                placeholder="Enter client name"
              />

              <Input
                label="Legal Name"
                value={formData.clientInfo.legalName}
                onChange={(e) =>
                  handleInputChange("clientInfo", "legalName", e.target.value)
                }
                error={errors["clientInfo.legalName"]}
                placeholder="Enter legal name"
              />

              <Select
                label="Client Type *"
                value={formData.clientInfo.clientType}
                onChange={(e) =>
                  handleInputChange("clientInfo", "clientType", e.target.value)
                }
                options={clientTypeOptions.map((type) => ({
                  value: type,
                  label: type,
                }))}
                error={errors["clientInfo.clientType"]}
              />

              <Select
                label="Client Sub-Type"
                value={formData.clientInfo.clientSubType}
                onChange={(e) =>
                  handleInputChange(
                    "clientInfo",
                    "clientSubType",
                    e.target.value
                  )
                }
                options={
                  formData.clientInfo.clientType
                    ? clientSubTypeOptions[formData.clientInfo.clientType]?.map(
                        (subType) => ({ value: subType, label: subType })
                      ) || []
                    : []
                }
                error={errors["clientInfo.clientSubType"]}
                disabled={!formData.clientInfo.clientType}
              />

              <Input
                label="Tax ID"
                value={formData.clientInfo.taxId}
                onChange={(e) =>
                  handleInputChange("clientInfo", "taxId", e.target.value)
                }
                error={errors["clientInfo.taxId"]}
                placeholder="XX-XXXXXXX"
              />

              <Input
                label="NPI Number"
                value={formData.clientInfo.npiNumber}
                onChange={(e) =>
                  handleInputChange("clientInfo", "npiNumber", e.target.value)
                }
                error={errors["clientInfo.npiNumber"]}
                placeholder="10-digit NPI number"
              />
            </div>

            <Textarea
              label="Description"
              value={formData.clientInfo.description}
              onChange={(e) =>
                handleInputChange("clientInfo", "description", e.target.value)
              }
              placeholder="Brief description of the client's business..."
              rows={4}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <User className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Contact Information
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Who should we contact for different matters?
              </p>
            </div>

            {/* Primary Contact */}
            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Primary Contact *
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name *"
                  value={formData.contactInfo.primaryContact.name}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "primaryContact",
                      e.target.value,
                      "name"
                    )
                  }
                  error={errors["contactInfo.primaryContact.name"]}
                />
                <Input
                  label="Title"
                  value={formData.contactInfo.primaryContact.title}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "primaryContact",
                      e.target.value,
                      "title"
                    )
                  }
                />
                <Input
                  label="Email *"
                  type="email"
                  value={formData.contactInfo.primaryContact.email}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "primaryContact",
                      e.target.value,
                      "email"
                    )
                  }
                  error={errors["contactInfo.primaryContact.email"]}
                />
                <Input
                  label="Phone *"
                  value={formData.contactInfo.primaryContact.phone}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "primaryContact",
                      e.target.value,
                      "phone"
                    )
                  }
                  error={errors["contactInfo.primaryContact.phone"]}
                />
              </div>
            </Card>

            {/* Billing Contact */}
            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Billing Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={formData.contactInfo.billingContact.name}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "billingContact",
                      e.target.value,
                      "name"
                    )
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.contactInfo.billingContact.email}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "billingContact",
                      e.target.value,
                      "email"
                    )
                  }
                />
                <Input
                  label="Phone"
                  value={formData.contactInfo.billingContact.phone}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "billingContact",
                      e.target.value,
                      "phone"
                    )
                  }
                />
              </div>
            </Card>

            {/* Technical Contact */}
            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Technical Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={formData.contactInfo.technicalContact.name}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "technicalContact",
                      e.target.value,
                      "name"
                    )
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.contactInfo.technicalContact.email}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "technicalContact",
                      e.target.value,
                      "email"
                    )
                  }
                />
                <Input
                  label="Phone"
                  value={formData.contactInfo.technicalContact.phone}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo",
                      "technicalContact",
                      e.target.value,
                      "phone"
                    )
                  }
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
                <MapPin className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Address Information
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Where is your client located?
              </p>
            </div>

            {/* Business Address */}
            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Business Address *
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Street Address *"
                    value={formData.addressInfo.businessAddress.street}
                    onChange={(e) =>
                      handleInputChange(
                        "addressInfo",
                        "businessAddress",
                        e.target.value,
                        "street"
                      )
                    }
                    error={errors["addressInfo.businessAddress.street"]}
                  />
                </div>
                <Input
                  label="City *"
                  value={formData.addressInfo.businessAddress.city}
                  onChange={(e) =>
                    handleInputChange(
                      "addressInfo",
                      "businessAddress",
                      e.target.value,
                      "city"
                    )
                  }
                  error={errors["addressInfo.businessAddress.city"]}
                />
                <Input
                  label="State *"
                  value={formData.addressInfo.businessAddress.state}
                  onChange={(e) =>
                    handleInputChange(
                      "addressInfo",
                      "businessAddress",
                      e.target.value,
                      "state"
                    )
                  }
                  error={errors["addressInfo.businessAddress.state"]}
                />
                <Input
                  label="ZIP Code *"
                  value={formData.addressInfo.businessAddress.zipCode}
                  onChange={(e) =>
                    handleInputChange(
                      "addressInfo",
                      "businessAddress",
                      e.target.value,
                      "zipCode"
                    )
                  }
                  error={errors["addressInfo.businessAddress.zipCode"]}
                />
                <Select
                  label="Country *"
                  value={formData.addressInfo.businessAddress.country}
                  onChange={(e) =>
                    handleInputChange(
                      "addressInfo",
                      "businessAddress",
                      e.target.value,
                      "country"
                    )
                  }
                  options={[
                    { value: "United States", label: "United States" },
                    { value: "Canada", label: "Canada" },
                    { value: "India", label: "India" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              </div>
            </Card>

            {/* Billing Address */}
            <Card className={`${theme.card} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white text-lg font-semibold">
                  Billing Address
                </h4>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.addressInfo.billingAddress.sameAsBusinessAddress
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "addressInfo",
                        "billingAddress",
                        e.target.checked,
                        "sameAsBusinessAddress"
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-white text-sm">
                    Same as business address
                  </span>
                </label>
              </div>

              {!formData.addressInfo.billingAddress.sameAsBusinessAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      value={formData.addressInfo.billingAddress.street}
                      onChange={(e) =>
                        handleInputChange(
                          "addressInfo",
                          "billingAddress",
                          e.target.value,
                          "street"
                        )
                      }
                    />
                  </div>
                  <Input
                    label="City"
                    value={formData.addressInfo.billingAddress.city}
                    onChange={(e) =>
                      handleInputChange(
                        "addressInfo",
                        "billingAddress",
                        e.target.value,
                        "city"
                      )
                    }
                  />
                  <Input
                    label="State"
                    value={formData.addressInfo.billingAddress.state}
                    onChange={(e) =>
                      handleInputChange(
                        "addressInfo",
                        "billingAddress",
                        e.target.value,
                        "state"
                      )
                    }
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.addressInfo.billingAddress.zipCode}
                    onChange={(e) =>
                      handleInputChange(
                        "addressInfo",
                        "billingAddress",
                        e.target.value,
                        "zipCode"
                      )
                    }
                  />
                  <Select
                    label="Country"
                    value={formData.addressInfo.billingAddress.country}
                    onChange={(e) =>
                      handleInputChange(
                        "addressInfo",
                        "billingAddress",
                        e.target.value,
                        "country"
                      )
                    }
                    options={[
                      { value: "United States", label: "United States" },
                      { value: "Canada", label: "Canada" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
              )}
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
                <Zap className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Integration & Technical Setup
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                How will we integrate with your client's systems?
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Workflow Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Workflow Type *"
                  value={formData.integrationStrategy.workflowType}
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "workflowType",
                      e.target.value
                    )
                  }
                  options={workflowTypeOptions.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  error={errors["integrationStrategy.workflowType"]}
                />
              </div>
            </Card>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                EHR/PM System Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="EHR/PM System"
                  value={formData.integrationStrategy.ehrPmSystem.systemName}
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "systemName"
                    )
                  }
                  options={ehrSystemOptions.map((system) => ({
                    value: system,
                    label: system,
                  }))}
                />
                <Input
                  label="System Version"
                  value={formData.integrationStrategy.ehrPmSystem.systemVersion}
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "systemVersion"
                    )
                  }
                />
                <Input
                  label="Vendor Contact Name"
                  value={
                    formData.integrationStrategy.ehrPmSystem.vendorContact.name
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "vendorContact.name"
                    )
                  }
                />
                <Input
                  label="Vendor Contact Email"
                  type="email"
                  value={
                    formData.integrationStrategy.ehrPmSystem.vendorContact.email
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "vendorContact.email"
                    )
                  }
                />
              </div>
            </Card>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                API Configuration
              </h4>
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.integrationStrategy.apiConfig.requiresApiAccess
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "integrationStrategy",
                        "apiConfig",
                        e.target.checked,
                        "requiresApiAccess"
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-white">Requires API Access</span>
                </label>

                {formData.integrationStrategy.apiConfig.requiresApiAccess && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="API Endpoint"
                      value={formData.integrationStrategy.apiConfig.apiEndpoint}
                      onChange={(e) =>
                        handleInputChange(
                          "integrationStrategy",
                          "apiConfig",
                          e.target.value,
                          "apiEndpoint"
                        )
                      }
                      placeholder="https://api.example.com"
                    />
                    <Select
                      label="Authentication Method"
                      value={formData.integrationStrategy.apiConfig.authMethod}
                      onChange={(e) =>
                        handleInputChange(
                          "integrationStrategy",
                          "apiConfig",
                          e.target.value,
                          "authMethod"
                        )
                      }
                      options={authMethodOptions.map((method) => ({
                        value: method,
                        label: method,
                      }))}
                    />
                  </div>
                )}
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
                <DollarSign className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Financial Information
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Set up billing and payment terms
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Billing Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Billing Currency *"
                  value={formData.financialInfo.billingCurrency}
                  onChange={(e) =>
                    handleInputChange(
                      "financialInfo",
                      "billingCurrency",
                      e.target.value
                    )
                  }
                  options={[
                    { value: "USD", label: "USD - US Dollar" },
                    { value: "CAD", label: "CAD - Canadian Dollar" },
                    { value: "EUR", label: "EUR - Euro" },
                    { value: "GBP", label: "GBP - British Pound" },
                  ]}
                  error={errors["financialInfo.billingCurrency"]}
                />
                <Select
                  label="Payment Terms *"
                  value={formData.financialInfo.paymentTerms}
                  onChange={(e) =>
                    handleInputChange(
                      "financialInfo",
                      "paymentTerms",
                      e.target.value
                    )
                  }
                  options={paymentTermsOptions.map((term) => ({
                    value: term,
                    label: term,
                  }))}
                  error={errors["financialInfo.paymentTerms"]}
                />
                <Input
                  label="Credit Limit"
                  type="number"
                  value={formData.financialInfo.creditLimit}
                  onChange={(e) =>
                    handleInputChange(
                      "financialInfo",
                      "creditLimit",
                      e.target.value
                    )
                  }
                  placeholder="0"
                />
                <Select
                  label="Billing Frequency"
                  value={formData.financialInfo.billingFrequency}
                  onChange={(e) =>
                    handleInputChange(
                      "financialInfo",
                      "billingFrequency",
                      e.target.value
                    )
                  }
                  options={[
                    { value: "Weekly", label: "Weekly" },
                    { value: "Bi-weekly", label: "Bi-weekly" },
                    { value: "Monthly", label: "Monthly" },
                    { value: "Quarterly", label: "Quarterly" },
                  ]}
                />
              </div>
            </Card>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Invoice Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Invoice Format"
                  value={formData.financialInfo.invoiceFormat}
                  onChange={(e) =>
                    handleInputChange(
                      "financialInfo",
                      "invoiceFormat",
                      e.target.value
                    )
                  }
                  options={[
                    { value: "PDF", label: "PDF" },
                    { value: "Excel", label: "Excel" },
                    { value: "CSV", label: "CSV" },
                    { value: "XML", label: "XML" },
                  ]}
                />
              </div>
              <div className="mt-4">
                <Textarea
                  label="Special Instructions"
                  value={formData.financialInfo.specialInstructions}
                  onChange={(e) =>
                    handleInputChange(
                      "financialInfo",
                      "specialInstructions",
                      e.target.value
                    )
                  }
                  placeholder="Any special billing instructions or requirements..."
                  rows={3}
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
                <Shield className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Service Configuration
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Final details about the services we'll provide
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Service Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Service Type *"
                  value={formData.serviceConfig.serviceType}
                  onChange={(e) =>
                    handleInputChange(
                      "serviceConfig",
                      "serviceType",
                      e.target.value
                    )
                  }
                  options={serviceTypeOptions.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  error={errors["serviceConfig.serviceType"]}
                />
                <Input
                  label="Expected Volume *"
                  value={formData.serviceConfig.expectedVolume}
                  onChange={(e) =>
                    handleInputChange(
                      "serviceConfig",
                      "expectedVolume",
                      e.target.value
                    )
                  }
                  error={errors["serviceConfig.expectedVolume"]}
                  placeholder="e.g., 1000 claims/month"
                />
                <Input
                  label="Preferred Start Date *"
                  type="date"
                  value={formData.serviceConfig.startDate}
                  onChange={(e) =>
                    handleInputChange(
                      "serviceConfig",
                      "startDate",
                      e.target.value
                    )
                  }
                  error={errors["serviceConfig.startDate"]}
                />
              </div>
            </Card>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Compliance Requirements
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {complianceOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.serviceConfig.complianceRequirements.includes(
                        option
                      )}
                      onChange={(e) => {
                        const current =
                          formData.serviceConfig.complianceRequirements;
                        const updated = e.target.checked
                          ? [...current, option]
                          : current.filter((item) => item !== option);
                        handleInputChange(
                          "serviceConfig",
                          "complianceRequirements",
                          updated
                        );
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-white text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Special Requirements
              </h4>
              <Textarea
                label="Additional Requirements"
                value={formData.serviceConfig.specialRequirements}
                onChange={(e) =>
                  handleInputChange(
                    "serviceConfig",
                    "specialRequirements",
                    e.target.value
                  )
                }
                placeholder="Any special requirements, custom workflows, or specific needs..."
                rows={4}
              />
            </Card>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Document Upload
              </h4>
              <FileUpload
                onUpload={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple={true}
                maxSize={10 * 1024 * 1024} // 10MB
                description="Upload contracts, agreements, or other relevant documents"
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
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Basic Info", icon: Building2 },
      { number: 2, title: "Contact", icon: User },
      { number: 3, title: "Address", icon: MapPin },
      { number: 4, title: "Integration", icon: Zap },
      { number: 5, title: "Financial", icon: DollarSign },
      { number: 6, title: "Service", icon: Shield },
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
        <title>Client Intake - GetMax</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/employee/clients/list")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Clients</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Client Intake</h1>
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
              onClick={() => navigate("/employee/clients/list")}
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
                <span>Create Client</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientIntake;
