import React from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const QASLATab = ({ data, onChange }) => {
  const { toast } = useToast();

  const handleFreezeTrigger = () => {
    toast({
      title: "🚧 Feature Not Implemented",
      description: "Configuring freeze triggers is not yet available.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
      <div className="space-y-2">
        <label>QA % Benchmark</label>
        <Input
          type="number"
          value={data.qaBenchmark || ''}
          onChange={(e) => onChange('qaBenchmark', parseInt(e.target.value))}
          className="bg-black/20 border-[#39ff14]/30"
        />
      </div>
      <div className="space-y-2">
        <label>SLA TAT (Hours)</label>
        <Input
          type="number"
          value={data.slaTat || ''}
          onChange={(e) => onChange('slaTat', parseInt(e.target.value))}
          className="bg-black/20 border-[#39ff14]/30"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label>Freeze Triggers (Optional)</label>
        <Button variant="outline" className="w-full" onClick={handleFreezeTrigger}>
          Configure Freeze Triggers
        </Button>
      </div>
    </div>
  );
};

export default QASLATab;