// frontend/src/pages/employee/EmployeeDashboard.jsx

// Employee Dashboard - Personal work overview and performance metrics

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  User,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  Bell,
  Star,
  Activity,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit3,
  Camera,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Components
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ProfileCard from "./ProfileCard.jsx";
import PerformanceStats from "../../components/employee/PerformanceStats.jsx";
import LeaderboardCard from "../../components/employee/LeaderboardCard.jsx";

// API
import { employeeAPI } from "../../api/employee.api.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import {getTheme} from "../../lib/theme.js";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const theme = getTheme(userType);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    stats: null,
    performance: null,
    leaderboard: null,
    notifications: [],
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch employee profile and performance data
      const [profileResponse] = await Promise.all([employeeAPI.getMyProfile()]);

      console.log("Profile Response:", profileResponse);

      const profile = profileResponse.data.data;
      console.log("Profile Data:", profile);

      setDashboardData({
        profile: profile,
        performance: profile.performanceMetrics,
        // Mock data for other sections - replace with actual API calls when available
        stats: {
          tasksCompleted: 45,
          tasksInProgress: 8,
          upcomingDeadlines: 3,
          totalHoursWorked: 38.5,
        },
        leaderboard: [
          { name: "John Doe", points: 950, rank: 1 },
          { name: "Jane Smith", points: 875, rank: 2 },
          {
            name:
              user?.personalInfo?.firstName +
              " " +
              user?.personalInfo?.lastName,
            points: 820,
            rank: 3,
          },
        ],
        notifications: [
          {
            id: 1,
            message: "New task assigned: Project Alpha Review",
            time: "2 hours ago",
            type: "task",
          },
          {
            id: 2,
            message: "Team meeting scheduled for tomorrow at 10 AM",
            time: "4 hours ago",
            type: "meeting",
          },
          {
            id: 3,
            message: "Performance review completed",
            time: "1 day ago",
            type: "achievement",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const { profile, stats, performance, leaderboard, notifications } =
    dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 p-6">
      <Helmet>
        <title>Employee Dashboard - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile?.personalInfo?.firstName || "Employee"}! 👋
            </h1>
            <p className="text-green-200">
              Here's your work overview for today
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              theme="employee"
              variant="outline"
              onClick={() => navigate("/employee/profile/edit")}
              className="inline-flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
            <Button
              theme="employee"
              onClick={() => navigate("/employee/performance")}
              className="inline-flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Performance</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tasks Completed"
            value={stats?.tasksCompleted || 0}
            icon={CheckCircle}
            theme="employee"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="In Progress"
            value={stats?.tasksInProgress || 0}
            icon={Clock}
            theme="employee"
          />
          <StatCard
            title="Hours This Week"
            value={`${stats?.totalHoursWorked || 0}h`}
            icon={Activity}
            theme="employee"
          />
          <StatCard
            title="Upcoming Deadlines"
            value={stats?.upcomingDeadlines || 0}
            icon={AlertCircle}
            theme="employee"
            variant={stats?.upcomingDeadlines > 0 ? "warning" : "default"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <ProfileCard employee={profile} />

            {/* Performance Overview */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Performance Overview
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/employee/performance")}
                    className="text-green-400 hover:text-green-300"
                  >
                    View Details →
                  </Button>
                </div>

                <PerformanceStats performance={performance} />
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Recent Activity
                </h3>

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {notification.type === "task" && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {notification.type === "meeting" && (
                          <Calendar className="w-5 h-5 text-blue-400" />
                        )}
                        {notification.type === "achievement" && (
                          <Award className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          {notification.message}
                        </p>
                        <p className="text-green-300 text-xs mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <Button
                    theme="employee"
                    variant="outline"
                    onClick={() => navigate("/employee/profile/edit")}
                    className="w-full justify-start"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>

                  <Button
                    theme="employee"
                    variant="outline"
                    onClick={() => navigate("/employee/profile/avatar")}
                    className="w-full justify-start"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Avatar
                  </Button>

                  <Button
                    theme="employee"
                    variant="outline"
                    onClick={() => navigate("/employee/performance")}
                    className="w-full justify-start"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Performance
                  </Button>
                </div>
              </div>
            </Card>

            {/* Team Leaderboard */}
            <LeaderboardCard leaderboard={leaderboard} />

            {/* Current Level & XP */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Your Progress
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-200">Current Level</span>
                    <Badge variant="success">
                      Level{" "}
                      {profile?.gamification?.experience?.currentLevel || 1}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-green-200">Total XP</span>
                    <span className="text-white font-semibold">
                      {profile?.gamification?.experience?.totalXP || 0} XP
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-green-200">Profile Completion</span>
                    <span className="text-white font-semibold">
                      {profile?.systemInfo?.profileCompletionPercentage || 0}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          profile?.systemInfo?.profileCompletionPercentage || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Company Info */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Company Info
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-200">Company</span>
                    <span className="text-white">
                      {profile?.companyRef?.companyName || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-green-200">Department</span>
                    <span className="text-white">
                      {profile?.departmentRef?.departmentName || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-green-200">Role</span>
                    <span className="text-white">
                      {profile?.roleRef?.roleName || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-green-200">Employee ID</span>
                    <span className="text-white font-mono">
                      {profile?.employeeId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
