import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { BarChart3, FileDown, FileText, FileType2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ReportFilters = ({ filters, setFilters, onGenerate }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Report Type</label>
            <Select value={filters.reportType} onValueChange={(v) => handleFilterChange('reportType', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="QA">QA Report</SelectItem>
                <SelectItem value="Claims">Claims Report</SelectItem>
                <SelectItem value="SLA">SLA Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Client Name</label>
            <Select value={filters.clientName} onValueChange={(v) => handleFilterChange('clientName', v)}>
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
            <Select value={filters.sowType} onValueChange={(v) => handleFilterChange('sowType', v)}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SOWs</SelectItem>
                <SelectItem value="AR Calling">AR Calling</SelectItem>
                <SelectItem value="Coding">Coding</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Date Range</label>
            <DatePicker
              date={filters.dateRange.from}
              setDate={(d) => handleFilterChange('dateRange', { from: d, to: filters.dateRange.to })}
              className="bg-black/20 border-[#39ff14]/30 text-white"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Export Format</label>
            <div className="flex items-center bg-black/20 border border-[#39ff14]/30 rounded-lg p-1">
              {['PDF', 'Excel', 'CSV'].map(format => (
                <Button
                  key={format}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'flex-1 text-white',
                    filters.exportFormat === format && 'bg-[#39ff14] text-black hover:bg-[#39ff14]'
                  )}
                  onClick={() => handleFilterChange('exportFormat', format)}
                >
                  {format}
                </Button>
              ))}
            </div>
          </div>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green w-full md:w-auto" onClick={onGenerate}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;