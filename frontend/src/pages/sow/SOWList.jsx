// frontend/src/pages/sow/SOWList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FileText,
  DollarSign,
  Target,
  Users,
  Plus,
  Edit,
  Trash2,
  List,
  Eye,
  Play,
  Pause,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { SOWCard } from "../../components/sow/SOWCard.jsx";
import { SOWStatsCard } from "../../components/sow/SOWStatsCard.jsx";
import { SOWFilters } from "../../components/sow/SOWFilters.jsx";
import { SOWStatusBadge } from "../../components/sow/SOWStatusBadge.jsx";
import { SOWActions } from "../../components/sow/SOWActions.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { useSOWs } from "../../hooks/useSows.jsx";
import { formatDate, formatCurrency } from "../../lib/utils.js";

const SOWList = () => {
  const navigate = useNavigate();
  const { userType, permissions } = useAuth();
  const theme = getTheme(userType);
  const {
    sows,
    loading,
    error,
    fetchSOWs,
    removeSOW,
    getClientSOWs,
    updateStatus,
    bulkUpdateSOWs,
    bulkDeleteSOWs,
  } = useSOWs();

  // State management
  const [viewMode, setViewMode] = useState("table");
  const [selectedSOWs, setSelectedSOWs] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sowToDelete, setSOWToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    serviceType: "all",
    clientType: "all",
  });

  // Transform SOW data for DataTable compatibility
  const transformedSOWs = useMemo(() => {
    if (!sows || !Array.isArray(sows)) return [];
    return sows.map((sow) => ({
      ...sow,
      // Add flattened fields for easier access in DataTable
      sowName: sow.sowName || "N/A",
      clientName: sow.clientRef?.clientInfo?.clientName || "N/A",
      serviceType: sow.serviceDetails?.serviceType || "N/A",
      contractType: sow.contractDetails?.contractType || "N/A",
      billingModel: sow.contractDetails?.billingModel || "N/A",
      sowStatus: sow.status?.sowStatus || "Draft",
      dailyTarget: sow.performanceTargets?.dailyTargetPerEmp || 0,
      headcount: sow.resourcePlanning?.plannedHeadcount || 0,
      expectedVolume: sow.volumeForecasting?.expectedDailyVolume || 0,
      ratePerTransaction: sow.contractDetails?.ratePerTransaction || 0,
      monthlyRevenue: sow.activityMetrics?.monthlyRevenueGenerated || 0,
      slaCompliance: sow.activityMetrics?.currentSlaComplianceRate || 0,
      qualityScore: sow.activityMetrics?.currentQualityScoreAverage || 0,
      capacityUtilization: sow.currentCapacityUtilization || 0,
      startDate: sow.status?.startDate,
      endDate: sow.status?.endDate,
      isActive: sow.systemInfo?.isActive !== false,
      autoAssignment: sow.systemInfo?.autoAssignmentEnabled !== false,
    }));
  }, [sows]);

  // DataTable columns configuration
  const columns = [
    {
      key: "sowName",
      label: "SOW Details",
      sortable: true,
      render: (value, sow) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
          >
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-gray-400">{sow.sowId}</div>
          </div>
        </div>
      ),
      width: "250px",
    },
    {
      key: "clientName",
      label: "Client",
      sortable: true,
      render: (value, sow) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">{value}</span>
          </div>
          <div className="text-xs text-gray-400">
            {sow.clientRef?.clientInfo?.clientType || "N/A"}
          </div>
        </div>
      ),
      width: "200px",
    },
    {
      key: "serviceType",
      label: "Service",
      sortable: true,
      render: (value, sow) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-white">{value}</div>
          <div className="text-xs text-gray-400">
            {sow.serviceDetails?.scopeFormatId || "N/A"}
          </div>
        </div>
      ),
      width: "180px",
    },
    {
      key: "sowStatus",
      label: "Status",
      sortable: true,
      render: (value) => <SOWStatusBadge status={value} size="sm" />,
      width: "120px",
    },
    {
      key: "contractType",
      label: "Contract & Billing",
      render: (value, sow) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-white">{value}</div>
          <div className="text-xs text-gray-400">
            {sow.billingModel} - {formatCurrency(sow.ratePerTransaction)}
          </div>
        </div>
      ),
      width: "160px",
    },
    {
      key: "dailyTarget",
      label: "Targets",
      sortable: true,
      render: (value, sow) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">{value}/day</span>
          </div>
          <div className="text-xs text-gray-400">
            {sow.expectedVolume} volume
          </div>
        </div>
      ),
      width: "120px",
    },
    {
      key: "headcount",
      label: "Resources",
      sortable: true,
      render: (value, sow) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">{value} FTE</span>
          </div>
          <div className="text-xs text-gray-400">
            Level {sow.resourcePlanning?.requiredRoleLevel || 1}+
          </div>
        </div>
      ),
      width: "120px",
    },
    {
      key: "slaCompliance",
      label: "Performance",
      sortable: true,
      render: (value, sow) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">SLA</span>
            <span className="text-xs text-white">{value}%</span>
          </div>
          <Progress
            value={value}
            className="h-1"
            indicatorClassName={
              value < 85
                ? "bg-red-500"
                : value < 95
                ? "bg-yellow-500"
                : "bg-green-500"
            }
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Quality</span>
            <span className="text-xs text-white">{sow.qualityScore}%</span>
          </div>
        </div>
      ),
      width: "120px",
    },
    {
      key: "monthlyRevenue",
      label: "Revenue",
      sortable: true,
      render: (value) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">
              {formatCurrency(value)}
            </span>
          </div>
          <div className="text-xs text-gray-400">Monthly</div>
        </div>
      ),
      width: "130px",
    },
    {
      key: "startDate",
      label: "Timeline",
      sortable: true,
      render: (value, sow) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-white">{formatDate(value)}</span>
          </div>
          {sow.endDate && (
            <div className="text-xs text-gray-400">
              to {formatDate(sow.endDate)}
            </div>
          )}
        </div>
      ),
      width: "150px",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value, sow) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewSOW(sow);
            }}
            className="p-2 hover:bg-blue-500/20"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditSOW(sow);
            }}
            className="p-2 hover:bg-green-500/20"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSOW(sow);
            }}
            className="p-2 hover:bg-red-500/20 text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      width: "120px",
    },
  ];

  // Search configuration
  const searchFields = [
    "sowName",
    "sowId",
    "clientName",
    "serviceType",
    "contractType",
  ];

  // Filter configuration
  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "Active", label: "Active" },
        { value: "Draft", label: "Draft" },
        { value: "Inactive", label: "Inactive" },
        { value: "Suspended", label: "Suspended" },
        { value: "Completed", label: "Completed" },
      ],
    },
    {
      key: "serviceType",
      label: "Service Type",
      options: [
        { value: "all", label: "All Service Types" },
        { value: "AR Calling", label: "AR Calling" },
        { value: "Medical Coding", label: "Medical Coding" },
        { value: "Prior Authorization", label: "Prior Authorization" },
        {
          value: "Eligibility Verification",
          label: "Eligibility Verification",
        },
        { value: "Charge Entry", label: "Charge Entry" },
        { value: "Payment Posting", label: "Payment Posting" },
        { value: "Denial Management", label: "Denial Management" },
        { value: "Quality Assurance", label: "Quality Assurance" },
        { value: "Custom Service", label: "Custom Service" },
      ],
    },
    {
      key: "clientType",
      label: "Client Type",
      options: [
        { value: "all", label: "All Client Types" },
        { value: "Hospital", label: "Hospital" },
        { value: "Clinic", label: "Clinic" },
        { value: "Group Practice", label: "Group Practice" },
        { value: "Individual Provider", label: "Individual Provider" },
        { value: "Billing Company", label: "Billing Company" },
        { value: "ASC", label: "ASC" },
        { value: "Lab", label: "Lab" },
        { value: "DME", label: "DME" },
        { value: "Other", label: "Other" },
      ],
    },
  ];

  // Action buttons configuration
  const actions = [
    {
      label: "New SOW",
      icon: Plus,
      onClick: () => navigate("/company/sows/create"),
      variant: "primary",
      permission: permissions?.sow?.includes("Create"),
    },
  ];

  // Bulk actions configuration
  const bulkActions = [
    {
      label: "Activate SOWs",
      icon: Play,
      onClick: (selectedIds) => handleBulkStatusUpdate(selectedIds, "Active"),
      variant: "outline",
      permission: permissions?.sow?.includes("Update"),
    },
    {
      label: "Suspend SOWs",
      icon: Pause,
      onClick: (selectedIds) =>
        handleBulkStatusUpdate(selectedIds, "Suspended"),
      variant: "outline",
      permission: permissions?.sow?.includes("Update"),
    },
    {
      label: "Delete SOWs",
      icon: Trash2,
      onClick: (selectedIds) => handleBulkDelete(selectedIds),
      variant: "outline",
      className: "text-red-400 border-red-400 hover:bg-red-500/20",
      permission: permissions?.sow?.includes("Delete"),
    },
  ];

  // Event handlers
  const handleRowClick = (sow) => {
    navigate(`/company/sows/details/${sow.sowId}`);
  };

  const handleRowSelect = (selectedIds) => {
    setSelectedSOWs(selectedIds);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedSOWs(transformedSOWs.map((sow) => sow._id));
    } else {
      setSelectedSOWs([]);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleEditSOW = (sow) => {
    navigate(`/company/sows/edit/${sow.sowId}`);
  };

  const handleViewSOW = (sow) => {
    navigate(`/company/sows/details/${sow.sowId}`);
  };

  const handleDeleteSOW = (sow) => {
    setSOWToDelete(sow);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!sowToDelete) return;
    setIsDeleting(true);
    try {
      console.log("Deleting SOW:", sowToDelete.sowId);
      
      await removeSOW(sowToDelete.sowId);
      toast.success("SOW deleted successfully!");
      setShowDeleteDialog(false);
      setSOWToDelete(null);
    } catch (error) {
      console.error("Delete SOW error:", error);
      setShowDeleteDialog(false);
      setSOWToDelete(null);
      toast.error("Failed to delete SOW");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkStatusUpdate = async (selectedIds, newStatus) => {
    try {
      await bulkUpdateSOWs(selectedIds, { sowStatus: newStatus });
      setSelectedSOWs([]);
      toast.success(
        `${selectedIds.length} SOW(s) ${newStatus.toLowerCase()} successfully!`
      );
    } catch (error) {
      console.error("Bulk status update error:", error);
      setSelectedSOWs([]);
      toast.error("Failed to update SOW status");
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected SOW(s)?`
      )
    ) {
      try {
        await bulkDeleteSOWs(selectedIds);
        setSelectedSOWs([]);
        toast.success(`${selectedIds.length} SOW(s) deleted successfully!`);
      } catch (error) {
        console.error("Bulk delete error:", error);
        toast.error("Failed to delete SOWs");
      }
    }
  };

  const handleExportAll = () => {
    // Export functionality
    const csvData = transformedSOWs.map((sow) => ({
      "SOW Name": sow.sowName,
      "SOW ID": sow.sowId,
      Client: sow.clientName,
      "Service Type": sow.serviceType,
      Status: sow.sowStatus,
      "Contract Type": sow.contractType,
      "Daily Target": sow.dailyTarget,
      Headcount: sow.headcount,
      Revenue: sow.monthlyRevenue,
      "SLA Compliance": sow.slaCompliance + "%",
      "Start Date": formatDate(sow.startDate),
    }));

    // Convert to CSV and download
    console.log("Exporting SOW data:", csvData);
    toast.success("SOW data exported successfully!");
  };

  const handleStatusChange = async (sow, newStatus) => {
    try {
      await updateStatus(sow.sowId, { sowStatus: newStatus });
      toast.success(`SOW status updated to ${newStatus}`);
    } catch (error) {
      console.error("Update SOW status error:", error);
      toast.error("Failed to update SOW status");
    }
  };

  const handleAssignEmployees = (sow) => {
    navigate(`/company/sows/assign/${sow.sowId}`);
  };

  const handleViewMetrics = (sow) => {
    navigate(`/company/sows/metrics/${sow.sowId}`);
  };

  // Apply filters to data
  const filteredSOWs = useMemo(() => {
    return transformedSOWs.filter((sow) => {
      if (
        activeFilters.status !== "all" &&
        sow.sowStatus !== activeFilters.status
      ) {
        return false;
      }
      if (
        activeFilters.serviceType !== "all" &&
        sow.serviceType !== activeFilters.serviceType
      ) {
        return false;
      }
      if (
        activeFilters.clientType !== "all" &&
        sow.clientRef?.clientInfo?.clientType !== activeFilters.clientType
      ) {
        return false;
      }
      return true;
    });
  }, [transformedSOWs, activeFilters]);

  console.log("SOWs Fetched:", sows);
  console.log("Transformed SOWs:", transformedSOWs);
  console.log("Filtered SOWs:", filteredSOWs);

  // Calculate statistics
  const totalSOWs = sows.length;
  const activeSOWs = sows.filter(
    (sow) => sow.status?.sowStatus === "Active"
  ).length;
  const averagePerformance = Math.round(
    sows.reduce(
      (acc, sow) => acc + (sow.activityMetrics?.currentSlaComplianceRate || 0),
      0
    ) / (sows.length || 1)
  );
  const totalMonthlyRevenue = sows.reduce(
    (acc, sow) => acc + (sow.activityMetrics?.monthlyRevenueGenerated || 0),
    0
  );

  if (viewMode === "cards") {
    return (
      <div className={`p-8 bg-${theme.background} min-h-screen`}>
        <Helmet>
          <title>SOW Management - GetMax</title>
        </Helmet>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">SOW Management</h1>
            <p className="text-gray-400">
              Manage Statements of Work and Service Configurations
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex items-center space-x-1"
            >
              <List className="w-4 h-4" />
              <span>Table View</span>
            </Button>

            <Button
              variant="primary"
              onClick={() => navigate("/company/sows/create")}
              className="flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add SOW</span>
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredSOWs.length > 0 ? (
            filteredSOWs.map((sow) => (
              <SOWCard
                key={sow.sowId}
                sow={sow}
                onView={handleViewSOW}
                onEdit={handleEditSOW}
                onClick={handleRowClick}
                onDelete={handleDeleteSOW}
                onStatusChange={handleStatusChange}
                onAssignEmployees={handleAssignEmployees}
                onViewMetrics={handleViewMetrics}
                // onStatusChange={(newStatus) => handleStatusChange(sow, newStatus)}
                // onAssignEmployees={() => handleAssignEmployees(sow)}
                // onViewMetrics={() => handleViewMetrics(sow)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Card className={`${theme.card} p-8 text-center`}>
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">
                  No SOWs Found
                </h3>
                <p className="text-gray-400 mb-4">
                  {Object.values(activeFilters).some(
                    (filter) => filter && filter !== "all"
                  )
                    ? "No SOWs match your current filters."
                    : "Get started by creating your first SOW."}
                </p>
                {permissions?.sow?.includes("Create") && (
                  <Button
                    theme={theme}
                    onClick={() => navigate("/company/sows/create")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First SOW
                  </Button>
                )}
              </Card>
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Delete SOW"
          message={`Are you sure you want to delete the SOW "${sowToDelete?.sowName}"? This action cannot be undone.`}
          loading={isDeleting}
          type="danger"
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    );
  }
  return (
    <div className={`p-6 bg-${theme.background} min-h-screen`}>
      <Helmet>
        <title>SOW Management - GetMax</title>
      </Helmet>

      {/* DataTable */}
      <DataTable
        // Data props
        data={filteredSOWs}
        columns={columns}
        loading={loading}
        error={error}
        // Display props
        title="SOW Management"
        subtitle="Manage Statements of Work and service configurations"
        theme={theme}
        // Functionality props
        searchable={true}
        searchFields={searchFields}
        searchPlaceholder="Search SOWs by name, client, service type, or SOW ID..."
        selectable={true}
        // Pagination props
        paginated={true}
        itemsPerPage={15}
        itemsPerPageOptions={[10, 15, 25, 50]}
        // Actions props
        actions={actions}
        bulkActions={bulkActions}
        onRowClick={handleRowClick}
        onRefresh={fetchSOWs}
        onExport={handleExportAll}
        onCardView={() => setViewMode("cards")}
        // Selection props
        selectedRows={selectedSOWs}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        // Filter props
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        // Custom props
        emptyStateTitle="No SOWs found"
        emptyStateDescription="Get started by creating your first Statement of Work to define service configurations."
        rowKey="_id"
        // Responsive props
        responsive={true}
        stickyHeader={true}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete SOW"
        message={`Are you sure you want to delete "${sowToDelete?.sowName}"? This action cannot be undone.`}
        confirmText="Delete SOW"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default SOWList;
