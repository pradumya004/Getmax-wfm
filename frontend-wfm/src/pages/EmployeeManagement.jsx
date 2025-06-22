import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Plus } from 'lucide-react';

import EmployeeStats from '@/components/employees/EmployeeStats';
import EmployeeFilters from '@/components/employees/EmployeeFilters';
import EmployeeCard from '@/components/employees/EmployeeCard';
import AddEmployeeDialog from '@/components/employees/AddEmployeeDialog';

const mockEmployees = [
  {
    id: 'EMP-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'AR Caller',
    assignedSOW: 'SOW-2024-001',
    status: 'Active',
    productivity: 92,
    qaScore: 96,
    xpPoints: 2450,
    loginActivated: true,
    joinDate: '2024-01-15'
  },
  {
    id: 'EMP-002',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'QA Specialist',
    assignedSOW: 'SOW-2024-002',
    status: 'Active',
    productivity: 88,
    qaScore: 99,
    xpPoints: 3200,
    loginActivated: true,
    joinDate: '2024-02-01'
  },
  {
    id: 'EMP-003',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@company.com',
    role: 'Team Lead',
    assignedSOW: 'Multiple',
    status: 'Active',
    productivity: 95,
    qaScore: 98,
    xpPoints: 4100,
    loginActivated: true,
    joinDate: '2023-11-20'
  },
  {
    id: 'EMP-004',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'Coder',
    assignedSOW: 'SOW-2024-003',
    status: 'Inactive',
    productivity: 0,
    qaScore: 94,
    xpPoints: 1800,
    loginActivated: false,
    joinDate: '2024-03-10'
  }
];

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || emp.role === filterRole;
    const matchesStatus = filterStatus === 'all' || emp.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddEmployee = (newEmployee, callback) => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const employee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      ...newEmployee,
      status: 'Active',
      productivity: 0,
      qaScore: 0,
      xpPoints: 0,
      loginActivated: false,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setEmployees([...employees, employee]);
    callback();
    
    toast({
      title: "Employee added successfully!",
      description: `${employee.name} has been added. Login activation email will be sent.`
    });
  };

  return (
    <>
      <Helmet>
        <title>Employee Management - GetMax RCM</title>
        <meta name="description" content="Manage your RCM workforce. Add employees, assign roles, track performance, and manage SOW assignments." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Employee Management</h1>
            <p className="text-gray-300">Manage workforce, roles, and SOW assignments</p>
          </div>
          <AddEmployeeDialog onAddEmployee={handleAddEmployee} />
        </div>

        <EmployeeStats employees={employees} />
        <EmployeeFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => (
            <EmployeeCard key={employee.id} employee={employee} index={index} />
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card className="bg-glass-dark border-[#39ff14]/20">
            <CardContent className="p-12 text-center">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No employees found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first employee'}
              </p>
              <AddEmployeeDialog onAddEmployee={handleAddEmployee}>
                <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                </Button>
              </AddEmployeeDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}