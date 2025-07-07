// frontend/src/components/organization/OrgDataTable.jsx

import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { SearchBar } from "../common/SearchBar.jsx";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";

export const OrgDataTable = ({
  data = [],
  type,
  onAdd,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Define columns based on type
  const getColumns = () => {
    switch (type) {
      case "roles":
        return [
          { key: "roleName", label: "Role Name", sortable: true },
          { key: "roleCode", label: "Code", sortable: true },
          { key: "roleLevel", label: "Level", sortable: true },
          { key: "description", label: "Description" },
          {
            key: "isActive",
            label: "Status",
            render: (value) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {value ? "Active" : "Inactive"}
              </span>
            ),
          },
        ];

      case "departments":
        return [
          { key: "departmentName", label: "Department Name", sortable: true },
          { key: "departmentCode", label: "Code", sortable: true },
          { key: "departmentLevel", label: "Level", sortable: true },
          { key: "headOfDepartment", label: "Head" },
          { key: "description", label: "Description" },
          {
            key: "isActive",
            label: "Status",
            render: (value) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {value ? "Active" : "Inactive"}
              </span>
            ),
          },
        ];

      case "designations":
        return [
          { key: "designationName", label: "Designation Name", sortable: true },
          { key: "designationCode", label: "Code", sortable: true },
          { key: "level", label: "Level", sortable: true },
          { key: "category", label: "Category", sortable: true },
          { key: "description", label: "Description" },
        ];

      case "subdepartments":
        return [
          {
            key: "subdepartmentName",
            label: "Sub-Department Name",
            sortable: true,
          },
          { key: "subdepartmentCode", label: "Code", sortable: true },
          {
            key: "departmentRef",
            label: "Parent Department",
            render: (value) => (
              <span className="text-blue-400">
                {value?.departmentName || "N/A"}
              </span>
            ),
          },
          { key: "functionType", label: "Function Type", sortable: true },
          { key: "teamSize", label: "Team Size" },
          { key: "teamLead", label: "Team Lead" },
        ];

      default:
        return [];
    }
  };

  const columns = getColumns();

  // Filter and sort data
  const filteredData = data
    .filter((item) => {
      if (!searchTerm) return true;
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getTitle = () => {
    switch (type) {
      case "roles":
        return "Roles";
      case "departments":
        return "Departments";
      case "designations":
        return "Designations";
      case "subdepartments":
        return "Sub-Departments";
      default:
        return "Data";
    }
  };

  const getAddButtonText = () => {
    switch (type) {
      case "roles":
        return "Add Role";
      case "departments":
        return "Add Department";
      case "designations":
        return "Add Designation";
      case "subdepartments":
        return "Add Sub-Department";
      default:
        return "Add New";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading {getTitle().toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">
            {getTitle()} Management
          </h2>
          <p className="text-gray-400 text-sm">
            Manage your organization's {getTitle().toLowerCase()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={`Search ${getTitle().toLowerCase()}...`}
            onClear={() => setSearchTerm("")}
            className="w-64"
          />

          <Button
            onClick={onAdd}
            theme={userType}
            className="inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{getAddButtonText()}</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 text-gray-300 font-medium ${
                    column.sortable ? "cursor-pointer hover:text-white" : ""
                  }`}
                  onClick={
                    column.sortable ? () => handleSort(column.key) : undefined
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortField === column.key && (
                      <span className="text-blue-400">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="text-right py-3 px-4 text-gray-300 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item._id || index}
                className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4">
                    {column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      <span className="text-gray-300">
                        {item[column.key] || "N/A"}
                      </span>
                    )}
                  </td>
                ))}
                <td className="py-3 px-4 text-right">
                  <div className="flex space-x-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="p-2 hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item._id)}
                      className="p-2 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {searchTerm ? (
                <>
                  <Search className="w-8 h-8 mx-auto mb-2" />
                  <p>
                    No {getTitle().toLowerCase()} found matching "{searchTerm}"
                  </p>
                </>
              ) : (
                <>
                  <Filter className="w-8 h-8 mx-auto mb-2" />
                  <p>No {getTitle().toLowerCase()} created yet</p>
                </>
              )}
            </div>
            {!searchTerm && (
              <Button onClick={onAdd} theme={userType} variant="outline">
                {getAddButtonText()}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredData.length > 0 && (
        <div className="text-sm text-gray-400 text-center">
          Showing {filteredData.length} of {data.length}{" "}
          {getTitle().toLowerCase()}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </div>
  );
};
