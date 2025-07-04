// frontend/src/components/ui/Card.jsx

import React from "react";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

export const Card = ({
  children,
  className = "",
  variant = "default",
  theme: customTheme,
  hover = true,
  onClick,
  ...props
}) => {
  const { userType } = useAuth();
  const theme = getTheme(customTheme || userType);

  const baseClasses = "rounded-xl border transition-all duration-200";

  const variants = {
    default: `${theme.glass} backdrop-blur-xl border-${theme.accent}/20 shadow-md`,
    elevated: `${theme.glass} shadow-lg`,
    outlined: `bg-transparent border-2 border-${theme.accent}/30`,
    solid: `bg-gradient-to-br ${theme.secondary} border-${theme.accent}/20`,
  };

  const hoverClasses = hover ? "hover:scale-[1.02] hover:shadow-xl" : "";
  const clickable = onClick ? "cursor-pointer" : "";

  const variantClass = variants[variant] || variants.default;

  return (
    <div
      className={`${baseClasses} ${variantClass} ${hoverClasses} ${clickable} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components
Card.Header = ({ children, className = "" }) => (
  <div className={`p-6 pb-0 ${className}`}>{children}</div>
);

Card.Body = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

Card.Footer = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

