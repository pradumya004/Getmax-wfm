import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, UserPlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
        case 'high': return 'bg-red-500 text-white';
        case 'medium': return 'bg-orange-500 text-white';
        case 'low': return 'bg-green-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
};

const FloatingPoolTable = ({ claims, onReassign }) => {
    return (
        <div className="bg-glass-dark border border-gray-800 rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-gray-800">
                        <TableHead className="text-white">Claim ID</TableHead>
                        <TableHead className="text-white">Priority</TableHead>
                        <TableHead className="text-white">Details (DOS / Balance / Payer)</TableHead>
                        <TableHead className="text-white">SOW Ref</TableHead>
                        <TableHead className="text-white">Time in Pool</TableHead>
                        <TableHead className="text-white text-center">SLA Risk</TableHead>
                        <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {claims.map((claim) => (
                        <TableRow key={claim.id} className="border-b-gray-800/50 hover:bg-gray-800/50">
                            <TableCell className="font-medium">{claim.id}</TableCell>
                            <TableCell>
                                <Badge className={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                            </TableCell>
                            <TableCell>
                                {claim.dos} / {claim.balance} / {claim.payer}
                            </TableCell>
                            <TableCell>{claim.sow}</TableCell>
                            <TableCell>{claim.timeInPool}</TableCell>
                            <TableCell className="text-center">
                                {claim.slaRisk && (
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <AlertTriangle className="h-5 w-5 text-yellow-400 inline-block" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>At risk of SLA breach.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90" onClick={() => onReassign(claim)}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Reassign
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default FloatingPoolTable;