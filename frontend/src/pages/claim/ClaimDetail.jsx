// frontend/src/pages/claims/ClaimDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useClaims } from '../../hooks/useClaims';
import { useAuth } from '../../hooks/useAuth';
import { getTheme } from '../../lib/theme';
import { formatDate, formatCurrency } from '../../lib/utils';
import { ArrowLeft, Edit, DollarSign, User, Building, Calendar, FileText, CheckCircle, AlertTriangle, Info } from 'lucide-react';

// Import your UI components
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Helper component for displaying details neatly
const DetailItem = ({ label, value, children }) => (
    <div>
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-white">{children || value || 'N/A'}</dd>
    </div>
);

const ClaimDetail = () => {
    const { claimId } = useParams(); // Gets the claim's ID from the URL
    const navigate = useNavigate();
    const { userType } = useAuth();
    const theme = getTheme(userType);
    
    // Assuming useClaims has a method to get a single claim
    const { claim, loading, error, fetchClaimById } = useClaims(); 
    
    useEffect(() => {
        if (claimId) {
            fetchClaimById(claimId);
        }
    }, [claimId]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><LoadingSpinner /></div>;
    }

    if (error || !claim) {
        return <div className="text-center py-10 text-red-400">Error: Could not load claim details.</div>;
    }

    const tabOptions = [
        { id: 'overview', label: 'Overview' },
        { id: 'financials', label: 'Financials' },
        { id: 'clinical', label: 'Clinical Info' },
        { id: 'workflow', label: 'Workflow & History' },
    ];
    
    const [activeTab, setActiveTab] = useState(tabOptions[0].id);

    return (
        <div className={`p-6 bg-${theme.background} min-h-screen text-white`}>
            <Helmet><title>Claim Details - {claim.claimId}</title></Helmet>

            {/* Header Section */}
            <header className="mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Claims
                </Button>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center`}>
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{claim.claimId}</h1>
                            <p className="text-gray-400">Patient: {`${claim.patientRef?.personalInfo?.firstName} ${claim.patientRef?.personalInfo?.lastName}`}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <StatusBadge status={claim.workflowStatus?.currentStatus} variant="claim" />
                                {claim.priorityInfo?.isDenied && <Badge variant="danger">Denied</Badge>}
                                {claim.workflowStatus?.isEscalated && <Badge variant="warning">Escalated</Badge>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button onClick={() => navigate(`/company/claims/edit/${claim._id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Claim
                        </Button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <Tabs tabs={tabOptions} activeTab={activeTab} onTabClick={setActiveTab} />

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Financial Summary Card */}
                        <Card className="lg:col-span-1">
                            <h3 className="font-semibold text-lg mb-4 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-emerald-400"/>Financial Summary</h3>
                            <dl className="grid grid-cols-2 gap-4">
                                <DetailItem label="Gross Charges" value={formatCurrency(claim.financialInfo?.grossCharges)} />
                                <DetailItem label="Net Charges" value={formatCurrency(claim.financialInfo?.netCharges)} />
                                <DetailItem label="Payments" value={formatCurrency(claim.financialInfo?.totalPaymentsPosted)} />
                                <DetailItem label="Adjustments" value={formatCurrency(claim.financialInfo?.totalAdjustments)} />
                                <div className="col-span-2 bg-gray-800 p-3 rounded-lg">
                                    <dt className="text-sm font-medium text-gray-400">Outstanding Balance</dt>
                                    <dd className="mt-1 text-2xl font-bold text-yellow-400">{formatCurrency(claim.financialInfo?.outstandingBalance)}</dd>
                                </div>
                            </dl>
                        </Card>
                        {/* Key Info Card */}
                        <Card className="lg:col-span-1">
                            <h3 className="font-semibold text-lg mb-4 flex items-center"><Info className="w-5 h-5 mr-2 text-blue-400"/>Key Information</h3>
                            <dl className="space-y-4">
                                <DetailItem label="Client" value={claim.clientRef?.clientInfo?.clientName} />
                                <DetailItem label="SOW" value={claim.sowRef?.sowName} />
                                <DetailItem label="Primary Payer" value={claim.primaryPayerRef?.payerInfo?.payerName} />
                                <DetailItem label="Assigned To" value={claim.assignedEmployeeRef ? `${claim.assignedEmployeeRef.personalInfo.firstName} ${claim.assignedEmployeeRef.personalInfo.lastName}` : 'Unassigned'} />
                            </dl>
                        </Card>
                         {/* Priority & Aging Card */}
                        <Card className="lg:col-span-1">
                             <h3 className="font-semibold text-lg mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-orange-400"/>Priority & Aging</h3>
                            <dl className="space-y-4">
                                <DetailItem label="Priority Score" value={claim.priorityInfo?.priorityScore} />
                                <DetailItem label="Aging (Days)" value={claim.priorityInfo?.agingDays} />
                                <DetailItem label="Priority" value={claim.assignmentInfo?.workloadPriority} />
                                <DetailItem label="Last Activity" value={formatDate(claim.activityMetrics?.lastActivityDate)} />
                            </dl>
                        </Card>
                    </div>
                )}
                
                {activeTab === 'financials' && (
                    <div className="space-y-6">
                        {/* Full Breakdown Card */}
                        <Card>
                            <h3 className="font-semibold text-lg mb-4">Financial Breakdown</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               <dl className="space-y-4">
                                    <DetailItem label="Gross Charges" value={formatCurrency(claim.financialInfo?.grossCharges)} />
                                    <DetailItem label="Contractual Discount" value={formatCurrency(claim.financialInfo?.contractualDiscount)} />
                                    <DetailItem label="Net Charges" value={formatCurrency(claim.financialInfo?.netCharges)} />
                                </dl>
                                <dl className="space-y-4">
                                    <DetailItem label="Total Payments" value={formatCurrency(claim.financialInfo?.totalPaymentsPosted)} />
                                    <DetailItem label="Total Adjustments" value={formatCurrency(claim.financialInfo?.totalAdjustments)} />
                                    <DetailItem label="Outstanding Balance" value={formatCurrency(claim.financialInfo?.outstandingBalance)} />
                                </dl>
                                <dl className="space-y-4">
                                    <DetailItem label="Copay" value={formatCurrency(claim.financialInfo?.patientResponsibility?.copay)} />
                                    <DetailItem label="Coinsurance" value={formatCurrency(claim.financialInfo?.patientResponsibility?.coinsurance)} />
                                    <DetailItem label="Deductible" value={formatCurrency(claim.financialInfo?.patientResponsibility?.deductible)} />
                                </dl>
                            </div>
                        </Card>
                        {/* You can add tables for Payments and Adjustments history here */}
                    </div>
                )}

                {activeTab === 'clinical' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <h3 className="font-semibold text-lg mb-4">Service & Provider Info</h3>
                             <dl className="grid grid-cols-2 gap-4">
                                <DetailItem label="Date of Service" value={formatDate(claim.claimInfo?.dateOfService)} />
                                <DetailItem label="End Date of Service" value={formatDate(claim.claimInfo?.dateOfServiceEnd)} />
                                <DetailItem label="Claim Type" value={claim.claimInfo?.claimType} />
                                <DetailItem label="Place of Service" value={claim.claimInfo?.placeOfService} />
                                <DetailItem label="Rendering Provider" value={claim.claimInfo?.renderingProvider?.name} />
                                <DetailItem label="Provider NPI" value={claim.claimInfo?.renderingProvider?.npi} />
                            </dl>
                        </Card>
                        <div className="space-y-6">
                            <Card>
                                <h3 className="font-semibold text-lg mb-4">Procedure Codes (CPT)</h3>
                                {/* Render a simple table for CPT codes */}
                                <ul className="space-y-2">
                                    {claim.claimInfo?.procedureCodes.map((proc, idx) => (
                                        <li key={idx} className="flex justify-between p-2 bg-gray-800 rounded">
                                            <span>{proc.cptCode} ({proc.cptDescription || 'No description'})</span>
                                            <span className="font-semibold">{formatCurrency(proc.chargeAmount)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                            <Card>
                                <h3 className="font-semibold text-lg mb-4">Diagnosis Codes (ICD-10)</h3>
                                 <ul className="space-y-2">
                                    {claim.claimInfo?.diagnosisCodes.map((diag, idx) => (
                                        <li key={idx} className="p-2 bg-gray-800 rounded">
                                            {diag.icdCode} {diag.isPrimary && <Badge variant="success" size="sm">Primary</Badge>}
                                            <p className="text-xs text-gray-400">{diag.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    </div>
                )}
                
                {activeTab === 'workflow' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                             <h3 className="font-semibold text-lg mb-4">Workflow Status</h3>
                             <dl className="grid grid-cols-2 gap-4">
                                <DetailItem label="Current Status">
                                    <StatusBadge status={claim.workflowStatus?.currentStatus} />
                                </DetailItem>
                                <DetailItem label="Action Code" value={claim.workflowStatus?.actionCode} />
                                <DetailItem label="Last Update" value={formatDate(claim.workflowStatus?.lastStatusUpdate?.date)} />
                                <DetailItem label="Updated By" value={claim.workflowStatus?.lastStatusUpdate?.updatedBy?.personalInfo?.firstName} />
                                <DetailItem label="Next Follow-up" value={formatDate(claim.activityMetrics?.nextFollowUpDate)} />
                             </dl>
                        </Card>
                         <Card>
                             <h3 className="font-semibold text-lg mb-4">Assignment</h3>
                             <dl className="grid grid-cols-2 gap-4">
                                <DetailItem label="Currently Assigned To" value={claim.assignedEmployeeRef ? `${claim.assignedEmployeeRef.personalInfo.firstName} ${claim.assignedEmployeeRef.personalInfo.lastName}` : 'Floating Pool'} />
                                <DetailItem label="Assignment Date" value={formatDate(claim.assignmentInfo?.assignmentDate)} />
                                <DetailItem label="Assignment Method" value={claim.assignmentInfo?.assignmentMethod} />
                             </dl>
                        </Card>
                         {/* You can add a card for notes or full audit history here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClaimDetail;