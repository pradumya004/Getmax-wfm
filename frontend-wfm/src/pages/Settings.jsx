import React from 'react';
import { Helmet } from 'react-helmet';
import { Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettingsTab from '@/components/settings/GeneralSettingsTab';
import PermissionsTab from '@/components/settings/PermissionsTab';
import SecurityTab from '@/components/settings/SecurityTab';
import BrandingTab from '@/components/settings/BrandingTab';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const title = "Settings";
  const { toast } = useToast();

  const handleSaveAll = () => {
    toast({
      title: "✅ Settings Saved",
      description: "All your changes have been saved successfully.",
      className: "bg-[#39ff14] text-black"
    });
  };

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content="Manage platform-wide configurations, user permissions, and system preferences." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-brand-green" />
              {title}
            </h1>
            <p className="text-gray-300">Manage platform-wide configurations and preferences.</p>
          </div>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green" onClick={handleSaveAll}>
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-black/20 border border-[#39ff14]/20">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-6">
            <GeneralSettingsTab />
          </TabsContent>
          <TabsContent value="permissions" className="mt-6">
            <PermissionsTab />
          </TabsContent>
          <TabsContent value="security" className="mt-6">
            <SecurityTab />
          </TabsContent>
          <TabsContent value="branding" className="mt-6">
            <BrandingTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;