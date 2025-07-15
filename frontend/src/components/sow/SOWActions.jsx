// frontend/src/components/sow/SOWActions.jsx
import React from "react";
import { Button } from "../ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import {
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
  Download,
  Share2,
  Users,
  Settings,
  BarChart3,
  StopCircle as Stop,
} from "lucide-react";

export const SOWActions = ({
  sow,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onAssignEmployees,
  onViewMetrics,
  onDuplicate,
  onExport,
  size = "sm",
  variant = "outline",
}) => {
  const { userType, permissions } = useAuth();
  const theme = getTheme(userType);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={variant}
        size={size}
        theme={theme}
        onClick={() => onView(sow)}
        className="flex items-center space-x-2"
      >
        <Eye className="w-4 h-4" />
        <span>View Details</span>
      </Button>

      {permissions?.sow?.includes("Update") && (
        <Button
          variant="secondary"
          size={size}
          theme={theme}
          onClick={() => onEdit(sow)}
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Button>
      )}

      {sow.status?.sowStatus !== "Active" &&
        permissions?.sow?.includes("Update") && (
          <Button
            variant="ghost"
            size={size}
            theme={theme}
            onClick={() => onStatusChange(sow, "Active")}
            className="flex items-center space-x-2 text-green-400 hover:text-green-300"
          >
            <Play className="w-4 h-4" />
            <span>Activate</span>
          </Button>
        )}

      {sow.status?.sowStatus === "Active" &&
        permissions?.sow?.includes("Update") && (
          <Button
            variant="ghost"
            size={size}
            theme={theme}
            onClick={() => onStatusChange(sow, "Suspended")}
            className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300"
          >
            <Pause className="w-4 h-4" />
            <span>Suspend</span>
          </Button>
        )}

      {permissions?.sow?.includes("Update") && (
        <Button
          variant="ghost"
          size={size}
          theme={theme}
          onClick={() => onAssignEmployees(sow)}
          className="flex items-center space-x-2"
        >
          <Users className="w-4 h-4" />
          <span>Assign Team</span>
        </Button>
      )}

      <Button
        variant="ghost"
        size={size}
        theme={theme}
        onClick={() => onViewMetrics(sow)}
        className="flex items-center space-x-2"
      >
        <BarChart3 className="w-4 h-4" />
        <span>Metrics</span>
      </Button>

      <Button
        variant="ghost"
        size={size}
        theme={theme}
        onClick={() => onDuplicate(sow)}
        className="flex items-center space-x-2"
      >
        <Copy className="w-4 h-4" />
        <span>Duplicate</span>
      </Button>

      <Button
        variant="ghost"
        size={size}
        theme={theme}
        onClick={() => onExport(sow)}
        className="flex items-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </Button>

      {permissions?.sow?.includes("Delete") && (
        <Button
          variant="ghost"
          size={size}
          theme={theme}
          onClick={() => onDelete(sow)}
          className="flex items-center space-x-2 text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      )}
    </div>
  );
};