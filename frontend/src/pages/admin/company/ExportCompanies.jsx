import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { Checkbox } from "../../../components/ui/Checkbox.jsx";
import { toast } from "react-hot-toast";
import { Download, FileText, X, Check } from "lucide-react";

const ExportCompanies = ({ companies = [], isOpen, onClose, theme }) => {
  const [exportFormat, setExportFormat] = useState("csv");
  const [selectedFields, setSelectedFields] = useState([]);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [availableFields, setAvailableFields] = useState([]);

  // Extract all possible fields from the first company object
  useEffect(() => {
    if (companies.length > 0) {
      const fields = extractAllFields(companies[0]);
      setAvailableFields(fields);
      setSelectedFields(fields.map((field) => field.id));
    }
  }, [companies]);

  // Recursive function to extract all fields from an object, including nested ones
  const extractAllFields = (obj, prefix = "") => {
    let fields = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;

        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          // Recursively extract fields from nested objects
          fields = [...fields, ...extractAllFields(obj[key], fullPath)];
        } else {
          // Format the key for display (remove dots, capitalize, etc.)
          const displayName = fullPath
            .split(".")
            .map((part) => part.replace(/([A-Z])/g, " $1"))
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" > ");

          fields.push({
            id: fullPath,
            label: displayName,
            type: typeof obj[key],
          });
        }
      }
    }

    return fields;
  };

  const toggleField = (fieldId) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSelectAllFields = (selectAll) => {
    if (selectAll) {
      setSelectedFields(availableFields.map((field) => field.id));
    } else {
      setSelectedFields([]);
    }
  };

  // Get nested value from object using dot notation path
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return undefined;
    }, obj);
  };

  const generateExportData = () => {
    return companies.map((company) => {
      const row = {};

      selectedFields.forEach((fieldPath) => {
        const value = getNestedValue(company, fieldPath);

        // Format the value appropriately
        if (value === undefined || value === null) {
          row[fieldPath] = "";
        } else if (typeof value === "object" && !Array.isArray(value)) {
          // Stringify nested objects
          row[fieldPath] = JSON.stringify(value);
        } else if (
          fieldPath.includes("date") ||
          fieldPath.includes("Date") ||
          fieldPath.includes("createdAt") ||
          fieldPath.includes("updatedAt")
        ) {
          // Format dates
          row[fieldPath] = new Date(value).toLocaleString();
        } else {
          // Convert other values to string
          row[fieldPath] = String(value);
        }
      });

      return row;
    });
  };

  const exportToCSV = () => {
    const exportData = generateExportData();

    // Create headers using the display names
    const headers = selectedFields.map((fieldPath) => {
      const field = availableFields.find((f) => f.id === fieldPath);
      return field ? field.label : fieldPath.split(".").pop();
    });

    // Create rows
    const rows = exportData.map((row) =>
      selectedFields.map((fieldPath) => {
        const value = row[fieldPath];
        // Escape quotes in CSV
        return `"${value.replace(/"/g, '""')}"`;
      })
    );

    // Combine headers and rows
    const csvContent = [
      includeHeaders ? headers.join(",") : null,
      ...rows.map((row) => row.join(",")),
    ]
      .filter(Boolean)
      .join("\n");

    return csvContent;
  };

  const exportToJSON = () => {
    const exportData = generateExportData();

    // If only one field is selected, simplify the structure
    if (selectedFields.length === 1) {
      const field = selectedFields[0];
      return JSON.stringify(
        exportData.map((item) => item[field]),
        null,
        2
      );
    }

    return JSON.stringify(exportData, null, 2);
  };

  const downloadFile = (content, extension) => {
    const blob = new Blob([content], {
      type:
        extension === "csv"
          ? "text/csv;charset=utf-8;"
          : "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `companies-export-${
      new Date().toISOString().split("T")[0]
    }.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast.error("Please select at least one field to export");
      return;
    }

    setIsExporting(true);

    try {
      let content;
      if (exportFormat === "csv") {
        content = exportToCSV();
      } else {
        content = exportToJSON();
      }

      downloadFile(content, exportFormat);
      toast.success(
        `Companies exported successfully as ${exportFormat.toUpperCase()}`
      );
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export companies");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Companies">
      <div className={`space-y-6 text-${theme.text}`}>
        {/* Export Format Selection */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium text-${theme.text}`}
          >
            Export Format
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setExportFormat("csv")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                exportFormat === "csv"
                  ? `${theme.button} border-transparent`
                  : `border-${theme.border} hover:bg-${theme.glass}`
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>CSV</span>
              {exportFormat === "csv" && <Check className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setExportFormat("json")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                exportFormat === "json"
                  ? `${theme.button} border-transparent`
                  : `border-${theme.border} hover:bg-${theme.glass}`
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>JSON</span>
              {exportFormat === "json" && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Fields Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium text-${theme.text}`}>
              Select Fields to Export ({selectedFields.length}/
              {availableFields.length})
            </label>
            <button
              type="button"
              onClick={() =>
                handleSelectAllFields(
                  selectedFields.length !== availableFields.length
                )
              }
              className={`text-xs ${
                selectedFields.length === availableFields.length
                  ? `text-${theme.textSecondary}`
                  : `text-${theme.primary} hover:underline`
              }`}
            >
              {selectedFields.length === availableFields.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2">
            {availableFields.map((field) => (
              <div
                key={field.id}
                className="flex items-center space-x-2"
                onClick={() => toggleField(field.id)}
              >
                <Checkbox
                  checked={selectedFields.includes(field.id)}
                  onChange={() => toggleField(field.id)}
                  theme={theme}
                />
                <span className={`text-sm text-${theme.text}`}>
                  {field.label}
                </span>
                {field.type && (
                  <span className={`text-xs text-${theme.textSecondary}`}>
                    ({field.type})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        {exportFormat === "csv" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-headers"
              checked={includeHeaders}
              onChange={() => setIncludeHeaders(!includeHeaders)}
              theme={theme}
            />
            <label
              htmlFor="include-headers"
              className={`text-sm text-${theme.text}`}
            >
              Include headers in CSV
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            theme={theme}
            disabled={isExporting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            theme={theme}
            loading={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportCompanies;
