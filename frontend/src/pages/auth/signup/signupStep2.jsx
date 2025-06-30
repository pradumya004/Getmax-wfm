import React from "react";
import InputField from "../../../components/forms/InputField";
// import { ArrowRight, ArrowLeft } from "lucide-react";
import { Building2, Mail, Phone, User, ArrowRight } from "lucide-react";

const handleSubmit = (e) => e.preventDefault();

export default function SignupStep2({ data, updateData, onNext, onBack, errors, setErrors }) {

   const validate = () => {
    const newErrors = {};
    if (!data.billingContactName) newErrors.billingContactName = "Billing contact is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.billingEmail || ""))
      newErrors.billingEmail = "Valid billing email required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="h-fit rounded-2xl flex items-center scroll-auto overflow-hidden justify-center p-7 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
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
              <label className="block text-white/80 mb-1">Street Address</label>
              <InputField type="text" value={data.street || ""} setValue={(val) => updateData({ street: val })} placeholder="Street Address" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-1">City</label>
                <InputField type="text" value={data.city || ""} setValue={(val) => updateData({ city: val })} placeholder="City" />
              </div>

              <div>
                <label className="block text-white/80 mb-1">Zip Code</label>
                <InputField type="text" value={data.zipCode || ""} setValue={(val) => updateData({ zipCode: val })} placeholder="Zip Code" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-1">State</label>
                <InputField type="text" value={data.state || ""} setValue={(val) => updateData({ state: val })} placeholder="State" />
              </div>

              <div>
                <label className="block text-white/80 mb-1">Country</label>
                <InputField type="text" value={data.country || "India"} setValue={(val) => updateData({ country: val })} placeholder="Country" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-1">Billing Name</label>
                <InputField type="text" value={data.billingContactName || ""} setValue={(val) => updateData({ billingContactName: val })} placeholder="Billing Name" />
                {errors.billingContactName && <p className="text-red-400 text-sm mt-1">{errors.billingContactName}</p>}
              </div>

              <div>
                <label className="block text-white/80 mb-1">Billing Email</label>
                <InputField type="email" value={data.billingEmail || ""} setValue={(val) => updateData({ billingEmail: val })} placeholder="Billing Email" />
                {errors.billingEmail && <p className="text-red-400 text-sm mt-1">{errors.billingEmail}</p>}
              </div>
            </div>


          </form>

          {/*Continue Button*/}

          <div className="flex justify-between mt-6">
            <button onClick={onBack} className="px-6 py-3 bg-white/20 text-white rounded-xl">Back</button>
            <button onClick={(e) => {
              e.preventDefault();
              if (validate()) onNext();
            }} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Continue</button>
          </div>

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