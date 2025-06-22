import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const CustomReportBuilder = ({ options, setOptions }) => {
  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const reportOptions = [
    { key: 'includeEmployeeBreakdown', label: 'Include Employee Breakdown', description: 'Add role-wise performance breakdown.' },
    { key: 'includeQAAccuracy', label: 'Include QA Accuracy', description: 'Include audit scores and error types.' },
    { key: 'includeRevenueInsights', label: 'Include Revenue Insights', description: 'Add revenue and cost metrics (Admin only).' },
  ];

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <CardTitle className="text-white">Custom Report Builder</CardTitle>
        <CardDescription className="text-gray-400">Toggle fields to include in your custom report.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reportOptions.map(option => (
          <div key={option.key} className="flex items-center justify-between rounded-lg border border-[#39ff14]/10 p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium text-white">{option.label}</label>
              <p className="text-sm text-gray-400">{option.description}</p>
            </div>
            <Switch
              checked={options[option.key]}
              onCheckedChange={(v) => handleOptionChange(option.key, v)}
              className="data-[state=checked]:bg-[#39ff14]"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CustomReportBuilder;