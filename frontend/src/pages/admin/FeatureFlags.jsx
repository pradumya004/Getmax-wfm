// frontend/src/pages/admin/FeatureFlags.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flag,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Clock,
  Users,
  Building,
  Target,
  Zap,
  Settings,
  Code,
  Globe,
  Shield,
  Activity,
  BarChart3,
  TrendingUp,
  Database,
  Server,
  Bell,
  Download,
} from "lucide-react";
import { getTheme } from "../../lib/theme";
import { useAuth } from "../../hooks/useAuth";

const FeatureFlags = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    environment: "production",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "feature",
    enabled: false,
    environments: {
      development: false,
      staging: false,
      production: false,
    },
    rolloutPercentage: 100,
    targetCompanies: [],
    conditions: {
      userType: [],
      subscriptionPlan: [],
      companySize: [],
    },
    expiresAt: "",
  });

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const loadFeatureFlags = async () => {
    try {
      console.log("Loading feature flags...");
    } catch (error) {
      console.error("Failed to load feature flags:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeatureFlags();
    setRefreshing(false);
  };

  const handleToggleFlag = async (flagId, environment, enabled) => {
    try {
      console.log(`Toggling flag ${flagId} in ${environment}: ${enabled}`);
      // Update local state
      setFeatureFlags((prev) =>
        prev.map((flag) =>
          flag.id === flagId
            ? {
                ...flag,
                environments: {
                  ...flag.environments,
                  [environment]: enabled,
                },
              }
            : flag
        )
      );
    } catch (error) {
      console.error("Failed to toggle feature flag:", error);
    }
  };

  const handleCreateFlag = async () => {
    try {
      const newFlag = {
        id: Date.now(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "sriram@getmaxsolutions.com",
      };

      setFeatureFlags((prev) => [newFlag, ...prev]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create feature flag:", error);
    }
  };

  const handleUpdateFlag = async () => {
    try {
      setFeatureFlags((prev) =>
        prev.map((flag) =>
          flag.id === selectedFlag.id
            ? { ...flag, ...formData, updatedAt: new Date() }
            : flag
        )
      );
      setShowEditModal(false);
      setSelectedFlag(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update feature flag:", error);
    }
  };

  const handleDeleteFlag = async (flagId) => {
    if (window.confirm("Are you sure you want to delete this feature flag?")) {
      try {
        setFeatureFlags((prev) => prev.filter((flag) => flag.id !== flagId));
      } catch (error) {
        console.error("Failed to delete feature flag:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "feature",
      enabled: false,
      environments: {
        development: false,
        staging: false,
        production: false,
      },
      rolloutPercentage: 100,
      targetCompanies: [],
      conditions: {
        userType: [],
        subscriptionPlan: [],
        companySize: [],
      },
      expiresAt: "",
    });
  };

  const openEditModal = (flag) => {
    setSelectedFlag(flag);
    setFormData({
      name: flag.name,
      description: flag.description,
      category: flag.category,
      enabled: flag.enabled,
      environments: flag.environments,
      rolloutPercentage: flag.rolloutPercentage,
      targetCompanies: flag.targetCompanies || [],
      conditions: flag.conditions || {
        userType: [],
        subscriptionPlan: [],
        companySize: [],
      },
      expiresAt: flag.expiresAt || "",
    });
    setShowEditModal(true);
  };

  const getCategoryColor = (category) => {
    const colors = {
      feature: "text-blue-400 bg-blue-400/20 border-blue-400/30",
      experiment: "text-purple-400 bg-purple-400/20 border-purple-400/30",
      killswitch: "text-red-400 bg-red-400/20 border-red-400/30",
      operational: "text-green-400 bg-green-400/20 border-green-400/30",
      permission: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
    };
    return colors[category] || colors.feature;
  };

  const getEnvironmentIcon = (env) => {
    const icons = {
      development: Code,
      staging: Database,
      production: Globe,
    };
    return icons[env] || Globe;
  };

  // Mock feature flags data
  const [featureFlags, setFeatureFlags] = useState([
    {
      id: 1,
      name: "advanced_reporting",
      description: "Enable advanced reporting features with custom dashboards",
      category: "feature",
      enabled: true,
      environments: {
        development: true,
        staging: true,
        production: true,
      },
      rolloutPercentage: 100,
      targetCompanies: [],
      conditions: {
        userType: ["company_admin"],
        subscriptionPlan: ["Professional", "Enterprise"],
        companySize: [],
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: "sriram@getmaxsolutions.com",
      usage: {
        companies: 89,
        users: 234,
        lastUsed: new Date(Date.now() - 30 * 60 * 1000),
      },
    },
    {
      id: 2,
      name: "bulk_operations",
      description: "Allow bulk operations on employees and data management",
      category: "feature",
      enabled: true,
      environments: {
        development: true,
        staging: true,
        production: false,
      },
      rolloutPercentage: 50,
      targetCompanies: ["comp1", "comp2"],
      conditions: {
        userType: ["company_admin", "hr_manager"],
        subscriptionPlan: ["Enterprise"],
        companySize: ["large"],
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: "sriram@getmaxsolutions.com",
      usage: {
        companies: 23,
        users: 67,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    },
    {
      id: 3,
      name: "maintenance_mode",
      description: "Emergency killswitch to enable maintenance mode",
      category: "killswitch",
      enabled: false,
      environments: {
        development: false,
        staging: false,
        production: false,
      },
      rolloutPercentage: 100,
      targetCompanies: [],
      conditions: {
        userType: ["master_admin"],
        subscriptionPlan: [],
        companySize: [],
      },
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      createdBy: "sriram@getmaxsolutions.com",
      usage: {
        companies: 0,
        users: 0,
        lastUsed: null,
      },
    },
    {
      id: 4,
      name: "ai_insights",
      description: "AI-powered workforce insights and recommendations",
      category: "experiment",
      enabled: true,
      environments: {
        development: true,
        staging: true,
        production: false,
      },
      rolloutPercentage: 25,
      targetCompanies: ["comp1"],
      conditions: {
        userType: ["company_admin"],
        subscriptionPlan: ["Enterprise"],
        companySize: ["large"],
      },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: "sriram@getmaxsolutions.com",
      usage: {
        companies: 5,
        users: 12,
        lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    },
    {
      id: 5,
      name: "data_export",
      description: "Allow companies to export their workforce data",
      category: "permission",
      enabled: true,
      environments: {
        development: true,
        staging: true,
        production: true,
      },
      rolloutPercentage: 100,
      targetCompanies: [],
      conditions: {
        userType: ["company_admin"],
        subscriptionPlan: ["Professional", "Enterprise"],
        companySize: [],
      },
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdBy: "sriram@getmaxsolutions.com",
      usage: {
        companies: 142,
        users: 389,
        lastUsed: new Date(Date.now() - 15 * 60 * 1000),
      },
    },
  ]);

  const filteredFlags = featureFlags.filter((flag) => {
    if (
      filters.search &&
      !flag.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !flag.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.category && flag.category !== filters.category) {
      return false;
    }
    if (
      filters.status === "enabled" &&
      !flag.environments[filters.environment]
    ) {
      return false;
    }
    if (
      filters.status === "disabled" &&
      flag.environments[filters.environment]
    ) {
      return false;
    }
    return true;
  });

  const flagStats = {
    total: featureFlags.length,
    enabled: featureFlags.filter((flag) => flag.environments.production).length,
    experiments: featureFlags.filter((flag) => flag.category === "experiment")
      .length,
    killswitches: featureFlags.filter((flag) => flag.category === "killswitch")
      .length,
  };

  const Toggle = ({ checked, onChange, size = "md" }) => {
    const sizes = {
      sm: "w-8 h-4",
      md: "w-10 h-5",
      lg: "w-12 h-6",
    };

    return (
      <button
        onClick={() => onChange(!checked)}
        className={`${
          sizes[size]
        } flex items-center p-1 rounded-full transition-colors ${
          checked ? "bg-red-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`${
            size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
          } bg-white rounded-full transition-transform ${
            checked
              ? size === "sm"
                ? "translate-x-4"
                : size === "lg"
                ? "translate-x-6"
                : "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>
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
                Feature Flags
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Control feature rollouts and manage platform capabilities
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={filters.environment}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    environment: e.target.value,
                  }))
                }
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="development" className="bg-gray-800">
                  Development
                </option>
                <option value="staging" className="bg-gray-800">
                  Staging
                </option>
                <option value="production" className="bg-gray-800">
                  Production
                </option>
              </select>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex items-center space-x-2 px-4 py-2 border border-${theme.border} ${theme.glass} rounded-lg text-${theme.text} text-sm hover:bg-white/10 transition-colors disabled:opacity-50`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className={`flex items-center space-x-2 px-4 py-2 ${theme.button} rounded-lg text-sm transition-colors`}
              >
                <Plus className="w-4 h-4" />
                <span>New Flag</span>
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
                  Total Flags
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {flagStats.total}
                </p>
              </div>
              <Flag className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>Enabled</p>
                <p className={`text-2xl font-bold text-green-400`}>
                  {flagStats.enabled}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Experiments
                </p>
                <p className={`text-2xl font-bold text-purple-400`}>
                  {flagStats.experiments}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Kill Switches
                </p>
                <p className={`text-2xl font-bold text-red-400`}>
                  {flagStats.killswitches}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
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
                  placeholder="Search feature flags..."
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
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="">All Categories</option>
                <option value="feature">Features</option>
                <option value="experiment">Experiments</option>
                <option value="killswitch">Kill Switches</option>
                <option value="operational">Operational</option>
                <option value="permission">Permissions</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className={`px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              >
                <option value="">All Status</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feature Flags List */}
        <div className="space-y-4">
          {filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className={`text-lg font-semibold text-${theme.text}`}>
                      {flag.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs border ${getCategoryColor(
                        flag.category
                      )}`}
                    >
                      {flag.category.toUpperCase()}
                    </span>
                    {flag.expiresAt && (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        EXPIRES {new Date(flag.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className={`text-${theme.textSecondary} mb-4`}>
                    {flag.description}
                  </p>

                  {/* Environment Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {Object.entries(flag.environments).map(([env, enabled]) => {
                      const EnvIcon = getEnvironmentIcon(env);

                      return (
                        <div
                          key={env}
                          className={`p-3 ${theme.glass} rounded-lg`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <EnvIcon
                                className={`w-4 h-4 text-${theme.textSecondary}`}
                              />
                              <span
                                className={`text-${theme.text} text-sm font-medium capitalize`}
                              >
                                {env}
                              </span>
                            </div>
                            <Toggle
                              checked={enabled}
                              onChange={(checked) =>
                                handleToggleFlag(flag.id, env, checked)
                              }
                              size="sm"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Usage Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        Rollout
                      </p>
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {flag.rolloutPercentage}%
                      </p>
                    </div>
                    <div>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        Companies
                      </p>
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {flag.usage.companies}
                      </p>
                    </div>
                    <div>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        Users
                      </p>
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {flag.usage.users}
                      </p>
                    </div>
                    <div>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        Last Used
                      </p>
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {flag.usage.lastUsed
                          ? flag.usage.lastUsed.toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>

                  {/* Conditions */}
                  {(flag.conditions.userType.length > 0 ||
                    flag.conditions.subscriptionPlan.length > 0 ||
                    flag.conditions.companySize.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {flag.conditions.userType.map((type, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30"
                        >
                          {type}
                        </span>
                      ))}
                      {flag.conditions.subscriptionPlan.map((plan, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30"
                        >
                          {plan}
                        </span>
                      ))}
                      {flag.conditions.companySize.map((size, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/30"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(flag)}
                    className={`p-2 hover:bg-white/10 rounded-lg transition-colors`}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteFlag(flag.id)}
                    className={`p-2 hover:bg-white/10 rounded-lg transition-colors`}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Flag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto`}
          >
            <h3 className={`text-xl font-semibold text-${theme.text} mb-6`}>
              Create Feature Flag
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Flag Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  placeholder="feature_name"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  placeholder="Describe what this feature flag controls..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  >
                    <option value="feature">Feature</option>
                    <option value="experiment">Experiment</option>
                    <option value="killswitch">Kill Switch</option>
                    <option value="operational">Operational</option>
                    <option value="permission">Permission</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Rollout Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.rolloutPercentage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rolloutPercentage: parseInt(e.target.value),
                      }))
                    }
                    className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Environments
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(formData.environments).map(
                    ([env, enabled]) => (
                      <div
                        key={env}
                        className={`p-3 border border-${theme.border} rounded-lg`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-${theme.text} text-sm capitalize`}
                          >
                            {env}
                          </span>
                          <Toggle
                            checked={enabled}
                            onChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                environments: {
                                  ...prev.environments,
                                  [env]: checked,
                                },
                              }))
                            }
                            size="sm"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Expires At (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiresAt: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                />
              </div>

              <div className="flex items-center space-x-3 justify-end pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 border border-${theme.border} ${theme.glass} rounded-lg text-${theme.text} transition-colors hover:bg-white/10`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFlag}
                  className={`px-4 py-2 ${theme.button} rounded-lg transition-colors`}
                >
                  Create Flag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Flag Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${theme.glass} backdrop-blur-xl border border-${theme.border} rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto`}
          >
            <h3 className={`text-xl font-semibold text-${theme.text} mb-6`}>
              Edit Feature Flag
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Flag Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  placeholder="feature_name"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                >
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  placeholder="Describe what this feature flag controls..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  >
                    <option value="feature">Feature</option>
                    <option value="experiment">Experiment</option>
                    <option value="killswitch">Kill Switch</option>
                    <option value="operational">Operational</option>
                    <option value="permission">Permission</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
                  >
                    Rollout Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.rolloutPercentage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rolloutPercentage: parseInt(e.target.value),
                      }))
                    }
                    className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 justify-end pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`px-4 py-2 border border-${theme.border} ${theme.glass} rounded-lg text-${theme.text} transition-colors hover:bg-white/10`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFlag}
                  className={`px-4 py-2 ${theme.button} rounded-lg transition-colors`}
                >
                  Update Flag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureFlags;
