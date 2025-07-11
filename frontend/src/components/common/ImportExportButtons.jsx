// frontend/src/components/common/ImportExportButtons.jsx

import React, { useState } from "react";
import {
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Select } from "../ui/Select.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const ImportExportButtons = ({
  onImport,
  onExport,
  entityType = "data",
  showTemplateDownload = true,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    dateFormat: "MM/DD/YYYY",
    encoding: "utf-8",
  });

  const exportFormats = [
    { value: "csv", label: "CSV", icon: FileText },
    { value: "xlsx", label: "Excel", icon: FileSpreadsheet },
    { value: "json", label: "JSON", icon: FileText },
    { value: "pdf", label: "PDF", icon: FileImage },
  ];

  const handleExport = () => {
    onExport(exportFormat, exportOptions);
    setShowExportModal(false);
  };

  const handleTemplateDownload = () => {
    // Generate and download template
    const template = generateTemplate(entityType);
    downloadFile(template, `${entityType}_template.${exportFormat}`);
  };

  const generateTemplate = (type) => {
    // This would generate appropriate template based on entity type
    return `${type}_template_data`;
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {showTemplateDownload && (
          <Button
            variant="outline"
            onClick={handleTemplateDownload}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Template</span>
          </Button>
        )}

        <Button
          variant="outline"
          onClick={onImport}
          className="flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowExportModal(true)}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Data"
      >
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Export Format
            </label>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              options={exportFormats}
            />
          </div>

          <div className="space-y-3">
            <label className="text-white text-sm font-medium block">
              Export Options
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includeHeaders}
                onChange={(e) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    includeHeaders: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-white text-sm">Include column headers</span>
            </label>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Date Format
              </label>
              <Select
                value={exportOptions.dateFormat}
                onChange={(e) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    dateFormat: e.target.value,
                  }))
                }
                options={[
                  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};