import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, FileDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const mockTeamData = [
  { name: 'Preethi R', role: 'AR Caller', claims: 450, sla: 98, qa: 97, hours: 36, revenue: 42300 },
  { name: 'Manoj K', role: 'Coder', claims: 340, sla: 90, qa: 99, hours: 32, revenue: 36800 },
  { name: 'Sonia Singh', role: 'Denial Analyst', claims: 150, sla: 99, qa: 95, hours: 38, revenue: 29500 },
  { name: 'Rajesh Kumar', role: 'AR Caller', claims: 430, sla: 88, qa: 92, hours: 35, revenue: 41200 },
  { name: 'Anjali P', role: 'Coder', claims: 360, sla: 94, qa: 98, hours: 33, revenue: 38000 },
];

const TeamPerformanceTable = () => {
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: '🚧 Export Action',
      description: `Exporting as ${format} is not yet implemented.`,
    });
  };

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warn) return 'text-yellow-400';
    return 'text-red-500';
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Team Performance</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}>
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[#39ff14]/20 hover:bg-transparent">
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Claims Closed</TableHead>
                <TableHead>SLA %</TableHead>
                <TableHead>QA %</TableHead>
                <TableHead>Active Hours</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeamData.map((emp) => (
                <TableRow key={emp.name} className="border-b-[#39ff14]/10">
                  <TableCell className="font-medium text-white">{emp.name}</TableCell>
                  <TableCell><Badge variant="outline" className="border-[#39ff14]/30 text-[#39ff14]">{emp.role}</Badge></TableCell>
                  <TableCell className="text-white">{emp.claims}</TableCell>
                  <TableCell className={cn("font-bold", getStatusColor(emp.sla, { good: 95, warn: 90 }))}>{emp.sla}%</TableCell>
                  <TableCell className={cn("font-bold", getStatusColor(emp.qa, { good: 95, warn: 90 }))}>{emp.qa}%</TableCell>
                  <TableCell className="text-white">{emp.hours} hrs/week</TableCell>
                  <TableCell className="text-right font-mono text-[#39ff14] text-glow">₹{emp.revenue.toLocaleString('en-IN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceTable;