// frontend/src/pages/auth/signup/signupStep2.jsx

// UPDATED - Address and Billing Information

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Mail,
  CreditCard,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import InputField from "../../../components/forms/InputField.jsx";
import SelectField from "../../../components/forms/SelectField.jsx";

const countryOptions = [
  { value: "India", label: "🇮🇳 India" },
  { value: "United States", label: "🇺🇸 United States" },
  { value: "United Arab Emirates", label: "🇦🇪 UAE" },
  { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Australia", label: "🇦🇺 Australia" },
];

export default function SignupStep2({
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

    // Address validation
    if (!data.street?.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!data.city?.trim()) {
      newErrors.city = "City is required";
    } else if (data.city.length < 2) {
      newErrors.city = "City name must be at least 2 characters";
    }

    if (!data.state?.trim()) {
      newErrors.state = "State/Province is required";
    }

    if (!data.zipCode?.trim()) {
      newErrors.zipCode = "ZIP/Postal code is required";
    } else if (!/^[\w\s-]{3,10}$/.test(data.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP/Postal code";
    }

    if (!data.country?.trim()) {
      newErrors.country = "Country is required";
    }

    // Billing information validation
    if (!data.billingContactName?.trim()) {
      newErrors.billingContactName = "Billing contact name is required";
    } else if (data.billingContactName.length < 2) {
      newErrors.billingContactName =
        "Billing contact name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.billingEmail?.trim()) {
      newErrors.billingEmail = "Billing email is required";
    } else if (!emailRegex.test(data.billingEmail)) {
      newErrors.billingEmail = "Please enter a valid billing email address";
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

  const copyFromMainContact = () => {
    updateData({
      billingContactName: data.contactPerson,
      billingEmail: data.contactEmail,
    });
    toast.success("Contact information copied to billing");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/10 p-6 border-b border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Company Address & Billing
                </h1>
                <p className="text-white/80">
                  Step {step} of {totalSteps}: Address and billing information
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
              {/* Company Address Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Company Address
                </h3>

                <div className="space-y-4">
                  {/* Street Address */}
                  <div>
                    <label className="block text-white/90 font-medium mb-2">
                      Street Address *
                    </label>
                    <InputField
                      type="text"
                      value={data.street || ""}
                      setValue={(val) => updateData({ street: val })}
                      placeholder="Enter street address"
                      icon={MapPin}
                      error={errors.street}
                    />
                    {errors.street && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  {/* City & ZIP Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/90 font-medium mb-2">
                        City *
                      </label>
                      <InputField
                        type="text"
                        value={data.city || ""}
                        setValue={(val) => updateData({ city: val })}
                        placeholder="Enter city"
                        error={errors.city}
                      />
                      {errors.city && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">
                        ZIP/Postal Code *
                      </label>
                      <InputField
                        type="text"
                        value={data.zipCode || ""}
                        setValue={(val) => updateData({ zipCode: val })}
                        placeholder="Enter ZIP code"
                        error={errors.zipCode}
                      />
                      {errors.zipCode && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* State & Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/90 font-medium mb-2">
                        State/Province *
                      </label>
                      <InputField
                        type="text"
                        value={data.state || ""}
                        setValue={(val) => updateData({ state: val })}
                        placeholder="Enter state/province"
                        error={errors.state}
                      />
                      {errors.state && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">
                        Country *
                      </label>
                      <SelectField
                        value={data.country || "India"}
                        setValue={(val) => updateData({ country: val })}
                        options={countryOptions}
                        placeholder="Select country"
                        error={errors.country}
                      />
                      {errors.country && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Information Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Billing Information
                  </h3>

                  <button
                    type="button"
                    onClick={copyFromMainContact}
                    className="text-sm px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg transition-colors"
                  >
                    Copy from main contact
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">
                      Billing Contact Name *
                    </label>
                    <InputField
                      type="text"
                      value={data.billingContactName || ""}
                      setValue={(val) =>
                        updateData({ billingContactName: val })
                      }
                      placeholder="Billing contact name"
                      error={errors.billingContactName}
                    />
                    {errors.billingContactName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.billingContactName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 font-medium mb-2">
                      Billing Email *
                    </label>
                    <InputField
                      type="email"
                      value={data.billingEmail || ""}
                      setValue={(val) => updateData({ billingEmail: val })}
                      placeholder="billing@company.com"
                      icon={Mail}
                      error={errors.billingEmail}
                    />
                    {errors.billingEmail && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.billingEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>

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
