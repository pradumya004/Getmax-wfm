// frontend/src/components/layout/Sidebar.jsx

import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building,
  UserCog,
  Settings,
  Shield,
  Briefcase,
  Layers,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Home,
  Monitor,
  Activity,
  LogOut,
  User,
  Mail,
  BadgeCheck,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

const Sidebar = () => {
  const { userType, user } = useAuth();
  console.log("userType:", userType);
  console.log("user:", user);

  const location = useLocation();
  const theme = getTheme(userType);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleSubMenu = (path) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log(`Token: ${localStorage.getItem("token")}`);
    console.log(`User: ${localStorage.getItem("user")}`);
    window.location.href = "/";
  };

  const getNavigationItems = () => {
    switch (userType) {
      case "master_admin":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/master-admin/dashboard",
          },
          {
            icon: Building,
            label: "Companies",
            path: "/master-admin/companies",
          },
          {
            icon: Users,
            label: "Platform Users",
            path: "/master-admin/employees",
          },
          {
            icon: BarChart3,
            label: "Platform Stats",
            path: "/master-admin/stats",
          },
          {
            icon: Settings,
            label: "System Config",
            path: "/master-admin/settings",
          },
        ];

      case "company":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/company/dashboard",
          },
          {
            icon: Users,
            label: "Employees",
            path: "/company/employees",
            submenu: [
              {
                icon: Users,
                label: "All Employees",
                path: "/company/employees",
              },
              {
                icon: UserCog,
                label: "Add Employee",
                path: "/company/employees/add",
              },
              {
                icon: TrendingUp,
                label: "Performance",
                path: "/company/employees/performance",
              },
            ],
          },
          {
            icon: Building,
            label: "Organization",
            path: "/company/organization",
            submenu: [
              {
                icon: Layers,
                label: "Overview",
                path: "/company/organization",
              },
              {
                icon: Shield,
                label: "Roles",
                path: "/company/organization/roles",
              },
              {
                icon: Building,
                label: "Departments",
                path: "/company/organization/departments",
              },
              {
                icon: Briefcase,
                label: "Designations",
                path: "/company/organization/designations",
              },
              {
                icon: Users,
                label: "Sub-Departments",
                path: "/company/organization/subdepartments",
              },
            ],
          },
          {
            icon: UserCog,
            label: "Company Profile",
            path: "/company/profile",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/company/settings",
          },
        ];

      case "employee":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/employee/dashboard",
          },
          {
            icon: UserCog,
            label: "My Profile",
            path: "/employee/profile",
          },
          {
            icon: TrendingUp,
            label: "Performance",
            path: "/employee/performance",
          },
          {
            icon: Activity,
            label: "My Tasks",
            path: "/employee/tasks",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/employee/settings",
          },
        ];
      default:
        return [];
    }
  };

  const isActiveRoute = (path, submenu = null) => {
    if (submenu) {
      return submenu.some((item) => location.pathname.startsWith(item.path));
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const navigationItems = getNavigationItems();

  return (
    <div
      className={`w-64 ${theme.glass} border-r border-white/10 h-full relative overflow-visible`}
    >
      {/* Background Elements */}
      <div
        className={`absolute top-0 left-0 w-32 h-32 bg-${theme.accent}/10 rounded-full blur-2xl`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-24 h-24 bg-${theme.accent}/10 rounded-full blur-xl`}
      ></div>
      <div className="relative z-10 h-full flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
            >
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">GetMax</h2>
              <p
                className={`text-${theme.textSecondary} text-xs uppercase tracking-wide`}
              >
                {userType} Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.path}>
              {item.submenu ? (
                <div className="space-y-1">
                  {/* Parent Menu Item */}
                  <button
                    onClick={() => toggleSubMenu(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActiveRoute(item.path, item.submenu)
                        ? `bg-${theme.accent}/20 text-${theme.text} border border-${theme.accent}/30`
                        : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {expandedMenus[item.path] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Submenu */}
                  {expandedMenus[item.path] && (
                    <div className="ml-6 space-y-1 pl-4 border-l border-white/10">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                              isActive
                                ? `bg-${theme.accent}/10 text-${theme.accent} border-l-2 border-${theme.accent}`
                                : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white hover:translate-x-1`
                            }`
                          }
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Single Menu Item */
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? `bg-${theme.accent}/20 text-${theme.text} border border-${theme.accent}/30 shadow-lg`
                        : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white hover:scale-105`
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10 relative overflow-visible z-20">
          <div className="flex items-center space-x-3 cursor-pointer relative z-10">
            {/* User Initial */}
            <div
              className={`w-8 h-8 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center text-sm font-bold text-white`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user?.companyName?.charAt(0) ||
                user?.firstName?.charAt(0) ||
                "U"}
            </div>

            {/* Name */}
            <div
              className="flex-1 min-w-0"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <p className="text-white text-sm font-medium truncate">
                {user?.companyName ||
                  `${user?.firstName} ${user?.lastName}` ||
                  "User"}
              </p>
            </div>

            {/* Icons with separate groups */}
            <div className="flex items-center space-x-2">
              {/* Logout */}
              <div className="relative group z-30">
                <LogOut
                  className="w-5 h-5 text-red-500"
                  onClick={handleLogout}
                />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-sm bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-md after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black">
                  Logout
                </span>
              </div>

              {/* Toggle Chevron */}
              <div className="relative group z-30">
                <ChevronUp
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`w-5 h-5 ${
                    theme.buttonOutline
                  } text-white rounded-lg transition-transform duration-300 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-md after:content-[''] after:absolute after:top-full after:right-2 after:border-4 after:border-transparent after:border-t-black">
                  Toggle Menu
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Menu Dropdown */}
          {showUserMenu && (
            <div
              className={`absolute bottom-16 left-4 right-4 z-40 rounded-xl ${theme.card} p-4 shadow-xl border border-${theme.accent}/30 backdrop-blur-md`}
            >
              <div className="mb-3 space-y-3 break-words">
                {/* Email */}
                <div className="flex items-start gap-2">
                  <Mail
                    className={`w-4 h-4 mt-[2px] text-${theme.accent} flex-shrink-0`}
                  />
                  <div className="text-sm text-white break-words overflow-hidden">
                    {user.companyEmail}
                  </div>
                </div>

                {/* Plan */}
                <div className="flex items-start gap-2">
                  <BadgeCheck
                    className={`w-4 h-4 text-${theme.accent} flex-shrink-0`}
                  />
                  <span className="text-sm text-white leading-snug">
                    Plan:{" "}
                    <span className="text-blue-300">
                      {user.subscriptionPlan}
                    </span>
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-start gap-2">
                  <User
                    className={`w-4 h-4 text-${theme.accent} flex-shrink-0`}
                  />
                  <span className="text-sm text-white leading-snug">
                    Status:{" "}
                    <span
                      className={
                        user.subscriptionStatus === "Active"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {user.subscriptionStatus}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
