// frontend/src/components/sow/SOWPerformanceCard.jsx
import React from "react";
import { Card } from "../ui/Card.jsx";
import { Progress } from "../ui/Progress.jsx";
import { Badge } from "../ui/Badge.jsx";
import {
  Target,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const SOWPerformanceCard = ({ sow, theme, showDetails = true }) => {
  const slaCompliance = sow.activityMetrics?.currentSlaComplianceRate || 0;
  const qualityScore = sow.activityMetrics?.currentQualityScoreAverage || 0;
  const capacityUtilization = sow.currentCapacityUtilization || 0;
  const dailyTarget = sow.performanceTargets?.dailyTargetPerEmp || 0;
  const qualityBenchmark = sow.performanceTargets?.qualityBenchmark || 95;
  const slaHours = sow.performanceTargets?.slaConfig?.slaHours || 24;

  const getPerformanceStatus = (value, benchmark) => {
    if (value >= benchmark)
      return {
        status: "excellent",
        color: "text-green-400",
        icon: CheckCircle,
      };
    if (value >= benchmark * 0.9)
      return { status: "good", color: "text-yellow-400", icon: Target };
    return {
      status: "needs-improvement",
      color: "text-red-400",
      icon: AlertTriangle,
    };
  };

  const slaStatus = getPerformanceStatus(slaCompliance, 95);
  const qualityStatus = getPerformanceStatus(qualityScore, qualityBenchmark);

  return (
    <Card className={`${theme?.card || "bg-gray-800/50"} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold flex items-center">
          <Activity className="w-5 h-5 mr-2 text-emerald-400" />
          Performance Metrics
        </h3>
        <Badge className={`${slaStatus.color} bg-opacity-20`}>
          Overall: {slaStatus.status.replace("-", " ")}
        </Badge>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* SLA Compliance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">SLA Compliance</span>
            </div>
            <div className="flex items-center space-x-2">
              <slaStatus.icon className={`w-4 h-4 ${slaStatus.color}`} />
              <span className="text-white font-semibold">{slaCompliance}%</span>
            </div>
          </div>
          <Progress
            value={slaCompliance}
            className="h-3"
            indicatorClassName={
              slaCompliance >= 95
                ? "bg-green-500"
                : slaCompliance >= 85
                ? "bg-yellow-500"
                : "bg-red-500"
            }
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Target: 95%</span>
            <span>SLA: {slaHours}h</span>
          </div>
        </div>

        {/* Quality Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-sm">Quality Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <qualityStatus.icon
                className={`w-4 h-4 ${qualityStatus.color}`}
              />
              <span className="text-white font-semibold">{qualityScore}%</span>
            </div>
          </div>
          <Progress
            value={qualityScore}
            className="h-3"
            indicatorClassName={
              qualityScore >= qualityBenchmark
                ? "bg-green-500"
                : qualityScore >= qualityBenchmark * 0.9
                ? "bg-yellow-500"
                : "bg-red-500"
            }
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Target: {qualityBenchmark}%</span>
            <span>QA: {sow.qaConfig?.qaPercentage || 10}%</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Capacity Utilization */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">
                  Capacity Utilization
                </span>
              </div>
              <span className="text-white font-semibold">
                {capacityUtilization}%
              </span>
            </div>
            <Progress
              value={capacityUtilization}
              className="h-3"
              indicatorClassName={
                capacityUtilization > 90
                  ? "bg-red-500"
                  : capacityUtilization > 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Optimal: 75-85%</span>
              <span>Daily Target: {dailyTarget}</span>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400 text-xs">Claims Assigned</p>
              <p className="text-white font-semibold">
                {sow.activityMetrics?.totalClaimsAssigned || 0}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400 text-xs">Claims Completed</p>
              <p className="text-white font-semibold">
                {sow.activityMetrics?.totalClaimsCompleted || 0}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400 text-xs">Avg. Time</p>
              <p className="text-white font-semibold">
                {sow.activityMetrics?.averageCompletionTimeHours || 0}h
              </p>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400 text-xs">Revenue</p>
              <p className="text-white font-semibold text-sm">
                $
                {(
                  sow.activityMetrics?.monthlyRevenueGenerated || 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};