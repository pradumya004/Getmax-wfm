import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import SOWFilters from '@/components/sow/SOWFilters';
import SOWTable from '@/components/sow/SOWTable';
import SOWDetailModal from '@/components/sow/SOWDetailModal';
import { useToast } from '@/components/ui/use-toast';

const initialMockSOWs = [
  {
    id: 'SOW-004-Sunrise-AR',
    clientName: 'Sunrise Health Group',
    department: 'AR Calling',
    dailyTarget: 50,
    qaBenchmark: 95,
    slaTat: 48,
    employeesRequired: 6,
    assignedEmployees: 5,
    claimFormat: 'EMSMC',
    status: 'Active',
    contractType: 'Transactional',
    effectiveDate: '2025-01-01',
    endDate: '2025-12-31',
    dailyVolume: 300,
    backupRatio: 10,
    autoAssignment: true,
    allowedStatuses: ['Open', 'Follow-up'],
  },
  {
    id: 'SOW-005-Elite-Coding',
    clientName: 'Elite Healthcare',
    department: 'Coding',
    dailyTarget: 40,
    qaBenchmark: 98,
    slaTat: 24,
    employeesRequired: 8,
    assignedEmployees: 8,
    claimFormat: 'Medisoft',
    status: 'Active',
    contractType: 'FTE',
    effectiveDate: '2024-11-01',
    endDate: null,
    dailyVolume: 320,
    backupRatio: 15,
    autoAssignment: true,
    allowedStatuses: ['Coded', 'Pending Review'],
  },
  {
    id: 'SOW-006-BillPro-Denial',
    clientName: 'BillPro Services',
    department: 'Denial Management',
    dailyTarget: 20,
    qaBenchmark: 92,
    slaTat: 72,
    employeesRequired: 4,
    assignedEmployees: 3,
    claimFormat: 'ClaimMD',
    status: 'Inactive',
    contractType: 'Hybrid',
    effectiveDate: '2025-02-01',
    endDate: '2025-08-01',
    dailyVolume: 80,
    backupRatio: 5,
    autoAssignment: false,
    allowedStatuses: ['Denied', 'Appeal Submitted'],
  },
];

const SOWManagement = () => {
  const { toast } = useToast();
  const [sows, setSows] = useState(initialMockSOWs);
  const [filters, setFilters] = useState({
    clientName: 'all',
    department: 'all',
    status: 'all',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSOW, setSelectedSOW] = useState(null);

  const filteredSOWs = useMemo(() => {
    return sows.filter(sow => {
      const clientMatch = filters.clientName === 'all' || sow.clientName === filters.clientName;
      const deptMatch = filters.department === 'all' || sow.department === filters.department;
      const statusMatch = filters.status === 'all' || sow.status === filters.status;
      return clientMatch && deptMatch && statusMatch;
    });
  }, [sows, filters]);

  const handleAddNew = () => {
    setSelectedSOW(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sow) => {
    setSelectedSOW(sow);
    setIsModalOpen(true);
  };

  const handleSave = (sowData) => {
    if (selectedSOW) {
      setSows(sows.map(s => s.id === sowData.id ? sowData : s));
      toast({
        title: "✅ SOW Updated",
        description: `SOW ${sowData.id} has been successfully updated.`,
        className: "bg-[#39ff14] text-black"
      });
    } else {
      const newSow = {
        ...sowData,
        id: `SOW-${String(sows.length + 1).padStart(3, '0')}-${sowData.clientName.split(' ')[0]}-${sowData.department.split(' ')[0]}`,
      };
      setSows([...sows, newSow]);
      toast({
        title: "🎉 SOW Created",
        description: `New SOW ${newSow.id} has been created.`,
        className: "bg-[#39ff14] text-black"
      });
    }
    setIsModalOpen(false);
    setSelectedSOW(null);
  };

  const clientNames = [...new Set(initialMockSOWs.map(s => s.clientName))];
  const departments = [...new Set(initialMockSOWs.map(s => s.department))];

  return (
    <>
      <Helmet>
        <title>SOW Management - GetMax</title>
        <meta name="description" content="Configure and manage Scope of Work entries for each client." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">SOW Management</h1>
          <p className="text-gray-300">Configure service workflows and performance targets.</p>
        </div>

        <SOWFilters
          filters={filters}
          setFilters={setFilters}
          onAddNew={handleAddNew}
          clientNames={clientNames}
          departments={departments}
        />

        <SOWTable sows={filteredSOWs} onEdit={handleEdit} />

        {isModalOpen && (
          <SOWDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sow={selectedSOW}
            onSave={handleSave}
            clientNames={clientNames}
            departments={departments}
          />
        )}
      </div>
    </>
  );
};

export default SOWManagement;