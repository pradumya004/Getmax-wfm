import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Timer, ShieldCheck, Package, RefreshCw, Star, Award, TrendingUp } from 'lucide-react';

const icons = [
  { name: 'Timer', component: Timer },
  { name: 'ShieldCheck', component: ShieldCheck },
  { name: 'Package', component: Package },
  { name: 'RefreshCw', component: RefreshCw },
  { name: 'Star', component: Star },
  { name: 'Award', component: Award },
  { name: 'TrendingUp', component: TrendingUp },
];

const initialFormState = {
  name: '',
  icon: 'ShieldCheck',
  module: 'QA Audit',
  condition: '',
  duration: '',
  xpPoints: 0,
  repeatAllowed: false,
};

const BadgeRuleModal = ({ isOpen, setIsOpen, rule, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (rule) {
      setFormData({ ...rule, triggerLogic: undefined });
    } else {
      setFormData(initialFormState);
    }
  }, [rule, isOpen]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleNumericChange = (key, value) => {
    const number = parseInt(value, 10);
    setFormData(prev => ({ ...prev, [key]: isNaN(number) ? 0 : number }));
  };

  const handleSubmit = () => {
    // A simple way to generate the triggerLogic text for display
    const triggerLogic = `${formData.module} ${formData.condition} for ${formData.duration}`;
    onSave({ ...formData, triggerLogic });
  };

  const SelectedIcon = icons.find(i => i.name === formData.icon)?.component || ShieldCheck;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-glass-dark border-[#39ff14]/30 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Badge Rule' : 'Add New Badge Rule'}</DialogTitle>
          <DialogDescription>
            Configure the logic that will automatically award this badge to employees.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="badge-name">Badge Name</Label>
              <Input id="badge-name" value={formData.name} onChange={e => handleChange('name', e.target.value)} maxLength="20" className="bg-black/20 border-[#39ff14]/30"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge-icon">Badge Icon</Label>
              <Select value={formData.icon} onValueChange={value => handleChange('icon', value)}>
                <SelectTrigger id="badge-icon" className="bg-black/20 border-[#39ff14]/30">
                  <div className="flex items-center gap-2">
                    <SelectedIcon className="h-5 w-5" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {icons.map(({ name, component: IconComponent }) => (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <span>{name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="trigger-module">Trigger Module</Label>
              <Select value={formData.module} onValueChange={value => handleChange('module', value)}>
                <SelectTrigger id="trigger-module" className="bg-black/20 border-[#39ff14]/30">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="SLA Timer">SLA Timer</SelectItem>
                    <SelectItem value="QA Audit">QA Audit</SelectItem>
                    <SelectItem value="Claim Intake">Claim Intake</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition-type">Condition</Label>
              <Input id="condition-type" placeholder="e.g. > 95% or < 80 to > 95" value={formData.condition} onChange={e => handleChange('condition', e.target.value)} className="bg-black/20 border-[#39ff14]/30"/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="trigger-duration">Trigger Duration</Label>
              <Input id="trigger-duration" placeholder="e.g. 30 days or 2 weeks" value={formData.duration} onChange={e => handleChange('duration', e.target.value)} className="bg-black/20 border-[#39ff14]/30"/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <Label htmlFor="xp-points">XP Points Awarded</Label>
              <Input id="xp-points" type="number" value={formData.xpPoints} onChange={e => handleNumericChange('xpPoints', e.target.value)} className="bg-black/20 border-[#39ff14]/30"/>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch id="repeat-logic" checked={formData.repeatAllowed} onCheckedChange={value => handleChange('repeatAllowed', value)} />
              <Label htmlFor="repeat-logic">Allow badge to be earned multiple times?</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green" onClick={handleSubmit}>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeRuleModal;