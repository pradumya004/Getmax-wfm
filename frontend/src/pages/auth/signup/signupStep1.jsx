import React from "react";
import InputField from "../../../components/forms/InputField";
import SelectField from "../../../components/forms/SelectField";
import { Building2, Mail, Phone, User, ArrowRight, Globe } from "lucide-react";
import { isValidPhoneNumber } from 'libphonenumber-js';
import toast from "react-hot-toast"; 
import { useNavigate } from "react-router-dom";

const planOptions = [
  { value: "Trial", label: "Trial" },
  { value: "Basic", label: "Basic Plan" },
  { value: "Professional", label: "Professional Plan" },
  { value: "Enterprise", label: "Enterprise Plan" },
];
const countryOptions = [
  { value: "IN", label: "🇮🇳 India" },
  { value: "US", label: "🇺🇸 USA" },
  { value: "AE", label: "🇦🇪 UAE" },
  { value: "GB", label: "🇬🇧 UK" },
  { value: "CA", label: "🇨🇦 Canada" }
];

export default function SignupStep1({ data, updateData, onNext, errors, setErrors }) {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const validate = () => {
    const newErrors = {};

    if (!data.companyName) newErrors.companyName = "Company name is required";
    if (!data.contactPerson) newErrors.contactPerson = "Contact person is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail || ""))
      newErrors.contactEmail = "Valid email is required";
    if (!/^\+?\d{10,15}$/.test(data.contactPhone || ""))
      newErrors.contactPhone = "Valid phone number is required";
    if (!data.companyPassword || data.companyPassword.length < 6)
      newErrors.companyPassword = "Password must be at least 6 characters";
    if (data.companyPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!data.subscriptionPlan)
      newErrors.subscriptionPlan = "Subscription plan is required";

    setErrors(newErrors);

    // 🟡 Show toast for the first error
    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      toast.error(newErrors[firstKey]);
      return false;
    }

    return true;
  };

  return (
  <div className="h-fit rounded-2xl flex items-center scroll-auto overflow-hidden justify-center p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <div className="relative h-fit w-full max-w-2xl">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white/10 p-2 px-4 border-b border-white/20">
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

        <div className="p-4">
          <form className="space-y-3">
            <div>
              <label className="block text-white/80 mb-1">Company Name</label>
              <InputField
                type="text"
                value={data.companyName || ""}
                setValue={(val) => updateData({ companyName: val })}
                placeholder="Company Name"
                icon={Building2}
              />
              {errors.companyName && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-1">Contact Person</label>
                <InputField
                  type="text"
                  value={data.contactPerson || ""}
                  setValue={(val) => updateData({ contactPerson: val })}
                  placeholder="Contact Person"
                  icon={User}
                />
                {errors.contactPerson && <p className="text-red-400 text-sm mt-1">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block text-white/80 mb-1">Contact Email</label>
                <InputField
                  type="email"
                  value={data.contactEmail || ""}
                  setValue={(val) => updateData({ contactEmail: val })}
                  placeholder="Contact Email"
                  icon={Mail}
                />
                {errors.contactEmail && <p className="text-red-400 text-sm mt-1">{errors.contactEmail}</p>}
              </div>
            </div>


            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-white/80 mb-1">Phone Country</label>
                <SelectField
                  value={data.phoneCountry || "IN"}
                  setValue={(val) => updateData({ phoneCountry: val })}
                  options={countryOptions}
                  placeholder="Select Country"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-white/80 mb-1">Contact Phone</label>
                <InputField
                  type="tel"
                  value={data.contactPhone || ""}
                  setValue={(val) => updateData({ contactPhone: val })}
                  placeholder="Phone"
                  icon={Phone}
                />
                {errors.contactPhone && <p className="text-red-400 text-sm mt-1">{errors.contactPhone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-1">Password</label>
                <InputField
                  type="password"
                  value={data.companyPassword || ""}
                  setValue={(val) => updateData({ companyPassword: val })}
                  placeholder="Password"
                />
                {errors.companyPassword && <p className="text-red-400 text-sm mt-1">{errors.companyPassword}</p>}
              </div>

              <div>
                <label className="block text-white/80 mb-1">Confirm Password</label>
                <InputField
                  type="password"
                  value={confirmPassword}
                  setValue={(val) => setConfirmPassword(val)}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>


            <div>
              <label className="block text-white/80 mb-1">Subscription Plan</label>
              <SelectField
                value={data.subscriptionPlan || ""}
                setValue={(val) => updateData({ subscriptionPlan: val })}
                options={planOptions}
                placeholder="Select Plan"
              />
              {errors.subscriptionPlan && <p className="text-red-400 text-sm mt-1">{errors.subscriptionPlan}</p>}
            </div>
          </form>

          {/* Continue Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (validate()) onNext();
            }}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Login Link */}
          <div className="mt-5 text-center">
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