import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Eye, Power } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SOWTable = ({ sows, onEdit }) => {
  const { toast } = useToast();

  const handleAction = (action, sowId) => {
    toast({
      title: `🚧 ${action} Action`,
      description: `This feature for SOW ${sowId} is not implemented yet.`,
    });
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[#39ff14]/20 hover:bg-transparent">
                <TableHead>SOW ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Daily Target</TableHead>
                <TableHead>QA Benchmark</TableHead>
                <TableHead>SLA (Hrs)</TableHead>
                <TableHead>Claim Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sows.length > 0 ? sows.map((sow) => (
                <TableRow key={sow.id} className="border-b-[#39ff14]/10">
                  <TableCell className="font-mono text-xs text-white">{sow.id}</TableCell>
                  <TableCell className="font-medium text-gray-300">{sow.clientName}</TableCell>
                  <TableCell><Badge variant="outline" className="border-[#39ff14]/30 text-[#39ff14]">{sow.department}</Badge></TableCell>
                  <TableCell className="text-white">{sow.dailyTarget}</TableCell>
                  <TableCell className="text-white">{sow.qaBenchmark}%</TableCell>
                  <TableCell className="text-white">{sow.slaTat}</TableCell>
                  <TableCell><Badge variant="secondary">{sow.claimFormat}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={sow.status === 'Active'}
                        onCheckedChange={() => handleAction('Toggle Status', sow.id)}
                        className="data-[state=checked]:bg-[#39ff14]"
                      />
                      <span className={sow.status === 'Active' ? 'text-green-400' : 'text-gray-500'}>
                        {sow.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(sow)}>
                        <Edit className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction('View', sow.id)}>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction('Disable', sow.id)}>
                        <Power className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-gray-400">
                    No SOWs match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SOWTable;