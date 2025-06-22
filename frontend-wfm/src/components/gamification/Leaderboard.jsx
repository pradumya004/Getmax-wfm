import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Crown, Flame } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, name: 'Priya R.', role: 'AR Calling', xp: 1450, level: 5, streak: 12 },
  { rank: 2, name: 'John T.', role: 'Coding', xp: 1200, level: 4, streak: 8 },
  { rank: 3, name: 'Mike L.', role: 'Denials', xp: 1150, level: 4, streak: 5 },
  { rank: 4, name: 'Sarah J.', role: 'Charges', xp: 980, level: 3, streak: 2 },
  { rank: 5, name: 'David Chen', role: 'AR Calling', xp: 950, level: 3, streak: 15 },
  { rank: 6, name: 'Emily White', role: 'Coding', xp: 800, level: 3, streak: 0 },
];

const Leaderboard = () => {
  const [filters, setFilters] = useState({ role: 'all', team: 'all', timeframe: 'monthly' });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Crown className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Crown className="h-5 w-5 text-yellow-600" />;
    return <span className="font-bold text-white">{rank}</span>;
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-white">Leaderboard</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
            <Select value={filters.role} onValueChange={(v) => handleFilterChange('role', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="AR Calling">AR Calling</SelectItem>
                <SelectItem value="Coding">Coding</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.team} onValueChange={(v) => handleFilterChange('team', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="MedCare">MedCare Solutions</SelectItem>
                <SelectItem value="Elite">Elite Health</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.timeframe} onValueChange={(v) => handleFilterChange('timeframe', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="all-time">All-Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#39ff14]/20">
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead className="text-right">XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeaderboard.map(user => (
              <TableRow key={user.rank} className="border-b-0">
                <TableCell>{getRankIcon(user.rank)}</TableCell>
                <TableCell className="font-medium text-white">{user.name}</TableCell>
                <TableCell><Badge variant="outline" className="border-[#39ff14]/30 text-[#39ff14]">{user.role}</Badge></TableCell>
                <TableCell><Badge variant="secondary">Lvl {user.level}</Badge></TableCell>
                <TableCell>
                  {user.streak > 3 && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Flame className="h-4 w-4" />
                      <span>{user.streak}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right font-bold text-xl text-[#39ff14] text-glow">{user.xp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;