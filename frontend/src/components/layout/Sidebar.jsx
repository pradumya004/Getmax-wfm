import React, { useState } from "react";
import {
  Home,
  Building2,
  Users,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  FileText,
} from "lucide-react";

export default function Sidebar({
  userRole = "admin", // "admin", "company", "employee"
  currentPath = "/dashboard",
  isCollapsed = false,
  onToggle,
}) {
  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { name: "Dashboard", path: "/admin/dashboard", icon: Home },
          { name: "Companies", path: "/admin/companies", icon: Building2 },
          { name: "Users", path: "/admin/users", icon: Users },
          { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
          { name: "Settings", path: "/admin/settings", icon: Settings },
        ];
      case "company":
        return [
          { name: "Dashboard", path: "/company/dashboard", icon: Home },
          { name: "Employees", path: "/company/employees", icon: Users },
          { name: "Schedules", path: "/company/schedules", icon: Calendar },
          { name: "Reports", path: "/company/reports", icon: FileText },
          { name: "Analytics", path: "/company/analytics", icon: BarChart3 },
          { name: "Settings", path: "/company/settings", icon: Settings },
        ];
      case "employee":
        return [
          { name: "Dashboard", path: "/employee/dashboard", icon: Home },
          { name: "My Tasks", path: "/employee/tasks", icon: FileText },
          { name: "Schedule", path: "/employee/schedule", icon: Calendar },
          { name: "Time Tracking", path: "/employee/time", icon: Clock },
          { name: "Profile", path: "/employee/profile", icon: Users },
        ];
      default:
        return [];
    }
  };

  const getThemeClasses = () => {
    switch (userRole) {
      case "admin":
        return {
          bg: "bg-gradient-to-b from-slate-900 to-gray-900 border-r border-white/10",
          logo: "bg-gradient-to-r from-red-600 to-orange-600",
          logoIcon: Shield,
          active:
            "bg-gradient-to-r from-red-600/20 to-orange-600/20 border-r-2 border-red-500",
          hover: "hover:bg-white/10",
        };
      case "company":
        return {
          bg: "bg-gradient-to-b from-blue-900 to-indigo-900 border-r border-white/10",
          logo: "bg-blue-600",
          logoIcon: Building2,
          active: "bg-blue-600/20 border-r-2 border-blue-500",
          hover: "hover:bg-white/10",
        };
      case "employee":
        return {
          bg: "bg-gradient-to-b from-green-900 to-teal-900 border-r border-white/10",
          logo: "bg-green-600",
          logoIcon: Users,
          active: "bg-green-600/20 border-r-2 border-green-500",
          hover: "hover:bg-white/10",
        };
      default:
        return {
          bg: "bg-gradient-to-b from-slate-900 to-gray-900 border-r border-white/10",
          logo: "bg-blue-600",
          logoIcon: Home,
          active: "bg-blue-600/20 border-r-2 border-blue-500",
          hover: "hover:bg-white/10",
        };
    }
  };

  const classes = getThemeClasses();
  const menuItems = getMenuItems();
  const LogoIcon = classes.logoIcon;

  return (
    <div
      className={`${classes.bg} ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 ${classes.logo} rounded-lg flex items-center justify-center`}
          >
            <LogoIcon className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-white font-bold text-lg">GetMax</h1>
              <p className="text-white/60 text-sm capitalize">
                {userRole} Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white transition-all duration-300 w-full text-left ${
                    isActive ? classes.active : classes.hover
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      {onToggle && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onToggle}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-white ${classes.hover} transition-all duration-300`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
            {!isCollapsed && <span className="ml-3 font-medium">Collapse</span>}
          </button>
        </div>
      )}

      {/* User Role Indicator */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm capitalize">
              {userRole} Mode
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
