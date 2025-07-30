// frontend/src/pages/employee/EmployeeDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
  Star,
  Activity,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  BarChart3,
  Trophy,
  Zap,
  AlertCircle,
  Play,
  Pause,
  FileText,
  MessageSquare,
  Bell,
  Settings,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import {
  useEmployee,
  useEmployeePerformance,
  useEmployeeTasks,
} from "../../hooks/useEmployee.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate } from "../../lib/utils.js";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const { employee, loading: profileLoading } = useEmployee();
  const { performance, loading: performanceLoading } = useEmployeePerformance();
  const { tasks, stats: taskStats, loading: tasksLoading } = useEmployeeTasks();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimer, setActiveTimer] = useState(false);
  const [workingHours, setWorkingHours] = useState(0);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (activeTimer) {
        setWorkingHours((prev) => prev + 1);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [activeTimer]);

  // Mock data for demonstration
  const mockData = {
    todayStats: {
      tasksCompleted: 12,
      tasksTarget: 15,
      hoursWorked: 6.5,
      qualityScore: 94,
      productivityScore: 89,
    },
    weeklyStats: {
      tasksCompleted: 68,
      averageDaily: 13.6,
      bestDay: 18,
      qualityTrend: 2.3,
    },
    recentTasks: [
      {
        id: 1,
        title: "Medical Claim Review",
        taskId: "CLM-2024-001",
        status: "in_progress",
        priority: "high",
        progress: 75,
        timeSpent: 45,
        dueDate: "2024-01-20",
      },
      {
        id: 2,
        title: "Dental Claim Processing",
        taskId: "CLM-2024-002",
        status: "completed",
        priority: "medium",
        progress: 100,
        timeSpent: 30,
        completedAt: "2024-01-19",
      },
      {
        id: 3,
        title: "Vision Claim Analysis",
        taskId: "CLM-2024-003",
        status: "pending",
        priority: "low",
        progress: 0,
        timeSpent: 0,
        dueDate: "2024-01-22",
      },
    ],
    achievements: [
      {
        id: 1,
        title: "Speed Champion",
        description: "Completed 15+ tasks in a day",
        icon: Zap,
        earned: true,
        date: "2024-01-19",
      },
      {
        id: 2,
        title: "Quality Master",
        description: "Maintained 95%+ quality for 7 days",
        icon: Award,
        earned: true,
        date: "2024-01-18",
      },
      {
        id: 3,
        title: "Perfect Week",
        description: "Complete all tasks on time for a week",
        icon: Trophy,
        earned: false,
        progress: 85,
      },
    ],
    gamification: {
      level: 5,
      currentXP: 2340,
      nextLevelXP: 2500,
      totalXP: 12340,
      rank: 3,
      totalEmployees: 45,
    },
    notifications: [
      {
        id: 1,
        type: "task",
        message: "New high priority task assigned",
        time: "5 min ago",
        read: false,
      },
      {
        id: 2,
        type: "achievement",
        message: 'You earned the "Speed Champion" badge!',
        time: "2 hours ago",
        read: false,
      },
      {
        id: 3,
        type: "reminder",
        message: "Monthly performance review due tomorrow",
        time: "1 day ago",
        read: true,
      },
    ],
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in_progress":
        return "text-blue-500";
      case "pending":
        return "text-yellow-500";
      case "overdue":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return { variant: "success", label: "Completed" };
      case "in_progress":
        return { variant: "primary", label: "In Progress" };
      case "pending":
        return { variant: "secondary", label: "Pending" };
      case "overdue":
        return { variant: "destructive", label: "Overdue" };
      default:
        return { variant: "secondary", label: status };
    }
  };

  const toggleTimer = () => {
    setActiveTimer(!activeTimer);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" theme={userType} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-${theme.text}`}>
            {getGreeting()}, {employee?.data?.personalInfo?.firstName || "Employee"}!
          </h1>
          <p className={`text-${theme.textSecondary} mt-1`}>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            theme={userType}
            onClick={toggleTimer}
            className={activeTimer ? "bg-green-500/10 border-green-500" : ""}
          >
            {activeTimer ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Work
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Work
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            theme={userType}
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Today's Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${theme.accent}/10`}>
              <CheckCircle className={`w-6 h-6 text-${theme.accent}`} />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+8%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-${theme.text}`}>
              {mockData.todayStats.tasksCompleted}
            </h3>
            <p className={`text-sm text-${theme.textSecondary}`}>
              Tasks Completed Today
            </p>
            <div className="mt-3">
              <Progress
                value={
                  (mockData.todayStats.tasksCompleted /
                    mockData.todayStats.tasksTarget) *
                  100
                }
                className="h-2"
                theme={userType}
              />
              <p className={`text-xs text-${theme.textSecondary} mt-1`}>
                {mockData.todayStats.tasksTarget -
                  mockData.todayStats.tasksCompleted}{" "}
                tasks to target
              </p>
            </div>
          </div>
        </Card>

        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${theme.accent}/10`}>
              <Clock className={`w-6 h-6 text-${theme.accent}`} />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+12%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-${theme.text}`}>
              {mockData.todayStats.hoursWorked}h
            </h3>
            <p className={`text-sm text-${theme.textSecondary}`}>
              Hours Worked Today
            </p>
            <div className="mt-3">
              <Progress
                value={(mockData.todayStats.hoursWorked / 8) * 100}
                className="h-2"
                theme={userType}
              />
              <p className={`text-xs text-${theme.textSecondary} mt-1`}>
                {8 - mockData.todayStats.hoursWorked}h remaining
              </p>
            </div>
          </div>
        </Card>

        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${theme.accent}/10`}>
              <Award className={`w-6 h-6 text-${theme.accent}`} />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+3%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-${theme.text}`}>
              {mockData.todayStats.qualityScore}%
            </h3>
            <p className={`text-sm text-${theme.textSecondary}`}>
              Quality Score
            </p>
            <div className="mt-3">
              <Progress
                value={mockData.todayStats.qualityScore}
                className="h-2"
                theme={userType}
              />
              <p className={`text-xs text-${theme.textSecondary} mt-1`}>
                Target: 95%
              </p>
            </div>
          </div>
        </Card>

        <Card theme={userType} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${theme.accent}/10`}>
              <TrendingUp className={`w-6 h-6 text-${theme.accent}`} />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+5%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold text-${theme.text}`}>
              {mockData.todayStats.productivityScore}%
            </h3>
            <p className={`text-sm text-${theme.textSecondary}`}>
              Productivity Score
            </p>
            <div className="mt-3">
              <Progress
                value={mockData.todayStats.productivityScore}
                className="h-2"
                theme={userType}
              />
              <p className={`text-xs text-${theme.textSecondary} mt-1`}>
                Above average
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <Card theme={userType} className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold text-${theme.text}`}>
              Recent Tasks
            </h3>
            <Button
              variant="outline"
              size="sm"
              theme={userType}
              onClick={() => navigate("/employee/tasks")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {mockData.recentTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border border-${theme.border} hover:bg-${theme.glass} transition-colors cursor-pointer`}
                onClick={() => navigate(`/employee/tasks/${task.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-medium text-${theme.text}`}>
                        {task.title}
                      </h4>
                      <Badge
                        variant={getStatusBadge(task.status).variant}
                        theme={userType}
                        size="sm"
                      >
                        {getStatusBadge(task.status).label}
                      </Badge>
                    </div>
                    <p className={`text-sm text-${theme.textSecondary} mb-3`}>
                      {task.taskId}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span
                            className={`text-sm text-${theme.textSecondary}`}
                          >
                            {task.timeSpent}m
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span
                            className={`text-sm text-${theme.textSecondary}`}
                          >
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm text-${theme.textSecondary}`}>
                          {task.status === "completed" ? "Completed" : "Due"}{" "}
                          {formatDate(task.completedAt || task.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {task.progress > 0 && task.progress < 100 && (
                  <div className="mt-3">
                    <Progress
                      value={task.progress}
                      className="h-2"
                      theme={userType}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Gamification Card */}
          <Card theme={userType} className="p-6">
            <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
              Level Progress
            </h3>
            <div className="text-center mb-4">
              <div
                className={`w-20 h-20 rounded-full bg-${theme.accent}/10 flex items-center justify-center mx-auto mb-3`}
              >
                <span className={`text-2xl font-bold text-${theme.accent}`}>
                  {mockData.gamification.level}
                </span>
              </div>
              <h4 className={`text-lg font-semibold text-${theme.text}`}>
                Level {mockData.gamification.level}
              </h4>
              <p className={`text-sm text-${theme.textSecondary}`}>
                Rank #{mockData.gamification.rank} of{" "}
                {mockData.gamification.totalEmployees}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm text-${theme.textSecondary}`}>
                  Experience Points
                </span>
                <span className={`text-sm font-medium text-${theme.text}`}>
                  {mockData.gamification.currentXP} /{" "}
                  {mockData.gamification.nextLevelXP}
                </span>
              </div>
              <Progress
                value={
                  (mockData.gamification.currentXP /
                    mockData.gamification.nextLevelXP) *
                  100
                }
                className="h-3"
                theme={userType}
              />
              <p className={`text-xs text-${theme.textSecondary} text-center`}>
                {mockData.gamification.nextLevelXP -
                  mockData.gamification.currentXP}{" "}
                XP to next level
              </p>
            </div>
          </Card>

          {/* Recent Achievements */}
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Achievements
              </h3>
              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={() => navigate("/employee/achievements")}
              >
                <Trophy className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {mockData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border border-${theme.border} ${
                    achievement.earned ? "bg-green-500/5" : "bg-gray-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned
                          ? `bg-${theme.accent}/10`
                          : "bg-gray-500/10"
                      }`}
                    >
                      <achievement.icon
                        className={`w-5 h-5 ${
                          achievement.earned
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
                      {achievement.earned ? (
                        <p className={`text-xs text-green-500 mt-1`}>
                          Earned {formatDate(achievement.date)}
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

          {/* Notifications */}
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold text-${theme.text}`}>
                Notifications
              </h3>
              <Button variant="outline" size="sm" theme={userType}>
                <Bell className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {mockData.notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border border-${theme.border} ${
                    !notification.read ? "bg-blue-500/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.read ? "bg-gray-400" : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium text-${theme.text}`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs text-${theme.textSecondary} mt-1`}>
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card theme={userType} className="p-6">
        <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            theme={userType}
            className="h-auto p-4 flex-col items-center justify-center gap-2"
            onClick={() => navigate("/employee/tasks")}
          >
            <FileText className="w-6 h-6" />
            <span>View Tasks</span>
          </Button>
          <Button
            variant="outline"
            theme={userType}
            className="h-auto p-4 flex-col items-center justify-center gap-2"
            onClick={() => navigate("/employee/performance")}
          >
            <BarChart3 className="w-6 h-6" />
            <span>Performance</span>
          </Button>
          <Button
            variant="outline"
            theme={userType}
            className="h-auto p-4 flex-col items-center justify-center gap-2"
            onClick={() => navigate("/employee/profile")}
          >
            <User className="w-6 h-6" />
            <span>My Profile</span>
          </Button>
          <Button
            variant="outline"
            theme={userType}
            className="h-auto p-4 flex-col items-center justify-center gap-2"
            onClick={() => navigate("/employee/settings")}
          >
            <Settings className="w-6 h-6" />
            <span>Settings</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
