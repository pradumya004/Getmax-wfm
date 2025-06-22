import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw } from 'lucide-react';

const QAAuditFilters = ({ filters, setFilters, sowTypes, triggerTypes }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({
      sowType: 'all',
      triggerType: 'all',
      status: 'all',
      empName: '',
    });
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">SOW Type</label>
            <Select value={filters.sowType} onValueChange={(v) => handleFilterChange('sowType', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SOW Types</SelectItem>
                {sowTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Trigger Type</label>
            <Select value={filters.triggerType} onValueChange={(v) => handleFilterChange('triggerType', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Triggers</SelectItem>
                {triggerTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Status</label>
            <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Employee Name</label>
            <Input 
              name="empName"
              value={filters.empName}
              onChange={handleInputChange}
              placeholder="Search by name..."
              className="bg-black/20 border-[#39ff14]/30 text-white"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88]">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QAAuditFilters;