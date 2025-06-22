import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FileText, User, Building, DollarSign, Calendar, Clock, ShieldAlert, History, X, Save, MessageSquare } from 'lucide-react';
import NoteTemplateGenerator from './NoteTemplateGenerator';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'assigned': return 'bg-blue-500 text-white';
    case 'in progress': return 'bg-yellow-500 text-black';
    case 'pending': return 'bg-gray-500 text-white';
    case 'completed': return 'bg-[#39ff14] text-black';
    default: return 'bg-gray-500 text-white';
  }
};

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-500 text-white';
    case 'medium': return 'bg-orange-500 text-white';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const DetailItem = ({ icon: Icon, label, value, children }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-[#39ff14] mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      {value && <p className="text-base text-white font-medium">{value}</p>}
      {children}
    </div>
  </div>
);

const ClaimDetailModal = ({ claim, isOpen, onClose }) => {
  const { toast } = useToast();
  const [status, setStatus] = useState('');
  const [generatedNote, setGeneratedNote] = useState('');

  useEffect(() => {
    if (claim) {
      setStatus(claim.status);
      setGeneratedNote('');
    }
  }, [claim]);

  if (!claim) return null;

  const mockHistory = [
    { action: 'Claim Created', user: 'System', date: '2025-06-15' },
    { action: 'Priority set to High', user: 'System', date: '2025-06-15' },
    { action: 'Assigned to Sarah Johnson', user: 'Admin', date: '2025-06-16' },
  ];

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved! (Simulated)",
      description: "Your updates to the claim have been recorded.",
      className: "bg-[#39ff14] text-black border-0",
    });
    console.log({
      claimId: claim.id,
      newStatus: status,
      notes: generatedNote,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-glass-dark border-[#39ff14]/30 text-white sm:max-w-4xl p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <FileText className="text-[#39ff14]" />
            Claim Details: {claim.id}
          </DialogTitle>
          <DialogDescription>
            A comprehensive overview of the claim, its status, and history.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[75vh] overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-[#39ff14] border-b border-[#39ff14]/20 pb-2">Core Information</h3>
                <DetailItem icon={User} label="Assigned To" value={claim.assignedTo} />
                <DetailItem icon={Building} label="Client" value={claim.clientId} />
                <DetailItem icon={FileText} label="SOW Reference" value={claim.sowId} />
                <DetailItem icon={DollarSign} label="Payer" value={claim.payer} />
              </div>

              <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-[#39ff14] border-b border-[#39ff14]/20 pb-2">Financials & Status</h3>
                <DetailItem icon={DollarSign} label="Claim Amount" value={claim.amount} />
                <DetailItem icon={ShieldAlert} label="Denial Type" value={claim.denialType} />
                <DetailItem icon={Clock} label="Current Status">
                  <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                </DetailItem>
                <DetailItem icon={ShieldAlert} label="Priority">
                  <Badge className={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                </DetailItem>
              </div>

              <div className="sm:col-span-2 space-y-4 p-4 bg-black/20 rounded-lg">
                <h3 className="text-lg font-semibold text-[#39ff14] border-b border-[#39ff14]/20 pb-2">Timeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <DetailItem icon={Calendar} label="Received Date" value={new Date(claim.receivedDate).toLocaleDateString()} />
                  <DetailItem icon={Calendar} label="Due Date" value={new Date(claim.dueDate).toLocaleDateString()} />
                  <DetailItem icon={Clock} label="Aging" value={`${claim.aging} days`} />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-black/20 rounded-lg">
              <h3 className="text-lg font-semibold text-[#39ff14] border-b border-[#39ff14]/20 pb-2 flex items-center gap-2">
                <History className="h-5 w-5" />
                Action History
              </h3>
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {mockHistory.map((item, index) => (
                  <li key={index} className="text-sm">
                    <p className="text-white">{item.action}</p>
                    <p className="text-gray-400 text-xs">by {item.user} on {item.date}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-[#39ff14]/20">
             <h3 className="text-xl font-semibold text-[#39ff14] mb-4">Take Action</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="claim-status" className="text-gray-300 flex items-center gap-2"><Clock className="h-4 w-4" />Update Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="claim-status" className="bg-black/20 border-[#39ff14]/30">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Assigned">Assigned</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <NoteTemplateGenerator onNoteUpdate={setGeneratedNote} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-notes" className="text-gray-300 flex items-center gap-2"><MessageSquare className="h-4 w-4" />Consolidated Note Preview</Label>
                  <Textarea 
                    id="custom-notes" 
                    placeholder="Notes will be generated here based on the category selected above..." 
                    className="min-h-[100px] bg-black/30 border-[#39ff14]/20 text-gray-300"
                    value={generatedNote}
                    readOnly
                  />
                </div>
             </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-[#39ff14]/20 flex-row justify-end gap-2 bg-black/10">
          <Button variant="outline" onClick={onClose} className="border-gray-500/50 text-gray-300 hover:bg-gray-500/20 hover:text-white">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSaveChanges} className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90">
             <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimDetailModal;