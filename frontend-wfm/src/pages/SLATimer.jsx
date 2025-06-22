import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';
import SLAFilters from '@/components/sla/SLAFilters';
import SLATable from '@/components/sla/SLATable';
import SLASummaryCard from '@/components/sla/SLASummaryCard';

const mockSlaData = [
  {
    claimId: 'C-13456',
    client: 'MedCare Solutions',
    employee: 'John T.',
    taskType: 'Coding',
    status: 'In Progress',
    slaPercentage: 60,
    timeLeft: '1d 5h',
    importedDate: '2025-06-19T10:00:00Z',
  },
  {
    claimId: 'C-14324',
    client: 'Elite Health',
    employee: 'Priya R.',
    taskType: 'AR Calling',
    status: 'Breached',
    slaPercentage: 0,
    timeLeft: '-3h 15m',
    importedDate: '2025-06-18T14:30:00Z',
  },
  {
    claimId: 'C-15892',
    client: 'BillPro Services',
    employee: 'Mike L.',
    taskType: 'Denials',
    status: 'In Progress',
    slaPercentage: 25,
    timeLeft: '4h 30m',
    importedDate: '2025-06-20T09:00:00Z',
  },
  {
    claimId: 'C-16101',
    client: 'MedCare Solutions',
    employee: 'Sarah J.',
    taskType: 'Charges',
    status: 'Frozen',
    slaPercentage: 85,
    timeLeft: '2d 1h',
    importedDate: '2025-06-17T11:00:00Z',
  },
  {
    claimId: 'C-17234',
    client: 'Elite Health',
    employee: 'Priya R.',
    taskType: 'AR Calling',
    status: 'Resolved',
    slaPercentage: 100,
    timeLeft: 'Done',
    importedDate: '2025-06-19T16:00:00Z',
  },
  {
    claimId: 'C-18455',
    client: 'MedCare Solutions',
    employee: 'John T.',
    taskType: 'Coding',
    status: 'In Progress',
    slaPercentage: 95,
    timeLeft: '3d 2h',
    importedDate: '2025-06-16T09:00:00Z',
  },
];

const SLATimer = () => {
  const title = "SLA Timer View";
  const [filters, setFilters] = useState({
    client: 'all',
    sowType: 'all',
    status: 'all',
    employee: 'all',
    dateRange: { from: null, to: null },
  });

  const filteredData = useMemo(() => {
    return mockSlaData.filter(item => {
      const itemDate = new Date(item.importedDate);
      const fromDate = filters.dateRange.from;
      const toDate = filters.dateRange.to;

      const clientMatch = filters.client === 'all' || item.client === filters.client;
      const sowTypeMatch = filters.sowType === 'all' || item.taskType === filters.sowType;
      const statusMatch = filters.status === 'all' || item.status.replace(' ', '') === filters.status;
      const employeeMatch = filters.employee === 'all' || item.employee === filters.employee;
      const dateMatch = (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);

      return clientMatch && sowTypeMatch && statusMatch && employeeMatch && dateMatch;
    });
  }, [filters, mockSlaData]);

  const uniqueValues = (key) => [...new Set(mockSlaData.map(item => item[key]))];

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content="Monitor live claim timers and SLA compliance in real-time." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-300">Monitor live claim timers and SLA compliance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 space-y-6">
            <SLAFilters 
              filters={filters} 
              setFilters={setFilters}
              clients={uniqueValues('client')}
              sowTypes={uniqueValues('taskType')}
              employees={uniqueValues('employee')}
            />
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SLATable data={filteredData} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="lg:col-span-1 sticky top-24">
            <SLASummaryCard data={mockSlaData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SLATimer;