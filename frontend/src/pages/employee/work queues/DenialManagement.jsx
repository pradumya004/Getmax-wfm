// frontend/src/pages/employee/DenialManagement.jsx

import React, { useState, useEffect, useMemo } from "react";
import { AlertTriangle, BarChart3, Edit, Eye, Trash2, Download, Plus, Clock, Shield, DollarSign } from "lucide-react";

// Common Components
import { DataTable } from "../../../components/common/DataTable.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";
import {StatCard} from "../../../components/common/StatCard.jsx";
import { StatusBadge } from "../../../components/common/StatusBadge.jsx";
import { SearchBar } from "../../../components/common/SearchBar.jsx";
import { ImportButton } from "../../../components/common/ImportButton.jsx";

// UI Components
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { formatDate } from "../../../lib/utils.js";
import { toast } from "react-hot-toast";

const DenialManagement = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  // --- MOCK DATA & LOADING SIMULATION ---
  const loading = false;
  const error = null;
  const mockDenials = useMemo(() => [
    { _id: "1", claimId: "DEN-001", patientName: "John Smith", payer: "Aetna", billedAmount: 150.75, denialReason: "Service not covered", denialDate: "2024-07-20", status: "pending", priority: "High" },
    { _id: "2", claimId: "DEN-002", patientName: "Emily White", payer: "Cigna", billedAmount: 88.0, denialReason: "Incorrect coding", denialDate: "2024-07-18", status: "active", priority: "Medium" },
    { _id: "3", claimId: "DEN-003", patientName: "David Green", payer: "United Healthcare", billedAmount: 230.0, denialReason: "Missing documentation", denialDate: "2024-07-15", status: "pending", priority: "High" },
    { _id: "4", claimId: "DEN-004", patientName: "Jessica Blue", payer: "BlueCross", billedAmount: 55.5, denialReason: "Duplicate claim", denialDate: "2024-07-22", status: "trial", priority: "Low" },
    { _id: "5", claimId: "DEN-005", patientName: "Michael Black", payer: "Aetna", billedAmount: 199.99, denialReason: "Service not covered", denialDate: "2024-06-25", status: "completed", priority: "Medium" },
    { _id: "6", claimId: "DEN-006", patientName: "Sarah Jones", payer: "Cigna", billedAmount: 310.4, denialReason: "Incorrect coding", denialDate: "2024-07-23", status: "pending", priority: "Medium" },
  ], []);

  // --- FILTERING & SEARCH LOGIC (EXTERNAL TO DATATABLE) ---
  useEffect(() => {
    let denials = [...mockDenials];
    if (searchTerm) {
      denials = denials.filter(d => d.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || d.claimId.toLowerCase().includes(searchTerm.toLowerCase()) || d.payer.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (statusFilter !== "All") {
      denials = denials.filter((d) => d.status === statusFilter);
    }
    setFilteredData(denials);
  }, [searchTerm, statusFilter, mockDenials]);

  // --- DATA TABLE CONFIGURATION ---
  const columns = [
    { key: "claimId", label: "Claim / Patient", render: (v, row) => <div><div className="font-medium text-white">{v}</div><div className="text-sm text-gray-400">{row.patientName}</div></div> },
    { key: "payer", label: "Payer", sortable: true },
    { key: "denialReason", label: "Denial Reason" },
    { key: "billedAmount", label: "Amount", type: "currency" },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
    { key: "denialDate", label: "Denied On", render: (value) => formatDate(value) },
    { key: "actions", label: "Actions", render: (v, row) => (
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-500/20"><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-green-500/20"><Edit className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-red-500/20 text-red-400" onClick={(e) => { e.stopPropagation(); setRowToDelete(row); setShowDeleteDialog(true); }}><Trash2 className="w-4 h-4" /></Button>
        </div>
      ),
    },
  ];
  
  const bulkActions = [
      { label: 'Export Selected', icon: Download, onClick: (selected) => console.log('Exporting:', selected) },
  ];
  
  const handleConfirmDelete = () => {
    if (!rowToDelete) return;
    toast.success(`Claim "${rowToDelete.claimId}" deleted successfully!`);
    setShowDeleteDialog(false);
    setRowToDelete(null);
  };
  
  // Adjusted to match StatusBadge keys
  const statusFilters = [ "All", "pending", "active", "trial", "completed" ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className={`w-8 h-8 text-${theme.accent}`} />
          <div>
            <h1 className={`text-3xl font-bold text-${theme.text}`}>Denial Management</h1>
            <p className={`text-${theme.textSecondary} mt-1`}>Resolve and appeal denied claims efficiently.</p>
          </div>
        </div>
        <Button theme={userType}>
          <BarChart3 className="w-4 h-4 mr-2" />
          View Denial Analytics
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard theme={userType} icon={Shield} title="New Denials Today" value={24} change={10.2} />
        <StatCard theme={userType} icon={AlertTriangle} title="High Priority Queue" value={12} change={-5} />
        <StatCard theme={userType} icon={Clock} title="Average Denial Age" value={14} />
        <StatCard theme={userType} icon={DollarSign} title="Recovered This Week" value={5480} type="currency" change={25.7} />
      </div>

      {/* Main Data Card */}
      <Card theme={userType} className="p-0 overflow-hidden">
        <div className={`p-6 border-b border-${theme.border}`}>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <SearchBar 
                  placeholder="Search by Claim, Patient, or Payer..."
                  value={searchTerm}
                  onChange={(value) => setSearchTerm(value)}
                  onClear={() => setSearchTerm("")}
                  className="w-full md:w-2/5"
                />
               <Button theme={userType} variant="primary">
                  <Plus className="w-4 h-4 mr-2"/>
                  Manual Entry
               </Button>
            </div>
             <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-medium text-${theme.textSecondary} mr-2`}>Status:</span>
                {statusFilters.map(status => (
                    <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 text-sm rounded-full transition-all capitalize ${ statusFilter === status ? `bg-gradient-to-r ${theme.secondary} text-white font-semibold shadow-md` : `bg-black/20 text-${theme.textSecondary} hover:bg-white/10 hover:text-white` }`}>
                        {status}
                    </button>
                ))}
            </div>
        </div>

        <DataTable
          data={filteredData}
          columns={columns}
          loading={loading}
          error={error}
          rowKey="_id"
          selectable={true}
          bulkActions={bulkActions}
          paginated={true}
          theme={userType} // Corrected prop
          onRowSelect={(selected) => setSelectedRows(selected)}
          onSelectAll={(allSelected) => setSelectedRows(allSelected)}
          emptyStateTitle="No Denials Found"
          emptyStateDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </Card>
      
      <ConfirmDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleConfirmDelete} title="Delete Denial" message={`Are you sure you want to delete the denial for claim "${rowToDelete?.claimId}"?`} type="danger" confirmText="Delete" />
    </div>
  );
};

export default DenialManagement;