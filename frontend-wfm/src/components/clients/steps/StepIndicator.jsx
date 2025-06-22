import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {step.id < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-[#39ff14]" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center bg-[#39ff14] rounded-full"
                >
                  <Check className="h-5 w-5 text-black" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.id === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-700" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center bg-glass-dark border-2 border-[#39ff14] rounded-full"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 bg-[#39ff14] rounded-full" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-700" />
                </div>
                <div
                  className="group relative flex h-8 w-8 items-center justify-center bg-glass-dark border-2 border-gray-700 rounded-full"
                >
                  <span className="h-2.5 w-2.5 bg-transparent rounded-full" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}
             <p className="absolute -bottom-7 w-max text-center text-xs font-medium text-gray-300">
                {step.name}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;