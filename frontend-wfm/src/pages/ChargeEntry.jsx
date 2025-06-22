import React from 'react';
import { Helmet } from 'react-helmet';
import FileUploadZone from '@/components/charge-entry/FileUploadZone';
import ChargeEntryTable from '@/components/charge-entry/ChargeEntryTable';

const mockFiles = [
    { id: 'SB-001', name: 'superbill_smith_j.pdf', uploadDate: '2025-06-20', status: 'Coded', assignedTo: 'Alice' },
    { id: 'SB-002', name: 'superbill_doe_a.pdf', uploadDate: '2025-06-20', status: 'Pending Coding', assignedTo: 'Bob' },
    { id: 'SB-003', name: 'scan_06192025.pdf', uploadDate: '2025-06-19', status: 'Error', assignedTo: '-' },
    { id: 'SB-004', name: 'superbill_jones_t.pdf', uploadDate: '2025-06-19', status: 'Coded', assignedTo: 'Alice' },
];

const ChargeEntry = () => {
    return (
        <>
            <Helmet>
                <title>Charge Entry - GetMax</title>
                <meta name="description" content="Process PDF superbills for charge entry and medical coding." />
            </Helmet>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Charge Entry & Coding</h1>
                    <p className="text-gray-300">Convert PDF superbills into a streamlined medical coding workflow.</p>
                </div>
                
                <FileUploadZone />

                <div className="pt-4">
                    <h2 className="text-xl font-semibold text-white">Processing Queue</h2>
                    <ChargeEntryTable files={mockFiles} />
                </div>
            </div>
        </>
    );
};

export default ChargeEntry;