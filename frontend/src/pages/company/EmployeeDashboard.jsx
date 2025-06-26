import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Clock,
  Calendar,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  LogOut,
  Coffee,
  Bell,
  Settings,
} from "lucide-react";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock employee data
  const employee = {
    name: "John Doe",
    employeeId: "EMP001",
    department: "Development",
    position: "Senior Developer",
  };

  const todayStats = {
    checkInTime: "09:15 AM",
    workingHours: "7h 30m",
    breakTime: "45m",
    tasksCompleted: 8,
  };

  const recentTasks = [
    {
      id: 1,
      title: "Complete user authentication module",
      status: "completed",
      time: "2h ago",
    },
    {
      id: 2,
      title: "Review pull request #234",
      status: "in-progress",
      time: "30m ago",
    },
    {
      id: 3,
      title: "Update project documentation",
      status: "pending",
      time: "1h ago",
    },
    {
      id: 4,
      title: "Bug fix: Login validation",
      status: "completed",
      time: "3h ago",
    },
  ];

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const handleBreak = () => {
    setIsOnBreak(!isOnBreak);
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {employee.name}
                </h1>
                <p className="text-white/70">
                  {employee.position} • {employee.employeeId}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-white/70 text-sm">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>

              <button className="relative p-2 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
              </button>

              <button className="p-2 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Clock In/Out Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {employee.name.split(" ")[0]}!
              </h2>
              <p className="text-white/70">
                {isCheckedIn
                  ? `You clocked in at ${todayStats.checkInTime}`
                  : "Ready to start your day?"}
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCheckIn}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                  isCheckedIn
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isCheckedIn ? (
                  <LogOut className="w-5 h-5" />
                ) : (
                  <PlayCircle className="w-5 h-5" />
                )}
                <span>{isCheckedIn ? "Clock Out" : "Clock In"}</span>
              </button>

              {isCheckedIn && (
                <button
                  onClick={handleBreak}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                    isOnBreak
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-yellow-600 hover:bg-yellow-700 text-white"
                  }`}
                >
                  {isOnBreak ? (
                    <PlayCircle className="w-5 h-5" />
                  ) : (
                    <Coffee className="w-5 h-5" />
                  )}
                  <span>{isOnBreak ? "End Break" : "Take Break"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Stats */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Today's Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">Check-in Time</span>
                </div>
                <span className="text-white font-medium">
                  {todayStats.checkInTime}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <PlayCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-white/70">Working Hours</span>
                </div>
                <span className="text-white font-medium">
                  {todayStats.workingHours}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Coffee className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70">Break Time</span>
                </div>
                <span className="text-white font-medium">
                  {todayStats.breakTime}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                  <span className="text-white/70">Tasks Done</span>
                </div>
                <span className="text-white font-medium">
                  {todayStats.tasksCompleted}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Tasks</h3>
              <button className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex-shrink-0 mt-1">
                    {task.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : task.status === "in-progress" ? (
                      <PlayCircle className="w-5 h-5 text-blue-400" />
                    ) : (
                      <PauseCircle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{task.title}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getTaskStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status.replace("-", " ")}
                      </span>
                      <span className="text-white/60 text-sm">{task.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/employee/schedule")}
              className="p-4 bg-green-600/80 hover:bg-green-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-3"
            >
              <Calendar className="w-5 h-5" />
              <span>View Schedule</span>
            </button>
            <button
              onClick={() => navigate("/employee/tasks/submit")}
              className="p-4 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-3"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Submit Task</span>
            </button>
            <button
              onClick={() => navigate("/employee/leave/request")}
              className="p-4 bg-purple-600/80 hover:bg-purple-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-3"
            >
              <Clock className="w-5 h-5" />
              <span>Request Leave</span>
            </button>
            <button
              onClick={() => navigate("/employee/profile")}
              className="p-4 bg-yellow-600/80 hover:bg-yellow-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-3"
            >
              <User className="w-5 h-5" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
