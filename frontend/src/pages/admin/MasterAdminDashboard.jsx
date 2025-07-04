// frontend/src/pages/admin/MasterAdminDashboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminAPI } from "../../api/admin.api.js";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  console.log("AdminDashboard - userType:", userType);
  const theme = getTheme(userType);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockData = {
        stats: {
          totalCompanies: 156,
          activeCompanies: 142,
          totalEmployees: 8945,
          platformRevenue: 125000,
          companyGrowth: 12.5,
          employeeGrowth: 8.3,
          revenueGrowth: 15.7,
          activeUsersToday: 6234,
        },
        recentCompanies: [
          {
            id: 1,
            name: "TechCorp Solutions",
            employees: 245,
            plan: "Enterprise",
            status: "Active",
            joinDate: "2024-01-15",
          },
          {
            id: 2,
            name: "HealthPlus Medical",
            employees: 89,
            plan: "Professional",
            status: "Active",
            joinDate: "2024-01-10",
          },
          {
            id: 3,
            name: "StartUp Hub",
            employees: 23,
            plan: "Basic",
            status: "Trial",
            joinDate: "2024-01-08",
          },
          {
            id: 4,
            name: "Global Dynamics",
            employees: 567,
            plan: "Enterprise",
            status: "Active",
            joinDate: "2024-01-05",
          },
          {
            id: 5,
            name: "Innovation Labs",
            employees: 134,
            plan: "Professional",
            status: "Active",
            joinDate: "2024-01-03",
          },
        ],
        alerts: [
          {
            id: 1,
            type: "warning",
            title: "High Server Load",
            message: "Server CPU usage is at 85%",
            time: "10m ago",
          },
          {
            id: 2,
            type: "info",
            title: "New Feature Released",
            message: "Gamification module is now live",
            time: "2h ago",
          },
          {
            id: 3,
            type: "success",
            title: "Backup Completed",
            message: "Daily backup completed successfully",
            time: "4h ago",
          },
        ],
        platformMetrics: {
          systemHealth: 98.7,
          averageResponseTime: 156,
          dataProcessed: "2.3TB",
          apiCalls: 1250000,
        },
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "trial":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "inactive":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      default:
        return `text-${theme.textSecondary} bg-${theme.accent}/20 border-${theme.accent}/30`;
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan?.toLowerCase()) {
      case "enterprise":
        return "👑";
      case "professional":
        return "💼";
      case "basic":
        return "📦";
      case "trial":
        return "🚀";
      default:
        return "📋";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "info":
        return <Activity className="w-5 h-5 text-blue-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const { stats, recentCompanies, alerts, platformMetrics } = dashboardData;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>Admin Dashboard - GetMax Platform</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Platform Overview 🚀
            </h1>
            <p className={`text-${theme.textSecondary}`}>
              Monitor platform performance and manage companies
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button
              onClick={() => navigate("/admin/companies")}
              className="inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated" className="p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Total Companies
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.totalCompanies}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm font-medium">
                    +{stats.companyGrowth}%
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${theme.secondary}`}
              >
                <Building className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Platform Users
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.totalEmployees.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm font-medium">
                    +{stats.employeeGrowth}%
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${theme.secondary}`}
              >
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Platform Revenue
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  ${stats.platformRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm font-medium">
                    +{stats.revenueGrowth}%
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${theme.secondary}`}
              >
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Active Today
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.activeUsersToday.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-blue-400 text-sm font-medium">
                    Real-time
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    users online
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${theme.secondary}`}
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Platform Health & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Health */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Platform Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className={`text-${theme.textSecondary} text-sm`}>
                    System Health
                  </span>
                  <span className="text-green-400 font-medium">
                    {platformMetrics.systemHealth}%
                  </span>
                </div>
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                    style={{ width: `${platformMetrics.systemHealth}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${theme.glass}`}>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Response Time
                  </p>
                  <p className="text-white font-bold">
                    {platformMetrics.averageResponseTime}ms
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${theme.glass}`}>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    API Calls
                  </p>
                  <p className="text-white font-bold">
                    {(platformMetrics.apiCalls / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${theme.glass}`}>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Data Processed Today
                </p>
                <p className="text-white font-bold text-lg">
                  {platformMetrics.dataProcessed}
                </p>
              </div>
            </div>
          </Card>

          {/* System Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              System Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg ${theme.glass} border-l-4 border-${
                    alert.type === "warning"
                      ? "yellow-400"
                      : alert.type === "success"
                      ? "green-400"
                      : "blue-400"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm">
                        {alert.title}
                      </h4>
                      <p className={`text-${theme.textSecondary} text-sm mt-1`}>
                        {alert.message}
                      </p>
                      <p className={`text-${theme.textSecondary} text-xs mt-2`}>
                        {alert.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Alerts
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/companies")}
              >
                <Building className="w-4 h-4 mr-2" />
                Manage Companies
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/employees")}
              >
                <Users className="w-4 h-4 mr-2" />
                View All Users
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/stats")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Platform Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Companies */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Recent Companies
            </h3>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/companies")}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Company
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Employees
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Plan
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Join Date
                  </th>
                  <th
                    className={`text-center py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center text-sm font-bold text-white`}
                        >
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {company.name}
                          </p>
                          <p className={`text-${theme.textSecondary} text-sm`}>
                            ID: COMP-{company.id.toString().padStart(4, "0")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">
                        {company.employees}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                      >
                        {getPlanIcon(company.plan)} {company.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getStatusColor(
                          company.status
                        )}`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-${theme.textSecondary}`}>
                        {new Date(company.joinDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
