import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductivityFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (date) => {
    setFilters(prev => ({ ...prev, dateRange: date }));
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full flex-grow">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Client Name</label>
              <Select value={filters.client} onValueChange={(v) => handleFilterChange('client', v)}>
                <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="Sunrise Health Group">Sunrise Health Group</SelectItem>
                  <SelectItem value="Elite Healthcare">Elite Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">SOW / Department</label>
              <Select value={filters.sow} onValueChange={(v) => handleFilterChange('sow', v)}>
                <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SOWs</SelectItem>
                  <SelectItem value="AR Calling">AR Calling</SelectItem>
                  <SelectItem value="Coding">Coding</SelectItem>
                  <SelectItem value="Denial Mgmt">Denial Mgmt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Date Range</label>
              <DatePicker 
                date={filters.dateRange.from}
                setDate={(d) => handleDateChange({ from: d, to: filters.dateRange.to })}
                placeholder="Select date"
                className="bg-black/20 border-[#39ff14]/30 text-white"
              />
            </div>
          </div>
          <div className="flex items-center bg-black/20 border border-[#39ff14]/30 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'flex-1 text-white',
                filters.viewType === 'team' && 'bg-[#39ff14] text-black hover:bg-[#39ff14]'
              )}
              onClick={() => handleFilterChange('viewType', 'team')}
            >
              <Users className="h-4 w-4 mr-2" /> Team
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'flex-1 text-white',
                filters.viewType === 'individual' && 'bg-[#39ff14] text-black hover:bg-[#39ff14]'
              )}
              onClick={() => handleFilterChange('viewType', 'individual')}
            >
              <User className="h-4 w-4 mr-2" /> Individual
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityFilters;