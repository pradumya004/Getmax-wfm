// frontend/src/components/ui/Dropdown.jsx

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const Dropdown = ({
  trigger,
  children,
  align = "left",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {trigger}
      </button>

      {isOpen && !disabled && (
        <div
          className={`
          absolute top-full mt-1 z-50 min-w-48
          bg-slate-800 border border-slate-600 rounded-lg shadow-lg
          ${alignmentClasses[align]}
        `}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  className = "",
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled && onClick) {
        onClick();
      }
    }}
    disabled={disabled}
    className={`
      w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors
      text-white disabled:opacity-50 disabled:cursor-not-allowed
      first:rounded-t-lg last:rounded-b-lg
      ${className}
    `}
  >
    {children}
  </button>
);

export const DropdownSeparator = () => (
  <div className="h-px bg-slate-600 my-1" />
);
