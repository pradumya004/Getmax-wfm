import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, CheckCircle, User, FileWarning } from 'lucide-react';

const SLASummaryCard = ({ data }) => {
  const summary = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalClaims: 0,
        breachesToday: 0,
        avgCompliance: 0,
        mostActiveEmployee: 'N/A',
        mostDelayedSOW: 'N/A',
      };
    }

    const breachesToday = data.filter(d => d.status === 'Breached' && new Date(d.importedDate).toDateString() === new Date().toDateString()).length;
    const avgCompliance = data.reduce((acc, curr) => acc + curr.slaPercentage, 0) / data.length;

    const employeeCounts = data.reduce((acc, curr) => {
      acc[curr.employee] = (acc[curr.employee] || 0) + 1;
      return acc;
    }, {});
    const mostActiveEmployee = Object.keys(employeeCounts).reduce((a, b) => employeeCounts[a] > employeeCounts[b] ? a : b, 'N/A');

    const sowDelays = data.filter(d => d.status === 'Breached').reduce((acc, curr) => {
      acc[curr.taskType] = (acc[curr.taskType] || 0) + 1;
      return acc;
    }, {});
    const mostDelayedSOW = Object.keys(sowDelays).reduce((a, b) => sowDelays[a] > sowDelays[b] ? a : b, 'N/A');

    return {
      totalClaims: data.length,
      breachesToday,
      avgCompliance: avgCompliance.toFixed(1),
      mostActiveEmployee,
      mostDelayedSOW,
    };
  }, [data]);

  const stats = [
    { label: 'Total Claims', value: summary.totalClaims, icon: FileText },
    { label: 'Breaches Today', value: summary.breachesToday, icon: AlertTriangle },
    { label: 'Avg SLA Compliance', value: `${summary.avgCompliance}%`, icon: CheckCircle },
    { label: 'Most Active Employee', value: summary.mostActiveEmployee, icon: User },
    { label: 'Most Delayed SOW', value: summary.mostDelayedSOW, icon: FileWarning },
  ];

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <CardTitle className="text-white">Live SLA Stats</CardTitle>
        <CardDescription className="text-gray-300">Real-time performance overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map(stat => (
          <div key={stat.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <stat.icon className="h-5 w-5 text-[#39ff14]" />
              <span className="text-sm text-gray-300">{stat.label}</span>
            </div>
            <span className="font-semibold text-white">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SLASummaryCard;