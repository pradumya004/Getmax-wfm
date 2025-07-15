// frontend/src/components/sow/SOWFilters.jsx
import React, { useState } from "react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { Select } from "../ui/Select.jsx";
import { Input } from "../ui/Input.jsx";
import { Badge } from "../ui/Badge.jsx";
import {
  Filter,
  X,
  Search,
  Calendar,
  DollarSign,
  Target,
  Users,
  Building2,
  FileText,
  RotateCcw,
} from "lucide-react";

export const SOWFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  clients = [],
  theme,
}) => {
  console.log("Clints in SOWFilters:", clients);
  
  
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Draft", label: "Draft" },
    { value: "Inactive", label: "Inactive" },
    { value: "Suspended", label: "Suspended" },
    { value: "Completed", label: "Completed" },
  ];

  const serviceTypeOptions = [
    { value: "", label: "All Service Types" },
    { value: "AR Calling", label: "AR Calling" },
    { value: "Medical Coding", label: "Medical Coding" },
    { value: "Prior Authorization", label: "Prior Authorization" },
    { value: "Eligibility Verification", label: "Eligibility Verification" },
    { value: "Charge Entry", label: "Charge Entry" },
    { value: "Payment Posting", label: "Payment Posting" },
    { value: "Denial Management", label: "Denial Management" },
    { value: "Quality Assurance", label: "Quality Assurance" },
    { value: "Custom Service", label: "Custom Service" },
  ];

  const contractTypeOptions = [
    { value: "", label: "All Contract Types" },
    { value: "End-to-End", label: "End-to-End" },
    { value: "Transactional", label: "Transactional" },
    { value: "FTE", label: "FTE" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  const billingModelOptions = [
    { value: "", label: "All Billing Models" },
    { value: "Per Transaction", label: "Per Transaction" },
    { value: "Monthly Fixed", label: "Monthly Fixed" },
    { value: "Hourly", label: "Hourly" },
    { value: "Performance Based", label: "Performance Based" },
  ];

  const clientOptions = [
    { value: "", label: "All Clients" },
    ...clients.map((client) => ({
      value: client._id,
      label: client.clientInfo?.clientName || "Unknown Client",
    })),
  ];

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value && value !== "")
      .length;
  };

  const handleClearAll = () => {
    onClearFilters();
    setIsExpanded(false);
  };

  return (
    <Card className={`${theme?.card || "bg-gray-800/50"} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-white font-medium">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <Badge className="bg-emerald-500/20 text-emerald-400">
              {getActiveFilterCount()} active
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-gray-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Select
          placeholder="Status"
          value={filters.status || ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={statusOptions}
          className="w-full"
        />
        <Select
          placeholder="Service Type"
          value={filters.serviceType || ""}
          onChange={(e) => onFilterChange("serviceType", e.target.value)}
          options={serviceTypeOptions}
          className="w-full"
        />
        <Select
          placeholder="Client"
          value={filters.client || ""}
          onChange={(e) => onFilterChange("client", e.target.value)}
          options={clientOptions}
          className="w-full"
        />
        <Select
          placeholder="Contract Type"
          value={filters.contractType || ""}
          onChange={(e) => onFilterChange("contractType", e.target.value)}
          options={contractTypeOptions}
          className="w-full"
        />
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              placeholder="Billing Model"
              value={filters.billingModel || ""}
              onChange={(e) => onFilterChange("billingModel", e.target.value)}
              options={billingModelOptions}
              className="w-full"
            />

            {/* Date Range Filters */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Start Date From</label>
              <Input
                type="date"
                value={filters.startDateFrom || ""}
                onChange={(e) =>
                  onFilterChange("startDateFrom", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Start Date To</label>
              <Input
                type="date"
                value={filters.startDateTo || ""}
                onChange={(e) => onFilterChange("startDateTo", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Numeric Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Min Daily Target</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minDailyTarget || ""}
                onChange={(e) =>
                  onFilterChange("minDailyTarget", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Max Daily Target</label>
              <Input
                type="number"
                placeholder="1000"
                value={filters.maxDailyTarget || ""}
                onChange={(e) =>
                  onFilterChange("maxDailyTarget", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Min Headcount</label>
              <Input
                type="number"
                placeholder="1"
                value={filters.minHeadcount || ""}
                onChange={(e) => onFilterChange("minHeadcount", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Max Headcount</label>
              <Input
                type="number"
                placeholder="100"
                value={filters.maxHeadcount || ""}
                onChange={(e) => onFilterChange("maxHeadcount", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Performance Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Min SLA Compliance (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="85"
                value={filters.minSlaCompliance || ""}
                onChange={(e) =>
                  onFilterChange("minSlaCompliance", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Min Quality Score (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="90"
                value={filters.minQualityScore || ""}
                onChange={(e) =>
                  onFilterChange("minQualityScore", e.target.value)
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};