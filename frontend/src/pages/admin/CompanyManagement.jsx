// frontend/src/pages/admin/CompanyManagement.jsx

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  X,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";

import ShowCompany from "./ShowCompany";
import DetailedCompany from './DetailedCompany';

export default function CompanyManagement(){
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch companies data from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/companies/all");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCompanies(data?.companies || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
                         company.subscriptionStatus?.toLowerCase() === selectedFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (subscriptionStatus) => {
    switch (subscriptionStatus?.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "trial":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPlanColor = (subscriptionPlan) => {
    switch (subscriptionPlan?.toLowerCase()) {
      case "enterprise":
        return "bg-purple-500/20 text-purple-400";
      case "professional":
        return "bg-blue-500/20 text-blue-400";
      case "basic":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-center">Loading companies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center mb-2">Error Loading Companies</h2>
          <p className="text-white/70 text-center mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full p-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg text-white font-medium transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              Companies ({filteredCompanies.length})
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
        {filteredCompanies.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
            <Building2 className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Companies Found</h3>
            <p className="text-white/60">
              {companies.length === 0 ? "No companies registered yet." : "No companies match your search criteria."}
            </p>
          </div>
        ) : (
          <ShowCompany
            filteredCompanies={filteredCompanies}
            handleViewCompany={handleViewCompany}
            formatDate={formatDate}
            getPlanColor={getPlanColor}
            getStatusColor={getStatusColor} 
          />
        )}
      </div>

      {/* View Company Details Modal */}
      {showViewModal && selectedCompany && (
        <DetailedCompany
          selectedCompany={selectedCompany}
          onClose={() => setShowViewModal(false)}
          formatDate={formatDate}
          getPlanColor={getPlanColor}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};