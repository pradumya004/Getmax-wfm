import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ClientStats from '@/components/clients/ClientStats';
import ClientFilters from '@/components/clients/ClientFilters';
import ClientList from '@/components/clients/ClientList';

const mockClients = [
  {
    id: 1,
    name: 'MedCare Solutions',
    type: 'Provider',
    subType: 'Hospital',
    contractType: 'End-to-End',
    scopeFormat: 'ClaimMD',
    services: ['AR', 'Coding', 'Charges'],
    status: 'Active',
    sowCount: 12,
    employeeCount: 45,
    compliance: 98.5,
    revenue: '$450K'
  },
  {
    id: 2,
    name: 'Elite Healthcare',
    type: 'Billing Company',
    subType: 'Clinic',
    contractType: 'FTE',
    scopeFormat: 'EMSMC',
    services: ['AR', 'Prior Auth'],
    status: 'Active',
    sowCount: 8,
    employeeCount: 28,
    compliance: 97.2,
    revenue: '$320K'
  },
  {
    id: 3,
    name: 'BillPro Services',
    type: 'Provider',
    subType: 'DME',
    contractType: 'Transactional',
    scopeFormat: 'Medisoft',
    services: ['Coding', 'Charges', 'Denials'],
    status: 'Suspended',
    sowCount: 5,
    employeeCount: 15,
    compliance: 89.1,
    revenue: '$180K'
  }
];

export default function ClientManagement() {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet>
        <title>Client Management - GetMax RCM</title>
        <meta name="description" content="Manage your RCM clients, contracts, and service configurations. Add new clients, configure SOWs, and track performance metrics." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Client Management</h1>
            <p className="text-gray-300">Manage clients, contracts, and service configurations</p>
          </div>
          <Button 
            className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green"
            onClick={() => navigate('/clients/add')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        <ClientStats clients={clients} />
        <ClientFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        
        <ClientList clients={filteredClients} />

        {filteredClients.length === 0 && (
          <Card className="bg-glass-dark border-[#39ff14]/20">
            <CardContent className="p-12 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No clients found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first client'}
              </p>
              <Button 
                className="bg-[#39ff14] text-black hover:bg-[#00ff88]"
                onClick={() => navigate('/clients/add')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}