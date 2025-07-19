// frontend/src/components/layout/Sidebar.jsx

import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  Building,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Crown,
  Monitor,
  UserPlus,
  Upload,
  TrendingUp,
  Eye,
  AlertTriangle,
  AlertCircle,
  Star,
  Building2,
  FileText,
  Plus,
  UserCheck,
  BarChart3,
  Briefcase,
  ClipboardList,
  Clock,
  Activity,
  CheckCircle,
  UserCog,
  Layers,
  Award,
  Target,
  DollarSign,
  Calendar,
  Zap,
  Shield,
  Globe,
  Package,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw,
  Bell,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Home,
  FileCheck,
  Handshake,
  PieChart,
  LineChart,
  Folder,
  FolderPlus,
  FileSpreadsheet,
  UserX,
  Pause,
  Play,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { getLoginUrl, getStoredToken } from "../../lib/auth.js";
import { Button } from "../ui/Button.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const location = useLocation();
  const { user, userType, logout } = useAuth();
  const theme = getTheme(userType);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const {companyToken, employeeToken} = getStoredToken();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSync = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/payers/sync/claimmd", {
        headers: { Authorization: `Bearer ${employeeToken}` }
      });
      toast.success(res.data.message || "Payers synced successfully");
    } catch (err) {
      toast.error("Sync failed: " + (err.response?.data?.message || err.message));
    }
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      window.location.href = getLoginUrl();
    }
  };

  const getNavigationItems = () => {
    switch (userType) {
      case "master_admin":
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/master-admin/dashboard",
            description: "Platform overview and metrics",
          },
          {
            icon: Building,
            label: "Companies",
            path: "/master-admin/companies",
            description: "Manage billing companies",
          },
          {
            icon: Users,
            label: "Platform Employees",
            path: "/master-admin/employees",
            description: "All employees across platform",
          },
          {
            icon: BarChart3,
            label: "Analytics",
            path: "/master-admin/stats",
            description: "Platform analytics",
          },
          {
            icon: Settings,
            label: "Security Center",
            path: "/master-admin/security/settings",
            description: "Platform configuration",
            submenu: [
              {
                icon: Users,
                label: "Settings",
                path: "/master-admin/security/settings",
                description: "Manage platform settings",
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
            description: "Company Overview - Key Metrics & KPIs",
          },
          {
            icon: Users,
            label: "Workforce Management",
            path: "/company/employees",
            description: "Manage your employees and performance",
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
                label: "Performance Leaderboard",
                path: "/company/employees/leaderboard",
                description: "Performance leaderboard",
              },
              {
                icon: BarChart3,
                label: "Workforce Analytics",
                path: "/company/employees/analytics",
                description: "Workforce analytics and insights",
              },
            ],
          },
          {
            icon: Building,
            label: "Organization Setup",
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
            description: "Manage healthcare provider relationships",
            submenu: [
              {
                icon: BarChart3,
                label: "Client Dashboard",
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
                label: "Onboarding Pipeline",
                path: "/company/clients/onboarding",
                description: "Client onboarding workflow",
              },
              {
                icon: FileText,
                label: "Client Reports",
                path: "/company/clients/reports",
                description: "Client analytics and reports",
              },
              {
                icon: Globe,
                label: "Integration Status",
                path: "/company/clients/integration",
                description: "EHR/PM integration monitoring",
              },
            ],
          },
          {
            icon: FileCheck,
            label: "SOW Management",
            path: "/company/sows",
            description: "Manage Statements of Work",
            submenu: [
              {
                icon: BarChart3,
                label: "SOW Dashboard",
                path: "/company/sows/dashboard",
                description: "SOW overview & metrics",
              },
              {
                icon: FileText,
                label: "All SOWs",
                path: "/company/sows/list",
                description: "View all Statements of Work",
              },
              {
                icon: Plus,
                label: "Create SOW",
                path: "/company/sows/create",
                description: "Create new Statement of Work",
              },
              {
                icon: Folder,
                label: "SOW Templates",
                path: "/company/sow/templates",
                description: "Manage SOW templates",
              },
              {
                icon: DollarSign,
                label: "Pricing Models",
                path: "/company/sow/pricing",
                description: "Configure pricing models",
              },
              {
                icon: Clock,
                label: "SLA Configuration",
                path: "/company/sow/sla",
                description: "Service Level Agreements",
              },
              {
                icon: PieChart,
                label: "SOW Analytics",
                path: "/company/sow/analytics",
                description: "Performance and financial analytics",
              },
            ],
          },
          {
            icon: Users,
            label: "Patient Registry",
            path: "/company/patients",
            description: "Manage patient records",
            submenu: [
              {
                icon: Users,
                label: "All Patients",
                path: "/company/patients/list",
                description: "View all patients",
              },
              {
                icon: UserPlus,
                label: "Add Patient",
                path: "/company/patients/create",
                description: "Add new patient",
              },
              {
                icon: Upload,
                label: "Bulk Upload",
                path: "/company/patients/bulk",
                description: "Upload patients in bulk",
              },
              {
                icon: Search,
                label: "Patient Search",
                path: "/company/patients/search",
                description: "Advanced patient search",
              },
              {
                icon: FileText,
                label: "Patient Reports",
                path: "/company/patients/reports",
                description: "Patient analytics and reports",
              },
              {
                icon: CheckCircle,
                label: "Eligibility Status",
                path: "/company/patients/eligibility",
                description: "Insurance eligibility tracking",
              },
            ],
          },
          {
            icon: ClipboardList,
            label: "Claims Management",
            path: "/company/claims",
            description: "Process and track medical claims",
            submenu: [
              {
                icon: BarChart3,
                label: "Claims Dashboard",
                path: "/company/claims/dashboard",
                description: "Claims overview and metrics",
              },
              {
                icon: FileText,
                label: "All Claims",
                path: "/company/claims/list",
                description: "View all claims",
              },
              {
                icon: Plus,
                label: "Manual Entry",
                path: "/company/claims/create",
                description: "Manually enter new claim",
              },
              {
                icon: Upload,
                label: "Bulk Upload",
                path: "/company/claims/bulk",
                description: "Upload claims in bulk",
              },
              {
                icon: Target,
                label: "Floating Pool",
                path: "/company/claims/floating-pool",
                description: "Unassigned claims pool",
              },
              {
                icon: AlertCircle,
                label: "High Priority",
                path: "/company/claims/high-priority",
                description: "High priority claims",
              },
              {
                icon: DollarSign,
                label: "High Value Claims",
                path: "/company/claims/high-value",
                description: "High value claims tracking",
              },
              {
                icon: PieChart,
                label: "Claims Analytics",
                path: "/company/claims/analytics",
                description: "Claims performance analytics",
              },
            ],
          },
          {
            icon: Building2,
            label: "Payer Management",
            path: "/company/payers",
            description: "Manage insurance payers",
            submenu: [
              {
                icon: Building2,
                label: "All Payers",
                path: "/company/payers/list",
                description: "View all insurance payers",
              },
              {
                icon: Plus,
                label: "Add Payer",
                path: "/company/payers/add",
                description: "Add new payer",
              },
              {
                icon: FileText,
                label: "Payer Profiles",
                path: "/company/payers/profiles",
                description: "Detailed payer information",
              },
              {
                icon: DollarSign,
                label: "Payment Terms",
                path: "/company/payers/payment-terms",
                description: "Manage payment terms",
              },
              {
                icon: BarChart3,
                label: "Payer Analytics",
                path: "/company/payers/analytics",
                description: "Payer performance analytics",
              },
              {
                icon: Globe,
                label: "Integration Setup",
                path: "/company/payers/integration",
                description: "Payer integration configuration",
              },
            ],
          },
          {
            icon: Clock,
            label: "SLA & Quality",
            path: "/company/sla",
            description: "Service Level Agreement monitoring",
            submenu: [
              {
                icon: BarChart3,
                label: "SLA Dashboard",
                path: "/company/sla/dashboard",
                description: "SLA performance overview",
              },
              {
                icon: AlertCircle,
                label: "SLA Breaches",
                path: "/company/sla/breaches",
                description: "SLA breach monitoring",
              },
              {
                icon: Target,
                label: "Performance Targets",
                path: "/company/sla/targets",
                description: "Set performance targets",
              },
              {
                icon: Search,
                label: "QA Queue",
                path: "/company/sla/qa-queue",
                description: "Quality assurance queue",
              },
              {
                icon: CheckCircle,
                label: "QA Reviews",
                path: "/company/sla/qa-reviews",
                description: "Quality review management",
              },
              {
                icon: FileText,
                label: "Quality Reports",
                path: "/company/sla/quality-reports",
                description: "Quality assurance reports",
              },
              {
                icon: Settings,
                label: "QA Configuration",
                path: "/company/sla/qa-config",
                description: "Configure QA parameters",
              },
            ],
          },
          {
            icon: BarChart3,
            label: "Analytics & Reports",
            path: "/company/analytics",
            description: "Comprehensive reporting and analytics",
            submenu: [
              {
                icon: TrendingUp,
                label: "Performance Dashboard",
                path: "/company/analytics/performance",
                description: "Overall performance metrics",
              },
              {
                icon: DollarSign,
                label: "Financial Reports",
                path: "/company/analytics/financial",
                description: "Revenue and financial analytics",
              },
              {
                icon: Users,
                label: "Employee Reports",
                path: "/company/analytics/employees",
                description: "Employee performance reports",
              },
              {
                icon: Building2,
                label: "Client Reports",
                path: "/company/analytics/clients",
                description: "Client-specific analytics",
              },
              {
                icon: Clock,
                label: "SLA Reports",
                path: "/company/analytics/sla",
                description: "SLA compliance reports",
              },
              {
                icon: Filter,
                label: "Custom Reports",
                path: "/company/analytics/custom",
                description: "Build custom reports",
              },
            ],
          },
          {
            icon: Settings,
            label: "Company Settings",
            path: "/company/settings",
            description: "Company configuration and preferences",
            submenu: [
              {
                icon: Building2,
                label: "Company Profile",
                path: "/company/settings/profile",
                description: "Manage company profile",
              },
              {
                icon: Settings,
                label: "System Settings",
                path: "/company/settings/system",
                description: "System configuration",
              },
              {
                icon: Shield,
                label: "Security Settings",
                path: "/company/settings/security",
                description: "Security and access control",
              },
              {
                icon: Globe,
                label: "Integrations",
                path: "/company/settings/integrations",
                description: "Third-party integrations",
              },
            ],
          },
        ];

      case "employee":
        return [
          {
            icon: LayoutDashboard,
            label: "My Dashboard",
            path: "/employee/dashboard",
            description: "Overview of your performance and tasks",
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
            label: "My Performance",
            path: "/employee/performance",
            description: "Track your performance metrics",
          },
          {
            icon: Users,
            label: "My Profile",
            path: "/employee/profile",
            description: "Manage your personal information",
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
                    className={`w-full text-sm flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActiveRoute(item.path, item.submenu)
                        ? `bg-gradient-to-r ${theme.secondary} text-white shadow-lg`
                        : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white`
                    }`}
                    title={item.description}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
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
                            `flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
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
                    `flex text-sm items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
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

        <div>
            <Button onClick={handleSync} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              🔁 Sync Payers from Claim.MD
            </Button>
        </div>

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
                    handleLogout();
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
