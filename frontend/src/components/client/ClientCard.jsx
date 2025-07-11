// frontend/src/components/client/ClientCard.jsx

import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

import { formatDate } from "../../lib/utils.js";

export const ClientCard = ({
  client,
  onView,
  onEdit,
  onDelete,
  className = "",
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  console.log("Client:", client);
  

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-green-500/20 text-green-300 border-green-400/30",
      Prospect: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
      Inactive: "bg-gray-500/20 text-gray-300 border-gray-400/30",
      Onboarding: "bg-blue-500/20 text-blue-300 border-blue-400/30",
      Suspended: "bg-red-500/20 text-red-300 border-red-400/30",
    };
    return colors[status] || colors["Prospect"];
  };

  const getOnboardingStatusColor = (status) => {
    const colors = {
      Completed: "bg-green-500/20 text-green-300 border-green-400/30",
      "In Progress": "bg-blue-500/20 text-blue-300 border-blue-400/30",
      "Not Started": "bg-gray-500/20 text-gray-300 border-gray-400/30",
      Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
    };
    return colors[status] || colors["Not Started"];
  };

  return (
    <Card
      className={`${theme.card} p-6 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center shadow-lg`}
          >
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">
              {client.clientInfo?.clientName}
            </h3>
            <p className={`text-${theme.textSecondary} text-sm`}>
              {client.clientInfo?.clientType} •{" "}
              {client.clientInfo?.clientSubType}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(client.status?.clientStatus)}>
            {client.status?.clientStatus}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {/* Contact Information */}
        <div className="flex items-center space-x-2 text-sm">
          <Mail className={`w-4 h-4 text-${theme.accent}`} />
          <span className="text-white">
            {client.contactInfo?.primaryContact?.email}
          </span>
        </div>

        {client.contactInfo?.primaryContact?.phone && (
          <div className="flex items-center space-x-2 text-sm">
            <Phone className={`w-4 h-4 text-${theme.accent}`} />
            <span className="text-white">
              {client.contactInfo?.primaryContact?.phone}
            </span>
          </div>
        )}

        {client.addressInfo?.businessAddress && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className={`w-4 h-4 text-${theme.accent}`} />
            <span className="text-white">
              {client.addressInfo.businessAddress.city},{" "}
              {client.addressInfo.businessAddress.state}
            </span>
          </div>
        )}

        {/* Onboarding Progress */}
        <div className="flex items-center justify-between">
          <span className={`text-${theme.textSecondary} text-sm`}>
            Onboarding:
          </span>
          <Badge
            className={getOnboardingStatusColor(
              client.status?.onboardingStatus
            )}
          >
            {client.status?.onboardingStatus}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`${theme.glass} p-3 rounded-lg`}>
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 text-${theme.accent}`} />
            <span className={`text-${theme.textSecondary} text-xs`}>
              Created
            </span>
          </div>
          <p className="text-white text-sm font-medium">
            {formatDate(client.createdAt)}
          </p>
        </div>

        <div className={`${theme.glass} p-3 rounded-lg`}>
          <div className="flex items-center space-x-2">
            <Zap className={`w-4 h-4 text-${theme.accent}`} />
            <span className={`text-${theme.textSecondary} text-xs`}>
              EHR System
            </span>
          </div>
          <p className="text-white text-sm font-medium">
            {client.integrationStrategy?.ehrPmSystem?.systemName || "Not Set"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(client)}
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(client)}
          className="flex-1"
        >
          Edit
        </Button>
      </div>
    </Card>
  );
};