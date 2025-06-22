import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const roles = [
  'AR Caller', 'QA Specialist', 'Manager', 'Team Lead', 'Admin', 'Coder', 'Prior Auth Specialist'
];

const sowOptions = [
  'SOW-2024-001', 'SOW-2024-002', 'SOW-2024-003', 'SOW-2024-004'
];

const AddEmployeeDialog = ({ onAddEmployee }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: '',
    assignedSOW: ''
  });

  const handleSubmit = () => {
    onAddEmployee(newEmployee, () => {
      setNewEmployee({ name: '', email: '', role: '', assignedSOW: '' });
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green">
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-glass-dark border-[#39ff14]/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Employee</DialogTitle>
          <DialogDescription className="text-gray-300">
            Add a new team member and configure their role and assignments
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Full Name *
            </label>
            <Input
              placeholder="Enter full name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              className="bg-black/20 border-[#39ff14]/30 text-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Official Email *
            </label>
            <Input
              type="email"
              placeholder="employee@company.com"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
              className="bg-black/20 border-[#39ff14]/30 text-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Role *
            </label>
            <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Assign to SOW
            </label>
            <Select value={newEmployee.assignedSOW} onValueChange={(value) => setNewEmployee({...newEmployee, assignedSOW: value})}>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white">
                <SelectValue placeholder="Select SOW (optional)" />
              </SelectTrigger>
              <SelectContent>
                {sowOptions.map((sow) => (
                  <SelectItem key={sow} value={sow}>{sow}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-[#39ff14] text-black hover:bg-[#00ff88]"
            onClick={handleSubmit}
          >
            Add Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;