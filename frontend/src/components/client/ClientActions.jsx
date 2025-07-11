// frontend/src/components/client/ClientActions.jsx

import React from "react";
import { Button } from "../ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const ClientActions = ({
  client,
  onEdit,
  onDelete,
  onViewDetails,
  onIntegrationSetup,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        theme={theme}
        onClick={() => onViewDetails(client)}
        className="flex items-center space-x-2"
      >
        <Building2 className="w-4 h-4" />
        <span>View Details</span>
      </Button>

      <Button
        variant="secondary"
        size="sm"
        theme={theme}
        onClick={() => onEdit(client)}
        className="flex items-center space-x-2"
      >
        <span>Edit</span>
      </Button>

      {client.status?.clientStatus === "Active" && (
        <Button
          variant="ghost"
          size="sm"
          theme={theme}
          onClick={() => onIntegrationSetup(client)}
          className="flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Integration</span>
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        theme={theme}
        onClick={() => onDelete(client)}
        className="flex items-center space-x-2 text-red-300 hover:text-red-200"
      >
        <span>Delete</span>
      </Button>
    </div>
  );
};
