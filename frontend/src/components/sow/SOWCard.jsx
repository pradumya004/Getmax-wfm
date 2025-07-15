// frontend/src/components/sow/SOWCard.jsx
import React from "react";
import { Card } from "../ui/Card.jsx";
import { Progress } from "../ui/Progress.jsx";
import { SOWStatusBadge } from "./SOWStatusBadge.jsx";
import { SOWActions } from "./SOWActions.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate, formatCurrency } from "../../lib/utils.js";
import {
  Building2,
  FileText,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Calendar,
  Clock,
  Star,
  Activity,
} from "lucide-react";

export const SOWCard = ({
  sow,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onAssignEmployees,
  onViewMetrics,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const capacityUtilization = sow.currentCapacityUtilization || 0;
  const slaCompliance = sow.activityMetrics?.currentSlaComplianceRate || 0;
  const qualityScore = sow.activityMetrics?.currentQualityScoreAverage || 0;

  return (
    <Card
      className={`${theme.card} p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-500`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white truncate">
              {sow.sowName}
            </h3>
            <SOWStatusBadge status={sow.status?.sowStatus || "Draft"} />
          </div>
          <p className="text-gray-400 text-sm mb-1">SOW ID: {sow.sowId}</p>
          <p className="text-gray-400 text-sm">
            Client: {sow.clientRef?.clientInfo?.clientName || "N/A"}
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs">Daily Target</span>
          </div>
          <p className="text-white font-semibold">
            {sow.performanceTargets?.dailyTargetPerEmp || 0}
          </p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-xs">Rate</span>
          </div>
          <p className="text-white font-semibold">
            {formatCurrency(sow.contractDetails?.ratePerTransaction || 0)}
          </p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Headcount</span>
          </div>
          <p className="text-white font-semibold">
            {sow.resourcePlanning?.plannedHeadcount || 0}
          </p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <BarChart3 className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-xs">Volume</span>
          </div>
          <p className="text-white font-semibold">
            {sow.volumeForecasting?.expectedDailyVolume || 0}
          </p>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">SLA Compliance</span>
            <span className="text-white">{slaCompliance}%</span>
          </div>
          <Progress
            value={slaCompliance}
            className="h-2"
            indicatorClassName={
              slaCompliance < 85
                ? "bg-red-500"
                : slaCompliance < 95
                ? "bg-yellow-500"
                : "bg-green-500"
            }
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Quality Score</span>
            <span className="text-white">{qualityScore}%</span>
          </div>
          <Progress
            value={qualityScore}
            className="h-2"
            indicatorClassName={
              qualityScore < 85
                ? "bg-red-500"
                : qualityScore < 95
                ? "bg-yellow-500"
                : "bg-green-500"
            }
          />
        </div>
      </div>

      {/* Service & Timeline Info */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {sow.serviceDetails?.serviceType || "N/A"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {formatDate(sow.status?.startDate)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4">
          <SOWActions
            sow={sow}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onAssignEmployees={onAssignEmployees}
            onViewMetrics={onViewMetrics}
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
};