// frontend/src/components/forms/MultiSelectField.jsx

import React, { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

export const MultiSelectField = ({
  label,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Select options...",
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOption = (optionValue) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((val) => val !== optionValue)
      : [...selectedValues, optionValue];

    onChange(newValues);
  };

  const handleRemoveOption = (optionValue) => {
    const newValues = selectedValues.filter((val) => val !== optionValue);
    onChange(newValues);
  };

  const getSelectedLabels = () => {
    return options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Selected Values Display */}
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {getSelectedLabels().map((label, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm"
              >
                <span>{label}</span>
                <button
                  onClick={() => handleRemoveOption(selectedValues[index])}
                  className="hover:bg-blue-500/30 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3 py-2 rounded-lg text-left
            bg-slate-800/50 border border-slate-600/50
            text-white focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500" : ""}
            flex items-center justify-between
          `}
        >
          <span
            className={
              selectedValues.length === 0 ? "text-gray-400" : "text-white"
            }
          >
            {selectedValues.length === 0
              ? placeholder
              : `${selectedValues.length} selected`}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Options Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggleOption(option.value)}
                className="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors flex items-center justify-between"
              >
                <span className="text-white">{option.label}</span>
                {selectedValues.includes(option.value) && (
                  <Check className="w-4 h-4 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
