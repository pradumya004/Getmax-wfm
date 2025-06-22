import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const KpiCard = ({ title, data }) => {
  const { value, color, icon: Icon } = data;

  const colorClasses = {
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-500',
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 hover-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", colorClasses[color])} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", colorClasses[color])}>{value}</div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;