import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

const TaskRulesTab = ({ data, onChange }) => {
  const handleStatusChange = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      onChange('allowedStatuses', [...(data.allowedStatuses || []), e.target.value]);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between rounded-lg border border-[#39ff14]/20 p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Auto Assignment</label>
          <p className="text-sm text-gray-400">Automatically assign tasks to available employees.</p>
        </div>
        <Switch
          checked={data.autoAssignment}
          onCheckedChange={(v) => onChange('autoAssignment', v)}
          className="data-[state=checked]:bg-[#39ff14]"
        />
      </div>
      <div className="space-y-2">
        <label>Allowed Claim Statuses</label>
        <p className="text-sm text-gray-400">Press Enter to add a status.</p>
        <Input
          placeholder="e.g., Open, Follow-up"
          onKeyDown={handleStatusChange}
          className="bg-black/20 border-[#39ff14]/30"
        />
        <div className="flex flex-wrap gap-2 pt-2">
          {(data.allowedStatuses || []).map(status => (
            <span key={status} className="bg-[#39ff14]/20 text-[#39ff14] text-xs font-medium px-2.5 py-1 rounded-full">
              {status}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskRulesTab;