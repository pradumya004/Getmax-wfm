// frontend/src/components/common/ExportButton.jsx

import React, { useState } from "react";
import { Download, FileText, Database, Table } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export const ExportButton = ({
  data,
  filename = "export",
  theme = "company",
  className = "",
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setShowOptions(false);
  };

  const exportToJSON = () => {
    if (!data || data.length === 0) return;

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setShowOptions(false);
  };

  if (!data || data.length === 0) {
    return (
      <Button
        variant="outline"
        theme={theme}
        disabled
        className={`inline-flex items-center space-x-2 ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        theme={theme}
        onClick={() => setShowOptions(!showOptions)}
        className={`inline-flex items-center space-x-2 ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Export ({data.length})</span>
      </Button>

      {showOptions && (
        <Card
          theme={theme}
          className="absolute top-full right-0 mt-2 p-3 min-w-48 z-50"
        >
          <div className="space-y-2">
            <button
              onClick={exportToCSV}
              className="w-full flex items-center space-x-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
            >
              <Table className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-white text-sm">Export as CSV</p>
                <p className="text-gray-400 text-xs">Spreadsheet format</p>
              </div>
            </button>

            <button
              onClick={exportToJSON}
              className="w-full flex items-center space-x-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
            >
              <Database className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-white text-sm">Export as JSON</p>
                <p className="text-gray-400 text-xs">Data format</p>
              </div>
            </button>
          </div>
        </Card>
      )}

      {/* Click outside to close */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
};