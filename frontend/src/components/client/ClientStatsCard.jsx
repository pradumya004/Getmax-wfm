// frontend/src/components/client/ClientStatsCard.jsx

import { Card } from "../ui/Card.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const ClientStatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const colorClasses = {
    blue: "text-blue-300 bg-blue-500/20",
    green: "text-green-300 bg-green-500/20",
    yellow: "text-yellow-300 bg-yellow-500/20",
    red: "text-red-300 bg-red-500/20",
    purple: "text-purple-300 bg-purple-500/20",
  };

  return (
    <Card className={`${theme.card} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 ${
              trend > 0 ? "text-green-300" : "text-red-300"
            }`}
          >
            <span className="text-sm font-medium">
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-white text-2xl font-bold mb-1">{value}</h3>
        <p className={`text-${theme.textSecondary} text-sm`}>{title}</p>
      </div>
    </Card>
  );
};
