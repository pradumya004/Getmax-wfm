// frontend/src/pages/client/ClientList.jsx

import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Users,
  Plus,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MoreHorizontal,
  UserPlus,
  Filter,
  Grid,
  List,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { ClientCard } from "../../components/client/ClientCard.jsx";
import { ClientStatusBadge } from "../../components/client/ClientStatusBadge.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatDate } from "../../lib/utils.js";

const ClientList = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();
  const { clients, loading, error, removeClient, uploadClients, refresh } =
    useClients();

  // Local state
  const [viewMode, setViewMode] = useState("table");
  const [selectedClients, setSelectedClients] = useState([]);
  // const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    type: "all",
    onboardingStatus: "all",
  });

  // Transform client data for DataTable compatibility
  const transformedClients = useMemo(() => {
    if (!clients || !Array.isArray(clients)) return [];

    return clients.map((client) => ({
      ...client,
      // Add flattened fields for easier access in DataTable
      clientName: client.clientInfo?.clientName || client.clientName || "N/A",
      email: client.contactInfo?.primaryContact?.email || client.email || "N/A",
      phone: client.contactInfo?.primaryContact?.phone || client.phone || "",
      industry:
        client.clientInfo?.industry || client.industry || "Not specified",
      clientCode: client.clientInfo?.clientCode || client.clientCode || "N/A",
      city: client.address?.city || client.city || "Not specified",
      clientStatus: client.status?.clientStatus || "Unknown",
      onboardingStatus: client.status?.onboardingStatus || "Not Started",
      clientType:
        client.clientInfo?.clientType || client.type || "Not specified",
    }));
  }, [clients]);

  // Table columns configuration
  const columns = [
    {
      key: "clientName",
      label: "Client Name",
      sortable: true,
      render: (value, client) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-gray-400">{client.clientCode}</div>
          </div>
        </div>
      ),
      width: "250px",
    },
    {
      key: "email",
      label: "Contact",
      render: (value, client) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{value}</span>
          </div>
          {client.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{client.phone}</span>
            </div>
          )}
        </div>
      ),
      width: "200px",
    },
    {
      key: "clientStatus",
      label: "Status",
      type: "badge",
      render: (value, client) => <ClientStatusBadge status={value} />,
      width: "120px",
    },
    {
      key: "onboardingStatus",
      label: "Onboarding",
      type: "badge",
      render: (value, client) => {
        const variants = {
          Completed: "success",
          "In Progress": "warning",
          "Not Started": "secondary",
          "On Hold": "danger",
        };
        return (
          <Badge variant={variants[value] || "secondary"}>
            {value || "Not Started"}
          </Badge>
        );
      },
      width: "120px",
    },
    {
      key: "industry",
      label: "Industry",
      render: (value) => (
        <span className="text-sm text-gray-300">
          {value || "Not specified"}
        </span>
      ),
      width: "150px",
    },
    {
      key: "city",
      label: "Location",
      render: (value, client) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{value}</span>
        </div>
      ),
      width: "150px",
    },
    {
      key: "createdAt",
      label: "Created",
      type: "date",
      render: (value) => (
        <div className="text-sm text-gray-400">{formatDate(value)}</div>
      ),
      width: "120px",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value, client) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clients/${client._id}`);
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
              navigate(`/clients/${client._id}/edit`);
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
              handleDeleteClient(client);
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

  // Filter configurations
  const filters = [
    {
      key: "clientStatus",
      label: "Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Prospect", label: "Prospect" },
        { value: "Suspended", label: "Suspended" },
      ],
    },
    {
      key: "clientType",
      label: "Type",
      options: [
        { value: "Enterprise", label: "Enterprise" },
        { value: "SME", label: "SME" },
        { value: "Startup", label: "Startup" },
      ],
    },
    {
      key: "onboardingStatus",
      label: "Onboarding",
      options: [
        { value: "Completed", label: "Completed" },
        { value: "In Progress", label: "In Progress" },
        { value: "Not Started", label: "Not Started" },
        { value: "On Hold", label: "On Hold" },
      ],
    },
  ];

  // Action buttons configuration
  const actions = [
    {
      label: "Add Client",
      icon: Plus,
      variant: "primary",
      onClick: () => navigate("/employee/clients/intake"),
      className: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Bulk Upload",
      icon: Upload,
      variant: "outline",
      onClick: () => navigate("/employee/clients/bulk-upload"),
    },
  ];

  // Bulk actions configuration
  const bulkActions = [
    {
      label: "Export Selected",
      icon: Download,
      onClick: (selectedIds) => handleBulkExport(selectedIds),
    },
    {
      label: "Delete Selected",
      icon: Trash2,
      onClick: (selectedIds) => handleBulkDelete(selectedIds),
      className: "text-red-400 hover:text-red-300",
    },
  ];

  // Event handlers
  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      await removeClient(clientToDelete._id);
      toast.success("Client deleted successfully");
      setShowDeleteDialog(false);
      setClientToDelete(null);
    } catch (error) {
      setShowDeleteDialog(false);
      setClientToDelete(null);
      console.log("Error: ", error);
      toast.error("Failed to delete client");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!selectedIds.length) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} client(s)?`
    );

    if (!confirmed) return;

    try {
      await Promise.all(selectedIds.map((id) => removeClient(id)));
      toast.success(`${selectedIds.length} client(s) deleted successfully`);
      setSelectedClients([]);
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to delete selected clients");
    }
  };

  const handleBulkExport = (selectedIds) => {
    const selectedClientsData = transformedClients.filter((client) =>
      selectedIds.includes(client._id)
    );

    // Create CSV content
    const headers = ["Name", "Email", "Phone", "Status", "Industry", "Created"];
    const csvContent = [
      headers.join(","),
      ...selectedClientsData.map((client) =>
        [
          client.clientName,
          client.email,
          client.phone || "",
          client.clientStatus || "",
          client.industry || "",
          formatDate(client.createdAt),
        ].join(",")
      ),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Clients exported successfully");
  };

  const handleRowClick = (client) => {
    console.log("Client clicked:", client.clientId);

    navigate(`/employee/clients/details/${client.clientId}`);
  };

  const handleRowSelect = (id) => {
    setSelectedClients((prev) =>
      prev.includes(id)
        ? prev.filter((clientId) => clientId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (ids) => {
    setSelectedClients(ids);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleExportAll = () => {
    if (!transformedClients.length) {
      toast.error("No clients to export");
      return;
    }

    handleBulkExport(transformedClients.map((client) => client._id));
  };

  // Search fields for the DataTable
  const searchFields = [
    "clientName",
    "email",
    "phone",
    "industry",
    "clientCode",
    "city",
  ];

  // Filter the clients based on active filters
  const filteredClients = useMemo(() => {
    if (!transformedClients) return [];

    return transformedClients.filter((client) => {
      // Status filter
      if (
        activeFilters.status !== "all" &&
        client.clientStatus !== activeFilters.status
      ) {
        return false;
      }

      // Type filter
      if (
        activeFilters.type !== "all" &&
        client.clientType !== activeFilters.type
      ) {
        return false;
      }

      // Onboarding status filter
      if (
        activeFilters.onboardingStatus !== "all" &&
        client.onboardingStatus !== activeFilters.onboardingStatus
      ) {
        return false;
      }

      return true;
    });
  }, [transformedClients, activeFilters]);

  // Debug logging
  console.log("Raw clients:", clients);
  console.log("Transformed clients:", transformedClients);
  console.log("Filtered clients:", filteredClients);

  if (viewMode === "cards") {
    return (
      <div className="space-y-6">
        <Helmet>
          <title>Client List - LeadRepo</title>
        </Helmet>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <p className="text-gray-400">Manage your client relationships</p>
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
              onClick={() => navigate("/employee/clients/intake")}
              className="flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client._id}
              client={client}
              onView={() => navigate(`/clients/${client._id}`)}
              onEdit={() => navigate(`/clients/${client._id}/edit`)}
              onDelete={() => handleDeleteClient(client)}
            />
          ))}
        </div>

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Client"
          message={`Are you sure you want to delete "${
            clientToDelete?.clientName || clientToDelete?.clientInfo?.clientName
          }"? This action cannot be undone.`}
          type="danger"
          confirmText="Delete"
          loading={isDeleting}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Client List - LeadRepo</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-gray-400">Manage your client relationships</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("cards")}
            className="flex items-center space-x-1"
          >
            <Grid className="w-4 h-4" />
            <span>Card View</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            className="flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </Button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={filteredClients}
        columns={columns}
        loading={loading}
        error={error}
        title="Client Management"
        subtitle="Comprehensive client information and management"
        theme={theme}
        // Search configuration
        searchable={true}
        searchFields={searchFields}
        searchPlaceholder="Search clients by name, email, phone, or industry..."
        // Selection configuration
        selectable={true}
        selectedRows={selectedClients}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        // Interaction configuration
        onRowClick={handleRowClick}
        onRefresh={refresh}
        onExport={handleExportAll}
        // Actions configuration
        actions={actions}
        bulkActions={bulkActions}
        // Filter configuration
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        // Pagination configuration
        paginated={true}
        itemsPerPage={15}
        itemsPerPageOptions={[10, 15, 25, 50]}
        // Styling configuration
        responsive={true}
        stickyHeader={true}
        // Empty state configuration
        emptyStateTitle="No clients found"
        emptyStateDescription="Get started by adding your first client or importing from a file."
        // Row key
        rowKey="_id"
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        message={`Are you sure you want to delete "${
          clientToDelete?.clientName || clientToDelete?.clientInfo?.clientName
        }"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  );
};

export default ClientList;
