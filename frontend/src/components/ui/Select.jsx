// frontend/src/components/ui/Select.jsx

import React from "react";
import { ChevronDown } from "lucide-react";

export const Select = ({
  label,
  error,
  options = [],
  value,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  ...props
}) => {
  // Normalize options to ensure consistent format
  const normalizedOptions = React.useMemo(() => {
    if (!Array.isArray(options)) {
      console.warn("Select component: options should be an array");
      return [];
    }

    return options.map((option, index) => {
      // Handle both string arrays and object arrays
      if (typeof option === "string") {
        return { value: option, label: option };
      }

      // Handle object format
      if (typeof option === "object" && option !== null) {
        return {
          value: option.value ?? option.label ?? `option_${index}`,
          label: option.label ?? option.value ?? `Option ${index + 1}`,
        };
      }

      // Fallback for invalid options
      console.warn(
        `Select component: Invalid option at index ${index}:`,
        option
      );
      return { value: `option_${index}`, label: `Option ${index + 1}` };
    });
  }, [options]);

  // Ensure unique keys by adding index if values are duplicate
  const uniqueOptions = React.useMemo(() => {
    const valueMap = new Map();

    return normalizedOptions.map((option, index) => {
      const originalValue = option.value;
      let uniqueValue = originalValue;

      // Check for duplicate values and make them unique
      if (valueMap.has(originalValue)) {
        uniqueValue = `${originalValue}_${index}`;
      }

      valueMap.set(originalValue, true);

      return {
        ...option,
        value: uniqueValue,
        originalValue: originalValue,
        key: `${originalValue}_${index}`, // Unique key for React
      };
    });
  }, [normalizedOptions]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value || ""}
          disabled={disabled}
          className={`
            w-full px-3 py-1 rounded-lg appearance-none
            bg-slate-800/50 border border-slate-600/50
            text-white focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {uniqueOptions.map((option) => (
            <option
              key={option.key}
              value={option.originalValue}
              className="bg-slate-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};
