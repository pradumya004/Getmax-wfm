import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data - replace with actual API calls
  const stats = [
    {
      title: "Total Companies",
      value: "127",
      change: "+12%",
      icon: Building2,
      color: "blue",
    },
    {
      title: "Active Users",
      value: "1,834",
      change: "+8%",
      icon: Users,
      color: "green",
    },
    {
      title: "Monthly Revenue",
      value: "$24,890",
      change: "+15%",
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Growth Rate",
      value: "32%",
      change: "+5%",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const companies = [
    {
      id: "C001",
      name: "TechCorp Solutions",
      employees: 245,
      plan: "Enterprise",
      status: "Active",
      revenue: "$2,400",
    },
    {
      id: "C002",
      name: "HealthPlus Medical",
      employees: 89,
      plan: "Professional",
      status: "Active",
      revenue: "$1,200",
    },
    {
      id: "C003",
      name: "StartUp Hub",
      employees: 23,
      plan: "Basic",
      status: "Trial",
      revenue: "$400",
    },
    {
      id: "C004",
      name: "Global Industries",
      employees: 567,
      plan: "Enterprise",
      status: "Active",
      revenue: "$4,800",
    },
    {
      id: "C005",
      name: "Creative Agency",
      employees: 34,
      plan: "Professional",
      status: "Suspended",
      revenue: "$600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Trial":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Suspended":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "Enterprise":
        return "bg-purple-500/20 text-purple-400";
      case "Professional":
        return "bg-blue-500/20 text-blue-400";
      case "Basic":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-white/70">
                  Manage companies and monitor system performance
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/companies")}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
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

        {/* Companies Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl font-bold text-white">Companies</h2>

              <div className="flex space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search companies..."
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 appearance-none"
                  >
                    <option value="all" className="bg-slate-800">
                      All Status
                    </option>
                    <option value="active" className="bg-slate-800">
                      Active
                    </option>
                    <option value="trial" className="bg-slate-800">
                      Trial
                    </option>
                    <option value="suspended" className="bg-slate-800">
                      Suspended
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Companies Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Company
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Employees
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Plan
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Revenue
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr
                      key={company.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {company.name}
                            </p>
                            <p className="text-white/60 text-sm">
                              {company.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">
                        {company.employees}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(
                            company.plan
                          )}`}
                        >
                          {company.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            company.status
                          )}`}
                        >
                          {company.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white font-medium">
                        {company.revenue}
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-white/60 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
