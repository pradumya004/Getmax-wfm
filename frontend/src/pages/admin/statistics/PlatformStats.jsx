// frontend/src/pages/admin/PlatformStats.jsx - Master Admin Platform Statistics

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Building,
  Users,
  DollarSign,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Crown,
  Star,
  Package,
  Target,
  Zap,
  Globe,
  Database,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { masterAdminAPI } from "../../../api/masterAdmin.api.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useApi } from "../../../hooks/useApi.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner.jsx";

const PlatformStats = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("overview");

  // API hooks
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
    data: employeesData,
    loading: employeesLoading,
    execute: fetchEmployees,
  } = useApi(masterAdminAPI.getAllEmployees);

  useEffect(() => {
    fetchAllStats();
  }, [selectedPeriod]);

  const fetchAllStats = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Fetching platform statistics...");

      await Promise.all([
        fetchPlatformStats(selectedPeriod),
        fetchCompanies({ page: 1, limit: 100 }), // Get more companies for stats
        fetchEmployees({ page: 1, limit: 100 }), // Get more employees for stats
      ]);
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      toast.error("Failed to load some statistics");
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAllStats();
    toast.success("Statistics refreshed!");
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateGrowthRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const getPlanColor = (plan) => {
    switch (plan?.toLowerCase()) {
      case "enterprise":
        return "text-purple-400 bg-purple-400/20";
      case "professional":
        return "text-blue-400 bg-blue-400/20";
      case "basic":
        return "text-green-400 bg-green-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-400/20";
      case "trial":
        return "text-yellow-400 bg-yellow-400/20";
      case "suspended":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  // Extract data with safe fallbacks
  const stats = platformStats?.overview || {};
  const growth = platformStats?.growth || {};
  const subscriptions = platformStats?.subscriptions || [];
  const topCompanies = platformStats?.topCompanies || [];
  const companies = companiesData?.companies || [];
  const employees = employeesData?.employees || [];

  // Calculate additional metrics
  const subscriptionBreakdown = subscriptions.reduce((acc, sub) => {
    acc[sub._id] = sub.count;
    return acc;
  }, {});

  const statusBreakdown = companies.reduce((acc, company) => {
    const status = company.subscriptionStatus || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (statsLoading && companiesLoading && employeesLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-white mt-4">Loading Platform Statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>Platform Statistics - Master Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className={`w-8 h-8 text-${theme.accent}`} />
              <h1 className="text-3xl font-bold text-white">
                Platform Analytics
              </h1>
            </div>
            <p className={`text-${theme.textSecondary}`}>
              Comprehensive insights into platform performance and growth
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
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="inline-flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline"
              className="inline-flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <Card className="p-4 border-yellow-500/30 bg-yellow-500/5">
            <h4 className="text-yellow-400 font-medium mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Debug Information
            </h4>
            <div className="text-sm text-yellow-300 space-y-1">
              <p>
                Platform Stats:{" "}
                {platformStats
                  ? "✅ Loaded"
                  : statsLoading
                  ? "⏳ Loading"
                  : "❌ Failed"}
              </p>
              <p>
                Companies:{" "}
                {companiesData
                  ? "✅ Loaded"
                  : companiesLoading
                  ? "⏳ Loading"
                  : "❌ Failed"}
              </p>
              <p>
                Employees:{" "}
                {employeesData
                  ? "✅ Loaded"
                  : employeesLoading
                  ? "⏳ Loading"
                  : "❌ Failed"}
              </p>
              <p>Error: {statsError || "None"}</p>
            </div>
          </Card>
        )}

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            variant="elevated"
            className="p-6 hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Total Companies
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.totalCompanies || 0}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm font-medium">
                    +{stats.companyGrowthRate || 0}%
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    growth
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

          <Card
            variant="elevated"
            className="p-6 hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Total Users
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatNumber(stats.totalEmployees)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm font-medium">
                    +{stats.employeeGrowthRate || 0}%
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    growth
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

          <Card
            variant="elevated"
            className="p-6 hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Active Rate
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.totalCompanies > 0
                    ? (
                        (stats.activeCompanies / stats.totalCompanies) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-blue-400 text-sm font-medium">
                    {stats.activeCompanies || 0}/{stats.totalCompanies || 0}
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    companies
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

          <Card
            variant="elevated"
            className="p-6 hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-${theme.textSecondary} text-sm font-medium`}
                >
                  Avg Users/Company
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.averageEmployeesPerCompany || 0}
                </p>
                <div className="flex items-center mt-2">
                  <Target className="w-4 h-4 text-purple-400 mr-1" />
                  <span className="text-purple-400 text-sm font-medium">
                    Efficiency
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm ml-1`}>
                    metric
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${theme.secondary}`}
              >
                <Database className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Plans Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              Subscription Plans
            </h3>
            <div className="space-y-4">
              {subscriptions.length > 0 ? (
                subscriptions.map((plan) => (
                  <div
                    key={plan._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getPlanColor(
                          plan._id
                        )}`}
                      ></div>
                      <span className="text-white font-medium">{plan._id}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{plan.count}</p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        {plan.activeCount} active
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">Enterprise</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {subscriptionBreakdown.Enterprise || 0}
                      </p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        companies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">
                        Professional
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {subscriptionBreakdown.Professional || 0}
                      </p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        companies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">Basic</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {subscriptionBreakdown.Basic || 0}
                      </p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        companies
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Company Status Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Company Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Active</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {statusBreakdown.Active || 0}
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    {(
                      ((statusBreakdown.Active || 0) / companies.length) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Trial</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {statusBreakdown.Trial || 0}
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    {(
                      ((statusBreakdown.Trial || 0) / companies.length) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-white font-medium">Suspended</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {statusBreakdown.Suspended || 0}
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    {(
                      ((statusBreakdown.Suspended || 0) / companies.length) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Growth Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Growth Metrics ({selectedPeriod})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg ${theme.glass}`}>
              <h4
                className={`text-${theme.textSecondary} text-sm font-medium mb-2`}
              >
                New Companies
              </h4>
              <p className="text-2xl font-bold text-white">
                {growth.newCompaniesThisPeriod || 0}
              </p>
              <p className={`text-${theme.textSecondary} text-sm mt-1`}>
                +{stats.companyGrowthRate || 0}% vs previous period
              </p>
            </div>
            <div className={`p-4 rounded-lg ${theme.glass}`}>
              <h4
                className={`text-${theme.textSecondary} text-sm font-medium mb-2`}
              >
                New Users
              </h4>
              <p className="text-2xl font-bold text-white">
                {growth.newEmployeesThisPeriod || 0}
              </p>
              <p className={`text-${theme.textSecondary} text-sm mt-1`}>
                +{stats.employeeGrowthRate || 0}% vs previous period
              </p>
            </div>
            <div className={`p-4 rounded-lg ${theme.glass}`}>
              <h4
                className={`text-${theme.textSecondary} text-sm font-medium mb-2`}
              >
                Platform Utilization
              </h4>
              <p className="text-2xl font-bold text-white">
                {stats.totalEmployees > 0
                  ? (
                      (stats.activeEmployees / stats.totalEmployees) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className={`text-${theme.textSecondary} text-sm mt-1`}>
                {stats.activeEmployees || 0} active users
              </p>
            </div>
          </div>
        </Card>

        {/* Top Companies */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Top Companies by Employee Count
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/master-admin/companies")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>

          {topCompanies.length > 0 ? (
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div
                  key={company._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center text-sm font-bold text-white`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {company.companyName}
                      </p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        {company.subscriptionPlan} Plan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">
                      {company.employeeCount}
                    </p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      {company.activeEmployeeCount} active
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building
                className={`w-12 h-12 text-${theme.textSecondary} mx-auto mb-4`}
              />
              <p className={`text-${theme.textSecondary}`}>
                No top companies data available
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PlatformStats;
