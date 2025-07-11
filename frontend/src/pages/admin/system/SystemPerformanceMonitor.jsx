import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Server,
  Database,
  Wifi,
  Shield,
  Cpu,
  HardDrive,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Monitor,
  Globe,
  Users,
  Eye,
  Bell,
} from "lucide-react";

const SystemPerformanceMonitor = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [alertsVisible, setAlertsVisible] = useState(true);

  const theme = {
    primary: "from-slate-900 via-gray-900 to-black",
    secondary: "from-red-600 to-orange-600",
    text: "white",
    textSecondary: "white/70",
    border: "white/10",
    glass: "bg-white/5 backdrop-blur-xl border-white/10",
    button:
      "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const systemMetrics = {
    server: {
      status: "online",
      uptime: "99.98%",
      responseTime: 145,
      cpu: 23.5,
      memory: 67.2,
      disk: 42.1,
      load: 1.2,
    },
    database: {
      status: "healthy",
      connections: 234,
      queries: 15678,
      slowQueries: 3,
      size: "2.4TB",
      backupStatus: "completed",
    },
    api: {
      status: "operational",
      requests: 147892,
      errors: 12,
      errorRate: 0.008,
      averageLatency: 178,
      throughput: 1250,
    },
    cdn: {
      status: "fast",
      hitRate: 94.5,
      bandwidth: "1.2GB",
      requests: 89234,
      cacheSize: "450MB",
    },
    security: {
      status: "protected",
      threats: 0,
      blocked: 45,
      firewallStatus: "active",
      sslStatus: "valid",
    },
  };

  const alerts = [
    {
      id: 1,
      type: "warning",
      service: "Database",
      message: "Slow query detected on user_activity table",
      time: "2 minutes ago",
      severity: "medium",
    },
    {
      id: 2,
      type: "info",
      service: "API",
      message: "Rate limiting applied to client 192.168.1.100",
      time: "5 minutes ago",
      severity: "low",
    },
    {
      id: 3,
      type: "success",
      service: "Backup",
      message: "Daily backup completed successfully",
      time: "1 hour ago",
      severity: "info",
    },
  ];

  const performanceData = [
    { time: "00:00", cpu: 15, memory: 45, requests: 1200 },
    { time: "04:00", cpu: 12, memory: 42, requests: 800 },
    { time: "08:00", cpu: 28, memory: 55, requests: 2100 },
    { time: "12:00", cpu: 35, memory: 68, requests: 3200 },
    { time: "16:00", cpu: 42, memory: 72, requests: 3800 },
    { time: "20:00", cpu: 38, memory: 65, requests: 2900 },
  ];

  const getStatusColor = (status) => {
    const colors = {
      online: "text-green-400 bg-green-400/20",
      healthy: "text-green-400 bg-green-400/20",
      operational: "text-green-400 bg-green-400/20",
      fast: "text-blue-400 bg-blue-400/20",
      protected: "text-purple-400 bg-purple-400/20",
      warning: "text-yellow-400 bg-yellow-400/20",
      error: "text-red-400 bg-red-400/20",
    };
    return colors[status] || colors.operational;
  };

  const getAlertColor = (type) => {
    const colors = {
      success: "border-green-500/30 bg-green-500/10",
      warning: "border-yellow-500/30 bg-yellow-500/10",
      error: "border-red-500/30 bg-red-500/10",
      info: "border-blue-500/30 bg-blue-500/10",
    };
    return colors[type] || colors.info;
  };

  const getAlertIcon = (type) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertTriangle,
      info: Bell,
    };
    return icons[type] || Bell;
  };

  const MetricCard = ({
    title,
    value,
    status,
    icon: Icon,
    unit = "",
    trend,
  }) => (
    <div
      className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-${theme.text} font-semibold`}>{title}</h3>
        <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl font-bold text-${theme.text}`}>
            {value}
            {unit}
          </p>
          <p className={`text-${theme.textSecondary} text-sm capitalize`}>
            {status}
          </p>
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 ${
              trend > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const SimpleLineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map((d) => d.cpu));

    return (
      <div className="space-y-4">
        <h4 className={`text-${theme.text} font-medium`}>{title}</h4>
        <div className="h-32 flex items-end justify-between">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className="w-8 bg-gradient-to-t from-red-600 to-orange-500 rounded-t"
                style={{
                  height: `${(item.cpu / maxValue) * 100}px`,
                  minHeight: "4px",
                }}
              />
              <span className={`text-${theme.textSecondary} text-xs`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} text-${theme.text}`}
    >
      {/* Header */}
      <div
        className={`top-0 z-40 ${theme.glass} backdrop-blur-xl border-b border-${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent`}
              >
                System Performance Monitor
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Real-time monitoring of all platform systems
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="15m" className="bg-gray-800">
                  Last 15 minutes
                </option>
                <option value="1h" className="bg-gray-800">
                  Last hour
                </option>
                <option value="6h" className="bg-gray-800">
                  Last 6 hours
                </option>
                <option value="24h" className="bg-gray-800">
                  Last 24 hours
                </option>
              </select>

              <button
                onClick={() => {}}
                className={`flex items-center space-x-2 px-4 py-2 border border-${theme.border} ${theme.glass} rounded-lg text-${theme.text} text-sm hover:bg-white/10 transition-colors`}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={() => setRefreshing(true)}
                disabled={refreshing}
                className={`flex items-center space-x-2 px-4 py-2 ${theme.button} rounded-lg text-sm transition-colors disabled:opacity-50`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Server"
            value={systemMetrics.server.uptime}
            status={systemMetrics.server.status}
            icon={Server}
            trend={2.1}
          />
          <MetricCard
            title="Database"
            value={systemMetrics.database.connections}
            status={systemMetrics.database.status}
            icon={Database}
            trend={-1.2}
          />
          <MetricCard
            title="API"
            value={systemMetrics.api.errorRate}
            status={systemMetrics.api.status}
            icon={Activity}
            unit="%"
            trend={-5.3}
          />
          <MetricCard
            title="CDN"
            value={systemMetrics.cdn.hitRate}
            status={systemMetrics.cdn.status}
            icon={Wifi}
            unit="%"
            trend={1.8}
          />
          <MetricCard
            title="Security"
            value={systemMetrics.security.threats}
            status={systemMetrics.security.status}
            icon={Shield}
            trend={-100}
          />
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Server Metrics */}
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
              Server Performance
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-4 ${theme.glass} rounded-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-${theme.textSecondary} text-sm`}>
                    CPU Usage
                  </span>
                  <Cpu className="w-4 h-4 text-blue-400" />
                </div>
                <p className={`text-xl font-bold text-${theme.text}`}>
                  {systemMetrics.server.cpu}%
                </p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${systemMetrics.server.cpu}%` }}
                  />
                </div>
              </div>

              <div className={`p-4 ${theme.glass} rounded-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-${theme.textSecondary} text-sm`}>
                    Memory
                  </span>
                  <HardDrive className="w-4 h-4 text-green-400" />
                </div>
                <p className={`text-xl font-bold text-${theme.text}`}>
                  {systemMetrics.server.memory}%
                </p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${systemMetrics.server.memory}%` }}
                  />
                </div>
              </div>
            </div>

            <SimpleLineChart data={performanceData} title="CPU Usage Trend" />
          </div>

          {/* API Metrics */}
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
              API Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Total Requests
                </span>
                <span className={`text-${theme.text} font-semibold`}>
                  {systemMetrics.api.requests.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Error Rate
                </span>
                <span className="text-green-400 font-semibold">
                  {systemMetrics.api.errorRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Avg Latency
                </span>
                <span className={`text-${theme.text} font-semibold`}>
                  {systemMetrics.api.averageLatency}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Throughput
                </span>
                <span className={`text-${theme.text} font-semibold`}>
                  {systemMetrics.api.throughput} req/s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Active Errors
                </span>
                <span className="text-yellow-400 font-semibold">
                  {systemMetrics.api.errors}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts and Database Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* System Alerts */}
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                System Alerts
              </h3>
              <button
                onClick={() => setAlertsVisible(!alertsVisible)}
                className={`text-${theme.textSecondary} hover:text-${theme.text} transition-colors`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {alertsVisible && (
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const IconComponent = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${getAlertColor(
                        alert.type
                      )}`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className="w-5 h-5 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-${theme.text} font-medium text-sm`}
                            >
                              {alert.service}
                            </span>
                            <span
                              className={`text-${theme.textSecondary} text-xs`}
                            >
                              {alert.time}
                            </span>
                          </div>
                          <p className={`text-${theme.textSecondary} text-sm`}>
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Database Stats */}
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
              Database Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Active Connections
                </span>
                <span className={`text-${theme.text} font-semibold`}>
                  {systemMetrics.database.connections}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Queries/sec
                </span>
                <span className={`text-${theme.text} font-semibold`}>
                  {systemMetrics.database.queries.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Slow Queries
                </span>
                <span className="text-yellow-400 font-semibold">
                  {systemMetrics.database.slowQueries}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Database Size
                </span>
                <span className={`text-${theme.text} font-semibold`}>
                  {systemMetrics.database.size}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-${theme.textSecondary}`}>
                  Backup Status
                </span>
                <span className="text-green-400 font-semibold capitalize">
                  {systemMetrics.database.backupStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/master-admin/monitoring/logs")}
              className={`p-4 border border-${theme.border} ${theme.glass} rounded-lg text-left hover:bg-white/10 transition-colors group`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <div>
                  <p className={`text-${theme.text} font-medium`}>View Logs</p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    System logs
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/master-admin/monitoring/alerts")}
              className={`p-4 border border-${theme.border} ${theme.glass} rounded-lg text-left hover:bg-white/10 transition-colors group`}
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className={`text-${theme.text} font-medium`}>
                    Alert Settings
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Configure alerts
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/master-admin/monitoring/backup")}
              className={`p-4 border border-${theme.border} ${theme.glass} rounded-lg text-left hover:bg-white/10 transition-colors group`}
            >
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-green-400" />
                <div>
                  <p className={`text-${theme.text} font-medium`}>Backup</p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Database backup
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/master-admin/settings")}
              className={`p-4 border border-${theme.border} ${theme.glass} rounded-lg text-left hover:bg-white/10 transition-colors group`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-purple-400" />
                <div>
                  <p className={`text-${theme.text} font-medium`}>Settings</p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    System config
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPerformanceMonitor;
