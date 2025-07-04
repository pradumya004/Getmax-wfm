// frontend/src/components/ui/Badge.jsx

import React from "react";
import { getStatusColor } from "../../lib/utils.js";

export const Badge = ({
  children,
  status,
  variant = "default",
  className = "",
}) => {
  const statusClasses = status ? getStatusColor(status) : "";

  const variants = {
    default: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    success: "bg-green-500/20 text-green-400 border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`
      inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border
      ${status ? statusClasses : variants[variant]}
      ${className}
    `}
    >
      {children}
    </span>
  );
};