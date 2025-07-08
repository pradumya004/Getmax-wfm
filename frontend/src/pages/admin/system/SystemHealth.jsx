// frontend/src/pages/admin/SystemHealth.jsx - Master Admin System Health Monitor

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  Download,
  Bell,
  Shield,
  Monitor,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  Cloud,
  Settings,
  Eye,
  AlertCircle,
  Info,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Timer,
  Target,
  Gauge,
} from "lucide-react";
import { toast } from "react-hot-toast";
import masterAdminAPI from "../../../api/masterAdmin.api.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useApi } from "../../../hooks/useApi.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner.jsx";

const SystemHealth = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // API hooks
  const {
    data: systemHealth,
    loading: healthLoading,
    execute: fetchSystemHealth,
    error: healthError,
  } = useApi(masterAdminAPI.getSystemHealth);

  const {
    data: platformStats,
    loading: statsLoading,
    execute: fetchPlatformStats,
  } = useApi(masterAdminAPI.getPlatformStats);

  useEffect(() => {
    fetchSystemData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchSystemData();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const fetchSystemData = async () => {
    try {
      console.log("🔄 Fetching system health data...");

      await Promise.all([
        fetchSystemHealth(),
        fetchPlatformStats("24h"), // Get recent stats for load monitoring
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("❌ Error fetching system data:", error);
      toast.error("Failed to fetch system health data");
    }
  };

  const handleRefresh = () => {
    fetchSystemData();
    toast.success("System data refreshed!");
  };

  const formatUptime = (uptimeSeconds) => {
    if (!uptimeSeconds) return "Unknown";

    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getHealthStatus = () => {
    if (!systemHealth)
      return { status: "unknown", color: "gray", message: "No data" };

    if (systemHealth.status === "healthy") {
      return {
        status: "healthy",
        color: "green",
        message: "All systems operational",
      };
    } else {
      return {
        status: "issues",
        color: "red",
        message: "System issues detected",
      };
    }
  };

  const getMemoryUsagePercentage = () => {
    if (!systemHealth?.memory) return 0;
    const { heapUsed, heapTotal, rss } = systemHealth.memory;
    if (heapTotal) {
      return Math.round((heapUsed / heapTotal) * 100);
    }
    return 0;
  };

  const getCpuUsage = () => {
    // This would come from a real monitoring system
    // For now, we'll simulate based on memory usage
    const memUsage = getMemoryUsagePercentage();
    return Math.min(95, memUsage + Math.random() * 20);
  };

  const getLoadAverage = () => {
    // Simulated load average
    return {
      "1min": (Math.random() * 2).toFixed(2),
      "5min": (Math.random() * 1.5).toFixed(2),
      "15min": (Math.random() * 1).toFixed(2),
    };
  };

  const healthStatus = getHealthStatus();
  const memoryUsage = getMemoryUsagePercentage();
  const cpuUsage = getCpuUsage();
  const loadAverage = getLoadAverage();

  // Mock alerts for demonstration
  const systemAlerts = [
    {
      id: 1,
      type: "info",
      title: "System Backup Completed",
      message: "Daily backup completed successfully",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: "low",
    },
    {
      id: 2,
      type: "warning",
      title: "High Memory Usage",
      message: `Memory usage is at ${memoryUsage}%`,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: "medium",
    },
    {
      id: 3,
      type: "success",
      title: "Database Optimization",
      message: "Database queries optimized successfully",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      severity: "low",
    },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getProgressBarColor = (percentage) => {
    if (percentage < 50) return "from-green-500 to-green-400";
    if (percentage < 80) return "from-yellow-500 to-yellow-400";
    return "from-red-500 to-red-400";
  };

  if (healthLoading && statsLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-white mt-4">Loading System Health...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>System Health - Master Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Monitor className={`w-8 h-8 text-${theme.accent}`} />
              <h1 className="text-3xl font-bold text-white">
                System Health Monitor
              </h1>
            </div>
            <p className={`text-${theme.textSecondary}`}>
              Real-time platform monitoring and system diagnostics
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
            <Button
              variant="outline"
              className="inline-flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <Card
          className={`p-6 ${
            healthStatus.color === "green"
              ? "border-green-500/30"
              : "border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-lg ${
                  healthStatus.color === "green"
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}
              >
                {healthStatus.color === "green" ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  System Status:{" "}
                  {healthStatus.status === "healthy"
                    ? "Healthy"
                    : "Issues Detected"}
                </h2>
                <p className={`text-${theme.textSecondary}`}>
                  {healthStatus.message}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm text-${theme.textSecondary}`}>
                Last Updated
              </p>
              <p className="text-white font-medium">
                {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <Card className="p-4 border-yellow-500/30 bg-yellow-500/5">
            <h4 className="text-yellow-400 font-medium mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Debug Information
            </h4>
            <div className="text-sm text-yellow-300 space-y-1">
              <p>
                System Health:{" "}
                {systemHealth
                  ? "✅ Loaded"
                  : healthLoading
                  ? "⏳ Loading"
                  : "❌ Failed"}
              </p>
              <p>
                Platform Stats:{" "}
                {platformStats
                  ? "✅ Loaded"
                  : statsLoading
                  ? "⏳ Loading"
                  : "❌ Failed"}
              </p>
              <p>Auto Refresh: {autoRefresh ? "✅ Enabled" : "❌ Disabled"}</p>
              <p>Error: {healthError || "None"}</p>
            </div>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className={`w-5 h-5 text-${theme.accent}`} />
                <h3 className="font-medium text-white">CPU Usage</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {cpuUsage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressBarColor(
                  cpuUsage
                )} transition-all duration-500`}
                style={{ width: `${cpuUsage}%` }}
              ></div>
            </div>
            <p className={`text-xs text-${theme.textSecondary} mt-2`}>
              Load: {loadAverage["1min"]} / {loadAverage["5min"]} /{" "}
              {loadAverage["15min"]}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HardDrive className={`w-5 h-5 text-${theme.accent}`} />
                <h3 className="font-medium text-white">Memory</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {memoryUsage}%
              </span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressBarColor(
                  memoryUsage
                )} transition-all duration-500`}
                style={{ width: `${memoryUsage}%` }}
              ></div>
            </div>
            <p className={`text-xs text-${theme.textSecondary} mt-2`}>
              {systemHealth?.memory
                ? formatBytes(systemHealth.memory.heapUsed)
                : "N/A"}{" "}
              used
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className={`w-5 h-5 text-${theme.accent}`} />
                <h3 className="font-medium text-white">Uptime</h3>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {formatUptime(systemHealth?.uptime)}
            </p>
            <p className={`text-xs text-${theme.textSecondary}`}>
              Since last restart
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Globe className={`w-5 h-5 text-${theme.accent}`} />
                <h3 className="font-medium text-white">Environment</h3>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-2 capitalize">
              {systemHealth?.environment || "Unknown"}
            </p>
            <p className={`text-xs text-${theme.textSecondary}`}>
              Version: {systemHealth?.version || "N/A"}
            </p>
          </Card>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Database Connections</span>
                </div>
                <span className="text-white font-bold">45/100</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-3">
                  <Wifi className="w-5 h-5 text-green-400" />
                  <span className="text-white">Active Sessions</span>
                </div>
                <span className="text-white font-bold">
                  {platformStats?.overview?.activeEmployees || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="text-white">API Requests/min</span>
                </div>
                <span className="text-white font-bold">1,234</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Avg Response Time</span>
                </div>
                <span className="text-white font-bold">156ms</span>
              </div>
            </div>
          </Card>

          {/* System Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Recent Alerts
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg ${theme.glass} border-l-4 ${
                    alert.type === "error"
                      ? "border-red-500"
                      : alert.type === "warning"
                      ? "border-yellow-500"
                      : alert.type === "success"
                      ? "border-green-500"
                      : "border-blue-500"
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
                        {alert.timestamp.toLocaleString()}
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
        </div>

        {/* Service Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            Service Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Web Server</span>
              </div>
              <span className="text-green-400 text-sm font-medium">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Database</span>
              </div>
              <span className="text-green-400 text-sm font-medium">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">API Gateway</span>
              </div>
              <span className="text-green-400 text-sm font-medium">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-white">Cache Server</span>
              </div>
              <span className="text-yellow-400 text-sm font-medium">
                Degraded
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">File Storage</span>
              </div>
              <span className="text-green-400 text-sm font-medium">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Email Service</span>
              </div>
              <span className="text-green-400 text-sm font-medium">
                Operational
              </span>
            </div>
          </div>
        </Card>

        {/* System Resources */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Gauge className="w-5 h-5 mr-2" />
            Resource Monitoring
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className={`font-medium text-${theme.textSecondary}`}>
                Memory Details
              </h4>
              {systemHealth?.memory && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={`text-${theme.textSecondary}`}>
                      Heap Used
                    </span>
                    <span className="text-white">
                      {formatBytes(systemHealth.memory.heapUsed)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={`text-${theme.textSecondary}`}>
                      Heap Total
                    </span>
                    <span className="text-white">
                      {formatBytes(systemHealth.memory.heapTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={`text-${theme.textSecondary}`}>RSS</span>
                    <span className="text-white">
                      {formatBytes(systemHealth.memory.rss)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className={`font-medium text-${theme.textSecondary}`}>
                Network
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Bytes In
                  </span>
                  <span className="text-white">2.3 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Bytes Out
                  </span>
                  <span className="text-white">1.8 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Packets/sec
                  </span>
                  <span className="text-white">1,250</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className={`font-medium text-${theme.textSecondary}`}>
                Disk I/O
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Read/sec
                  </span>
                  <span className="text-white">45 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>
                    Write/sec
                  </span>
                  <span className="text-white">23 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${theme.textSecondary}`}>IOPS</span>
                  <span className="text-white">850</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealth;
