import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const serviceTypeOptions = [
  'AR Calling', 'Coding', 'Charges', 'Denial Management', 'Prior Authorization', 'Patient Billing', 'Appeals'
];

const Step2Services = ({ formData, updateFormData }) => {
  const handleServiceChange = (id, field, value) => {
    const updatedServices = formData.services.map(service =>
      service.id === id ? { ...service, [field]: value } : service
    );
    updateFormData({ services: updatedServices });
  };

  const addServiceRow = () => {
    const newId = formData.services.length > 0 ? Math.max(...formData.services.map(s => s.id)) + 1 : 1;
    updateFormData({
      services: [
        ...formData.services,
        { id: newId, serviceType: '', dailyTarget: '', qaBenchmark: '', employeesNeeded: '', sowRoleLabel: '' }
      ]
    });
  };

  const removeServiceRow = (id) => {
    if (formData.services.length > 1) {
      updateFormData({ services: formData.services.filter(service => service.id !== id) });
    }
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-white">Add Services & Benchmarks</CardTitle>
        <CardDescription className="text-gray-300">
          Define each SOW by adding services and setting performance benchmarks.
        </CardDescription>
      </CardHeader>
      
      <div className="space-y-4">
        {formData.services.map((service, index) => (
          <div key={service.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-black/20 rounded-lg border border-[#39ff14]/20 items-end">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-300 mb-1 block">Service Type</label>
              <Select value={service.serviceType} onValueChange={(value) => handleServiceChange(service.id, 'serviceType', value)}>
                <SelectTrigger className="bg-black/30 border-[#39ff14]/40 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {serviceTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">Daily Target</label>
              <Input type="number" value={service.dailyTarget} onChange={(e) => handleServiceChange(service.id, 'dailyTarget', e.target.value)} placeholder="e.g., 40" className="bg-black/30 border-[#39ff14]/40 text-white" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">QA %</label>
              <Input type="number" value={service.qaBenchmark} onChange={(e) => handleServiceChange(service.id, 'qaBenchmark', e.target.value)} placeholder="e.g., 95" className="bg-black/30 border-[#39ff14]/40 text-white" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block"># Emps</label>
              <Input type="number" value={service.employeesNeeded} onChange={(e) => handleServiceChange(service.id, 'employeesNeeded', e.target.value)} placeholder="e.g., 5" className="bg-black/30 border-[#39ff14]/40 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="destructive" size="icon" onClick={() => removeServiceRow(service.id)} disabled={formData.services.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="md:col-span-full">
               <label className="text-xs font-medium text-gray-300 mb-1 block">SOW Role Label</label>
                <Input value={service.sowRoleLabel} onChange={(e) => handleServiceChange(service.id, 'sowRoleLabel', e.target.value)} placeholder="e.g., AR Caller, Charge Analyst" className="bg-black/30 border-[#39ff14]/40 text-white" />
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="outline" onClick={addServiceRow}>
        <Plus className="h-4 w-4 mr-2" /> Add Another Service Row
      </Button>
    </div>
  );
};

export default Step2Services;