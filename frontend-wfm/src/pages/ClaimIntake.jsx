import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClaimStats from '@/components/claims/ClaimStats';
import ClaimCard from '@/components/claims/ClaimCard';
import ClaimFilters from '@/components/claims/ClaimFilters';
import UploadIntakeTab from '@/components/claims/UploadIntakeTab';
import AllocationRulesTab from '@/components/claims/AllocationRulesTab';
import ClaimDetailModal from '@/components/claims/ClaimDetailModal';

const mockClaims = [
  {
    id: 'CLM-001',
    clientId: 'MedCare Solutions',
    sowId: 'SOW-2024-001',
    status: 'Assigned',
    priority: 'High',
    aging: 45,
    denialType: 'Prior Auth Required',
    payer: 'Aetna',
    assignedTo: 'Sarah Johnson',
    amount: '$2,450.00',
    receivedDate: '2025-05-06',
    dueDate: '2025-07-05'
  },
  {
    id: 'CLM-002',
    clientId: 'Elite Healthcare',
    sowId: 'SOW-2024-002',
    status: 'In Progress',
    priority: 'Medium',
    aging: 30,
    denialType: 'Missing Documentation',
    payer: 'BCBS',
    assignedTo: 'Michael Chen',
    amount: '$1,850.00',
    receivedDate: '2025-05-21',
    dueDate: '2025-07-20'
  },
  {
    id: 'CLM-003',
    clientId: 'BillPro Services',
    sowId: 'SOW-2024-003',
    status: 'Pending',
    priority: 'Low',
    aging: 15,
    denialType: 'Coding Error',
    payer: 'Medicare',
    assignedTo: 'Unassigned',
    amount: '$950.00',
    receivedDate: '2025-06-05',
    dueDate: '2025-08-04'
  },
    {
    id: 'CLM-004',
    clientId: 'Sunrise Health Group',
    sowId: 'SOW-2024-005',
    status: 'Completed',
    priority: 'Medium',
    aging: 62,
    denialType: 'Service Not Covered',
    payer: 'United Healthcare',
    assignedTo: 'Priya Patel',
    amount: '$3,120.00',
    receivedDate: '2025-04-19',
    dueDate: '2025-06-18'
  },
  {
    id: 'CLM-005',
    clientId: 'MedCare Solutions',
    sowId: 'SOW-2024-001',
    status: 'Pending',
    priority: 'High',
    aging: 5,
    denialType: 'Duplicate Claim',
    payer: 'Cigna',
    assignedTo: 'Unassigned',
    amount: '$5,500.00',
    receivedDate: '2025-06-15',
    dueDate: '2025-08-14'
  },
];

export default function ClaimIntake() {
  const [claims, setClaims] = useState(mockClaims);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);

  const filteredClaims = claims.filter(claim => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = claim.id.toLowerCase().includes(searchLower) ||
                         claim.clientId.toLowerCase().includes(searchLower) ||
                         claim.payer.toLowerCase().includes(searchLower) ||
                         claim.assignedTo.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === 'all' || claim.status.toLowerCase().replace(/\s/g, '') === filterStatus;
    const matchesPriority = filterPriority === 'all' || claim.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
  };

  return (
    <>
      <Helmet>
        <title>Claim Intake & Allocation - GetMax</title>
        <meta name="description" content="Manage claim intake, allocation, and assignment. Upload claims via multiple methods and configure intelligent distribution rules." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Claim Intake & Allocation</h1>
          <p className="text-gray-300">View, filter, and prioritize all uploaded claims in a central command center.</p>
        </div>

        <ClaimStats claims={claims} />

        <Tabs defaultValue="claims" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
            <TabsTrigger value="claims">Claims Management</TabsTrigger>
            <TabsTrigger value="upload">Upload & Intake</TabsTrigger>
            <TabsTrigger value="allocation">Allocation Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="claims" className="space-y-6">
            <ClaimFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
            />
            <div className="space-y-4">
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim, index) => (
                  <ClaimCard 
                    key={claim.id} 
                    claim={claim} 
                    index={index} 
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                 <div className="text-center py-12">
                    <p className="text-white text-lg">No claims match your current filters.</p>
                    <p className="text-gray-400">Try adjusting your search or filter settings.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <UploadIntakeTab />
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <AllocationRulesTab />
          </TabsContent>
        </Tabs>
      </div>
      <ClaimDetailModal 
        claim={selectedClaim} 
        isOpen={!!selectedClaim} 
        onClose={() => setSelectedClaim(null)} 
      />
    </>
  );
}