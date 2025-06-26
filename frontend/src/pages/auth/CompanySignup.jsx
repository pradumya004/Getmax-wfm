import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  User,
  Check,
  Shield,
  ArrowRight,
} from "lucide-react";
import InputField from "../../components/forms/InputField";
import SelectField from "../../components/forms/SelectField";

// Plan options
const planOptions = [
  { value: "basic", label: "Basic Plan" },
  { value: "professional", label: "Professional Plan" },
  { value: "enterprise", label: "Enterprise Plan" },
];

// Simple validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export default function CompanySignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    contactEmail: "",
    phoneNumber: "",
    planType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.companyName)) {
      newErrors.companyName = "Company name is required";
    }

    if (!validateRequired(formData.contactPerson)) {
      newErrors.contactPerson = "Contact person is required";
    }

    if (!validateEmail(formData.contactEmail)) {
      newErrors.contactEmail = "Valid email is required";
    }

    if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Valid phone number is required";
    }

    if (!validateRequired(formData.planType)) {
      newErrors.planType = "Please select a plan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would make the actual API call
      // Example: const response = await fetch('/api/auth/company/signup', { method: 'POST', body: JSON.stringify(formData) });

      // Simulate API call for now
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            companyName: "",
            contactPerson: "",
            contactEmail: "",
            phoneNumber: "",
            planType: "",
          });
        }, 3000);
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ submit: "Registration failed. Please try again." });
    }
  };

  const isFormValid =
    formData.companyName &&
    formData.contactPerson &&
    formData.contactEmail &&
    formData.phoneNumber &&
    formData.planType;

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to GetMax!
          </h2>
          <p className="text-white/80 text-lg">
            Your company registration is complete. Check your email for next
            steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/10 p-8 border-b border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Company Registration
                </h1>
                <p className="text-white/80">
                  Join GetMax WFM and manage your workforce efficiently
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <InputField
                  type="text"
                  value={formData.companyName}
                  setValue={(value) => handleInputChange("companyName", value)}
                  placeholder="Company Name"
                  icon={Building2}
                  required
                />
                {errors.companyName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Contact Person */}
              <div>
                <InputField
                  type="text"
                  value={formData.contactPerson}
                  setValue={(value) =>
                    handleInputChange("contactPerson", value)
                  }
                  placeholder="Contact Person Name"
                  icon={User}
                  required
                />
                {errors.contactPerson && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div>
                <InputField
                  type="email"
                  value={formData.contactEmail}
                  setValue={(value) => handleInputChange("contactEmail", value)}
                  placeholder="Contact Email"
                  icon={Mail}
                  required
                />
                {errors.contactEmail && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <InputField
                  type="tel"
                  value={formData.phoneNumber}
                  setValue={(value) => handleInputChange("phoneNumber", value)}
                  placeholder="Phone Number"
                  icon={Phone}
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Plan Selection */}
              <div>
                <SelectField
                  value={formData.planType}
                  setValue={(value) => handleInputChange("planType", value)}
                  options={planOptions}
                  placeholder="Select Plan Type"
                  required
                />
                {errors.planType && (
                  <p className="text-red-400 text-sm mt-1">{errors.planType}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  isFormValid && !isSubmitting
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-white/20 text-white/60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Company</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
              </button>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl">
                <div className="flex items-center space-x-2 text-sm text-white/80">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>
                    Your data is encrypted and secure with enterprise-grade
                    protection.
                  </span>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-white/70">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/company/login")}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
