import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SOPFilters from '@/components/sop/SOPFilters';
import SOPList from '@/components/sop/SOPList';
import SOPDetailModal from '@/components/sop/SOPDetailModal';
import { useToast } from '@/components/ui/use-toast';

const mockSOPs = [
    { id: 'SOP-001', title: 'Aetna Prior Auth Denial', client: 'Sunrise Health Group', sow: 'SOW-004-Sunrise-AR', version: 2, createdBy: 'Admin', createdAt: '2025-06-01', content: '### Step 1: Verify Denial Code\nCheck for denial code **OA123**. If present, proceed to Step 2.\n\n### Step 2: Contact Payer\nCall Aetna at **1-800-555-1234** and reference the auth number.', attachments: [] },
    { id: 'SOP-002', title: 'Coding Error Resolution', client: 'Elite Healthcare', sow: 'SOW-005-Elite-Coding', version: 1, createdBy: 'Admin', createdAt: '2025-05-20', content: 'Review CPT codes against medical records. Correct any discrepancies and resubmit claim.', attachments: [] },
    { id: 'SOP-003', title: 'Inactive Policy Follow-up', client: 'Sunrise Health Group', sow: 'SOW-004-Sunrise-AR', version: 3, createdBy: 'Manager', createdAt: '2025-06-10', content: 'Contact patient to obtain new insurance information. Update patient demographics and rebill to new payer.', attachments: [] },
];

const mockClients = ['Sunrise Health Group', 'Elite Healthcare', 'BillPro Services'];
const mockSows = ['SOW-004-Sunrise-AR', 'SOW-005-Elite-Coding', 'SOW-006-BillPro-Denial'];

const SOPManagement = () => {
    const { toast } = useToast();
    const [sops, setSops] = useState(mockSOPs);
    const [filters, setFilters] = useState({ client: 'all', sow: 'all' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSOP, setSelectedSOP] = useState(null);

    const handleAddNew = () => {
        setSelectedSOP(null);
        setIsModalOpen(true);
    };

    const handleEdit = (sop) => {
        setSelectedSOP(sop);
        setIsModalOpen(true);
    };

    const handleSave = (sopData) => {
        if (selectedSOP) {
            setSops(sops.map(s => s.id === sopData.id ? { ...s, ...sopData, version: s.version + 1, createdAt: new Date().toISOString().split('T')[0] } : s));
            toast({ title: '✅ SOP Updated', description: `SOP "${sopData.title}" has been updated.`, className: 'bg-[#39ff14] text-black' });
        } else {
            const newSop = { ...sopData, id: `SOP-00${sops.length + 1}`, version: 1, createdBy: 'Admin', createdAt: new Date().toISOString().split('T')[0] };
            setSops([...sops, newSop]);
            toast({ title: '🎉 SOP Created', description: `New SOP "${newSop.title}" has been created.`, className: 'bg-[#39ff14] text-black' });
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <Helmet>
                <title>SOP Management - GetMax</title>
                <meta name="description" content="Manage and view client-specific Standard Operating Procedures." />
            </Helmet>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">SOP Management</h1>
                    <p className="text-gray-300">Create, edit, and view Standard Operating Procedures.</p>
                </div>
                <SOPFilters onAddNew={handleAddNew} clients={mockClients} sows={mockSows} setFilters={setFilters} />
                <SOPList sops={sops} onEdit={handleEdit} filters={filters}/>
                {isModalOpen && (
                    <SOPDetailModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        sop={selectedSOP}
                        onSave={handleSave}
                        clients={mockClients}
                        sows={mockSows}
                    />
                )}
            </div>
        </>
    );
};

export default SOPManagement;