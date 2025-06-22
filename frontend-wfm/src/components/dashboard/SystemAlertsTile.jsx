import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, DatabaseZap, CopyX } from 'lucide-react';

const alerts = [
  { text: 'API Error: EHR connection failed', icon: DatabaseZap, color: 'text-red-500' },
  { text: 'Duplicate Claim #C-13457 detected', icon: CopyX, color: 'text-yellow-400' },
  { text: 'High CPU usage on worker node', icon: AlertTriangle, color: 'text-yellow-400' },
];

const SystemAlertsTile = () => {
  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <AlertTriangle className="text-[#39ff14]" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {alerts.map((alert, index) => (
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

export default SystemAlertsTile;