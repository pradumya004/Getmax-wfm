// frontend/src/components/forms/DatePicker.jsx

import React from "react";
import { Calendar } from "lucide-react";

export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
  placeholder = "Select date...",
  theme = "company",
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className={`
            w-full px-3 py-2 pr-10 rounded-lg
            bg-slate-800/50 border border-slate-600/50
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            focus:border-transparent transition-all duration-200
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : `focus:ring-${
                    theme === "admin"
                      ? "red"
                      : theme === "employee"
                      ? "emerald"
                      : "blue"
                  }-500`
            }
          `}
          {...props}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};