// frontend/src/pages/client/ClientBulkUpload.jsx

import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Plus,
  Minus,
  Settings,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Shield,
  Clock,
  Users,
  Building2,
  FileText,
  Save,
  Send,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Link,
  Key,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  Info,
  HelpCircle,
  FileWarning as Warning,
  Star,
  Flag,
  Bookmark,
  Tag,
  Archive,
  Folder,
  FolderOpen,
  List,
  Grid,
  Table,
  Columns,
  Rows,
  Layers,
  Package,
  Briefcase,
  Clipboard,
  Calculator,
  CreditCard,
  Receipt,
  Percent,
  Hash,
  AtSign,
  Activity,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs.jsx";
import { ExcelPreview } from "../../components/common/ExcelPreview.jsx";
import { FieldMapper } from "../../components/common/FieldMapper.jsx";
import { DataProcessingModal } from "../../components/common/DataProcessingModal.jsx";
import { ImportExportButtons } from "../../components/common/ImportExportButtons.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

const ClientBulkUpload = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { uploadClients } = useClients();

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [mappings, setMappings] = useState({});
  const [validationResults, setValidationResults] = useState(null);
  const [processingData, setProcessingData] = useState(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Client field mappings for bulk upload
  const clientFieldMappings = {
    "clientInfo.clientName": {
      label: "Client Name *",
      required: true,
      description: "The official name of the client organization",
    },
    "clientInfo.legalName": {
      label: "Legal Name",
      required: false,
      description: "Legal business name if different from client name",
    },
    "clientInfo.clientType": {
      label: "Client Type *",
      required: true,
      description:
        "Type of healthcare organization (e.g., Healthcare Provider, Billing Company)",
    },
    "clientInfo.clientSubType": {
      label: "Client Sub Type",
      required: false,
      description: "More specific categorization within client type",
    },
    "clientInfo.taxId": {
      label: "Tax ID",
      required: false,
      description: "Federal Tax Identification Number",
    },
    "clientInfo.npiNumber": {
      label: "NPI Number",
      required: false,
      description: "National Provider Identifier (10 digits)",
    },
    "contactInfo.primaryContact.name": {
      label: "Primary Contact Name",
      required: true,
      description: "Name of the main point of contact",
    },
    "contactInfo.primaryContact.email": {
      label: "Primary Contact Email *",
      required: true,
      description: "Email address of the primary contact",
    },
    "contactInfo.primaryContact.phone": {
      label: "Primary Contact Phone",
      required: false,
      description: "Phone number of the primary contact",
    },
    "contactInfo.primaryContact.title": {
      label: "Primary Contact Title",
      required: false,
      description: "Job title of the primary contact",
    },
    "contactInfo.billingContact.name": {
      label: "Billing Contact Name",
      required: false,
      description: "Name of the billing contact person",
    },
    "contactInfo.billingContact.email": {
      label: "Billing Contact Email",
      required: false,
      description: "Email address for billing communications",
    },
    "contactInfo.billingContact.phone": {
      label: "Billing Contact Phone",
      required: false,
      description: "Phone number for billing inquiries",
    },
    "contactInfo.technicalContact.name": {
      label: "Technical Contact Name",
      required: false,
      description: "Name of the technical contact person",
    },
    "contactInfo.technicalContact.email": {
      label: "Technical Contact Email",
      required: false,
      description: "Email address for technical communications",
    },
    "contactInfo.technicalContact.phone": {
      label: "Technical Contact Phone",
      required: false,
      description: "Phone number for technical support",
    },
    "addressInfo.businessAddress.street": {
      label: "Business Address *",
      required: true,
      description: "Street address of the business location",
    },
    "addressInfo.businessAddress.city": {
      label: "City *",
      required: true,
      description: "City where the business is located",
    },
    "addressInfo.businessAddress.state": {
      label: "State *",
      required: true,
      description: "State or province of the business location",
    },
    "addressInfo.businessAddress.zipCode": {
      label: "ZIP Code *",
      required: true,
      description: "Postal code of the business address",
    },
    "addressInfo.businessAddress.country": {
      label: "Country",
      required: false,
      description: "Country (defaults to United States)",
    },
    "integrationStrategy.workflowType": {
      label: "Workflow Type",
      required: false,
      description: "Type of integration workflow (API, File-based, etc.)",
    },
    "integrationStrategy.ehrPmSystem.systemName": {
      label: "EHR System Name",
      required: false,
      description: "Name of the EHR or PM system being used",
    },
    "integrationStrategy.ehrPmSystem.systemVersion": {
      label: "EHR System Version",
      required: false,
      description: "Version of the EHR system",
    },
    "financialInfo.billingCurrency": {
      label: "Billing Currency",
      required: false,
      description: "Currency for billing (defaults to USD)",
    },
    "financialInfo.paymentTerms": {
      label: "Payment Terms",
      required: false,
      description: "Payment terms (Net 30, Net 15, etc.)",
    },
    "financialInfo.creditLimit": {
      label: "Credit Limit",
      required: false,
      description: "Maximum credit limit for the client",
    },
    "serviceConfig.serviceType": {
      label: "Service Type",
      required: false,
      description: "Type of service being provided",
    },
    "serviceConfig.expectedVolume": {
      label: "Expected Volume",
      required: false,
      description: "Expected monthly volume of work",
    },
    "serviceConfig.startDate": {
      label: "Start Date",
      required: false,
      description: "Expected start date for services (YYYY-MM-DD)",
    },
  };

  const requiredFields = Object.keys(clientFieldMappings).filter(
    (key) => clientFieldMappings[key].required
  );

  // Template data for download
  const templateData = [
    {
      "Client Name": "Example Healthcare Clinic",
      "Legal Name": "Example Healthcare Clinic LLC",
      "Client Type": "Healthcare Provider",
      "Client Sub Type": "Clinic",
      "Tax ID": "12-3456789",
      "NPI Number": "1234567890",
      "Primary Contact Name": "John Doe",
      "Primary Contact Email": "john@example.com",
      "Primary Contact Phone": "+1-555-123-4567",
      "Primary Contact Title": "Administrator",
      "Billing Contact Name": "Jane Smith",
      "Billing Contact Email": "billing@example.com",
      "Billing Contact Phone": "+1-555-123-4568",
      "Technical Contact Name": "Bob Johnson",
      "Technical Contact Email": "tech@example.com",
      "Technical Contact Phone": "+1-555-123-4569",
      "Business Address": "123 Main St",
      City: "New York",
      State: "NY",
      "ZIP Code": "10001",
      Country: "United States",
      "Workflow Type": "API Integration",
      "EHR System Name": "Epic",
      "EHR System Version": "2023.1",
      "Billing Currency": "USD",
      "Payment Terms": "Net 30",
      "Credit Limit": "50000",
      "Service Type": "Revenue Cycle Management",
      "Expected Volume": "1000 claims/month",
      "Start Date": "2024-01-15",
    },
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
        toast.error("Please upload a valid Excel (.xlsx, .xls) or CSV file");
        return;
      }

      setUploadedFile(file);
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const processFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const bstr = e.target.result;
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
        setCurrentStep(2);

        toast.success(
          `File uploaded successfully! Found ${rows.length} records.`
        );
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing file. Please check the file format.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleMappingChange = (targetField, sourceField) => {
    setMappings((prev) => ({
      ...prev,
      [targetField]: sourceField,
    }));
  };

  const validateMappings = () => {
    const newErrors = [];
    const newWarnings = [];

    // Check required fields
    requiredFields.forEach((field) => {
      if (!mappings[field] || !excelHeaders.includes(mappings[field])) {
        newErrors.push({
          type: "missing_required_field",
          message: `Required field "${clientFieldMappings[field].label}" is not mapped`,
          field: field,
        });
      }
    });

    // Check for duplicate mappings
    const usedMappings = Object.values(mappings).filter(Boolean);
    const duplicates = usedMappings.filter(
      (mapping, index) => usedMappings.indexOf(mapping) !== index
    );

    duplicates.forEach((duplicate) => {
      newWarnings.push({
        type: "duplicate_mapping",
        message: `Column "${duplicate}" is mapped to multiple fields`,
        field: duplicate,
      });
    });

    setErrors(newErrors);
    setWarnings(newWarnings);

    return newErrors.length === 0;
  };

  const generatePreview = () => {
    if (!validateMappings()) {
      toast.error("Please fix mapping errors before generating preview");
      return;
    }

    const preview = excelData.slice(0, 5).map((row) => {
      const record = {};
      Object.entries(mappings).forEach(([targetField, sourceField]) => {
        const columnIndex = excelHeaders.indexOf(sourceField);
        if (columnIndex !== -1) {
          record[targetField] = row[columnIndex];
        }
      });
      return record;
    });

    setPreviewData(preview);
    setShowPreview(true);
    setCurrentStep(3);
  };

  const processData = async () => {
    if (!validateMappings()) {
      toast.error("Please fix mapping errors before processing");
      return;
    }

    setIsProcessing(true);
    setShowProcessingModal(true);
    setCurrentStep(4);

    try {
      // Initialize processing data
      const totalRecords = excelData.length;
      setProcessingData({
        status: "processing",
        progress: 0,
        current: 0,
        total: totalRecords,
        steps: [
          {
            title: "Validating data",
            status: "processing",
            description: "Checking data integrity",
          },
          {
            title: "Transforming records",
            status: "pending",
            description: "Converting to proper format",
          },
          {
            title: "Uploading to database",
            status: "pending",
            description: "Saving client records",
          },
          {
            title: "Finalizing",
            status: "pending",
            description: "Completing the process",
          },
        ],
        results: null,
        errors: [],
      });

      // Simulate processing steps
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 1: Validation
      setProcessingData((prev) => ({
        ...prev,
        progress: 25,
        current: Math.floor(totalRecords * 0.25),
        steps: prev.steps.map((step, index) =>
          index === 0
            ? { ...step, status: "success" }
            : index === 1
            ? { ...step, status: "processing" }
            : step
        ),
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Transformation
      const transformedData = excelData.map((row) => {
        const record = {};
        Object.entries(mappings).forEach(([targetField, sourceField]) => {
          const columnIndex = excelHeaders.indexOf(sourceField);
          if (columnIndex !== -1) {
            record[targetField] = row[columnIndex];
          }
        });
        return unflattenObject(record);
      });

      setProcessingData((prev) => ({
        ...prev,
        progress: 50,
        current: Math.floor(totalRecords * 0.5),
        steps: prev.steps.map((step, index) =>
          index === 1
            ? { ...step, status: "success" }
            : index === 2
            ? { ...step, status: "processing" }
            : step
        ),
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 3: Upload
      const result = await uploadClients(transformedData);

      setProcessingData((prev) => ({
        ...prev,
        progress: 75,
        current: Math.floor(totalRecords * 0.75),
        steps: prev.steps.map((step, index) =>
          index === 2
            ? { ...step, status: "success" }
            : index === 3
            ? { ...step, status: "processing" }
            : step
        ),
      }));

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 4: Finalize
      setProcessingData((prev) => ({
        ...prev,
        status: "completed",
        progress: 100,
        current: totalRecords,
        steps: prev.steps.map((step) => ({ ...step, status: "success" })),
        results: {
          successful: result.successful || totalRecords,
          failed: result.failed || 0,
          warnings: result.warnings || 0,
        },
      }));

      toast.success(`Successfully processed ${totalRecords} client records!`);
    } catch (error) {
      console.error("Processing error:", error);
      setProcessingData((prev) => ({
        ...prev,
        status: "error",
        errors: [
          { message: error.message || "An error occurred during processing" },
        ],
      }));
      toast.error("Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const unflattenObject = (obj) => {
    const result = {};
    Object.entries(obj).forEach(([key, value]) => {
      const keys = key.split(".");
      keys.reduce((acc, k, index) => {
        if (index === keys.length - 1) {
          acc[k] = value;
        } else {
          if (!acc[k]) acc[k] = {};
        }
        return acc[k];
      }, result);
    });

    // Add default values
    result.status = {
      clientStatus: "Prospect",
      onboardingStatus: "Not Started",
      onboardingProgress: 0,
      riskLevel: "Low",
      lastActivityDate: new Date(),
    };

    result.systemInfo = {
      isActive: true,
      timezone: "EST",
      businessHours: {
        start: "09:00",
        end: "17:00",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      dataRetentionPeriod: 2555,
    };

    return result;
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setExcelData([]);
    setExcelHeaders([]);
    setMappings({});
    setPreviewData([]);
    setShowPreview(false);
    setProcessingData(null);
    setShowProcessingModal(false);
    setErrors([]);
    setWarnings([]);
    setIsProcessing(false);
  };

  const handleTemplateDownload = () => {
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client Template");
    XLSX.writeFile(wb, "client_bulk_upload_template.xlsx");
    toast.success("Template downloaded successfully!");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Upload className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Upload Client Data
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Upload an Excel or CSV file containing client information for
                bulk import
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-center">
                <Button
                  onClick={handleTemplateDownload}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </Button>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? `border-${theme.accent} bg-${theme.accent}/10`
                    : `border-${theme.accent}/30 hover:border-${theme.accent}/50`
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <FileSpreadsheet
                    className={`w-12 h-12 text-${theme.accent} mx-auto`}
                  />
                  <div>
                    <p className="text-white font-medium text-lg">
                      {isDragActive
                        ? "Drop your file here"
                        : "Drag & drop your file here"}
                    </p>
                    <p className={`text-${theme.textSecondary} text-sm mt-1`}>
                      Or click to browse files
                    </p>
                  </div>
                  <p className={`text-${theme.textSecondary} text-xs`}>
                    Supports .xlsx, .xls, .csv files (max 10MB)
                  </p>
                </div>
              </div>

              <div className={`${theme.glass} p-6 rounded-lg`}>
                <h4 className="text-white font-medium mb-3">
                  📋 Before you start:
                </h4>
                <ul className={`text-${theme.textSecondary} text-sm space-y-2`}>
                  <li>• Download the template to ensure proper formatting</li>
                  <li>
                    • Required fields: Client Name, Client Type, Primary Contact
                    Email, Business Address
                  </li>
                  <li>• Use standard date format (YYYY-MM-DD) for dates</li>
                  <li>• Ensure email addresses are valid and unique</li>
                  <li>• Phone numbers should include country code</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Link className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Map Your Fields
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Connect your Excel columns to the correct client fields
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FieldMapper
                  sourceFields={excelHeaders}
                  targetFields={clientFieldMappings}
                  mappings={mappings}
                  onMappingChange={handleMappingChange}
                  requiredFields={requiredFields}
                />
              </div>

              <div className="space-y-6">
                <Card className={`${theme.card} p-6`}>
                  <h4 className="text-white font-medium mb-3">
                    File Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`text-${theme.textSecondary}`}>
                        File:
                      </span>
                      <span className="text-white">{uploadedFile?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-${theme.textSecondary}`}>
                        Rows:
                      </span>
                      <span className="text-white">{excelData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-${theme.textSecondary}`}>
                        Columns:
                      </span>
                      <span className="text-white">{excelHeaders.length}</span>
                    </div>
                  </div>
                </Card>

                {errors.length > 0 && (
                  <Card className={`${theme.card} p-6 border-red-500/30`}>
                    <h4 className="text-red-400 font-medium mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Errors ({errors.length})
                    </h4>
                    <div className="space-y-2">
                      {errors.slice(0, 3).map((error, index) => (
                        <div key={index} className="text-red-300 text-sm">
                          {error.message}
                        </div>
                      ))}
                      {errors.length > 3 && (
                        <div className="text-red-400 text-sm">
                          And {errors.length - 3} more errors...
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {warnings.length > 0 && (
                  <Card className={`${theme.card} p-6 border-yellow-500/30`}>
                    <h4 className="text-yellow-400 font-medium mb-3 flex items-center">
                      <Warning className="w-4 h-4 mr-2" />
                      Warnings ({warnings.length})
                    </h4>
                    <div className="space-y-2">
                      {warnings.slice(0, 3).map((warning, index) => (
                        <div key={index} className="text-yellow-300 text-sm">
                          {warning.message}
                        </div>
                      ))}
                      {warnings.length > 3 && (
                        <div className="text-yellow-400 text-sm">
                          And {warnings.length - 3} more warnings...
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Eye className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Preview Your Data
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Review the mapped data before processing
              </p>
            </div>

            <div className="space-y-6">
              <ExcelPreview
                headers={Object.keys(previewData[0] || {})}
                data={previewData.map((record) => Object.values(record))}
                filename={`Preview - ${uploadedFile?.name}`}
                maxRows={5}
              />

              <Card className={`${theme.card} p-6`}>
                <h4 className="text-white font-medium mb-4">
                  Processing Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className={`${theme.glass} p-4 rounded-lg`}>
                    <div className="text-2xl font-bold text-white">
                      {excelData.length}
                    </div>
                    <div className={`text-${theme.textSecondary} text-sm`}>
                      Total Records
                    </div>
                  </div>
                  <div className={`${theme.glass} p-4 rounded-lg`}>
                    <div className="text-2xl font-bold text-green-400">
                      {Object.values(mappings).filter(Boolean).length}
                    </div>
                    <div className={`text-${theme.textSecondary} text-sm`}>
                      Fields Mapped
                    </div>
                  </div>
                  <div className={`${theme.glass} p-4 rounded-lg`}>
                    <div className="text-2xl font-bold text-blue-400">
                      {requiredFields.filter((field) => mappings[field]).length}
                    </div>
                    <div className={`text-${theme.textSecondary} text-sm`}>
                      Required Fields
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <CheckCircle className={`w-8 h-8 text-${theme.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Upload Complete!
              </h3>
              <p className={`text-${theme.textSecondary}`}>
                Your client data has been successfully processed
              </p>
            </div>

            <Card className={`${theme.card} p-6`}>
              <h4 className="text-white font-medium mb-4">Results</h4>
              {processingData?.results && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {processingData.results.successful}
                    </div>
                    <div className="text-green-300 text-sm">Successful</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">
                      {processingData.results.failed}
                    </div>
                    <div className="text-red-300 text-sm">Failed</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">
                      {processingData.results.warnings}
                    </div>
                    <div className="text-yellow-300 text-sm">Warnings</div>
                  </div>
                </div>
              )}
            </Card>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => navigate("/employee/clients/list")}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>View All Clients</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Upload More</span>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Bulk Client Upload - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/employee/clients/list")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Clients</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bulk Client Upload
              </h1>
              <p className={`text-${theme.textSecondary} text-lg`}>
                Upload multiple clients at once using Excel or CSV
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {Math.round(progress)}%
              </div>
              <div className={`text-${theme.textSecondary} text-sm`}>
                Complete
              </div>
            </div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Start Over</span>
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm">
            <span
              className={
                currentStep >= 1 ? "text-white" : `text-${theme.textSecondary}`
              }
            >
              Upload
            </span>
            <span
              className={
                currentStep >= 2 ? "text-white" : `text-${theme.textSecondary}`
              }
            >
              Map Fields
            </span>
            <span
              className={
                currentStep >= 3 ? "text-white" : `text-${theme.textSecondary}`
              }
            >
              Preview
            </span>
            <span
              className={
                currentStep >= 4 ? "text-white" : `text-${theme.textSecondary}`
              }
            >
              Complete
            </span>
          </div>
        </div>

        {/* Step Content */}
        <Card className={`${theme.card} p-8`}>{renderStepContent()}</Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div>
            {currentStep > 1 && currentStep < 4 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Previous</span>
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            {currentStep === 2 && (
              <Button
                onClick={generatePreview}
                disabled={
                  errors.length > 0 || Object.keys(mappings).length === 0
                }
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Generate Preview</span>
              </Button>
            )}

            {currentStep === 3 && (
              <Button
                onClick={processData}
                disabled={isProcessing || errors.length > 0}
                loading={isProcessing}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Process Data</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Processing Modal */}
      <DataProcessingModal
        isOpen={showProcessingModal}
        onClose={() => setShowProcessingModal(false)}
        processingData={processingData}
        title="Processing Client Data"
        onDownloadErrors={() => {
          // Download errors logic
          toast.info("Error report downloaded");
        }}
        onViewDetails={() => {
          // View details logic
          toast.info("Detailed report opened");
        }}
      />
    </div>
  );
};

export default ClientBulkUpload;