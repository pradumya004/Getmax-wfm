import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'coded': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'pending coding': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'error': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};

const ChargeEntryTable = ({ files }) => {
    const { toast } = useToast();
    
    const handleViewClick = () => {
        toast({
            title: "🚧 View Superbill",
            description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    }

    return (
        <div className="bg-glass-dark border border-gray-800 rounded-lg overflow-hidden mt-6">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-gray-800">
                        <TableHead className="text-white">File Name</TableHead>
                        <TableHead className="text-white">Upload Date</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white">Assigned Coder</TableHead>
                        <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {files.map((file) => (
                        <TableRow key={file.id} className="border-b-gray-800/50 hover:bg-gray-800/50">
                            <TableCell className="font-medium">{file.name}</TableCell>
                            <TableCell>{file.uploadDate}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={getStatusColor(file.status)}>{file.status}</Badge>
                            </TableCell>
                            <TableCell>{file.assignedTo}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="outline" className="border-gray-500/50 text-gray-300 hover:bg-gray-500/20 hover:text-white" onClick={handleViewClick}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ChargeEntryTable;