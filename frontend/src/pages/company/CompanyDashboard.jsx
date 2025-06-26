import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Calendar,
  Clock,
  Plus,
  Bell,
  Settings,
  BarChart3,
  UserCheck,
  UserX,
} from "lucide-react";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data - replace with actual API calls
  const companyInfo = {
    name: "TechCorp Solutions",
    plan: "Enterprise",
    totalEmployees: 245,
    activeEmployees: 189,
    pendingTasks: 23,
  };

  const stats = [
    { title: "Total Employees", value: "245", icon: Users, color: "blue" },
    { title: "Present Today", value: "189", icon: UserCheck, color: "green" },
    { title: "On Leave", value: "12", icon: UserX, color: "orange" },
    { title: "Pending Tasks", value: "23", icon: Clock, color: "purple" },
  ];

  const recentActivities = [
    { type: "checkin", user: "John Doe", time: "09:15 AM", status: "success" },
    {
      type: "leave",
      user: "Sarah Wilson",
      time: "08:45 AM",
      status: "pending",
    },
    {
      type: "task",
      user: "Mike Johnson",
      time: "08:30 AM",
      status: "completed",
    },
    {
      type: "checkout",
      user: "Emma Davis",
      time: "06:00 PM",
      status: "success",
    },
    {
      type: "overtime",
      user: "Alex Brown",
      time: "07:30 PM",
      status: "pending",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "checkin":
        return <UserCheck className="w-4 h-4" />;
      case "checkout":
        return <UserX className="w-4 h-4" />;
      case "leave":
        return <Calendar className="w-4 h-4" />;
      case "task":
        return <Clock className="w-4 h-4" />;
      case "overtime":
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-400 bg-green-500/20";
      case "pending":
        return "text-yellow-400 bg-yellow-500/20";
      case "completed":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {companyInfo.name}
                </h1>
                <p className="text-white/70">
                  {companyInfo.plan} Plan • {companyInfo.totalEmployees}{" "}
                  Employees
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
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/company/employees/add")}
                className="w-full p-4 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-3"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Employee</span>
              </button>
              <button
                onClick={() => navigate("/company/meetings/schedule")}
                className="w-full p-4 bg-green-600/80 hover:bg-green-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-3"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Meeting</span>
              </button>
              <button
                onClick={() => navigate("/company/reports")}
                className="w-full p-4 bg-purple-600/80 hover:bg-purple-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-3"
              >
                <BarChart3 className="w-5 h-5" />
                <span>View Reports</span>
              </button>
              <button
                onClick={() => navigate("/company/shifts")}
                className="w-full p-4 bg-orange-600/80 hover:bg-orange-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-3"
              >
                <Clock className="w-5 h-5" />
                <span>Manage Shifts</span>
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Recent Activities
              </h2>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(
                      activity.status
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.user}</p>
                    <p className="text-white/60 text-sm capitalize">
                      {activity.type.replace(/([A-Z])/g, " $1")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm">{activity.time}</p>
                    <p
                      className={`text-xs font-medium capitalize ${
                        activity.status === "success"
                          ? "text-green-400"
                          : activity.status === "pending"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }`}
                    >
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Today's Summary */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Today's Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Check-ins</span>
                <span className="text-white font-medium">189/245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">On Break</span>
                <span className="text-white font-medium">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Overtime</span>
                <span className="text-white font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Late Arrivals</span>
                <span className="text-white font-medium">5</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Team Meeting</p>
                  <p className="text-white/60 text-sm">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Monthly Review</p>
                  <p className="text-white/60 text-sm">Friday, 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Training Session</p>
                  <p className="text-white/60 text-sm">Next Monday, 9:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
