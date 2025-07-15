// frontend/src/components/sow/SOWStatsCard.jsx
import React from "react";
import { Card } from "../ui/Card.jsx";
import { Progress } from "../ui/Progress.jsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const SOWStatsCard = ({
  title,
  value,
  icon: Icon,
  theme,
  trend,
  trendValue,
  subtitle,
  progress,
  progressColor,
  onClick,
  className = "",
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === "up")
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === "down")
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-400";
    if (trend === "down") return "text-red-400";
    return "text-gray-400";
  };

  return (
    <Card
      className={`${
        theme?.card || "bg-gray-800/50"
      } p-6 hover:shadow-lg transition-all duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {Icon && (
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
            )}
            <div>
              <p className="text-gray-400 text-sm font-medium">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>

          {subtitle && <p className="text-gray-500 text-xs mb-2">{subtitle}</p>}

          {/* Trend Indicator */}
          {trend && trendValue && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-xs font-medium ${getTrendColor()}`}>
                {trendValue}
              </span>
              <span className="text-gray-500 text-xs">vs last month</span>
            </div>
          )}

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="h-2"
                indicatorClassName={progressColor || "bg-emerald-500"}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};