// frontend/src/pages/employee/EmployeeFilter.jsx

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

export default function EmployeeFilter({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  companyFilter,
  setCompanyFilter,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const mockRoles = ["AR Caller", "QA Specialist", "Team Lead"];
  const mockCompanies = ["TechCorp Solutions", "Healthcare Plus", "MedBilling Inc"];

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Top Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Search */}
        <div className="flex-1 relative group">
          <Search className="absolute top-3.5 left-4 h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, company, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/50 backdrop-blur-md text-white pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 hover:bg-slate-800/70"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => {
                setShowFilters((prev) => !prev);
                setRoleFilter("All");
                setCompanyFilter("All");
                setSearch("");
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              showFilters
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                : "bg-gradient-to-r from-slate-700 to-slate-800 text-white"
            }`}
          >
            {showFilters ? "Cancel Filters" : "Filters"}
          </button>

          <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 whitespace-nowrap">
            <Plus size={18} className="inline mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 backdrop-blur-md">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none"
          >
            <option value="All">All Roles</option>
            {mockRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Placeholder filters */}
          <select className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none">
            <option value="">By Department</option>
            <option value="Revenue Cycle">Revenue Cycle</option>
            <option value="Operations">Operations</option>
            <option value="Quality Assurance">Quality Assurance</option>
          </select>

          <select className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none">
            <option value="">By Subdepartment</option>
            <option value="Team A">Team A</option>
            <option value="Team B">Team B</option>
          </select>

          <select className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none">
            <option value="">By Designation</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>
    </div>
  );
}
