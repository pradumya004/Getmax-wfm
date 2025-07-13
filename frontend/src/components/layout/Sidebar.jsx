// frontend/src/components/layout/Sidebar.jsx

import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  Crown,
  Monitor,
  ChevronDown,
  ChevronRight,
  User,
  Building,
  Briefcase,
  Home,
  ClipboardList,
  Activity,
  Clock,
  Eye,
  UserCog,
  Bell,
  HelpCircle,
  LogOut,
  // Client-specific icons
  Building2,
  FileText,
  Upload,
  BarChart3,
  UserCheck,
  Zap,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Table2,
  PieChart,
  Handshake,
  Target,
  Globe,
  FileSpreadsheet,
  Layers,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

const Sidebar = () => {
  const location = useLocation();
  const { user, userType, logout } = useAuth();
  const theme = getTheme(userType);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const getNavigationItems = () => {
    switch (userType) {
      case "master_admin":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/master-admin/dashboard",
            description: "Master admin overview",
          },
          {
            icon: Building,
            label: "Companies",
            path: "/master-admin/companies",
            description: "Manage all companies",
          },
          {
            icon: Users,
            label: "Employees",
            path: "/master-admin/employees",
            description: "Manage all employees",
          },
          {
            icon: BarChart3,
            label: "Analytics",
            path: "/master-admin/analytics",
            description: "Platform analytics",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/master-admin/settings",
            description: "Platform settings",
          },
        ];
      case "company":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/company/dashboard",
            description: "Company overview",
          },
          {
            icon: Users,
            label: "Employee Management",
            path: "/company/employees",
            description: "Manage your employees",
            submenu: [
              {
                icon: Users,
                label: "All Employees",
                path: "/company/employees",
                description: "View all employees",
              },
              {
                icon: UserPlus,
                label: "Add Employee",
                path: "/company/employees/add",
                description: "Add new employee",
              },
              {
                icon: Upload,
                label: "Bulk Upload",
                path: "/company/employees/bulk",
                description: "Upload employees in bulk",
              },
              {
                icon: TrendingUp,
                label: "Performance",
                path: "/company/employees/leaderboard",
                description: "Performance leaderboard",
              },
            ],
          },
          {
            icon: Building,
            label: "Organization Data",
            path: "/company/org-data",
            description: "Manage organizational structure",
            submenu: [
              {
                icon: Eye,
                label: "Overview",
                path: "/company/org-data/overview",
                description: "Organization overview",
              },
              {
                icon: Layers,
                label: "Hierarchy",
                path: "/company/org-data/hierarchy",
                description: "Organizational hierarchy",
              },
              {
                icon: UserCog,
                label: "Roles",
                path: "/company/org-data/roles",
                description: "Manage roles",
              },
              {
                icon: Building,
                label: "Departments",
                path: "/company/org-data/departments",
                description: "Manage departments",
              },
              {
                icon: Briefcase,
                label: "Designations",
                path: "/company/org-data/designations",
                description: "Manage designations",
              },
              {
                icon: Users,
                label: "Sub-Departments",
                path: "/company/org-data/subdepartments",
                description: "Manage sub-departments",
              },
            ],
          },
          {
            icon: Building2,
            label: "Client Management",
            path: "/company/clients",
            description: "Manage client relationships",
            submenu: [
              {
                icon: BarChart3,
                label: "Dashboard",
                path: "/company/clients/dashboard",
                description: "Client overview & analytics",
              },
              {
                icon: Users,
                label: "All Clients",
                path: "/company/clients/list",
                description: "View and manage all clients",
              },
              {
                icon: UserPlus,
                label: "Client Intake",
                path: "/company/clients/intake",
                description: "Add new client",
              },
              {
                icon: Upload,
                label: "Bulk Upload",
                path: "/company/clients/bulk-upload",
                description: "Upload clients in bulk",
              },
              {
                icon: UserCheck,
                label: "Onboarding",
                path: "/company/clients/onboarding",
                description: "Client onboarding workflow",
              },
              {
                icon: FileText,
                label: "Reports",
                path: "/company/clients/reports",
                description: "Client analytics and reports",
              },
            ],
          },
          {
            icon: UserCog,
            label: "Company Profile",
            path: "/company/profile",
            description: "Manage company profile",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/company/settings",
            description: "Company settings",
          },
        ];
      case "employee":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/employee/dashboard",
            description: "Overview of your performance and tasks",
          },
          {
            icon: User,
            label: "My Profile",
            path: "/employee/profile",
            description: "Manage your personal information",
          },
          {
            icon: ClipboardList,
            label: "My Tasks",
            path: "/employee/tasks",
            description: "View and manage your assigned tasks",
            submenu: [
              {
                icon: Clock,
                label: "Pending Tasks",
                path: "/employee/tasks?status=pending",
                description: "Tasks awaiting your attention",
              },
              {
                icon: Activity,
                label: "In Progress",
                path: "/employee/tasks?status=in-progress",
                description: "Tasks currently being worked on",
              },
              {
                icon: CheckCircle,
                label: "Completed",
                path: "/employee/tasks?status=completed",
                description: "Recently completed tasks",
              },
            ],
          },
          {
            icon: TrendingUp,
            label: "Performance",
            path: "/employee/performance",
            description: "Track your performance metrics",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/employee/settings",
            description: "Manage your account settings",
          },
        ];
      default:
        return [
          {
            icon: Home,
            label: "Home",
            path: "/",
          },
        ];
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
        name: `${user?.name || ""}`.trim() || "Employee",
        email: user?.contactInfo?.primaryEmail || user?.email,
        role: user?.role || "Employee",
        initial: user?.name?.charAt(0) || "E",
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
      className={`w-64 ${theme.glass} border-r border-white/10 h-full relative`}
    >
      {/* Background Effects */}
      <div
        className={`absolute top-0 left-0 w-32 h-32 bg-${theme.accent}/10 rounded-full blur-2xl`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-24 h-24 bg-${theme.accent}/10 rounded-full blur-xl`}
      ></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
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
                  ? "Master Portal"
                  : userType === "company"
                  ? "Company Portal"
                  : "Employee Portal"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <div key={index} className="relative">
              {item.submenu ? (
                /* Menu with Submenu */
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActiveRoute(item.path, item.submenu)
                        ? `bg-gradient-to-r ${theme.secondary} text-white shadow-lg`
                        : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white`
                    }`}
                    title={item.description}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {expandedMenus[item.label] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedMenus[item.label] && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
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
              className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg overflow-hidden`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {userType === "master_admin" ? (
                <Crown className="w-5 h-5" />
              ) : userInfo.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userInfo.initial}</span>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-sm truncate">
                {userInfo.name}
              </h3>
              <p className={`text-${theme.textSecondary} text-xs truncate`}>
                {userInfo.role}
              </p>
            </div>

            {/* Dropdown Toggle */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`p-1 rounded-lg transition-colors hover:bg-white/10`}
            >
              <ChevronDown
                className={`w-4 h-4 text-${
                  theme.textSecondary
                } transition-transform duration-200 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* User Menu */}
          {showUserMenu && (
            <div
              ref={userMenuRef}
              className={`absolute bottom-full left-4 right-4 mb-2 ${theme.glass} border border-white/20 rounded-lg shadow-xl z-50`}
            >
              <div className="p-2 space-y-1">
                <NavLink
                  to="/employee/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </NavLink>
                <NavLink
                  to="/employee/settings"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </NavLink>
                <hr className="border-white/20 my-1" />
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-white/10 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
