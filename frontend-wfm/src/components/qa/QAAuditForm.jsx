import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const QAAuditForm = ({ claimData }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    score: 100,
    errorCategory: '',
    subType: '',
    remarks: '',
    verdict: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "✅ Audit Submitted!",
      description: `Feedback for claim ${claimData.claimId} has been sent to ${claimData.empName}.`,
      className: "bg-[#39ff14] text-black"
    });
    navigate('/qa');
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-glass-dark border-[#39ff14]/20">
          <CardHeader>
            <CardTitle className="text-white">QA Scoring & Feedback</CardTitle>
            <CardDescription className="text-gray-300">Deduct points for errors and provide detailed remarks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">QA Score (out of 100)</label>
                <Input type="number" name="score" value={formData.score} onChange={handleInputChange} className="bg-black/20 border-[#39ff14]/30 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Error Category</label>
                <Select name="errorCategory" onValueChange={(v) => handleSelectChange('errorCategory', v)}>
                  <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Denial">Denial</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Non-compliance">Non-compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Sub-Type</label>
              <Select name="subType" onValueChange={(v) => handleSelectChange('subType', v)} disabled={!formData.errorCategory}>
                <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue placeholder="Select sub-type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incorrect appeal reason">Incorrect appeal reason</SelectItem>
                  <SelectItem value="Missing document">Missing document</SelectItem>
                  <SelectItem value="HIPAA violation">HIPAA violation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">QA Remarks</label>
              <Textarea name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="Provide detailed comments for the employee..." className="bg-black/20 border-[#39ff14]/30 text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Verdict</label>
              <Select name="verdict" onValueChange={(v) => handleSelectChange('verdict', v)}>
                <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white"><SelectValue placeholder="Select final verdict" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="Critical Error">Critical Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green">
            Submit + Notify Employee
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1 sticky top-24">
        <Card className="bg-glass-dark border-[#39ff14]/20">
          <CardHeader>
            <CardTitle className="text-white">Claim Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Claim ID</span>
              <span className="text-white font-mono">{claimData.claimId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Employee</span>
              <Badge variant="secondary">{claimData.empName}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">SOW Type</span>
              <Badge variant="outline" className="border-[#39ff14]/30 text-[#39ff14]">{claimData.sowType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Audit Trigger</span>
              <span className="text-white">{claimData.auditTrigger}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default QAAuditForm;