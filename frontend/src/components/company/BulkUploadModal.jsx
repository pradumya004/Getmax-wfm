// frontend/src/components/company/BulkUploadModal.jsx

import React, { useState } from "react";
import { Upload, Download, FileText, AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { FileUpload } from "../forms/FileUpload.jsx";
import { companyAPI } from "./../../api/company.api.js";
import { employeeAPI } from "../../api/employee.api.js";
import { toast } from "react-hot-toast";

export const BulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const handleDownloadTemplate = async () => {
    try {
      const response = await companyAPI.downloadEmployeeTemplate();
      // Handle file download
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "employee_upload_template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download template:", error);
      toast.error("Failed to download template");
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("employeeFile", selectedFile);

      const result = await employeeAPI.bulkUpload(formData);
      setResults(result);

      if (result.success) {
        toast.success(`Successfully uploaded ${result.successCount} employees`);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        toast.warning(`Upload completed with ${result.errorCount} errors`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload employees");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Employee Upload"
      size="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Upload Instructions</h4>
          <ol className="text-blue-200 text-sm space-y-1">
            <li>1. Download the employee template file</li>
            <li>2. Fill in employee information following the format</li>
            <li>3. Save the file and upload it below</li>
            <li>4. Review the upload results</li>
          </ol>
        </div>

        {/* Template Download */}
        <div className="flex justify-between items-center">
          <span className="text-white">Employee Template</span>
          <Button
            variant="outline"
            theme="company"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Template</span>
          </Button>
        </div>

        {/* File Upload */}
        <FileUpload
          accept=".xlsx,.xls,.csv"
          maxSize={10 * 1024 * 1024}
          onFileSelect={handleFileSelect}
          theme="company"
        />

        {/* Upload Results */}
        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Successful</span>
                </div>
                <p className="text-white text-2xl font-bold">
                  {results.successCount || 0}
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">Failed</span>
                </div>
                <p className="text-white text-2xl font-bold">
                  {results.errorCount || 0}
                </p>
              </div>
            </div>

            {results.errors && results.errors.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-2">Errors to Fix:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {results.errors.map((error, index) => (
                    <div
                      key={index}
                      className="p-2 bg-red-500/10 border border-red-500/20 rounded text-sm"
                    >
                      <p className="text-red-400">
                        <span className="font-medium">Row {error.row}:</span>{" "}
                        {error.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          {!results ? (
            <Button
              theme="company"
              onClick={handleUpload}
              loading={uploading}
              disabled={!selectedFile}
              className="flex-1"
            >
              Upload Employees
            </Button>
          ) : (
            <Button
              theme="company"
              onClick={() => {
                onSuccess?.();
                onClose();
              }}
              className="flex-1"
            >
              Done
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
