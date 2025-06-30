import React, { useState } from "react";
import SignupStep1 from "./signupStep1";
import SignupStep2 from "./signupStep2";
import SignupStep3 from "./signupStep3";

export default function CompanySignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    // <div className="h-[90vh] rounded-2xl flex items-center justify-center p-5 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    //   <div className="w-full max-h-full max-w-2xl bg-white/10 backdrop-blur-xl p-8 border border-white/20 rounded-2xl shadow-2xl text-white">
        
    //   </div>
    // </div>

    <div>
      {step === 1 && (
          <SignupStep1
            onNext={goNext}
            data={formData}
            updateData={updateFormData}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {step === 2 && (
          <SignupStep2
            onNext={goNext}
            onBack={goBack}
            data={formData}
            updateData={updateFormData}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {step === 3 && (
          <SignupStep3
            onBack={goBack}
            data={formData}
            updateData={updateFormData}
            setStep={setStep}
            errors={errors}
            setErrors={setErrors}
          />
        )}
    </div>
  );
}