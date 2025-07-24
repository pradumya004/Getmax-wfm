// frontend/src/components/ui/TextArea.jsx

import React from "react";

export const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  rows = 4,
  className = "",
  required = false,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
          error ? "border-red-500" : "border-gray-600"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
