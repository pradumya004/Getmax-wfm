// frontend/src/pages/employee/PaymentPosting.jsx

import React, { useState, useMemo } from "react";
import { DollarSign, FileSpreadsheet, CheckCircle, AlertCircle, TrendingUp, Edit, Eye, Trash2, BarChart3, Plus } from "lucide-react";

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
import { formatDate } from "../../../lib/utils.js";
import { toast } from "react-hot-toast";

const PaymentPosting = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  // --- STATE MANAGEMENT ---
  const [activeFilters, setActiveFilters] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [rowToAction, setRowToAction] = useState(null);

  // --- MOCK DATA ---
  const mockPayments = useMemo(() => [
    { _id: "1", checkNumber: "ERA-835-12345", payerName: "Aetna", paymentDate: "2025-07-25", paymentAmount: 12550.75, postStatus: "pending", fileType: "ERA", claimCount: 45 },
    { _id: "2", checkNumber: "CHK-98765", payerName: "Cigna", paymentDate: "2025-07-25", paymentAmount: 8730.20, postStatus: "pending", fileType: "EOB", claimCount: 30 },
    { _id: "3", checkNumber: "ERA-835-12346", payerName: "United Healthcare", paymentDate: "2025-07-24", paymentAmount: 21500.00, postStatus: "active", fileType: "ERA", claimCount: 62 },
    { _id: "4", checkNumber: "ERA-835-12347", payerName: "BlueCross", paymentDate: "2025-07-23", paymentAmount: 9200.50, postStatus: "completed", fileType: "ERA", claimCount: 25 },
    { _id: "5", checkNumber: "CHK-98766", payerName: "Aetna", paymentDate: "2025-07-22", paymentAmount: 5400.00, postStatus: "completed", fileType: "EOB", claimCount: 18 },
  ], []);

  // --- DATA TABLE CONFIGURATION ---
  const columns = [
    { key: "checkNumber", label: "Check/ERA Number", render: (v, row) => <div><div className="font-medium text-white">{v}</div><div className="text-sm text-gray-400">{row.fileType}</div></div> },
    { key: "payerName", label: "Payer", sortable: true },
    { key: "paymentDate", label: "Payment Date", sortable: true, render: (v) => formatDate(v) },
    { key: "paymentAmount", label: "Amount", sortable: true, type: "currency" },
    { key: "claimCount", label: "# Claims", sortable: true },
    { key: "postStatus", label: "Status", render: (value) => <StatusBadge status={value} /> },
    { key: "actions", label: "Actions", render: (v, row) => (
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-500/20"><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-green-500/20" onClick={(e) => { e.stopPropagation(); setRowToAction(row); setShowConfirmDialog(true); }}><Edit className="w-4 h-4" /></Button>
        </div>
      ),
    },
  ];

  const filters = [
    { key: 'postStatus', label: 'Status', options: [{ value: 'pending', label: 'Pending' }, { value: 'active', label: 'In Progress' }, { value: 'completed', label: 'Completed' }] },
    { key: 'fileType', label: 'File Type', options: [{ value: 'ERA', label: 'ERA' }, { value: 'EOB', label: 'EOB' }] }
  ];

  // --- EVENT HANDLERS ---
  const handleConfirmAction = () => {
    if (!rowToAction) return;
    toast.success(`Begun posting payments for "${rowToAction.checkNumber}"!`);
    setShowConfirmDialog(false);
    setRowToAction(null);
  };
  
  const handleImport = async (file) => {
    toast.success(`Uploading ${file.name}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("File uploaded for posting:", file);
    toast.success("Remittance file added to queue!");
  };

  const handleManualEntry = () => {
    toast.success("Opening manual payment entry form...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className={`w-8 h-8 text-${theme.accent}`} />
          <div>
            <h1 className={`text-3xl font-bold text-${theme.text}`}>Payment Posting</h1>
            <p className={`text-${theme.textSecondary} mt-1`}>Post payments from ERAs and EOBs to patient accounts.</p>
          </div>
        </div>
      </div>

      {/* KPI Stats using StatCard component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard theme={userType} icon={DollarSign} title="Total to Post" value={57481.45} type="currency" change={12.5} />
        <StatCard theme={userType} icon={FileSpreadsheet} title="ERAs in Queue" value={18} change={2} />
        <StatCard theme={userType} icon={AlertCircle} title="Unapplied Cash" value={2350.22} type="currency" change={-5.1}/>
        <StatCard theme={userType} icon={TrendingUp} title="Auto-Post Rate" value={92.5} type="percentage" change={1.2}/>
      </div>

      {/* DataTable handles its own card, search, filters, and actions */}
      <DataTable
        data={mockPayments}
        columns={columns}
        rowKey="_id"
        title="Payment Queue"
        subtitle="Review and post payments from received remittance files."
        actions={[
            { label: 'Manual Entry', icon: Plus, onClick: handleManualEntry },
            { label: 'Upload ERA/EOB', render: () => <ImportButton onImport={handleImport} theme={userType} title="Upload Remittance File" /> }
        ]}
        loading={false}
        theme={userType}
        selectable={true}
        searchable={true}
        searchFields={['checkNumber', 'payerName']}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={(key, e) => handleFilterChange(key, e)}
        paginated={true}
      />
      
      <ConfirmDialog 
        isOpen={showConfirmDialog} 
        onClose={() => setShowConfirmDialog(false)} 
        onConfirm={handleConfirmAction} 
        title="Begin Posting?" 
        message={`Are you sure you want to start posting payments for "${rowToAction?.checkNumber}"? This will lock the batch to your user.`} 
        type="primary" 
        confirmText="Yes, Start Posting" 
      />
    </div>
  );
  
  // NOTE: The handleFilterChange function needs to be defined for filters to work.
  // This was corrected in the previous step and should be included here as well.
  function handleFilterChange(key, event) {
    const value = event.target.value;
    const newFilters = { ...activeFilters };

    if (value && value !== 'all') {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
  }
};

export default PaymentPosting;