import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const fieldTypeOptions = ['Dropdown', 'Paragraph', 'Short Text', 'Date', 'Number'];

const Step4IntakeFields = ({ formData, updateFormData }) => {
  const handleFieldChange = (id, field, value) => {
    const updatedFields = formData.intakeFields.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateFormData({ intakeFields: updatedFields });
  };

  const addFieldRow = () => {
    const newId = formData.intakeFields.length > 0 ? Math.max(...formData.intakeFields.map(f => f.id)) + 1 : 1;
    updateFormData({
      intakeFields: [
        ...formData.intakeFields,
        { id: newId, fieldLabel: '', fieldType: '', options: '' }
      ]
    });
  };

  const removeFieldRow = (id) => {
    if (formData.intakeFields.length > 1) {
      updateFormData({ intakeFields: formData.intakeFields.filter(item => item.id !== id) });
    }
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-white">Intake Fields Setup</CardTitle>
        <CardDescription className="text-gray-300">
          Configure custom input fields that will appear on the claim intake screen for every task.
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        {formData.intakeFields.map(field => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-black/20 rounded-lg border border-[#39ff14]/20 items-end">
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">Field Label</label>
              <Input value={field.fieldLabel} onChange={(e) => handleFieldChange(field.id, 'fieldLabel', e.target.value)} placeholder="e.g., Root Cause" className="bg-black/30 border-[#39ff14]/40 text-white" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">Field Type</label>
              <Select value={field.fieldType} onValueChange={(value) => handleFieldChange(field.id, 'fieldType', value)}>
                <SelectTrigger className="bg-black/30 border-[#39ff14]/40 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {fieldTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-300 mb-1 block">Options (if any)</label>
                <Input 
                  value={field.options} 
                  onChange={(e) => handleFieldChange(field.id, 'options', e.target.value)} 
                  placeholder="e.g., UHC / BCBS / Aetna" 
                  className="bg-black/30 border-[#39ff14]/40 text-white" 
                  disabled={field.fieldType !== 'Dropdown'}
                />
              </div>
              <Button variant="destructive" size="icon" onClick={() => removeFieldRow(field.id)} disabled={formData.intakeFields.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addFieldRow}>
        <Plus className="h-4 w-4 mr-2" /> Add Custom Field
      </Button>
    </div>
  );
};

export default Step4IntakeFields;