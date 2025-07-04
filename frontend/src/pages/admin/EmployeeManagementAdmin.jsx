import React, { useState, useEffect } from "react";
import { Plus, Search, Users, ShieldCheck, Activity, Mail, Eye, Edit3, MapPin, Calendar, Star, TrendingUp, Loader2 } from "lucide-react";
import EmployeeFilter from "./EmployeeFilterAdmin.jsx";

// Employee Card Component
function EmployeeCard({ emp, idx, onView }) {
  return (
    <div
      className="group relative flex items-center p-4 bg-gradient-to-r from-slate-800/40 to-slate-800/60 rounded-xl border border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-xl hover:shadow-lg hover:shadow-emerald-500/10 transform hover:-translate-y-0.5 overflow-hidden"
      style={{
        animation: `slideInRight 0.4s ease-out ${0.05 * idx}s both`
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/3 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-black font-bold flex items-center justify-center text-sm shadow-md group-hover:shadow-emerald-400/30 transition-all duration-300">
          {emp.initials}
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-slate-800 animate-pulse" />
      </div>

      {/* Employee Info */}
      <div className="flex-1 ml-4 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-white font-semibold text-lg truncate group-hover:text-emerald-400 transition-colors">
            {emp.name}
          </h4>
          <span className="text-xs bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30 flex-shrink-0">
            {emp.role}
          </span>
        </div>
        
        <div className="text-sm text-slate-300 mb-2">
          <span className="font-medium text-blue-400">{emp.companyName}</span>
          <span className="mx-2 text-slate-500">•</span>
          <span>{emp.empId}</span>
          <span className="mx-2 text-slate-500">•</span>
          <span className="flex items-center gap-1 inline-flex">
            <MapPin size={10} />
            {emp.location}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Mail size={10} />
          <span className="truncate">{emp.email}</span>
        </div>
      </div>

      {/* Stats - Horizontal layout */}
      <div className="hidden md:flex items-center gap-6 mx-6 text-sm">
        <div className="text-center">
          <div className="text-xs text-slate-400">Productivity</div>
          <div className="text-blue-400 font-semibold">{emp.productivity}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-400">QA Score</div>
          <div className="text-purple-400 font-semibold">{emp.qaScore}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-400">Experience</div>
          <div className="text-orange-400 font-semibold">{emp.xp}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-400">Status</div>
          <div className="text-green-400 font-semibold">{emp.sow}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <button 
          onClick={() => onView(emp)}
          className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-1.5 shadow-md hover:shadow-emerald-500/25"
        >
          <Eye size={14} />
          <span className="hidden sm:inline">View</span>
        </button>
        <button className="px-3 py-1.5 text-sm rounded-lg border border-emerald-400/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300 flex items-center gap-1.5">
          <Edit3 size={14} />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
} 
export default function EmployeeManagementAdmin() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Static employee data for demonstration
  const staticEmployees = [
    {
      empId: "EMP001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "AR Caller",
      companyName: "TechCorp Solutions",
      initials: "SJ",
      sow: "Active",
      productivity: "94%",
      qaScore: "8.7/10",
      xp: "2.5 years",
      joinDate: "Jan 2022",
      department: "Revenue Cycle",
      location: "Remote",
      status: "Active",
      lastLogin: "2 hours ago",
      performance: "Excellent",
      projects: 12,
      completionRate: "96%"
    },
    {
      empId: "EMP002",
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "QA Specialist",
      companyName: "Healthcare Plus",
      initials: "MC",
      sow: "Active",
      productivity: "89%",
      qaScore: "9.2/10",
      xp: "3.1 years",
      joinDate: "Aug 2021",
      department: "Quality Assurance",
      location: "New York",
      status: "Active",
      lastLogin: "1 hour ago",
      performance: "Excellent",
      projects: 18,
      completionRate: "98%"
    },
    {
      empId: "EMP003",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "Team Lead",
      companyName: "MedBilling Inc",
      initials: "ER",
      sow: "Active",
      productivity: "97%",
      qaScore: "9.5/10",
      xp: "4.2 years",
      joinDate: "Mar 2020",
      department: "Operations",
      location: "California",
      status: "Active",
      lastLogin: "30 min ago",
      performance: "Outstanding",
      projects: 25,
      completionRate: "99%"
    },
    {
      empId: "EMP004",
      name: "David Kim",
      email: "david.kim@company.com",
      role: "AR Caller",
      companyName: "TechCorp Solutions",
      initials: "DK",
      sow: "Active",
      productivity: "91%",
      qaScore: "8.3/10",
      xp: "1.8 years",
      joinDate: "May 2023",
      department: "Revenue Cycle",
      location: "Texas",
      status: "Active",
      lastLogin: "3 hours ago",
      performance: "Good",
      projects: 8,
      completionRate: "94%"
    }
  ];

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/employee/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        
        const data = await response.json();
        
        // If no data from backend, use static employees
        if (!data || data.length === 0) {
          setEmployees(staticEmployees);
        } else {
          setEmployees(data);
        }
      } catch (err) {
        console.log('Backend not available, using static data');
        setEmployees(staticEmployees);
        setError(null); // Don't show error for demo purposes
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const statCards = [
    { 
      title: "Total Employees", 
      icon: <Users className="text-emerald-400" />, 
      value: employees.length,
      change: "+12%",
      color: "from-emerald-500/20 to-teal-500/20"
    },
    { 
      title: "Active Today", 
      icon: <ShieldCheck className="text-blue-400" />, 
      value: employees.filter(emp => emp.status === "Active").length,
      change: "+5%",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    { 
      title: "Avg Productivity", 
      icon: <TrendingUp className="text-purple-400" />, 
      value: "94%",
      change: "+3%",
      color: "from-purple-500/20 to-pink-500/20"
    },
    { 
      title: "Login Activated", 
      icon: <Mail className="text-orange-400" />, 
      value: employees.length,
      change: "+8%",
      color: "from-orange-500/20 to-red-500/20"
    },
  ];

  const filteredEmployees = employees.filter(emp =>
    (roleFilter === "All" || emp.role === roleFilter) &&
    (companyFilter === "All" || emp.companyName === companyFilter) &&
    (emp.name.toLowerCase().includes(search.toLowerCase()) ||
     emp.companyName.toLowerCase().includes(search.toLowerCase()) ||
     emp.empId.toLowerCase().includes(search.toLowerCase()))
  );

  // Get unique companies and roles for filters
  const uniqueCompanies = [...new Set(employees.map(emp => emp.companyName))];
  const uniqueRoles = [...new Set(employees.map(emp => emp.role))];

  // Group employees by role for categorization
  const employeesByRole = uniqueRoles.reduce((acc, role) => {
    acc[role] = filteredEmployees.filter(emp => emp.role === role);
    return acc;
  }, {});

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    // This will be used when you create the detailed view component
    console.log("Viewing employee:", employee);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-emerald-400" />
          <p className="text-lg">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-4xl p-1 font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Employee Management
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Manage your team with powerful insights and seamless workflow
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${card.color} border border-white/10 text-white backdrop-blur-xl hover:scale-105 transition-all duration-500 hover:border-emerald-400/50 overflow-hidden`}
              style={{
                animation: `slideInUp 0.6s ease-out ${0.1 * idx}s both`
              }}
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300 mb-1">{card.title}</div>
                  <div className="text-3xl font-bold mb-2">{card.value}</div>
                  <div className="text-xs text-emerald-400 font-medium">{card.change} from last month</div>
                </div>
                <div className="bg-black/30 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          ))}
        </div>

        {/* Controls */}
        <EmployeeFilter
            search={search}
            setSearch={setSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            companyFilter={companyFilter}
            setCompanyFilter={setCompanyFilter}
        />

        {/* Employee List - Categorized by Role */}
        <div className="space-y-8">
          {roleFilter === "All" ? (
            // Show categorized view when no specific role is selected
            Object.entries(employeesByRole).map(([role, roleEmployees]) => (
              roleEmployees.length > 0 && (
                <div key={role} className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-white">{role}</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm border border-emerald-500/30">
                      {roleEmployees.length} employee{roleEmployees.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {roleEmployees.map((emp, idx) => (
                      <EmployeeCard key={emp.empId} emp={emp} idx={idx} onView={handleViewEmployee} />
                    ))}
                  </div>
                </div>
              )
            ))
          ) : (
            // Show flat list when specific role is selected
            <div className="space-y-3">
              {filteredEmployees.map((emp, idx) => (
                <EmployeeCard key={emp.empId} emp={emp} idx={idx} onView={handleViewEmployee} />
              ))}
            </div>
          )}

          {filteredEmployees.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No employees found matching your criteria</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 flex items-center gap-3 z-50 transform hover:scale-110 hover:shadow-emerald-500/30 group"
          style={{
            animation: 'bounceIn 0.6s ease-out 1.2s both'
          }}
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Add Employee</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: slideInUp 0.8s ease-out both;
        }
        
        .animate-fade-in-up {
          animation: slideInUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}