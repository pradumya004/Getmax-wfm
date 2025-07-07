// frontend/src/components/layout/Sidebar.jsx - Enhanced for Master Admin

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
  Network,
  Database,
  PieChart,
  AlertTriangle,
  Zap,
  Eye,
  Crown,
  Cog,
  FileText,
  DollarSign,
  Globe,
  Server,
  HardDrive,
  Cpu,
  Wifi,
  Lock,
  Bell,
  Download,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

const Sidebar = () => {
  const { userType, user, logout } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      window.location.href = getLoginUrl();
    }
  };

  const getLoginUrl = () => {
    switch (userType) {
      case "master_admin":
        return "/master-admin/login";
      case "company":
        return "/company/login";
      case "employee":
        return "/employee/login";
      default:
        return "/master-admin/login";
    }
  };

  const getNavigationItems = () => {
    switch (userType) {
      case "master_admin":
        return [
          {
            icon: LayoutDashboard,
            label: "Platform Overview",
            path: "/master-admin/dashboard",
            description: "Main dashboard with key metrics",
          },
          {
            icon: Building,
            label: "Company Management",
            path: "/master-admin/companies",
            submenu: [
              {
                icon: Eye,
                label: "All Companies",
                path: "/master-admin/companies",
                description: "View and manage companies",
              },
              {
                icon: AlertTriangle,
                label: "Suspended Companies",
                path: "/master-admin/companies?status=suspended",
                description: "Companies that are suspended",
              },
              {
                icon: Crown,
                label: "Enterprise Clients",
                path: "/master-admin/companies?plan=Enterprise",
                description: "Enterprise subscription companies",
              },
              {
                icon: TrendingUp,
                label: "Company Analytics",
                path: "/master-admin/companies/analytics",
                description: "Company performance metrics",
              },
            ],
          },
          {
            icon: Users,
            label: "Platform Users",
            path: "/master-admin/users",
            submenu: [
              {
                icon: Users,
                label: "All Employees",
                path: "/master-admin/employees",
                description: "All platform users",
              },
              {
                icon: UserCog,
                label: "Company Admins",
                path: "/master-admin/employees?role=admin",
                description: "Company administrators",
              },
              {
                icon: Activity,
                label: "User Activity",
                path: "/master-admin/users/activity",
                description: "Real-time user activity",
              },
              {
                icon: Lock,
                label: "Access Management",
                path: "/master-admin/users/access",
                description: "User permissions & access",
              },
            ],
          },
          {
            icon: BarChart3,
            label: "Analytics & Reports",
            path: "/master-admin/analytics",
            submenu: [
              {
                icon: PieChart,
                label: "Platform Statistics",
                path: "/master-admin/stats",
                description: "Comprehensive platform metrics",
              },
              {
                icon: TrendingUp,
                label: "Growth Analytics",
                path: "/master-admin/analytics/growth",
                description: "User and company growth",
              },
              {
                icon: DollarSign,
                label: "Revenue Analytics",
                path: "/master-admin/analytics/revenue",
                description: "Financial performance",
              },
              {
                icon: FileText,
                label: "Usage Reports",
                path: "/master-admin/analytics/usage",
                description: "Platform usage statistics",
              },
              {
                icon: Download,
                label: "Export Data",
                path: "/master-admin/analytics/export",
                description: "Download reports & data",
              },
            ],
          },
          {
            icon: Database,
            label: "System Management",
            path: "/master-admin/system",
            submenu: [
              {
                icon: Server,
                label: "System Health",
                path: "/master-admin/system/health",
                description: "Server status & performance",
              },
              {
                icon: HardDrive,
                label: "Database Stats",
                path: "/master-admin/system/database",
                description: "Database performance",
              },
              {
                icon: Cpu,
                label: "Performance Monitor",
                path: "/master-admin/system/performance",
                description: "System resource usage",
              },
              {
                icon: Bell,
                label: "System Alerts",
                path: "/master-admin/system/alerts",
                description: "Critical system notifications",
              },
              {
                icon: Wifi,
                label: "API Monitoring",
                path: "/master-admin/system/api",
                description: "API calls & performance",
              },
            ],
          },
          {
            icon: Shield,
            label: "Security & Config",
            path: "/master-admin/security",
            submenu: [
              {
                icon: Lock,
                label: "Security Settings",
                path: "/master-admin/security/settings",
                description: "Platform security configuration",
              },
              {
                icon: Eye,
                label: "Audit Logs",
                path: "/master-admin/security/audit",
                description: "System activity logs",
              },
              {
                icon: Globe,
                label: "Platform Settings",
                path: "/master-admin/settings/platform",
                description: "Global platform configuration",
              },
              {
                icon: Cog,
                label: "Feature Flags",
                path: "/master-admin/settings/features",
                description: "Enable/disable features",
              },
            ],
          },
          {
            icon: Zap,
            label: "Quick Actions",
            path: "/master-admin/actions",
            submenu: [
              {
                icon: Building,
                label: "Add Company",
                path: "/master-admin/companies/add",
                description: "Manually add new company",
              },
              {
                icon: AlertTriangle,
                label: "Emergency Actions",
                path: "/master-admin/emergency",
                description: "Critical system actions",
              },
              {
                icon: Bell,
                label: "Send Notifications",
                path: "/master-admin/notifications",
                description: "Platform-wide announcements",
              },
              {
                icon: Download,
                label: "Backup System",
                path: "/master-admin/backup",
                description: "Create system backup",
              },
            ],
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
            path: "/company/org-data",
            submenu: [
              {
                icon: Layers,
                label: "Overview",
                path: "/company/org-data/overview",
              },
              {
                icon: Network,
                label: "Hierarchy",
                path: "/company/org-data/hierarchy",
              },
              {
                icon: Shield,
                label: "Roles",
                path: "/company/org-data/roles",
              },
              {
                icon: Building,
                label: "Departments",
                path: "/company/org-data/departments",
              },
              {
                icon: Briefcase,
                label: "Designations",
                path: "/company/org-data/designations",
              },
              {
                icon: Users,
                label: "Sub-Departments",
                path: "/company/org-data/subdepartments",
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

  // Get user display info
  const getUserDisplayInfo = () => {
    if (userType === "master_admin") {
      return {
        name: user?.name || "Sriram",
        email: user?.email || "sriram@getmaxsolutions.com",
        role: "Master Admin",
        initial: "S",
      };
    }

    if (userType === "company") {
      return {
        name: user?.companyName || "Company",
        email: user?.companyEmail || user?.email,
        role: user?.subscriptionPlan || "Company",
        initial: user?.companyName?.charAt(0) || "C",
      };
    }

    if (userType === "employee") {
      return {
        name:
          `${user?.personalInfo?.firstName || ""} ${
            user?.personalInfo?.lastName || ""
          }`.trim() || "Employee",
        email: user?.contactInfo?.primaryEmail || user?.email,
        role: user?.roleRef?.roleName || "Employee",
        initial: user?.personalInfo?.firstName?.charAt(0) || "E",
      };
    }

    return {
      name: "User",
      email: user?.email || "",
      role: "User",
      initial: "U",
    };
  };

  const userInfo = getUserDisplayInfo();

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
              className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center shadow-lg`}
            >
              {userType === "master_admin" ? (
                <Crown className="w-6 h-6 text-white" />
              ) : (
                <Monitor className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">GetMax</h2>
              <p
                className={`text-${theme.textSecondary} text-xs uppercase tracking-wide font-medium`}
              >
                {userType === "master_admin"
                  ? "Master Control"
                  : `${userType} Portal`}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
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
                        ? `bg-gradient-to-r ${theme.secondary} text-white shadow-lg scale-105`
                        : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white hover:scale-102`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.submenu.length > 0 && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-${theme.accent}/20 text-${theme.accent}`}
                        >
                          {item.submenu.length}
                        </span>
                      )}
                      {expandedMenus[item.path] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Submenu */}
                  {expandedMenus[item.path] && (
                    <div className="ml-6 space-y-1 pl-4 border-l-2 border-white/10">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                              isActive
                                ? `bg-${theme.accent}/20 text-${theme.accent} border-l-2 border-${theme.accent} shadow-md`
                                : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white hover:translate-x-1`
                            }`
                          }
                          title={subItem.description}
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
                        ? `bg-gradient-to-r ${theme.secondary} text-white shadow-lg scale-105`
                        : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white hover:scale-102`
                    }`
                  }
                  title={item.description}
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
            {/* User Avatar */}
            <div
              className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {userType === "master_admin" ? (
                <Crown className="w-5 h-5" />
              ) : (
                userInfo.initial
              )}
            </div>

            {/* User Info */}
            <div
              className="flex-1 min-w-0"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <p className="text-white text-sm font-medium truncate">
                {userInfo.name}
              </p>
              <p className={`text-${theme.textSecondary} text-xs truncate`}>
                {userInfo.role}
              </p>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-2">
              {/* Logout */}
              <div className="relative group z-30">
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400 hover:text-red-300" />
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-md">
                  Logout
                </span>
              </div>

              {/* Toggle Menu */}
              <div className="relative group z-30">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronUp
                    className={`w-4 h-4 text-${
                      theme.textSecondary
                    } hover:text-white transition-transform duration-300 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-md">
                  User Menu
                </span>
              </div>
            </div>
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div
              className={`absolute bottom-16 left-4 right-4 z-40 rounded-xl ${theme.card} p-4 shadow-xl border border-${theme.accent}/30 backdrop-blur-md`}
            >
              <div className="space-y-3">
                {/* Email */}
                <div className="flex items-start gap-2">
                  <Mail
                    className={`w-4 h-4 mt-[2px] text-${theme.accent} flex-shrink-0`}
                  />
                  <div className="text-sm text-white break-words overflow-hidden">
                    {userInfo.email}
                  </div>
                </div>

                {userType === "company" && (
                  <>
                    {/* Plan */}
                    <div className="flex items-start gap-2">
                      <BadgeCheck
                        className={`w-4 h-4 text-${theme.accent} flex-shrink-0`}
                      />
                      <span className="text-sm text-white leading-snug">
                        Plan:{" "}
                        <span className="text-blue-300">
                          {user?.subscriptionPlan}
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
                            user?.subscriptionStatus === "Active"
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {user?.subscriptionStatus}
                        </span>
                      </span>
                    </div>
                  </>
                )}

                {userType === "master_admin" && (
                  <div className="flex items-start gap-2">
                    <Shield
                      className={`w-4 h-4 text-${theme.accent} flex-shrink-0`}
                    />
                    <span className="text-sm text-white leading-snug">
                      Platform Owner & Administrator
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
