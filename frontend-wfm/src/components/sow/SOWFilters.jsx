import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

const SOWFilters = ({ filters, setFilters, onAddNew, clientNames, departments }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto flex-grow">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Client Name</label>
              <Select value={filters.clientName} onValueChange={(v) => handleFilterChange('clientName', v)}>
                <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clientNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Department</label>
              <Select value={filters.department} onValueChange={(v) => handleFilterChange('department', v)}>
                <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">SOW Status</label>
              <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green w-full md:w-auto" onClick={onAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New SOW
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SOWFilters;