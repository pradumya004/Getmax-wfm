// frontend/src/components/client/ClientOnboardingProcess.jsx

import React from "react";
import { CheckCircle } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const ClientOnboardingProgress = ({ client }) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const onboardingSteps = [
    {
      key: "documentation",
      label: "Documentation",
      completed: client.status?.onboardingProgress >= 20,
    },
    {
      key: "technical",
      label: "Technical Setup",
      completed: client.status?.onboardingProgress >= 40,
    },
    {
      key: "testing",
      label: "Testing",
      completed: client.status?.onboardingProgress >= 60,
    },
    {
      key: "training",
      label: "Training",
      completed: client.status?.onboardingProgress >= 80,
    },
    {
      key: "golive",
      label: "Go Live",
      completed: client.status?.onboardingProgress >= 100,
    },
  ];

  return (
    <Card className={`${theme.card} p-6`}>
      <h3 className="text-white font-semibold mb-4">Onboarding Progress</h3>
      <div className="space-y-3">
        {onboardingSteps.map((step, _) => (
          <div key={step.key} className="flex items-center space-x-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step.completed ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
            </div>
            <span
              className={`text-${
                step.completed ? "white" : theme.textSecondary
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className={`text-${theme.textSecondary}`}>Progress</span>
          <span className="text-white">
            {client.status?.onboardingProgress || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${theme.secondary} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${client.status?.onboardingProgress || 0}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};
