// frontend/src/pages/patient/PatientIntake.jsx

import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft, ArrowRight, Save, User, Shield, Handshake, Search
} from "lucide-react";

// UI Components
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Progress } from "../../components/ui/Progress";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { usePatients } from "../../hooks/usePatients";
import { useClients } from "../../hooks/useClient";
import { useSOWs } from "../../hooks/useSows";
import { usePayers } from "../../hooks/usePayers";

// Theme & Constants
import { getTheme } from "../../lib/theme";
import { GENDERS } from "../../constants/patient.constants";
// import { cleanUpSvgCode } from "mermaid/dist/mermaidAPI.js";

const PatientIntake = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  // Data Hooks
  const { addPatient } = usePatients();
  const { clients } = useClients() || {};
  const { getClientSOWs } = useSOWs() || {}; // Destructure the getClientSOWs function
  const { payers } = usePayers() || {};

  // Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // NEW: State to hold SOWs for the selected client
  const [clientSows, setClientSows] = useState([]);
  
  // Payer Search State
  const [payerSearch, setPayerSearch] = useState("");
  const [isPayerDropdownOpen, setIsPayerDropdownOpen] = useState(false);
  const payerDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    clientRef: "",
    sowRef: "",
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
    },
    contactInfo: {
      primaryPhone: "",
      email: "",
    },
    insuranceInfo: {
      primaryInsurance: {
        payerRef: "",
        payerName: "",
        memberId: "",
        effectiveDate: "",
        subscriberRelationship: "Self",
      },
    },
    sourceInfo: {
      dataSource: "Manual Entry",
    },
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // NEW: useEffect to fetch SOWs when clientRef changes
  useEffect(() => {
    const fetchSows = async () => {
      if (formData.clientRef && typeof getClientSOWs === 'function') {
        const fetchedSows = await getClientSOWs(formData.clientRef);
        console.log("hell sows", fetchedSows);
        setClientSows(fetchedSows);
      } else {
        setClientSows([]); // Clear SOWs if no client is selected
      }
    };

    fetchSows();
  }, [formData.clientRef, getClientSOWs]);


  // Click outside handler for payer dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (payerDropdownRef.current && !payerDropdownRef.current.contains(event.target)) {
        setIsPayerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (section, field, value, subField = null) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (subField) {
        newData[section][field][subField] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });
    if (errors[`${section}.${field}`]) {
      setErrors((prev) => ({ ...prev, [`${section}.${field}`]: undefined }));
    }
  };

  const validateCurrentStep = () => {
    // Basic validation, can be expanded
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.clientRef) newErrors["clientRef"] = "Client is required.";
      if (!formData.sowRef) newErrors["sowRef"] = "SOW is required.";
    }
    if (currentStep === 2) {
      if (!formData.personalInfo.firstName) newErrors["personalInfo.firstName"] = "First name is required.";
      if (!formData.personalInfo.lastName) newErrors["personalInfo.lastName"] = "Last name is required.";
      if (!formData.personalInfo.dateOfBirth) newErrors["personalInfo.dateOfBirth"] = "Date of birth is required.";
    }
    if (currentStep === 3) {
      if (!formData.insuranceInfo.primaryInsurance.payerRef) newErrors["insuranceInfo.primaryInsurance.payerRef"] = "Payer is required.";
      if (!formData.insuranceInfo.primaryInsurance.memberId) newErrors["insuranceInfo.primaryInsurance.memberId"] = "Member ID is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;
    setLoading(true);
    try {
      await addPatient(formData);
      toast.success("Patient added successfully!");
      navigate("/company/patients/list");
    } catch (error) {
      console.error("Patient submission error:", error);
      toast.error(error.response?.data?.message || "Failed to add patient.");
    } finally {
      setLoading(false);
    }
  };

  console.log("Pyers in pateint Intake.....", payers);

  const filteredPayers = payers?.filter(payer =>
    payer.payerInfo.payerName.toLowerCase().includes(payerSearch.toLowerCase())
  );

  const handlePayerSelect = (payer) => {
    setFormData(prev => ({
        ...prev,
        insuranceInfo: {
            ...prev.insuranceInfo,
            primaryInsurance: {
                ...prev.insuranceInfo.primaryInsurance,
                payerRef: payer._id,
                payerName: payer.payerInfo.payerName
            }
        }
    }));
    setPayerSearch(payer.payerInfo.payerName);
    setIsPayerDropdownOpen(false);
    setErrors(prev => ({...prev, 'insuranceInfo.primaryInsurance.payerRef': undefined}));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Association
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Handshake className={`w-8 h-8 text-${theme.accent}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Client & SOW Association</h3>
                <p className={`text-${theme.textSecondary}`}>Link this patient to a client and their service agreement.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Client *"
                value={formData.clientRef}
                // MODIFIED: Reset sowRef when client changes
                onChange={(e) => {
                  // Use the functional update form to prevent stale state issues
                  setFormData(prev => ({ ...prev, clientRef: e.target.value, sowRef: "" }));
                }}
                options={clients?.map(client => ({ value: client._id, label: client.clientInfo?.clientName })) || []}
                error={errors.clientRef}
                placeholder="Select a client"
              />
              <Select
                label="SOW *"
                value={formData.sowRef}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, sowRef: e.target.value }));
                }}
                // MODIFIED: Use the new clientSows state for options
                options={clientSows.map(sow => ({ value: sow._id, label: sow.sowName })) || []}
                error={errors.sowRef}
                placeholder="Select a Statement of Work"
                disabled={!formData.clientRef || clientSows.length === 0}
              />
            </div>
          </div>
        );
      // Other cases remain the same...
      case 2: // Demographics
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <User className={`w-8 h-8 text-${theme.accent}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Patient Demographics</h3>
                    <p className={`text-${theme.textSecondary}`}>Enter the patient's personal and contact information.</p>
                </div>
                <Card className={`${theme.card} p-6`}>
                    <h4 className="text-white text-lg font-semibold mb-4">Personal Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="First Name *" value={formData.personalInfo.firstName} onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)} error={errors["personalInfo.firstName"]} />
                        <Input label="Last Name *" value={formData.personalInfo.lastName} onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)} error={errors["personalInfo.lastName"]} />
                        <Input label="Date of Birth *" type="date" value={formData.personalInfo.dateOfBirth} onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)} error={errors["personalInfo.dateOfBirth"]} />
                        <Select label="Gender" value={formData.personalInfo.gender} onChange={(e) => handleInputChange("personalInfo", "gender", e.target.value)} options={GENDERS} />
                    </div>
                </Card>
                 <Card className={`${theme.card} p-6`}>
                    <h4 className="text-white text-lg font-semibold mb-4">Contact Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Primary Phone" value={formData.contactInfo.primaryPhone} onChange={(e) => handleInputChange("contactInfo", "primaryPhone", e.target.value)} />
                        <Input label="Email Address" type="email" value={formData.contactInfo.email} onChange={(e) => handleInputChange("contactInfo", "email", e.target.value)} />
                    </div>
                </Card>
            </div>
        );
      case 3: // Insurance
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-${theme.accent}/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Shield className={`w-8 h-8 text-${theme.accent}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Insurance Information</h3>
                    <p className={`text-${theme.textSecondary}`}>Provide the patient's primary insurance details.</p>
                </div>
                 <Card className={`${theme.card} p-6`}>
                    <h4 className="text-white text-lg font-semibold mb-4">Primary Insurance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Searchable Payer Dropdown */}
                        <div className="relative" ref={payerDropdownRef}>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Payer *</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <Input
                                    type="text"
                                    placeholder="Search for a payer..."
                                    value={payerSearch}
                                    onChange={(e) => {
                                        setPayerSearch(e.target.value);
                                        setIsPayerDropdownOpen(true);
                                        if(formData.insuranceInfo.primaryInsurance.payerRef){
                                            handleInputChange("insuranceInfo", "primaryInsurance", "", "payerRef");
                                        }
                                    }}
                                    onFocus={() => setIsPayerDropdownOpen(true)}
                                    className="pl-10"
                                />
                            </div>
                            {errors['insuranceInfo.primaryInsurance.payerRef'] && <p className="text-red-500 text-xs mt-1">{errors['insuranceInfo.primaryInsurance.payerRef']}</p>}
                            
                            {isPayerDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-[#2a2a3e] border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredPayers && filteredPayers.length > 0 ? (
                                        filteredPayers.map(payer => (
                                            <div key={payer._id} onClick={() => handlePayerSelect(payer)} className="px-4 py-2 text-white hover:bg-blue-600 cursor-pointer">
                                                {payer.payerInfo.payerName}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-400">No payers found.</div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <Input label="Member ID *" value={formData.insuranceInfo.primaryInsurance.memberId} onChange={(e) => handleInputChange("insuranceInfo", "primaryInsurance", e.target.value, "memberId")} error={errors["insuranceInfo.primaryInsurance.memberId"]} />
                        <Input label="Effective Date" type="date" value={formData.insuranceInfo.primaryInsurance.effectiveDate} onChange={(e) => handleInputChange("insuranceInfo", "primaryInsurance", e.target.value, "effectiveDate")} />
                         <Select
                            label="Subscriber Relationship"
                            value={formData.insuranceInfo.primaryInsurance.subscriberRelationship}
                            onChange={(e) => handleInputChange("insuranceInfo", "primaryInsurance", e.target.value, "subscriberRelationship")}
                            options={[{value: 'Self', label: 'Self'}, {value: 'Spouse', label: 'Spouse'}, {value: 'Child', label: 'Child'}, {value: 'Other', label: 'Other'}]}
                        />
                    </div>
                </Card>
            </div>
        );
      default:
        return null;
    }
  };

  // The rest of the component (renderStepIndicator, main return) remains the same
  const renderStepIndicator = () => {
    const steps = [
        { number: 1, title: "Association", icon: Handshake },
        { number: 2, title: "Demographics", icon: User },
        { number: 3, title: "Insurance", icon: Shield },
    ];
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className={`flex flex-col items-center text-center w-1/3`}>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        currentStep >= step.number ? `border-${theme.accent} bg-${theme.accent}/20 text-${theme.accent}` : `border-gray-600 text-gray-400`
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <p className={`mt-2 text-sm font-medium ${currentStep >= step.number ? 'text-white' : 'text-gray-500'}`}>{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${currentStep > step.number ? `bg-${theme.accent}`: 'bg-gray-600'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12121e] to-[#161622] text-white p-6">
      <Helmet>
        <title>Patient Intake - GetMax</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/company/patients/list")} className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Patients</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">New Patient Intake</h1>
              <p className={`text-${theme.textSecondary}`}>Step {currentStep} of {totalSteps}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white text-2xl font-bold">{Math.round(progress)}%</div>
            <p className={`text-${theme.textSecondary} text-sm`}>Complete</p>
          </div>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>
        
        {renderStepIndicator()}

        <Card className={`${theme.card} p-8`}>
            {renderStepContent()}
        </Card>

        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading}>
                <Save className="w-4 h-4 mr-2" />
                Create Patient
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientIntake;