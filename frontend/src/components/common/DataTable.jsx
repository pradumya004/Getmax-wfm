// frontend/src/components/common/DataTable.jsx

import React from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSearch } from "../../hooks/useSearch.jsx";
import { usePagination } from "../../hooks/usePagination.jsx";
import { Card } from "../ui/Card.jsx";
import { Input } from "../ui/Input.jsx";
import { Badge } from "../ui/Badge.jsx";

export const DataTable = ({
  data = [],
  columns = [],
  searchFields = ["name"],
  theme = "company",
  itemsPerPage = 10,
  title = "",
  actions,
}) => {
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    data,
    searchFields
  );
  const { currentPage, totalPages, paginatedData, goToPage, hasNext, hasPrev } =
    usePagination(filteredData, itemsPerPage);

  return (
    <Card theme={theme} className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && (
            <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          )}
          <p className="text-gray-400">{filteredData.length} total records</p>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
                  className="text-left py-3 px-4 text-gray-300 font-medium"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="text-right py-3 px-4 text-gray-300 font-medium">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4">
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.type === "badge" ? (
                      <Badge status={row[column.key]}>{row[column.key]}</Badge>
                    ) : (
                      <span className="text-gray-300">{row[column.key]}</span>
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="py-3 px-4 text-right">{actions(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!hasPrev}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!hasNext}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};