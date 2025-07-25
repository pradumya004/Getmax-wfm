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
import { MultiSelectField } from "./../../../components/ui/MultiSelectField.jsx";
import { COMPANY_CONSTANTS } from "../../../../../shared/constants/modelConstants.js";

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
                  options={COMPANY_CONSTANTS.CLIENT_TYPES}
                  selected={data.contractSettings.clientTypes || []}
                  onChange={(selected) =>
                    updateContractSettings({ clientTypes: selected })
                  }
                  error={errors.clientTypes}
                />

                <MultiSelectField
                  label="Contract Types"
                  description="Types of contracts you offer"
                  options={COMPANY_CONSTANTS.CONTRACT_TYPES}
                  selected={data.contractSettings.contractTypes || []}
                  onChange={(selected) =>
                    updateContractSettings({ contractTypes: selected })
                  }
                  error={errors.contractTypes}
                />

                <MultiSelectField
                  label="Specialty Types"
                  description="Medical specialties you handle"
                  options={COMPANY_CONSTANTS.SPECIALTY_TYPES}
                  selected={data.contractSettings.specialtyTypes || []}
                  onChange={(selected) =>
                    updateContractSettings({ specialtyTypes: selected })
                  }
                  error={errors.specialtyTypes}
                />

                <MultiSelectField
                  label="Scope Formats"
                  description="Systems and formats you work with"
                  options={COMPANY_CONSTANTS.SCOPE_FORMATS}
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
                options={COMPANY_CONSTANTS.SERVICE_AREAS}
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
