// frontend/src/pages/auth/signup/SignupStep3.jsx

// UPDATED - Business Details and Company Information

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Globe,
  Users,
  Clock,
  ArrowRight,
  ArrowLeft,
  Building,
} from "lucide-react";
import { toast } from "react-hot-toast";
import InputField from "../../../components/forms/InputField.jsx";
import SelectField from "../../../components/forms/SelectField.jsx";

const businessTypes = [
  { value: "Healthcare", label: "🏥 Healthcare" },
  { value: "Technology", label: "💻 Technology" },
  { value: "Manufacturing", label: "🏭 Manufacturing" },
  { value: "Retail", label: "🛍️ Retail" },
  { value: "Finance", label: "💰 Finance" },
  { value: "Education", label: "🎓 Education" },
  { value: "Consulting", label: "💼 Consulting" },
  { value: "Real Estate", label: "🏠 Real Estate" },
  { value: "Non-Profit", label: "🤝 Non-Profit" },
  { value: "Other", label: "📦 Other" },
];

const companySizes = [
  { value: "1-10", label: "👥 1-10 employees" },
  { value: "10-50", label: "👨‍👩‍👧‍👦 11-50 employees" },
  { value: "50-200", label: "🏢 51-200 employees" },
  { value: "202-500", label: "🏬 201-500 employees" },
  { value: "500+", label: "🏭 501-1000 employees" },
];

const timeZones = [
  { value: "IST", label: "🇮🇳 IST (India Standard Time)" },
  { value: "PST", label: "🇺🇸 PST (Pacific Standard Time)" },
  { value: "EST", label: "🇺🇸 EST (Eastern Standard Time)" },
  { value: "CST", label: "🇺🇸 CST (Central Standard Time)" },
  { value: "MST", label: "🇺🇸 MST (Mountain Standard Time)" },
  { value: "GMT", label: "🇬🇧 GMT (Greenwich Mean Time)" },
  { value: "CET", label: "🇪🇺 CET (Central European Time)" },
  { value: "JST", label: "🇯🇵 JST (Japan Standard Time)" },
  { value: "AEST", label: "🇦🇺 AEST (Australian Eastern Standard Time)" },
];

const industries = [
  { value: "Healthcare & Medical", label: "Healthcare & Medical" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Financial Services", label: "Financial Services" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail & E-commerce", label: "Retail & E-commerce" },
  { value: "Education", label: "Education" },
  { value: "Consulting", label: "Consulting" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Transportation & Logistics", label: "Transportation & Logistics" },
  { value: "Energy & Utilities", label: "Energy & Utilities" },
  { value: "Media & Entertainment", label: "Media & Entertainment" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Non-Profit", label: "Non-Profit" },
  { value: "Government", label: "Government" },
  { value: "Other", label: "Other" },
];

export default function SignupStep3({
  data,
  updateData,
  onNext,
  onBack,
  errors,
  setErrors,
  step,
  totalSteps,
}) {
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Business type validation
    if (!data.businessType?.trim()) {
      newErrors.businessType = "Business type is required";
    }

    // Industry validation
    if (!data.industry?.trim()) {
      newErrors.industry = "Industry is required";
    }

    // Company size validation
    if (!data.companySize?.trim()) {
      newErrors.companySize = "Company size is required";
    }

    // Time zone validation
    if (!data.timeZone?.trim()) {
      newErrors.timeZone = "Time zone is required";
    }

    // Website validation (optional, but if provided should be valid)
    if (data.website && data.website.trim()) {
      const websiteRegex =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!websiteRegex.test(data.website)) {
        newErrors.website = "Please enter a valid website URL";
      }
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
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Business Information
                </h1>
                <p className="text-white/80">
                  Step {step} of {totalSteps}: Tell us about your business
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
            <form className="space-y-6">
              {/* Business Type & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Business Type *
                  </label>
                  <SelectField
                    value={data.businessType || ""}
                    setValue={(val) => updateData({ businessType: val })}
                    options={businessTypes}
                    placeholder="Select business type"
                    icon={Building}
                    error={errors.businessType}
                  />
                  {errors.businessType && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Industry *
                  </label>
                  <SelectField
                    value={data.industry || ""}
                    setValue={(val) => updateData({ industry: val })}
                    options={industries.map((industry) => ({
                      value: industry.value,
                      label: industry.label,
                    }))}
                    placeholder="Select your industry"
                    icon={Briefcase}
                    error={errors.industry}
                  />
                  {errors.industry && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.industry}
                    </p>
                  )}
                </div>
              </div>

              {/* Company Size & Time Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Company Size *
                  </label>
                  <SelectField
                    value={data.companySize || ""}
                    setValue={(val) => updateData({ companySize: val })}
                    options={companySizes}
                    placeholder="Select company size"
                    icon={Users}
                    error={errors.companySize}
                  />
                  {errors.companySize && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.companySize}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">
                    Primary Time Zone *
                  </label>
                  <SelectField
                    value={data.timeZone || ""}
                    setValue={(val) => updateData({ timeZone: val })}
                    options={timeZones}
                    placeholder="Select time zone"
                    icon={Clock}
                    error={errors.timeZone}
                  />
                  {errors.timeZone && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.timeZone}
                    </p>
                  )}
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-white/90 font-medium mb-2">
                  Company Website{" "}
                  <span className="text-white/60">(Optional)</span>
                </label>
                <InputField
                  type="url"
                  value={data.website || ""}
                  setValue={(val) => updateData({ website: val })}
                  placeholder="https://www.yourcompany.com"
                  icon={Globe}
                  error={errors.website}
                />
                {errors.website && (
                  <p className="text-red-400 text-sm mt-1">{errors.website}</p>
                )}
                <p className="text-white/60 text-xs mt-1">
                  Your website helps us understand your business better
                </p>
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-white/90 font-medium mb-2">
                  Business Description{" "}
                  <span className="text-white/60">(Optional)</span>
                </label>
                <textarea
                  value={data.businessDescription || ""}
                  onChange={(e) =>
                    updateData({ businessDescription: e.target.value })
                  }
                  placeholder="Tell us about your company and what you do..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 resize-none"
                />
                <p className="text-white/60 text-xs mt-1">
                  Help us customize GetMax for your specific business needs
                </p>
              </div>
            </form>

            {/* Information Card */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Why do we need this information?
                  </h4>
                  <p className="text-blue-200 text-sm">
                    This helps us customize GetMax WFM to better suit your
                    industry needs, configure appropriate workflows, and provide
                    relevant features for your business size.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/company/login")}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Already have an account?
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
    </div>
  );
}
