// frontend/src/pages/employee/ARFollowUp.jsx

import React, { useState, useMemo } from "react";
import { Clock, DollarSign, TrendingUp, PhoneForwarded, Edit, Eye, Trash2, Download, BarChart3 } from "lucide-react";

// Common Components
import {StatCard} from "../../../components/common/StatCard.jsx";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { StatusBadge } from "../../../components/common/StatusBadge.jsx";
import { ImportButton } from "../../../components/common/ImportButton.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";

// UI Components
import { Button } from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { toast } from "react-hot-toast";

const ARFollowUp = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  // --- STATE MANAGEMENT ---
  const [activeFilters, setActiveFilters] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  // --- MOCK DATA ---
  const mockARClaims = useMemo(() => [
    { _id: "1", claimId: "CLM-001", patientName: "Robert Brown", payer: "Aetna", billedAmount: 550.0, balance: 300.0, age: 41, status: "pending" },
    { _id: "2", claimId: "CLM-002", patientName: "Linda Wilson", payer: "Cigna", billedAmount: 120.0, balance: 120.0, age: 25, status: "active" },
    { _id: "3", claimId: "CLM-003", patientName: "James Miller", payer: "United Healthcare", billedAmount: 850.0, balance: 450.0, age: 97, status: "completed" },
    { _id: "4", claimId: "CLM-004", patientName: "Susan Davis", payer: "BlueCross", billedAmount: 300.0, balance: 300.0, age: 138, status: "suspended" },
    { _id: "5", claimId: "CLM-005", patientName: "William Garcia", payer: "Aetna", billedAmount: 210.0, balance: 110.0, age: 57, status: "pending" },
    { _id: "6", claimId: "CLM-006", patientName: "Mary Rodriguez", payer: "Cigna", billedAmount: 95.5, balance: 0.0, age: 16, status: "completed" },
  ], []);

  // --- DATA TABLE CONFIGURATION ---
  const columns = [
    { key: "claimId", label: "Claim / Patient", render: (v, row) => <div><div className="font-medium text-white">{v}</div><div className="text-sm text-gray-400">{row.patientName}</div></div> },
    { key: "payer", label: "Payer", sortable: true },
    { key: "balance", label: "Balance", sortable: true, type: "currency" },
    { key: "age", label: "Age", sortable: true, render: v => `${v}d` },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
    { key: "actions", label: "Actions", render: (v, row) => (
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-500/20"><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-green-500/20"><Edit className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-red-500/20 text-red-400" onClick={(e) => { e.stopPropagation(); setRowToDelete(row); setShowDeleteDialog(true); }}><Trash2 className="w-4 h-4" /></Button>
        </div>
      ),
    },
  ];

  const filters = [
    { key: 'status', label: 'Status', options: [{ value: 'pending', label: 'Pending' }, { value: 'active', label: 'Active' }, { value: 'completed', label: 'Completed' }, { value: 'suspended', label: 'Suspended' }] },
    { key: 'payer', label: 'Payer', options: [{ value: 'Aetna', label: 'Aetna' }, { value: 'Cigna', label: 'Cigna' }, { value: 'United Healthcare', label: 'United Healthcare' }, { value: 'BlueCross', label: 'BlueCross' }] }
  ];

  // --- EVENT HANDLERS ---
  const handleConfirmDelete = () => {
    if (!rowToDelete) return;
    toast.success(`Claim "${rowToDelete.claimId}" action confirmed!`);
    setShowDeleteDialog(false);
    setRowToDelete(null);
  };
  
  const handleImport = async (file) => {
    toast.success(`Importing ${file.name}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("File imported:", file);
    toast.success("File processed successfully!");
  };

  // CORRECTED: This handler now correctly processes the event object passed by DataTable
  const handleFilterChange = (key, event) => {
    const value = event.target.value; // Extract the value from the event object
    const newFilters = { ...activeFilters };

    if (value && value !== 'all') {
      newFilters[key] = value;
    } else {
      delete newFilters[key]; // Remove filter if "all" or empty is selected
    }
    setActiveFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className={`w-8 h-8 text-${theme.accent}`} />
          <div>
            <h1 className={`text-3xl font-bold text-${theme.text}`}>A/R Follow-up</h1>
            <p className={`text-${theme.textSecondary} mt-1`}>Work on aging and unpaid claims to ensure timely payment.</p>
          </div>
        </div>
      </div>

      {/* KPI Stats using StatCard component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard theme={userType} icon={DollarSign} title="Total A/R in Queue" value={125430} type="currency" change={-2.5} />
        <StatCard theme={userType} icon={TrendingUp} title="Claims > 90 Days" value={42} change={5.1}/>
        <StatCard theme={userType} icon={Clock} title="Average Claim Age" value={58} change={-10.2} />
        <StatCard theme={userType} icon={PhoneForwarded} title="Promised This Week" value={12800} type="currency" change={15}/>
      </div>

      <DataTable
        data={mockARClaims}
        columns={columns}
        rowKey="_id"
        title="A/R Work Queue"
        subtitle="Active claims requiring follow-up actions."
        actions={[
            { label: 'Analytics', icon: BarChart3, onClick: () => console.log('Analytics clicked')},
            { label: 'Import', render: () => <ImportButton onImport={handleImport} theme={userType} /> }
        ]}
        loading={false}
        theme={userType}
        selectable={true}
        searchable={true}
        searchFields={['claimId', 'patientName', 'payer']}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange} // Pass the corrected handler
        paginated={true}
      />
      
      <ConfirmDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleConfirmDelete} title="Confirm Action" message={`Are you sure you want to proceed with the action for claim "${rowToDelete?.claimId}"?`} type="danger" confirmText="Confirm" />
    </div>
  );
};

export default ARFollowUp;