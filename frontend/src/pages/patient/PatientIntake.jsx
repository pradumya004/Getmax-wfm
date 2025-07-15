// frontend/src/pages/patient/PatientIntake.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { usePatients } from "../../hooks/usePatients";
import { useClients } from "../../hooks/useClient";
import { useSOWs } from "../../hooks/useSows";
import { Button } from "../../components/ui/Button";

const PatientIntake = () => {
  const navigate = useNavigate();
  const { addPatient } = usePatients();
  const { clients } = useClients();
  const { sows } = useSOWs();

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
        memberId: "",
        effectiveDate: "",
        subscriberRelationship: "Self",
      },
    },
    sourceInfo: {
      dataSource: "Manual Entry",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await addPatient(formData);
    console.log("Patient added response:", res);
    
    if (res?.success) {
      toast.success("Patient added successfully");
      navigate("/company/patients/list");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Helmet>
        <title>Patient Intake</title>
      </Helmet>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-1">Patient Intake Form</h1>
        <p className="text-gray-400">Add a new patient record with accurate information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1e1e2f] shadow-lg rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-300">Client</label>
            <select
              value={formData.clientRef}
              onChange={(e) => setFormData({ ...formData, clientRef: e.target.value })}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            >
              <option value="">Select client</option>
              {clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.clientInfo?.clientName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">SOW</label>
            <select
              value={formData.sowRef}
              onChange={(e) => setFormData({ ...formData, sowRef: e.target.value })}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            >
              <option value="">Select SOW</option>
              {sows?.map((sow) => (
                <option key={sow._id} value={sow._id}>
                  {sow.sowName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">First Name</label>
            <input
              type="text"
              value={formData.personalInfo.firstName}
              onChange={(e) => handleChange("personalInfo", "firstName", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="John"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Last Name</label>
            <input
              type="text"
              value={formData.personalInfo.lastName}
              onChange={(e) => handleChange("personalInfo", "lastName", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="Doe"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Date of Birth</label>
            <input
              type="date"
              value={formData.personalInfo.dateOfBirth}
              onChange={(e) => handleChange("personalInfo", "dateOfBirth", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Gender</label>
            <select
              value={formData.personalInfo.gender}
              onChange={(e) => handleChange("personalInfo", "gender", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Primary Phone</label>
            <input
              type="text"
              value={formData.contactInfo.primaryPhone}
              onChange={(e) => handleChange("contactInfo", "primaryPhone", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="(123) 456-7890"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) => handleChange("contactInfo", "email", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Insurance Member ID</label>
            <input
              type="text"
              value={formData.insuranceInfo.primaryInsurance.memberId}
              onChange={(e) => handleNestedChange("insuranceInfo", "primaryInsurance", "memberId", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Effective Date</label>
            <input
              type="date"
              value={formData.insuranceInfo.primaryInsurance.effectiveDate}
              onChange={(e) => handleNestedChange("insuranceInfo", "primaryInsurance", "effectiveDate", e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
        </div>

        <div className="text-center pt-6">
          <Button type="submit" variant="primary" onSubmit={handleSubmit}>
            Submit Patient
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientIntake;