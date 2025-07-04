// frontend/src/pages/ClaimIntake.jsx

import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Clock, AlertCircle, CheckCircle, User, Calendar, DollarSign, Building, FileText, Upload, Settings, TrendingUp, Users, Activity } from 'lucide-react';

const mockClaims = [
  {
    id: 'CLM-001',
    clientId: 'MedCare Solutions',
    sowId: 'SOW-2024-001',
    status: 'Assigned',
    priority: 'High',
    aging: 45,
    denialType: 'Prior Auth Required',
    payer: 'Aetna',
    assignedTo: 'Sarah Johnson',
    amount: '$2,450.00',
    receivedDate: '2025-05-06',
    dueDate: '2025-07-05'
  },
  {
    id: 'CLM-002',
    clientId: 'Elite Healthcare',
    sowId: 'SOW-2024-002',
    status: 'In Progress',
    priority: 'Medium',
    aging: 30,
    denialType: 'Missing Documentation',
    payer: 'BCBS',
    assignedTo: 'Michael Chen',
    amount: '$1,850.00',
    receivedDate: '2025-05-21',
    dueDate: '2025-07-20'
  },
  {
    id: 'CLM-003',
    clientId: 'BillPro Services',
    sowId: 'SOW-2024-003',
    status: 'Pending',
    priority: 'Low',
    aging: 15,
    denialType: 'Coding Error',
    payer: 'Medicare',
    assignedTo: 'Unassigned',
    amount: '$950.00',
    receivedDate: '2025-06-05',
    dueDate: '2025-08-04'
  },
  {
    id: 'CLM-004',
    clientId: 'Sunrise Health Group',
    sowId: 'SOW-2024-005',
    status: 'Completed',
    priority: 'Medium',
    aging: 62,
    denialType: 'Service Not Covered',
    payer: 'United Healthcare',
    assignedTo: 'Priya Patel',
    amount: '$3,120.00',
    receivedDate: '2025-04-19',
    dueDate: '2025-06-18'
  },
  {
    id: 'CLM-005',
    clientId: 'MedCare Solutions',
    sowId: 'SOW-2024-001',
    status: 'Pending',
    priority: 'High',
    aging: 5,
    denialType: 'Duplicate Claim',
    payer: 'Cigna',
    assignedTo: 'Unassigned',
    amount: '$5,500.00',
    receivedDate: '2025-06-15',
    dueDate: '2025-08-14'
  },
];

// Glass morphism card component
const GlassCard = ({ children, className = "", hover = false }) => (
  <div className={`
    backdrop-blur-xl bg-white/10 
    border border-white/20 
    rounded-2xl 
    shadow-xl shadow-black/10
    ${hover ? 'hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:scale-[1.02]' : ''}
    ${className}
  `}>
    {children}
  </div>
);

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const colors = {
    'High': 'bg-red-500/20 text-red-300 border-red-400/30',
    'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    'Low': 'bg-green-500/20 text-green-300 border-green-400/30'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ status }) => {
  const colors = {
    'Assigned': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    'In Progress': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    'Pending': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
    'Completed': 'bg-green-500/20 text-green-300 border-green-400/30'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
      {status}
    </span>
  );
};

// Claim Stats Component
const ClaimStats = ({ claims }) => {
  const stats = [
    {
      title: 'Total Claims',
      value: claims.length,
      icon: FileText,
      color: 'text-blue-300',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'In Progress',
      value: claims.filter(c => c.status === 'In Progress').length,
      icon: Activity,
      color: 'text-purple-300',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'High Priority',
      value: claims.filter(c => c.priority === 'High').length,
      icon: AlertCircle,
      color: 'text-red-300',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'Completed',
      value: claims.filter(c => c.status === 'Completed').length,
      icon: CheckCircle,
      color: 'text-green-300',
      bgColor: 'bg-green-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <GlassCard key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

// Claim Card Component
const ClaimCard = ({ claim, onViewDetails }) => {
  const getAgingColor = (aging) => {
    if (aging >= 60) return 'text-red-300';
    if (aging >= 30) return 'text-yellow-300';
    return 'text-green-300';
  };

  return (
    <GlassCard hover className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">{claim.id}</h3>
              <StatusBadge status={claim.status} />
              <PriorityBadge priority={claim.priority} />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/70" />
              <span className={`text-sm font-medium ${getAgingColor(claim.aging)}`}>
                {claim.aging} days
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-white/70" />
              <span className="text-white/90 text-sm">{claim.clientId}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-white/70" />
              <span className="text-white/90 text-sm font-medium">{claim.amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-white/70" />
              <span className="text-white/90 text-sm">{claim.assignedTo}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-white/70 text-xs">Payer</span>
              <p className="text-white/90 text-sm">{claim.payer}</p>
            </div>
            <div>
              <span className="text-white/70 text-xs">Denial Type</span>
              <p className="text-white/90 text-sm">{claim.denialType}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(claim)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

// Filters Component
const ClaimFilters = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, filterPriority, setFilterPriority }) => {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
          />
        </div>
        
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
          >
            <option value="all" className="bg-gray-800">All Status</option>
            <option value="assigned" className="bg-gray-800">Assigned</option>
            <option value="inprogress" className="bg-gray-800">In Progress</option>
            <option value="pending" className="bg-gray-800">Pending</option>
            <option value="completed" className="bg-gray-800">Completed</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
          >
            <option value="all" className="bg-gray-800">All Priority</option>
            <option value="high" className="bg-gray-800">High</option>
            <option value="medium" className="bg-gray-800">Medium</option>
            <option value="low" className="bg-gray-800">Low</option>
          </select>
        </div>
      </div>
    </GlassCard>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
      active
        ? 'bg-white/20 text-white border border-white/30 shadow-lg'
        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
    }`}
  >
    <Icon className="w-4 h-4" />
    {children}
  </button>
);

// Upload Tab Component
const UploadIntakeTab = () => {
  return (
    <div className="space-y-6">
      <GlassCard className="p-8">
        <div className="text-center">
          <Upload className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Upload Claims</h3>
          <p className="text-white/70 mb-6">Drag and drop files or click to browse</p>
          
          <div className="border-2 border-dashed border-white/30 rounded-2xl p-12 hover:border-white/50 transition-all duration-200">
            <div className="space-y-4">
              <div className="flex justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:scale-105">
                  Choose Files
                </button>
              </div>
              <p className="text-white/50 text-sm">Supported formats: PDF, Excel, CSV</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// Allocation Rules Tab Component
const AllocationRulesTab = () => {
  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-300" />
          <h3 className="text-2xl font-bold text-white">Allocation Rules</h3>
        </div>
        
        <div className="space-y-4">
          <GlassCard className="p-4 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Priority-Based Assignment</h4>
                <p className="text-white/70 text-sm">High priority claims auto-assigned to senior staff</p>
              </div>
              <div className="w-12 h-6 bg-green-500/30 rounded-full p-1">
                <div className="w-4 h-4 bg-green-400 rounded-full ml-auto"></div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Workload Balancing</h4>
                <p className="text-white/70 text-sm">Distribute claims evenly across team members</p>
              </div>
              <div className="w-12 h-6 bg-green-500/30 rounded-full p-1">
                <div className="w-4 h-4 bg-green-400 rounded-full ml-auto"></div>
              </div>
            </div>
          </GlassCard>
        </div>
      </GlassCard>
    </div>
  );
};

// Claim Detail Modal Component
const ClaimDetailModal = ({ claim, isOpen, onClose }) => {
  if (!isOpen || !claim) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{claim.id} Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm">Status</label>
                <div className="mt-1">
                  <StatusBadge status={claim.status} />
                </div>
              </div>
              <div>
                <label className="text-white/70 text-sm">Priority</label>
                <div className="mt-1">
                  <PriorityBadge priority={claim.priority} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm">Client</label>
                <p className="text-white mt-1">{claim.clientId}</p>
              </div>
              <div>
                <label className="text-white/70 text-sm">Amount</label>
                <p className="text-white mt-1 font-medium">{claim.amount}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm">Assigned To</label>
                <p className="text-white mt-1">{claim.assignedTo}</p>
              </div>
              <div>
                <label className="text-white/70 text-sm">Aging</label>
                <p className="text-white mt-1">{claim.aging} days</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default function ClaimIntake() {
  const [claims, setClaims] = useState(mockClaims);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [activeTab, setActiveTab] = useState('claims');

  const filteredClaims = claims.filter(claim => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = claim.id.toLowerCase().includes(searchLower) ||
                         claim.clientId.toLowerCase().includes(searchLower) ||
                         claim.payer.toLowerCase().includes(searchLower) ||
                         claim.assignedTo.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === 'all' || claim.status.toLowerCase().replace(/\s/g, '') === filterStatus;
    const matchesPriority = filterPriority === 'all' || claim.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
            Claim Intake & Allocation
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Manage claim intake, allocation, and assignment with intelligent automation and beautiful insights.
          </p>
        </div>

        {/* Stats */}
        <ClaimStats claims={claims} />

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          <TabButton
            active={activeTab === 'claims'}
            onClick={() => setActiveTab('claims')}
            icon={FileText}
          >
            Claims Management
          </TabButton>
          <TabButton
            active={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
            icon={Upload}
          >
            Upload & Intake
          </TabButton>
          <TabButton
            active={activeTab === 'allocation'}
            onClick={() => setActiveTab('allocation')}
            icon={Settings}
          >
            Allocation Rules
          </TabButton>
        </div>

        {/* Tab Content */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            <ClaimFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
            />
            
            <div className="space-y-4">
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <ClaimCard 
                    key={claim.id} 
                    claim={claim} 
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <GlassCard className="p-12 text-center">
                  <div className="space-y-4">
                    <Search className="w-16 h-16 text-white/50 mx-auto" />
                    <div>
                      <p className="text-white text-xl font-medium">No claims match your filters</p>
                      <p className="text-white/70">Try adjusting your search or filter settings</p>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        )}

        {activeTab === 'upload' && <UploadIntakeTab />}
        {activeTab === 'allocation' && <AllocationRulesTab />}
      </div>

      {/* Modal */}
      <ClaimDetailModal 
        claim={selectedClaim} 
        isOpen={!!selectedClaim} 
        onClose={() => setSelectedClaim(null)} 
      />
    </div>
  );
}