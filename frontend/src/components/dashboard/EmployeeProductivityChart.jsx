// EmployeeProductivityChart.js - Fixed for dashboard integration
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Award, TrendingUp } from 'lucide-react';

const productivityData = [
  { name: 'Priya R.', tasks: 125, rank: 1 },
  { name: 'John T.', tasks: 110, rank: 2 },
  { name: 'Mike L.', tasks: 105, rank: 3 },
  { name: 'Sarah J.', tasks: 98, rank: 4 },
  { name: 'David C.', tasks: 95, rank: 5 },
];

const barColors = [
  '#fbbf24', // Gold for 1st place
  '#c0c0c0', // Silver for 2nd place  
  '#cd7f32', // Bronze for 3rd place
  '#60a5fa', // Blue for 4th place
  '#a78bfa', // Purple for 5th place
];

const EmployeeProductivityChart = () => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-md border border-purple-400/50 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {data.rank === 1 && <Award className="w-4 h-4 text-yellow-400" />}
              {data.rank === 2 && <Award className="w-4 h-4 text-gray-300" />}
              {data.rank === 3 && <Award className="w-4 h-4 text-amber-600" />}
              {data.rank > 3 && <TrendingUp className="w-4 h-4 text-blue-400" />}
              <span className="text-white font-medium">{label}</span>
            </div>
          </div>
          <div className="text-cyan-200">
            <span className="font-semibold text-lg">{payload[0].value}</span> tasks completed
          </div>
          <div className="text-purple-300 text-xs mt-1">
            Rank #{data.rank} this week
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 h-full">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            <Users className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Employee Productivity
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" />
          <p className="text-blue-200/80 text-sm">
            Top 5 performers this week
          </p>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={productivityData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="rgba(255, 255, 255, 0.8)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              width={70}
              tick={{ fill: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(147, 51, 234, 0.1)' }}
              content={<CustomTooltip />}
            />
            <Bar 
              dataKey="tasks" 
              radius={[0, 6, 6, 0]} 
              barSize={28}
            >
              {productivityData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={barColors[index]}
                  style={{
                    filter: `drop-shadow(0 4px 8px ${barColors[index]}40)`,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Performance Summary - Compact Version */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-200 text-xs font-medium">Top</span>
            </div>
            <div className="text-white font-bold text-sm">Priya R.</div>
            <div className="text-yellow-300 text-xs">125 Tasks</div>
          </div>
          
          <div className="text-center p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30">
            <div className="text-cyan-200 text-xs font-medium mb-1">Average</div>
            <div className="text-white font-bold text-sm">106.6</div>
            <div className="text-cyan-300 text-xs">Tasks/Week</div>
          </div>
          
          <div className="text-center p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-400/30">
            <div className="text-purple-200 text-xs font-medium mb-1">Total</div>
            <div className="text-white font-bold text-sm">533</div>
            <div className="text-purple-300 text-xs">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProductivityChart;