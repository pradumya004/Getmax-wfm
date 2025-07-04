// frontend/src/components/company/EmployeeStatsCard.jsx

import React from "react";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { formatPercentage } from "../../lib/formatter.js";

export const EmployeeStatsCard = ({ employees = [], theme = "company" }) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.systemInfo?.isActive
  ).length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  const recentJoins = employees.filter((emp) => {
    const joinDate = new Date(emp.employmentInfo?.dateOfJoining);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate >= thirtyDaysAgo;
  }).length;

  const activationRate =
    totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0;

  const stats = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Active",
      value: activeEmployees,
      icon: UserCheck,
      color: "text-green-400",
      percentage:
        totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0,
    },
    {
      label: "Inactive",
      value: inactiveEmployees,
      icon: UserX,
      color: "text-red-400",
      percentage:
        totalEmployees > 0 ? (inactiveEmployees / totalEmployees) * 100 : 0,
    },
    {
      label: "Recent Joins (30d)",
      value: recentJoins,
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ];

  return (
    <Card theme={theme} className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Employee Overview
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <IconComponent className={`w-4 h-4 ${stat.color}`} />
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-white">
                  {stat.value}
                </span>
                {stat.percentage !== undefined && (
                  <span className={`text-sm ${stat.color}`}>
                    ({formatPercentage(stat.percentage, 0)})
                  </span>
                )}
              </div>

              {stat.percentage !== undefined && (
                <div className="w-full bg-slate-800 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      stat.color.includes("green")
                        ? "bg-green-400"
                        : stat.color.includes("red")
                        ? "bg-red-400"
                        : stat.color.includes("blue")
                        ? "bg-blue-400"
                        : "bg-purple-400"
                    }`}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Activation Rate</span>
          <span className="text-white font-medium">
            {formatPercentage(activationRate)}
          </span>
        </div>
      </div>
    </Card>
  );
};
