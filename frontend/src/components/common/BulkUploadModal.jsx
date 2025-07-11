// frontend/src/components/common/BulkUploadModal.jsx

import React, { useState } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Progress } from "../ui/Progress.jsx";
import { Badge } from "../ui/Badge.jsx";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

export const BulkUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  entityType = "clients",
  fieldMappings = {},
  templateData = [],
  title,
  description,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Preview, 4: Process
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [mappings, setMappings] = useState({});
  const [previewData, setPreviewData] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processedResults, setProcessedResults] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Please upload a valid Excel or CSV file");
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (jsonData.length < 2) {
          toast.error("File must contain at least headers and one data row");
          return;
        }

        const headers = jsonData[0];
        const rows = jsonData.slice(1).filter((row) => row.length > 0);

        setExcelHeaders(headers);
        setExcelData(rows);
        setStep(2);

        toast.success(
          `File uploaded successfully! Found ${rows.length} records.`
        );
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Error reading file. Please check the file format.");
      }
    };

    reader.readAsBinaryString(uploadedFile);
  };

  const handleMappingChange = (modelField, excelColumn) => {
    setMappings((prev) => ({
      ...prev,
      [modelField]: excelColumn,
    }));
  };

  const generatePreview = () => {
    const mapped = excelData.slice(0, 10).map((row) => {
      const record = {};
      Object.entries(mappings).forEach(([modelField, excelColumn]) => {
        const columnIndex = excelHeaders.indexOf(excelColumn);
        if (columnIndex !== -1) {
          record[modelField] = row[columnIndex];
        }
      });
      return record;
    });

    setPreviewData(mapped);
    setStep(3);
  };

  const handleUpload = async () => {
    if (!onUpload) return;

    setProcessing(true);
    setUploadProgress(0);

    try {
      // Transform all data
      const transformedData = excelData.map((row) => {
        const record = {};
        Object.entries(mappings).forEach(([modelField, excelColumn]) => {
          const columnIndex = excelHeaders.indexOf(excelColumn);
          if (columnIndex !== -1) {
            record[modelField] = row[columnIndex];
          }
        });
        return record;
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await onUpload(transformedData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setProcessedResults(result);
      setStep(4);

      toast.success(`Successfully processed ${excelData.length} records!`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
      setProcessing(false);
    }
  };

  const downloadTemplate = () => {
    if (!templateData || templateData.length === 0) {
      toast.error("No template data available");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${entityType}_template.xlsx`);

    toast.success("Template downloaded successfully!");
  };

  const resetModal = () => {
    setStep(1);
    setFile(null);
    setExcelData([]);
    setExcelHeaders([]);
    setMappings({});
    setPreviewData([]);
    setProcessing(false);
    setProcessedResults(null);
    setShowFullPreview(false);
    setUploadProgress(0);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Upload className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Upload Your File
              </h3>
              <p className={`text-${theme.textSecondary} text-sm mb-6`}>
                {description ||
                  `Upload an Excel or CSV file to import ${entityType} in bulk.`}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <Button
                  onClick={downloadTemplate}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </Button>
              </div>

              <div
                className={`border-2 border-dashed border-${theme.accent}/30 rounded-lg p-8 text-center hover:border-${theme.accent}/50 transition-colors`}
              >
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <FileSpreadsheet
                    className={`w-12 h-12 text-${theme.accent}`}
                  />
                  <span className="text-white font-medium">
                    Click to upload file
                  </span>
                  <span className={`text-${theme.textSecondary} text-sm`}>
                    Supports .xlsx, .xls, .csv files
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white text-lg font-semibold mb-2">
                Map Your Fields
              </h3>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Map your Excel columns to the required fields.
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(fieldMappings).map(([modelField, fieldInfo]) => (
                <div
                  key={modelField}
                  className={`${theme.glass} p-4 rounded-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white font-medium">
                      {fieldInfo.label || modelField}
                      {fieldInfo.required && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </label>
                  </div>
                  <select
                    value={mappings[modelField] || ""}
                    onChange={(e) =>
                      handleMappingChange(modelField, e.target.value)
                    }
                    className={`w-full px-3 py-2 bg-${theme.input} border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${theme.accent} focus:border-transparent`}
                  >
                    <option value="">Select Excel Column</option>
                    {excelHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                  {fieldInfo.description && (
                    <p className={`text-${theme.textSecondary} text-xs mt-1`}>
                      {fieldInfo.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={generatePreview}
                disabled={Object.keys(mappings).length === 0}
              >
                Preview Data
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Data Preview
                </h3>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Showing{" "}
                  {showFullPreview
                    ? previewData.length
                    : Math.min(previewData.length, 5)}{" "}
                  of {excelData.length} records
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowFullPreview(!showFullPreview)}
                className="flex items-center space-x-2"
              >
                {showFullPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{showFullPreview ? "Show Less" : "Show More"}</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b border-${theme.accent}/20`}>
                    {Object.keys(previewData[0] || {}).map((field) => (
                      <th
                        key={field}
                        className="text-left p-3 text-white font-medium"
                      >
                        {fieldMappings[field]?.label || field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(showFullPreview
                    ? previewData
                    : previewData.slice(0, 5)
                  ).map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b border-white/10 hover:bg-${theme.accent}/5`}
                    >
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="p-3 text-white text-sm">
                          {value || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Mapping
              </Button>
              <Button onClick={handleUpload} disabled={processing}>
                {processing
                  ? "Processing..."
                  : `Upload ${excelData.length} Records`}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div
                className={`w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Upload Complete!
              </h3>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Your {entityType} have been successfully uploaded and processed.
              </p>
            </div>

            {processedResults && (
              <div className={`${theme.glass} p-4 rounded-lg`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {processedResults.successful || 0}
                    </div>
                    <div className={`text-${theme.textSecondary} text-sm`}>
                      Successful
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {processedResults.failed || 0}
                    </div>
                    <div className={`text-${theme.textSecondary} text-sm`}>
                      Failed
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {processedResults.total || excelData.length}
                    </div>
                    <div className={`text-${theme.textSecondary} text-sm`}>
                      Total
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className={`${theme.card} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">
            {title || `Bulk Upload ${entityType}`}
          </h2>
          <Button variant="ghost" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center ${stepNum < 4 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stepNum <= step
                      ? `bg-${theme.accent} text-white`
                      : `bg-${theme.accent}/20 text-${theme.textSecondary}`
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`flex-1 h-px mx-2 ${
                      stepNum < step
                        ? `bg-${theme.accent}`
                        : `bg-${theme.accent}/20`
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span
              className={
                step >= 1 ? "text-white" : `text-${theme.textSecondary}`
              }
            >
              Upload
            </span>
            <span
              className={
                step >= 2 ? "text-white" : `text-${theme.textSecondary}`
              }
            >
              Map
            </span>
            <span
              className={
                step >= 3 ? "text-white" : `text-${theme.textSecondary}`
              }
            >
              Preview
            </span>
            <span
              className={
                step >= 4 ? "text-white" : `text-${theme.textSecondary}`
              }
            >
              Complete
            </span>
          </div>
        </div>

        {/* Processing Progress */}
        {processing && (
          <div className="mb-6">
            <Progress value={uploadProgress} className="mb-2" />
            <div className="text-center">
              <span className={`text-${theme.textSecondary} text-sm`}>
                Processing... {uploadProgress}%
              </span>
            </div>
          </div>
        )}

        {/* Step Content */}
        {renderStepContent()}
      </div>
    </Modal>
  );
};
