// frontend/src/components/client/ClientFilters.jsx

import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  Calendar,
  MapPin,
  Building2,
  Users,
  Clock,
} from "lucide-react";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const ClientFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  availableStates = [],
  availableTypes = [],
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "all" && value !== ""
  ).length;

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "prospect", label: "Prospect" },
    { value: "onboarding", label: "Onboarding" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
  ];

  const onboardingStatusOptions = [
    { value: "all", label: "All Onboarding Status" },
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const riskLevelOptions = [
    { value: "all", label: "All Risk Levels" },
    { value: "low", label: "Low Risk" },
    { value: "medium", label: "Medium Risk" },
    { value: "high", label: "High Risk" },
  ];

  const periodOptions = [
    { value: "all", label: "All Time" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
  ];

  return (
    <Card className={`${theme.card} p-6`}>
      <div className="space-y-4">
        {/* Basic Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status || "all"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            options={statusOptions}
          />

          <Select
            value={filters.type || "all"}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            options={[
              { value: "all", label: "All Types" },
              ...availableTypes.map((type) => ({ value: type, label: type })),
            ]}
          />

          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Advanced</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <Select
              label="Onboarding Status"
              value={filters.onboardingStatus || "all"}
              onChange={(e) =>
                handleFilterChange("onboardingStatus", e.target.value)
              }
              options={onboardingStatusOptions}
            />

            <Select
              label="Risk Level"
              value={filters.riskLevel || "all"}
              onChange={(e) => handleFilterChange("riskLevel", e.target.value)}
              options={riskLevelOptions}
            />

            <Select
              label="Location"
              value={filters.state || "all"}
              onChange={(e) => handleFilterChange("state", e.target.value)}
              options={[
                { value: "all", label: "All States" },
                ...availableStates.map((state) => ({
                  value: state,
                  label: state,
                })),
              ]}
            />

            <Select
              label="Created"
              value={filters.period || "all"}
              onChange={(e) => handleFilterChange("period", e.target.value)}
              options={periodOptions}
            />
          </div>
        )}

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
            <span className={`text-${theme.textSecondary} text-sm`}>
              Active filters:
            </span>

            {filters.search && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>Search: {filters.search}</span>
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange("search", "")}
                />
              </Badge>
            )}

            {filters.status && filters.status !== "all" && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>Status: {filters.status}</span>
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange("status", "all")}
                />
              </Badge>
            )}

            {filters.type && filters.type !== "all" && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>Type: {filters.type}</span>
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange("type", "all")}
                />
              </Badge>
            )}

            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};