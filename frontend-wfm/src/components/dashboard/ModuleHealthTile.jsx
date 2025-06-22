import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

const modules = [
  { name: 'CRM', status: 'Operational' },
  { name: 'WFM', status: 'Operational' },
  { name: 'Claim Intake', status: 'Degraded Performance' },
  { name: 'QA Engine', status: 'Operational' },
];

const ModuleHealthTile = () => {
  const getStatusClass = (status) => {
    if (status === 'Operational') return 'bg-green-500';
    if (status === 'Degraded Performance') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <HeartPulse className="text-[#39ff14]" />
          Module Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {modules.map((module) => (
            <li key={module.name} className="flex items-center justify-between">
              <span className="text-sm text-white">{module.name}</span>
              <div className="flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', getStatusClass(module.status))}></div>
                <span className="text-xs text-gray-300">{module.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ModuleHealthTile;