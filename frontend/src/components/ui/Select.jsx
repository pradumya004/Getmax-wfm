// frontend/src/components/ui/Select.jsx

import React from "react";
import { ChevronDown } from "lucide-react";

export const Select = ({
  label,
  error,
  options = [],
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
            w-full px-2 py-1 rounded-lg appearance-none
            bg-slate-800/50 border border-slate-600/50
            text-white focus:outline-none overflow-hidden focus:ring-2 focus:ring-red-500
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          {/* <option value="">{placeholder}</option> */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute overflow-visible right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};