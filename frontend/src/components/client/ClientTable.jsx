// frontend/src/components/client/ClientTable.jsx

import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { DataTable } from "../common/DataTable.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { ClientStatusBadge } from "./ClientCard.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate } from "../../lib/utils.js";

export const ClientTable = ({
  clients,
  loading,
  selectedClients,
  onClientSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const columns = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={
            selectedClients.length === clients.length && clients.length > 0
          }
          onChange={onSelectAll}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (client) => (
        <input
          type="checkbox"
          checked={selectedClients.includes(client._id)}
          onChange={() => onClientSelect(client._id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      width: "50px",
    },
    {
      key: "clientName",
      header: "Client Name",
      sortable: true,
      render: (client) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}
          >
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-medium">
              {client.clientInfo?.clientName}
            </div>
            <div className={`text-${theme.textSecondary} text-sm`}>
              {client.clientInfo?.clientType}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (client) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-white">
              {client.contactInfo?.primaryContact?.email}
            </span>
          </div>
          {client.contactInfo?.primaryContact?.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-white">
                {client.contactInfo?.primaryContact?.phone}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (client) => (
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-white">
            {client.addressInfo?.businessAddress?.city},{" "}
            {client.addressInfo?.businessAddress?.state}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (client) => (
        <ClientStatusBadge status={client.status?.clientStatus} />
      ),
    },
    {
      key: "onboarding",
      header: "Onboarding",
      render: (client) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-700 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${theme.secondary} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${client.status?.onboardingProgress || 0}%` }}
            ></div>
          </div>
          <span className={`text-${theme.textSecondary} text-sm`}>
            {client.status?.onboardingProgress || 0}%
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (client) => (
        <div className="text-white text-sm">{formatDate(client.createdAt)}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (client) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(client)}
            className="flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(client)}
            className="flex items-center space-x-1"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(client)}
            className="flex items-center space-x-1 text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={clients}
      loading={loading}
      onSort={onSort}
      sortBy={sortBy}
      sortOrder={sortOrder}
      emptyState={{
        title: "No clients found",
        description: "Get started by adding your first client.",
        action: {
          label: "Add Client",
          onClick: () => {},
        },
      }}
    />
  );
};