// frontend/src/pages/employee/MyPerformance.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Star,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import {StatCard} from "../../components/common/StatCard.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { employeeAPI } from "../../api/employee.api.js";
import { useApi } from "../../hooks/useApi.jsx";

const MyPerformance = () => {
  const [performance, setPerformance] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const { loading: performanceLoading, execute: fetchPerformance } = useApi(
    employeeAPI.getMyProfile
  );
  const { loading: leaderboardLoading, execute: fetchLeaderboard } = useApi(
    employeeAPI.getPerformanceLeaderboard
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [performanceData, leaderboardData] = await Promise.all([
      fetchPerformance(),
      fetchLeaderboard(),
    ]);

    if (performanceData) setPerformance(performanceData);
    if (leaderboardData) setLeaderboard(leaderboardData);
  };

  // Mock performance data (since backend might not have this yet)
  const mockPerformanceData = {
    currentRank: 5,
    totalPoints: 2450,
    completedTasks: 48,
    pendingTasks: 3,
    averageRating: 4.2,
    monthlyGoal: 50,
    achievements: [
      {
        id: 1,
        name: "Task Master",
        description: "Completed 50 tasks",
        icon: Target,
        earned: true,
      },
      {
        id: 2,
        name: "Speed Demon",
        description: "Fastest completion time",
        icon: TrendingUp,
        earned: true,
      },
      {
        id: 3,
        name: "Quality Star",
        description: "Average rating above 4.0",
        icon: Star,
        earned: true,
      },
      {
        id: 4,
        name: "Monthly Champion",
        description: "Top performer this month",
        icon: Trophy,
        earned: false,
      },
    ],
  };

  const mockLeaderboard = [
    { rank: 1, name: "Alice Johnson", points: 3200, avatar: "AJ" },
    { rank: 2, name: "Bob Smith", points: 2890, avatar: "BS" },
    { rank: 3, name: "Carol Davis", points: 2750, avatar: "CD" },
    { rank: 4, name: "David Wilson", points: 2650, avatar: "DW" },
    { rank: 5, name: "You", points: 2450, avatar: "ME", isCurrentUser: true },
    { rank: 6, name: "Eve Brown", points: 2320, avatar: "EB" },
    { rank: 7, name: "Frank Miller", points: 2180, avatar: "FM" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 p-6">
      <Helmet>
        <title>My Performance - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Performance</h1>
          <p className="text-emerald-200">
            Track your progress and achievements
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Current Rank"
            value={`#${mockPerformanceData.currentRank}`}
            icon={Trophy}
            theme="employee"
          />
          <StatCard
            title="Total Points"
            value={mockPerformanceData.totalPoints}
            change={15}
            icon={Award}
            theme="employee"
          />
          <StatCard
            title="Tasks Completed"
            value={mockPerformanceData.completedTasks}
            icon={Target}
            theme="employee"
          />
          <StatCard
            title="Average Rating"
            value={mockPerformanceData.averageRating}
            type="number"
            icon={Star}
            theme="employee"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress & Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Progress */}
            <Card theme="employee" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Monthly Progress
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Tasks Completed</span>
                    <span className="text-white font-medium">
                      {mockPerformanceData.completedTasks} /{" "}
                      {mockPerformanceData.monthlyGoal}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (mockPerformanceData.completedTasks /
                            mockPerformanceData.monthlyGoal) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-emerald-400 text-sm mt-1">
                    {mockPerformanceData.monthlyGoal -
                      mockPerformanceData.completedTasks}{" "}
                    tasks remaining
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Quality Score</span>
                    <span className="text-white font-medium">
                      {mockPerformanceData.averageRating} / 5.0
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (mockPerformanceData.averageRating / 5) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card theme="employee" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Achievements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPerformanceData.achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        achievement.earned
                          ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/50"
                          : "bg-slate-800/50 border-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            achievement.earned
                              ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                              : "bg-slate-700"
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              achievement.earned
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              achievement.earned
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          >
                            {achievement.name}
                          </h4>
                          {achievement.earned && (
                            <Badge variant="success" className="text-xs">
                              Earned
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p
                        className={`text-sm ${
                          achievement.earned ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {achievement.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <Card theme="employee" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Team Leaderboard
              </h3>

              <div className="space-y-3">
                {mockLeaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      player.isCurrentUser
                        ? "bg-emerald-500/20 border border-emerald-500/30"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        player.rank <= 3
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                          : player.isCurrentUser
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-black"
                          : "bg-slate-700 text-gray-300"
                      }`}
                    >
                      {player.rank}
                    </div>

                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-xs">
                        {player.avatar}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          player.isCurrentUser
                            ? "text-emerald-400"
                            : "text-white"
                        }`}
                      >
                        {player.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {player.points} points
                      </p>
                    </div>

                    {player.rank <= 3 && (
                      <Trophy className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPerformance;