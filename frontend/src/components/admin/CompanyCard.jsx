// frontend/src/components/admin/CompanyCard.jsx

import React from "react";
import { Building, Users, Calendar, MoreVertical } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { formatDate, formatCurrency } from "../../lib/utils.js";

export const CompanyCard = ({ company, onEdit, onSuspend, onChangePlan }) => {
  return (
    <Card theme="admin" className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {company.companyName}
            </h3>
            <p className="text-gray-400 text-sm">{company.companyId}</p>
          </div>
        </div>
        <Badge status={company.isActive ? "active" : "suspended"}>
          {company.isActive ? "Active" : "Suspended"}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Employees</span>
          <span className="text-white font-medium">
            {company.totalEmployees || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Plan</span>
          <Badge variant="default">{company.subscriptionPlan}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Joined</span>
          <span className="text-white text-sm">
            {formatDate(company.createdAt, "short")}
          </span>
        </div>
      </div>

      <div className="flex space-x-2 pt-4 border-t border-slate-700">
        <Button
          variant="outline"
          theme="admin"
          onClick={() => onEdit(company)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="outline"
          theme="admin"
          onClick={() => onChangePlan(company)}
          className="flex-1"
        >
          Change Plan
        </Button>
        <Button
          variant="outline"
          theme="admin"
          onClick={() => onSuspend(company)}
          className="p-2"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};