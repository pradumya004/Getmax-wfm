import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, UserX } from 'lucide-react';

const mockAlerts = [
  { text: 'Team below SLA in 2 clients this week', icon: AlertTriangle, color: 'text-yellow-400' },
  { text: 'Revenue per coder up by 14% this month', icon: TrendingUp, color: 'text-green-400' },
  { text: 'Overload: 3 AR agents assigned >60 claims daily', icon: UserX, color: 'text-red-500' },
];

const AlertsWidget = () => {
  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">Alerts & Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {mockAlerts.map((alert, index) => (
            <li key={index} className="flex items-start gap-3">
              <alert.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${alert.color}`} />
              <span className="text-sm text-white">{alert.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AlertsWidget;