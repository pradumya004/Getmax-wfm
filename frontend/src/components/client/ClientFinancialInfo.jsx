// frontend/src/components/client/ClientFinancialInfo.jsx

import React from "react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatCurrency } from "../../lib/utils.js";

export const ClientFinancialInfo = ({ client }) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const currency = client.financialInfo?.billingCurrency || "USD";
  const creditLimit = client.financialInfo?.creditLimit || 0;
  const paymentTerms = client.financialInfo?.paymentTerms || "Net 30";

  return (
    <Card className={`${theme.card} p-6`}>
      <h3 className="text-white font-semibold mb-4">Financial Information</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-${theme.textSecondary}`}>Currency</span>
          <span className="text-white">{currency}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-${theme.textSecondary}`}>Credit Limit</span>
          <span className="text-white">
            {formatCurrency(creditLimit, currency)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-${theme.textSecondary}`}>Payment Terms</span>
          <span className="text-white">{paymentTerms}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-${theme.textSecondary}`}>Account Status</span>
          <Badge
            className={
              client.financialInfo?.accountStatus === "Good Standing"
                ? "bg-green-500/20 text-green-300 border-green-400/30"
                : "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
            }
          >
            {client.financialInfo?.accountStatus || "Pending"}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
