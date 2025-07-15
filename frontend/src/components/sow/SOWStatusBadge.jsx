// frontend/src/components/sow/SOWStatusBadge.jsx
import React from "react";
import { Badge } from "../ui/Badge.jsx";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Pause,
  FileText,
  Play,
  StopCircle as Stop,
} from "lucide-react";

export const SOWStatusBadge = ({ status, size = "sm", showIcon = true }) => {
  const statusConfig = {
    Active: {
      color: "bg-green-500/20 text-green-300 border-green-500/30",
      icon: CheckCircle,
      pulse: true,
    },
    Draft: {
      color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      icon: FileText,
      pulse: false,
    },
    Inactive: {
      color: "bg-red-500/20 text-red-300 border-red-500/30",
      icon: AlertCircle,
      pulse: false,
    },
    Suspended: {
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      icon: Pause,
      pulse: true,
    },
    Completed: {
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      icon: Stop,
      pulse: false,
    },
  };

  const config = statusConfig[status] || statusConfig["Draft"];
  const Icon = config.icon;
  const sizeClasses = size === "lg" ? "px-3 py-2 text-sm" : "px-2 py-1 text-xs";

  return (
    <Badge
      className={`${
        config.color
      } ${sizeClasses} font-medium rounded-full border flex items-center space-x-1 ${
        config.pulse ? "animate-pulse" : ""
      }`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{status}</span>
    </Badge>
  );
};
