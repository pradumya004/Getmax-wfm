// frontend/src/pages/company/organization/OrganizationOverview.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Building,
  Users,
  Shield,
  Briefcase,
  ChevronRight,
  Plus,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import {StatCard} from "../../../components/common/StatCard.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { useOrganization } from "../../../hooks/useOrganization.jsx";
import { toast } from "react-hot-toast";

const OrganizationOverview = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const theme = getTheme(userType);
  const { orgData, refresh, loading } = useOrganization();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userType !== "company") {
      navigate("/company");
    } else {
      refresh();
    }
  }, [userType]);

  useEffect(() => {
    if (
      !loading &&
      (orgData.roles.length === 0 ||
        orgData.departments.length === 0 ||
        orgData.designations.length === 0)
    ) {
      toast.error("Some organization sections could not be loaded");
    }
  }, [orgData, loading]);
  

  const managementCards = [
    {
      title: "Departments",
      description: "Manage organizational departments",
      count: orgData.departments.length,
      activeCount: orgData.departments.filter((d) => d.isActive !== false)
        .length,
      icon: Building,
      path: "/company/org-data/departments", // Fixed route path
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Roles",
      description: "Define employee roles and permissions",
      count: orgData.roles.length,
      activeCount: orgData.roles.filter((r) => r.isActive !== false).length,
      icon: Shield,
      path: "/company/org-data/roles",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Designations",
      description: "Set up job designations and levels",
      count: orgData.designations.length,
      activeCount: orgData.designations.filter((d) => d.isActive !== false)
        .length,
      icon: Briefcase,
      path: "/company/org-data/designations",
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Sub-Departments",
      description: "Organize teams within departments",
      count: orgData.subdepartments.length,
      activeCount: orgData.subdepartments.filter((s) => s.isActive !== false)
        .length,
      icon: Users,
      path: "/company/org-data/subdepartments",
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      toast.success("Organization data refreshed");
    } catch (error) {
      console.error(
        "Handle refresh error - Failed to refresh organization data:",
        error
      );
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const getCompletionStats = () => {
    const hasBasicStructure =
      orgData.departments.length > 0 && orgData.roles.length > 0;
    const hasDesignations = orgData.designations.length > 0;
    const hasSubDepartments = orgData.subdepartments.length > 0;

    let completionScore = 0;
    if (hasBasicStructure) completionScore += 50;
    if (hasDesignations) completionScore += 25;
    if (hasSubDepartments) completionScore += 25;

    return {
      score: completionScore,
      hasBasicStructure,
      hasDesignations,
      hasSubDepartments,
    };
  };

  const completion = getCompletionStats();

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
        <Helmet>
          <title>Organization Management - GetMax</title>
        </Helmet>

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-blue-200">Loading organization data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>Organization Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold text-${theme.text} mb-2`}>
              Organization Management
            </h1>
            <p className={`text-${theme.textSecondary}`}>
              Configure your company's organizational structure
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            theme={userType}
            loading={refreshing}
            className="flex items-center space-x-2 text-white backdrop-blur-2xl hover:bg-white/30 hover:scale-110 hover:cursor-pointer text-lg transition-all duration-300"
          >
            <Activity className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Completion Stats */}
        <Card theme={userType} className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-${theme.text}`}>
              Setup Progress
            </h3>
            <span
              className={`text-2xl font-bold ${
                completion.score === 100 ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {completion.score}%
            </span>
          </div>

          <div className="w-full relative bg-gray-800/60 rounded-full h-2 overflow-hidden shadow-inner mb-4">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-in-out ${
                completion.score === 100
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-600"
              }`}
              style={{ width: `${completion.score}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              {completion.hasBasicStructure ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-${theme.text}`}>
                Basic Structure (Departments & Roles)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {completion.hasDesignations ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-400" />
              )}
              <span className={`text-${theme.text}`}>Job Designations</span>
            </div>

            <div className="flex items-center space-x-2">
              {completion.hasSubDepartments ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-400" />
              )}
              <span className={`text-${theme.text}`}>Sub-Departments</span>
            </div>
          </div>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {managementCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.count}
              subtitle={`${card.activeCount} active`}
              icon={card.icon}
              theme={userType}
              trend={card.count > 0 ? "up" : "neutral"}
            />
          ))}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {managementCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card
                key={card.title}
                theme={userType}
                className="p-6 group cursor-pointer transition-all duration-200 hover:scale-105"
                hoverable
              >
                <div onClick={() => navigate(card.path)}>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>

                  <h3
                    className={`text-xl font-semibold text-${theme.text} mb-2`}
                  >
                    {card.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{card.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-blue-400">
                        {card.count}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      theme={userType}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(card.path);
                      }}
                      className="group-hover:scale-105 transition-transform"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Organization Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary Stats */}
          <Card theme={userType} className="p-6">
            <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
              Organization Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Components:</span>
                <span className={`font-semibold text-${theme.text}`}>
                  {managementCards.reduce((sum, card) => sum + card.count, 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Components:</span>
                <span className="font-semibold text-green-400">
                  {managementCards.reduce(
                    (sum, card) => sum + card.activeCount,
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Setup Completion:</span>
                <span
                  className={`font-semibold ${
                    completion.score === 100
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {completion.score}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Department Levels:</span>
                <span className={`font-semibold text-${theme.text}`}>
                  {Math.max(
                    ...orgData.departments.map((d) => d.departmentLevel || 1),
                    1
                  )}
                </span>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card theme={userType} className="p-6">
            <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
              Recommended Next Steps
            </h3>
            <div className="space-y-3">
              {!completion.hasBasicStructure && (
                <div className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className={`font-medium text-${theme.text}`}>
                      Create Basic Structure
                    </p>
                    <p className="text-sm text-gray-400">
                      Start with departments and roles
                    </p>
                  </div>
                </div>
              )}

              {completion.hasBasicStructure && !completion.hasDesignations && (
                <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className={`font-medium text-${theme.text}`}>
                      Add Job Designations
                    </p>
                    <p className="text-sm text-gray-400">
                      Define employee job titles and levels
                    </p>
                  </div>
                </div>
              )}

              {completion.hasDesignations && !completion.hasSubDepartments && (
                <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className={`font-medium text-${theme.text}`}>
                      Create Sub-Departments
                    </p>
                    <p className="text-sm text-gray-400">
                      Organize teams within departments
                    </p>
                  </div>
                </div>
              )}

              {completion.score === 100 && (
                <div className="flex items-start space-x-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className={`font-medium text-${theme.text}`}>
                      Setup Complete!
                    </p>
                    <p className="text-sm text-gray-400">
                      Ready to add employees
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationOverview;
