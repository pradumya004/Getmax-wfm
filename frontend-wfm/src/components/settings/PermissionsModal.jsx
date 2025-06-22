import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const allPermissions = [
  { id: 'viewClients', label: 'View Clients' },
  { id: 'editClients', label: 'Edit Clients' },
  { id: 'viewClaims', label: 'View Claims' },
  { id: 'editClaims', label: 'Edit Claims' },
  { id: 'viewRevenueDashboard', label: 'View Revenue Dashboard' },
  { id: 'accessSettings', label: 'Access Settings' },
  { id: 'modifyIntegrations', label: 'Modify Integrations' },
  { id: 'accessReports', label: 'Access Reports' },
  { id: 'createSOW', label: 'SOW Creation' },
  { id: 'accessQADashboard', label: 'QA Dashboard' },
];

const PermissionsModal = ({ isOpen, setIsOpen, role }) => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState(
    allPermissions.reduce((acc, p) => ({ ...acc, [p.id]: role.name === 'Super Admin' ? true : Math.random() > 0.5 }), {})
  );

  const handlePermissionChange = (id, value) => {
    setPermissions(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    toast({
      title: `Permissions Updated for ${role.name}`,
      description: 'The changes have been saved successfully.',
      className: "bg-[#39ff14] text-black"
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-glass-dark border-[#39ff14]/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Permissions for {role.name}</DialogTitle>
          <DialogDescription>Enable or disable access to different modules for this role.</DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin pr-2">
          {allPermissions.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-[#39ff14]/10 p-3">
              <Label htmlFor={p.id} className="text-white">{p.label}</Label>
              <Switch
                id={p.id}
                checked={permissions[p.id]}
                onCheckedChange={(v) => handlePermissionChange(p.id, v)}
                disabled={role.name === 'Super Admin'}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green" onClick={handleSave}>Save Permissions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsModal;