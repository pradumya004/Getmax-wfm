// frontend/src/pages/admin/NotificationCenter.jsx - Master Admin Notification Management

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Send,
  Plus,
  Filter,
  Search,
  Eye,
  Trash2,
  Edit,
  RefreshCw,
  Clock,
  Users,
  Building,
  Globe,
  Settings,
  Target,
  MessageSquare,
  Mail,
  Smartphone,
  Calendar,
  Timer,
  Zap,
  Archive,
  Star,
  Flag,
  Download,
  Upload,
  Volume2,
  VolumeX,
  Power,
  PowerOff,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { masterAdminAPI } from "../../api/masterAdmin.api.js";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useApi } from "../../hooks/useApi.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import AnnouncementManager from "./AnnouncementManager.jsx";

const NotificationCenter = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [activeTab, setActiveTab] = useState("alerts");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    priority: "all",
    search: "",
  });

  // API hooks
  const {
    data: systemHealth,
    loading: healthLoading,
    execute: fetchSystemHealth,
  } = useApi(masterAdminAPI.getSystemHealth);

  useEffect(() => {
    loadNotificationData();
  }, []);

  const loadNotificationData = async () => {
    try {
      console.log("🔄 Loading notification data...");
      await fetchSystemHealth();
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
      toast.error("Failed to load notification data");
    }
  };

  const handleRefresh = () => {
    loadNotificationData();
    toast.success("Notifications refreshed!");
  };

  // Mock notification data
  const systemAlerts = [
    {
      id: 1,
      type: "critical",
      title: "High CPU Usage Detected",
      message: "System CPU usage has exceeded 90% for the past 15 minutes",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "active",
      priority: "high",
      source: "System Monitor",
      category: "performance",
      affected: "All Services",
      actions: ["View Details", "Acknowledge", "Escalate"],
    },
    {
      id: 2,
      type: "warning",
      title: "Database Connection Pool Warning",
      message: "Database connection pool is at 85% capacity",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: "acknowledged",
      priority: "medium",
      source: "Database Monitor",
      category: "database",
      affected: "Database Services",
      actions: ["View Details", "Resolve"],
    },
    {
      id: 3,
      type: "info",
      title: "Scheduled Maintenance Reminder",
      message: "Platform maintenance scheduled for tomorrow at 2:00 AM UTC",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "active",
      priority: "low",
      source: "Maintenance System",
      category: "maintenance",
      affected: "All Users",
      actions: ["View Schedule", "Notify Users"],
    },
    {
      id: 4,
      type: "success",
      title: "Backup Completed Successfully",
      message: "Daily system backup completed without errors",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "resolved",
      priority: "low",
      source: "Backup System",
      category: "backup",
      affected: "System Data",
      actions: ["View Report"],
    },
    {
      id: 5,
      type: "warning",
      title: "Unusual Login Activity",
      message: "Multiple failed login attempts detected from IP 192.168.1.100",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "investigating",
      priority: "high",
      source: "Security Monitor",
      category: "security",
      affected: "User Accounts",
      actions: ["Block IP", "Investigate", "Alert Security"],
    },
  ];

  const platformAnnouncements = [
    {
      id: 1,
      title: "New Feature Release: Advanced Analytics",
      message:
        "We've released new advanced analytics features for all enterprise customers",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: "feature",
      audience: "enterprise",
      status: "published",
      priority: "medium",
    },
    {
      id: 2,
      title: "API Rate Limit Changes",
      message: "Updated API rate limits will take effect next week",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: "api",
      audience: "all",
      status: "scheduled",
      priority: "high",
    },
    {
      id: 3,
      title: "Holiday Support Schedule",
      message: "Modified support hours during the holiday season",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: "support",
      audience: "all",
      status: "published",
      priority: "low",
    },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case "critical":
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "acknowledged":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "investigating":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
      case "resolved":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((notifId) => notifId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds =
      activeTab === "alerts"
        ? systemAlerts.map((alert) => alert.id)
        : platformAnnouncements.map((announcement) => announcement.id);

    setSelectedNotifications(
      selectedNotifications.length === allIds.length ? [] : allIds
    );
  };

  const handleBulkAction = (action) => {
    console.log(
      `Performing bulk action: ${action} on notifications:`,
      selectedNotifications
    );

    switch (action) {
      case "acknowledge":
        toast.success(
          `Acknowledged ${selectedNotifications.length} notifications`
        );
        break;
      case "resolve":
        toast.success(`Resolved ${selectedNotifications.length} notifications`);
        break;
      case "delete":
        toast.success(`Deleted ${selectedNotifications.length} notifications`);
        break;
      default:
        toast.info(
          `Performed ${action} on ${selectedNotifications.length} notifications`
        );
    }

    setSelectedNotifications([]);
  };

  const tabs = [
    {
      id: "alerts",
      label: "System Alerts",
      icon: AlertTriangle,
      count: systemAlerts.filter((a) => a.status === "active").length,
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: MessageSquare,
      count: platformAnnouncements.length,
    },
    { id: "settings", label: "Settings", icon: Settings, count: 0 },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>Notification Center - Master Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Bell className={`w-8 h-8 text-${theme.accent}`} />
              <h1 className="text-3xl font-bold text-white">
                Notification Center
              </h1>
            </div>
            <p className={`text-${theme.textSecondary}`}>
              Monitor system alerts and manage platform announcements
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </Button>
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

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-4 border-red-500/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Critical
                </p>
                <p className="text-xl font-bold text-white">
                  {systemAlerts.filter((a) => a.type === "critical").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-yellow-500/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>Warning</p>
                <p className="text-xl font-bold text-white">
                  {systemAlerts.filter((a) => a.type === "warning").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-blue-500/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>Info</p>
                <p className="text-xl font-bold text-white">
                  {systemAlerts.filter((a) => a.type === "info").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-green-500/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Resolved
                </p>
                <p className="text-xl font-bold text-white">
                  {systemAlerts.filter((a) => a.status === "resolved").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Card className="p-2">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${theme.secondary} text-white`
                    : `text-${theme.textSecondary} hover:bg-white/5 hover:text-white`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-white/20"
                        : `bg-${theme.accent}/20 text-${theme.accent}`
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${theme.textSecondary}`}
                />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className={`pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                />
              </div>

              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
                className={`px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
              >
                <option value="all">All Types</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priority: e.target.value }))
                }
                className={`px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className={`text-sm text-${theme.textSecondary}`}>
                  {selectedNotifications.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("acknowledge")}
                >
                  Acknowledge
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("resolve")}
                >
                  Resolve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Content based on active tab */}
        {activeTab === "alerts" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                System Alerts ({systemAlerts.length})
              </h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  {selectedNotifications.length === systemAlerts.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg ${theme.glass} border-l-4 ${
                    alert.type === "critical"
                      ? "border-red-500"
                      : alert.type === "warning"
                      ? "border-yellow-500"
                      : alert.type === "success"
                      ? "border-green-500"
                      : "border-blue-500"
                  } hover:bg-white/5 transition-colors`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(alert.id)}
                      onChange={() => handleSelectNotification(alert.id)}
                      className="mt-1 rounded"
                    />

                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1">
                            {alert.title}
                          </h4>
                          <p
                            className={`text-${theme.textSecondary} text-sm mb-2`}
                          >
                            {alert.message}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`text-${theme.textSecondary}`}>
                              <Clock className="w-3 h-3 inline mr-1" />
                              {formatTimestamp(alert.timestamp)}
                            </span>
                            <span className={`text-${theme.textSecondary}`}>
                              <Target className="w-3 h-3 inline mr-1" />
                              {alert.source}
                            </span>
                            <span className={getPriorityColor(alert.priority)}>
                              <Flag className="w-3 h-3 inline mr-1" />
                              {alert.priority} priority
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 ml-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(
                              alert.status
                            )}`}
                          >
                            {alert.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {alert.actions && alert.actions.length > 0 && (
                        <div className="flex items-center space-x-2 mt-3">
                          {alert.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                console.log(
                                  `Action: ${action} for alert ${alert.id}`
                                )
                              }
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "announcements" && <AnnouncementManager />}

        {/* {activeTab === "announcements" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Platform Announcements ({platformAnnouncements.length})
              </h3>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Announcement</span>
              </Button>
            </div>

            <div className="space-y-4">
              {platformAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-lg ${theme.glass} hover:bg-white/5 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">
                          {announcement.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                            announcement.priority
                          )} bg-current/20`}
                        >
                          {announcement.priority}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            announcement.status === "published"
                              ? "text-green-400 bg-green-400/20"
                              : announcement.status === "scheduled"
                              ? "text-yellow-400 bg-yellow-400/20"
                              : "text-gray-400 bg-gray-400/20"
                          }`}
                        >
                          {announcement.status}
                        </span>
                      </div>
                      <p className={`text-${theme.textSecondary} text-sm mb-3`}>
                        {announcement.message}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`text-${theme.textSecondary}`}>
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatTimestamp(announcement.timestamp)}
                        </span>
                        <span className={`text-${theme.textSecondary}`}>
                          <Users className="w-3 h-3 inline mr-1" />
                          {announcement.audience} users
                        </span>
                        <span className={`text-${theme.textSecondary}`}>
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          {announcement.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )} */}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Preferences */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Alert Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Critical Alerts</p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Immediate notification for critical issues
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Warning Alerts</p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Notifications for warning conditions
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Info Notifications</p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      General information updates
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      Email Notifications
                    </p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Send alerts via email
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </Card>

            {/* Delivery Channels */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Delivery Channels
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">
                        In-App Notifications
                      </p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        Dashboard notifications
                      </p>
                    </div>
                  </div>
                  <Power className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">Email Alerts</p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        Email notifications
                      </p>
                    </div>
                  </div>
                  <Power className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">SMS Alerts</p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        Critical alerts via SMS
                      </p>
                    </div>
                  </div>
                  <PowerOff className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">
                        Slack Integration
                      </p>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        Team notifications
                      </p>
                    </div>
                  </div>
                  <PowerOff className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        theme={theme}
      />
    </div>
  );
};

// Create Announcement Modal Component
const CreateAnnouncementModal = ({ isOpen, onClose, theme }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
    audience: "all",
    priority: "medium",
    scheduleDate: "",
    channels: ["in-app"],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating announcement:", formData);
    toast.success("Announcement created successfully!");
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`max-w-2xl w-full mx-4 ${theme.card} rounded-xl shadow-2xl border border-${theme.accent}/30`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Create Announcement
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-white/10 text-${theme.textSecondary} hover:text-white transition-colors`}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Announcement title..."
                className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
              >
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Announcement message..."
                rows={4}
                className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                >
                  <option value="general">General</option>
                  <option value="feature">Feature</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="security">Security</option>
                  <option value="api">API</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Audience
                </label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                >
                  <option value="all">All Users</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="professional">Professional</option>
                  <option value="basic">Basic</option>
                  <option value="admins">Company Admins</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="scheduleDate"
                  value={formData.scheduleDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                {formData.scheduleDate ? "Schedule" : "Send"} Announcement
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
