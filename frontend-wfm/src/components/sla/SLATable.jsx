import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Timer, AlertTriangle, Eye, ShieldCheck, Snowflake, Megaphone } from 'lucide-react';
import FreezeDialog from '@/components/sla/FreezeDialog';

const SLATable = ({ data }) => {
  const { toast } = useToast();
  const [isFreezeDialogOpen, setIsFreezeDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">🟡 In Progress</Badge>;
      case 'Breached':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">🔴 Breached</Badge>;
      case 'Frozen':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">🔵 Frozen</Badge>;
      case 'Resolved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">🟢 Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    return 'bg-[#39ff14]';
  };

  const handleAction = (action, claimId) => {
    if (action === 'freeze') {
      setSelectedClaim(claimId);
      setIsFreezeDialogOpen(true);
    } else {
      toast({
        title: `Action: ${action}`,
        description: `Triggered for Claim ID: ${claimId}. This is a placeholder.`,
      });
    }
  };

  return (
    <>
      <Card className="bg-glass-dark border-[#39ff14]/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-[#39ff14]/20">
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Task Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SLA % Left</TableHead>
                  <TableHead>Time Left</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? data.map((item) => (
                  <TableRow key={item.claimId} className="border-b-[#39ff14]/10">
                    <TableCell className="font-medium text-white">{item.claimId}</TableCell>
                    <TableCell className="text-gray-300">{item.client}</TableCell>
                    <TableCell className="text-gray-300">{item.employee}</TableCell>
                    <TableCell className="text-gray-300">{item.taskType}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={item.slaPercentage} className={`w-24 h-2 ${getProgressColor(item.slaPercentage)}`} />
                        <span className="text-white text-xs">{item.slaPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Timer className="h-4 w-4" />
                        <span>{item.timeLeft}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {item.status === 'Breached' ? (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction('override', item.claimId)}><ShieldCheck className="h-4 w-4 text-green-400" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction('viewNotes', item.claimId)}><Eye className="h-4 w-4 text-blue-400" /></Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction('freeze', item.claimId)}><Snowflake className="h-4 w-4 text-blue-400" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction('escalate', item.claimId)}><Megaphone className="h-4 w-4 text-yellow-400" /></Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-gray-400">
                      No claims match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <FreezeDialog 
        isOpen={isFreezeDialogOpen} 
        setIsOpen={setIsFreezeDialogOpen} 
        claimId={selectedClaim} 
      />
    </>
  );
};

export default SLATable;