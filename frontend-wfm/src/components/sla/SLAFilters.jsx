import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { Search, RotateCcw } from 'lucide-react';

const SLAFilters = ({ filters, setFilters, clients, sowTypes, employees }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (date) => {
    setFilters(prev => ({ ...prev, dateRange: date }));
  };

  const resetFilters = () => {
    setFilters({
      client: 'all',
      sowType: 'all',
      status: 'all',
      employee: 'all',
      dateRange: { from: null, to: null },
    });
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Client</label>
            <Select value={filters.client} onValueChange={(v) => handleFilterChange('client', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
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
            <label className="text-xs text-gray-400">Status</label>
            <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Frozen">Frozen</SelectItem>
                <SelectItem value="Breached">Breached</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Employee</label>
            <Select value={filters.employee} onValueChange={(v) => handleFilterChange('employee', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Imported Date</label>
            <DatePicker 
              date={filters.dateRange.from} 
              setDate={(date) => handleFilterChange('dateRange', { ...filters.dateRange, from: date })} 
              placeholder="Start date"
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

export default SLAFilters;