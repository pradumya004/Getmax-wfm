import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const SystemActivityLogs = ({ logs }) => {
  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <CardTitle className="text-white">System Activity Logs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[#39ff14]/20 hover:bg-transparent">
                <TableHead>Activity</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-b-[#39ff14]/10">
                  <TableCell className="font-medium text-white">{log.activity}</TableCell>
                  <TableCell className="text-gray-300">{log.performedBy}</TableCell>
                  <TableCell className="text-gray-300">{log.time}</TableCell>
                  <TableCell><Badge variant="secondary">{log.role}</Badge></TableCell>
                  <TableCell className="font-mono text-xs text-gray-400">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemActivityLogs;