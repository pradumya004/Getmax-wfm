import React, { useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

function Counter({ from = 0, to, isPercentage = false, isCurrency = false }) {
  const ref = useRef();

  useEffect(() => {
    const controls = animate(from, to, {
      duration: 1.5,
      onUpdate(value) {
        if (ref.current) {
          if (isPercentage) {
            ref.current.textContent = value.toFixed(1);
          } else if (isCurrency) {
            ref.current.textContent = Math.round(value).toLocaleString('en-IN');
          } else {
            ref.current.textContent = Math.round(value).toLocaleString();
          }
        }
      },
    });
    return () => controls.stop();
  }, [from, to, isPercentage, isCurrency]);

  return <span ref={ref} />;
}

const StatCard = ({ title, value, icon: Icon, weeklyTrend, isPercentage = false, isCurrency = false }) => {
  const { toast } = useToast();

  const handleDrillDown = () => {
    toast({
      title: `Drilling down into ${title}`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 hover-glow cursor-pointer" onClick={handleDrillDown}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className="h-5 w-5 text-[#39ff14]" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">
          {isCurrency && '₹'}
          <Counter to={value} isPercentage={isPercentage} isCurrency={isCurrency} />
          {isPercentage && '%'}
        </div>
        <p className="text-xs text-gray-400 pt-1">{weeklyTrend}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;