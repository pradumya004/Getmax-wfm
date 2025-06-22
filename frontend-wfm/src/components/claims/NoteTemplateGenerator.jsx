import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/datepicker';
import { Textarea } from '@/components/ui/textarea';
import { FileText, DollarSign, ShieldAlert, AlertTriangle, CalendarDays } from 'lucide-react';

const NoteTemplateGenerator = ({ onNoteUpdate }) => {
  const [category, setCategory] = useState('');
  const [fields, setFields] = useState({});

  useEffect(() => {
    let note = '';
    switch (category) {
      case 'paid':
        note = `Claim paid in full. Amount: ${fields.paidAmount || '$0.00'}. Check #: ${fields.checkNumber || 'N/A'}. Paid Date: ${fields.paidDate ? new Date(fields.paidDate).toLocaleDateString() : 'N/A'}.`;
        break;
      case 'denied':
        note = `Claim denied. Reason: ${fields.denialReason || 'N/A'}. Next Action: ${fields.nextAction || 'N/A'}.`;
        break;
      case 'auth_denial':
        note = `Authorization denial. Auth #: ${fields.authNumber || 'N/A'}. Reason: ${fields.authReason || 'N/A'}. Contacted: ${fields.contactPerson || 'N/A'}.`;
        break;
      case 'inactive_policy':
        note = `Policy inactive. End Date: ${fields.policyEndDate ? new Date(fields.policyEndDate).toLocaleDateString() : 'N/A'}. New Payer Info: ${fields.newPayerInfo || 'N/A'}.`;
        break;
      default:
        note = '';
    }
    onNoteUpdate(note);
  }, [category, fields, onNoteUpdate]);

  const handleFieldChange = (field, value) => {
    setFields(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCategoryChange = (value) => {
    setCategory(value);
    setFields({});
  };

  const renderFields = () => {
    switch (category) {
      case 'paid':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 bg-black/10 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="paidAmount">Paid Amount</Label>
              <Input id="paidAmount" type="text" placeholder="$1,234.56" value={fields.paidAmount || ''} onChange={e => handleFieldChange('paidAmount', e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkNumber">Check Number</Label>
              <Input id="checkNumber" type="text" placeholder="CHK12345" value={fields.checkNumber || ''} onChange={e => handleFieldChange('checkNumber', e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidDate">Paid Date</Label>
              <DatePicker date={fields.paidDate} setDate={date => handleFieldChange('paidDate', date)} />
            </div>
          </div>
        );
      case 'denied':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-black/10 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="denialReason">Denial Reason</Label>
              <Select onValueChange={value => handleFieldChange('denialReason', value)}>
                <SelectTrigger id="denialReason" className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Select reason..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical Necessity">Medical Necessity</SelectItem>
                  <SelectItem value="Coding Error">Coding Error</SelectItem>
                  <SelectItem value="Non-covered service">Non-covered service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextAction">Next Action</Label>
              <Select onValueChange={value => handleFieldChange('nextAction', value)}>
                <SelectTrigger id="nextAction" className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Select action..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Appeal">Appeal</SelectItem>
                  <SelectItem value="Write-off">Write-off</SelectItem>
                  <SelectItem value="Correct and resubmit">Correct and resubmit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'auth_denial':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-black/10 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="authNumber">Auth Number</Label>
              <Input id="authNumber" type="text" placeholder="AUTH9876" value={fields.authNumber || ''} onChange={e => handleFieldChange('authNumber', e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" type="text" placeholder="Jane Doe @ Payer" value={fields.contactPerson || ''} onChange={e => handleFieldChange('contactPerson', e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="authReason">Reason for Denial</Label>
              <Textarea id="authReason" placeholder="Detailed reason..." value={fields.authReason || ''} onChange={e => handleFieldChange('authReason', e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
            </div>
          </div>
        );
      case 'inactive_policy':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-black/10 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="policyEndDate">Policy End Date</Label>
              <DatePicker date={fields.policyEndDate} setDate={date => handleFieldChange('policyEndDate', date)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPayerInfo">New Payer Info</Label>
              <Textarea id="newPayerInfo" placeholder="Enter new policy details..." value={fields.newPayerInfo || ''} onChange={e => handleFieldChange('newPayerInfo', e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="note-category" className="text-gray-300 flex items-center gap-2"><FileText className="h-4 w-4" />Note Category</Label>
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger id="note-category" className="bg-black/20 border-[#39ff14]/30">
            <SelectValue placeholder="Select a scenario to generate notes..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paid"><DollarSign className="inline-block mr-2 h-4 w-4" />Claim Paid</SelectItem>
            <SelectItem value="denied"><ShieldAlert className="inline-block mr-2 h-4 w-4" />Claim Denied</SelectItem>
            <SelectItem value="auth_denial"><AlertTriangle className="inline-block mr-2 h-4 w-4" />Auth Denial</SelectItem>
            <SelectItem value="inactive_policy"><CalendarDays className="inline-block mr-2 h-4 w-4" />Inactive Policy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderFields()}
    </div>
  );
};

export default NoteTemplateGenerator;