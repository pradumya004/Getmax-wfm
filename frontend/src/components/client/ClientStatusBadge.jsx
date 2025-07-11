// frontend/src/components/client/ClientStatusBadge.jsx

import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";

export const ClientStatusBadge = ({ status, size = "md" }) => {
  const getStatusConfig = (status) => {
    const configs = {
      Active: {
        color: "bg-green-500/20 text-green-300 border-green-400/30",
        icon: CheckCircle,
        label: "Active",
      },
      Prospect: {
        color: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
        icon: Clock,
        label: "Prospect",
      },
      Inactive: {
        color: "bg-gray-500/20 text-gray-300 border-gray-400/30",
        icon: AlertCircle,
        label: "Inactive",
      },
      Onboarding: {
        color: "bg-blue-500/20 text-blue-300 border-blue-400/30",
        icon: Clock,
        label: "Onboarding",
      },
      Suspended: {
        color: "bg-red-500/20 text-red-300 border-red-400/30",
        icon: AlertCircle,
        label: "Suspended",
      },
    };
    return configs[status] || configs["Prospect"];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <Badge
      className={`${config.color} ${sizeClasses[size]} flex items-center space-x-1`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  );
};
