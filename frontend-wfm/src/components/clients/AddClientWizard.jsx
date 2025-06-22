import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

import StepIndicator from '@/components/clients/steps/StepIndicator';
import Step1ClientInfo from '@/components/clients/steps/Step1ClientInfo';
import Step2Services from '@/components/clients/steps/Step2Services';
import Step3NotesTemplate from '@/components/clients/steps/Step3NotesTemplate';
import Step4IntakeFields from '@/components/clients/steps/Step4IntakeFields';
import Step5RampPlan from '@/components/clients/steps/Step5RampPlan';
import ClientSummaryPreview from '@/components/clients/ClientSummaryPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  { id: 1, name: 'Client Info' },
  { id: 2, name: 'Services & SOW' },
  { id: 3, name: 'Notes Template' },
  { id: 4, name: 'Intake Fields' },
  { id: 5, name: 'Ramp Plan' },
];

const AddClientWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientType: '',
    clientSubType: '',
    contractType: '',
    ehrTemplate: '',
    startDate: null,
    endDate: null,
    internalNotes: '',
    services: [
      { id: 1, serviceType: '', dailyTarget: '', qaBenchmark: '', employeesNeeded: '', sowRoleLabel: '' }
    ],
    notesTemplate: [
      { id: 1, categoryName: '', noteInputType: '', placeholderLabel: '', mergeAsOutput: false }
    ],
    intakeFields: [
      { id: 1, fieldLabel: 'Claim Status', fieldType: 'Dropdown', options: 'Open / Paid / Follow-up' },
      { id: 2, fieldLabel: 'Root Cause', fieldType: 'Paragraph', options: '' },
    ],
    dailyClaimVolume: '',
    monthlyVolume: '',
    annualVolume: '',
    idealTeamSize: '',
    backupRatio: '',
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    toast({
      title: "🎉 Client Contract Created!",
      description: `Contract for ${formData.clientName} has been saved as a draft.`,
    });
    navigate('/clients');
  };

  const handleSaveDraft = () => {
     toast({
      title: "📝 Draft Saved",
      description: "Your progress has been saved as a draft.",
    });
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ClientInfo formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2Services formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step3NotesTemplate formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4IntakeFields formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5RampPlan formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Client Contract Setup</h1>
        <p className="text-gray-300">Onboard new clients and configure their SOW</p>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2 bg-glass-dark border-[#39ff14]/20">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="lg:col-span-1 sticky top-24">
          <ClientSummaryPreview formData={formData} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSaveDraft}>Save as Draft</Button>
            {currentStep < steps.length ? (
                <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88]" onClick={handleNext}>Save & Continue</Button>
            ) : (
                <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88]" onClick={handleSubmit}>Finish & Create Contract</Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddClientWizard;