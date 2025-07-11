import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  MapPin,
  Clock,
  User,
  Users,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Search,
  Ban,
  UserX,
  Key,
  Fingerprint,
  Smartphone,
  Monitor,
  Wifi,
  Server,
  Database,
  Settings,
  Bell,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  FileText,
  Flag,
  Mail,
  Plus,
  Phone,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useMasterAdmin } from "../../hooks/useMasterAdmin.jsx";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";

const SecurityCenter = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const { systemHealth, loadSystemHealth } = useMasterAdmin();

  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [eventFilters, setEventFilters] = useState({
    severity: "",
    type: "",
    search: "",
  });
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  useEffect(() => {
    loadSecurityData();

    const interval = setInterval(loadSecurityData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const loadSecurityData = async () => {
    try {
      await loadSystemHealth();
    } catch (error) {
      console.error("Failed to load security data:", error);
      toast.error("Failed to load security data");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSecurityData();
    setRefreshing(false);
    toast.success("Security data refreshed!");
  };

  const securityMetrics = {
    threatLevel: "low",
    activeThreats: 0,
    blockedAttempts: 156,
    failedLogins: 23,
    suspiciousIPs: 8,
    activeSessions: 1247,
    mfaEnabled: 892,
    securityScore: 94.5,
  };

  const securityEvents = [
    {
      id: 1,
      type: "failed_login",
      severity: "medium",
      user: "unknown",
      ip: "192.168.1.100",
      location: "New York, US",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      description: "Multiple failed login attempts",
      count: 5,
    },
    {
      id: 2,
      type: "suspicious_activity",
      severity: "high",
      user: "john.doe@techcorp.com",
      ip: "10.0.0.45",
      location: "Unknown",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      description: "Unusual access pattern detected",
      count: 1,
    },
    {
      id: 3,
      type: "blocked_ip",
      severity: "low",
      user: null,
      ip: "203.0.113.195",
      location: "Russia",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      description: "IP blocked due to repeated violations",
      count: 1,
    },
    {
      id: 4,
      type: "password_policy_violation",
      severity: "medium",
      user: "jane.smith@company.com",
      ip: "172.16.0.10",
      location: "California, US",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      description: "Weak password detected",
      count: 1,
    },
    {
      id: 5,
      type: "mfa_bypass_attempt",
      severity: "high",
      user: "admin@example.com",
      ip: "198.51.100.42",
      location: "Unknown",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      description: "Attempt to bypass MFA",
      count: 3,
    },
  ];

  const accessViolations = [
    {
      id: 1,
      user: "john.doe@techcorp.com",
      action: "Attempted to access admin panel",
      resource: "/master-admin/companies",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      ip: "192.168.1.50",
    },
    {
      id: 2,
      user: "jane.smith@company.com",
      action: "Tried to export sensitive data",
      resource: "/api/employees/export",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      ip: "10.0.0.75",
    },
    {
      id: 3,
      user: "mike.johnson@global.com",
      action: "Invalid API key usage",
      resource: "/api/master-admin/stats",
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      ip: "172.16.0.20",
    },
  ];

  const blockedIPs = [
    {
      ip: "203.0.113.195",
      location: "Russia",
      reason: "Brute force attacks",
      blockedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      attempts: 47,
    },
    {
      ip: "198.51.100.42",
      location: "China",
      reason: "Suspicious activity",
      blockedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      attempts: 23,
    },
    {
      ip: "192.0.2.146",
      location: "Unknown",
      reason: "Malware detected",
      blockedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      attempts: 12,
    },
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      low: "text-green-400 bg-green-400/20 border-green-400/30",
      medium: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      high: "text-red-400 bg-red-400/20 border-red-400/30",
      critical: "text-purple-400 bg-purple-400/20 border-purple-400/30",
    };
    return colors[severity] || colors.low;
  };

  const getEventIcon = (type) => {
    const icons = {
      failed_login: Lock,
      suspicious_activity: AlertTriangle,
      blocked_ip: Ban,
      password_policy_violation: Key,
      mfa_bypass_attempt: Shield,
      access_violation: UserX,
    };
    return icons[type] || AlertTriangle;
  };

  const SecurityMetricCard = ({
    title,
    value,
    trend,
    icon: Icon,
    status = "good",
  }) => {
    const statusColors = {
      good: "text-green-400",
      warning: "text-yellow-400",
      danger: "text-red-400",
    };

    return (
      <Card theme={userType} className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-${theme.textSecondary} text-sm`}>{title}</p>
            <p className={`text-2xl font-bold text-${theme.text}`}>{value}</p>
            {trend && (
              <div className="flex items-center space-x-1 mt-1">
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-400" />
                )}
                <span
                  className={`text-sm ${
                    trend > 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {Math.abs(trend)}%
                </span>
              </div>
            )}
          </div>
          <div
            className={`p-3 rounded-lg ${
              status === "good"
                ? "bg-green-500/20"
                : status === "warning"
                ? "bg-yellow-500/20"
                : "bg-red-500/20"
            }`}
          >
            <Icon className={`w-6 h-6 ${statusColors[status]}`} />
          </div>
        </div>
      </Card>
    );
  };

  const SecurityEventItem = ({ event, onClick }) => {
    const IconComponent = getEventIcon(event.type);

    return (
      <div
        onClick={() => onClick(event)}
        className={`p-4 border border-${theme.border} rounded-lg cursor-pointer hover:bg-white/5 transition-colors`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-${theme.text} font-medium text-sm`}>
                {event.description}
              </span>
              <span className={`text-${theme.textSecondary} text-xs`}>
                {event.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span className={`text-${theme.textSecondary}`}>
                IP: {event.ip}
              </span>
              <span className={`text-${theme.textSecondary}`}>
                Location: {event.location}
              </span>
              {event.user && (
                <span className={`text-${theme.textSecondary}`}>
                  User: {event.user}
                </span>
              )}
              {event.count > 1 && (
                <span className="text-red-400">{event.count}x</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
    setShowIncidentModal(true);
  };

  const handleBlockIP = async (ip) => {
    try {
      console.log(`Blocking IP: ${ip}`);
      toast.success(`IP ${ip} has been blocked`);
    } catch (error) {
      console.error(`Failed to block IP: ${error}`);
      toast.error("Failed to block IP");
    }
  };

  const handleUnblockIP = async (ip) => {
    try {
      console.log(`Unblocking IP: ${ip}`);
      toast.success(`IP ${ip} has been unblocked`);
    } catch (error) {
      console.error(`Failed to unblock IP: ${error}`);
      toast.error("Failed to unblock IP");
    }
  };

  const handleEventFilterChange = (key, value) => {
    setEventFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} text-${theme.text}`}
    >
      <Helmet>
        <title>Security Center | Master Admin</title>
      </Helmet>

      {/* Header */}
      <div
        className={`sticky top-0 z-40 ${theme.glass} backdrop-blur-xl border-b border-${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent`}
              >
                Security Center
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Platform security monitoring and threat management
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    securityMetrics.threatLevel === "low"
                      ? "bg-green-400"
                      : securityMetrics.threatLevel === "medium"
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                ></div>
                <span
                  className={`text-sm ${
                    securityMetrics.threatLevel === "low"
                      ? "text-green-400"
                      : securityMetrics.threatLevel === "medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  Threat Level: {securityMetrics.threatLevel.toUpperCase()}
                </span>
              </div>

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

              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Security Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SecurityMetricCard
            title="Security Score"
            value={`${securityMetrics.securityScore}%`}
            trend={2.1}
            icon={Shield}
            status="good"
          />
          <SecurityMetricCard
            title="Active Threats"
            value={securityMetrics.activeThreats}
            trend={-12.5}
            icon={AlertTriangle}
            status={securityMetrics.activeThreats > 0 ? "danger" : "good"}
          />
          <SecurityMetricCard
            title="Blocked Attempts"
            value={securityMetrics.blockedAttempts}
            trend={-8.3}
            icon={Ban}
            status="good"
          />
          <SecurityMetricCard
            title="Failed Logins"
            value={securityMetrics.failedLogins}
            trend={-15.2}
            icon={Lock}
            status={securityMetrics.failedLogins > 50 ? "warning" : "good"}
          />
        </div>

        {/* Security Tabs */}
        <div className="flex items-center space-x-1 mb-6">
          {[
            { id: "overview", label: "Overview", icon: Shield },
            { id: "events", label: "Security Events", icon: AlertTriangle },
            { id: "access", label: "Access Control", icon: Lock },
            { id: "blocked", label: "Blocked IPs", icon: Ban },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? `${theme.button}`
                    : `text-${theme.textSecondary} hover:text-${theme.text} hover:bg-white/5`
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Security Status */}
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
                System Security Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className={`text-${theme.text}`}>Firewall</span>
                  </div>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-green-400" />
                    <span className={`text-${theme.text}`}>
                      SSL Certificate
                    </span>
                  </div>
                  <span className="text-green-400 font-medium">Valid</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-green-400" />
                    <span className={`text-${theme.text}`}>Encryption</span>
                  </div>
                  <span className="text-green-400 font-medium">AES-256</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-green-400" />
                    <span className={`text-${theme.text}`}>
                      Database Security
                    </span>
                  </div>
                  <span className="text-green-400 font-medium">Protected</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-yellow-400" />
                    <span className={`text-${theme.text}`}>
                      Intrusion Detection
                    </span>
                  </div>
                  <span className="text-yellow-400 font-medium">
                    Monitoring
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Security Events */}
            <Card theme={userType} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold text-${theme.text}`}>
                  Recent Security Events
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  theme={userType}
                  onClick={() => setActiveTab("events")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {securityEvents.slice(0, 4).map((event) => (
                  <SecurityEventItem
                    key={event.id}
                    event={event}
                    onClick={handleViewIncident}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid grid-cols-1 gap-6">
            {/* Filters */}
            <Card theme={userType} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${theme.textSecondary}`}
                    />
                    <Input
                      placeholder="Search security events..."
                      theme={userType}
                      className="pl-10"
                      value={eventFilters.search}
                      onChange={(e) =>
                        handleEventFilterChange("search", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Select
                  label="Severity"
                  theme={userType}
                  value={eventFilters.severity}
                  onChange={(e) =>
                    handleEventFilterChange("severity", e.target.value)
                  }
                  options={[
                    { value: "", label: "All Severities" },
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "critical", label: "Critical" },
                  ]}
                />
                <Select
                  label="Type"
                  theme={userType}
                  value={eventFilters.type}
                  onChange={(e) =>
                    handleEventFilterChange("type", e.target.value)
                  }
                  options={[
                    { value: "", label: "All Types" },
                    { value: "failed_login", label: "Failed Login" },
                    {
                      value: "suspicious_activity",
                      label: "Suspicious Activity",
                    },
                    { value: "blocked_ip", label: "Blocked IP" },
                  ]}
                />
              </div>
            </Card>

            {/* Security Events List */}
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
                Security Events
              </h3>
              <div className="space-y-4">
                {securityEvents
                  .filter((event) =>
                    event.description
                      .toLowerCase()
                      .includes(eventFilters.search.toLowerCase())
                  )
                  .filter((event) =>
                    eventFilters.severity
                      ? event.severity === eventFilters.severity
                      : true
                  )
                  .filter((event) =>
                    eventFilters.type ? event.type === eventFilters.type : true
                  )
                  .map((event) => (
                    <SecurityEventItem
                      key={event.id}
                      event={event}
                      onClick={handleViewIncident}
                    />
                  ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "access" && (
          <Card theme={userType} className="p-6">
            <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
              Access Control Violations
            </h3>
            <div className="space-y-4">
              {accessViolations.map((violation) => (
                <div
                  key={violation.id}
                  className={`p-4 border border-${theme.border} rounded-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-${theme.text} font-medium`}>
                      {violation.action}
                    </span>
                    <span className={`text-${theme.textSecondary} text-sm`}>
                      {violation.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`text-${theme.textSecondary}`}>
                      User: {violation.user}
                    </span>
                    <span className={`text-${theme.textSecondary}`}>
                      Resource: {violation.resource}
                    </span>
                    <span className={`text-${theme.textSecondary}`}>
                      IP: {violation.ip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "blocked" && (
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Blocked IP Addresses
              </h3>
              <Button variant="outline" size="sm" theme={userType}>
                <Plus className="w-4 h-4 mr-2" />
                Block IP
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b border-${theme.border}`}>
                  <tr>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      IP Address
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Location
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Reason
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Attempts
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Blocked At
                    </th>
                    <th
                      className={`p-4 text-left text-${theme.text} font-semibold`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {blockedIPs.map((blockedIP, index) => (
                    <tr
                      key={index}
                      className={`border-b border-${theme.border} hover:bg-white/5`}
                    >
                      <td className="p-4">
                        <span className={`text-${theme.text} font-mono`}>
                          {blockedIP.ip}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-${theme.textSecondary}`}>
                          {blockedIP.location}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-${theme.textSecondary}`}>
                          {blockedIP.reason}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-red-400 font-medium">
                          {blockedIP.attempts}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-${theme.textSecondary}`}>
                          {blockedIP.blockedAt.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          theme={userType}
                          onClick={() => handleUnblockIP(blockedIP.ip)}
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Unblock
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Incident Detail Modal */}
      <Modal
        isOpen={showIncidentModal}
        onClose={() => setShowIncidentModal(false)}
        title="Security Incident Details"
        size="max-w-2xl"
      >
        {selectedIncident && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                >
                  Incident Type
                </label>
                <p className={`text-${theme.text}`}>
                  {selectedIncident.type.replace("_", " ")}
                </p>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                >
                  Severity
                </label>
                <span
                  className={`px-2 py-1 rounded text-xs ${getSeverityColor(
                    selectedIncident.severity
                  )}`}
                >
                  {selectedIncident.severity.toUpperCase()}
                </span>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                >
                  IP Address
                </label>
                <p className={`text-${theme.text} font-mono`}>
                  {selectedIncident.ip}
                </p>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                >
                  Location
                </label>
                <p className={`text-${theme.text}`}>
                  {selectedIncident.location}
                </p>
              </div>
              {selectedIncident.user && (
                <div className="col-span-2">
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                  >
                    User
                  </label>
                  <p className={`text-${theme.text}`}>
                    {selectedIncident.user}
                  </p>
                </div>
              )}
              <div className="col-span-2">
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-1`}
                >
                  Description
                </label>
                <p className={`text-${theme.text}`}>
                  {selectedIncident.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 justify-end">
              <Button
                variant="outline"
                theme={userType}
                onClick={() => handleBlockIP(selectedIncident.ip)}
              >
                <Ban className="w-4 h-4 mr-2" />
                Block IP
              </Button>
              <Button
                variant="primary"
                theme={userType}
                onClick={() => setShowIncidentModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SecurityCenter;
