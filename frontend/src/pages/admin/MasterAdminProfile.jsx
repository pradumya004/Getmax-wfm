// frontend/src/pages/admin/MasterAdminProfile.jsx - Master Admin Profile Management

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  User,
  Crown,
  Shield,
  Mail,
  Key,
  Settings,
  Activity,
  Clock,
  Calendar,
  Bell,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
  Unlock,
  Globe,
  Database,
  Server,
  Monitor,
  Zap,
  Target,
  BarChart3,
  Users,
  Building,
  FileText,
  Download,
  Upload,
  Edit,
  Camera,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { masterAdminAPI } from "../../api/masterAdmin.api.js";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useApi } from "../../hooks/useApi.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const MasterAdminProfile = () => {
  const navigate = useNavigate();
  const { userType, user } = useAuth();
  const theme = getTheme(userType);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "Sriram",
    email: "sriram@getmaxsolutions.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // API hooks
  const {
    data: profileData,
    loading: profileLoading,
    execute: fetchProfile,
    error: profileError,
  } = useApi(masterAdminAPI.getProfile);

  const {
    data: platformStats,
    loading: statsLoading,
    execute: fetchStats,
  } = useApi(masterAdminAPI.getPlatformStats);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    console.log("🔄 Loading master admin profile...");

    await Promise.all([fetchProfile(), fetchStats("30d")]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // This would typically call an update profile API
      console.log("💾 Saving profile:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      // This would typically call a change password API
      console.log("🔑 Changing password...");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Password changed successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("❌ Failed to change password:", error);
      toast.error("Failed to change password");
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const getPermissionIcon = (permission) => {
    switch (permission) {
      case "canViewAllCompanies":
        return <Building className="w-4 h-4 text-blue-400" />;
      case "canManageSubscriptions":
        return <Crown className="w-4 h-4 text-purple-400" />;
      case "canViewPlatformStats":
        return <BarChart3 className="w-4 h-4 text-green-400" />;
      case "canSuspendCompanies":
        return <Shield className="w-4 h-4 text-red-400" />;
      case "canAccessFinancials":
        return <FileText className="w-4 h-4 text-yellow-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPermissionLabel = (permission) => {
    switch (permission) {
      case "canViewAllCompanies":
        return "View All Companies";
      case "canManageSubscriptions":
        return "Manage Subscriptions";
      case "canViewPlatformStats":
        return "View Platform Statistics";
      case "canSuspendCompanies":
        return "Suspend Companies";
      case "canAccessFinancials":
        return "Access Financial Data";
      default:
        return permission;
    }
  };

  // Mock activity data
  const recentActivity = [
    {
      id: 1,
      action: "Suspended company",
      target: "TechCorp Solutions",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "warning",
    },
    {
      id: 2,
      action: "Changed subscription plan",
      target: "HealthPlus Medical",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: "info",
    },
    {
      id: 3,
      action: "Viewed platform statistics",
      target: "Analytics Dashboard",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      type: "success",
    },
    {
      id: 4,
      action: "Exported company data",
      target: "All Companies Report",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      type: "info",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const masterAdminPermissions = {
    canViewAllCompanies: true,
    canManageSubscriptions: true,
    canViewPlatformStats: true,
    canSuspendCompanies: true,
    canAccessFinancials: true,
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>Master Admin Profile - GetMax Platform</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
              >
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Master Administrator
                </h1>
                <p className={`text-${theme.textSecondary}`}>
                  Platform Owner & System Administrator
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={loadProfileData}
              disabled={profileLoading}
              variant="outline"
              className="inline-flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${profileLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Admin Status Card */}
        <Card className="p-6 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                Master Administrator Access
              </h2>
              <p className={`text-${theme.textSecondary}`}>
                You have full administrative privileges over the GetMax platform
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm text-${theme.textSecondary}`}>
                Account Type
              </p>
              <p className="text-yellow-400 font-bold">MASTER ADMIN</p>
            </div>
          </div>
        </Card>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <Card className="p-4 border-blue-500/30 bg-blue-500/5">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Debug Information
            </h4>
            <div className="text-sm text-blue-300 space-y-1">
              <p>
                Profile Data:{" "}
                {profileData
                  ? "✅ Loaded"
                  : profileLoading
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
              <p>User Type: {userType}</p>
              <p>Error: {profileError || "None"}</p>
            </div>
          </Card>
        )}

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
              </button>
            ))}
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </h3>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                    />
                  ) : (
                    <p className="text-white">{formData.name}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                    />
                  ) : (
                    <p className="text-white">{formData.email}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Role
                  </label>
                  <p className="text-white">Master Administrator</p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Account Created
                  </label>
                  <p className="text-white">January 1, 2024</p>
                </div>

                {isEditing && (
                  <Button onClick={handleSaveProfile} className="w-full mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </Card>

            {/* Security Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Security Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className={`w-full px-3 py-2 pr-10 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-${theme.textSecondary} hover:text-white`}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                  />
                </div>

                <Button
                  onClick={handlePasswordChange}
                  className="w-full"
                  disabled={
                    !formData.currentPassword ||
                    !formData.newPassword ||
                    !formData.confirmPassword
                  }
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "permissions" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Administrative Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(masterAdminPermissions).map(
                ([permission, granted]) => (
                  <div
                    key={permission}
                    className={`p-4 rounded-lg ${theme.glass} border-l-4 border-green-500`}
                  >
                    <div className="flex items-center space-x-3">
                      {getPermissionIcon(permission)}
                      <div className="flex-1">
                        <h4 className="text-white font-medium">
                          {getPermissionLabel(permission)}
                        </h4>
                        <p className={`text-${theme.textSecondary} text-sm`}>
                          {granted ? "Granted" : "Denied"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div
              className={`mt-6 p-4 rounded-lg ${theme.glass} border-l-4 border-yellow-500`}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Security Notice
                  </h4>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Master Administrator privileges grant you complete control
                    over the platform. These permissions cannot be modified and
                    are permanently assigned to your account.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "activity" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg ${theme.glass}`}
                >
                  <div className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">
                          {activity.action}
                        </h4>
                        <span className={`text-${theme.textSecondary} text-sm`}>
                          {activity.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-${theme.textSecondary} text-sm mt-1`}>
                        Target: {activity.target}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View Full Activity Log
            </Button>
          </Card>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Preferences */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">System Alerts</p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Critical system notifications
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Company Actions</p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      New companies and suspensions
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Security Events</p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Login attempts and access logs
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </Card>

            {/* System Preferences */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                System Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Dashboard Refresh Rate
                  </label>
                  <select
                    className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                  >
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                    <option value="600">10 minutes</option>
                  </select>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Time Zone
                  </label>
                  <select
                    className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="IST">India Standard Time</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Debug Mode</p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Show technical debug information
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={process.env.NODE_ENV === "development"}
                    className="rounded"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterAdminProfile;
