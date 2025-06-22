import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shield, Settings } from 'lucide-react';
import PermissionsModal from './PermissionsModal';

const initialRoles = [
  { name: 'Super Admin', description: 'Full access to all features and settings.' },
  { name: 'Client Admin', description: 'Manages specific client accounts and their users.' },
  { name: 'Team Manager', description: 'Oversees team performance and daily operations.' },
  { name: 'QA Analyst', description: 'Audits claims and provides quality feedback.' },
  { name: 'Billing Staff', description: 'Handles claim intake and processing.' },
];

const PermissionsTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleConfigure = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="bg-glass-dark border-[#39ff14]/20">
        <CardHeader>
          <CardTitle className="text-white">Access & Permissions</CardTitle>
          <CardDescription className="text-gray-400">Configure Role-Based Access Control (RBAC) for your team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-[#39ff14]/20 hover:bg-transparent">
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialRoles.map((role) => (
                  <TableRow key={role.name} className="border-b-[#39ff14]/10">
                    <TableCell className="font-medium text-white flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#39ff14]" />
                      {role.name}
                    </TableCell>
                    <TableCell className="text-gray-400">{role.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleConfigure(role)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedRole && (
        <PermissionsModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          role={selectedRole}
        />
      )}
    </>
  );
};

export default PermissionsTab;