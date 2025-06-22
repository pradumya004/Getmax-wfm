import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

const data = [
  { name: 'Priya R.', tasks: 125 },
  { name: 'John T.', tasks: 110 },
  { name: 'Mike L.', tasks: 105 },
  { name: 'Sarah J.', tasks: 98 },
  { name: 'David C.', tasks: 95 },
];

const EmployeeProductivityChart = () => {
  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="text-[#39ff14]" />
          Employee Productivity Ranking
        </CardTitle>
        <CardDescription className="text-gray-400">Top 5 performers by tasks completed this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <Tooltip
              cursor={{ fill: 'rgba(57, 255, 20, 0.1)' }}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#39ff14',
                color: '#fff',
              }}
            />
            <Bar dataKey="tasks" fill="#39ff14" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmployeeProductivityChart;