// frontend/src/pages/admin/ApiMonitoring.jsx - Master Admin API Monitoring

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Wifi,
  Activity,
  Server,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  BarChart3,
  Zap,
  Target,
  Globe,
  Database,
  Code,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Bell,
  Settings,
  Info,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { masterAdminAPI } from "../../../api/masterAdmin.api.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useApi } from "../../../hooks/useApi.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner.jsx";

const ApiMonitoring = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [timeRange, setTimeRange] = useState("1h");
  const [selectedEndpoint, setSelectedEndpoint] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // API hooks
  const {
    data: systemHealth,
    loading: healthLoading,
    execute: fetchSystemHealth,
  } = useApi(masterAdminAPI.getSystemHealth);

  useEffect(() => {
    fetchApiData();
  }, [timeRange, selectedEndpoint]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchApiData();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const fetchApiData = async () => {
    try {
      console.log("🔄 Fetching API monitoring data...");
      await fetchSystemHealth();
      setLastUpdated(new Date());
    } catch (error) {
      console.error("❌ Error fetching API data:", error);
      toast.error("Failed to fetch API monitoring data");
    }
  };

  const handleRefresh = () => {
    fetchApiData();
    toast.success("API monitoring data refreshed!");
  };

  // Mock API endpoints data for demonstration
  const apiEndpoints = [
    {
      id: 1,
      path: "/api/master-admin/companies",
      method: "GET",
      status: "healthy",
      requests: 1250,
      errors: 5,
      avgResponseTime: 145,
      uptime: 99.8,
      lastError: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      path: "/api/master-admin/platform-stats",
      method: "GET",
      status: "healthy",
      requests: 856,
      errors: 2,
      avgResponseTime: 230,
      uptime: 99.9,
      lastError: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: 3,
      path: "/api/master-admin/employees",
      method: "GET",
      status: "healthy",
      requests: 674,
      errors: 8,
      avgResponseTime: 180,
      uptime: 99.5,
      lastError: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: 4,
      path: "/api/master-admin/system-health",
      method: "GET",
      status: "warning",
      requests: 2340,
      errors: 25,
      avgResponseTime: 89,
      uptime: 98.9,
      lastError: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: 5,
      path: "/api/master-admin/companies/{id}/status",
      method: "PUT",
      status: "healthy",
      requests: 123,
      errors: 1,
      avgResponseTime: 320,
      uptime: 99.9,
      lastError: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ];

  // Mock traffic data
  const trafficData = {
    totalRequests: apiEndpoints.reduce((sum, ep) => sum + ep.requests, 0),
    totalErrors: apiEndpoints.reduce((sum, ep) => sum + ep.errors, 0),
    avgResponseTime: Math.round(
      apiEndpoints.reduce((sum, ep) => sum + ep.avgResponseTime, 0) /
        apiEndpoints.length
    ),
    requestsPerSecond: 45.6,
    activeConnections: 234,
    dataTransferred: "2.34 GB",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "warning":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "error":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "text-blue-400 bg-blue-400/20";
      case "POST":
        return "text-green-400 bg-green-400/20";
      case "PUT":
        return "text-yellow-400 bg-yellow-400/20";
      case "DELETE":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const formatUptime = (uptime) => {
    return `${uptime.toFixed(1)}%`;
  };

  const formatDuration = (date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  const errorRate =
    trafficData.totalRequests > 0
      ? ((trafficData.totalErrors / trafficData.totalRequests) * 100).toFixed(2)
      : 0;

  if (healthLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-white mt-4">Loading API Monitoring...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>API Monitoring - Master Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Wifi className={`w-8 h-8 text-${theme.accent}`} />
              <h1 className="text-3xl font-bold text-white">API Monitoring</h1>
            </div>
            <p className={`text-${theme.textSecondary}`}>
              Real-time API performance and traffic monitoring
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className={`text-sm text-${theme.textSecondary}`}>
                Auto-refresh
              </span>
            </div>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className={`px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
              <option value={300}>5m</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button
              onClick={handleRefresh}
              disabled={healthLoading}
              variant="outline"
              className="inline-flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${healthLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* API Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className={`w-5 h-5 text-${theme.accent}`} />
                <h3 className="font-medium text-white">Total Requests</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {trafficData.totalRequests.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+12.5%</span>
              <span className={`text-${theme.textSecondary} ml-1`}>
                vs last period
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Timer className={`w-5 h-5 text-${theme.accent}`} />
                <h3 className="font-medium text-white">Avg Response Time</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {trafficData.avgResponseTime}ms
              </span>
            </div>
            <div className="flex items-center text-sm">
              <ArrowDownRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">-8.2%</span>
              <span className={`text-${theme.textSecondary} ml-1`}>
                improvement
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`w-5 h-5 text-${theme.accent}`} />
                <h3 className="font-medium text-white">Error Rate</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {errorRate}%
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className={`text-${theme.textSecondary}`}>
                {trafficData.totalErrors} errors / {trafficData.totalRequests}{" "}
                requests
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className={`w-5 h-5 text-${theme.accent}`} />
                <h3 className="font-medium text-white">Requests/sec</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {trafficData.requestsPerSecond}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className={`text-${theme.textSecondary}`}>
                {trafficData.activeConnections} active connections
              </span>
            </div>
          </Card>
        </div>

        {/* Status Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            API Status Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-lg ${theme.glass} border-l-4 border-green-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-medium">
                    Healthy Endpoints
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {
                      apiEndpoints.filter((ep) => ep.status === "healthy")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${theme.glass} border-l-4 border-yellow-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 font-medium">Warning</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      apiEndpoints.filter((ep) => ep.status === "warning")
                        .length
                    }
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${theme.glass} border-l-4 border-red-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 font-medium">Critical</p>
                  <p className="text-2xl font-bold text-white">
                    {apiEndpoints.filter((ep) => ep.status === "error").length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        </Card>

        {/* Endpoint Details */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Code className="w-5 h-5 mr-2" />
              API Endpoints
            </h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${theme.textSecondary}`}
                />
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  className={`pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
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
                    Endpoint
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Requests
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Errors
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Avg Response
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Uptime
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Last Error
                  </th>
                  <th
                    className={`text-center py-3 px-4 text-${theme.textSecondary} font-medium`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map((endpoint) => (
                  <tr
                    key={endpoint.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(
                            endpoint.method
                          )}`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-white font-mono text-sm">
                          {endpoint.path}
                        </code>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getStatusColor(
                          endpoint.status
                        )}`}
                      >
                        {getStatusIcon(endpoint.status)}
                        <span className="ml-1 capitalize">
                          {endpoint.status}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">
                        {endpoint.requests.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-${
                          endpoint.errors > 10
                            ? "red-400"
                            : endpoint.errors > 5
                            ? "yellow-400"
                            : "green-400"
                        } font-medium`}
                      >
                        {endpoint.errors}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">
                        {endpoint.avgResponseTime}ms
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-${
                          endpoint.uptime > 99
                            ? "green-400"
                            : endpoint.uptime > 95
                            ? "yellow-400"
                            : "red-400"
                        } font-medium`}
                      >
                        {formatUptime(endpoint.uptime)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-${theme.textSecondary} text-sm`}>
                        {formatDuration(endpoint.lastError)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Time Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Response Time Trends
            </h3>
            <div className="space-y-4">
              {/* Mock chart placeholder */}
              <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <BarChart3
                    className={`w-12 h-12 text-${theme.textSecondary} mx-auto mb-2`}
                  />
                  <p className={`text-${theme.textSecondary}`}>
                    Response time chart would appear here
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Real-time performance visualization
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Traffic Volume */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Traffic Volume
            </h3>
            <div className="space-y-4">
              {/* Mock chart placeholder */}
              <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <Activity
                    className={`w-12 h-12 text-${theme.textSecondary} mx-auto mb-2`}
                  />
                  <p className={`text-${theme.textSecondary}`}>
                    Traffic volume chart would appear here
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Requests per minute over time
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* System Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className={`font-medium text-${theme.textSecondary}`}>
                Server Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Environment
                  </span>
                  <span className="text-white">
                    {systemHealth?.environment || "Production"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>Version</span>
                  <span className="text-white">
                    {systemHealth?.version || "v1.0.0"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Last Updated
                  </span>
                  <span className="text-white">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className={`font-medium text-${theme.textSecondary}`}>
                Performance
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Data Transferred
                  </span>
                  <span className="text-white">
                    {trafficData.dataTransferred}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Peak RPS
                  </span>
                  <span className="text-white">78.2/sec</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Cache Hit Rate
                  </span>
                  <span className="text-white">94.7%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className={`font-medium text-${theme.textSecondary}`}>
                Security
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Rate Limiting
                  </span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>SSL/TLS</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Auth Tokens
                  </span>
                  <span className="text-white">JWT</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApiMonitoring;
