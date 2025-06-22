import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BrandingTab = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    primaryColor: '#39ff14',
    sidebarTheme: 'dark',
    accentStyle: 'rounded',
    fontPreference: 'Inter',
    logoUrl: '',
    faviconUrl: '',
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
        <CardTitle className="text-white">Branding & Theme</CardTitle>
        <CardDescription className="text-gray-400">Customize the look and feel of the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Logo & Favicon</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-black/20 rounded-md flex items-center justify-center border border-dashed border-[#39ff14]/30">
                <img  alt="Company Logo Preview" className="object-contain h-full w-full" src="https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a" />
              </div>
              <div className="w-10 h-10 bg-black/20 rounded-md flex items-center justify-center border border-dashed border-[#39ff14]/30">
                <img  alt="Favicon Preview" className="object-contain h-full w-full" src="https://images.unsplash.com/photo-1684577088653-f14e310d841b" />
              </div>
              <Button variant="outline" className="border-[#39ff14]/30 text-white hover:bg-[#39ff14]/10" onClick={handleUpload}>
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryColor" className="text-gray-300">Primary Color</Label>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md border border-[#39ff14]/30" style={{ backgroundColor: settings.primaryColor }}></div>
              <Input id="primaryColor" value={settings.primaryColor} onChange={(e) => handleInputChange('primaryColor', e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sidebarTheme" className="text-gray-300">Sidebar Theme</Label>
            <Select value={settings.sidebarTheme} onValueChange={(v) => handleInputChange('sidebarTheme', v)}>
              <SelectTrigger id="sidebarTheme" className="bg-black/20 border-[#39ff14]/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentStyle" className="text-gray-300">Accent Style</Label>
            <Select value={settings.accentStyle} onValueChange={(v) => handleInputChange('accentStyle', v)}>
              <SelectTrigger id="accentStyle" className="bg-black/20 border-[#39ff14]/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fontPreference" className="text-gray-300">Font Preference</Label>
            <Select value={settings.fontPreference} onValueChange={(v) => handleInputChange('fontPreference', v)}>
              <SelectTrigger id="fontPreference" className="bg-black/20 border-[#39ff14]/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="System">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingTab;