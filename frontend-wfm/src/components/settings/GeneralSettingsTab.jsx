import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const GeneralSettingsTab = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    companyName: 'GetMax BET RCM',
    timeZone: 'IST',
    currency: 'INR',
    fiscalYearStart: new Date(),
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    logoUrl: ''
  });

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUpload = () => {
    toast({
      title: '🚧 Feature Not Implemented',
      description: 'File upload functionality is not yet available.',
    });
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <CardTitle className="text-white">General Settings</CardTitle>
        <CardDescription className="text-gray-400">Manage basic company and platform settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
            <Input id="companyName" value={settings.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeZone" className="text-gray-300">Time Zone</Label>
            <Select value={settings.timeZone} onValueChange={(v) => handleInputChange('timeZone', v)}>
              <SelectTrigger id="timeZone" className="bg-black/20 border-[#39ff14]/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="IST">IST (India Standard Time)</SelectItem>
                <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-gray-300">Default Currency</Label>
            <Select value={settings.currency} onValueChange={(v) => handleInputChange('currency', v)}>
              <SelectTrigger id="currency" className="bg-black/20 border-[#39ff14]/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="AED">AED (د.إ)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fiscalYearStart" className="text-gray-300">Fiscal Year Start</Label>
            <DatePicker id="fiscalYearStart" date={settings.fiscalYearStart} setDate={(d) => handleInputChange('fiscalYearStart', d)} className="bg-black/20 border-[#39ff14]/30 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <Label className="text-gray-300">Enable Notifications</Label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="emailNotifications" checked={settings.emailNotifications} onCheckedChange={(c) => handleInputChange('emailNotifications', c)} />
              <Label htmlFor="emailNotifications">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="smsNotifications" checked={settings.smsNotifications} onCheckedChange={(c) => handleInputChange('smsNotifications', c)} />
              <Label htmlFor="smsNotifications">SMS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="whatsappNotifications" checked={settings.whatsappNotifications} onCheckedChange={(c) => handleInputChange('whatsappNotifications', c)} />
              <Label htmlFor="whatsappNotifications">WhatsApp</Label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Company Logo</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-black/20 rounded-md flex items-center justify-center border border-dashed border-[#39ff14]/30">
              <img  alt="Company Logo Preview" className="object-contain h-full w-full" src="https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a" />
            </div>
            <Button variant="outline" className="border-[#39ff14]/30 text-white hover:bg-[#39ff14]/10" onClick={handleUpload}>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;