import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';

const ActivityLog = ({ logs, onDisconnect }) => {
  const { toast } = useToast();

  const handleAction = (log) => {
    if (log.status === 'Active') {
      const serviceId = log.service.toLowerCase().replace(/ /g, '_').replace('ehr', '').trim();
      onDisconnect(serviceId);
    } else {
      toast({
        title: '🚧 Retry Action',
        description: `Retrying connection for ${log.service} is not yet implemented.`,
      });
    }
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 sticky top-24">
      <CardHeader>
        <CardTitle className="text-white">Activity & Connection Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{log.service}</p>
                <p className="text-xs text-gray-400">
                  {log.status === 'Active' ? `Synced: ${log.lastSync}` : 'Last attempt failed'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn(
                  log.status === 'Active' ? 'border-green-400/50 text-green-400' : 'border-red-400/50 text-red-400'
                )}>
                  {log.status}
                </Badge>
                <Button
                  size="sm"
                  variant={log.status === 'Active' ? 'destructive' : 'secondary'}
                  onClick={() => handleAction(log)}
                >
                  {log.status === 'Active' ? 'Disconnect' : 'Retry'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;