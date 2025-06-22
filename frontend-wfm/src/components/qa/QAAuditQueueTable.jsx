import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const QAAuditQueueTable = ({ data }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'Completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'Escalated':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Escalated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAuditClick = (claimId, status) => {
    if (status === 'Pending') {
      navigate(`/qa/audit/${claimId}`);
    }
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[#39ff14]/20">
                <TableHead>Claim ID</TableHead>
                <TableHead>EMP Name</TableHead>
                <TableHead>Audit Trigger</TableHead>
                <TableHead>SOW Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Audit Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? data.map((item) => (
                <TableRow key={item.claimId} className="border-b-[#39ff14]/10">
                  <TableCell className="font-medium text-white">{item.claimId}</TableCell>
                  <TableCell><Badge variant="secondary">{item.empName}</Badge></TableCell>
                  <TableCell className="text-gray-300">{item.auditTrigger}</TableCell>
                  <TableCell><Badge variant="outline" className="border-[#39ff14]/30 text-[#39ff14]">{item.sowType}</Badge></TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      className="bg-[#39ff14] text-black hover:bg-[#00ff88]"
                      size="sm"
                      onClick={() => handleAuditClick(item.claimId, item.status)}
                      disabled={item.status !== 'Pending'}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {item.status === 'Pending' ? 'Audit' : 'View'}
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                    No claims match the current filters.
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

export default QAAuditQueueTable;