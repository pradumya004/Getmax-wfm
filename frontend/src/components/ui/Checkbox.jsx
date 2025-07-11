// frontend/src/components/ui/Checkbox.jsx

import React from "react";
import { Check } from "lucide-react";

export const Checkbox = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  error,
  theme: themeProp,
  className = "",
  ...props
}) => {
  const theme = themeProp;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-all
              ${
                checked
                  ? theme
                    ? `bg-[#1de9b6]/20 border-${theme.accent}`
                    : "bg-gray-500 border-gray-700"
                  : theme
                  ? `border-${theme.border} bg-${theme.accent}`
                  : "border-gray-400 bg-transparent"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${error ? "border-red-500" : ""}
              hover:${
                checked
                  ? theme
                    ? `bg-${theme.accent}/80`
                    : "bg-blue-600"
                  : theme
                  ? `border-${theme.accent}`
                  : "border-blue-400"
              }
            `}
          >
            {checked && (
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        {label && (
          <span
            className={`text-sm font-medium select-none ${
              disabled
                ? "text-gray-500"
                : theme
                ? `text-${theme.text}`
                : "text-gray-300"
            }`}
          >
            {label}
          </span>
        )}
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
