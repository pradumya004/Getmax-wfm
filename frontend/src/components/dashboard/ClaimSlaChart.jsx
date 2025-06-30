import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { day: 'Day 1', received: 45, closed: 42, breached: 3 },
  { day: 'Day 2', received: 52, closed: 48, breached: 4 },
  { day: 'Day 3', received: 38, closed: 36, breached: 2 },
  { day: 'Day 4', received: 61, closed: 55, breached: 6 },
  { day: 'Day 5', received: 49, closed: 47, breached: 2 },
  { day: 'Day 6', received: 43, closed: 40, breached: 3 },
  { day: 'Day 7', received: 57, closed: 52, breached: 5 },
  { day: 'Day 8', received: 34, closed: 33, breached: 1 },
  { day: 'Day 9', received: 48, closed: 45, breached: 3 },
  { day: 'Day 10', received: 55, closed: 51, breached: 4 },
  { day: 'Day 11', received: 42, closed: 40, breached: 2 },
  { day: 'Day 12', received: 58, closed: 53, breached: 5 },
  { day: 'Day 13', received: 46, closed: 44, breached: 2 },
  { day: 'Day 14', received: 51, closed: 48, breached: 3 }
];

const ClaimSlaChart = () => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-full">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Claim Volume vs SLA Breach Rate
          </h3>
        </div>
        <p className="text-blue-200/80 text-sm">
          Last 14 days performance analytics
        </p>
      </div>
      
      <div className="px-6 pb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.1)" 
              strokeOpacity={0.3}
            />
            <XAxis 
              dataKey="day" 
              stroke="rgba(255, 255, 255, 0.7)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.7)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.5)',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)',
              }}
              labelStyle={{ color: '#e0e7ff' }}
            />
            <Legend 
              wrapperStyle={{ 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.9)',
                paddingTop: '15px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="received" 
              name="Received" 
              stroke="#60a5fa" 
              strokeWidth={3}
              dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="closed" 
              name="Closed" 
              stroke="#34d399" 
              strokeWidth={3}
              dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="breached" 
              name="Breached" 
              stroke="#f87171" 
              strokeWidth={3}
              dot={{ fill: '#f87171', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClaimSlaChart;