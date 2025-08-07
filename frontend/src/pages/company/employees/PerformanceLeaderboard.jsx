// frontend/src/pages/company/employees/PerformanceLeaderboard.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Trophy, Star, TrendingUp, Award, Filter } from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import {StatCard} from "../../../components/common/StatCard.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { employeeAPI } from "../../../api/employee.api.js";
import { useApi } from "../../../hooks/useApi.jsx";
import { getInitials } from "../../../lib/utils.js";

const PerformanceLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState("month");
  const [department, setDepartment] = useState("");

  const { loading, execute: fetchLeaderboard } = useApi(
    employeeAPI.getPerformanceLeaderboard
  );

  // Mock leaderboard data
  const mockLeaderboard = [
    {
      rank: 1,
      employeeId: "EMP-001",
      name: "Alice Johnson",
      department: "Engineering",
      points: 3200,
      tasksCompleted: 85,
      averageRating: 4.8,
      improvement: "+15%",
    },
    {
      rank: 2,
      employeeId: "EMP-002",
      name: "Bob Smith",
      department: "Engineering",
      points: 2890,
      tasksCompleted: 78,
      averageRating: 4.6,
      improvement: "+12%",
    },
    {
      rank: 3,
      employeeId: "EMP-003",
      name: "Carol Davis",
      department: "Marketing",
      points: 2750,
      tasksCompleted: 72,
      averageRating: 4.7,
      improvement: "+8%",
    },
    {
      rank: 4,
      employeeId: "EMP-004",
      name: "David Wilson",
      department: "Sales",
      points: 2650,
      tasksCompleted: 69,
      averageRating: 4.5,
      improvement: "+5%",
    },
    {
      rank: 5,
      employeeId: "EMP-005",
      name: "Eve Brown",
      department: "HR",
      points: 2320,
      tasksCompleted: 65,
      averageRating: 4.4,
      improvement: "+10%",
    },
  ];

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe, department]);

  const loadLeaderboard = async () => {
    // const data = await fetchLeaderboard({ timeframe, department });
    // if (data) setLeaderboard(data);
    setLeaderboard(mockLeaderboard); // Using mock data for now
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-6 h-6 text-orange-400" />;
    return <Star className="w-6 h-6 text-blue-400" />;
  };

  const getRankBadge = (rank) => {
    if (rank <= 3)
      return "bg-gradient-to-r from-yellow-400 to-orange-500 text-black";
    if (rank <= 10)
      return "bg-gradient-to-r from-blue-500 to-purple-500 text-white";
    return "bg-slate-700 text-gray-300";
  };

  const timeframeOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const departmentOptions = [
    { value: "", label: "All Departments" },
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "hr", label: "Human Resources" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <Helmet>
        <title>Performance Leaderboard - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Performance Leaderboard
            </h1>
            <p className="text-blue-200">
              Track top performers and recognize achievements
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              options={timeframeOptions}
            />
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={departmentOptions}
            />
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboard.slice(0, 3).map((performer, index) => (
            <Card
              key={performer.employeeId}
              theme="company"
              className="p-6 text-center"
            >
              <div className="mb-4">{getRankIcon(performer.rank)}</div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">
                  {getInitials(performer.name)}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {performer.name}
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                {performer.department}
              </p>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-yellow-400">
                  {performer.points}
                </div>
                <div className="text-sm text-gray-300">Points</div>
                <div className="text-green-400 text-sm">
                  {performer.improvement} from last month
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card theme="company" className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Full Rankings
          </h3>

          <div className="space-y-3">
            {leaderboard.map((performer) => (
              <div
                key={performer.employeeId}
                className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${getRankBadge(
                    performer.rank
                  )}`}
                >
                  {performer.rank}
                </div>

                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">
                    {getInitials(performer.name)}
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="text-white font-medium">{performer.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {performer.department}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {performer.points}
                    </div>
                    <div className="text-gray-400 text-xs">Points</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-bold text-lg">
                      {performer.tasksCompleted}
                    </div>
                    <div className="text-gray-400 text-xs">Tasks</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold text-lg">
                      {performer.averageRating}
                    </div>
                    <div className="text-gray-400 text-xs">Rating</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-bold text-lg">
                      {performer.improvement}
                    </div>
                    <div className="text-gray-400 text-xs">Growth</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceLeaderboard;
