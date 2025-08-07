// frontend/src/components/common/StatCard.jsx

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatCurrency } from "../../lib/utils.js";

export const  StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  theme = "company",
  type = "number", // number, currency, percentage
}) => {
  const themeColors = getTheme(theme);
  const isPositive = change && change > 0;

  const formatValue = () => {
    switch (type) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return `${value}%`;
      default:
        return value?.toLocaleString() || "0";
    }
  };

  return (
    <Card theme={theme} className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-2">{formatValue()}</p>
          {change && (
            <div className="flex items-center space-x-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span
                className={`text-sm ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-xl bg-gradient-to-r ${themeColors.card}`}
          >
            <Icon className={`w-6 h-6 ${themeColors.text}`} />
          </div>
        )}
      </div>
    </Card>
  );
};
