// frontend/src/components/common/DataTable.jsx

import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Badge } from "../ui/Badge.jsx";
import { LoadingSpinner } from "../ui/LoadingSpinner.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const DataTable = ({
  // Data props
  data = [],
  columns = [],
  loading = false,
  error = null,

  // Display props
  title = "",
  subtitle = "",
  theme: propTheme = null,
  className = "",

  // Functionality props
  searchable = true,
  searchFields = [],
  searchPlaceholder = "Search...",
  sortable = true,
  selectable = false,

  // Pagination props
  paginated = true,
  itemsPerPage = 10,
  itemsPerPageOptions = [10, 25, 50, 100],

  // Action props
  actions = [],
  bulkActions = [],
  onRowClick = null,
  onRefresh = null,
  onExport = null,

  // Selection props
  selectedRows = [],
  onRowSelect = null,
  onSelectAll = null,

  // Filter props
  filters = [],
  activeFilters = {},
  onFilterChange = null,

  // Custom props
  emptyStateTitle = "No data found",
  emptyStateDescription = "There are no records to display.",
  rowKey = "_id",

  // Responsive props
  responsive = true,
  stickyHeader = false,

  // Custom renderers
  customEmptyState = null,
  customLoadingState = null,
  customError = null,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(propTheme || userType);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [showFilters, setShowFilters] = useState(false);

  // Search functionality
  const searchData = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data;

    const searchTermLower = searchTerm.toLowerCase();
    const fieldsToSearch =
      searchFields.length > 0
        ? searchFields
        : columns.map((col) => col.key).filter((key) => key !== "actions");

    return data.filter((item) =>
      fieldsToSearch.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTermLower);
      })
    );
  }, [data, searchTerm, searchFields, searchable, columns]);

  // Filter functionality
  const filteredData = useMemo(() => {
    let result = searchData;

    // Apply filters
    if (filters.length > 0 && Object.keys(activeFilters).length > 0) {
      result = result.filter((item) => {
        return Object.entries(activeFilters).every(
          ([filterKey, filterValue]) => {
            if (!filterValue || filterValue === "all") return true;
            return item[filterKey] === filterValue;
          }
        );
      });
    }

    return result;
  }, [searchData, filters, activeFilters]);

  // Sort functionality
  const sortedData = useMemo(() => {
    if (!sortable || !sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Fallback to string comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection, sortable]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  // Handlers
  const handleSort = (field) => {
    if (!sortable) return;

    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (!selectable || !onSelectAll) return;

    const isAllSelected = selectedRows.length === paginatedData.length;
    if (isAllSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(paginatedData.map((item) => item[rowKey]));
    }
  };

  const handleRowSelect = (id) => {
    if (!selectable || !onRowSelect) return;
    onRowSelect(id);
    // navigate(`/clients/${id}`);
  };

  const renderCellContent = (column, item) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }

    const value = item[column.key];

    if (value === null || value === undefined) {
      return <span className="text-gray-500">-</span>;
    }

    if (column.type === "badge") {
      const badgeConfig = column.badgeConfig || {};
      const variant = badgeConfig[value] || "default";
      return <Badge variant={variant}>{value}</Badge>;
    }

    if (column.type === "date") {
      return new Date(value).toLocaleDateString();
    }

    if (column.type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    }

    return String(value);
  };

  console.log("Filtered data:", filteredData);
  

  // Render loading state
  if (loading) {
    return (
      <Card theme={theme} className={className}>
        <div className="flex items-center justify-center py-12">
          {customLoadingState || <LoadingSpinner />}
        </div>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card theme={theme} className={className}>
        <div className="p-6">
          {customError || (
            <div className="text-center py-8">
              <div className="text-red-400 mb-2">Error loading data</div>
              <div className="text-gray-500">{error}</div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card theme={theme} className={className}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            )}
            {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
            <p className="text-sm text-gray-500 mt-2">
              {sortedData.length}{" "}
              {sortedData.length === 1 ? "record" : "records"}
              {selectedRows.length > 0 && ` (${selectedRows.length} selected)`}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            )}

            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            )}

            {filters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            )}

            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size="sm"
                onClick={action.onClick}
                className={`flex items-center space-x-1 ${
                  action.className || ""
                }`}
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col space-y-4 mt-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {showFilters && filters.length > 0 && (
            <div className="flex space-x-2">
              {filters.map((filter, index) => (
                <Select
                  key={index}
                  value={activeFilters[filter.key] || "all"}
                  onChange={(value) => onFilterChange?.(filter.key, value)}
                  options={[
                    { value: "all", label: `All ${filter.label}` },
                    ...filter.options,
                  ]}
                  className="min-w-32"
                />
              ))}
            </div>
          )}
        </div>

        {/* Bulk actions */}
        {selectedRows.length > 0 && bulkActions.length > 0 && (
          <div className="flex items-center space-x-2 mt-4 p-3 bg-blue-500/10 rounded-lg">
            <span className="text-sm text-blue-300">
              {selectedRows.length} selected
            </span>
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => action.onClick(selectedRows)}
                className="flex items-center space-x-1"
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={stickyHeader ? "sticky top-0 bg-gray-800" : ""}>
            <tr className="border-b border-gray-700">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-300 ${
                    column.sortable !== false && sortable
                      ? "cursor-pointer hover:text-white"
                      : ""
                  } ${column.className || ""}`}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key)
                  }
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable !== false && sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`w-3 h-3 ${
                            sortField === column.key && sortDirection === "asc"
                              ? "text-blue-400"
                              : "text-gray-500"
                          }`}
                        />
                        <ChevronDown
                          className={`w-3 h-3 -mt-1 ${
                            sortField === column.key && sortDirection === "desc"
                              ? "text-blue-400"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8"
                >
                  {customEmptyState || (
                    <EmptyState
                      icon={AlertCircle}
                      title={emptyStateTitle}
                      description={emptyStateDescription}
                    />
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item[rowKey]}
                  className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item[rowKey])}
                        onChange={() => handleRowSelect(item[rowKey])}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-sm text-gray-300 ${
                        column.cellClassName || ""
                      }`}
                    >
                      {renderCellContent(column, item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Show</span>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              options={itemsPerPageOptions.map((size) => ({
                value: size,
                label: size.toString(),
              }))}
              className="w-20"
            />
            <span className="text-sm text-gray-400">per page</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {(currentPage - 1) * pageSize + 1} -{" "}
              {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
              {sortedData.length}
            </span>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};