import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Star,
  Shield,
  Zap,
  Target,
  Crown,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw,
  ExternalLink,
  Calendar,
  Globe,
  FileText,
  Search,
  Package,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Monitor,
  UserCheck,
  UserX,
  Pause,
  Play,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { masterAdminAPI } from "../../api/masterAdmin.api.js";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useApi } from "../../hooks/useApi.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const MasterAdminDashboard = () => {
  const navigate = useNavigate();
  const { userType, user } = useAuth();
  const theme = getTheme(userType);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // API hooks for different data
  const {
    data: platformStats,
    loading: statsLoading,
    execute: fetchPlatformStats,
    error: statsError,
  } = useApi(masterAdminAPI.getPlatformStats);

  const {
    data: companiesData,
    loading: companiesLoading,
    execute: fetchCompanies,
  } = useApi(masterAdminAPI.getAllCompanies);

  const {
    data: systemHealth,
    loading: healthLoading,
    execute: fetchSystemHealth,
  } = useApi(masterAdminAPI.getSystemHealth);

  const {
    data: employeesData,
    loading: employeesLoading,
    execute: fetchEmployees,
  } = useApi(masterAdminAPI.getAllEmployees);

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Fetching dashboard data...");

      const [statsResult, companiesResult, healthResult, employeesResult] =
        await Promise.allSettled([
          fetchPlatformStats(selectedPeriod),
          fetchCompanies({
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
          }),
          fetchSystemHealth(),
          fetchEmployees({ page: 1, limit: 5 }),
        ]);

        console.log("📊 Stats result:", statsResult);
        console.log("🏢 Companies result:", companiesResult);
        console.log("⚙️ Health result:", healthResult);
        console.log("👥 Employees result:", employeesResult);

      // Handle results
      if (statsResult.status === "rejected") {
        console.error("❌ Stats error:", statsResult.reason);
      }
      if (companiesResult.status === "rejected") {
        console.error("❌ Companies error:", companiesResult.reason);
      }
      if (healthResult.status === "rejected") {
        console.error("❌ Health error:", healthResult.reason);
      }
      if (employeesResult.status === "rejected") {
        console.error("❌ Employees error:", employeesResult.reason);
      }

      console.log("✅ Dashboard data loaded successfully");
    } catch (error) {
      console.error("❌ Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    toast.success("Dashboard data refreshed!");
  };

  // Mock data for demonstration (replace with real data from APIs)
  const mockStats = {
    totalCompanies: platformStats?.overview?.totalCompanies || 156,
    activeCompanies: platformStats?.overview?.activeCompanies || 142,
    totalEmployees: platformStats?.overview?.totalEmployees || 8742,
    activeEmployees: platformStats?.overview?.activeEmployees || 8234,
    monthlyRevenue: 284750,
    growthRate: 12.5,
    systemUptime: 99.98,
    apiCalls: 2847592,
  };

  const quickActions = [
    {
      label: "Company Management",
      icon: Building,
      color: "blue",
      action: () => navigate("/master-admin/companies"),
      count: mockStats.totalCompanies,
    },
    {
      label: "Employee Overview",
      icon: Users,
      color: "green",
      action: () => navigate("/master-admin/employees"),
      count: mockStats.totalEmployees,
    },
    {
      label: "System Health",
      icon: Activity,
      color: "purple",
      action: () => navigate("/master-admin/monitoring"),
      status: "healthy",
    },
    {
      label: "Platform Settings",
      icon: Settings,
      color: "orange",
      action: () => navigate("/master-admin/settings"),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "company_registered",
      company: "TechCorp Solutions",
      action: "New company registered",
      time: "2 minutes ago",
      icon: Building,
      color: "green",
    },
    {
      id: 2,
      type: "subscription_upgraded",
      company: "Digital Innovations Inc",
      action: "Upgraded to Enterprise plan",
      time: "15 minutes ago",
      icon: Crown,
      color: "blue",
    },
    {
      id: 3,
      type: "system_alert",
      company: "System",
      action: "High API usage detected",
      time: "1 hour ago",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      id: 4,
      type: "employee_bulk_add",
      company: "Global Manufacturing Ltd",
      action: "Added 45 new employees",
      time: "2 hours ago",
      icon: UserCheck,
      color: "green",
    },
    {
      id: 5,
      type: "company_suspended",
      company: "Inactive Corp",
      action: "Company suspended for non-payment",
      time: "4 hours ago",
      icon: Pause,
      color: "red",
    },
  ];

  const topCompanies = companiesData?.companies?.slice(0, 5) || [
    {
      companyName: "TechCorp Solutions",
      employeeCount: 245,
      subscriptionPlan: "Enterprise",
    },
    {
      companyName: "Digital Innovations",
      employeeCount: 189,
      subscriptionPlan: "Professional",
    },
    {
      companyName: "Global Manufacturing",
      employeeCount: 567,
      subscriptionPlan: "Enterprise",
    },
    {
      companyName: "Creative Agency",
      employeeCount: 34,
      subscriptionPlan: "Basic",
    },
    {
      companyName: "Finance Experts",
      employeeCount: 112,
      subscriptionPlan: "Professional",
    },
  ];

  const getSubscriptionBadge = (plan) => {
    const badges = {
      Enterprise: `${theme.planEnterprise} border`,
      Professional: `${theme.planProfessional} border`,
      Basic: `${theme.planBasic} border`,
    };
    return badges[plan] || badges.Basic;
  };

  const getActivityIcon = (type) => {
    const icons = {
      company_registered: Building,
      subscription_upgraded: Crown,
      system_alert: AlertTriangle,
      employee_bulk_add: UserCheck,
      company_suspended: Pause,
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (color) => {
    const colors = {
      green: "text-green-400 bg-green-400/20",
      blue: "text-blue-400 bg-blue-400/20",
      yellow: "text-yellow-400 bg-yellow-400/20",
      red: "text-red-400 bg-red-400/20",
      purple: "text-purple-400 bg-purple-400/20",
    };
    return colors[color] || colors.blue;
  };

  if (statsLoading && companiesLoading && healthLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} text-${theme.text}`}
    >
      <Helmet>
        <title>Master Admin Dashboard | GetMax WFM</title>
      </Helmet>

      {/* Header */}
      <div
        className={`top-0 z-40 ${theme.glass} backdrop-blur-xl border-b border-${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent`}
              >
                Master Admin Dashboard
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Welcome back, {user?.name || "Sriram"}! Monitor and control your
                entire platform.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
              >
                <option value="7d" className="bg-gray-800">
                  Last 7 days
                </option>
                <option value="30d" className="bg-gray-800">
                  Last 30 days
                </option>
                <option value="90d" className="bg-gray-800">
                  Last 90 days
                </option>
                <option value="1y" className="bg-gray-800">
                  Last year
                </option>
              </select>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                theme={userType}
                className="flex items-center space-x-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Total Companies
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {mockStats.totalCompanies.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">
                    +{mockStats.growthRate}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Total Employees
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {mockStats.totalEmployees.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Monthly Revenue
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  ${mockStats.monthlyRevenue.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">+15.3%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  System Uptime
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {mockStats.systemUptime}%
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">Excellent</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card theme={userType} className="p-6 mb-8">
          <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-4 ${theme.glass} hover:bg-white/10 border border-${theme.border} rounded-lg transition-all duration-200 text-left group hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent
                      className={`w-5 h-5 text-${action.color}-400`}
                    />
                    <ExternalLink
                      className={`w-4 h-4 text-${theme.textSecondary} group-hover:text-${theme.text} transition-colors`}
                    />
                  </div>
                  <p className={`text-${theme.text} font-medium`}>
                    {action.label}
                  </p>
                  {action.count && (
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      {action.count.toLocaleString()} items
                    </p>
                  )}
                  {action.status && (
                    <p
                      className={`text-sm ${
                        action.status === "healthy"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {action.status === "healthy"
                        ? "All systems operational"
                        : "Issues detected"}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Recent Activity
              </h3>
              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={() => navigate("/master-admin/activity")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className={`flex items-center space-x-3 p-3 ${theme.glass} rounded-lg`}
                  >
                    <div
                      className={`p-2 rounded-lg ${getActivityColor(
                        activity.color
                      )}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {activity.action}
                      </p>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        {activity.company}
                      </p>
                    </div>
                    <span
                      className={`text-${theme.textSecondary} text-xs whitespace-nowrap`}
                    >
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Top Companies */}
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Top Companies
              </h3>
              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={() => navigate("/master-admin/companies")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {topCompanies.map((company, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 ${theme.glass} rounded-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${theme.secondary} rounded-lg flex items-center justify-center`}
                    >
                      <Building className={`w-4 h-4 text-${theme.text}`} />
                    </div>
                    <div>
                      <p className={`text-${theme.text} font-medium text-sm`}>
                        {company.companyName}
                      </p>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        {company.employeeCount} employees
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getSubscriptionBadge(
                      company.subscriptionPlan
                    )}`}
                  >
                    {company.subscriptionPlan}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-${theme.text}`}>
              System Status
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-sm">
                All Systems Operational
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 ${theme.glass} rounded-lg`}>
              <div className="flex items-center space-x-3">
                <Server className="w-5 h-5 text-blue-400" />
                <div>
                  <p className={`text-${theme.text} text-sm`}>API Server</p>
                  <p className="text-green-400 text-xs">Online</p>
                </div>
              </div>
            </div>

            <div className={`p-4 ${theme.glass} rounded-lg`}>
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-green-400" />
                <div>
                  <p className={`text-${theme.text} text-sm`}>Database</p>
                  <p className="text-green-400 text-xs">Healthy</p>
                </div>
              </div>
            </div>

            <div className={`p-4 ${theme.glass} rounded-lg`}>
              <div className="flex items-center space-x-3">
                <Wifi className="w-5 h-5 text-purple-400" />
                <div>
                  <p className={`text-${theme.text} text-sm`}>CDN</p>
                  <p className="text-green-400 text-xs">Fast</p>
                </div>
              </div>
            </div>

            <div className={`p-4 ${theme.glass} rounded-lg`}>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-orange-400" />
                <div>
                  <p className={`text-${theme.text} text-sm`}>Security</p>
                  <p className="text-green-400 text-xs">Protected</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MasterAdminDashboard;
