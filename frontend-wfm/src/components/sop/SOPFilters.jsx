import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

const SOPFilters = ({ onAddNew, clients, sows, setFilters }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-glass-dark border border-gray-800 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Select onValueChange={(value) => setFilters(f => ({ ...f, client: value }))} defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[200px] bg-black/20 border-[#39ff14]/30">
                        <SelectValue placeholder="Filter by Client..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilters(f => ({ ...f, sow: value }))} defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[200px] bg-black/20 border-[#39ff14]/30">
                        <SelectValue placeholder="Filter by SOW..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All SOWs</SelectItem>
                        {sows.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto bg-[#39ff14] text-black hover:bg-[#39ff14]/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New SOP
            </Button>
        </div>
    );
};

export default SOPFilters;