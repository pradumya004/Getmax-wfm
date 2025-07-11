import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Activity,
  Users,
  Clock,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  User,
  Building,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Zap,
  Database,
  Server,
  Wifi,
  Bell,
  Settings,
  Mail,
  Phone,
  Flag,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useMasterAdmin } from "../../../hooks/useMasterAdmin.jsx";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";

const UserActivityMonitoring = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const { companies, employees, loadCompanies, loadEmployees } =
    useMasterAdmin();

  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    company: "",
    userType: "",
    status: "",
  });

  useEffect(() => {
    loadActivityData();

    const interval = setInterval(loadActivityData, 60000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const loadActivityData = async () => {
    try {
      await Promise.all([loadCompanies(), loadEmployees()]);
    } catch (error) {
      console.error("Failed to load activity data:", error);
      toast.error("Failed to load activity data");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadActivityData();
    setRefreshing(false);
    toast.success("Activity data refreshed!");
  };

  // Mock activity data
  const activityStats = {
    totalUsers: 8742,
    activeToday: 6234,
    activeThisWeek: 7891,
    activeThisMonth: 8542,
    averageSessionTime: "45m 32s",
    totalSessions: 15678,
    mobileUsers: 3456,
    desktopUsers: 5286,
    bounceRate: 12.5,
    retentionRate: 87.3,
  };

  const loginPatterns = [
    { hour: "00:00", logins: 23, unique: 18 },
    { hour: "02:00", logins: 12, unique: 10 },
    { hour: "04:00", logins: 8, unique: 7 },
    { hour: "06:00", logins: 45, unique: 38 },
    { hour: "08:00", logins: 234, unique: 198 },
    { hour: "09:00", logins: 567, unique: 456 },
    { hour: "10:00", logins: 434, unique: 367 },
    { hour: "11:00", logins: 389, unique: 321 },
    { hour: "12:00", logins: 278, unique: 234 },
    { hour: "13:00", logins: 234, unique: 198 },
    { hour: "14:00", logins: 345, unique: 289 },
    { hour: "15:00", logins: 289, unique: 245 },
    { hour: "16:00", logins: 234, unique: 198 },
    { hour: "17:00", logins: 198, unique: 167 },
    { hour: "18:00", logins: 123, unique: 98 },
    { hour: "20:00", logins: 67, unique: 54 },
    { hour: "22:00", logins: 34, unique: 28 },
  ];

  const topLocations = [
    { country: "United States", users: 3456, percentage: 39.5 },
    { country: "Canada", users: 1234, percentage: 14.1 },
    { country: "United Kingdom", users: 987, percentage: 11.3 },
    { country: "Germany", users: 756, percentage: 8.6 },
    { country: "France", users: 543, percentage: 6.2 },
    { country: "Australia", users: 432, percentage: 4.9 },
    { country: "Japan", users: 321, percentage: 3.7 },
    { country: "Others", users: 1013, percentage: 11.6 },
  ];

  const activeUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@techcorp.com",
      company: "TechCorp Solutions",
      lastActive: new Date(Date.now() - 5 * 60 * 1000),
      sessionTime: "2h 15m",
      location: "New York, US",
      device: "Desktop - Chrome",
      ip: "192.168.1.100",
      status: "online",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@digitalinnovations.com",
      company: "Digital Innovations",
      lastActive: new Date(Date.now() - 12 * 60 * 1000),
      sessionTime: "1h 45m",
      location: "California, US",
      device: "Mobile - Safari",
      ip: "10.0.0.45",
      status: "online",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@globalmanufacturing.com",
      company: "Global Manufacturing",
      lastActive: new Date(Date.now() - 8 * 60 * 1000),
      sessionTime: "3h 22m",
      location: "Toronto, CA",
      device: "Desktop - Firefox",
      ip: "172.16.0.20",
      status: "online",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.williams@creativeagency.com",
      company: "Creative Agency",
      lastActive: new Date(Date.now() - 25 * 60 * 1000),
      sessionTime: "45m",
      location: "London, UK",
      device: "Desktop - Edge",
      ip: "203.0.113.45",
      status: "idle",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@financeexperts.com",
      company: "Finance Experts",
      lastActive: new Date(Date.now() - 35 * 60 * 1000),
      sessionTime: "1h 12m",
      location: "Sydney, AU",
      device: "Mobile - Chrome",
      ip: "198.51.100.75",
      status: "idle",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      online: "text-green-400 bg-green-400/20",
      idle: "text-yellow-400 bg-yellow-400/20",
      offline: "text-gray-400 bg-gray-400/20",
    };
    return colors[status] || colors.offline;
  };

  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes("mobile")) {
      return Smartphone;
    }
    return Monitor;
  };

  const MetricCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    format = "number",
  }) => {
    const formatValue = (val) => {
      if (format === "percentage") return `${val}%`;
      if (format === "time") return val;
      return typeof val === "number" ? val.toLocaleString() : val;
    };

    const trendColor = trend === "up" ? "text-green-400" : "text-red-400";
    const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

    return (
      <Card theme={userType} className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-${theme.textSecondary} text-sm`}>{title}</p>
            <p className={`text-2xl font-bold text-${theme.text}`}>
              {formatValue(value)}
            </p>
            {change && (
              <div className="flex items-center space-x-1 mt-1">
                <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                <span className={`${trendColor} text-sm`}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </Card>
    );
  };

  const LoginChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map((d) => d.logins));

    return (
      <div className="space-y-4">
        <h4 className={`text-${theme.text} font-medium`}>{title}</h4>
        <div className="h-48 flex items-end justify-between space-x-1">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 flex-1"
            >
              <div className="flex flex-col items-center space-y-1">
                <span className={`text-${theme.textSecondary} text-xs`}>
                  {item.logins}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t"
                  style={{
                    height: `${(item.logins / maxValue) * 140}px`,
                    minHeight: "4px",
                  }}
                />
              </div>
              <span
                className={`text-${theme.textSecondary} text-xs text-center`}
              >
                {item.hour.split(":")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const filteredUsers = activeUsers.filter((user) => {
    if (
      filters.search &&
      !user.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !user.email.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.company &&
      !user.company.toLowerCase().includes(filters.company.toLowerCase())
    ) {
      return false;
    }
    if (filters.status && user.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} text-${theme.text}`}
    >
      <Helmet>
        <title>User Activity Monitoring | Master Admin</title>
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
                User Activity Monitoring
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Track user engagement, login patterns, and platform usage
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="24h" className="bg-gray-800">
                  Last 24 hours
                </option>
                <option value="7d" className="bg-gray-800">
                  Last 7 days
                </option>
                <option value="30d" className="bg-gray-800">
                  Last 30 days
                </option>
                <option value="90d" className="bg-gray-800">
                  Last 90 days
                </option>
              </select>

              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={() => {}}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button
                variant="primary"
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Today"
            value={activityStats.activeToday}
            change={5.2}
            trend="up"
            icon={Users}
          />
          <MetricCard
            title="Total Sessions"
            value={activityStats.totalSessions}
            change={8.1}
            trend="up"
            icon={Activity}
          />
          <MetricCard
            title="Avg Session Time"
            value={activityStats.averageSessionTime}
            change={12.3}
            trend="up"
            icon={Clock}
            format="time"
          />
          <MetricCard
            title="Retention Rate"
            value={activityStats.retentionRate}
            change={-2.1}
            trend="down"
            icon={Target}
            format="percentage"
          />
        </div>

        {/* Activity Tabs */}
        <div className="flex items-center space-x-1 mb-6">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "patterns", label: "Login Patterns", icon: Clock },
            { id: "locations", label: "Geographic Data", icon: Globe },
            { id: "active", label: "Active Users", icon: Users },
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
            {/* User Engagement Overview */}
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
                User Engagement
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-${theme.textSecondary}`}>
                    Daily Active Users
                  </span>
                  <span className={`text-${theme.text} font-medium`}>
                    {activityStats.activeToday.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-${theme.textSecondary}`}>
                    Weekly Active Users
                  </span>
                  <span className={`text-${theme.text} font-medium`}>
                    {activityStats.activeThisWeek.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-${theme.textSecondary}`}>
                    Monthly Active Users
                  </span>
                  <span className={`text-${theme.text} font-medium`}>
                    {activityStats.activeThisMonth.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-${theme.textSecondary}`}>
                    Bounce Rate
                  </span>
                  <span className="text-yellow-400 font-medium">
                    {activityStats.bounceRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-${theme.textSecondary}`}>
                    Retention Rate
                  </span>
                  <span className="text-green-400 font-medium">
                    {activityStats.retentionRate}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Device Breakdown */}
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
                Device Usage
              </h3>
              <div className="space-y-4">
                <div className={`p-4 ${theme.glass} rounded-lg`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Monitor className="w-5 h-5 text-blue-400" />
                      <span className={`text-${theme.text} font-medium`}>
                        Desktop
                      </span>
                    </div>
                    <span className={`text-${theme.text} font-medium`}>
                      {activityStats.desktopUsers.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (activityStats.desktopUsers /
                            activityStats.totalUsers) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-${theme.textSecondary} text-sm`}>
                      {(
                        (activityStats.desktopUsers /
                          activityStats.totalUsers) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>

                <div className={`p-4 ${theme.glass} rounded-lg`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-green-400" />
                      <span className={`text-${theme.text} font-medium`}>
                        Mobile
                      </span>
                    </div>
                    <span className={`text-${theme.text} font-medium`}>
                      {activityStats.mobileUsers.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (activityStats.mobileUsers /
                            activityStats.totalUsers) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-${theme.textSecondary} text-sm`}>
                      {(
                        (activityStats.mobileUsers / activityStats.totalUsers) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "patterns" && (
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Login Patterns (24 Hours)
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded"></div>
                  <span className={`text-${theme.textSecondary}`}>
                    Total Logins
                  </span>
                </div>
              </div>
            </div>
            <LoginChart data={loginPatterns} title="" />
          </Card>
        )}

        {activeTab === "locations" && (
          <Card theme={userType} className="p-6">
            <h3 className={`text-lg font-semibold text-${theme.text} mb-6`}>
              User Locations
            </h3>
            <div className="space-y-4">
              {topLocations.map((location, index) => (
                <div key={index} className={`p-4 ${theme.glass} rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className={`text-${theme.text} font-medium`}>
                        {location.country}
                      </span>
                    </div>
                    <span className={`text-${theme.text} font-medium`}>
                      {location.users.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 bg-white/10 rounded-full h-2 mr-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                    <span className={`text-${theme.textSecondary} text-sm`}>
                      {location.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "active" && (
          <div className="space-y-6">
            {/* Filters */}
            <Card theme={userType} className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${theme.textSecondary}`}
                    />
                    <Input
                      placeholder="Search active users..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      theme={userType}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    theme={userType}
                    className="min-w-[120px]"
                  >
                    <option value="">All Status</option>
                    <option value="online">Online</option>
                    <option value="idle">Idle</option>
                    <option value="offline">Offline</option>
                  </Select>

                  <Input
                    placeholder="Filter by company..."
                    value={filters.company}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    theme={userType}
                    className="min-w-[150px]"
                  />
                </div>
              </div>
            </Card>

            {/* Active Users Table */}
            <Card theme={userType} className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b border-${theme.border}`}>
                    <tr>
                      <th
                        className={`p-4 text-left text-${theme.text} font-semibold`}
                      >
                        User
                      </th>
                      <th
                        className={`p-4 text-left text-${theme.text} font-semibold`}
                      >
                        Company
                      </th>
                      <th
                        className={`p-4 text-left text-${theme.text} font-semibold`}
                      >
                        Status
                      </th>
                      <th
                        className={`p-4 text-left text-${theme.text} font-semibold`}
                      >
                        Session Time
                      </th>
                      <th
                        className={`p-4 text-left text-${theme.text} font-semibold`}
                      >
                        Device
                      </th>
                      <th
                        className={`p-4 text-left text-${theme.text} font-semibold`}
                      >
                        Location
                      </th>
                      <th
                        className={`p-4 text-left text-${theme.text} font-semibold`}
                      >
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const DeviceIcon = getDeviceIcon(user.device);

                      return (
                        <tr
                          key={user.id}
                          className={`border-b border-${theme.border} hover:bg-white/5 transition-colors`}
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 bg-gradient-to-r ${theme.secondary} rounded-lg flex items-center justify-center`}
                              >
                                <User
                                  className={`w-4 h-4 text-${theme.text}`}
                                />
                              </div>
                              <div>
                                <p className={`text-${theme.text} font-medium`}>
                                  {user.name}
                                </p>
                                <p
                                  className={`text-${theme.textSecondary} text-sm`}
                                >
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-${theme.text}`}>
                              {user.company}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  user.status === "online"
                                    ? "bg-green-400"
                                    : user.status === "idle"
                                    ? "bg-yellow-400"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                              <span
                                className={`text-sm capitalize ${
                                  user.status === "online"
                                    ? "text-green-400"
                                    : user.status === "idle"
                                    ? "text-yellow-400"
                                    : "text-gray-400"
                                }`}
                              >
                                {user.status}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-${theme.text}`}>
                              {user.sessionTime}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <DeviceIcon
                                className={`w-4 h-4 text-${theme.textSecondary}`}
                              />
                              <span
                                className={`text-${theme.textSecondary} text-sm`}
                              >
                                {user.device}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <MapPin
                                className={`w-4 h-4 text-${theme.textSecondary}`}
                              />
                              <span
                                className={`text-${theme.textSecondary} text-sm`}
                              >
                                {user.location}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-${theme.textSecondary} text-sm`}
                            >
                              {user.lastActive.toLocaleTimeString()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityMonitoring;
