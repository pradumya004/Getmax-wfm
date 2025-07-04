// frontend/src/components/common/StatusBadge.jsx

import React from "react";
import { Circle } from "lucide-react";

export const StatusBadge = ({
  status,
  label,
  variant = "default",
  showIcon = true,
  className = "",
}) => {
  const getStatusStyles = () => {
    const styles = {
      active: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        border: "border-green-500/30",
        icon: "text-green-400",
      },
      inactive: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        border: "border-gray-500/30",
        icon: "text-gray-400",
      },
      pending: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        icon: "text-yellow-400",
      },
      suspended: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        icon: "text-red-400",
      },
      completed: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        border: "border-blue-500/30",
        icon: "text-blue-400",
      },
      trial: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        border: "border-purple-500/30",
        icon: "text-purple-400",
      },
    };

    return styles[status?.toLowerCase()] || styles.inactive;
  };

  const styles = getStatusStyles();
  const displayLabel = label || status;

  return (
    <span
      className={`
        inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border
        ${styles.bg} ${styles.text} ${styles.border}
        ${className}
      `}
    >
      {showIcon && <Circle className={`w-2 h-2 fill-current ${styles.icon}`} />}
      <span className="capitalize">{displayLabel}</span>
    </span>
  );
};