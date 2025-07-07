// frontend/src/pages/auth/signup/CompanySignup.jsx

// UPDATED - Enhanced multi-step signup with new API structure

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import SignupStep1 from "./SignupStep1.jsx";
import SignupStep2 from "./SignupStep2.jsx";
import SignupStep3 from "./SignupStep3.jsx";
import SignupStep4 from "./SignupStep4.jsx";
import SignupSuccess from "./SignupSuccess.jsx";

export default function CompanySignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Basic Company Info
    companyName: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    phoneCountry: "IN",
    companyPassword: "",
    subscriptionPlan: "",

    // Step 2 - Address & Billing
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    billingContactName: "",
    billingEmail: "",

    // Step 3 - Business Details
    businessType: "",
    companySize: "",
    timeZone: "",
    industry: "",
    website: "",

    // Step 4 - Contract Settings (Multiple selections)
    contractSettings: {
      clientTypes: [], // Multiple selection
      contractTypes: [], // Multiple selection
      specialtyTypes: [], // Multiple selection
      scopeFormats: [], // Multiple selection
      serviceAreas: [], // Multiple selection
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const goNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const updateContractSettings = (newSettings) => {
    setFormData((prev) => ({
      ...prev,
      contractSettings: { ...prev.contractSettings, ...newSettings },
    }));
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      setStep(stepNumber);
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      phoneCountry: "IN",
      companyPassword: "",
      subscriptionPlan: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      billingContactName: "",
      billingEmail: "",
      businessType: "",
      companySize: "",
      timeZone: "",
      industry: "",
      website: "",
      contractSettings: {
        clientTypes: [],
        contractTypes: [],
        specialtyTypes: [],
        scopeFormats: [],
        serviceAreas: [],
      },
    });
    setErrors({});
    setStep(1);
  };

  const stepProps = {
    data: formData,
    updateData: updateFormData,
    updateContractSettings,
    errors,
    setErrors,
    loading,
    setLoading,
    onNext: goNext,
    onPrev: goBack,
    goToStep,
    resetForm,
    step,
    totalSteps,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-xl">
      <Helmet>
        <title>Company Registration - GetMax WFM</title>
      </Helmet>

      {step === 1 && <SignupStep1 {...stepProps} />}
      {step === 2 && <SignupStep2 {...stepProps} />}
      {step === 3 && <SignupStep3 {...stepProps} />}
      {step === 4 && <SignupStep4 {...stepProps} />}
      {step === 5 && <SignupSuccess companyData={formData} />}
    </div>
  );
}
