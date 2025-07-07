// frontend/src/pages/company/CompanyDashboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Users,
  TrendingUp,
  Building2,
  Settings,
  Star,
  Plus,
  AlertCircle,
  Upload,
  UserPlus,
  BarChart3,
  Target,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Zap,
  DollarSign,
  Eye,
  MoreHorizontal,
  Download,
  Filter,
  Search,
  Bell,
  Briefcase,
  Medal,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { companyAPI } from "../../api/company.api.js";
import { employeeAPI } from "../../api/employee.api.js";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
// import StatCard from "../../components/common/StatCard.jsx";
// import { CompanyProfileCard } from "../../components/company/CompanyProfileCard.jsx";
// import { EmployeeStatsCard } from "../../components/company/EmployeeStatsCard.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Parallel API calls for dashboard data
      const [profileResponse, employeesResponse, orgResponse] =
        await Promise.all([
          companyAPI.getProfile().catch(() => null),
          employeeAPI
            .getCompanyEmployees({ limit: 5, page: 1 })
            .catch(() => null),
          companyAPI.getOrgData().catch(() => null),
        ]);

      // console.log("Profile Response:", profileResponse);
      // console.log("Employees Response:", employeesResponse);
      // console.log("Organization Response:", orgResponse);

      const profileData = profileResponse?.data?.data || {};
      const employeesData = employeesResponse?.data?.data || [];
      const orgData = orgResponse?.data?.data || {};

      console.log("Profile Data:", profileData);
      console.log("Employees Data:", employeesData);
      console.log("Organization Data:", orgData);

      const mockDashboard = {
        profile: profileData || {},
        employeeStats: {
          totalEmployees: employeesData?.employees.length || 0,
          activeEmployees: employeesData?.employees.filter(
            (emp) => emp.systemInfo?.isActive
          ).length,
        },
        recentEmployees: employeesResponse?.employees || [{}],
        organizationStats: orgResponse?.data || {},
        notifications: [
          {
            id: 1,
            type: "success",
            title: "New Employee Onboarded",
            message: "John Doe has completed onboarding",
            time: "2h ago",
          },
          {
            id: 2,
            type: "warning",
            title: "Performance Review Due",
            message: "5 employees need performance reviews",
            time: "4h ago",
          },
          {
            id: 3,
            type: "info",
            title: "System Update",
            message: "Platform updated with new features",
            time: "1d ago",
          },
        ],
        performanceMetrics: {
          avgProductivity: 88.5,
          qualityScore: 92.3,
          slaCompliance: 94.8,
          employeeSatisfaction: 4.2,
        },
        upcomingEvents: [
          {
            id: 1,
            title: "All Hands Meeting",
            date: "2024-02-15",
            type: "meeting",
          },
          {
            id: 2,
            title: "Q1 Performance Reviews",
            date: "2024-03-01",
            type: "review",
          },
          {
            id: 3,
            title: "Team Building Event",
            date: "2024-02-20",
            type: "event",
          },
        ],
      };
      setDashboardData(mockDashboard);
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
      case "inactive":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "pending":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      default:
        return `text-${theme.textSecondary} bg-${theme.accent}/20 border-${theme.accent}/30`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "info":
        return <Activity className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
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

  const {
    profile,
    employeeStats,
    recentEmployees,
    organizationStats,
    notifications,
    performanceMetrics,
    upcomingEvents,
  } = dashboardData;

  console.log("Dashboard Data:", dashboardData);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>{`Company Dashboard - ${profile?.companyName}`}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to {profile?.companyName || "Your Company"} 🏢
            </h1>
            <p className={`text-${theme.textSecondary}`}>
              Manage your workforce and track company performance
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate("/company/employees/bulk")}
              className="inline-flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Bulk Upload</span>
            </Button>
            <Button
              onClick={() => navigate("/company/employees/add")}
              className="inline-flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated" className="p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Total Employees
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {employeeStats.totalEmployees}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm font-medium">
                    +{employeeStats.employeeGrowth}%
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    this month
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
                  Active Employees
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {employeeStats.activeEmployees}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm font-medium">
                    {(
                      (employeeStats.activeEmployees /
                        employeeStats.totalEmployees) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    active rate
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${theme.secondary}`}
              >
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  New Hires
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {employeeStats.newHiresThisMonth}
                </p>
                <div className="flex items-center mt-2">
                  <UserPlus className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-blue-400 text-sm font-medium">
                    This month
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

          <Card variant="elevated" className="p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Top Performers
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {employeeStats.topPerformers}
                </p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-yellow-400 text-sm font-medium">
                    Avg: {performanceMetrics.avgProductivity}%
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${theme.secondary}`}
              >
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Overview & Notifications */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {`Performance Overview (Dummy Data)`}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${theme.glass} text-center`}>
                <Target
                  className={`w-8 h-8 mx-auto mb-2 text-${theme.accent}`}
                />
                <p className="text-2xl font-bold text-white">
                  {performanceMetrics.avgProductivity}%
                </p>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Productivity
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme.glass} text-center`}>
                <Shield
                  className={`w-8 h-8 mx-auto mb-2 text-${theme.accent}`}
                />
                <p className="text-2xl font-bold text-white">
                  {performanceMetrics.qualityScore}%
                </p>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Quality Score
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme.glass} text-center`}>
                <Clock
                  className={`w-8 h-8 mx-auto mb-2 text-${theme.accent}`}
                />
                <p className="text-2xl font-bold text-white">
                  {performanceMetrics.slaCompliance}%
                </p>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  SLA Compliance
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme.glass} text-center`}>
                <Medal
                  className={`w-8 h-8 mx-auto mb-2 text-${theme.accent}`}
                />
                <p className="text-2xl font-bold text-white">
                  {performanceMetrics.employeeSatisfaction}
                </p>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Satisfaction
                </p>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">
                Department Distribution
              </h4>
              <div className="space-y-3">
                {(organizationStats?.data?.departments || []).map(
                  (dept, index) => (
                    <div
                      key={dept._id || index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-white">{dept.departmentName}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 h-2 bg-black/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${theme.secondary} transition-all duration-500`}
                            style={{ width: `${dept.percentage || 0}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-${theme.textSecondary} text-sm w-12 text-right`}
                        >
                          {dept.count || 0}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>

          {/* Notifications & Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              {`Recent Activity (Dummy Data)`}
            </h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${theme.glass} border-l-4 border-${
                    notification.type === "success"
                      ? "green-400"
                      : notification.type === "warning"
                      ? "yellow-400"
                      : "blue-400"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm">
                        {notification.title}
                      </h4>
                      <p className={`text-${theme.textSecondary} text-sm mt-1`}>
                        {notification.message}
                      </p>
                      <p className={`text-${theme.textSecondary} text-xs mt-2`}>
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Notifications
            </Button>
          </Card>
        </div>

        {/* Recent Employees & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Employees */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Employees
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/company/employees")}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentEmployees.map((employee) => (
                <div
                  key={employee._id}
                  className={`p-3 rounded-lg ${theme.glass} hover:bg-white/5 transition-all cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center text-sm font-bold text-white`}
                      >
                        {employee.personalInfo?.firstName?.charAt(0)}
                        {employee.personalInfo?.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {employee.personalInfo?.firstName}{" "}
                          {employee.personalInfo?.lastName}
                        </h4>
                        <p className={`text-${theme.textSecondary} text-sm`}>
                          {employee.designationRef?.designationName} •{" "}
                          {employee.departmentRef?.departmentName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(
                          employee.status?.employeeStatus
                        )}`}
                      >
                        {employee.status?.employeeStatus}
                      </span>
                      <p className={`text-${theme.textSecondary} text-xs mt-1`}>
                        Level{" "}
                        {employee.gamification?.experience?.currentLevel || 1}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Events & Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Events
            </h3>
            <div className="space-y-3 mb-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg ${theme.glass} flex items-center justify-between`}
                >
                  <div>
                    <h4 className="text-white font-medium">{event.title}</h4>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${theme.badge} border`}
                  >
                    {event.type}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-medium">Quick Actions</h4>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/company/organization")}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Organization Structure
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/company/employees/performance")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </Card>
        </div>

        {/* Company Health & Statistics */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Company Health Overview
            </h3>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Detailed Analytics
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-medium">Organizational Health</h4>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Overall Score
                </span>
                <span className="text-green-400 font-bold text-xl">
                  {organizationStats.organizationalHealth}%
                </span>
              </div>
              <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000"
                  style={{
                    width: `${organizationStats.organizationalHealth}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">Financial Health</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-${theme.textSecondary} text-sm`}>
                    Monthly Revenue
                  </span>
                  <span className="text-white font-medium">
                    ${profile?.currentMonthRevenue?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-${theme.textSecondary} text-sm`}>
                    Growth Rate
                  </span>
                  <span className="text-green-400 font-medium">
                    +{profile?.revenueGrowthThisMonth}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-${theme.textSecondary} text-sm`}>
                    Subscription
                  </span>
                  <span
                    className={`font-medium ${
                      profile?.subscriptionStatus === "Active"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {profile?.subscriptionPlan} ({profile?.subscriptionStatus})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">Workforce Analytics</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${theme.glass} text-center`}>
                  <p className="text-lg font-bold text-white">
                    {organizationStats.data.departments.length}
                  </p>
                  <p className={`text-${theme.textSecondary} text-xs`}>
                    Departments
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${theme.glass} text-center`}>
                  <p className="text-lg font-bold text-white">
                    {organizationStats.data.roles.length}
                  </p>
                  <p className={`text-${theme.textSecondary} text-xs`}>Roles</p>
                </div>
                <div className={`p-3 rounded-lg ${theme.glass} text-center`}>
                  <p className="text-lg font-bold text-white">
                    {organizationStats.data.designations.length}
                  </p>
                  <p className={`text-${theme.textSecondary} text-xs`}>
                    Designations
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${theme.glass} text-center`}>
                  <p className="text-lg font-bold text-white">
                    {organizationStats.data?.subdepartments?.length}
                  </p>
                  <p className={`text-${theme.textSecondary} text-xs`}>
                    SubDepartments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboard;
