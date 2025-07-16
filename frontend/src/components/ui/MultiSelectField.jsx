// frontend/src/components/ui/MultiSelectField.jsx

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, X, ChevronDown } from "lucide-react";

export const MultiSelectField = ({
  label,
  options = [],
  selected = [],
  onChange,
  error,
  description,
  disabled = false,
  placeholder,
  className = "",
  maxHeight = 256, // max-h-64 = 256px
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Normalize options to ensure consistent format
  const normalizedOptions = React.useMemo(() => {
    if (!Array.isArray(options)) {
      console.warn("MultiSelectField: options should be an array");
      return [];
    }

    return options.map((option, index) => {
      if (typeof option === "string") {
        return { value: option, label: option };
      }

      if (typeof option === "object" && option !== null) {
        return {
          value: option.value ?? option.label ?? `option_${index}`,
          label: option.label ?? option.value ?? `Option ${index + 1}`,
          description: option.description,
        };
      }

      console.warn(
        `MultiSelectField: Invalid option at index ${index}:`,
        option
      );
      return { value: `option_${index}`, label: `Option ${index + 1}` };
    });
  }, [options]);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Determine if dropdown should open upward or downward
      const openUpward = spaceBelow < maxHeight && spaceAbove > spaceBelow;

      setDropdownStyle({
        position: "fixed",
        top: openUpward
          ? rect.top - Math.min(maxHeight, spaceAbove)
          : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        maxHeight: openUpward
          ? Math.min(maxHeight, spaceAbove)
          : Math.min(maxHeight, spaceBelow),
      });
    }
  }, [isOpen, maxHeight]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both button and dropdown
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const toggleOption = (value, event) => {
    // Prevent event bubbling
    if (event) {
      event.stopPropagation();
    }

    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    onChange(newSelected);
  };

  const removeItem = (value, event) => {
    // Prevent event bubbling
    if (event) {
      event.stopPropagation();
    }

    onChange(selected.filter((item) => item !== value));
  };

  const handleButtonClick = (event) => {
    if (disabled) return;

    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium">
          {label}
        </label>
      )}

      {description && <p className="text-gray-400 text-sm">{description}</p>}

      {/* Selected items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((value) => {
            const option = normalizedOptions.find((opt) => opt.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
              >
                {option?.label || value}
                <button
                  type="button"
                  onClick={(e) => removeItem(value, e)}
                  className="ml-2 hover:text-blue-100 focus:outline-none focus:text-blue-100"
                  disabled={disabled}
                  aria-label={`Remove ${option?.label || value}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Dropdown button */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleButtonClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-slate-500 cursor-pointer"
          } ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-600/50 focus:border-blue-500"
          } ${isOpen ? "border-blue-500" : ""}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-300">
              {selected.length > 0
                ? `${selected.length} selected`
                : placeholder || `Select ${label || "options"}`}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Dropdown portal */}
        {isOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              style={dropdownStyle}
              className="bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-y-auto"
              role="listbox"
              aria-label={label}
            >
              {normalizedOptions.length === 0 ? (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  No options available
                </div>
              ) : (
                normalizedOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={(e) => toggleOption(option.value, e)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-600 last:border-b-0 focus:outline-none focus:bg-slate-700"
                    role="option"
                    aria-selected={selected.includes(option.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-gray-400 text-sm">
                            {option.description}
                          </div>
                        )}
                      </div>
                      {selected.includes(option.value) && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>,
            document.body
          )}
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
