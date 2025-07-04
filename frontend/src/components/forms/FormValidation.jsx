// frontend/src/components/forms/FormValidation.jsx

import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export const ValidationMessage = ({
  type = "error",
  message,
  className = "",
}) => {
  const styles = {
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      icon: AlertCircle,
    },
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      text: "text-green-400",
      icon: CheckCircle,
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400",
      icon: AlertCircle,
    },
  };

  const style = styles[type] || styles.error;
  const IconComponent = style.icon;

  return (
    <div
      className={`
      flex items-start space-x-2 p-3 rounded-lg border
      ${style.bg} ${style.border} ${className}
    `}
    >
      <IconComponent className={`w-4 h-4 ${style.text} mt-0.5 flex-shrink-0`} />
      <p className={`text-sm ${style.text}`}>{message}</p>
    </div>
  );
};

export const FormErrors = ({ errors = {}, className = "" }) => {
  const errorList = Object.values(errors).filter(Boolean);

  if (errorList.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {errorList.map((error, index) => (
        <ValidationMessage key={index} type="error" message={error} />
      ))}
    </div>
  );
};

export const FormSuccess = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <ValidationMessage type="success" message={message} className={className} />
  );
};