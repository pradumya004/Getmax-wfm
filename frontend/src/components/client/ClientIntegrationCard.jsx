// frontend/src/components/client/ClientIntegrationCard.jsx

import React from "react";
import { Card } from "../ui/Card.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { Badge } from "../ui/Badge.jsx";
import { formatDate } from "../../lib/utils.js";

export const ClientIntegrationCard = ({ client }) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const integrationStatus = client.integrationStrategy?.apiConfig?.isConfigured
    ? "Connected"
    : "Not Connected";
  const ehrSystem =
    client.integrationStrategy?.ehrPmSystem?.systemName || "Not Set";
  const workflowType = client.integrationStrategy?.workflowType || "Not Set";

  return (
    <Card className={`${theme.card} p-6`}>
      <h3 className="text-white font-semibold mb-4">Integration Status</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-${theme.textSecondary}`}>Status</span>
          <Badge
            className={
              integrationStatus === "Connected"
                ? "bg-green-500/20 text-green-300 border-green-400/30"
                : "bg-red-500/20 text-red-300 border-red-400/30"
            }
          >
            {integrationStatus}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-${theme.textSecondary}`}>EHR System</span>
          <span className="text-white">{ehrSystem}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-${theme.textSecondary}`}>Workflow Type</span>
          <span className="text-white">{workflowType}</span>
        </div>

        {client.integrationStrategy?.apiConfig?.lastSyncDate && (
          <div className="flex items-center justify-between">
            <span className={`text-${theme.textSecondary}`}>Last Sync</span>
            <span className="text-white text-sm">
              {formatDate(client.integrationStrategy.apiConfig.lastSyncDate)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
