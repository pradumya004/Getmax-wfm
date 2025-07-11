// frontend/src/pages/client/ClientReports.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Download,
  Users,
  TrendingUp,
  BarChart3,
  FileText,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Star as StarIcon,
  Zap as ZapIcon,
  Square as SquareIcon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Diamond as DiamondIcon,
  Heart as HeartIcon,
  Hexagon as HexagonIcon,
  Octagon as OctagonIcon,
  Pentagon as PentagonIcon,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { ClientStatsCard } from "../../components/client/ClientStatsCard.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate, formatCurrency } from "../../lib/utils.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ClientReports = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { clients, loading, error } = useClients();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate analytics data
  const analyticsData = React.useMemo(() => {
    if (!clients || clients.length === 0) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Basic metrics
    const totalClients = clients.length;
    const activeClients = clients.filter(
      (c) => c.status?.clientStatus === "Active"
    ).length;
    const prospectClients = clients.filter(
      (c) => c.status?.clientStatus === "Prospect"
    ).length;
    const onboardingClients = clients.filter(
      (c) => c.status?.onboardingStatus === "In Progress"
    ).length;
    const completedOnboarding = clients.filter(
      (c) => c.status?.onboardingStatus === "Completed"
    ).length;

    // Growth metrics
    const newClientsThisMonth = clients.filter((c) => {
      const createdDate = new Date(c.createdAt);
      return (
        createdDate.getMonth() === thisMonth &&
        createdDate.getFullYear() === thisYear
      );
    }).length;

    const recentActivity = clients.filter((c) => {
      const lastActivity = new Date(c.status?.lastActivityDate || c.createdAt);
      return lastActivity >= thirtyDaysAgo;
    }).length;

    // Client type distribution
    const clientTypes = clients.reduce((acc, client) => {
      const type = client.clientInfo?.clientType || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Onboarding completion rates
    const onboardingStats = clients.reduce(
      (acc, client) => {
        const progress = client.status?.onboardingProgress || 0;
        if (progress === 0) acc.notStarted++;
        else if (progress < 50) acc.early++;
        else if (progress < 100) acc.late++;
        else acc.completed++;
        return acc;
      },
      { notStarted: 0, early: 0, late: 0, completed: 0 }
    );

    // Regional distribution
    const regions = clients.reduce((acc, client) => {
      const state = client.addressInfo?.businessAddress?.state || "Unknown";
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    // Risk analysis
    const riskAnalysis = clients.reduce((acc, client) => {
      const risk = client.status?.riskLevel || "Unknown";
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {});

    // Service type analysis
    const serviceTypes = clients.reduce((acc, client) => {
      const service = client.serviceConfig?.serviceType || "Unknown";
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {});

    return {
      totalClients,
      activeClients,
      prospectClients,
      onboardingClients,
      completedOnboarding,
      newClientsThisMonth,
      recentActivity,
      clientTypes,
      onboardingStats,
      regions,
      riskAnalysis,
      serviceTypes,
      conversionRate:
        totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0,
      onboardingCompletionRate:
        totalClients > 0
          ? Math.round((completedOnboarding / totalClients) * 100)
          : 0,
      averageOnboardingTime: "14 days", // This would be calculated from actual data
      clientSatisfactionScore: "4.8/5", // This would come from surveys
    };
  }, [clients]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const reportData = {
        generatedAt: new Date(),
        period: selectedPeriod,
        metrics: selectedMetric,
        clientCount:
          selectedClients.length > 0 ? selectedClients.length : clients.length,
        data: analyticsData,
      };

      setReportData(reportData);
      toast.success("Report generated successfully!");
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = (format) => {
    if (!reportData) {
      toast.error("Please generate a report first");
      return;
    }

    // Simulate export
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const handleClientToggle = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    setSelectedClients(
      selectedClients.length === clients.length
        ? []
        : clients.map((client) => client._id)
    );
  };

  const filteredClients =
    clients?.filter(
      (client) =>
        !searchTerm ||
        client.clientInfo?.clientName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        client.clientInfo?.clientType
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    ) || [];

  // Table columns for client performance report
  const performanceColumns = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={selectedClients.length === filteredClients.length}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (client) => (
        <input
          type="checkbox"
          checked={selectedClients.includes(client._id)}
          onChange={() => handleClientToggle(client._id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      width: "50px",
    },
    {
      key: "clientName",
      header: "Client Name",
      render: (client) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
          >
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-medium">
              {client.clientInfo?.clientName}
            </div>
            <div className={`text-${theme.textSecondary} text-sm`}>
              {client.clientInfo?.clientType}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (client) => (
        <Badge
          className={
            client.status?.clientStatus === "Active"
              ? "bg-green-500/20 text-green-300 border-green-400/30"
              : client.status?.clientStatus === "Prospect"
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
              : "bg-gray-500/20 text-gray-300 border-gray-400/30"
          }
        >
          {client.status?.clientStatus}
        </Badge>
      ),
    },
    {
      key: "onboarding",
      header: "Onboarding",
      render: (client) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-700 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${theme.secondary} h-2 rounded-full`}
              style={{ width: `${client.status?.onboardingProgress || 0}%` }}
            ></div>
          </div>
          <span className={`text-${theme.textSecondary} text-sm`}>
            {client.status?.onboardingProgress || 0}%
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (client) => (
        <div className="text-white text-sm">{formatDate(client.createdAt)}</div>
      ),
    },
    {
      key: "risk",
      header: "Risk Level",
      render: (client) => (
        <Badge
          className={
            client.status?.riskLevel === "Low"
              ? "bg-green-500/20 text-green-300 border-green-400/30"
              : client.status?.riskLevel === "Medium"
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
              : "bg-red-500/20 text-red-300 border-red-400/30"
          }
        >
          {client.status?.riskLevel || "Unknown"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (client) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/employee/clients/details/${client._id}`)}
          className="flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </Button>
      ),
    },
  ];

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
          Error Loading Data
        </h3>
        <p className={`text-${theme.textSecondary} mb-4`}>{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Client Reports & Analytics - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/employee/clients/dashboard")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Client Reports & Analytics
              </h1>
              <p className={`text-${theme.textSecondary} text-lg`}>
                Insights and performance metrics for your client portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              options={[
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "90d", label: "Last 90 days" },
                { value: "1y", label: "Last year" },
                { value: "all", label: "All time" },
              ]}
            />
            <Button
              onClick={handleGenerateReport}
              loading={isGenerating}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        {analyticsData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ClientStatsCard
                title="Total Clients"
                value={analyticsData.totalClients}
                icon={Users}
                color="blue"
                trend={analyticsData.newClientsThisMonth}
              />
              <ClientStatsCard
                title="Active Clients"
                value={analyticsData.activeClients}
                icon={CheckCircle}
                color="green"
                trend={analyticsData.conversionRate}
              />
              <ClientStatsCard
                title="Onboarding"
                value={analyticsData.onboardingClients}
                icon={Clock}
                color="yellow"
                trend={analyticsData.onboardingCompletionRate}
              />
              <ClientStatsCard
                title="New This Month"
                value={analyticsData.newClientsThisMonth}
                icon={TrendingUp}
                color="purple"
                trend={25}
              />
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Client Status Distribution */}
                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Client Status Distribution
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-white">Active</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">
                            {analyticsData.activeClients}
                          </span>
                          <span
                            className={`text-${theme.textSecondary} text-sm`}
                          >
                            (
                            {Math.round(
                              (analyticsData.activeClients /
                                analyticsData.totalClients) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-white">Prospect</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">
                            {analyticsData.prospectClients}
                          </span>
                          <span
                            className={`text-${theme.textSecondary} text-sm`}
                          >
                            (
                            {Math.round(
                              (analyticsData.prospectClients /
                                analyticsData.totalClients) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-white">Onboarding</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">
                            {analyticsData.onboardingClients}
                          </span>
                          <span
                            className={`text-${theme.textSecondary} text-sm`}
                          >
                            (
                            {Math.round(
                              (analyticsData.onboardingClients /
                                analyticsData.totalClients) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Client Type Distribution */}
                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Client Type Distribution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analyticsData.clientTypes).map(
                        ([type, count]) => (
                          <div
                            key={type}
                            className="flex items-center justify-between"
                          >
                            <span className="text-white">{type}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">
                                {count}
                              </span>
                              <span
                                className={`text-${theme.textSecondary} text-sm`}
                              >
                                (
                                {Math.round(
                                  (count / analyticsData.totalClients) * 100
                                )}
                                %)
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </Card>

                  {/* Key Performance Indicators */}
                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Key Performance Indicators
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Conversion Rate
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.conversionRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Onboarding Completion
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.onboardingCompletionRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Avg. Onboarding Time
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.averageOnboardingTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Client Satisfaction
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.clientSatisfactionScore}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Recent Activity */}
                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Active in last 30 days
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.recentActivity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          New clients this month
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.newClientsThisMonth}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Completed onboarding
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.completedOnboarding}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <Card className={`${theme.card} p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-lg font-semibold">
                      Client Performance Report
                    </h3>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search clients..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleExportReport("csv")}
                        className="flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </Button>
                    </div>
                  </div>

                  <DataTable
                    columns={performanceColumns}
                    data={filteredClients}
                    loading={loading}
                    emptyState={{
                      title: "No clients found",
                      description: "No clients match your current filters.",
                      action: {
                        label: "Clear Filters",
                        onClick: () => setSearchTerm(""),
                      },
                    }}
                  />
                </Card>
              </TabsContent>

              {/* Onboarding Tab */}
              <TabsContent value="onboarding" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Onboarding Progress
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="text-white">Not Started</span>
                        </div>
                        <span className="text-white font-medium">
                          {analyticsData.onboardingStats.notStarted}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-white">
                            Early Stage (0-50%)
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {analyticsData.onboardingStats.early}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-white">
                            Late Stage (50-99%)
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {analyticsData.onboardingStats.late}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-white">Completed</span>
                        </div>
                        <span className="text-white font-medium">
                          {analyticsData.onboardingStats.completed}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Onboarding Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Completion Rate
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.onboardingCompletionRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Average Time
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.averageOnboardingTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Currently Onboarding
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.onboardingClients}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-${theme.textSecondary}`}>
                          Success Rate
                        </span>
                        <span className="text-white font-medium">94%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Demographics Tab */}
              <TabsContent value="demographics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Geographic Distribution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analyticsData.regions)
                        .slice(0, 5)
                        .map(([region, count]) => (
                          <div
                            key={region}
                            className="flex items-center justify-between"
                          >
                            <span className="text-white">{region}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">
                                {count}
                              </span>
                              <span
                                className={`text-${theme.textSecondary} text-sm`}
                              >
                                (
                                {Math.round(
                                  (count / analyticsData.totalClients) * 100
                                )}
                                %)
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Service Type Distribution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analyticsData.serviceTypes)
                        .slice(0, 5)
                        .map(([service, count]) => (
                          <div
                            key={service}
                            className="flex items-center justify-between"
                          >
                            <span className="text-white">{service}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">
                                {count}
                              </span>
                              <span
                                className={`text-${theme.textSecondary} text-sm`}
                              >
                                (
                                {Math.round(
                                  (count / analyticsData.totalClients) * 100
                                )}
                                %)
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  <Card className={`${theme.card} p-6`}>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Risk Analysis
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analyticsData.riskAnalysis).map(
                        ([risk, count]) => (
                          <div
                            key={risk}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  risk === "Low"
                                    ? "bg-green-500"
                                    : risk === "Medium"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span className="text-white">{risk} Risk</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">
                                {count}
                              </span>
                              <span
                                className={`text-${theme.textSecondary} text-sm`}
                              >
                                (
                                {Math.round(
                                  (count / analyticsData.totalClients) * 100
                                )}
                                %)
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Export Tab */}
              <TabsContent value="export" className="space-y-6">
                <Card className={`${theme.card} p-6`}>
                  <h3 className="text-white text-lg font-semibold mb-6">
                    Export Reports
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Report Configuration
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                          label="Report Type"
                          value={selectedMetric}
                          onChange={(e) => setSelectedMetric(e.target.value)}
                          options={[
                            { value: "all", label: "All Metrics" },
                            {
                              value: "performance",
                              label: "Performance Report",
                            },
                            { value: "onboarding", label: "Onboarding Report" },
                            {
                              value: "demographics",
                              label: "Demographics Report",
                            },
                            { value: "financial", label: "Financial Report" },
                          ]}
                        />

                        <Select
                          label="Time Period"
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          options={[
                            { value: "7d", label: "Last 7 days" },
                            { value: "30d", label: "Last 30 days" },
                            { value: "90d", label: "Last 90 days" },
                            { value: "1y", label: "Last year" },
                            { value: "all", label: "All time" },
                          ]}
                        />

                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">
                            Selected Clients
                          </label>
                          <div className="text-white">
                            {selectedClients.length > 0
                              ? `${selectedClients.length} selected`
                              : "All clients"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Export Options
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button
                          variant="outline"
                          onClick={() => handleExportReport("pdf")}
                          className="flex items-center space-x-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Export PDF</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleExportReport("csv")}
                          className="flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleExportReport("excel")}
                          className="flex items-center space-x-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Export Excel</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleExportReport("json")}
                          className="flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export JSON</span>
                        </Button>
                      </div>
                    </div>

                    {reportData && (
                      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">
                            Report Generated Successfully
                          </span>
                        </div>
                        <p className={`text-${theme.textSecondary} text-sm`}>
                          Generated on {formatDate(reportData.generatedAt)} •{" "}
                          {reportData.clientCount} clients included
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientReports;