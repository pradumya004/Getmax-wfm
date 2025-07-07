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
// import { employeeAPI } from "../../../api/employee.api.js";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import axios from "axios";

const systemFields = [
  { label: "First Name *", key: "personalInfo.firstName" },
  { label: "Middle Name", key: "personalInfo.middleName" },
  { label: "Last Name *", key: "personalInfo.lastName" },
  { label: "Display Name", key: "personalInfo.displayName" },
  { label: "Date of Birth (YYYY-MM-DD)", key: "personalInfo.dateOfBirth" },
  { label: "Gender", key: "personalInfo.gender" },
  { label: "Blood Group", key: "personalInfo.bloodGroup" },
  { label: "* Primary Email *", key: "contactInfo.primaryEmail" },
  { label: "Personal Email", key: "contactInfo.personalEmail" },
  { label: "Primary Phone Number *", key: "contactInfo.primaryPhone" },
  { label: "Alternate Phone Number", key: "contactInfo.alternatePhone" },
  { label: "Emergency Contact Name", key: "contactInfo.emergencyContact.name" },
  {
    label: "Emergency Contact Relationship",
    key: "contactInfo.emergencyContact.relationship",
  },
  {
    label: "Emergency Contact Phone",
    key: "contactInfo.emergencyContact.phone",
  },
  { label: "Employee Code", key: "employmentInfo.employeeCode" },
  { label: "Date of Joining *", key: "employmentInfo.dateOfJoining" },
  { label: "Employment Type *", key: "employmentInfo.employmentType" },
  { label: "Work Location", key: "employmentInfo.workLocation" },
  { label: "Shift Type", key: "employmentInfo.shiftType" },
  { label: "Role ID *", key: "roleRef" },
  { label: "Department ID *", key: "departmentRef" },
  { label: "Sub-Department ID", key: "subdepartmentRef" },
  { label: "Designation ID *", key: "designationRef" },
  {
    label: "Direct Manager (Employee ID)",
    key: "reportingStructure.directManager",
  },
  { label: "Team Lead (Employee ID)", key: "reportingStructure.teamLead" },
  { label: "Base Salary", key: "compensation.baseSalary" },
  { label: "Hourly Rate", key: "compensation.hourlyRate" },
  { label: "Salary Currency", key: "compensation.currency" },
  { label: "Pay Frequency", key: "compensation.payFrequency" },
  { label: "Work Start Time", key: "workSchedule.standardHours.startTime" },
  { label: "Work End Time", key: "workSchedule.standardHours.endTime" },
  { label: "Working Days", key: "workSchedule.standardHours.workingDays" },
  { label: "Work Time Zone", key: "workSchedule.timeZone" },
  { label: "Flexible Hours", key: "workSchedule.flexibleHours" },
  { label: "Daily Claim Target", key: "performanceTargets.dailyClaimTarget" },
  { label: "Quality Target (%)", key: "performanceTargets.qualityTarget" },
  { label: "SLA Target (%)", key: "performanceTargets.slaTarget" },
  { label: "Ramp Percentage (%)", key: "rampPercentage" },
];

const BulkEmployeeUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const handleDownloadTemplate = async () => {
    try {
      const response = await companyAPI.downloadEmployeeTemplate();
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

  const handleFileUpload = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setUploadedFile(file);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
    setExcelHeaders(headers);
  };

  const handleMappingChange = (sysKey, excelHeader) => {
    setFieldMap((prev) => ({ ...prev, [sysKey]: excelHeader }));
  };

  const handleUpload = async () => {
    if (!uploadedFile) return toast.error("Upload an Excel file first.");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("bulkFile", uploadedFile);
      formData.append("mapping", JSON.stringify(fieldMap));
      console.log("🧩 Mapping:", fieldMap);

      const token = localStorage.getItem("token");
      console.log(token);

      const response = await axios.post(
        "http://localhost:8000/api/employees/bulk",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(response.data.details);
      toast.success("Upload completed.");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed.");
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
                accept=".xlsx,.xls"
                maxSize={10 * 1024 * 1024}
                onFileSelect={handleFileUpload}
                onChange={(e) => handleFileUpload(e.target.files[0])}
                theme="company"
              />

              {excelHeaders.length > 0 && (
                <Card className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xl">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      🧩 Map Your Excel Columns
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {systemFields.map((field) => (
                        <div key={field.key} className="flex flex-col">
                          <label className="mb-1 font-medium text-white">
                            {field.label}
                          </label>
                          <select
                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-2 rounded-lg focus:outline-none"
                            value={fieldMap[field.key] || ""}
                            onChange={(e) =>
                              handleMappingChange(field.key, e.target.value)
                            }
                          >
                            <option
                              className="bg-slate-800 text-white hover:bg-slate-700 rounded-md"
                              value=""
                            >
                              -- Select Excel Column --
                            </option>
                            {excelHeaders.map((header, idx) => (
                              <option
                                key={idx}
                                className="bg-slate-800 text-white hover:bg-slate-700 rounded-md"
                                value={header}
                              >
                                {header}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 text-right">
                      <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        {uploading ? "Uploading..." : "Upload Employees"}
                      </Button>
                    </div>
                  </div>
                </Card>
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
