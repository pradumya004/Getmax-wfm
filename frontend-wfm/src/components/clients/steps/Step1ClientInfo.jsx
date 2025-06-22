import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { Textarea } from '@/components/ui/textarea';

const Step1ClientInfo = ({ formData, updateFormData }) => {
  const handleInputChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name, value) => {
    updateFormData({ [name]: value });
  };

  const clientSubTypes = {
    Provider: ['Clinic', 'Hospital', 'DME', 'Lab', 'Dental', 'Multi-Specialty', 'Behavioral', 'Other'],
    'Billing Company': ['Small Practice', 'Large Group', 'Hospital System', 'Specialty Focused', 'Other'],
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-white">Client Information</CardTitle>
        <CardDescription className="text-gray-300">
          Enter the basic details for the new client contract.
        </CardDescription>
      </CardHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Client Name *</label>
          <Input name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="e.g., Apex Medical Group" className="bg-black/20 border-[#39ff14]/30 text-white" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Client Type *</label>
          <Select name="clientType" value={formData.clientType} onValueChange={(value) => handleSelectChange('clientType', value)}>
            <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Provider">Provider</SelectItem>
              <SelectItem value="Billing Company">Billing Company</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Client Sub-Type</label>
          <Select name="clientSubType" value={formData.clientSubType} onValueChange={(value) => handleSelectChange('clientSubType', value)} disabled={!formData.clientType}>
            <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue placeholder="Select sub-type" /></SelectTrigger>
            <SelectContent>
              {clientSubTypes[formData.clientType]?.map(subType => <SelectItem key={subType} value={subType}>{subType}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Contract Type *</label>
          <Select name="contractType" value={formData.contractType} onValueChange={(value) => handleSelectChange('contractType', value)}>
            <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue placeholder="Select contract" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="End-to-End">End-to-End</SelectItem>
              <SelectItem value="Transactional">Transactional</SelectItem>
              <SelectItem value="FTE">FTE</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">EHR Template (Scope Format ID)</label>
          <Select name="ehrTemplate" value={formData.ehrTemplate} onValueChange={(value) => handleSelectChange('ehrTemplate', value)}>
            <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue placeholder="Select template" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EMSMC">EMSMC</SelectItem>
              <SelectItem value="ClaimMD">ClaimMD</SelectItem>
              <SelectItem value="Medisoft">Medisoft</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Start Date *</label>
          <DatePicker date={formData.startDate} setDate={(date) => updateFormData({ startDate: date })} className="bg-black/20 border-[#39ff14]/30 text-white" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">End Date (Optional)</label>
          <DatePicker date={formData.endDate} setDate={(date) => updateFormData({ endDate: date })} className="bg-black/20 border-[#39ff14]/30 text-white" />
        </div>
      </div>
       <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Internal Notes</label>
          <Textarea name="internalNotes" value={formData.internalNotes} onChange={handleInputChange} placeholder="Add any internal notes about this client..." className="bg-black/20 border-[#39ff14]/30 text-white" />
        </div>
    </div>
  );
};

export default Step1ClientInfo;