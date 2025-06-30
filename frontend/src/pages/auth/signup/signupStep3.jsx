import React, { useState } from "react";
import SelectField from "../../../components/forms/SelectField";
import {
  Shield, Check, Building2, FileText, Briefcase,
  LayoutDashboard, Users2, Clock
} from "lucide-react";
import toast from "react-hot-toast";

const contractTypes = ["End to End", "Transactional", "FTE", "Hybrid", "Consulting"];
const clientTypes = ["Billing Company", "Provider", "Others"];
const specialties = ["Primary Care", "Specialty Care", "Dental", "Vision", "Mental Health", "Surgery Centers", "Hospitals", "Labs", "Multi Specialty", "DME"];
const scopes = ["ClaimMD", "Medisoft", "Custom"];
const sizes = ["1-10", "10-50", "50-200", "200-500", "500+"];
const zones = ["IST", "MST", "GMT", "CST"];

export default function SignupStep3({ data, updateData, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!data.clientType) newErrors.clientType = "Client type is required";
    if (!data.contractType) newErrors.contractType = "Contract type is required";
    if (!data.specialtyType) newErrors.specialtyType = "Specialty is required";
    if (!data.scopeFormatID) newErrors.scopeFormatID = "Scope format is required";
    if (!data.companySize) newErrors.companySize = "Company size is required";
    if (!data.timeZone) newErrors.timeZone = "Time zone is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/companies/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const result = await res.json();
        if (result?.message?.toLowerCase().includes("already exists")) {
          toast.error("Company already exists. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/company/login";
          }, 2000); // redirect after 2 seconds
        } else {
          toast.error(result?.message || "Signup failed. Try again.");
        }
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <div className="text-center p-16 text-white">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Registration Complete!</h2>
        <p>Check your email for next steps.</p>
      </div>
    );
  }

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

          {/* Form */}
          <div className="p-4 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-white/30">
            <form className="space-y-3">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-1">Client Type</label>
                  <SelectField
                    icon={Briefcase}
                    value={data.clientType || ""}
                    setValue={(val) => updateData({ clientType: val })}
                    options={clientTypes.map(v => ({ value: v, label: v }))}
                    placeholder="Client Type"
                  />
                  {errors.clientType && <p className="text-red-400 text-sm mt-1">{errors.clientType}</p>}
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Contract Type</label>
                  <SelectField
                    icon={FileText}
                    value={data.contractType || ""}
                    setValue={(val) => updateData({ contractType: val })}
                    options={contractTypes.map(v => ({ value: v, label: v }))}
                    placeholder="Contract Type"
                  />
                  {errors.contractType && <p className="text-red-400 text-sm mt-1">{errors.contractType}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-1">Specialty Type</label>
                  <SelectField
                    icon={LayoutDashboard}
                    value={data.specialtyType || ""}
                    setValue={(val) => updateData({ specialtyType: val })}
                    options={specialties.map(v => ({ value: v, label: v }))}
                    placeholder="Specialty"
                  />
                  {errors.specialtyType && <p className="text-red-400 text-sm mt-1">{errors.specialtyType}</p>}
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Scope Format</label>
                  <SelectField
                    icon={FileText}
                    value={data.scopeFormatID || ""}
                    setValue={(val) => updateData({ scopeFormatID: val })}
                    options={scopes.map(v => ({ value: v, label: v }))}
                    placeholder="Scope Format"
                  />
                  {errors.scopeFormatID && <p className="text-red-400 text-sm mt-1">{errors.scopeFormatID}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-1">Company Size</label>
                  <SelectField
                    icon={Users2}
                    value={data.companySize || ""}
                    setValue={(val) => updateData({ companySize: val })}
                    options={sizes.map(v => ({ value: v, label: v }))}
                    placeholder="Company Size"
                  />
                  {errors.companySize && <p className="text-red-400 text-sm mt-1">{errors.companySize}</p>}
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Time Zone</label>
                  <SelectField
                    icon={Clock}
                    value={data.timeZone || ""}
                    setValue={(val) => updateData({ timeZone: val })}
                    options={zones.map(v => ({ value: v, label: v }))}
                    placeholder="Time Zone"
                  />
                  {errors.timeZone && <p className="text-red-400 text-sm mt-1">{errors.timeZone}</p>}
                </div>
              </div>
            </form>

            <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl text-white text-sm flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Your data is encrypted and secured.</span>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white/20 text-white rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-xl"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

            <div className="mt-5 text-center">
              <p className="text-white/70">
                Already have an account?{" "}
                <button
                  onClick={() => window.location.href = "/company/login"}
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