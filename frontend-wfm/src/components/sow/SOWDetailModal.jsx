import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SOWInfoTab from '@/components/sow/tabs/SOWInfoTab';
import TargetsTab from '@/components/sow/tabs/TargetsTab';
import QASLATab from '@/components/sow/tabs/QASLATab';
import TaskRulesTab from '@/components/sow/tabs/TaskRulesTab';
import NotesTemplateTab from '@/components/sow/tabs/NotesTemplateTab';

const SOWDetailModal = ({ isOpen, onClose, sow, onSave, clientNames, departments }) => {
  const [sowData, setSowData] = useState({});

  useEffect(() => {
    if (sow) {
      setSowData(sow);
    } else {
      setSowData({
        clientName: '',
        department: '',
        claimFormat: '',
        contractType: '',
        effectiveDate: '',
        endDate: '',
        dailyVolume: 0,
        employeesNeeded: 0,
        backupRatio: 0,
        qaBenchmark: 95,
        slaTat: 24,
        autoAssignment: true,
        allowedStatuses: [],
        status: 'Active',
      });
    }
  }, [sow]);

  const handleSave = () => {
    onSave(sowData);
  };

  const handleChange = (field, value) => {
    setSowData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-glass-dark border-[#39ff14]/20 text-white max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{sow ? `Edit SOW: ${sow.id}` : 'Add New SOW'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure all details for this Scope of Work.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/20 border border-[#39ff14]/20">
              <TabsTrigger value="info">SOW Info</TabsTrigger>
              <TabsTrigger value="targets">Targets & Ramp</TabsTrigger>
              <TabsTrigger value="qa_sla">QA & SLA</TabsTrigger>
              <TabsTrigger value="rules">Task Rules</TabsTrigger>
              <TabsTrigger value="notes">Notes Template</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="info"><SOWInfoTab data={sowData} onChange={handleChange} clientNames={clientNames} departments={departments} /></TabsContent>
              <TabsContent value="targets"><TargetsTab data={sowData} onChange={handleChange} /></TabsContent>
              <TabsContent value="qa_sla"><QASLATab data={sowData} onChange={handleChange} /></TabsContent>
              <TabsContent value="rules"><TaskRulesTab data={sowData} onChange={handleChange} /></TabsContent>
              <TabsContent value="notes"><NotesTemplateTab data={sowData} onChange={handleChange} /></TabsContent>
            </div>
          </Tabs>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88]" onClick={handleSave}>Save SOW</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SOWDetailModal;