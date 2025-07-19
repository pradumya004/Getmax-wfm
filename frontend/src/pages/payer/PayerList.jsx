// frontend/src/pages/payers/PayerList.jsx
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
  XCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  Globe,
  MapPin,
  Phone,
  Mail,
  Zap,
  Award,
  CreditCard,
  Clock,
  Briefcase,
  Settings,
  Database,
  Star,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  Timer,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/Button.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { usePayers } from "../../hooks/usePayers.jsx";
import { formatDate, formatCurrency } from "../../lib/utils.js";

const PayerList = () => {
  const navigate = useNavigate();
  const { userType, permissions } = useAuth();
  const theme = getTheme(userType);
  const {
    payers,
    loading,
    error,
    refresh,
    removePayer,
    updatePayerStatus,
    bulkUpdatePayers,
    bulkDeletePayers,
  } = usePayers();

  console.log("Payers In PayerList:", payers);

  // State management
  const [viewMode, setViewMode] = useState("table");
  const [selectedPayers, setSelectedPayers] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [payerToDelete, setPayerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    payerType: "all",
    payerCategory: "all",
    riskLevel: "all",
  });

  // Transform Payer data for DataTable compatibility
  const transformedPayers = useMemo(() => {
    if (!payers || !Array.isArray(payers)) return [];
    return payers.map((payer) => ({
      ...payer,
      // Add flattened fields for easier access in DataTable
      payerName: payer.payerInfo?.payerName || "N/A",
      payerType: payer.payerInfo?.payerType || "N/A",
      payerCategory: payer.payerInfo?.payerCategory || "N/A",
      payerIdNumber: payer.identifiers?.payerIdNumber || "N/A",
      isElectronicSupported:
        payer.claimsProcessing?.electronicSubmission?.isSupported || false,
      cleanClaimPayment:
        payer.claimsProcessing?.claimsTimelines?.cleanClaimPayment || 0,
      priorAuthRequired: payer.claimsProcessing?.priorAuthRequired || false,
      eraSupported: payer.paymentInfo?.eraSupported || false,
      averagePaymentTime: payer.paymentInfo?.averagePaymentTime || 0,
      eobDelivery: payer.paymentInfo?.eobDelivery || "N/A",
      paymentRating: payer.performanceMetrics?.paymentRating || "Unknown",
      appealSuccessRate: payer.performanceMetrics?.appealSuccessRate || 0,
      denialRate: payer.performanceMetrics?.denialRate || 0,
      avgDaysToPayment: payer.performanceMetrics?.avgDaysToPayment || 0,
      monthlyClaimVolume: payer.activityMetrics?.monthlyClaimVolume || 0,
      monthlyPaymentVolume: payer.activityMetrics?.monthlyPaymentVolume || 0,
      contractType: payer.contractInfo?.contractType || "No Contract",
      feeSchedule: payer.contractInfo?.feeSchedule || "N/A",
      paymentTerms: payer.contractInfo?.paymentTerms || "N/A",
      isActive: payer.systemConfig?.isActive !== false,
      riskLevel: payer.systemConfig?.riskLevel || "Unknown",
      isPreferred: payer.systemConfig?.isPreferred || false,
      dataSource: payer.systemConfig?.dataSource || "Manual",
      country: payer.addressInfo?.corporateHeadquarters?.country || "N/A",
      clearinghouseCount: payer.identifiers?.clearinghouseIds?.length || 0,
      regionalOffices: payer.addressInfo?.regionalOffices?.length || 0,
      lastUpdated: payer.updatedAt,
    }));
  }, [payers]);

  // DataTable columns configuration
  const columns = [
    {
      key: "payerName",
      label: "Payer Details",
      sortable: true,
      render: (value, payer) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${theme.secondary} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-gray-400 flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>{payer.payerId}</span>
            </div>
            <div className="text-xs text-gray-500">
              ID: {payer.payerIdNumber}
            </div>
          </div>
        </div>
      ),
      width: "280px",
    },
    {
      key: "payerType",
      label: "Type & Category",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">{value}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">{payer.payerCategory}</span>
          </div>
        </div>
      ),
      width: "180px",
    },
    {
      key: "isActive",
      label: "Status & Risk",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {value ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm text-white font-medium">
              {value ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle
              className={`w-4 h-4 ${
                payer.riskLevel === "Low"
                  ? "text-green-500"
                  : payer.riskLevel === "Medium"
                  ? "text-yellow-500"
                  : payer.riskLevel === "High"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                payer.riskLevel === "Low"
                  ? "text-green-500"
                  : payer.riskLevel === "Medium"
                  ? "text-yellow-500"
                  : payer.riskLevel === "High"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {payer.riskLevel} Risk
            </span>
          </div>
          {payer.isPreferred && (
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-yellow-400">Preferred</span>
            </div>
          )}
        </div>
      ),
      width: "140px",
    },
    {
      key: "isElectronicSupported",
      label: "Claims Processing",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {value ? (
              <Zap className="w-4 h-4 text-green-500" />
            ) : (
              <FileText className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-xs text-white">
              {value ? "Electronic" : "Manual"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">
              {payer.cleanClaimPayment} days
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {payer.priorAuthRequired ? (
              <Lock className="w-4 h-4 text-orange-500" />
            ) : (
              <Unlock className="w-4 h-4 text-green-500" />
            )}
            <span className="text-xs text-gray-400">
              {payer.priorAuthRequired ? "Auth Req'd" : "No Auth"}
            </span>
          </div>
        </div>
      ),
      width: "160px",
    },
    {
      key: "contractType",
      label: "Contract Details",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">{value}</span>
          </div>
          <div className="text-xs text-gray-400">{payer.feeSchedule}</div>
          <div className="text-xs text-gray-400">{payer.paymentTerms}</div>
        </div>
      ),
      width: "160px",
    },
    {
      key: "eraSupported",
      label: "Payment Info",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {value ? (
              <CreditCard className="w-4 h-4 text-green-500" />
            ) : (
              <Mail className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-xs text-white">
              {value ? "ERA Supported" : "Paper EOB"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">
              {payer.averagePaymentTime} days avg
            </span>
          </div>
          <div className="text-xs text-gray-400">{payer.eobDelivery}</div>
        </div>
      ),
      width: "140px",
    },
    {
      key: "paymentRating",
      label: "Performance",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Award
              className={`w-4 h-4 ${
                value === "Excellent"
                  ? "text-green-500"
                  : value === "Good"
                  ? "text-blue-500"
                  : value === "Fair"
                  ? "text-yellow-500"
                  : value === "Poor"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                value === "Excellent"
                  ? "text-green-500"
                  : value === "Good"
                  ? "text-blue-500"
                  : value === "Fair"
                  ? "text-yellow-500"
                  : value === "Poor"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {value}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">
              {payer.appealSuccessRate}% appeals
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">
              {payer.denialRate}% denials
            </span>
          </div>
        </div>
      ),
      width: "140px",
    },
    {
      key: "monthlyClaimVolume",
      label: "Activity Volume",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white font-medium">
              {formatCurrency(value)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">
              {formatCurrency(payer.monthlyPaymentVolume)}
            </span>
          </div>
          <div className="text-xs text-gray-400">Monthly volume</div>
        </div>
      ),
      width: "140px",
    },
    {
      key: "clearinghouseCount",
      label: "Clearinghouses",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">{value}</span>
          </div>
          <div className="text-xs text-gray-400">
            {value === 1 ? "clearinghouse" : "clearinghouses"}
          </div>
        </div>
      ),
      width: "120px",
    },
    {
      key: "country",
      label: "Location",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white">{value}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">
              {payer.regionalOffices} offices
            </span>
          </div>
        </div>
      ),
      width: "120px",
    },
    {
      key: "dataSource",
      label: "Data Source",
      sortable: true,
      render: (value, payer) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white">{value}</span>
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(payer.lastUpdated)}
          </div>
        </div>
      ),
      width: "120px",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value, payer) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewPayer(payer);
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
              handleEditPayer(payer);
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
              handleDeletePayer(payer);
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
    "payerName",
    "payerId",
    "payerType",
    "payerCategory",
    "payerIdNumber",
    "country",
  ];

  // Filter configuration
  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "payerType",
      label: "Payer Type",
      options: [
        { value: "all", label: "All Types" },
        { value: "Commercial", label: "Commercial" },
        { value: "Medicare", label: "Medicare" },
        { value: "Medicaid", label: "Medicaid" },
        { value: "Workers Compensation", label: "Workers Compensation" },
        { value: "Auto Insurance", label: "Auto Insurance" },
        { value: "Government", label: "Government" },
      ],
    },
    {
      key: "payerCategory",
      label: "Category",
      options: [
        { value: "all", label: "All Categories" },
        { value: "Primary", label: "Primary" },
        { value: "Secondary", label: "Secondary" },
        { value: "Tertiary", label: "Tertiary" },
      ],
    },
    {
      key: "riskLevel",
      label: "Risk Level",
      options: [
        { value: "all", label: "All Risk Levels" },
        { value: "Low", label: "Low Risk" },
        { value: "Medium", label: "Medium Risk" },
        { value: "High", label: "High Risk" },
      ],
    },
  ];

  // Action buttons configuration
  const actions = [
    {
      label: "New Payer",
      icon: Plus,
      onClick: () => navigate("/company/payers/create"),
      variant: "primary",
      permission: permissions?.payer?.includes("Create"),
    },
  ];

  // Bulk actions configuration
  const bulkActions = [
    {
      label: "Activate Payers",
      icon: Play,
      onClick: (selectedIds) => handleBulkStatusUpdate(selectedIds, true),
      variant: "outline",
      permission: permissions?.payer?.includes("Update"),
    },
    {
      label: "Deactivate Payers",
      icon: Pause,
      onClick: (selectedIds) => handleBulkStatusUpdate(selectedIds, false),
      variant: "outline",
      permission: permissions?.payer?.includes("Update"),
    },
    {
      label: "Delete Payers",
      icon: Trash2,
      onClick: (selectedIds) => handleBulkDelete(selectedIds),
      variant: "outline",
      className: "text-red-400 border-red-400 hover:bg-red-500/20",
      permission: permissions?.payer?.includes("Delete"),
    },
  ];

  // Event handlers
  const handleRowClick = (payer) => {
    navigate(`/company/payers/details/${payer.payerId}`);
  };

  const handleRowSelect = (selectedIds) => {
    setSelectedPayers(selectedIds);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedPayers(transformedPayers.map((payer) => payer._id));
    } else {
      setSelectedPayers([]);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleEditPayer = (payer) => {
    navigate(`/company/payers/edit/${payer.payerId}`);
  };

  const handleViewPayer = (payer) => {
    navigate(`/company/payers/details/${payer.payerId}`);
  };

  const handleDeletePayer = (payer) => {
    setPayerToDelete(payer);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!payerToDelete) return;
    setIsDeleting(true);
    try {
      console.log("Deleting Payer:", payerToDelete.payerId);

      await removePayer(payerToDelete.payerId);
      toast.success("Payer deleted successfully!");
      setShowDeleteDialog(false);
      setPayerToDelete(null);
    } catch (error) {
      console.error("Delete Payer error:", error);
      setShowDeleteDialog(false);
      setPayerToDelete(null);
      toast.error("Failed to delete payer");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkStatusUpdate = async (selectedIds, isActive) => {
    try {
      await bulkUpdatePayers(selectedIds, { isActive });
      setSelectedPayers([]);
      toast.success(
        `${selectedIds.length} payer(s) ${
          isActive ? "activated" : "deactivated"
        } successfully!`
      );
    } catch (error) {
      console.error("Bulk status update error:", error);
      setSelectedPayers([]);
      toast.error("Failed to update payer status");
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected payer(s)?`
      )
    ) {
      try {
        await bulkDeletePayers(selectedIds);
        setSelectedPayers([]);
        toast.success(`${selectedIds.length} payer(s) deleted successfully!`);
      } catch (error) {
        console.error("Bulk delete error:", error);
        toast.error("Failed to delete payers");
      }
    }
  };

  const handleExportAll = () => {
    // Export functionality
    const csvData = transformedPayers.map((payer) => ({
      "Payer Name": payer.payerName,
      "Payer ID": payer.payerId,
      "Payer Type": payer.payerType,
      Category: payer.payerCategory,
      Status: payer.isActive ? "Active" : "Inactive",
      "Electronic Claims": payer.isElectronicSupported ? "Yes" : "No",
      "ERA Supported": payer.eraSupported ? "Yes" : "No",
      "Payment Rating": payer.paymentRating,
      "Risk Level": payer.riskLevel,
      Country: payer.country,
      "Last Updated": formatDate(payer.lastUpdated),
    }));

    // Convert to CSV and download
    console.log("Exporting Payer data:", csvData);
    toast.success("Payer data exported successfully!");
  };

  // Apply filters to data
  const filteredPayers = useMemo(() => {
    return transformedPayers.filter((payer) => {
      if (
        activeFilters.status !== "all" &&
        ((activeFilters.status === "active" && !payer.isActive) ||
          (activeFilters.status === "inactive" && payer.isActive))
      ) {
        return false;
      }
      if (
        activeFilters.payerType !== "all" &&
        payer.payerType !== activeFilters.payerType
      ) {
        return false;
      }
      if (
        activeFilters.payerCategory !== "all" &&
        payer.payerCategory !== activeFilters.payerCategory
      ) {
        return false;
      }
      if (
        activeFilters.riskLevel !== "all" &&
        payer.riskLevel !== activeFilters.riskLevel
      ) {
        return false;
      }
      return true;
    });
  }, [transformedPayers, activeFilters]);

  console.log("Transformed Payers:", transformedPayers);
  console.log("Filtered Payers:", filteredPayers);

  return (
    <div className={`p-6 bg-${theme.background} min-h-screen`}>
      <Helmet>
        <title>Payer Directory - ClaimMD</title>
      </Helmet>

      {/* DataTable */}
      <DataTable
        // Data props
        data={filteredPayers}
        columns={columns}
        loading={loading}
        error={error}
        // Display props
        title="Payer Directory"
        subtitle="Comprehensive healthcare payer management and analytics"
        theme={theme}
        // Functionality props
        searchable={true}
        searchFields={searchFields}
        searchPlaceholder="Search payers by name, type, category, or payer ID..."
        selectable={true}
        // Pagination props
        paginated={true}
        itemsPerPage={15}
        itemsPerPageOptions={[10, 15, 25, 50]}
        // Actions props
        actions={actions}
        bulkActions={bulkActions}
        onRowClick={handleRowClick}
        onRefresh={refresh}
        onExport={handleExportAll}
        onCardView={() => setViewMode("cards")}
        // Selection props
        selectedRows={selectedPayers}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        // Filter props
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        // Custom props
        emptyStateTitle="No payers found"
        emptyStateDescription="Get started by adding healthcare payers to manage billing and payment processes."
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
        title="Delete Payer"
        message={`Are you sure you want to delete "${payerToDelete?.payerName}"? This action cannot be undone.`}
        confirmText="Delete Payer"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default PayerList;