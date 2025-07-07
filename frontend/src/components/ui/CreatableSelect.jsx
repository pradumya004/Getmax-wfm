// frontend/src/components/ui/CreatableSelect.jsx

import React from "react";
import CreatableSelect from "react-select/creatable";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

export const CustomCreatableSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Type to search or create new...",
  error,
  isLoading = false,
  isClearable = true,
  helperText,
  ...props
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  // Convert string value to option format if needed
  const formatValue = (val) => {
    if (!val) return null;
    if (typeof val === "string") {
      return { value: val, label: val };
    }
    return val;
  };

  // Custom styles for react-select to match your theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      borderColor: error
        ? "#ef4444"
        : state.isFocused
        ? "#3b82f6"
        : "rgba(71, 85, 105, 0.3)",
      borderWidth: "1px",
      borderRadius: "0.5rem",
      minHeight: "40px",
      boxShadow: state.isFocused ? `0 0 0 1px #3b82f6` : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "rgba(71, 85, 105, 0.5)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
    }),
    input: (provided) => ({
      ...provided,
      color: "#ffffff",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1e293b",
      border: "1px solid rgba(71, 85, 105, 0.3)",
      borderRadius: "0.5rem",
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#334155" : "transparent",
      color: "#ffffff",
      fontSize: "14px",
      "&:hover": {
        backgroundColor: "#334155",
      },
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: "#3b82f6",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#ffffff",
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#ffffff",
      },
    }),
  };

  const handleChange = (selectedOption) => {
    // Return just the value string, not the option object
    onChange(selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className={`block text-sm font-medium text-${theme.text}`}>
          {label}
        </label>
      )}

      <CreatableSelect
        value={formatValue(value)}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        isClearable={isClearable}
        isLoading={isLoading}
        styles={customStyles}
        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        noOptionsMessage={() => "Type to create new option"}
        {...props}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      {helperText && !error && (
        <p className="text-xs text-gray-400">{helperText}</p>
      )}
    </div>
  );
};
