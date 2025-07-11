// frontend/src/components/ui/Progress.jsx

import React from "react";

export const Progress = ({
  value = 0,
  max = 100,
  className = "",
  size = "md",
  variant = "primary",
  showLabel = false,
  label = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const variantClasses = {
    primary: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    info: "bg-purple-500",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          <span className="text-gray-300">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`h-full transition-all duration-300 ease-out ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};