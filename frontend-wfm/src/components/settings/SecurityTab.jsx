import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SecurityTab = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    twoFactorEnabled: true,
    twoFactorMethod: 'SMS',
    sessionTimeout: '1hr',
    gdprHipaaMode: false,
    passwordResetFrequency: '90days',
  });

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDownloadLogs = () => {
    toast({
      title: '🚧 Feature Not Implemented',
      description: 'Downloading audit trail logs is not yet available.',
    });
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <CardTitle className="text-white">Security & Compliance</CardTitle>
        <CardDescription className="text-gray-400">Manage security protocols and compliance settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-[#39ff14]/10 p-4">
          <div>
            <Label className="text-base font-medium text-white">Enable Two-Factor Authentication (2FA)</Label>
            <p className="text-sm text-gray-400">Add an extra layer of security to user accounts.</p>
          </div>
          <Switch checked={settings.twoFactorEnabled} onCheckedChange={(v) => handleInputChange('twoFactorEnabled', v)} />
        </div>
        {settings.twoFactorEnabled && (
          <div className="pl-4">
            <Label htmlFor="2faMethod" className="text-gray-300">2FA Method</Label>
            <Select value={settings.twoFactorMethod} onValueChange={(v) => handleInputChange('twoFactorMethod', v)}>
              <SelectTrigger id="2faMethod" className="bg-black/20 border-[#39ff14]/30 w-full md:w-1/2 mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Authenticator">Authenticator App</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="sessionTimeout" className="text-gray-300">Session Timeout</Label>
          <Select value={settings.sessionTimeout} onValueChange={(v) => handleInputChange('sessionTimeout', v)}>
            <SelectTrigger id="sessionTimeout" className="bg-black/20 border-[#39ff14]/30 w-full md:w-1/2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30min">30 Minutes</SelectItem>
              <SelectItem value="1hr">1 Hour</SelectItem>
              <SelectItem value="2hr">2 Hours</SelectItem>
              <SelectItem value="8hr">8 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="passwordReset" className="text-gray-300">Password Reset Frequency</Label>
          <Select value={settings.passwordResetFrequency} onValueChange={(v) => handleInputChange('passwordResetFrequency', v)}>
            <SelectTrigger id="passwordReset" className="bg-black/20 border-[#39ff14]/30 w-full md:w-1/2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Every 30 Days</SelectItem>
              <SelectItem value="60days">Every 60 Days</SelectItem>
              <SelectItem value="90days">Every 90 Days</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-[#39ff14]/10 p-4">
          <div>
            <Label className="text-base font-medium text-white">GDPR / HIPAA Mode</Label>
            <p className="text-sm text-gray-400">Enable stricter data privacy and logging controls.</p>
          </div>
          <Switch checked={settings.gdprHipaaMode} onCheckedChange={(v) => handleInputChange('gdprHipaaMode', v)} />
        </div>
        <div>
          <Label className="text-gray-300">Audit Trail Logs</Label>
          <div className="flex items-center gap-4 mt-2">
            <Button variant="outline" className="border-[#39ff14]/30 text-white hover:bg-[#39ff14]/10" onClick={handleDownloadLogs}>
              <Download className="h-4 w-4 mr-2" />
              Download Logs
            </Button>
            <p className="text-sm text-gray-400">Download a complete log of all system activities.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;