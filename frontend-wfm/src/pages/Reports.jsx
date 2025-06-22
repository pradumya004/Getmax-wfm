import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportFilters from '@/components/reports/ReportFilters';
import RecentReportsTable from '@/components/reports/RecentReportsTable';
import CustomReportBuilder from '@/components/reports/CustomReportBuilder';
import SystemActivityLogs from '@/components/reports/SystemActivityLogs';
import { useToast } from '@/components/ui/use-toast';

const mockRecentReports = [
  { id: 1, name: 'Weekly QA Summary', generatedBy: 'Preethi R', date: '2025-06-20', format: 'PDF', status: 'Ready' },
  { id: 2, name: 'AR Claim Volume - June', generatedBy: 'Vishal M', date: '2025-06-19', format: 'Excel', status: 'Ready' },
  { id: 3, name: 'Daily Productivity', generatedBy: 'Admin', date: '2025-06-21', format: 'CSV', status: 'Generating' },
  { id: 4, name: 'SLA Compliance - Q2', generatedBy: 'Admin', date: '2025-06-18', format: 'PDF', status: 'Ready' },
];

const mockActivityLogs = [
    { id: 1, activity: 'Created Claim #C-13457', performedBy: 'Vishal M', time: '21/06 14:52', role: 'AR Caller', ip: '192.168.1.10' },
    { id: 2, activity: 'Audited 12 Claims', performedBy: 'QA_Meera', time: '21/06 13:10', role: 'QA Analyst', ip: '10.0.0.22' },
    { id: 3, activity: 'Edited SOW-004-Sunrise-AR', performedBy: 'Admin', time: '20/06 09:20', role: 'SuperAdmin', ip: '127.0.0.1' },
    { id: 4, activity: 'Logged in', performedBy: 'Preethi R', time: '20/06 08:00', role: 'AR Caller', ip: '192.168.1.15' },
    { id: 5, activity: 'Downloaded Report: Weekly QA', performedBy: 'Admin', time: '20/06 07:30', role: 'SuperAdmin', ip: '127.0.0.1' },
];

const Reports = () => {
  const { toast } = useToast();
  const [recentReports, setRecentReports] = useState(mockRecentReports);
  const [filters, setFilters] = useState({
    reportType: 'Productivity',
    clientName: 'all',
    dateRange: { from: new Date(2025, 5, 1), to: new Date(2025, 5, 21) },
    sowType: 'all',
    exportFormat: 'PDF',
  });
  const [customOptions, setCustomOptions] = useState({
    includeEmployeeBreakdown: true,
    includeQAAccuracy: true,
    includeRevenueInsights: false,
  });

  const handleGenerateReport = () => {
    toast({
      title: "📊 Report Generation Started",
      description: `Your ${filters.reportType} report is being generated in ${filters.exportFormat} format.`,
      className: "bg-[#39ff14] text-black"
    });
    const newReport = {
      id: recentReports.length + 1,
      name: `${filters.reportType} Report - ${new Date().toLocaleDateString()}`,
      generatedBy: 'Admin',
      date: new Date().toISOString().split('T')[0],
      format: filters.exportFormat,
      status: 'Generating',
    };
    setRecentReports(prev => [newReport, ...prev]);

    setTimeout(() => {
      setRecentReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: 'Ready' } : r));
      toast({
        title: "✅ Report Ready!",
        description: `Your ${newReport.name} is ready for download.`,
      });
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>Reports & Logs - GetMax</title>
        <meta name="description" content="Generate operational reports and view system activity logs." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Logs</h1>
          <p className="text-gray-300">Generate reports and monitor system-wide activity.</p>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-[#39ff14]/20">
            <TabsTrigger value="reports">Generated Reports</TabsTrigger>
            <TabsTrigger value="logs">System Activity Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="reports" className="space-y-6">
            <ReportFilters filters={filters} setFilters={setFilters} onGenerate={handleGenerateReport} />
            <CustomReportBuilder options={customOptions} setOptions={setCustomOptions} />
            <RecentReportsTable reports={recentReports} />
          </TabsContent>
          <TabsContent value="logs">
            <SystemActivityLogs logs={mockActivityLogs} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Reports;