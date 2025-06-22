import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PenLine as FilePenLine } from 'lucide-react';

const SOPList = ({ sops, onEdit, filters }) => {
    const filteredSops = useMemo(() => {
        return sops.filter(sop => 
            (filters.client === 'all' || sop.client === filters.client) &&
            (filters.sow === 'all' || sop.sow === filters.sow)
        );
    }, [sops, filters]);

    return (
        <div className="bg-glass-dark border border-gray-800 rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-gray-800">
                        <TableHead className="text-white">Title</TableHead>
                        <TableHead className="text-white">Client</TableHead>
                        <TableHead className="text-white">SOW</TableHead>
                        <TableHead className="text-white text-center">Version</TableHead>
                        <TableHead className="text-white">Created By</TableHead>
                        <TableHead className="text-white">Last Updated</TableHead>
                        <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSops.map((sop) => (
                        <TableRow key={sop.id} className="border-b-gray-800/50 hover:bg-gray-800/50">
                            <TableCell className="font-medium text-white">{sop.title}</TableCell>
                            <TableCell>{sop.client}</TableCell>
                            <TableCell>{sop.sow}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant="secondary">v{sop.version}</Badge>
                            </TableCell>
                            <TableCell>{sop.createdBy}</TableCell>
                            <TableCell>{sop.createdAt}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="outline" className="border-gray-500/50 text-gray-300 hover:bg-gray-500/20 hover:text-white" onClick={() => onEdit(sop)}>
                                    <FilePenLine className="h-4 w-4 mr-2" />
                                    View / Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default SOPList;