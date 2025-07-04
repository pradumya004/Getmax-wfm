// frontend/src/components/employee/PerformanceStats.jsx

import React from "react";
import { Target, Clock, Star, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { formatPercentage, formatDuration } from "../../lib/formatter.js";

const PerformanceStats = ({ stats = {}, theme = "employee" }) => {
  const performanceMetrics = [
    {
      title: "Tasks Completed",
      value: stats.completedTasks || 0,
      target: stats.targetTasks || 50,
      icon: Target,
      color: "text-blue-400",
      unit: "tasks",
    },
    {
      title: "Average Rating",
      value: stats.averageRating || 0,
      target: 5,
      icon: Star,
      color: "text-yellow-400",
      unit: "/5",
      format: "decimal",
    },
    {
      title: "Completion Rate",
      value: stats.completionRate || 0,
      target: 100,
      icon: TrendingUp,
      color: "text-green-400",
      unit: "%",
      format: "percentage",
    },
    {
      title: "Avg. Time per Task",
      value: stats.averageTime || 0,
      icon: Clock,
      color: "text-purple-400",
      format: "duration",
    },
  ];

  const formatValue = (value, format, unit) => {
    switch (format) {
      case "percentage":
        return formatPercentage(value);
      case "duration":
        return formatDuration(value);
      case "decimal":
        return `${value.toFixed(1)}${unit}`;
      default:
        return `${value}${unit ? ` ${unit}` : ""}`;
    }
  };

  const getProgressPercentage = (value, target) => {
    if (!target) return 0;
    return Math.min((value / target) * 100, 100);
  };

  return (
    <Card theme={theme} className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Performance Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {performanceMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const progress = getProgressPercentage(metric.value, metric.target);

          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`w-5 h-5 ${metric.color}`} />
                  <span className="text-gray-300 text-sm">{metric.title}</span>
                </div>
                <span className="text-white font-semibold">
                  {formatValue(metric.value, metric.format, metric.unit)}
                </span>
              </div>

              {metric.target && (
                <>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        theme === "employee"
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                          : theme === "admin"
                          ? "bg-gradient-to-r from-red-400 to-orange-500"
                          : "bg-gradient-to-r from-blue-400 to-purple-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">
                      Target:{" "}
                      {formatValue(metric.target, metric.format, metric.unit)}
                    </span>
                    <span
                      className={`${
                        progress >= 100
                          ? "text-green-400"
                          : progress >= 75
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {formatPercentage(progress, 0)}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PerformanceStats;
