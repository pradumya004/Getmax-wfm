import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotesTemplateTab = ({ data, onChange }) => {
  const { toast } = useToast();
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ category: '', type: '', placeholder: '' });

  const addField = () => {
    if (!newField.category || !newField.type) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please select a category and type for the new field.",
        variant: "destructive",
      });
      return;
    }
    setFields([...fields, { ...newField, id: Date.now() }]);
    setNewField({ category: '', type: '', placeholder: '' });
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6 p-1">
      <div className="border border-[#39ff14]/20 rounded-lg p-4 bg-black/10 space-y-4">
        <h4 className="text-white font-medium">Add Dynamic Notes Field</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={newField.category} onValueChange={(v) => setNewField(p => ({ ...p, category: v }))}>
            <SelectTrigger className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Denial Reason">Denial Reason</SelectItem>
              <SelectItem value="Appeal Stage">Appeal Stage</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newField.type} onValueChange={(v) => setNewField(p => ({ ...p, type: v }))}>
            <SelectTrigger className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Input Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Short Text">Short Text</SelectItem>
              <SelectItem value="Paragraph">Paragraph</SelectItem>
              <SelectItem value="Dropdown">Dropdown</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={newField.placeholder}
            onChange={(e) => setNewField(p => ({ ...p, placeholder: e.target.value }))}
            placeholder="Placeholder Label"
            className="bg-black/20 border-[#39ff14]/30"
          />
        </div>
        <Button onClick={addField} className="bg-[#39ff14] text-black hover:bg-[#00ff88]">Add Field</Button>
      </div>
      <div className="space-y-2">
        <h4 className="text-white font-medium">Configured Fields</h4>
        {fields.length === 0 ? (
          <p className="text-gray-400 text-sm">No custom note fields added yet.</p>
        ) : (
          fields.map(field => (
            <div key={field.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-[#39ff14]/10">
              <div>
                <p className="text-white">{field.category}: <span className="font-light">{field.placeholder}</span></p>
                <p className="text-xs text-[#39ff14]">{field.type}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesTemplateTab;