import React from 'react';
import { Input } from '@/components/ui/input';

const TargetsTab = ({ data, onChange }) => {
  const monthlyVolume = (data.dailyVolume || 0) * 30;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
      <div className="space-y-2">
        <label>Daily Claim Volume</label>
        <Input
          type="number"
          value={data.dailyVolume || ''}
          onChange={(e) => onChange('dailyVolume', parseInt(e.target.value))}
          className="bg-black/20 border-[#39ff14]/30"
        />
      </div>
      <div className="space-y-2">
        <label>Monthly Volume Estimate</label>
        <Input
          type="text"
          value={monthlyVolume}
          readOnly
          className="bg-black/30 border-gray-700 text-gray-400"
        />
      </div>
      <div className="space-y-2">
        <label>Employees Needed</label>
        <Input
          type="number"
          value={data.employeesNeeded || ''}
          onChange={(e) => onChange('employeesNeeded', parseInt(e.target.value))}
          className="bg-black/20 border-[#39ff14]/30"
        />
      </div>
      <div className="space-y-2">
        <label>Backup Ratio (%)</label>
        <Input
          type="number"
          value={data.backupRatio || ''}
          onChange={(e) => onChange('backupRatio', parseInt(e.target.value))}
          className="bg-black/20 border-[#39ff14]/30"
        />
      </div>
    </div>
  );
};

export default TargetsTab;