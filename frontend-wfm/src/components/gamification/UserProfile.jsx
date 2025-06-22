import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import BadgeCard from '@/components/gamification/BadgeCard';
import { Flame, Star, ShieldCheck, Timer, Package, RefreshCw } from 'lucide-react';

const mockUser = {
  name: 'Priya R.',
  xp: 1450,
  level: 5,
  xpForNextLevel: 2000,
  streak: 12,
  badges: [
    { name: 'SLA Champ', icon: Timer, unlocked: true, description: '>95% SLA for 30 days' },
    { name: 'QA Hero', icon: ShieldCheck, unlocked: true, description: 'Avg QA > 97% for 2 weeks' },
    { name: 'Volume Master', icon: Package, unlocked: false, description: '120% volume for 10 days' },
    { name: 'Comeback Kid', icon: RefreshCw, unlocked: true, description: '<80% to >95% QA in 2 weeks' },
    { name: 'Top Performer', icon: Star, unlocked: true, description: 'Top 3 on leaderboard' },
  ],
  claimedRewards: [
    { reward: 'Amazon Gift Card $25', date: '2025-06-15', cost: '5000 XP' },
    { reward: 'Extra Day Off', date: '2025-05-20', cost: '10000 XP' },
  ]
};

const UserProfile = () => {
  const xpProgress = (mockUser.xp / mockUser.xpForNextLevel) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-glass-dark border-[#39ff14]/20">
          <CardHeader>
            <CardTitle className="text-white">My Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-5xl font-bold text-[#39ff14] text-glow">Lvl {mockUser.level}</span>
              <div className="flex items-center gap-2 text-yellow-400">
                <Flame className="h-8 w-8" />
                <span className="text-3xl font-bold">{mockUser.streak} Day Streak</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>XP Progress</span>
                <span>{mockUser.xp} / {mockUser.xpForNextLevel} XP</span>
              </div>
              <Progress value={xpProgress} className="h-4 bg-[#39ff14]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-glass-dark border-[#39ff14]/20">
          <CardHeader>
            <CardTitle className="text-white">Claimed Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-[#39ff14]/20">
                  <TableHead>Reward</TableHead>
                  <TableHead>Date Claimed</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUser.claimedRewards.map(reward => (
                  <TableRow key={reward.reward} className="border-b-0">
                    <TableCell className="font-medium text-white">{reward.reward}</TableCell>
                    <TableCell className="text-gray-400">{reward.date}</TableCell>
                    <TableCell className="text-right text-[#39ff14] font-bold">{reward.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="bg-glass-dark border-[#39ff14]/20">
          <CardHeader>
            <CardTitle className="text-white">Badges Unlocked</CardTitle>
            <CardDescription className="text-gray-400">Your collection of achievements.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {mockUser.badges.map(badge => (
              <BadgeCard key={badge.name} {...badge} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;