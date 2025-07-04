// frontend/src/pages/company/employees/BulkEmployeeUpload.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Upload,
  Download,
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { FileUpload } from "../../../components/forms/FileUpload.jsx";
import { companyAPI } from "../../../api/company.api.js";
import { employeeAPI } from "../../../api/employee.api.js";
import { toast } from "react-hot-toast";

const BulkEmployeeUpload = () => {
  const navigate = useNavigate();
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
      console.error("Download error:", error);
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
      } else {
        toast.warning(`Upload completed with ${result.errorCount} errors`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload employees");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <Helmet>
        <title>Bulk Employee Upload - GetMax</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/company/employees")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bulk Employee Upload
              </h1>
              <p className="text-blue-200">
                Upload multiple employees using Excel/CSV file
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <Card theme="company" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Upload Instructions
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>1. Download the employee template file</p>
                <p>2. Fill in employee information following the format</p>
                <p>3. Save the file and upload it below</p>
                <p>4. Review the upload results and fix any errors</p>
              </div>

              <Button
                variant="outline"
                theme="company"
                onClick={handleDownloadTemplate}
                className="mt-4 inline-flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Template</span>
              </Button>
            </Card>

            {/* File Upload */}
            <Card theme="company" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Upload Employee File
              </h3>

              <FileUpload
                accept=".xlsx,.xls,.csv"
                maxSize={10 * 1024 * 1024}
                onFileSelect={handleFileSelect}
                theme="company"
              />

              {selectedFile && (
                <div className="mt-6">
                  <Button
                    theme="company"
                    onClick={handleUpload}
                    loading={uploading}
                    className="inline-flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Employees</span>
                  </Button>
                </div>
              )}
            </Card>

            {/* Results */}
            {results && (
              <Card theme="company" className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Upload Results
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-green-400 font-medium">Successful</p>
                      <p className="text-white text-2xl font-bold">
                        {results.successCount || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="text-red-400 font-medium">Failed</p>
                      <p className="text-white text-2xl font-bold">
                        {results.errorCount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {results.errors && results.errors.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">
                      Errors to Fix:
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {results.errors.map((error, index) => (
                        <div
                          key={index}
                          className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                        >
                          <p className="text-red-400 text-sm">
                            <span className="font-medium">
                              Row {error.row}:
                            </span>{" "}
                            {error.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <Button
                    theme="company"
                    onClick={() => navigate("/company/employees")}
                  >
                    View Employees
                  </Button>
                  <Button
                    variant="outline"
                    theme="company"
                    onClick={() => {
                      setSelectedFile(null);
                      setResults(null);
                    }}
                  >
                    Upload More
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card theme="company" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Required Fields
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• First Name</li>
                <li>• Last Name</li>
                <li>• Email Address</li>
                <li>• Role</li>
                <li>• Department</li>
                <li>• Designation</li>
                <li>• Date of Joining</li>
                <li>• Work Location</li>
              </ul>
            </Card>

            <Card theme="company" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Use the exact role and department names</li>
                <li>• Email addresses must be unique</li>
                <li>• Date format: YYYY-MM-DD</li>
                <li>• Phone numbers are optional</li>
                <li>• Maximum 500 employees per upload</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEmployeeUpload;
