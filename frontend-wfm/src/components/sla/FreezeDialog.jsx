import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const freezeReasons = [
  'Awaiting Client Response',
  'Awaiting Payer Response',
  'Internal Review',
  'System Issue',
  'Other',
];

const FreezeDialog = ({ isOpen, setIsOpen, claimId }) => {
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!reason) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a reason to freeze the SLA.',
      });
      return;
    }
    toast({
      title: 'SLA Frozen',
      description: `Claim ${claimId} has been frozen due to: ${reason}.`,
    });
    setIsOpen(false);
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-glass-dark border-[#39ff14]/20 text-white">
        <DialogHeader>
          <DialogTitle>Freeze SLA for Claim: {claimId}</DialogTitle>
          <DialogDescription className="text-gray-300">
            Select a reason for freezing the timer. This action will be logged.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white">
              <SelectValue placeholder="Select a reason..." />
            </SelectTrigger>
            <SelectContent>
              {freezeReasons.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88]" onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreezeDialog;