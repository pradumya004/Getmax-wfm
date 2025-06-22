import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plug, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const IntegrationCard = ({ service, onConnect }) => {
  const isConnected = service.status === 'Active';

  return (
    <Card className="bg-black/30 border-[#39ff14]/20 flex flex-col justify-between hover-glow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-white text-lg">{service.name}</CardTitle>
          <Badge variant="outline" className={cn(
            'border-gray-600 text-gray-400',
            isConnected && 'border-green-400/50 text-green-400 bg-green-500/10',
            service.status === 'Failed' && 'border-red-400/50 text-red-400 bg-red-500/10'
          )}>
            <div className={cn(
              'h-2 w-2 rounded-full mr-2',
              isConnected ? 'bg-green-400' : service.status === 'Failed' ? 'bg-red-400' : 'bg-gray-500'
            )}></div>
            {service.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          className={cn(
            "w-full",
            isConnected ? "bg-gray-700 hover:bg-gray-600" : "bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green"
          )}
          onClick={onConnect}
        >
          {isConnected ? <Settings className="h-4 w-4 mr-2" /> : <Plug className="h-4 w-4 mr-2" />}
          {isConnected ? 'Manage' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;