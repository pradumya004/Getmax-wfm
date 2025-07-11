import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  User,
  Users,
  Building,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Settings,
  Shield,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Plus,
  Database,
  Server,
  Globe,
  Mail,
  Phone,
  MapPin,
  Target,
  Zap,
  BarChart3,
  TrendingUp,
  Flag,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getTheme } from "../../lib/theme";

const AuditLogs = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [filters, setFilters] = useState({
    search: "",
    action: "",
    user: "",
    dateFrom: "",
    dateTo: "",
    severity: "",
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAuditLogs();

    const interval = setInterval(loadAuditLogs, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, filters]);

  const loadAuditLogs = async () => {
    try {
      console.log("Loading audit logs with filters:", filters);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAuditLogs();
    setRefreshing(false);
  };

  const handleExport = async () => {
    try {
      const exportData = auditLogs.map((log) => ({
        Timestamp: new Date(log.timestamp).toISOString(),
        Action: log.action,
        User: log.user || "System",
        Resource: log.resource,
        IP: log.ipAddress,
        Details: log.details,
        Status: log.status,
      }));

      const csv = [
        Object.keys(exportData[0]).join(","),
        ...exportData.map((row) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } catch (error) {
      console.error("Failed to export audit logs:", error);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      login: User,
      logout: User,
      create: Plus,
      update: Edit,
      delete: Trash2,
      view: Eye,
      export: Download,
      settings_change: Settings,
      security_event: Shield,
      system_event: Server,
      api_call: Globe,
    };
    return icons[action] || Activity;
  };

  const getStatusColor = (status) => {
    const colors = {
      success: "text-green-400 bg-green-400/20 border-green-400/30",
      warning: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      error: "text-red-400 bg-red-400/20 border-red-400/30",
      info: "text-blue-400 bg-blue-400/20 border-blue-400/30",
    };
    return colors[status] || colors.info;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "text-green-400",
      medium: "text-yellow-400",
      high: "text-red-400",
      critical: "text-purple-400",
    };
    return colors[severity] || colors.low;
  };

  // Mock audit logs data
  const auditLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      action: "login",
      user: "sriram@getmaxsolutions.com",
      userType: "master_admin",
      resource: "/master-admin/dashboard",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      details: "Master admin successful login",
      status: "success",
      severity: "low",
      metadata: {
        sessionId: "sess_12345",
        location: "New York, US",
      },
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      action: "update",
      user: "sriram@getmaxsolutions.com",
      userType: "master_admin",
      resource: "/api/master-admin/companies/comp123/status",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      details: "Company status changed from active to suspended",
      status: "success",
      severity: "medium",
      metadata: {
        companyId: "comp123",
        oldStatus: "active",
        newStatus: "suspended",
        reason: "Non-payment",
      },
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      action: "security_event",
      user: null,
      userType: "system",
      resource: "/api/auth/login",
      ipAddress: "203.0.113.195",
      userAgent: "curl/7.68.0",
      details: "Multiple failed login attempts detected",
      status: "error",
      severity: "high",
      metadata: {
        attempts: 5,
        targetUser: "admin@example.com",
        blocked: true,
      },
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      action: "create",
      user: "john.doe@techcorp.com",
      userType: "company_admin",
      resource: "/api/employees",
      ipAddress: "10.0.0.45",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      details: "New employee created: Jane Smith",
      status: "success",
      severity: "low",
      metadata: {
        employeeId: "EMP789",
        employeeName: "Jane Smith",
        department: "Engineering",
      },
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      action: "export",
      user: "admin@company.com",
      userType: "company_admin",
      resource: "/api/employees/export",
      ipAddress: "172.16.0.20",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      details: "Employee data exported (245 records)",
      status: "success",
      severity: "medium",
      metadata: {
        recordCount: 245,
        format: "csv",
        fileSize: "2.4MB",
      },
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: "settings_change",
      user: "sriram@getmaxsolutions.com",
      userType: "master_admin",
      resource: "/api/master-admin/settings",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      details: "Platform maintenance mode enabled",
      status: "success",
      severity: "high",
      metadata: {
        setting: "maintenanceMode",
        oldValue: false,
        newValue: true,
      },
    },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    if (
      filters.search &&
      !log.details.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.action && log.action !== filters.action) {
      return false;
    }
    if (
      filters.user &&
      log.user &&
      !log.user.toLowerCase().includes(filters.user.toLowerCase())
    ) {
      return false;
    }
    if (filters.severity && log.severity !== filters.severity) {
      return false;
    }
    return true;
  });

  const auditStats = {
    total: auditLogs.length,
    todayCount: auditLogs.filter((log) => {
      const today = new Date();
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === today.toDateString();
    }).length,
    errorCount: auditLogs.filter((log) => log.status === "error").length,
    criticalCount: auditLogs.filter((log) => log.severity === "critical")
      .length,
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
                Audit Logs
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Complete platform audit trail and activity monitoring
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="1h" className="bg-gray-800">
                  Last hour
                </option>
                <option value="24h" className="bg-gray-800">
                  Last 24 hours
                </option>
                <option value="7d" className="bg-gray-800">
                  Last 7 days
                </option>
                <option value="30d" className="bg-gray-800">
                  Last 30 days
                </option>
              </select>

              <button
                onClick={handleExport}
                className={`flex items-center space-x-2 px-4 py-2 border border-${theme.border} ${theme.glass} rounded-lg text-${theme.text} text-sm hover:bg-white/10 transition-colors`}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={handleRefresh}
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Total Events
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {auditStats.total}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Today's Events
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {auditStats.todayCount}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Error Events
                </p>
                <p className={`text-2xl font-bold text-red-400`}>
                  {auditStats.errorCount}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Critical Events
                </p>
                <p className={`text-2xl font-bold text-purple-400`}>
                  {auditStats.criticalCount}
                </p>
              </div>
              <Flag className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6 mb-6`}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${theme.textSecondary}`}
                />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className={`w-full pl-10 pr-4 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filters.action}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, action: e.target.value }))
                }
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="export">Export</option>
                <option value="settings_change">Settings Change</option>
                <option value="security_event">Security Event</option>
              </select>

              <select
                value={filters.severity}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, severity: e.target.value }))
                }
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <input
                type="text"
                placeholder="Filter by user..."
                value={filters.user}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, user: e.target.value }))
                }
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-red-500/50 min-w-[150px]`}
              />
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div
          className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b border-${theme.border}`}>
                <tr>
                  <th
                    className={`p-4 text-left text-${theme.text} font-semibold`}
                  >
                    Timestamp
                  </th>
                  <th
                    className={`p-4 text-left text-${theme.text} font-semibold`}
                  >
                    Action
                  </th>
                  <th
                    className={`p-4 text-left text-${theme.text} font-semibold`}
                  >
                    User
                  </th>
                  <th
                    className={`p-4 text-left text-${theme.text} font-semibold`}
                  >
                    Details
                  </th>
                  <th
                    className={`p-4 text-left text-${theme.text} font-semibold`}
                  >
                    Status
                  </th>
                  <th
                    className={`p-4 text-left text-${theme.text} font-semibold`}
                  >
                    Severity
                  </th>
                  <th
                    className={`p-4 text-left text-${theme.text} font-semibold`}
                  >
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const ActionIcon = getActionIcon(log.action);

                  return (
                    <tr
                      key={log.id}
                      className={`border-b border-${theme.border} hover:bg-white/5 transition-colors cursor-pointer`}
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock
                            className={`w-4 h-4 text-${theme.textSecondary}`}
                          />
                          <div>
                            <p
                              className={`text-${theme.text} text-sm font-medium`}
                            >
                              {log.timestamp.toLocaleTimeString()}
                            </p>
                            <p
                              className={`text-${theme.textSecondary} text-xs`}
                            >
                              {log.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <ActionIcon
                            className={`w-4 h-4 text-${theme.textSecondary}`}
                          />
                          <span
                            className={`text-${theme.text} text-sm font-medium capitalize`}
                          >
                            {log.action.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p
                            className={`text-${theme.text} text-sm font-medium`}
                          >
                            {log.user || "System"}
                          </p>
                          <p className={`text-${theme.textSecondary} text-xs`}>
                            {log.userType}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className={`text-${theme.text} text-sm`}>
                          {log.details}
                        </p>
                        <p
                          className={`text-${theme.textSecondary} text-xs truncate max-w-xs`}
                        >
                          {log.resource}
                        </p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-sm font-medium ${getSeverityColor(
                            log.severity
                          )}`}
                        >
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-${theme.text} text-sm font-mono`}
                        >
                          {log.ipAddress}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold text-${theme.text}`}>
                  Audit Log Details
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className={`p-2 hover:bg-white/10 rounded-lg transition-colors`}
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                    >
                      Action
                    </label>
                    <p className={`text-${theme.text} capitalize`}>
                      {selectedLog.action.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                    >
                      Timestamp
                    </label>
                    <p className={`text-${theme.text}`}>
                      {selectedLog.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                    >
                      User
                    </label>
                    <p className={`text-${theme.text}`}>
                      {selectedLog.user || "System"}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                    >
                      User Type
                    </label>
                    <p className={`text-${theme.text}`}>
                      {selectedLog.userType}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                    >
                      IP Address
                    </label>
                    <p className={`text-${theme.text} font-mono`}>
                      {selectedLog.ipAddress}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                    >
                      Status
                    </label>
                    <span
                      className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                        selectedLog.status
                      )}`}
                    >
                      {selectedLog.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                  >
                    Resource
                  </label>
                  <p className={`text-${theme.text} font-mono`}>
                    {selectedLog.resource}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                  >
                    Details
                  </label>
                  <p className={`text-${theme.text}`}>{selectedLog.details}</p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                  >
                    User Agent
                  </label>
                  <p
                    className={`text-${theme.textSecondary} text-sm font-mono break-all`}
                  >
                    {selectedLog.userAgent}
                  </p>
                </div>

                {selectedLog.metadata && (
                  <div>
                    <label
                      className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                    >
                      Additional Data
                    </label>
                    <pre
                      className={`text-${theme.text} text-sm bg-black/20 p-3 rounded border border-${theme.border} overflow-x-auto`}
                    >
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
