import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';

const mockRevenueData = [
  { label: 'Gross Monthly Revenue', value: '₹9,80,000' },
  { label: 'Avg Cost per FTE', value: '₹48,000' },
  { label: 'Revenue per Claim', value: '₹68.30' },
  { label: 'Net Margin (%)', value: '41.2%' },
];

const RevenueInsights = () => {
  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">Revenue Insights</CardTitle>
        <IndianRupee className="h-5 w-5 text-green-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRevenueData.map(item => (
            <div key={item.label} className="flex justify-between items-baseline">
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="text-lg font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueInsights;