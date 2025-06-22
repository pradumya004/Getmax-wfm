import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Crown, ShieldCheck } from 'lucide-react';

const feed = [
  { text: 'Priya R. reached Level 6!', icon: Crown, color: 'text-yellow-400' },
  { text: 'John T. earned "QA Hero" badge', icon: ShieldCheck, color: 'text-blue-400' },
  { text: 'Mike L. is on a 15-day streak!', icon: Gamepad2, color: 'text-green-400' },
];

const GamificationFeedTile = () => {
  return (
    <Card className="bg-glass-dark border-[#39ff14]/20 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Gamepad2 className="text-[#39ff14]" />
          Gamification Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {feed.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <item.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${item.color}`} />
              <span className="text-sm text-white">{item.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default GamificationFeedTile;