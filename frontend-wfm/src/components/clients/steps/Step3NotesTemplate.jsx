import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const categoryNameOptions = ['Denial Reason', 'DX Hold', 'Appeal Stage', 'Follow-up Action', 'Patient Communication'];
const inputTypeOptions = ['Short Text', 'Paragraph', 'Dropdown', 'Button', 'Toggle'];

const Step3NotesTemplate = ({ formData, updateFormData }) => {
  const handleFieldChange = (id, field, value) => {
    const updatedTemplates = formData.notesTemplate.map(template =>
      template.id === id ? { ...template, [field]: value } : template
    );
    updateFormData({ notesTemplate: updatedTemplates });
  };

  const addFieldRow = () => {
    const newId = formData.notesTemplate.length > 0 ? Math.max(...formData.notesTemplate.map(t => t.id)) + 1 : 1;
    updateFormData({
      notesTemplate: [
        ...formData.notesTemplate,
        { id: newId, categoryName: '', noteInputType: '', placeholderLabel: '', mergeAsOutput: false }
      ]
    });
  };

  const removeFieldRow = (id) => {
    if (formData.notesTemplate.length > 1) {
      updateFormData({ notesTemplate: formData.notesTemplate.filter(template => template.id !== id) });
    }
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-white">Notes Template Configuration</CardTitle>
        <CardDescription className="text-gray-300">
          Set up standardized notes for operations and QA audits. This config will appear per SOW.
        </CardDescription>
      </CardHeader>
      
      <div className="space-y-4">
        {formData.notesTemplate.map(template => (
          <div key={template.id} className="grid grid-cols-1 md:grid-cols-10 gap-2 p-3 bg-black/20 rounded-lg border border-[#39ff14]/20 items-center">
            <div className="md:col-span-3">
              <label className="text-xs font-medium text-gray-300 mb-1 block">Category Name</label>
              <Select value={template.categoryName} onValueChange={(value) => handleFieldChange(template.id, 'categoryName', value)}>
                <SelectTrigger className="bg-black/30 border-[#39ff14]/40 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {categoryNameOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-300 mb-1 block">Note Input Type</label>
              <Select value={template.noteInputType} onValueChange={(value) => handleFieldChange(template.id, 'noteInputType', value)}>
                <SelectTrigger className="bg-black/30 border-[#39ff14]/40 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {inputTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-medium text-gray-300 mb-1 block">Placeholder Label</label>
              <Input value={template.placeholderLabel} onChange={(e) => handleFieldChange(template.id, 'placeholderLabel', e.target.value)} placeholder="e.g., Enter reason..." className="bg-black/30 border-[#39ff14]/40 text-white" />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs font-medium text-gray-300 mb-1 block">Merge?</label>
              <Switch checked={template.mergeAsOutput} onCheckedChange={(checked) => handleFieldChange(template.id, 'mergeAsOutput', checked)} />
            </div>
             <div className="flex items-center justify-end">
              <Button variant="destructive" size="icon" onClick={() => removeFieldRow(template.id)} disabled={formData.notesTemplate.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="outline" onClick={addFieldRow}>
        <Plus className="h-4 w-4 mr-2" /> Add More Fields
      </Button>
    </div>
  );
};

export default Step3NotesTemplate;