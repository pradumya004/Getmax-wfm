import React, { useState } from "react";
import {
  Shield,
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock companies data
  const companies = [
    {
      id: "C001",
      name: "TechCorp Solutions",
      contactPerson: "John Smith",
      email: "admin@techcorp.com",
      phone: "+1-555-0123",
      employees: 245,
      plan: "Enterprise",
      status: "Active",
      revenue: "$2,400",
      joinDate: "2024-01-15",
      address: "123 Tech Street, San Francisco, CA",
    },
    {
      id: "C002",
      name: "HealthPlus Medical",
      contactPerson: "Dr. Sarah Wilson",
      email: "contact@healthplus.com",
      phone: "+1-555-0456",
      employees: 89,
      plan: "Professional",
      status: "Active",
      revenue: "$1,200",
      joinDate: "2024-02-20",
      address: "456 Medical Ave, New York, NY",
    },
    {
      id: "C003",
      name: "StartUp Hub",
      contactPerson: "Mike Johnson",
      email: "hello@startuphub.com",
      phone: "+1-555-0789",
      employees: 23,
      plan: "Basic",
      status: "Trial",
      revenue: "$400",
      joinDate: "2024-03-10",
      address: "789 Innovation Blvd, Austin, TX",
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
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Company Management
                </h1>
                <p className="text-white/70">
                  Manage all registered companies and their details
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold text-white">
              Companies ({companies.length})
            </h2>

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

        {/* Companies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{company.name}</h3>
                    <p className="text-white/60 text-sm">{company.id}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="text-white/60 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Company Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">
                    {company.employees} employees
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">
                    Joined {company.joinDate}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">
                    {company.revenue}/month
                  </span>
                </div>
              </div>

              {/* Status and Plan */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(
                    company.plan
                  )}`}
                >
                  {company.plan}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    company.status
                  )}`}
                >
                  {company.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="border-t border-white/10 pt-4 mb-4">
                <p className="text-white font-medium text-sm">
                  {company.contactPerson}
                </p>
                <p className="text-white/60 text-sm">{company.email}</p>
                <p className="text-white/60 text-sm">{company.phone}</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 px-3 py-2 bg-green-600/80 hover:bg-green-600 rounded-lg text-white text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="px-3 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-white text-sm font-medium transition-all duration-300 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Company</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
              />
              <input
                type="email"
                placeholder="Contact Email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Contact Person"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
              />
              <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300">
                <option value="" className="bg-slate-800">
                  Select Plan
                </option>
                <option value="basic" className="bg-slate-800">
                  Basic
                </option>
                <option value="professional" className="bg-slate-800">
                  Professional
                </option>
                <option value="enterprise" className="bg-slate-800">
                  Enterprise
                </option>
              </select>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-white hover:from-red-700 hover:to-orange-700 transition-all duration-300"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
