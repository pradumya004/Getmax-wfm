import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import QAAuditFilters from '@/components/qa/QAAuditFilters';
import QAAuditQueueTable from '@/components/qa/QAAuditQueueTable';
import { AnimatePresence, motion } from 'framer-motion';

const mockAuditQueue = [
  { claimId: 'C-13456', empName: 'John T.', auditTrigger: 'Random', sowType: 'Coding', status: 'Pending' },
  { claimId: 'C-14324', empName: 'Priya R.', auditTrigger: 'Rule-based', sowType: 'AR Calling', status: 'Pending' },
  { claimId: 'C-15892', empName: 'Mike L.', auditTrigger: 'Manual', sowType: 'Denials', status: 'Completed' },
  { claimId: 'C-16101', empName: 'Sarah J.', auditTrigger: 'Random', sowType: 'Charges', status: 'Escalated' },
  { claimId: 'C-17234', empName: 'Priya R.', auditTrigger: 'Rule-based', sowType: 'AR Calling', status: 'Completed' },
  { claimId: 'C-19981', empName: 'John T.', auditTrigger: 'Random', sowType: 'Coding', status: 'Pending' },
];

const QAAudit = () => {
  const title = "QA Audit Queue";
  const [filters, setFilters] = useState({
    sowType: 'all',
    triggerType: 'all',
    status: 'all',
    empName: '',
  });

  const filteredData = useMemo(() => {
    return mockAuditQueue.filter(item => {
      const sowTypeMatch = filters.sowType === 'all' || item.sowType === filters.sowType;
      const triggerMatch = filters.triggerType === 'all' || item.auditTrigger === filters.triggerType;
      const statusMatch = filters.status === 'all' || item.status === filters.status;
      const empNameMatch = item.empName.toLowerCase().includes(filters.empName.toLowerCase());
      return sowTypeMatch && triggerMatch && statusMatch && empNameMatch;
    });
  }, [filters]);

  const uniqueValues = (key) => [...new Set(mockAuditQueue.map(item => item[key]))];

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content="Review and audit claims to ensure quality and compliance." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-300">Claims queued for quality assurance audit.</p>
        </div>
        
        <QAAuditFilters 
          filters={filters}
          setFilters={setFilters}
          sowTypes={uniqueValues('sowType')}
          triggerTypes={uniqueValues('auditTrigger')}
        />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QAAuditQueueTable data={filteredData} />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default QAAudit;