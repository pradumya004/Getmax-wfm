import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Plus, DollarSign, ArrowLeft, ArrowRight, Save, User, Stethoscope, HeartPulse, Building, CheckCircle, Trash2 } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { useClaims } from "../../../hooks/useClaims.jsx";
import { useClients } from "../../../hooks/useClient.jsx";
import { useSOWs } from "../../../hooks/useSows.jsx";
import { usePatients } from "../../../hooks/usePatients.jsx";
import { getTheme } from "../../../lib/theme.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Components
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Label } from "../../../components/ui/Label.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { Progress } from "../../../components/ui/Progress.jsx";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog.jsx";

const ChargeEntry = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();

  // Data Hooks
  const { addClaim, loading } = useClaims();
  const { clients, loadClients } = useClients();
  const { getClientSOWs } = useSOWs();
  const { getClientPatients } = usePatients();

  // State for fetched data
  const [clientSows, setClientSows] = useState([]);
  const [clientPatients, setClientPatients] = useState([]);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const claimTypeOptions = ['Professional', 'Institutional', 'Dental', 'Vision'].map(t => ({ value: t, label: t }));
  
  const initialClaimState = {
    clientRef: "",
    sowRef: "",
    patientRef: "",
    claimInfo: {
      claimType: "Professional",
      dateOfService: new Date().toISOString().split('T')[0],
      procedureCodes: [{ cptCode: "", modifier: "", units: 1, chargeAmount: "" }],
      diagnosisCodes: [{ icdCode: "", isPrimary: true }],
    },
    financialInfo: { grossCharges: 0 },
    sourceInfo: { dataSource: 'Direct Entry' },
  };

  const [formData, setFormData] = useState(initialClaimState);
  const [errors, setErrors] = useState({});

  // Fetch initial list of clients on component mount
  useEffect(() => {
    if(loadClients) {
        loadClients();
    }
  }, []);
  // Fetch SOWs and Patients when a client is selected
  useEffect(() => {
    const fetchDataForClient = async () => {
      if (formData.clientRef) {
        // Fetch SOWs
        if (typeof getClientSOWs === 'function') {
          const fetchedSows = await getClientSOWs(formData.clientRef);
          setClientSows(fetchedSows || []);
        }
        // Fetch Patients
        if (typeof getClientPatients === 'function') {
          const fetchedPatients = await getClientPatients(formData.clientRef);
          setClientPatients(fetchedPatients || []);
        }
      } else {
        setClientSows([]);
        setClientPatients([]); // Clear patients when client is cleared
      }
    };
    fetchDataForClient();
  }, [formData.clientRef]);



  // --- FORM HANDLERS ---
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    console.log("Changes...", formData)
  };
  const handleProcedureChange = (index, field, value) => {
    const newProcedures = [...formData.claimInfo.procedureCodes];
    newProcedures[index][field] = value;
    handleInputChange("claimInfo", "procedureCodes", newProcedures);
  };
  const addProcedure = () => {
    handleInputChange("claimInfo", "procedureCodes", [...formData.claimInfo.procedureCodes, { cptCode: "", modifier: "", units: 1, chargeAmount: "" }]);
  };
  const removeProcedure = (index) => {
    handleInputChange("claimInfo", "procedureCodes", formData.claimInfo.procedureCodes.filter((_, i) => i !== index));
  };
  useEffect(() => {
    const totalCharges = formData.claimInfo.procedureCodes.reduce((sum, proc) => sum + (parseFloat(proc.chargeAmount) || 0), 0);
    if (totalCharges !== formData.financialInfo.grossCharges) {
        handleInputChange("financialInfo", "grossCharges", totalCharges);
    }
  }, [formData.claimInfo.procedureCodes, formData.financialInfo.grossCharges]);


  // --- WIZARD NAVIGATION & SUBMISSION ---
  const validateStep = () => {
    const newErrors = {};
    const { clientRef, sowRef, patientRef, claimInfo } = formData;

    switch (currentStep) {
      case 1:
        if (!clientRef) newErrors.clientRef = "Client selection is required.";
        if (!sowRef) newErrors.sowRef = "SOW selection is required.";
        if (!patientRef) newErrors.patientRef = "Patient selection is required.";
        break;

      case 2:
        if (!claimInfo.dateOfService) {
          newErrors.dateOfService = "Date of Service is required.";
        } else if (new Date(claimInfo.dateOfService) > new Date()) {
          newErrors.dateOfService = "Date of Service cannot be in the future.";
        }
        if (!claimInfo.claimType) {
          newErrors.claimType = "Claim Type is required.";
        }
        break;

      case 3:
        const firstProcedure = claimInfo.procedureCodes[0];
        // Validate diagnosis
        if (!claimInfo.diagnosisCodes[0]?.icdCode) {
          newErrors.icdCode = "At least one diagnosis code is required.";
        } else {
          const icdRegex = /^[A-Z]\d{2}(\.\d{1,3})?$/;
          if (!icdRegex.test(claimInfo.diagnosisCodes[0].icdCode)) newErrors.icdCode = "Invalid ICD-10 format (e.g., M54.5).";
        }
        // Validate CPT Code
        if (!firstProcedure?.cptCode) {
            newErrors.cptCode = "CPT code is required.";
        } else {
            const cptRegex = /^\d{5}$|^[A-Z]\d{4}$/;
            if (!cptRegex.test(firstProcedure.cptCode)) newErrors.cptCode = "Invalid CPT/HCPCS format.";
        }
        // Validate Charge Amount
        if (!firstProcedure?.chargeAmount) {
            newErrors.chargeAmount = "Amount is required.";
        } else if (parseFloat(firstProcedure.chargeAmount) <= 0) {
            newErrors.chargeAmount = "Amount must be > 0.";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };
  const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleSubmit = async () => {
    if (!validateStep()) {
        toast.error("Please review the claim details; some fields are missing.");
        return;
    }
    await addClaim(formData);
    // The useClaims hook will show success/error toasts
    navigate("/employee/dashboard");
  };
  
  const stepIndicators = [
      { number: 1, title: "Setup", icon: Building },
      { number: 2, title: "Details", icon: FileSpreadsheet },
      { number: 3, title: "Charges", icon: DollarSign },
      { number: 4, title: "Review", icon: CheckCircle },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Encounter Setup
        return (
          <>
            <h3 className="text-xl font-semibold text-white mb-1">Step 1: Encounter Setup</h3>
            <p className="text-gray-400 mb-6">Select the client, SOW, and patient for this claim.</p>
            <div className="space-y-4">
              <Select 
                label="Client *" 
                options={clients?.map(c => ({ value: c._id, label: c.clientInfo?.clientName })) || []} 
                onChange={e => setFormData({...formData, clientRef: e.target.value, sowRef: '', patientRef: ''})} 
                value={formData.clientRef} 
                error={errors.clientRef} 
                placeholder="Select a client..."
              />
              <Select 
                label="Statement of Work (SOW) *" 
                options={clientSows.map(s => ({ value: s._id, label: s.sowName }))} 
                onChange={e => setFormData({...formData, sowRef: e.target.value, patientRef: ''})} 
                value={formData.sowRef} 
                disabled={!formData.clientRef || clientSows.length === 0} 
                error={errors.sowRef}
                placeholder={formData.clientRef ? "Select an SOW..." : "Select a client first"}
              />
              <Select 
                label="Patient *" 
                options={clientPatients.map(p => ({ value: p._id, label: `${p.personalInfo?.firstName} ${p.personalInfo?.lastName}` }))} 
                onChange={e => setFormData({...formData, patientRef: e.target.value})} 
                value={formData.patientRef} 
                disabled={!formData.clientRef || clientPatients.length === 0} 
                error={errors.patientRef}
                placeholder={formData.clientRef ? "Select a patient..." : "Select a client first"}
              />
            </div>
          </>
        );
      case 2:
        return (
           <>
            <h3 className="text-xl font-semibold text-white mb-1">Step 2: Claim Details</h3>
            <p className="text-gray-400 mb-6">Enter the basic details about the service provided.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Date of Service *" type="date" value={formData.claimInfo.dateOfService} onChange={e => handleInputChange("claimInfo", "dateOfService", e.target.value)} />
                <Select label="Claim Type *" options={claimTypeOptions} value={formData.claimInfo.claimType} onChange={e => handleInputChange("claimInfo", "claimType", e.target.value)} />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-xl font-semibold text-white">Step 3: Codes & Charges</h3>
            <p className="text-gray-400 mb-6">Enter all relevant diagnosis and procedure codes for this encounter.</p>
            <div className="space-y-6">
              <div>
                <Label>Diagnosis Codes (ICD-10) *</Label>
                <Input placeholder="Enter primary diagnosis code (e.g., M54.5)" onChange={e => handleInputChange("claimInfo", "diagnosisCodes", [{ icdCode: e.target.value, isPrimary: true }])} error={errors.icdCode}/>
              </div>
              <div>
                <Label>Procedure Codes (CPT) *</Label>
                {formData.claimInfo.procedureCodes.map((proc, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-start mb-2">
                    <Input className="col-span-4" placeholder="CPT Code" value={proc.cptCode} onChange={e => handleProcedureChange(index, 'cptCode', e.target.value)} error={index === 0 ? errors.cptCode : ""} />
                    <Input className="col-span-3" placeholder="Modifiers" value={proc.modifier} onChange={e => handleProcedureChange(index, 'modifier', e.target.value)} />
                    <Input className="col-span-2" type="number" value={proc.units} onChange={e => handleProcedureChange(index, 'units', e.target.value)} />
                    <Input className="col-span-2" type="number" placeholder="$" value={proc.chargeAmount} onChange={e => handleProcedureChange(index, 'chargeAmount', e.target.value)} error={index === 0 ? errors.chargeAmount : ""} />
                    <Button variant="ghost" size="icon" onClick={() => removeProcedure(index)} className="col-span-1 text-red-400 hover:bg-red-500/10 mt-1"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addProcedure}><Plus className="w-4 h-4 mr-2" />Add Procedure</Button>
              </div>
            </div>
          </>
        );
      case 4:
        // Find the full patient object to display their name
        const selectedPatient = clientPatients.find(p => p._id === formData.patientRef);
        return (
          <>
            <h3 className="text-xl font-semibold text-white">Step 4: Review & Submit</h3>
            <p className="text-gray-400 mb-6">Please review all claim information for accuracy before submission.</p>
            <div className="p-4 bg-black/20 rounded-lg space-y-2 text-sm">
                {/* CORRECTED: Use the 'clientPatients' state to find and display the name */}
                <p><strong className="text-gray-400 w-32 inline-block">Patient:</strong> {selectedPatient ? `${selectedPatient.personalInfo?.firstName} ${selectedPatient.personalInfo?.lastName}` : 'N/A'}</p>
                <p><strong className="text-gray-400 w-32 inline-block">Date of Service:</strong> {formData.claimInfo.dateOfService}</p>
                <p><strong className="text-gray-400 w-32 inline-block">Claim Type:</strong> {formData.claimInfo.claimType}</p>
                <p><strong className="text-gray-400 w-32 inline-block">Diagnosis:</strong> {formData.claimInfo.diagnosisCodes.map(p => p.icdCode).join(', ')}</p>
                <p><strong className="text-gray-400 w-32 inline-block">Procedures:</strong> {formData.claimInfo.procedureCodes.map(p => p.cptCode).join(', ')}</p>
                <hr className="border-white/10 my-2" />
                <p className="text-lg font-bold"><strong className="text-gray-400 w-32 inline-block">Total Charges:</strong> ${formData.financialInfo.grossCharges.toFixed(2)}</p>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className={`text-3xl font-bold text-${theme.text}`}>New Claim Entry</h1>
        <p className={`text-${theme.textSecondary} mt-1`}>Follow the steps to create a new claim for processing.</p>
      </div>

      <Card className={`${theme.card} p-6`}>
        <div className="flex items-center">
            {stepIndicators.map((step, index) => (
                <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.number ? `border-${theme.accent} bg-${theme.accent}/20 text-${theme.accent}` : `border-gray-600 text-gray-400`}`}>
                           {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                        </div>
                        <p className={`mt-2 text-xs font-medium ${currentStep >= step.number ? 'text-white' : 'text-gray-500'}`}>{step.title}</p>
                    </div>
                    {index < stepIndicators.length - 1 && <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${currentStep > step.number ? `bg-${theme.accent}`: 'bg-gray-600'}`} />}
                </React.Fragment>
            ))}
        </div>
      </Card>
      
      <Card theme={userType} className="p-8 min-h-[300px]">
        {renderStepContent()}
      </Card>

      <div className="flex items-center justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Previous</Button>
        <div className="flex items-center gap-3">
          {currentStep < totalSteps && <Button onClick={handleNext} className="flex items-center gap-2">Next <ArrowRight className="w-4 h-4" /></Button>}
          {currentStep === totalSteps && <Button theme={userType} onClick={handleSubmit} loading={loading} className="flex items-center gap-2"><Save className="w-4 h-4" /> Submit Claim</Button>}
        </div>
      </div>
    </div>
  );
};

export default ChargeEntry;