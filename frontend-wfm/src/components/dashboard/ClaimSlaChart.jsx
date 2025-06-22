import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  received: 100 + Math.floor(Math.random() * 50),
  breached: 5 + Math.floor(Math.random() * 10),
  closed: 90 + Math.floor(Math.random() * 40),
}));

const ClaimSlaChart = () => {
  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="text-[#39ff14]" />
          Claim Volume vs SLA Breach Rate
        </CardTitle>
        <CardDescription className="text-gray-400">Last 14 days performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(57, 255, 20, 0.1)" />
            <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#39ff14',
                color: '#fff',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Line type="monotone" dataKey="received" name="Received" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="closed" name="Closed" stroke="#39ff14" strokeWidth={2} />
            <Line type="monotone" dataKey="breached" name="Breached" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ClaimSlaChart;