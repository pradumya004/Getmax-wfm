import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const BadgeCard = ({ name, icon: Icon, unlocked, description }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={cn(
            "bg-black/20 border border-gray-700 text-center p-4 transition-all duration-300",
            unlocked ? "border-[#39ff14]/50 hover-glow" : "opacity-40 grayscale"
          )}>
            <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
              <Icon className={cn("h-10 w-10", unlocked ? "text-[#39ff14]" : "text-gray-500")} />
              <p className={cn("text-xs font-semibold", unlocked ? "text-white" : "text-gray-400")}>{name}</p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white border border-[#39ff14]/50">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeCard;