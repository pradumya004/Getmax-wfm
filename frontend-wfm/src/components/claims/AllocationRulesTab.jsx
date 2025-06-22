import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const assignmentModes = [
  { id: 'auto', name: 'Auto Assignment', description: 'AI-powered automatic distribution' },
  { id: 'manual', name: 'Manual Assignment', description: 'Manual claim distribution' },
  { id: 'hybrid', name: 'Hybrid Mode', description: 'Combination of auto and manual' }
];

const priorityRules = [
  'Aging (Days Outstanding)',
  'Denial Type Severity',
  'Payer Priority',
  'Claim Amount',
  'Client SLA Requirements'
];

const AllocationRulesTab = () => {
  const [assignmentMode, setAssignmentMode] = useState('auto');
  const { toast } = useToast();

  const handleAssignment = (mode) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-glass-dark border-[#39ff14]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#39ff14]" />
            <span>Assignment Mode</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure how claims are distributed to employees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignmentModes.map((mode) => (
            <div
              key={mode.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                assignmentMode === mode.id
                  ? 'border-[#39ff14] bg-[#39ff14]/10'
                  : 'border-[#39ff14]/20 hover:border-[#39ff14]/40'
              }`}
              onClick={() => setAssignmentMode(mode.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{mode.name}</h4>
                  <p className="text-sm text-gray-400">{mode.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  assignmentMode === mode.id
                    ? 'border-[#39ff14] bg-[#39ff14]'
                    : 'border-gray-400'
                }`} />
              </div>
            </div>
          ))}
          <Button 
            className="w-full bg-[#39ff14] text-black hover:bg-[#00ff88]"
            onClick={() => handleAssignment(assignmentMode)}
          >
            Apply Assignment Mode
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-glass-dark border-[#39ff14]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-[#39ff14]" />
            <span>Priority Rules</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure claim prioritization logic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {priorityRules.map((rule, index) => (
            <div key={rule} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-[#39ff14]/20">
              <div className="flex items-center space-x-3">
                <span className="text-[#39ff14] font-bold">#{index + 1}</span>
                <span className="text-white">{rule}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Configure
              </Button>
            </div>
          ))}
          <div className="pt-4">
            <h4 className="text-white font-medium mb-3">Floating Pool Logic</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-300">
                <input type="checkbox" className="rounded border-[#39ff14]/30" defaultChecked />
                <span className="text-sm">Enable overflow to floating pool</span>
              </label>
              <label className="flex items-center space-x-2 text-gray-300">
                <input type="checkbox" className="rounded border-[#39ff14]/30" />
                <span className="text-sm">Auto-redistribute from pool</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllocationRulesTab;