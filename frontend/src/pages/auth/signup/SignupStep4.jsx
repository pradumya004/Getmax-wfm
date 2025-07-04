// frontend/src/pages/auth/signup/SignupStep4.jsx

// FIXED - Correct data mapping for backend API

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Building,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authAPI } from "../../../api/auth.api.js";
import { useAuth } from "../../../hooks/useAuth.jsx";

// Contract configuration options
const clientTypes = [
  {
    value: "Billing Company",
    label: "🏢 Billing Company",
    description: "Direct billing services",
  },
  {
    value: "Provider",
    label: "🏥 Healthcare Provider",
    description: "Medical service provider",
  },
  {
    value: "Insurance",
    label: "🛡️ Insurance Company",
    description: "Insurance services",
  },
  {
    value: "Third Party",
    label: "🤝 Third Party",
    description: "Third-party services",
  },
  { value: "Others", label: "📦 Others", description: "Other client types" },
];

const contractTypes = [
  {
    value: "End to End",
    label: "🔄 End to End",
    description: "Complete service delivery",
  },
  {
    value: "Transactional",
    label: "💸 Transactional",
    description: "Per-transaction basis",
  },
  {
    value: "FTE",
    label: "👥 Full-Time Equivalent",
    description: "Dedicated resources",
  },
  { value: "Hybrid", label: "🔀 Hybrid", description: "Mixed service model" },
  {
    value: "Consulting",
    label: "💼 Consulting",
    description: "Advisory services",
  },
  {
    value: "Project Based",
    label: "📋 Project Based",
    description: "Specific project delivery",
  },
];

const specialtyTypes = [
  {
    value: "Primary Care",
    label: "🏥 Primary Care",
    description: "General healthcare",
  },
  {
    value: "Specialty Care",
    label: "⚕️ Specialty Care",
    description: "Specialized medical care",
  },
  { value: "Dental", label: "🦷 Dental", description: "Dental services" },
  { value: "Vision", label: "👁️ Vision", description: "Eye care services" },
  {
    value: "Mental Health",
    label: "🧠 Mental Health",
    description: "Psychological services",
  },
  {
    value: "Surgery Centers",
    label: "🏥 Surgery Centers",
    description: "Surgical procedures",
  },
  {
    value: "Hospitals",
    label: "🏥 Hospitals",
    description: "Hospital services",
  },
  { value: "Labs", label: "🔬 Labs", description: "Laboratory services" },
  {
    value: "Multi Specialty",
    label: "🏥 Multi Specialty",
    description: "Multiple specialties",
  },
  { value: "DME", label: "🦽 DME", description: "Durable Medical Equipment" },
];

const scopeFormats = [
  { value: "ClaimMD", label: "📋 ClaimMD", description: "ClaimMD format" },
  { value: "Medisoft", label: "💻 Medisoft", description: "Medisoft system" },
  { value: "Epic", label: "🏥 Epic", description: "Epic EHR system" },
  { value: "Cerner", label: "📊 Cerner", description: "Cerner platform" },
  { value: "Custom", label: "⚙️ Custom", description: "Custom format" },
  { value: "HL7", label: "🔄 HL7", description: "HL7 standards" },
];

const serviceAreas = [
  {
    value: "Claims Processing",
    label: "📄 Claims Processing",
    description: "Medical claims processing",
  },
  {
    value: "Prior Authorization",
    label: "✅ Prior Authorization",
    description: "Pre-approval services",
  },
  {
    value: "Eligibility Verification",
    label: "🔍 Eligibility Verification",
    description: "Insurance verification",
  },
  {
    value: "Denial Management",
    label: "❌ Denial Management",
    description: "Claim denial handling",
  },
  {
    value: "Payment Posting",
    label: "💰 Payment Posting",
    description: "Payment processing",
  },
  {
    value: "AR Follow-up",
    label: "📞 AR Follow-up",
    description: "Accounts receivable",
  },
  {
    value: "Credentialing",
    label: "📜 Credentialing",
    description: "Provider credentialing",
  },
  {
    value: "Coding Services",
    label: "🔢 Coding Services",
    description: "Medical coding",
  },
];

// Multi-select component
const MultiSelectField = ({
  label,
  options,
  selected,
  onChange,
  error,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const removeItem = (value) => {
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className="space-y-2">
      <label className="block text-white/90 font-medium">{label} *</label>
      {description && <p className="text-white/60 text-sm">{description}</p>}

      {/* Selected items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
              >
                {option?.label || value}
                <button
                  type="button"
                  onClick={() => removeItem(value)}
                  className="ml-2 hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-left transition-all duration-300 ${
            error
              ? "border-red-400/50 focus:border-red-400"
              : "border-white/20 hover:border-white/40 focus:border-white/60"
          } ${isOpen ? "border-white/60" : ""}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/80">
              {selected.length > 0
                ? `${selected.length} selected`
                : `Select ${label.toLowerCase()}`}
            </span>
            <Plus
              className={`w-4 h-4 text-white/60 transition-transform ${
                isOpen ? "rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{option.label}</div>
                    <div className="text-white/60 text-sm">
                      {option.description}
                    </div>
                  </div>
                  {selected.includes(option.value) && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default function SignupStep4({
  data,
  updateContractSettings,
  onBack,
  errors,
  setErrors,
  step,
  totalSteps,
  loading,
  setLoading,
}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!data.contractSettings.clientTypes?.length) {
      newErrors.clientTypes = "Please select at least one client type";
    }

    if (!data.contractSettings.contractTypes?.length) {
      newErrors.contractTypes = "Please select at least one contract type";
    }

    if (!data.contractSettings.specialtyTypes?.length) {
      newErrors.specialtyTypes = "Please select at least one specialty type";
    }

    if (!data.contractSettings.scopeFormats?.length) {
      newErrors.scopeFormats = "Please select at least one scope format";
    }

    if (!data.contractSettings.serviceAreas?.length) {
      newErrors.serviceAreas = "Please select at least one service area";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // FIXED: Properly structure data according to backend model
      const submissionData = {
        // Basic company info - FIXED field names
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        companyEmail: data.contactEmail, // FIXED: Backend expects companyEmail
        companyPassword: data.companyPassword,
        contactPhone: data.contactPhone,
        phoneCountry: data.phoneCountry,
        subscriptionPlan: data.subscriptionPlan,

        // Address information - FIXED: Flatten address fields
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,

        // Billing information - FIXED: Correct field names
        billingContactName: data.billingContactName,
        billingEmail: data.billingEmail,

        // Business details - FIXED: Add missing fields
        businessType: data.businessType,
        industry: data.industry,
        companySize: data.companySize,
        timeZone: data.timeZone,
        website: data.website,
        businessDescription: data.businessDescription,

        // Contract settings - FIXED: Structure according to backend model
        contractSettings: [
          {
            clientType: data.contractSettings.clientTypes,
            contractType: data.contractSettings.contractTypes,
            specialtyType: data.contractSettings.specialtyTypes,
            scopeFormatID: data.contractSettings.scopeFormats,
            // Note: serviceAreas not in backend model, removing for now
          },
        ],

        // Admin user info for first employee - FIXED: Add these fields
        adminFirstName: data.contactPerson?.split(" ")[0] || "Admin",
        adminLastName:
          data.contactPerson?.split(" ").slice(1).join(" ") || "User",
        adminPhone: data.contactPhone,
      };

      console.log("Submitting company registration:", submissionData);

      // Call the API
      const response = await authAPI.companyRegister(submissionData);

      if (response.success) {
        setSubmitted(true);

        // Login the user automatically if token is provided
        if (response.data.token && response.data.company) {
          login(response.data.company, response.data.token);
        }

        toast.success("Company registered successfully!");

        // Navigate to success page after a short delay
        setTimeout(() => {
          navigate("/company/dashboard");
        }, 2000);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Better error handling
      let errorMessage = "Registration failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (errorMessage?.toLowerCase().includes("already exists")) {
        toast.error("Company already exists. Redirecting to login...");
        setTimeout(() => {
          navigate("/company/login");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-16 text-white max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Registration Complete!</h2>
          <p className="text-white/80 mb-4">
            Welcome to GetMax WFM! Your account has been created successfully.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/10 p-6 border-b border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Contract Configuration
                </h1>
                <p className="text-white/80">
                  Step {step} of {totalSteps}: Configure your service contracts
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      Contract Settings
                    </h3>
                    <p className="text-blue-200 text-sm">
                      Select multiple options for each category to configure
                      your service contracts. These settings will help us
                      customize GetMax to match your business operations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-select fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MultiSelectField
                  label="Client Types"
                  description="Types of clients you work with"
                  options={clientTypes}
                  selected={data.contractSettings.clientTypes || []}
                  onChange={(selected) =>
                    updateContractSettings({ clientTypes: selected })
                  }
                  error={errors.clientTypes}
                />

                <MultiSelectField
                  label="Contract Types"
                  description="Types of contracts you offer"
                  options={contractTypes}
                  selected={data.contractSettings.contractTypes || []}
                  onChange={(selected) =>
                    updateContractSettings({ contractTypes: selected })
                  }
                  error={errors.contractTypes}
                />

                <MultiSelectField
                  label="Specialty Types"
                  description="Medical specialties you handle"
                  options={specialtyTypes}
                  selected={data.contractSettings.specialtyTypes || []}
                  onChange={(selected) =>
                    updateContractSettings({ specialtyTypes: selected })
                  }
                  error={errors.specialtyTypes}
                />

                <MultiSelectField
                  label="Scope Formats"
                  description="Systems and formats you work with"
                  options={scopeFormats}
                  selected={data.contractSettings.scopeFormats || []}
                  onChange={(selected) =>
                    updateContractSettings({ scopeFormats: selected })
                  }
                  error={errors.scopeFormats}
                />
              </div>

              {/* Service Areas - Full width */}
              <MultiSelectField
                label="Service Areas"
                description="Areas of service you provide"
                options={serviceAreas}
                selected={data.contractSettings.serviceAreas || []}
                onChange={(selected) =>
                  updateContractSettings({ serviceAreas: selected })
                }
                error={errors.serviceAreas}
              />
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Shield className="w-4 h-4 text-green-400" />
                <span>
                  Your configuration is encrypted and can be modified later in
                  settings
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/company/login")}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  disabled={loading}
                >
                  Already have an account?
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
