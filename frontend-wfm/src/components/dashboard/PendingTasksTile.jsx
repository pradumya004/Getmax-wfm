import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileWarning } from 'lucide-react';

const tasks = [
  { text: '3 SLA tasks are overdue', icon: Clock, color: 'text-red-500' },
  { text: '12 claims are unassigned', icon: FileWarning, color: 'text-yellow-400' },
  { text: '5 claims pending QA for > 24h', icon: Clock, color: 'text-yellow-400' },
];

const PendingTasksTile = () => {
  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Clock className="text-[#39ff14]" />
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li key={index} className="flex items-start gap-3">
              <task.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${task.color}`} />
              <span className="text-sm text-white">{task.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PendingTasksTile;