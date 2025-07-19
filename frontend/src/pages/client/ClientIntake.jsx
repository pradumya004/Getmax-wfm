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
import { Checkbox } from "../../components/ui/Checkbox.jsx";
import { MultiSelectField } from "../../components/ui/MultiSelectField.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { FileUpload } from "../../components/ui/FileUpload.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  CLIENT_TYPES,
  CLIENT_SUBTYPES,
  STATUS_OPTIONS,
  ONBOARDING_STATUS_OPTIONS,
  WORKFLOW_TYPES,
  EHR_SYSTEMS,
  PAYMENT_TERMS,
  CURRENCIES,
  COUNTRIES,
  BILLING_FREQUENCY,
  TIMEZONES,
  WORKING_DAYS,
  ALLOWED_FILE_FORMATS,
  AUTH_METHODS,
  SERVICE_TYPES,
  COMPLIANCE_REQUIREMENTS,
  INVOICE_FORMATS,
  SYNC_FREQUENCIES,
  FILE_PROCESSING_STATUSES,
  INTEGRATION_STATUSES,
} from "../../pages/client/client.constants";

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
        email: "",
        phone: "",
      },
      billingContact: {
        name: "",
        email: "",
        phone: "",
      },
      technicalContact: {
        name: "",
        email: "",
        phone: "",
      },
    },

    // Step 3: Address Information
    addressInfo: {
      businessAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      },
      billingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        sameAsBusinessAddress: true,
      },
    },

    // Step 4: Integration & Technical Setup
    integrationStrategy: {
      workflowType: "",
      ehrPmSystem: {
        systemName: "",
        systemVersion: "",
        vendorContact: { name: "", email: "", phone: "" },
      },
      apiConfig: {
        hasApiAccess: false,
        apiBaseUrl: "",
        apiVersion: "",
        authMethod: "",
        testEndpoint: "",
        productionEndpoint: "",
        rateLimitPerHour: 100,
        syncStatus: "",
      },
      sftpConfig: {
        enabled: false,
        host: "",
        port: 22,
        username: "",
        inboundPath: "",
        outboundPath: "",
        fileFormat: [],
        syncFrequency: "",
      },
      manualConfig: {
        allowedFileFormats: [],
        maxFileSize: 25,
        templateRequired: false,
      },
    },

    // Step 5: Financial Information
    financialInfo: {
      billingCurrency: "",
      paymentTerms: "",
      creditLimit: "",
      billingFrequency: "",
      invoiceFormat: "",
    },

    // Step 6: Service Configuration
    serviceAgreements: {
      serviceType: [],
      compliances: [],
    },
    status: {
      clientStatus: "",
      onboardingStatus: "",
    },
    systemInfo: {
      isActive: true,
      timezone: "IST",
      businessHours: {
        start: "09:00",
        end: "17:00",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      dataRetentionPeriod: 12,
    },
  });

  const handleInputChange = (section, field, value, subField = null) => {
    console.log("handleInputChange:", { section, field, value, subField }); // Debug log

    setFormData((prev) => {
      const newData = { ...prev };

      // Ensure section exists
      if (!newData[section]) {
        newData[section] = {};
      }

      if (subField) {
        // Handle nested updates
        if (!newData[section][field]) {
          newData[section][field] = {};
        }
        newData[section][field][subField] = value;
      } else {
        // Handle direct updates
        newData[section][field] = value;
      }

      console.log("Updated formData:", newData); // Debug log
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
        "clientInfo.clientName": {
          required: true,
          message: "Client name is required",
        },
        "clientInfo.clientType": {
          required: true,
          message: "Client type is required",
        },
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

    // Enhanced file format validation for Manual workflows
    if (
      currentStep === 4 &&
      formData.integrationStrategy?.workflowType === "Manual Only"
    ) {
      const formats =
        formData.integrationStrategy?.manualConfig?.allowedFileFormats;

      if (!formats || !Array.isArray(formats) || formats.length === 0) {
        newErrors["integrationStrategy.manualConfig.allowedFileFormats"] =
          "Please select at least one file format";
      }
    }

    // Validate API configuration if API workflow is selected
    if (
      currentStep === 4 &&
      ["API Integration Only", "Hybrid Integration"].includes(
        formData.integrationStrategy?.workflowType
      )
    ) {
      if (formData.integrationStrategy?.apiConfig?.hasApiAccess) {
        if (!formData.integrationStrategy?.apiConfig?.apiBaseUrl) {
          newErrors["integrationStrategy.apiConfig.apiBaseUrl"] =
            "API Base URL is required";
        }
        if (!formData.integrationStrategy?.apiConfig?.authMethod) {
          newErrors["integrationStrategy.apiConfig.authMethod"] =
            "Authentication method is required";
        }
      }
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
    console.log("Current step:", currentStep);
    console.log("Form data before validation:", formData);
    console.log("Current errors:", errors);

    if (validateCurrentStep()) {
      console.log("Validation passed, moving to next step");
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      console.log("Validation failed, staying on current step");
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
      await addClient(formData);

      // Use toast for success message
      toast.success("Client created successfully!");

      // Navigate back or show success message
      if (typeof navigate === "function") {
        navigate("/company/clients/list");
      } else {
        console.log("Navigation not available, client created successfully");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to create client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleFileUpload = (files) => {
  //   if (files && files.length > 0) {
  //     const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // 10MB limit
  //     setUploadedFiles((prev) => [...prev, ...validFiles]);
  //     toast.success(`${validFiles.length} file(s) uploaded successfully`);

  //     if (validFiles.length < files.length) {
  //       toast.error(
  //         `${files.length - validFiles.length} file(s) exceeded size limit`
  //       );
  //     }
  //   }
  // };

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
                options={CLIENT_TYPES.map((type) => ({
                  value: type,
                  label: type,
                }))}
                error={errors["clientInfo.clientType"]}
                placeholder="Select client type"
              />

              <Select
                label="Client Sub-Type"
                value={formData.clientInfo?.clientSubType}
                onChange={(e) =>
                  handleInputChange(
                    "clientInfo",
                    "clientSubType",
                    e.target.value
                  )
                }
                options={
                  CLIENT_SUBTYPES[formData.clientInfo?.clientType]?.map(
                    (subType) => ({
                      value: subType,
                      label: subType,
                    })
                  ) || []
                }
                error={errors["clientInfo.clientSubType"]}
                disabled={!formData.clientInfo.clientType}
                placeholder="Select client sub-type"
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
                  options={COUNTRIES.map((country) => ({
                    value: country.value || country,
                    label: country.label || country,
                  }))}
                  placeholder="Select country"
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
                    options={COUNTRIES}
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
                  value={formData.integrationStrategy?.workflowType}
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "workflowType",
                      e.target.value
                    )
                  }
                  options={WORKFLOW_TYPES.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  error={errors["integrationStrategy.workflowType"]}
                  placeholder="Select workflow type"
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
                  value={
                    formData.integrationStrategy?.ehrPmSystem?.systemName || ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "systemName"
                    )
                  }
                  options={EHR_SYSTEMS.map((system) => ({
                    value: system,
                    label: system,
                  }))}
                  placeholder="Select EHR/PM System"
                />
                <Input
                  label="System Version"
                  value={
                    formData.integrationStrategy?.ehrPmSystem?.systemVersion ||
                    ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "systemVersion"
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <Input
                  label="Vendor Contact"
                  value={
                    formData.integrationStrategy?.apiConfig?.apiEndpoint || ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "vendorContact.name"
                    )
                  }
                  placeholder="Vendor Name"
                />

                <Input
                  label="Vendor Email"
                  value={
                    formData.integrationStrategy?.apiConfig?.apiEndpoint || ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "vendorContact.email"
                    )
                  }
                  placeholder="Vendor Email"
                />

                <Input
                  label="Vendor Contact"
                  value={
                    formData.integrationStrategy?.apiConfig?.apiEndpoint || ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "integrationStrategy",
                      "ehrPmSystem",
                      e.target.value,
                      "vendorContact.phone"
                    )
                  }
                  placeholder="Vendor Phone"
                />
              </div>
            </Card>

            <Card className={`${theme.card} p-6`}>
              <div className="mt-6 space-y-4">
                {["Manual Only", "Hybrid Integration"].includes(
                  formData.integrationStrategy?.workflowType
                ) && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-white font-semibold">
                      Manual Configuration
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Accepts file uploads only. Specify supported formats and
                      limits.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <MultiSelectField
                        label="Allowed File Formats *"
                        options={ALLOWED_FILE_FORMATS.map((f) => ({
                          value: f,
                          label: f.toUpperCase(),
                        }))}
                        selected={
                          formData.integrationStrategy?.manualConfig
                            ?.allowedFileFormats || []
                        }
                        onChange={(selectedFormats) =>
                          handleInputChange(
                            "integrationStrategy",
                            "manualConfig",
                            selectedFormats,
                            "allowedFileFormats"
                          )
                        }
                        error={
                          errors[
                            "integrationStrategy.manualConfig.allowedFileFormats"
                          ]
                        }
                      />

                      <Input
                        label="Max File Size (MB)"
                        type="number"
                        value={
                          formData.integrationStrategy?.manualConfig
                            ?.maxFileSize || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "manualConfig",
                            parseInt(e.target.value) || 25,
                            "maxFileSize"
                          )
                        }
                      />

                      <div className="mt-8 px-8">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={
                              formData.integrationStrategy?.manualConfig
                                ?.templateRequired || false
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "integrationStrategy",
                                "manualConfig",
                                e.target.checked,
                                "templateRequired"
                              )
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-white text-sm">
                            Require Template
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {["API Integration Only", "Hybrid Integration"].includes(
                  formData.integrationStrategy?.workflowType
                ) && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-white font-semibold">
                      API Configuration
                    </h4>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Configure API endpoint, authentication, and rate limits.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                      <div className="mt-8 px-2">
                        <Checkbox
                          label="Enable API Access"
                          checked={
                            formData.integrationStrategy?.apiConfig
                              ?.hasApiAccess || false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "integrationStrategy",
                              "apiConfig",
                              e.target.checked,
                              "hasApiAccess"
                            )
                          }
                        />
                      </div>

                      <Input
                        label="API Base URL"
                        value={
                          formData.integrationStrategy?.apiConfig?.apiBaseUrl ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "apiConfig",
                            e.target.value,
                            "apiBaseUrl"
                          )
                        }
                        placeholder="https://api.example.com"
                      />

                      <Input
                        label="API Version"
                        value={
                          formData.integrationStrategy?.apiConfig?.apiVersion ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "apiConfig",
                            e.target.value,
                            "apiVersion"
                          )
                        }
                        placeholder="v1"
                      />

                      <Select
                        label="Authentication Method"
                        value={
                          formData.integrationStrategy?.apiConfig?.authMethod ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "apiConfig",
                            e.target.value,
                            "authMethod"
                          )
                        }
                        options={AUTH_METHODS.map((method) => ({
                          value: method,
                          label: method,
                        }))}
                        placeholder="Select authentication method"
                      />

                      <Input
                        label="Test Endpoint"
                        value={
                          formData.integrationStrategy?.apiConfig
                            ?.testEndpoint || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "apiConfig",
                            e.target.value,
                            "testEndpoint"
                          )
                        }
                        placeholder="https://api.example.com/test"
                      />
                      <Input
                        label="Production Endpoint"
                        value={
                          formData.integrationStrategy?.apiConfig
                            ?.productionEndpoint || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "apiConfig",
                            e.target.value,
                            "productionEndpoint"
                          )
                        }
                        placeholder="https://api.example.com/production"
                      />

                      <Input
                        label="Rate Limit (requests/hour)"
                        value={
                          formData.integrationStrategy?.apiConfig
                            ?.rateLimitPerHour || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "apiConfig",
                            e.target.value,
                            "rateLimitPerHour"
                          )
                        }
                        placeholder="1000"
                      />

                      <Input
                        label="Sync Status"
                        value={
                          formData.integrationStrategy?.apiConfig?.syncStatus ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "apiConfig",
                            e.target.value,
                            "syncStatus"
                          )
                        }
                        placeholder="Not Configured"
                      />
                    </div>
                  </div>
                )}

                {formData.integrationStrategy?.workflowType ===
                  "SFTP Integration" && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-white font-semibold">
                      SFTP Integration
                    </h4>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Configure SFTP server details for file transfers.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                      <div className="mt-8 px-2">
                        <Checkbox
                          label="Enable SFTP Access"
                          checked={
                            formData.integrationStrategy?.sftpConfig?.enabled ||
                            false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "integrationStrategy",
                              "sftpConfig",
                              e.target.checked,
                              "enabled"
                            )
                          }
                        />
                      </div>

                      <Input
                        label="Host"
                        value={
                          formData.integrationStrategy?.sftpConfig?.host || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "sftpConfig",
                            e.target.value,
                            "host"
                          )
                        }
                        placeholder="sftp.example.com"
                      />

                      <Input
                        label="Port"
                        value={
                          formData.integrationStrategy?.sftpConfig?.port || "22"
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "sftpConfig",
                            e.target.value,
                            "port"
                          )
                        }
                        placeholder="22"
                      />

                      <Input
                        label="Username"
                        value={
                          formData.integrationStrategy?.sftpConfig?.username ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "sftpConfig",
                            e.target.value,
                            "username"
                          )
                        }
                        placeholder="SFTP Username"
                      />

                      <Input
                        label="Inbound Path"
                        value={
                          formData.integrationStrategy?.sftpConfig
                            ?.inboundPath || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "sftpConfig",
                            e.target.value,
                            "inboundPath"
                          )
                        }
                        placeholder="/inbound"
                      />

                      <Input
                        label="Outbound Path"
                        value={
                          formData.integrationStrategy?.sftpConfig
                            ?.outboundPath || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "sftpConfig",
                            e.target.value,
                            "outboundPath"
                          )
                        }
                        placeholder="/outbound"
                      />

                      <Input
                        label="File Format"
                        value={
                          formData.integrationStrategy?.sftpConfig
                            ?.fileFormat || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "sftpConfig",
                            e.target.value,
                            "fileFormat"
                          )
                        }
                        placeholder="CSV"
                      />

                      <Input
                        label="Sync Frequency"
                        value={
                          formData.integrationStrategy?.sftpConfig
                            ?.syncFrequency || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "integrationStrategy",
                            "sftpConfig",
                            e.target.value,
                            "syncFrequency"
                          )
                        }
                        placeholder="Not Configured"
                      />
                    </div>
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
                  options={CURRENCIES.map((currency) => ({
                    value: currency,
                    label: currency,
                  }))}
                  error={errors["financialInfo.billingCurrency"]}
                  placeholder="Select currency"
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
                  options={PAYMENT_TERMS.map((term) => ({
                    value: term,
                    label: term,
                  }))}
                  error={errors["financialInfo.paymentTerms"]}
                  placeholder="Select payment terms"
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
                  options={BILLING_FREQUENCY}
                />
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
                  options={INVOICE_FORMATS.map((format) => ({
                    value: format,
                    label: format,
                  }))}
                  placeholder="Select invoice format"
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
                <MultiSelectField
                  label="Service Types *"
                  selected={formData.serviceAgreements.serviceType || []}
                  onChange={(e) =>
                    handleInputChange("serviceAgreements", "serviceType", e)
                  }
                  options={SERVICE_TYPES.map((service) => ({
                    value: service,
                    label: service,
                  }))}
                  error={errors["serviceAgreements.serviceType"]}
                  // placeholder="Select services"
                />
                <MultiSelectField
                  label="Compliances *"
                  selected={formData.serviceAgreements.compliances || []}
                  onChange={(e) =>
                    handleInputChange("serviceAgreements", "compliances", e)
                  }
                  options={COMPLIANCE_REQUIREMENTS.map((compliance) => ({
                    value: compliance,
                    label: compliance,
                  }))}
                  error={errors["serviceAgreements.compliances"]}
                />
              </div>
            </Card>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                Client Status
              </h4>
              <Select
                label="Client Status *"
                value={formData.status.clientStatus}
                onChange={(e) =>
                  handleInputChange("status", "clientStatus", e.target.value)
                }
                options={STATUS_OPTIONS.map((status) => ({
                  value: status,
                  label: status,
                }))}
                error={errors["status.clientStatus"]}
                placeholder="Select client status"
              />
              <Select
                label="Onboarding Status *"
                value={formData.status.onboardingStatus}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    "onboardingStatus",
                    e.target.value
                  )
                }
                options={ONBOARDING_STATUS_OPTIONS.map((status) => ({
                  value: status,
                  label: status,
                }))}
                error={errors["status.onboardingStatus"]}
                placeholder="Select onboarding status"
              />
            </Card>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white text-lg font-semibold mb-4">
                System Information
              </h4>
              <Checkbox
                label="Enable Client Portal"
                checked={formData.systemInfo.isActive || false}
                onChange={(e) =>
                  handleInputChange("systemInfo", "isActive", e.target.checked)
                }
                error={errors["systemInfo.isActive"]}
              />
              <Select
                label="Timezone *"
                value={formData.systemInfo.timezone}
                onChange={(e) =>
                  handleInputChange("systemInfo", "timezone", e.target.value)
                }
                options={TIMEZONES}
                error={errors["systemInfo.timezone"]}
                placeholder="Select timezone"
              />

              <h4 className="span text-white text-lg font-semibold mb-4">
                Business Hours
              </h4>
              <Input
                label="Start Time"
                type="time"
                value={formData.systemInfo.businessHours.start}
                onChange={(e) =>
                  handleInputChange(
                    "systemInfo",
                    "businessHours",
                    e.target.value,
                    "start"
                  )
                }
                error={errors["systemInfo.businessHours.start"]}
                placeholder="09:00"
              />
              <Input
                label="End Time"
                type="time"
                value={formData.systemInfo.businessHours.endTime}
                onChange={(e) =>
                  handleInputChange(
                    "systemInfo",
                    "businessHours",
                    e.target.value,
                    "endTime"
                  )
                }
                error={errors["systemInfo.businessHours.endTime"]}
                placeholder="17:00"
              />
              <MultiSelectField
                label="Working Days *"
                selected={formData.systemInfo.businessHours.workingDays || []}
                onChange={(e) =>
                  handleInputChange(
                    "systemInfo",
                    "businessHours",
                    e,
                    "workingDays"
                  )
                }
                options={WORKING_DAYS.map((day) => ({
                  value: day,
                  label: day,
                }))}
                error={errors["systemInfo.businessHours.workingDays"]}
                // placeholder="Select services"
              />
              <Input
                label="Data Retention Period (months)"
                type="number"
                value={formData.systemInfo.dataRetentionPeriod}
                onChange={(e) =>
                  handleInputChange(
                    "systemInfo",
                    "dataRetentionPeriod",
                    e.target.value
                  )
                }
                error={errors["systemInfo.dataRetentionPeriod"]}
                placeholder="12"
              />
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
        <title>{`Client Intake - GetMax`}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/company/clients/list")}
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
              onClick={() => navigate("/company/clients/list")}
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
