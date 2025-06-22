import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';

const ReassignClaimModal = ({ isOpen, onClose, claim, employees, onSave }) => {
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');

    const handleSave = () => {
        onSave({ employee: selectedEmployee, reason: `${reason}${notes ? `: ${notes}` : ''}` });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-glass-dark border-[#39ff14]/30 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reassign Claim: {claim.id}</DialogTitle>
                    <DialogDescription>
                        Select an eligible employee to assign this claim to.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="employee-select">Eligible Employee</Label>
                        <Select onValueChange={setSelectedEmployee}>
                            <SelectTrigger id="employee-select" className="bg-black/20 border-[#39ff14]/30">
                                <SelectValue placeholder="Select an employee..." />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map(emp => (
                                    <SelectItem key={emp.id} value={emp.name}>
                                        {emp.name} (Ramp: {emp.ramp}%)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason-select">Reassignment Reason</Label>
                        <Select onValueChange={setReason}>
                            <SelectTrigger id="reason-select" className="bg-black/20 border-[#39ff14]/30">
                                <SelectValue placeholder="Select a reason..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High Priority Escalation">High Priority Escalation</SelectItem>
                                <SelectItem value="Workload Balancing">Workload Balancing</SelectItem>
                                <SelectItem value="Specialist Required">Specialist Required</SelectItem>
                                <SelectItem value="Manual Assignment">Manual Assignment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Optional Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any additional notes..."
                            className="bg-black/30 border-[#39ff14]/20"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex-row justify-end gap-2">
                    <Button variant="outline" onClick={onClose} className="border-gray-500/50 text-gray-300 hover:bg-gray-500/20 hover:text-white">
                        <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90" disabled={!selectedEmployee || !reason}>
                        <Save className="mr-2 h-4 w-4" /> Assign Claim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReassignClaimModal;