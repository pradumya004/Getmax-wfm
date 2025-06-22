import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LineChart as LineIcon, BarChart3 as BarIcon } from 'lucide-react';

const mockChartData = Array.from({ length: 15 }, (_, i) => {
  const date = new Date(2025, 5, i + 1);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    completed: 60 + Math.floor(Math.random() * 40),
    qaPassed: 92 + Math.random() * 7,
  };
});

const ProductivityTrendChart = () => {
  const [chartType, setChartType] = useState('line');

  const ChartComponent = chartType === 'line' ? LineChart : BarChart;
  const ChartElement = chartType === 'line' ? Line : Bar;

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">Productivity vs QA Accuracy</CardTitle>
            <CardDescription className="text-gray-400">Last 15 Days Trend</CardDescription>
          </div>
          <div className="flex items-center bg-black/20 border border-[#39ff14]/30 rounded-lg p-1">
            <Button
              variant="ghost" size="icon"
              className={cn( 'h-8 w-8', chartType === 'line' && 'bg-[#39ff14] text-black hover:bg-[#39ff14]')}
              onClick={() => setChartType('line')}
            ><LineIcon className="h-4 w-4" /></Button>
            <Button
              variant="ghost" size="icon"
              className={cn('h-8 w-8', chartType === 'bar' && 'bg-[#39ff14] text-black hover:bg-[#39ff14]')}
              onClick={() => setChartType('bar')}
            ><BarIcon className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ChartComponent data={mockChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(57, 255, 20, 0.1)" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[90, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#39ff14',
                color: '#fff',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <ChartElement yAxisId="left" type="monotone" dataKey="completed" name="Tasks Completed" fill="#39ff14" stroke="#39ff14" />
            <ChartElement yAxisId="right" type="monotone" dataKey="qaPassed" name="QA Passed %" fill="#8884d8" stroke="#8884d8" />
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProductivityTrendChart;