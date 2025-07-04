// frontend/src/components/ui/Select.jsx

import React from "react";
import { ChevronDown } from "lucide-react";

export const Select = ({
  label,
  error,
  options = [],
  placeholder = "Select...",
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-3 py-2 rounded-lg appearance-none
            bg-slate-800/50 border border-slate-600/50
            text-white focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};