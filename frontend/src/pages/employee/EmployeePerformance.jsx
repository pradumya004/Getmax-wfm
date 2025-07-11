// frontend/src/pages/employee/EmployeePerformance.jsx
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Star,
  Trophy,
  Activity,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Timer,
  Eye,
  Zap,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { useEmployeePerformance } from "../../hooks/useEmployee.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate } from "../../lib/utils.js";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const EmployeePerformance = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { performance, loading, fetchPerformance } = useEmployeePerformance();

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [compareMode, setCompareMode] = useState(false);

  const periods = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
  ];

  const metrics = [
    { value: "overview", label: "Overview", icon: BarChart3 },
    { value: "tasks", label: "Tasks", icon: CheckCircle },
    { value: "quality", label: "Quality", icon: Award },
    { value: "time", label: "Time", icon: Clock },
    { value: "goals", label: "Goals", icon: Target },
  ];

  // Mock performance data
  const mockData = {
    overview: {
      currentScore: 92,
      previousScore: 88,
      tasksCompleted: 247,
      tasksTarget: 250,
      qualityScore: 94.2,
      averageTime: 2.3,
      productivity: 89,
      rank: 5,
      totalEmployees: 45,
    },
    trends: {
      last7Days: [85, 88, 92, 89, 94, 91, 95],
      last30Days: Array.from(
        { length: 30 },
        (_, i) => Math.floor(Math.random() * 20) + 80
      ),
    },
    achievements: [
      {
        title: "Quality Champion",
        description: "Maintained 95%+ quality for 30 days",
        icon: Award,
        achieved: true,
        date: "2024-01-15",
      },
      {
        title: "Speed Demon",
        description: "Complete 50+ tasks in a day",
        icon: Zap,
        achieved: true,
        date: "2024-01-12",
      },
      {
        title: "Consistency King",
        description: "Meet daily targets for 30 days",
        icon: Target,
        achieved: false,
        progress: 87,
      },
    ],
    goals: [
      {
        title: "Monthly Task Target",
        current: 247,
        target: 250,
        progress: 98.8,
        status: "on_track",
        dueDate: "2024-01-31",
      },
      {
        title: "Quality Improvement",
        current: 94.2,
        target: 95,
        progress: 99.2,
        status: "on_track",
        dueDate: "2024-01-31",
      },
      {
        title: "Time Efficiency",
        current: 2.3,
        target: 2.0,
        progress: 85,
        status: "needs_attention",
        dueDate: "2024-01-31",
      },
    ],
    teamComparison: {
      myScore: 92,
      teamAverage: 87,
      topPerformer: 96,
      bottomPerformer: 78,
    },
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous)
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (current < previous)
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4" />;
  };

  const getTrendColor = (current, previous) => {
    if (current > previous) return "text-green-500";
    if (current < previous) return "text-red-500";
    return "text-gray-500";
  };

  const getGoalStatusColor = (status) => {
    switch (status) {
      case "achieved":
        return "text-green-500";
      case "on_track":
        return "text-blue-500";
      case "needs_attention":
        return "text-yellow-500";
      case "at_risk":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getGoalStatusBadge = (status) => {
    switch (status) {
      case "achieved":
        return { variant: "success", label: "Achieved" };
      case "on_track":
        return { variant: "primary", label: "On Track" };
      case "needs_attention":
        return { variant: "warning", label: "Needs Attention" };
      case "at_risk":
        return { variant: "destructive", label: "At Risk" };
      default:
        return { variant: "secondary", label: status };
    }
  };

  useEffect(() => {
    fetchPerformance(selectedPeriod);
  }, [selectedPeriod, fetchPerformance]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" theme={userType} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-${theme.text}`}>
            Performance Dashboard
          </h1>
          <p className={`text-${theme.textSecondary}`}>
            Track your productivity and achievements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className={`w-4 h-4 text-${theme.textSecondary}`} />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-3 py-2 rounded-lg border border-${theme.border} bg-${theme.glass} text-${theme.text} focus:outline-none focus:ring-2 focus:ring-${theme.accent}`}
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            theme={userType}
            onClick={() => setCompareMode(!compareMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Compare
          </Button>
          <Button
            variant="outline"
            size="sm"
            theme={userType}
            onClick={() => fetchPerformance(selectedPeriod)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${theme.accent}/10`}>
              <TrendingUp className={`w-6 h-6 text-${theme.accent}`} />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(
                mockData.overview.currentScore,
                mockData.overview.previousScore
              )}
              <span
                className={`text-sm font-medium ${getTrendColor(
                  mockData.overview.currentScore,
                  mockData.overview.previousScore
                )}`}
              >
                {Math.abs(
                  mockData.overview.currentScore -
                    mockData.overview.previousScore
                )}
                %
              </span>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-${theme.text}`}>
              {mockData.overview.currentScore}%
            </h3>
            <p className={`text-sm text-${theme.textSecondary}`}>
              Overall Performance
            </p>
          </div>
        </Card>

        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${theme.accent}/10`}>
              <CheckCircle className={`w-6 h-6 text-${theme.accent}`} />
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium text-${theme.text}`}>
                {mockData.overview.tasksCompleted}/
                {mockData.overview.tasksTarget}
              </span>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-${theme.text}`}>
              {mockData.overview.tasksCompleted}
            </h3>
            <p className={`text-sm text-${theme.textSecondary}`}>
              Tasks Completed
            </p>
            <div className="mt-3">
              <Progress
                value={
                  (mockData.overview.tasksCompleted /
                    mockData.overview.tasksTarget) *
                  100
                }
                className="h-2"
                theme={userType}
              />
            </div>
          </div>
        </Card>

        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${theme.accent}/10`}>
              <Award className={`w-6 h-6 text-${theme.accent}`} />
            </div>
            <div className="flex items-center gap-1">
              <ArrowUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">+2.3%</span>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-${theme.text}`}>
              {mockData.overview.qualityScore}%
            </h3>
            <p className={`text-sm text-${theme.textSecondary}`}>
              Quality Score
            </p>
          </div>
        </Card>

        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${theme.accent}/10`}>
              <Clock className={`w-6 h-6 text-${theme.accent}`} />
            </div>
            <div className="flex items-center gap-1">
              <ArrowDown className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">-0.2h</span>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-${theme.text}`}>
              {mockData.overview.averageTime}h
            </h3>
            <p className={`text-sm text-${theme.textSecondary}`}>
              Avg. Task Time
            </p>
          </div>
        </Card>
      </div>

      {/* Metric Selection */}
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <Button
            key={metric.value}
            variant={selectedMetric === metric.value ? "default" : "outline"}
            size="sm"
            theme={userType}
            onClick={() => setSelectedMetric(metric.value)}
          >
            <metric.icon className="w-4 h-4 mr-2" />
            {metric.label}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card theme={userType} className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold text-${theme.text}`}>
              Performance Trends
            </h3>
            <Button variant="outline" size="sm" theme={userType}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Chart Placeholder */}
          <div
            className={`h-64 bg-${theme.glass} rounded-lg flex items-center justify-center relative`}
          >
            <div className="text-center">
              <BarChart3
                className={`w-16 h-16 text-${theme.textSecondary} mx-auto mb-4`}
              />
              <p className={`text-${theme.textSecondary} mb-2`}>
                {selectedMetric.charAt(0).toUpperCase() +
                  selectedMetric.slice(1)}{" "}
                Performance Chart
              </p>
              <p className={`text-sm text-${theme.textSecondary}`}>
                {selectedPeriod.charAt(0).toUpperCase() +
                  selectedPeriod.slice(1)}{" "}
                view
              </p>
            </div>

            {/* Mock chart elements */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-end h-16">
                {mockData.trends.last7Days.map((value, index) => (
                  <div
                    key={index}
                    className={`w-8 bg-${theme.accent}/20 rounded-t`}
                    style={{ height: `${(value / 100) * 4}rem` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className={`text-xl font-bold text-${theme.text}`}>
                {mockData.overview.productivity}%
              </div>
              <div className={`text-sm text-${theme.textSecondary}`}>
                Productivity
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold text-${theme.text}`}>
                #{mockData.overview.rank}
              </div>
              <div className={`text-sm text-${theme.textSecondary}`}>
                Team Rank
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold text-${theme.text}`}>
                {mockData.achievements.filter((a) => a.achieved).length}
              </div>
              <div className={`text-sm text-${theme.textSecondary}`}>
                Achievements
              </div>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Comparison */}
          {compareMode && (
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
                Team Comparison
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm text-${theme.textSecondary}`}>
                    My Score
                  </span>
                  <span className={`font-bold text-${theme.text}`}>
                    {mockData.teamComparison.myScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm text-${theme.textSecondary}`}>
                    Team Average
                  </span>
                  <span className={`font-medium text-${theme.text}`}>
                    {mockData.teamComparison.teamAverage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm text-${theme.textSecondary}`}>
                    Top Performer
                  </span>
                  <span className={`font-medium text-${theme.text}`}>
                    {mockData.teamComparison.topPerformer}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-center p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg">
                    <div className={`text-lg font-bold text-${theme.text}`}>
                      {(
                        (mockData.teamComparison.myScore /
                          mockData.teamComparison.teamAverage) *
                          100 -
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className={`text-sm text-${theme.textSecondary}`}>
                      Above team average
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Current Goals */}
          <Card theme={userType} className="p-6">
            <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
              Current Goals
            </h3>
            <div className="space-y-4">
              {mockData.goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-medium text-${theme.text}`}>
                        {goal.title}
                      </h4>
                      <p className={`text-sm text-${theme.textSecondary}`}>
                        Due: {formatDate(goal.dueDate)}
                      </p>
                    </div>
                    <Badge
                      variant={getGoalStatusBadge(goal.status).variant}
                      theme={userType}
                      size="sm"
                    >
                      {getGoalStatusBadge(goal.status).label}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className={`text-${theme.textSecondary}`}>
                        Progress
                      </span>
                      <span
                        className={`font-medium ${getGoalStatusColor(
                          goal.status
                        )} text-${theme.text}`}
                      >
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress
                      value={goal.progress}
                      className="h-2"
                      theme={userType}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Achievements */}
          <Card theme={userType} className="p-6">
            <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {mockData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border border-${theme.border} ${
                    achievement.achieved ? "bg-green-500/5" : "bg-gray-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.achieved
                          ? `bg-${theme.accent}/10`
                          : "bg-gray-500/10"
                      }`}
                    >
                      <achievement.icon
                        className={`w-5 h-5 ${
                          achievement.achieved
                            ? `text-${theme.accent}`
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium text-${theme.text}`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm text-${theme.textSecondary}`}>
                        {achievement.description}
                      </p>
                      {achievement.achieved ? (
                        <p className={`text-xs text-green-500 mt-1`}>
                          Achieved {formatDate(achievement.date)}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <Progress
                            value={achievement.progress}
                            className="h-1"
                            theme={userType}
                          />
                          <p
                            className={`text-xs text-${theme.textSecondary} mt-1`}
                          >
                            {achievement.progress}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Performance Insights */}
      <Card theme={userType} className="p-6">
        <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className={`font-medium text-${theme.text}`}>Strengths</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className={`text-sm text-${theme.text}`}>
                  Consistent quality delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className={`text-sm text-${theme.text}`}>
                  Above average productivity
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className={`text-sm text-${theme.text}`}>
                  Strong teamwork skills
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className={`font-medium text-${theme.text}`}>
              Areas for Improvement
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className={`text-sm text-${theme.text}`}>
                  Task completion speed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className={`text-sm text-${theme.text}`}>
                  Time management
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className={`font-medium text-${theme.text}`}>
              Recommendations
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className={`text-sm text-${theme.text}`}>
                  Focus on complex tasks first
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className={`text-sm text-${theme.text}`}>
                  Use time blocking technique
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployeePerformance;
