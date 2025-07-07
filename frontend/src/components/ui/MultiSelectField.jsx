// frontend/src/components/ui/MultiSelectField.jsx

import React, { useState } from "react";
import { Check, X, Plus } from "lucide-react";

export const MultiSelectField = ({
  label,
  options,
  selected,
  onChange,
  error,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const removeItem = (value) => {
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className="space-y-2">
      <label className="block text-white/90 font-medium">{label} *</label>
      {description && <p className="text-white/60 text-sm">{description}</p>}

      {/* Selected items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
              >
                {option?.label || value}
                <button
                  type="button"
                  onClick={() => removeItem(value)}
                  className="ml-2 hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-left transition-all duration-300 ${
            error
              ? "border-red-400/50 focus:border-red-400"
              : "border-white/20 hover:border-white/40 focus:border-white/60"
          } ${isOpen ? "border-white/60" : ""}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/80">
              {selected.length > 0
                ? `${selected.length} selected`
                : `Select ${label.toLowerCase()}`}
            </span>
            <Plus
              className={`w-4 h-4 text-white/60 transition-transform ${
                isOpen ? "rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{option.label}</div>
                    <div className="text-white/60 text-sm">
                      {option.description}
                    </div>
                  </div>
                  {selected.includes(option.value) && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};
