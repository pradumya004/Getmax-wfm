import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import FloatingPoolTable from '@/components/floating-pool/FloatingPoolTable';
import ReassignClaimModal from '@/components/floating-pool/ReassignClaimModal';
import { useToast } from '@/components/ui/use-toast';

const mockClaims = [
  { id: 'CLM-098', priority: 'High', dos: '2025-05-10', balance: '$1500.00', payer: 'Aetna', sow: 'SOW-004-Sunrise-AR', timeInPool: '2 hours', slaRisk: true },
  { id: 'CLM-101', priority: 'Medium', dos: '2025-05-12', balance: '$750.00', payer: 'Cigna', sow: 'SOW-005-Elite-Coding', timeInPool: '45 mins', slaRisk: false },
  { id: 'CLM-085', priority: 'Low', dos: '2025-05-09', balance: '$300.00', payer: 'United', sow: 'SOW-004-Sunrise-AR', timeInPool: '5 hours', slaRisk: true },
  { id: 'CLM-112', priority: 'Medium', dos: '2025-05-14', balance: '$2200.00', payer: 'Aetna', sow: 'SOW-005-Elite-Coding', timeInPool: '1.5 hours', slaRisk: false },
];

const mockEligibleEmployees = [
    { id: 'EMP-001', name: 'John Doe', ramp: 98 },
    { id: 'EMP-002', name: 'Jane Smith', ramp: 95 },
    { id: 'EMP-007', name: 'Peter Jones', ramp: 88 },
];

const FloatingPool = () => {
    const { toast } = useToast();
    const [claims, setClaims] = useState(mockClaims);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReassignClick = (claim) => {
        setSelectedClaim(claim);
        setIsModalOpen(true);
    };

    const handleReassignSave = ({ employee, reason }) => {
        console.log(`Reassigning claim ${selectedClaim.id} to ${employee} for reason: ${reason}`);
        setClaims(claims.filter(c => c.id !== selectedClaim.id));
        toast({
            title: '✅ Claim Reassigned',
            description: `Claim ${selectedClaim.id} has been successfully reassigned to ${employee}.`,
            className: 'bg-[#39ff14] text-black',
        });
        setIsModalOpen(false);
        setSelectedClaim(null);
    };

    return (
        <>
            <Helmet>
                <title>Floating Pool - GetMax</title>
                <meta name="description" content="View and assign claims from the unassigned floating pool." />
            </Helmet>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Floating Pool</h1>
                    <p className="text-gray-300">Manually assign high-priority or unassigned claims.</p>
                </div>
                
                <FloatingPoolTable claims={claims} onReassign={handleReassignClick} />

                {selectedClaim && (
                    <ReassignClaimModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        claim={selectedClaim}
                        employees={mockEligibleEmployees}
                        onSave={handleReassignSave}
                    />
                )}
            </div>
        </>
    );
};

export default FloatingPool;