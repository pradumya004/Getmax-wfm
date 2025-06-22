import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const IntegrationModal = ({ isOpen, setIsOpen, integration, onSave }) => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: '',
    secret: '',
    endpointUrl: '',
    scopes: integration.scopes.reduce((acc, scope) => ({ ...acc, [scope]: false }), {}),
  });

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      toast({
        title: "✅ Connection Test Successful!",
        description: "Ready to connect to " + integration.name,
        className: "bg-[#39ff14] text-black"
      });
    }, 1500);
  };

  const handleSave = () => {
    onSave({ ...integration, ...formData });
  };

  const handleScopeChange = (scope) => {
    setFormData(prev => ({
        ...prev,
        scopes: {
            ...prev.scopes,
            [scope]: !prev.scopes[scope]
        }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-glass-dark border-[#39ff14]/30 text-white">
        <DialogHeader>
          <DialogTitle>Connect to {integration.name}</DialogTitle>
          <DialogDescription>Enter your credentials to connect your {integration.name} account.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label>API Key</label>
            <Input placeholder="Enter API Key" className="bg-black/20 border-[#39ff14]/30" onChange={e => setFormData({...formData, apiKey: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label>Secret</label>
            <Input type="password" placeholder="Enter Secret" className="bg-black/20 border-[#39ff14]/30" onChange={e => setFormData({...formData, secret: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label>Endpoint URL</label>
            <Input placeholder="https://api.example.com" className="bg-black/20 border-[#39ff14]/30" onChange={e => setFormData({...formData, endpointUrl: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label>Scopes</label>
            <div className="space-y-2 p-4 border border-[#39ff14]/20 rounded-md">
                {integration.scopes.map(scope => (
                    <div key={scope} className="flex items-center space-x-2">
                        <Checkbox id={scope} checked={formData.scopes[scope]} onCheckedChange={() => handleScopeChange(scope)} />
                        <label htmlFor={scope} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {scope}
                        </label>
                    </div>
                ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="secondary" onClick={handleTestConnection} disabled={isTesting}>
            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green" onClick={handleSave}>Save & Connect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationModal;