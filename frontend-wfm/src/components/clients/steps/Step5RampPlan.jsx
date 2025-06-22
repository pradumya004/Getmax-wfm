import React, { useEffect } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Step5RampPlan = ({ formData, updateFormData }) => {
  const { dailyClaimVolume } = formData;
  
  useEffect(() => {
    const daily = parseFloat(dailyClaimVolume) || 0;
    const monthly = (daily * 21).toLocaleString(); // Assuming 21 working days
    const annual = (daily * 252).toLocaleString(); // Assuming 252 working days
    updateFormData({ monthlyVolume: monthly, annualVolume: annual });
  }, [dailyClaimVolume]);

  const handleInputChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-white">Ramp Plan & Volume Forecast</CardTitle>
        <CardDescription className="text-gray-300">
          Provide volume forecasts for FTE planning and resource allocation.
        </CardDescription>
      </CardHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Daily Claim Volume *</label>
          <Input name="dailyClaimVolume" value={formData.dailyClaimVolume} onChange={handleInputChange} type="number" placeholder="e.g., 200" className="bg-black/20 border-[#39ff14]/30 text-white" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Monthly Volume (Auto)</label>
          <Input name="monthlyVolume" value={formData.monthlyVolume} readOnly placeholder="Auto-calculated" className="bg-black/20 border-gray-600 text-gray-400" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Annual Volume (Auto)</label>
          <Input name="annualVolume" value={formData.annualVolume} readOnly placeholder="Auto-calculated" className="bg-black/20 border-gray-600 text-gray-400" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Ideal Team Size *</label>
          <Input name="idealTeamSize" value={formData.idealTeamSize} onChange={handleInputChange} type="number" placeholder="e.g., 10" className="bg-black/20 border-[#39ff14]/30 text-white" />
        </div>
         <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Backup Ratio % *</label>
          <Input name="backupRatio" value={formData.backupRatio} onChange={handleInputChange} type="number" placeholder="e.g., 10" className="bg-black/20 border-[#39ff14]/30 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Step5RampPlan;