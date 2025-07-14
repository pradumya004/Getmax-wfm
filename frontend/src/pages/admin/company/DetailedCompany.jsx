// frontend/src/pages/admin/DetailedCompany.jsx - Master Admin Detailed Company View

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Building,
  Users,
  TrendingUp,
  Activity,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Star,
  Crown,
  Package,
  Edit,
  Pause,
  Play,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  ArrowLeft,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Shield,
  DollarSign,
  FileText,
  Settings,
  Database,
  Network,
  Briefcase,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { masterAdminAPI } from "../../../api/masterAdmin.api.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useApi } from "../../../hooks/useApi.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";

const DetailedCompany = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [activeTab, setActiveTab] = useState("overview");
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");

  // API hooks
  const {
    data: companyDetails,
    loading: companyLoading,
    execute: fetchCompanyDetails,
    error: companyError,
  } = useApi(masterAdminAPI.getCompanyDetails);

  const {
    data: actionResult,
    loading: actionLoading,
    execute: executeAction,
  } = useApi(masterAdminAPI.toggleCompanyStatus);

  const {
    data: planChangeResult,
    loading: planChangeLoading,
    execute: executePlanChange,
  } = useApi(masterAdminAPI.changeSubscriptionPlan);

  useEffect(() => {
    if (companyId) {
      loadCompanyDetails();
    }
  }, [companyId]);

  const loadCompanyDetails = async () => {
    console.log("🔄 Loading company details for:", companyId);
    const result = await fetchCompanyDetails(companyId);
    console.log("🏢 Company details result:", result);
  };

  const handleAction = (action) => {
    setActionType(action);
    setShowActionModal(true);
  };

  const executeCompanyAction = async (actionData) => {
    try {
      if (actionType === "changePlan") {
        await executePlanChange(
          companyId,
          actionData.newPlan,
          actionData.effectiveDate,
          actionData.reason
        );
        toast.success(`Subscription plan changed to ${actionData.newPlan}`);
      } else {
        await executeAction(companyId, actionType, actionData.reason);
        toast.success(`Company ${actionType}d successfully`);
      }

      setShowActionModal(false);
      loadCompanyDetails(); // Refresh data
    } catch (error) {
      console.error(`❌ Failed to ${actionType} company:`, error);
      toast.error(`Failed to ${actionType} company`);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "trial":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "suspended":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan?.toLowerCase()) {
      case "enterprise":
        return <Crown className="w-5 h-5 text-purple-400" />;
      case "professional":
        return <Star className="w-5 h-5 text-blue-400" />;
      case "basic":
        return <Package className="w-5 h-5 text-green-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (companyLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-white mt-4">Loading Company Details...</p>
        </div>
      </div>
    );
  }

  if (companyError || !companyDetails) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <div className="text-center">
          <Building
            className={`w-16 h-16 text-${theme.textSecondary} mx-auto mb-4`}
          />
          <h2 className="text-xl font-bold text-white mb-2">
            Company Not Found
          </h2>
          <p className={`text-${theme.textSecondary} mb-4`}>
            {companyError || "The requested company could not be found."}
          </p>
          <Button onClick={() => navigate("/master-admin/companies")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  const company = companyDetails.data;
  const analytics = company.analytics || {};
  const employeeStats = analytics.employees || {};
  const recentEmployees = analytics.recent || [];
  const departmentBreakdown = analytics.breakdown?.departments || [];
  const roleBreakdown = analytics.breakdown?.roles || [];

  const tabs = [
    { id: "overview", label: "Overview", icon: Building },
    { id: "employees", label: "Employees", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>{company.companyName} - Company Details</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/master-admin/companies")}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div
                className={`w-12 h-12 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center text-lg font-bold text-white`}
              >
                {company.companyName?.charAt(0) || "C"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {company.companyName}
                </h1>
                <p className={`text-${theme.textSecondary}`}>
                  {company.companyId} • {company.businessType}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleAction("changePlan")}
              variant="outline"
              className="inline-flex items-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>Change Plan</span>
            </Button>
            {company.subscriptionStatus === "Active" ? (
              <Button
                onClick={() => handleAction("suspend")}
                variant="outline"
                className="inline-flex items-center space-x-2 text-red-400 border-red-400 hover:bg-red-500/10"
              >
                <Pause className="w-4 h-4" />
                <span>Suspend</span>
              </Button>
            ) : (
              <Button
                onClick={() => handleAction("activate")}
                variant="outline"
                className="inline-flex items-center space-x-2 text-green-400 border-green-400 hover:bg-green-500/10"
              >
                <Play className="w-4 h-4" />
                <span>Activate</span>
              </Button>
            )}
            <Button
              onClick={loadCompanyDetails}
              className="inline-flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${companyLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Company Status & Key Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  getStatusColor(company.subscriptionStatus).includes("green")
                    ? "bg-green-500/20"
                    : company.subscriptionStatus === "Trial"
                    ? "bg-yellow-500/20"
                    : "bg-red-500/20"
                }`}
              >
                {company.subscriptionStatus === "Active" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : company.subscriptionStatus === "Trial" ? (
                  <Clock className="w-5 h-5 text-yellow-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>Status</p>
                <p className="text-lg font-bold text-white">
                  {company.subscriptionStatus}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              {getPlanIcon(company.subscriptionPlan)}
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>Plan</p>
                <p className="text-lg font-bold text-white">
                  {company.subscriptionPlan}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-blue-500/20`}>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Employees
                </p>
                <p className="text-lg font-bold text-white">
                  {employeeStats.total || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-purple-500/20`}>
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>Joined</p>
                <p className="text-lg font-bold text-white">
                  {formatDate(company.createdAt)}
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
              </button>
            ))}
          </div>
        </Card>

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
                <div className="flex items-center space-x-3">
                  <Mail className={`w-4 h-4 text-${theme.accent}`} />
                  <div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Email
                    </p>
                    <p className="text-white">{company.companyEmail}</p>
                  </div>
                </div>

                {company.companyPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className={`w-4 h-4 text-${theme.accent}`} />
                    <div>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        Phone
                      </p>
                      <p className="text-white">{company.companyPhone}</p>
                    </div>
                  </div>
                )}

                {company.companyWebsite && (
                  <div className="flex items-center space-x-3">
                    <Globe className={`w-4 h-4 text-${theme.accent}`} />
                    <div>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        Website
                      </p>
                      <a
                        href={company.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {company.companyWebsite}
                      </a>
                    </div>
                  </div>
                )}

                {company.companyAddress && (
                  <div className="flex items-center space-x-3">
                    <MapPin className={`w-4 h-4 text-${theme.accent}`} />
                    <div>
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        Address
                      </p>
                      <p className="text-white">{company.companyAddress}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Briefcase className={`w-4 h-4 text-${theme.accent}`} />
                  <div>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Business Type
                    </p>
                    <p className="text-white">{company.businessType}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Employee Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Employee Summary
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${theme.glass}`}>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Total
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {employeeStats.total || 0}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme.glass}`}>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Active
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      {employeeStats.active || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${theme.glass}`}>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Inactive
                    </p>
                    <p className="text-2xl font-bold text-red-400">
                      {employeeStats.inactive || 0}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme.glass}`}>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Utilization
                    </p>
                    <p className="text-2xl font-bold text-blue-400">
                      {employeeStats.utilizationRate || 0}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="space-y-6">
            {/* Recent Employees */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Recent Employees
              </h3>
              {recentEmployees.length > 0 ? (
                <div className="space-y-3">
                  {recentEmployees.map((employee) => (
                    <div
                      key={employee._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center text-sm font-bold text-white`}
                        >
                          {employee.personalInfo?.firstName?.charAt(0) || "E"}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {employee.personalInfo?.firstName}{" "}
                            {employee.personalInfo?.lastName}
                          </p>
                          <p className={`text-${theme.textSecondary} text-sm`}>
                            {employee.employeeId} •{" "}
                            {employee.roleRef?.roleName || "No Role"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(
                            employee.status?.employeeStatus
                          )}`}
                        >
                          {employee.status?.employeeStatus || "Unknown"}
                        </span>
                        <p
                          className={`text-${theme.textSecondary} text-xs mt-1`}
                        >
                          {formatDate(employee.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users
                    className={`w-12 h-12 text-${theme.textSecondary} mx-auto mb-4`}
                  />
                  <p className={`text-${theme.textSecondary}`}>
                    No employee data available
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Department Breakdown
              </h3>
              {departmentBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {departmentBreakdown.map((dept, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.secondary}`}
                        ></div>
                        <span className="text-white">
                          {dept._id || "Unknown Department"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{dept.count}</p>
                        <p className={`text-${theme.textSecondary} text-sm`}>
                          {dept.activeCount} active
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart
                    className={`w-12 h-12 text-${theme.textSecondary} mx-auto mb-4`}
                  />
                  <p className={`text-${theme.textSecondary}`}>
                    No department data available
                  </p>
                </div>
              )}
            </Card>

            {/* Role Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Role Breakdown
              </h3>
              {roleBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {roleBreakdown.map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.secondary}`}
                        ></div>
                        <span className="text-white">
                          {role._id || "Unknown Role"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{role.count}</p>
                        <p className={`text-${theme.textSecondary} text-sm`}>
                          {role.activeCount} active
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target
                    className={`w-12 h-12 text-${theme.textSecondary} mx-auto mb-4`}
                  />
                  <p className={`text-${theme.textSecondary}`}>
                    No role data available
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Company Settings & Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className={`font-medium text-${theme.textSecondary}`}>
                  Subscription Management
                </h4>
                <Button
                  onClick={() => handleAction("changePlan")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Change Subscription Plan
                </Button>

                <h4 className={`font-medium text-${theme.textSecondary} mt-6`}>
                  Account Status
                </h4>
                {company.subscriptionStatus === "Active" ? (
                  <Button
                    onClick={() => handleAction("suspend")}
                    variant="outline"
                    className="w-full justify-start text-red-400 border-red-400 hover:bg-red-500/10"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Suspend Company
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAction("activate")}
                    variant="outline"
                    className="w-full justify-start text-green-400 border-green-400 hover:bg-green-500/10"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Activate Company
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <h4 className={`font-medium text-${theme.textSecondary}`}>
                  Data & Reports
                </h4>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Company Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>

                <h4 className={`font-medium text-${theme.textSecondary} mt-6`}>
                  Advanced
                </h4>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  View Audit Logs
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <ActionModal
          company={company}
          actionType={actionType}
          onClose={() => setShowActionModal(false)}
          onExecute={executeCompanyAction}
          loading={actionLoading || planChangeLoading}
          theme={theme}
        />
      )}
    </div>
  );
};

// Action Modal Component (reusing from CompanyManagement)
const ActionModal = ({
  company,
  actionType,
  onClose,
  onExecute,
  loading,
  theme,
}) => {
  const [formData, setFormData] = useState({
    reason: "",
    newPlan: "",
    effectiveDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onExecute(formData);
  };

  const getModalTitle = () => {
    switch (actionType) {
      case "suspend":
        return "Suspend Company";
      case "activate":
        return "Activate Company";
      case "changePlan":
        return "Change Subscription Plan";
      default:
        return "Company Action";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`max-w-md w-full mx-4 ${theme.card} rounded-xl shadow-2xl border border-${theme.accent}/30`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {getModalTitle()}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-white/10 text-${theme.textSecondary} hover:text-white transition-colors`}
            >
              x
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {company && (
              <div className={`p-4 rounded-lg ${theme.glass} mb-4`}>
                <h4 className="font-medium text-white mb-2">
                  {company.companyName}
                </h4>
                <p className={`text-sm text-${theme.textSecondary}`}>
                  ID: {company.companyId}
                </p>
                <p className={`text-sm text-${theme.textSecondary}`}>
                  Current Status: {company.subscriptionStatus}
                </p>
              </div>
            )}

            {actionType === "changePlan" && (
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  New Subscription Plan
                </label>
                <select
                  value={formData.newPlan}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newPlan: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                  required
                >
                  <option value="">Select a plan</option>
                  <option value="Basic">Basic</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            )}

            <div>
              <label
                className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
              >
                Reason{" "}
                {actionType === "changePlan" ? "(Optional)" : "(Required)"}
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder={`Enter reason for ${
                  actionType === "changePlan" ? "plan change" : actionType
                }...`}
                className={`w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-${theme.accent}/50`}
                rows={3}
                required={actionType !== "changePlan"}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className={
                  actionType === "suspend"
                    ? "bg-red-600 hover:bg-red-700"
                    : actionType === "activate"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                {loading
                  ? "Processing..."
                  : `${
                      actionType === "changePlan"
                        ? "Change Plan"
                        : actionType.charAt(0).toUpperCase() +
                          actionType.slice(1)
                    }`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DetailedCompany;
