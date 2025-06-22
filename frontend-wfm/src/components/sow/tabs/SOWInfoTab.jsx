import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';

const SOWInfoTab = ({ data, onChange, clientNames, departments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
      <div className="space-y-2">
        <label>Client Name</label>
        <Select value={data.clientName} onValueChange={(v) => onChange('clientName', v)}>
          <SelectTrigger className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Select a client" /></SelectTrigger>
          <SelectContent>
            {clientNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label>Department</label>
        <Select value={data.department} onValueChange={(v) => onChange('department', v)}>
          <SelectTrigger className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Select a department" /></SelectTrigger>
          <SelectContent>
            {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label>Claim Format</label>
        <Select value={data.claimFormat} onValueChange={(v) => onChange('claimFormat', v)}>
          <SelectTrigger className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Select a format" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="EMSMC">EMSMC</SelectItem>
            <SelectItem value="ClaimMD">ClaimMD</SelectItem>
            <SelectItem value="Medisoft">Medisoft</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label>Contract Type</label>
        <Select value={data.contractType} onValueChange={(v) => onChange('contractType', v)}>
          <SelectTrigger className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Select a type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="End-to-End">End-to-End</SelectItem>
            <SelectItem value="Transactional">Transactional</SelectItem>
            <SelectItem value="FTE">FTE</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label>Effective Date</label>
        <DatePicker date={data.effectiveDate ? new Date(data.effectiveDate) : null} setDate={(d) => onChange('effectiveDate', d)} />
      </div>
      <div className="space-y-2">
        <label>End Date (Optional)</label>
        <DatePicker date={data.endDate ? new Date(data.endDate) : null} setDate={(d) => onChange('endDate', d)} />
      </div>
    </div>
  );
};

export default SOWInfoTab;