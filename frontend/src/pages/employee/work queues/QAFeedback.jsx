// frontend/src/pages/employee/QAFeedback.jsx

import React, { useState, useMemo } from "react";
import { CheckCircle, Star, AlertCircle, TrendingUp, Eye, Check, BarChart3 } from "lucide-react";

// Common Components
import StatCard from "../../../components/common/StatCard.jsx";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { StatusBadge } from "../../../components/common/StatusBadge.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";

// UI Components
import { Button } from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { formatDate } from "../../../lib/utils.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const QAFeedback = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [activeFilters, setActiveFilters] = useState({});
  const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false);
  const [rowToAcknowledge, setRowToAcknowledge] = useState(null);

  // --- MOCK DATA ---
  const mockFeedback = useMemo(() => [
    { _id: "1", claimId: "CLM-001", patientName: "Robert Brown", qaReviewer: "Jane Doe", reviewDate: "2025-07-25", errorType: "Coding Error", feedbackStatus: "pending", severity: "Medium" },
    { _id: "2", claimId: "CLM-002", patientName: "Linda Wilson", qaReviewer: "John Smith", reviewDate: "2025-07-25", errorType: "Data Entry Error", feedbackStatus: "pending", severity: "Low" },
    { _id: "3", claimId: "CLM-003", patientName: "James Miller", qaReviewer: "Jane Doe", reviewDate: "2025-07-24", errorType: "Policy Misuse", feedbackStatus: "active", severity: "High" },
    { _id: "4", claimId: "CLM-004", patientName: "Susan Davis", qaReviewer: "Jane Doe", reviewDate: "2025-07-23", errorType: "No Error Found", feedbackStatus: "completed", severity: "None" },
    { _id: "5", claimId: "CLM-005", patientName: "William Garcia", qaReviewer: "John Smith", reviewDate: "2025-07-22", errorType: "Data Entry Error", feedbackStatus: "completed", severity: "Low" },
  ], []);

  // --- DATA TABLE CONFIGURATION ---
  const columns = [
    { key: "claimId", label: "Claim / Patient", render: (v, row) => <div><div className="font-medium text-white">{v}</div><div className="text-sm text-gray-400">{row.patientName}</div></div> },
    { key: "qaReviewer", label: "Reviewed By", sortable: true },
    { key: "reviewDate", label: "Review Date", sortable: true, render: (v) => formatDate(v) },
    { key: "errorType", label: "Error Type", sortable: true },
    { key: "severity", label: "Severity", sortable: true, render: (value) => {
        const variants = { "High": "destructive", "Medium": "warning", "Low": "secondary", "None": "success" };
        return <StatusBadge status={variants[value]} label={value} />;
      },
    },
    { key: "feedbackStatus", label: "Status", render: (value) => <StatusBadge status={value} /> },
    { key: "actions", label: "Actions", render: (v, row) => (
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-500/20"><Eye className="w-4 h-4" /></Button>
          {row.feedbackStatus === 'pending' && (
            <Button variant="ghost" size="sm" className="p-2 hover:bg-green-500/20" onClick={(e) => { e.stopPropagation(); setRowToAcknowledge(row); setShowAcknowledgeDialog(true); }}><Check className="w-4 h-4" /></Button>
          )}
        </div>
      ),
    },
  ];

  const filters = [
    { key: 'feedbackStatus', label: 'Status', options: [{ value: 'pending', label: 'Pending' }, { value: 'active', label: 'In Review' }, { value: 'completed', label: 'Acknowledged' }] },
    { key: 'errorType', label: 'Error Type', options: [{ value: 'Coding Error', label: 'Coding' }, { value: 'Data Entry Error', label: 'Data Entry' }, { value: 'Policy Misuse', label: 'Policy' }] }
  ];

  // --- EVENT HANDLERS ---
  const handleConfirmAcknowledge = () => {
    if (!rowToAcknowledge) return;
    toast.success(`Feedback for claim "${rowToAcknowledge.claimId}" acknowledged!`);
    setShowAcknowledgeDialog(false);
    setRowToAcknowledge(null);
  };

  const handleFilterChange = (key, event) => {
    const value = event.target.value;
    const newFilters = { ...activeFilters };
    if (value && value !== 'all') {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle className={`w-8 h-8 text-${theme.accent}`} />
          <div>
            <h1 className={`text-3xl font-bold text-${theme.text}`}>QA Feedback</h1>
            <p className={`text-${theme.textSecondary} mt-1`}>Review feedback from the Quality Assurance team.</p>
          </div>
        </div>
      </div>

      {/* KPI Stats using StatCard component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard theme={userType} icon={Star} title="Current Quality Score" value={98.7} type="percentage" change={0.5} />
        <StatCard theme={userType} icon={AlertCircle} title="New Feedback Items" value={3} />
        <StatCard theme={userType} icon={TrendingUp} title="Errors This Month" value={8} change={-2} />
        <StatCard theme={userType} icon={CheckCircle} title="Top Error Category" value={"Coding Error"} />
      </div>

      <DataTable
        data={mockFeedback}
        columns={columns}
        rowKey="_id"
        title="Feedback Queue"
        subtitle="Items reviewed by the QA team requiring your attention."
        actions={[
            { label: 'My Scorecard', icon: BarChart3, onClick: () => navigate("/employee/analytics/quality")},
        ]}
        loading={false}
        theme={userType}
        selectable={true}
        searchable={true}
        searchFields={['claimId', 'patientName', 'qaReviewer']}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        paginated={true}
      />
      
      <ConfirmDialog 
        isOpen={showAcknowledgeDialog} 
        onClose={() => setShowAcknowledgeDialog(false)} 
        onConfirm={handleConfirmAcknowledge} 
        title="Acknowledge Feedback" 
        message={`By clicking 'Acknowledge', you confirm that you have reviewed the QA feedback for claim "${rowToAcknowledge?.claimId}".`}
        type="primary" 
        confirmText="Acknowledge" 
      />
    </div>
  );
};

export default QAFeedback;