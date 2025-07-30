// frontend/src/pages/claims/ClaimBulkUpload.jsx

import React, { useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
    ArrowLeft, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Eye,
    RefreshCw, Link, Users, FileWarning as Warning
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { ExcelPreview } from "../../components/common/ExcelPreview.jsx";
import { FieldMapper } from "../../components/common/FieldMapper.jsx";
import { DataProcessingModal } from "../../components/common/DataProcessingModal.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { toast } from "react-hot-toast";
import { Select } from "../../components/ui/Select.jsx";
import * as XLSX from "xlsx";
import { useClients } from "../../hooks/useClient.jsx";
import { useSOWs } from "../../hooks/useSows.jsx";
import { useClaims } from "../../hooks/useClaims.jsx";

const ClaimBulkUpload = () => {
    const navigate = useNavigate();
    const { userType } = useAuth();
    const theme = getTheme(userType);

    const [currentStep, setCurrentStep] = useState(1);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [excelHeaders, setExcelHeaders] = useState([]);
    const [mappings, setMappings] = useState({});
    const [processingData, setProcessingData] = useState(null);
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState([]);
    const [warnings, setWarnings] = useState([]);
    
    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    const { uploadBulkClaims } = useClaims();
    const { clients, loadClients } = useClients();
    const { getClientSOWs } = useSOWs();

    const [selectedClient, setSelectedClient] = useState("");
    const [selectedSow, setSelectedSow] = useState("");
    const [availableSows, setAvailableSows] = useState([]);

    useEffect(() => {
        loadClients();
    }, []);

    useEffect(() => {
        const fetchSowsForClient = async () => {
            if (selectedClient) {
                const clientSows = await getClientSOWs(selectedClient);
                setAvailableSows(clientSows || []);
            } else {
                setAvailableSows([]);
            }
        };
        fetchSowsForClient();
        setSelectedSow("");
    }, [selectedClient]);

    // Expanded field mappings for a more comprehensive upload
    const claimFieldMappings = {
        "patientRef": {
            label: "Patient ID/MRN *",
            required: true,
            description: "The unique identifier for the patient (Medical Record Number).",
        },
        "claimInfo.externalClaimId": {
            label: "External Claim ID",
            required: false,
            description: "The claim ID from the client's or payer's system.",
        },
        "claimInfo.claimType": {
            label: "Claim Type *",
            required: true,
            description: "E.g., Professional, Institutional, Dental.",
        },
        "claimInfo.dateOfService": {
            label: "Date of Service *",
            required: true,
            description: "The start date of the service (YYYY-MM-DD).",
        },
        "claimInfo.dateOfServiceEnd": {
            label: "Date of Service End",
            required: false,
            description: "The end date for multi-day services (YYYY-MM-DD).",
        },
        "claimInfo.placeOfService": {
            label: "Place of Service",
            required: false,
            description: "2-digit code for the service location (e.g., 11 for Office).",
        },
        "claimInfo.procedureCodes.cptCode": {
            label: "Procedure Codes (CPT)",
            required: false,
            description: "Comma-separated list of CPT codes (e.g., 99213,99214).",
        },
        "claimInfo.diagnosisCodes.icdCode": {
            label: "Diagnosis Codes (ICD-10)",
            required: false,
            description: "Comma-separated list of primary ICD-10 codes.",
        },
        "financialInfo.grossCharges": {
            label: "Gross Charges *",
            required: true,
            description: "The total charge amount for the claim before any adjustments.",
        },
        "financialInfo.totalPaymentsPosted": {
            label: "Payments Posted",
            required: false,
            description: "Total amount of payments already posted to this claim."
        },
        "financialInfo.totalAdjustments": {
            label: "Adjustments",
            required: false,
            description: "Total amount of adjustments applied to this claim."
        },
        "priorityInfo.isDenied": { label: "Is Denied?", required: false, description: "Set to TRUE or 1 if the claim has been denied." },
    "denialInfo.denialCode": { label: "Denial Code", required: false, description: "The reason code for the denial (e.g., CO-16)." }, // CORRECT PATH
    "denialInfo.denialReason": { label: "Denial Reason", required: false, description: "A short description of the denial reason." }
    };

    const requiredFields = Object.keys(claimFieldMappings).filter(key => claimFieldMappings[key].required);

    // Expanded template data to match the new mappings
    const templateData = [
        {
            "Patient ID/MRN": "PAT-98765",
            "External Claim ID": "Ext-Claim-ABC",
            "Claim Type": "Professional",
            "Date of Service": "2024-05-20",
            "Date of Service End": "2024-05-20",
            "Place of Service": "11",
            "Procedure Codes (CPT)": "99213,99214",
            "Diagnosis Codes (ICD-10)": "J45.909,I10",
            "Gross Charges": 250.00,
            "Payments Posted": 50.00,
            "Adjustments": 10.00,
            "Is Denied?": "TRUE",
            "Denial Code": "CO-16",
            "Denial Reason": "Claim lacks information.",
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

    const handleMappingChange = (targetField, sourceField) => {
        setMappings((prev) => ({
            ...prev,
            [targetField]: sourceField,
        }));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, maxSize: 10 * 1024 * 1024 });

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
                const wsName = wb.SheetNames[0];
                const ws = wb.Sheets[wsName];
                const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

                if (jsonData.length < 2) {
                    toast.error("File must contain headers and at least one data row.");
                    return;
                }

                const headers = jsonData[0];
                const rows = jsonData.slice(1).filter(row => row.some(cell => cell != null && cell !== ''));
                
                setExcelHeaders(headers);
                setExcelData(rows);

                const autoMappings = {};
                headers.forEach(header => {
                    const matchKey = Object.entries(claimFieldMappings).find(
                        ([_, info]) => info.label.replace(/\*/g, "").trim().toLowerCase() === (header || "").trim().toLowerCase()
                    );
                    if (matchKey) autoMappings[matchKey[0]] = header;
                });
                setMappings(autoMappings);
                setCurrentStep(2);
                toast.success(`File processed! Found ${rows.length} claim records.`);
            } catch (error) {
                toast.error("Error processing file. Please check the format.");
                console.error("File processing error:", error);
            }
        };
        reader.readAsBinaryString(file);
    };
    
    const validateMappings = () => {
        const newErrors = [];
        requiredFields.forEach((field) => {
            if (!mappings[field] || !excelHeaders.includes(mappings[field])) {
                newErrors.push({ message: `Required field "${claimFieldMappings[field].label}" is not mapped.` });
            }
        });
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const generatePreview = () => {
        if (!validateMappings()) {
            toast.error("Please fix mapping errors before generating a preview.");
            return;
        }
        const preview = excelData.slice(0, 5).map(row => {
            const record = {};
            Object.entries(mappings).forEach(([targetField, sourceField]) => {
                const colIndex = excelHeaders.indexOf(sourceField);
                if (colIndex !== -1) {
                    let value = row[colIndex];
                    if (value instanceof Date) value = value.toISOString().split('T')[0];
                    record[targetField] = value;
                }
            });
            return record;
        });
        setPreviewData(preview);
        setCurrentStep(3);
    };

    const processData = async () => {
        if (!validateMappings() || !selectedClient || !selectedSow) {
            toast.error("Please select a Client, SOW, and fix mapping errors.");
            return;
        }

        setIsProcessing(true);
        setShowProcessingModal(true);
        setCurrentStep(4);
        setProcessingData({ status: "processing", progress: 0, current: 0, total: excelData.length });

        try {
            const payload = {
                file: uploadedFile,
                mapping: mappings,
                clientRef: selectedClient,
                sowRef: selectedSow
            };
            
            const result = await uploadBulkClaims(payload); 

            if (result?.success) {
                setProcessingData(prev => ({ ...prev, status: 'completed', progress: 100, results: result.data }));
                toast.success(result.message || "Processing complete!");
            } else {
                throw new Error(result?.error || "Processing failed on the server.");
            }
        } catch (error) {
            setProcessingData(prev => ({...prev, status: 'error', errors: [{ message: error.message }]}));
            toast.error(error.message);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleReset = () => {
        setCurrentStep(1);
        setUploadedFile(null);
        setExcelData([]);
        setExcelHeaders([]);
        setMappings({});
        setPreviewData([]);
        setProcessingData(null);
        setShowProcessingModal(false);
        setErrors([]);
        setWarnings([]);
        setIsProcessing(false);
        setSelectedClient("");
        setSelectedSow("");
    };

    const handleTemplateDownload = () => {
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Claim Template");
        XLSX.writeFile(wb, "claim_bulk_upload_template.xlsx");
        toast.success("Template downloaded successfully!");
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                     <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className={`w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Upload className={`w-8 h-8 text-emerald-500`} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Upload Claim Data</h3>
                            <p className="text-gray-400">Step 1: Select the context and upload your file.</p>
                        </div>
                        <div className="max-w-3xl mx-auto space-y-6">
                            <Card className="p-6">
                                <h3 className="text-white text-lg font-semibold mb-4">Select Context</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Select
                                        label="Client *"
                                        value={selectedClient}
                                        onChange={(e) => setSelectedClient(e.target.value)}
                                        options={clients.map(c => ({ value: c._id, label: c.clientInfo?.clientName || "Unnamed Client" }))}
                                        placeholder="Select a Client"
                                    />
                                    <Select
                                        label="SOW *"
                                        value={selectedSow}
                                        onChange={(e) => setSelectedSow(e.target.value)}
                                        options={availableSows.map(s => ({ value: s._id, label: s.sowName }))}
                                        placeholder="Select a SOW"
                                        disabled={!selectedClient}
                                    />
                                </div>
                            </Card>
                            <div className="flex justify-center">
                                <Button onClick={handleTemplateDownload} variant="outline" className="flex items-center space-x-2">
                                    <Download className="w-4 h-4" />
                                    <span>Download Template</span>
                                </Button>
                            </div>
                            <div {...getRootProps()} className={`border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? `border-emerald-500 bg-emerald-500/10` : `hover:border-gray-500`}`}>
                                <input {...getInputProps()} />
                                <FileSpreadsheet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                <p className="text-white font-medium text-lg">
                                    {isDragActive ? "Drop your file here" : "Drag & drop file or click to browse"}
                                </p>
                                <p className="text-gray-500 text-xs mt-2">Supports .xlsx, .xls, .csv files (max 10MB)</p>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                           <div className={`w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Link className={`w-8 h-8 text-emerald-500`} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Map Your Fields</h3>
                            <p className="text-gray-400">Step 2: Match your file's columns to the system's fields.</p>
                        </div>
                         {errors.length > 0 && (
                            <Card className="p-4 border-l-4 border-red-500 bg-red-500/10">
                                <h4 className="text-red-400 font-semibold mb-2 flex items-center"><AlertCircle className="w-5 h-5 mr-2" /> Mapping Errors</h4>
                                <ul className="list-disc list-inside text-red-300 text-sm">
                                    {errors.map((err, i) => <li key={i}>{err.message}</li>)}
                                </ul>
                            </Card>
                         )}
                        <FieldMapper
                            sourceFields={excelHeaders}
                            targetFields={claimFieldMappings}
                            mappings={mappings}
                            onMappingChange={handleMappingChange}
                            requiredFields={requiredFields}
                        />
                    </div>
                );
            case 3:
                return (
                     <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className={`w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Eye className={`w-8 h-8 text-emerald-500`} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Preview & Confirm</h3>
                            <p className="text-gray-400">Step 3: Review a sample of your data before final import.</p>
                        </div>
                        <ExcelPreview
                            headers={Object.keys(previewData[0] || {}).map(key => claimFieldMappings[key]?.label.replace(" *", "") || key)}
                            data={previewData.map((record) => Object.values(record))}
                            filename={`Preview - ${uploadedFile?.name}`}
                            maxRows={5}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className={`w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <CheckCircle className={`w-8 h-8 text-emerald-500`} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Upload Complete</h3>
                            <p className="text-gray-400">The claim import process has finished.</p>
                        </div>
                        <Card className="p-6">
                            <h4 className="text-white font-medium mb-4">Results Summary</h4>
                            {processingData?.results && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="bg-green-500/10 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-400">{processingData.results.insertedCount || 0}</div>
                                        <div className="text-green-300 text-sm">Successful</div>
                                    </div>
                                    <div className="bg-red-500/10 p-4 rounded-lg">
                                       <div className="text-2xl font-bold text-red-400">
                                            {(processingData.total - (processingData.results.insertedCount || 0))}
                                        </div>
                                        <div className="text-red-300 text-sm">Failed</div>
                                    </div>
                                    <div className="bg-yellow-500/10 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-400">{processingData.results.errors?.length || 0}</div>
                                        <div className="text-yellow-300 text-sm">Errors / Warnings</div>
                                    </div>
                                </div>
                            )}
                        </Card>
                        <div className="flex justify-center space-x-4 mt-8">
                            <Button onClick={() => navigate("/company/claims/list")} className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>View All Claims</span>
                            </Button>
                            <Button variant="outline" onClick={handleReset} className="flex items-center space-x-2">
                                <RefreshCw className="w-4 h-4" />
                                <span>Upload Another File</span>
                            </Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <Helmet>
                <title>Bulk Claim Upload - GetMax</title>
            </Helmet>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={() => navigate("/company/claims/list")} className="p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Bulk Claim Upload</h1>
                            <p className="text-gray-400">Import multiple claims from a single file.</p>
                        </div>
                    </div>
                     {currentStep > 1 && (
                        <Button variant="outline" onClick={handleReset} className="flex items-center space-x-2">
                            <RefreshCw className="w-4 h-4" />
                            <span>Start Over</span>
                        </Button>
                    )}
                </div>

                <Card className="p-6 mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-semibold">Step {currentStep} of {totalSteps}</p>
                        <p className="text-emerald-400 font-semibold">{progress}% Complete</p>
                    </div>
                    <Progress value={progress} className="w-full h-2" />
                    <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
                        <span className={currentStep >= 1 ? "text-white" : ""}>Upload</span>
                        <span className={currentStep >= 2 ? "text-white" : ""}>Map Fields</span>
                        <span className={currentStep >= 3 ? "text-white" : ""}>Preview</span>
                        <span className={currentStep >= 4 ? "text-white" : ""}>Complete</span>
                    </div>
                </Card>

                <div className="mb-8">{renderStepContent()}</div>

                <div className="flex items-center justify-between mt-8">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        disabled={currentStep === 1 || isProcessing}
                    >
                        Previous
                    </Button>
                    
                    {currentStep === 2 && (
                         <Button onClick={generatePreview} disabled={errors.length > 0}>Generate Preview</Button>
                    )}
                    {currentStep === 3 && (
                        <Button onClick={processData} disabled={isProcessing} loading={isProcessing}>
                            Process {excelData.length} Claims
                        </Button>
                    )}
                     {currentStep === 1 && (
                         <Button onClick={() => setCurrentStep(2)} disabled={!uploadedFile}>
                             Next: Map Fields
                         </Button>
                     )}
                </div>
            </div>
            <DataProcessingModal
                isOpen={showProcessingModal}
                onClose={() => setShowProcessingModal(false)}
                processingData={processingData}
                title="Processing Claims..."
            />
        </div>
    );
};

export default ClaimBulkUpload;