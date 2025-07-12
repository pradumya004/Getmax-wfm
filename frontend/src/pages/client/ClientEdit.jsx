// frontend/src/pages/client/ClientEdit.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Zap,
  Settings,
  Shield,
  FileText,
  CheckCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { validateForm } from "../../lib/validation.js";
import { toast } from "react-hot-toast";

const ClientEdit = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { getClientById, editClient } = useClients();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [hasChanges, setHasChanges] = useState(false);

  // Form options
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

  const statusOptions = [
    { value: "Prospect", label: "Prospect" },
    { value: "Active", label: "Active" },
    { value: "Onboarding", label: "Onboarding" },
    { value: "Inactive", label: "Inactive" },
    { value: "Suspended", label: "Suspended" },
  ];

  const onboardingStatusOptions = [
    { value: "Not Started", label: "Not Started" },
    { value: "Documentation Pending", label: "Documentation Pending" },
    { value: "Technical Setup", label: "Technical Setup" },
    { value: "Testing Phase", label: "Testing Phase" },
    { value: "Training Phase", label: "Training Phase" },
    { value: "Go Live", label: "Go Live" },
    { value: "Completed", label: "Completed" },
  ];

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

  const paymentTermsOptions = [
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
    "Due on Receipt",
    "Custom",
  ];

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      const clientData = await getClientById(clientId);
      setClient(clientData);
      setFormData(clientData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load client data");
      toast.error("Failed to load client data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value, subField = null) => {
    const newFormData = { ...formData };

    if (subField) {
      if (!newFormData[section]) newFormData[section] = {};
      if (!newFormData[section][field]) newFormData[section][field] = {};
      newFormData[section][field][subField] = value;
    } else if (section) {
      if (!newFormData[section]) newFormData[section] = {};
      newFormData[section][field] = value;
    } else {
      newFormData[field] = value;
    }

    setFormData(newFormData);
    setHasChanges(true);

    // Clear error for this field
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

  const validateForm = () => {
    const validationRules = {
      "clientInfo.clientName": {
        required: true,
        message: "Client name is required",
      },
      "clientInfo.clientType": {
        required: true,
        message: "Client type is required",
      },
      "contactInfo.primaryContact.name": {
        required: true,
        message: "Primary contact name is required",
      },
      "contactInfo.primaryContact.email": {
        required: true,
        type: "email",
        message: "Valid email is required",
      },
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
    };

    const newErrors = {};

    Object.entries(validationRules).forEach(([fieldPath, validation]) => {
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

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setSaving(true);
    try {
      await editClient(clientId, formData);
      toast.success("Client updated successfully");
      setHasChanges(false);
      navigate(`/employee/clients/details/${clientId}`);
    } catch (error) {
      toast.error("Failed to update client");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        navigate(`/employee/clients/details/${clientId}`);
      }
    } else {
      navigate(`/employee/clients/details/${clientId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">
          Error Loading Client
        </h3>
        <p className={`text-${theme.textSecondary} mb-4`}>
          {error || "Client not found"}
        </p>
        <div className="flex justify-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate("/employee/clients/list")}
          >
            Back to Clients
          </Button>
          <Button onClick={loadClientData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Edit {client.clientInfo?.clientName} - GetMax</title>
      </Helmet>

      <div className="relative max-w-6xl mx-auto flex flex-col min-h-screen">
        <div className="flex-grow">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Client</h1>
                <p className={`text-${theme.textSecondary} text-lg`}>
                  Update {client.clientInfo?.clientName}'s information
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {hasChanges && (
                <span
                  className={`text-${theme.textSecondary} text-sm flex items-center space-x-1`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Unsaved changes</span>
                </span>
              )}
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={saving}
                disabled={!hasChanges}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>

          {/* Form Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Client Name *"
                    value={formData.clientInfo?.clientName || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "clientInfo",
                        "clientName",
                        e.target.value
                      )
                    }
                    error={errors["clientInfo.clientName"]}
                  />

                  <Input
                    label="Legal Name"
                    value={formData.clientInfo?.legalName || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "clientInfo",
                        "legalName",
                        e.target.value
                      )
                    }
                  />

                  <Select
                    label="Client Type *"
                    value={formData.clientInfo?.clientType || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "clientInfo",
                        "clientType",
                        e.target.value
                      )
                    }
                    options={clientTypeOptions.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    error={errors["clientInfo.clientType"]}
                  />

                  <Select
                    label="Client Sub-Type"
                    value={formData.clientInfo?.clientSubType || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "clientInfo",
                        "clientSubType",
                        e.target.value
                      )
                    }
                    options={
                      formData.clientInfo?.clientType
                        ? clientSubTypeOptions[
                            formData.clientInfo.clientType
                          ]?.map((subType) => ({
                            value: subType,
                            label: subType,
                          })) || []
                        : []
                    }
                    disabled={!formData.clientInfo?.clientType}
                  />

                  <Input
                    label="Tax ID"
                    value={formData.clientInfo?.taxId || ""}
                    onChange={(e) =>
                      handleInputChange("clientInfo", "taxId", e.target.value)
                    }
                    placeholder="XX-XXXXXXX"
                  />

                  <Input
                    label="NPI Number"
                    value={formData.clientInfo?.npiNumber || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "clientInfo",
                        "npiNumber",
                        e.target.value
                      )
                    }
                    placeholder="10-digit NPI number"
                  />
                </div>

                <div className="mt-6">
                  <Textarea
                    label="Description"
                    value={formData.clientInfo?.description || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "clientInfo",
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Brief description of the client's business..."
                    rows={4}
                  />
                </div>
              </Card>

              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  Status Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    label="Client Status"
                    value={formData.status?.clientStatus || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        "clientStatus",
                        e.target.value
                      )
                    }
                    options={statusOptions}
                  />

                  <Select
                    label="Onboarding Status"
                    value={formData.status?.onboardingStatus || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        "onboardingStatus",
                        e.target.value
                      )
                    }
                    options={onboardingStatusOptions}
                  />

                  <Input
                    label="Onboarding Progress (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.status?.onboardingProgress || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        "onboardingProgress",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-6">
              {/* Primary Contact */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Primary Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Name *"
                    value={formData.contactInfo?.primaryContact?.name || ""}
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
                    value={formData.contactInfo?.primaryContact?.title || ""}
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
                    value={formData.contactInfo?.primaryContact?.email || ""}
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
                    label="Phone"
                    value={formData.contactInfo?.primaryContact?.phone || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "contactInfo",
                        "primaryContact",
                        e.target.value,
                        "phone"
                      )
                    }
                  />
                </div>
              </Card>

              {/* Billing Contact */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Billing Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    value={formData.contactInfo?.billingContact?.name || ""}
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
                    value={formData.contactInfo?.billingContact?.email || ""}
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
                    value={formData.contactInfo?.billingContact?.phone || ""}
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
                <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Technical Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    value={formData.contactInfo?.technicalContact?.name || ""}
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
                    value={formData.contactInfo?.technicalContact?.email || ""}
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
                    value={formData.contactInfo?.technicalContact?.phone || ""}
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
            </TabsContent>

            {/* Address Information Tab */}
            <TabsContent value="address" className="space-y-6">
              {/* Business Address */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  Business Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address *"
                      value={
                        formData.addressInfo?.businessAddress?.street || ""
                      }
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
                    value={formData.addressInfo?.businessAddress?.city || ""}
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
                    value={formData.addressInfo?.businessAddress?.state || ""}
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
                    value={formData.addressInfo?.businessAddress?.zipCode || ""}
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
                    value={formData.addressInfo?.businessAddress?.country || ""}
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
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
              </Card>

              {/* Billing Address */}
              <Card className={`${theme.card} p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg font-semibold">
                    Billing Address
                  </h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={
                        formData.addressInfo?.billingAddress
                          ?.sameAsBusinessAddress || false
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

                {!formData.addressInfo?.billingAddress
                  ?.sameAsBusinessAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Street Address"
                        value={
                          formData.addressInfo?.billingAddress?.street || ""
                        }
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
                      value={formData.addressInfo?.billingAddress?.city || ""}
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
                      value={formData.addressInfo?.billingAddress?.state || ""}
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
                      value={
                        formData.addressInfo?.billingAddress?.zipCode || ""
                      }
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
                      value={
                        formData.addressInfo?.billingAddress?.country || ""
                      }
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
            </TabsContent>

            {/* Integration Tab */}
            <TabsContent value="integration" className="space-y-6">
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  Integration Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Workflow Type"
                    value={formData.integrationStrategy?.workflowType || ""}
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
                  />

                  <Select
                    label="EHR/PM System"
                    value={
                      formData.integrationStrategy?.ehrPmSystem?.systemName ||
                      ""
                    }
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
                    value={
                      formData.integrationStrategy?.ehrPmSystem
                        ?.systemVersion || ""
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

                  <Input
                    label="API Endpoint"
                    value={
                      formData.integrationStrategy?.apiConfig?.apiEndpoint || ""
                    }
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
                </div>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-6">
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-6">
                  Financial Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Billing Currency"
                    value={formData.financialInfo?.billingCurrency || ""}
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
                  />

                  <Select
                    label="Payment Terms"
                    value={formData.financialInfo?.paymentTerms || ""}
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
                  />

                  <Input
                    label="Credit Limit"
                    type="number"
                    value={formData.financialInfo?.creditLimit || ""}
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
                    value={formData.financialInfo?.billingFrequency || ""}
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

                <div className="mt-6">
                  <Textarea
                    label="Special Instructions"
                    value={formData.financialInfo?.specialInstructions || ""}
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
            </TabsContent>
          </Tabs>
        </div>
        {/* Fixed Save Bar */}
        {hasChanges && (
          <div
            className={`sticky bottom-0 left-0 w-full ${theme.glass} border-t border-white/10 p-4 z-40`}
          >
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">
                  You have unsaved changes
                </span>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={saving}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientEdit;
