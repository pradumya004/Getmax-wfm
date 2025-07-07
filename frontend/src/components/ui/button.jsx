// frontend/src/components/ui/Button.jsx

import React from "react";
import { Loader2 } from "lucide-react";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  theme: customTheme,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const { userType } = useAuth();
  const raw = customTheme || userType;
  const theme = getTheme(raw);
  // console.log("Theme:", theme);

  if (!theme) {
    throw new Error(
      `Unknown theme key "${raw}". Please pass a valid theme or userType.`
    );
  }

  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: `bg-gradient-to-r ${theme.secondary} text-white border border-${theme.accent} hover:scale-105 focus:ring-${theme.accent}/50`,
    outline: `${theme.buttonOutline} bg-transparent hover:scale-105 border border-${theme.accent} focus:ring-${theme.accent}/80`,
    ghost: `text-${theme.text} hover:${theme.glass} hover:scale-105 border border-${theme.accent} focus:ring-${theme.accent}/50`,
    danger:
      "bg-red-600 hover:bg-red-700 text-white border border-red-500 hover:scale-105 focus:ring-red-500/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl",
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
        // <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        //   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        //   <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        // </svg>
      )}
      {children}
    </button>
  );
};
