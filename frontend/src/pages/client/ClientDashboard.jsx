// frontend/src/pages/client/ClientDashboard.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  FileText,
  Upload,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Calendar,
  Activity,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { ClientStatsCard } from "../../components/client/ClientStatsCard.jsx";
import { ClientOnboardingProgress } from "../../components/client/ClientOnboardingProcess.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ClientDashboard = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();
  const { clients, loading, error } = useClients();
  const [timeRange, setTimeRange] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const dashboardStats = useMemo(() => {
    if (!clients || clients.length === 0) {
      return {
        totalClients: 0,
        activeClients: 0,
        onboardingClients: 0,
        prospectClients: 0,
        recentActivity: [],
      };
    }

    const stats = {
      totalClients: clients.length,
      activeClients: clients.filter((c) => c.status?.clientStatus === "Active")
        .length,
      onboardingClients: clients.filter(
        (c) => c.status?.onboardingStatus === "In Progress"
      ).length,
      prospectClients: clients.filter(
        (c) => c.status?.clientStatus === "Prospect"
      ).length,
      recentActivity: clients
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    };

    return stats;
  }, [clients]);

  const handleQuickAction = (action) => {
    switch (action) {
      case "add-client":
        navigate("/employee/clients/intake");
        break;
      case "bulk-upload":
        navigate("/employee/clients/bulk-upload");
        break;
      case "view-all":
        navigate("/employee/clients/list");
        break;
      case "reports":
        navigate("/employee/clients/reports");
        break;
      default:
        break;
    }
  };

  console.log("Dashboard Stats:", dashboardStats);
  console.log("Dashboard Clients:", clients);
  
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">
          Error Loading Dashboard
        </h3>
        <p className={`text-${theme.textSecondary} mb-4`}>{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Client Dashboard - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Client Dashboard
              </h1>
              <p className={`text-${theme.textSecondary} text-lg`}>
                Overview of your client relationships and activities
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => handleQuickAction("add-client")}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickAction("bulk-upload")}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Bulk Upload</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ClientStatsCard
            title="Total Clients"
            value={dashboardStats.totalClients}
            icon={Users}
            trend={12}
          />
          <ClientStatsCard
            title="Active Clients"
            value={dashboardStats.activeClients}
            icon={CheckCircle}
            trend={8}
          />
          <ClientStatsCard
            title="Onboarding"
            value={dashboardStats.onboardingClients}
            icon={Clock}
            trend={-2}
          />
          <ClientStatsCard
            title="Prospects"
            value={dashboardStats.prospectClients}
            icon={TrendingUp}
            trend={15}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Status Distribution */}
            <Card className={`${theme.card} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">
                  Client Status Distribution
                </h3>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  options={[
                    { value: "7d", label: "Last 7 days" },
                    { value: "30d", label: "Last 30 days" },
                    { value: "90d", label: "Last 90 days" },
                    { value: "1y", label: "Last year" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {dashboardStats.activeClients}
                  </div>
                  <div className={`text-${theme.textSecondary} text-sm`}>
                    Active
                  </div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {dashboardStats.prospectClients}
                  </div>
                  <div className={`text-${theme.textSecondary} text-sm`}>
                    Prospects
                  </div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {dashboardStats.onboardingClients}
                  </div>
                  <div className={`text-${theme.textSecondary} text-sm`}>
                    Onboarding
                  </div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-gray-400 mb-1">
                    {dashboardStats.totalClients -
                      dashboardStats.activeClients -
                      dashboardStats.prospectClients -
                      dashboardStats.onboardingClients}
                  </div>
                  <div className={`text-${theme.textSecondary} text-sm`}>
                    Others
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className={`${theme.card} p-6`}>
              <h3 className="text-white text-lg font-semibold mb-6">
                Recent Client Activity
              </h3>
              <div className="space-y-4">
                {dashboardStats.recentActivity.map((client, index) => (
                  <div
                    key={client._id}

                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
                      >
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {client.clientInfo?.clientName}
                        </h4>
                        <p className={`text-${theme.textSecondary} text-sm`}>
                          {client.clientInfo?.clientType} • Added{" "}
                          {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          client.status?.clientStatus === "Active"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {client.status?.clientStatus}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/employee/clients/details/${client._id}`)
                        }
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions and Onboarding */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className={`${theme.card} p-6`}>
              <h3 className="text-white text-lg font-semibold mb-6">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickAction("add-client")}
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Add New Client
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickAction("bulk-upload")}
                >
                  <Upload className="w-4 h-4 mr-3" />
                  Bulk Upload Clients
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickAction("view-all")}
                >
                  <Users className="w-4 h-4 mr-3" />
                  View All Clients
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickAction("reports")}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Generate Reports
                </Button>
              </div>
            </Card>

            {/* Onboarding Progress */}
            <Card className={`${theme.card} p-6`}>
              <h3 className="text-white text-lg font-semibold mb-6">
                Onboarding Progress
              </h3>
              <div className="space-y-4">
                {clients
                  .filter((c) => c.status?.onboardingStatus === "In Progress")
                  .slice(0, 3)
                  .map((client) => (
                    <div key={client._id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          {client.clientInfo?.clientName}
                        </span>
                        <span className={`text-${theme.textSecondary} text-sm`}>
                          {client.status?.onboardingProgress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${theme.secondary} h-2 rounded-full transition-all duration-300`}
                          style={{
                            width: `${client.status?.onboardingProgress || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}

                {clients.filter(
                  (c) => c.status?.onboardingStatus === "In Progress"
                ).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle
                      className={`w-12 h-12 text-${theme.accent} mx-auto mb-3`}
                    />
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      All clients are fully onboarded!
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
