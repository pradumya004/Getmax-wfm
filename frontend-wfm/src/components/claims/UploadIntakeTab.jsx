import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const uploadMethods = [
  { id: 'api', name: 'API Integration', description: 'Real-time claim data via API' },
  { id: 'excel', name: 'Excel Upload', description: 'Bulk upload via spreadsheet' },
  { id: 'sftp', name: 'SFTP', description: 'Secure file transfer protocol' },
  { id: '835', name: '835 Files', description: 'Electronic remittance advice' }
];

const UploadIntakeTab = () => {
  const [selectedUploadMethod, setSelectedUploadMethod] = useState('api');
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-glass-dark border-[#39ff14]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Upload className="h-5 w-5 text-[#39ff14]" />
            <span>Upload Methods</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Choose your preferred claim intake method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedUploadMethod === method.id
                  ? 'border-[#39ff14] bg-[#39ff14]/10'
                  : 'border-[#39ff14]/20 hover:border-[#39ff14]/40'
              }`}
              onClick={() => setSelectedUploadMethod(method.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{method.name}</h4>
                  <p className="text-sm text-gray-400">{method.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedUploadMethod === method.id
                    ? 'border-[#39ff14] bg-[#39ff14]'
                    : 'border-gray-400'
                }`} />
              </div>
            </div>
          ))}
          <Button 
            className="w-full bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green"
            onClick={handleUpload}
          >
            <Upload className="h-4 w-4 mr-2" />
            Start Upload
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-glass-dark border-[#39ff14]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Settings className="h-5 w-5 text-[#39ff14]" />
            <span>Pre-Check Mappings</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure automatic field mapping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Client ID Mapping
            </label>
            <Select>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client_name">Client Name</SelectItem>
                <SelectItem value="client_code">Client Code</SelectItem>
                <SelectItem value="facility_id">Facility ID</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              SOW ID Mapping
            </label>
            <Select>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service_type">Service Type</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="sow_code">SOW Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Priority Mapping
            </label>
            <Select>
              <SelectTrigger className="bg-black/20 border-[#39ff14]/30 text-white">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aging_days">Aging Days</SelectItem>
                <SelectItem value="claim_amount">Claim Amount</SelectItem>
                <SelectItem value="payer_type">Payer Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadIntakeTab;