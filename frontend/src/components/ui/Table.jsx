// frontend/src/components/ui/table.jsx

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export const Table = ({ children, className = "" }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full">{children}</table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead>
    <tr className="border-b border-slate-700">{children}</tr>
  </thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children, className = "", onClick, ...props }) => (
  <tr
    className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${
      onClick ? "cursor-pointer" : ""
    } ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead = ({
  children,
  sortable = false,
  onSort,
  sortDirection,
  className = "",
}) => (
  <th
    className={`text-left py-3 px-4 text-gray-300 font-medium ${
      sortable ? "cursor-pointer hover:text-white select-none" : ""
    } ${className}`}
    onClick={sortable ? onSort : undefined}
  >
    <div className="flex items-center space-x-1">
      <span>{children}</span>
      {sortable && (
        <div className="flex flex-col">
          <ChevronUp
            className={`w-3 h-3 ${
              sortDirection === "asc" ? "text-blue-400" : "text-gray-500"
            }`}
          />
          <ChevronDown
            className={`w-3 h-3 -mt-1 ${
              sortDirection === "desc" ? "text-blue-400" : "text-gray-500"
            }`}
          />
        </div>
      )}
    </div>
  </th>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={`py-3 px-4 ${className}`}>{children}</td>
);