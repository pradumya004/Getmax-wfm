// frontend/src/pages/company/CompanyProfile.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Edit,
  Building,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Shield,
  Settings,
  DollarSign,
  Users,
  Clock,
  Activity,
  Wifi,
  Key,
  ChevronRight,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { companyAPI } from "../../api/company.api.js";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getProfile();
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching company profile:", error);
      toast.error("Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-400/20";
      case "inactive":
      case "suspended":
        return "text-red-400 bg-red-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/20";
      default:
        return `text-${theme.textSecondary} bg-${theme.accent}/20`;
    }
  };

  const getSubscriptionIcon = (plan) => {
    switch (plan?.toLowerCase()) {
      case "enterprise":
        return "👑";
      case "professional":
        return "💼";
      case "basic":
        return "📦";
      case "trial":
        return "🚀";
      default:
        return "📋";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Building },
    { id: "subscription", label: "Subscription", icon: DollarSign },
    { id: "contracts", label: "Contracts", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Settings },
  ];

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!company) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className={`text-${theme.textSecondary} mb-4`}>
            Unable to load company profile data.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>{`Company Profile - ${company.companyName}`}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Company Profile
            </h1>
            <p className={`text-${theme.textSecondary}`}>
              Manage your company information and settings
            </p>
          </div>
          <Button
            onClick={() => navigate("/company/settings")}
            className="inline-flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        </div>

        {/* Company Header Card */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${theme.secondary} rounded-xl flex items-center justify-center text-2xl font-bold text-white`}
              >
                {company.companyName?.charAt(0) || "C"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {company.companyName}
                </h2>
                {company.legalName && (
                  <p className={`text-${theme.textSecondary} mb-2`}>
                    Legal: {company.legalName}
                  </p>
                )}
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(
                      company.subscriptionStatus
                    )} border`}
                  >
                    {company.subscriptionStatus || "Unknown"}
                  </span>
                  <span
                    className={`text-${theme.textSecondary} flex items-center`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Since{" "}
                    {new Date(
                      company.subscriptionStartDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-${theme.textSecondary} text-sm`}>
                Company ID
              </p>
              <div className="flex items-center space-x-2">
                <code className={`text-${theme.text} font-mono`}>
                  {company.companyId}
                </code>
                <button
                  onClick={() => copyToClipboard(company.companyId)}
                  className={`p-1 hover:bg-${theme.accent}/20 rounded`}
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-1 bg-black/20 rounded-lg backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-${theme.accent}/20 text-${theme.text} border border-${theme.accent}/30`
                  : `text-${theme.textSecondary} hover:bg-white/5`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Company Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Company Name
                  </label>
                  <p className="text-white font-medium">
                    {company.companyName}
                  </p>
                </div>
                {company.legalName && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Legal Name
                    </label>
                    <p className="text-white font-medium">
                      {company.legalName}
                    </p>
                  </div>
                )}
                {company.taxID && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Tax ID
                    </label>
                    <p className="text-white font-medium">{company.taxID}</p>
                  </div>
                )}
                {company.website && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Website
                    </label>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-${theme.accent} hover:text-${theme.accent}/80 flex items-center`}
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      {company.website}
                    </a>
                  </div>
                )}
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Company Size
                  </label>
                  <p className="text-white font-medium">
                    {company.companySize || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Time Zone
                  </label>
                  <p className="text-white font-medium">
                    {company.timeZone || "Not specified"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Contact Email
                  </label>
                  <p className="text-white font-medium">
                    {company.contactEmail}
                  </p>
                </div>
                {company.address && (
                  <div>
                    <label
                      className={`text-${theme.textSecondary} text-sm flex items-center mb-2`}
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Address
                    </label>
                    <div className={`text-${theme.textSecondary} space-y-1`}>
                      {company.address.street && (
                        <p>{company.address.street}</p>
                      )}
                      <p>
                        {[
                          company.address.city,
                          company.address.state,
                          company.address.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {company.address.country && (
                        <p>{company.address.country}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Revenue Metrics */}
            {company.revenueTracking && (
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg ${theme.glass}`}>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Monthly Revenue
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {company.currency}{" "}
                      {company.currentMonthRevenue?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${theme.glass}`}>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Growth Rate
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      {company.revenueGrowthThisMonth?.toFixed(1) || "0"}%
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${theme.glass}`}>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Profit Margin
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {company.revenueTracking.performanceMetrics
                        ?.profitMargin || "0"}
                      %
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${theme.glass}`}>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Employee Efficiency
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {company.revenueTracking.performanceMetrics
                        ?.operationalEfficiency || "0"}
                      %
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Subscription Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                  <div>
                    <h4 className="text-xl font-bold text-white flex items-center">
                      {getSubscriptionIcon(company.subscriptionPlan)}{" "}
                      {company.subscriptionPlan}
                    </h4>
                    <p className={`text-${theme.textSecondary}`}>
                      Current Plan
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      company.subscriptionStatus
                    )} border`}
                  >
                    {company.subscriptionStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Start Date
                    </label>
                    <p className="text-white font-medium">
                      {new Date(
                        company.subscriptionStartDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  {company.subscriptionEndDate && (
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        End Date
                      </label>
                      <p className="text-white font-medium">
                        {new Date(
                          company.subscriptionEndDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Payment Status
                  </label>
                  <p
                    className={`font-medium ${
                      company.paymentStatus === "Paid"
                        ? "text-green-400"
                        : company.paymentStatus === "Pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {company.paymentStatus}
                  </p>
                </div>

                {company.subscriptionDaysRemaining && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Days Remaining
                    </label>
                    <p className="text-white font-medium">
                      {company.subscriptionDaysRemaining} days
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                API Usage
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-${theme.textSecondary}`}>
                    API Status
                  </span>
                  <span
                    className={`flex items-center ${
                      company.apiEnabled ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {company.apiEnabled ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {company.apiEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                {company.apiKey && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      API Key
                    </label>
                    <div className="flex items-center space-x-2">
                      <code
                        className={`text-${theme.text} font-mono text-sm bg-black/20 px-2 py-1 rounded`}
                      >
                        {company.apiKey.substring(0, 20)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(company.apiKey)}
                        className={`p-1 hover:bg-${theme.accent}/20 rounded`}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Rate Limit
                  </label>
                  <p className="text-white font-medium">
                    {company.integrationSettings?.apiRateLimit || 1000}{" "}
                    requests/hour
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "contracts" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Contract Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`text-${theme.textSecondary} text-sm mb-2 block`}
                >
                  Specialty Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {company.contractSettings?.specialtyType?.map(
                    (specialty, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                      >
                        {specialty}
                      </span>
                    )
                  ) || (
                    <span className={`text-${theme.textSecondary}`}>
                      Not specified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  className={`text-${theme.textSecondary} text-sm mb-2 block`}
                >
                  Client Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {company.contractSettings?.clientType?.map((type, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                    >
                      {type}
                    </span>
                  )) || (
                    <span className={`text-${theme.textSecondary}`}>
                      Not specified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  className={`text-${theme.textSecondary} text-sm mb-2 block`}
                >
                  Contract Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {company.contractSettings?.contractType?.map(
                    (type, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                      >
                        {type}
                      </span>
                    )
                  ) || (
                    <span className={`text-${theme.textSecondary}`}>
                      Not specified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  className={`text-${theme.textSecondary} text-sm mb-2 block`}
                >
                  Scope Format
                </label>
                <div className="flex flex-wrap gap-2">
                  {company.contractSettings?.scopeFormatID?.map(
                    (format, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                      >
                        {format}
                      </span>
                    )
                  ) || (
                    <span className={`text-${theme.textSecondary}`}>
                      Not specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-${theme.textSecondary}`}>
                    Remote Work
                  </span>
                  <span
                    className={`flex items-center ${
                      company.securitySettings?.remoteWorkEnabled
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {company.securitySettings?.remoteWorkEnabled ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {company.securitySettings?.remoteWorkEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-${theme.textSecondary}`}>
                    Two-Factor Auth
                  </span>
                  <span
                    className={`flex items-center ${
                      company.securitySettings?.twoFactorEnabled
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {company.securitySettings?.twoFactorEnabled ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {company.securitySettings?.twoFactorEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>

                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Max Login Attempts
                  </label>
                  <p className="text-white font-medium">
                    {company.securitySettings?.maxLoginAttempts || 5}
                  </p>
                </div>

                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Session Timeout
                  </label>
                  <p className="text-white font-medium">
                    {company.securitySettings?.sessionTimeout || 480} minutes
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Wifi className="w-5 h-5 mr-2" />
                Allowed IPs
              </h3>
              <div className="space-y-3">
                {company.securitySettings?.workingIPs?.length > 0 ? (
                  company.securitySettings.workingIPs.map((ipConfig, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${theme.glass} flex items-center justify-between`}
                    >
                      <div>
                        <p className="text-white font-medium">{ipConfig.ip}</p>
                        {ipConfig.label && (
                          <p className={`text-${theme.textSecondary} text-sm`}>
                            {ipConfig.label}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(ipConfig.ip)}
                        className={`p-1 hover:bg-${theme.accent}/20 rounded`}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className={`text-${theme.textSecondary} text-center py-4`}>
                    No IP restrictions configured
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "integrations" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Integration Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    SFTP Integration
                  </h4>
                  <p className={`text-${theme.textSecondary}`}>
                    Secure file transfer protocol
                  </p>
                </div>
                <span
                  className={`flex items-center ${
                    company.integrationSettings?.sftpEnabled
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {company.integrationSettings?.sftpEnabled ? (
                    <CheckCircle className="w-5 h-5 mr-1" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-1" />
                  )}
                  {company.integrationSettings?.sftpEnabled
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </div>

              {company.integrationSettings?.sftpEnabled &&
                company.integrationSettings?.sftpCredentials && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        SFTP Host
                      </label>
                      <p className="text-white font-medium">
                        {company.integrationSettings.sftpCredentials.host ||
                          "Not configured"}
                      </p>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Port
                      </label>
                      <p className="text-white font-medium">
                        {company.integrationSettings.sftpCredentials.port || 22}
                      </p>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Username
                      </label>
                      <p className="text-white font-medium">
                        {company.integrationSettings.sftpCredentials.username ||
                          "Not configured"}
                      </p>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Key Path
                      </label>
                      <p className="text-white font-medium">
                        {company.integrationSettings.sftpCredentials.keyPath ||
                          "Not configured"}
                      </p>
                    </div>
                  </div>
                )}

              {company.integrationSettings?.webhookUrl && (
                <div>
                  <label
                    className={`text-${theme.textSecondary} text-sm mb-2 block`}
                  >
                    Webhook URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <code
                      className={`text-${theme.text} font-mono text-sm bg-black/20 px-3 py-2 rounded flex-1`}
                    >
                      {company.integrationSettings.webhookUrl}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(company.integrationSettings.webhookUrl)
                      }
                      className={`p-2 hover:bg-${theme.accent}/20 rounded`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
