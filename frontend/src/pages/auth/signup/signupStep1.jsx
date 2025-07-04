// frontend/src/pages/auth/signup/signupStep1.jsx

// UPDATED - Basic Company Information with enhanced validation

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  User,
  ArrowRight,
  Globe,
  Shield,
} from "lucide-react";
import { toast } from "react-hot-toast";
import InputField from "../../../components/forms/InputField.jsx";
import SelectField from "../../../components/forms/SelectField.jsx";

const planOptions = [
  { value: "Trial", label: "🆓 Trial (30 days free)" },
  { value: "Basic", label: "💼 Basic Plan - $29/month" },
  { value: "Professional", label: "🚀 Professional Plan - $79/month" },
  { value: "Enterprise", label: "🏢 Enterprise Plan - $199/month" },
];

const countryOptions = [
  { value: "IN", label: "🇮🇳 India" },
  { value: "US", label: "🇺🇸 United States" },
  { value: "AE", label: "🇦🇪 UAE" },
  { value: "GB", label: "🇬🇧 United Kingdom" },
  { value: "CA", label: "🇨🇦 Canada" },
  { value: "AU", label: "🇦🇺 Australia" },
];

export default function SignupStep1({
  data,
  updateData,
  onNext,
  errors,
  setErrors,
  step,
  totalSteps,
}) {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");

  const validate = () => {
    const newErrors = {};

    // Company name validation
    if (!data.companyName?.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (data.companyName.length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
    }

    // Contact person validation
    if (!data.contactPerson?.trim()) {
      newErrors.contactPerson = "Contact person name is required";
    } else if (data.contactPerson.length < 2) {
      newErrors.contactPerson =
        "Contact person name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.contactEmail?.trim()) {
      newErrors.contactEmail = "Email address is required";
    } else if (!emailRegex.test(data.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-()]{10,15}$/;
    if (!data.contactPhone?.trim()) {
      newErrors.contactPhone = "Phone number is required";
    } else if (!phoneRegex.test(data.contactPhone.replace(/\s/g, ""))) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    // Password validation
    if (!data.companyPassword) {
      newErrors.companyPassword = "Password is required";
    } else if (data.companyPassword.length < 8) {
      newErrors.companyPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.companyPassword)) {
      newErrors.companyPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.companyPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Subscription plan validation
    if (!data.subscriptionPlan) {
      newErrors.subscriptionPlan = "Please select a subscription plan";
    }

    setErrors(newErrors);

    // Show first error as toast
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/10 p-6 border-b border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Your Company Account
                </h1>
                <p className="text-white/80">
                  Step {step} of {totalSteps}: Basic Company Information
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
          <div className="p-6">
            <form className="space-y-5">
              {/* Company Name */}
              <div>
                <label className="block text-white/90 font-medium mb-2">
                  Company Name *
                </label>
                <InputField
                  type="text"
                  value={data.companyName || ""}
                  setValue={(val) => updateData({ companyName: val })}
                  placeholder="Enter your company name"
                  icon={Building2}
                  error={errors.companyName}
                />
                {errors.companyName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Contact Person & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Contact Person *
                  </label>
                  <InputField
                    type="text"
                    value={data.contactPerson || ""}
                    setValue={(val) => updateData({ contactPerson: val })}
                    placeholder="Your full name"
                    icon={User}
                    error={errors.contactPerson}
                  />
                  {errors.contactPerson && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Business Email *
                  </label>
                  <InputField
                    type="email"
                    value={data.contactEmail || ""}
                    setValue={(val) => updateData({ contactEmail: val })}
                    placeholder="company@domain.com"
                    icon={Mail}
                    error={errors.contactEmail}
                  />
                  {errors.contactEmail && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Country & Number */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Country
                  </label>
                  <SelectField
                    value={data.phoneCountry || "IN"}
                    setValue={(val) => updateData({ phoneCountry: val })}
                    options={countryOptions}
                    placeholder="Country"
                    icon={Globe}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-white/90 font-medium mb-2">
                    Phone Number *
                  </label>
                  <InputField
                    type="tel"
                    value={data.contactPhone || ""}
                    setValue={(val) => updateData({ contactPhone: val })}
                    placeholder="Enter phone number"
                    icon={Phone}
                    error={errors.contactPhone}
                  />
                  {errors.contactPhone && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.contactPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Password *
                  </label>
                  <InputField
                    type="password"
                    value={data.companyPassword || ""}
                    setValue={(val) => updateData({ companyPassword: val })}
                    placeholder="Create secure password"
                    error={errors.companyPassword}
                  />
                  {errors.companyPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.companyPassword}
                    </p>
                  )}
                  <p className="text-white/60 text-xs mt-1">
                    Min 8 chars, uppercase, lowercase, number
                  </p>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Confirm Password *
                  </label>
                  <InputField
                    type="password"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Subscription Plan */}
              <div>
                <label className="block text-white/90 font-medium mb-2">
                  Subscription Plan *
                </label>
                <SelectField
                  value={data.subscriptionPlan || ""}
                  setValue={(val) => updateData({ subscriptionPlan: val })}
                  options={planOptions}
                  placeholder="Choose your plan"
                  error={errors.subscriptionPlan}
                />
                {errors.subscriptionPlan && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.subscriptionPlan}
                  </p>
                )}
                <p className="text-white/60 text-xs mt-1">
                  You can upgrade or downgrade anytime
                </p>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>
                  Your data is encrypted and secured with enterprise-grade
                  security
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={() => navigate("/company/login")}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Already have an account? Sign in
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
