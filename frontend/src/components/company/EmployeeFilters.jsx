// frontend/src/components/company/EmployeeFilters.jsx

import React, { useState } from "react";
import { Filter, X, Download } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { Select } from "../ui/Select.jsx";
import { SearchBar } from "../common/SearchBar.jsx";
import { ExportButton } from "../common/ExportButton.jsx";
import { useOrganization } from "../../hooks/useOrganization.jsx";

export const EmployeeFilters = ({
  filters,
  onFiltersChange,
  employeeCount = 0,
  employees = [],
  className = "",
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { orgData } = useOrganization();

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      role: "",
      department: "",
      designation: "",
      status: "",
      location: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const roleOptions = orgData.roles.map((role) => ({
    value: role._id,
    label: role.roleName,
  }));

  const departmentOptions = orgData.departments.map((dept) => ({
    value: dept._id,
    label: dept.departmentName,
  }));

  const designationOptions = orgData.designations.map((designation) => ({
    value: designation._id,
    label: designation.designationName,
  }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const locationOptions = [
    { value: "Office", label: "Office" },
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  return (
    <Card theme="company" className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Top Row - Search and Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={filters.search || ""}
              onChange={(value) => handleFilterChange("search", value)}
              placeholder="Search employees..."
              onClear={() => handleFilterChange("search", "")}
            />
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-sm">
              {employeeCount} employee{employeeCount !== 1 ? "s" : ""}
            </span>

            <ExportButton
              data={employees}
              filename="employees"
              theme="company"
            />

            <Button
              variant="outline"
              theme="company"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-slate-700 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Select
                label="Role"
                value={filters.role || ""}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                options={roleOptions}
                placeholder="All roles"
              />

              <Select
                label="Department"
                value={filters.department || ""}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
                options={departmentOptions}
                placeholder="All departments"
              />

              <Select
                label="Designation"
                value={filters.designation || ""}
                onChange={(e) =>
                  handleFilterChange("designation", e.target.value)
                }
                options={designationOptions}
                placeholder="All designations"
              />

              <Select
                label="Status"
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={statusOptions}
                placeholder="All statuses"
              />

              <Select
                label="Location"
                value={filters.location || ""}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                options={locationOptions}
                placeholder="All locations"
              />
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end mt-4">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="inline-flex items-center space-x-2 text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};