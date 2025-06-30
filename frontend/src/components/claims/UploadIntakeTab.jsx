import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Settings, Zap, Database, Shield, FileText } from 'lucide-react';


const uploadMethods = [
  { 
    id: 'api', 
    name: 'API Integration', 
    description: 'Real-time claim data via API',
    icon: Zap
  },
  { 
    id: 'excel', 
    name: 'Excel Upload', 
    description: 'Bulk upload via spreadsheet',
    icon: FileText
  },
  { 
    id: 'sftp', 
    name: 'SFTP', 
    description: 'Secure file transfer protocol',
    icon: Shield
  },
  { 
    id: '835', 
    name: '835 Files', 
    description: 'Electronic remittance advice',
    icon: Database
  }
];

const UploadIntakeTab = () => {
  const [selectedUploadMethod, setSelectedUploadMethod] = useState('api');

  const handleUpload = () => {
    alert("🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Upload Methods Card */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-t-lg"></div>
            <CardTitle className="text-white flex items-center space-x-3 relative z-10">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Upload Methods</span>
            </CardTitle>
            <CardDescription className="text-blue-100/80 relative z-10 text-base">
              Choose your preferred claim intake method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20 rounded-b-lg pointer-events-none"></div>
            {uploadMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 group ${
                    selectedUploadMethod === method.id
                      ? 'border-blue-400/60 bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/25'
                      : 'border-white/20 hover:border-blue-400/40 hover:bg-white/5'
                  }`}
                  onClick={() => setSelectedUploadMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        selectedUploadMethod === method.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">{method.name}</h4>
                        <p className="text-blue-100/70 text-sm">{method.description}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      selectedUploadMethod === method.id
                        ? 'border-blue-400 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                        : 'border-white/40 group-hover:border-blue-400/60'
                    }`}>
                      {selectedUploadMethod === method.id && (
                        <div className="w-full h-full rounded-full bg-white/30 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedUploadMethod === method.id && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                  )}
                </div>
              );
            })}
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] border-0"
              onClick={handleUpload}
            >
              <Upload className="h-5 w-5 mr-2" />
              Start Upload
            </Button>
          </CardContent>
        </Card>

        {/* Pre-Check Mappings Card */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-t-lg"></div>
            <CardTitle className="text-white flex items-center space-x-3 relative z-10">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Pre-Check Mappings</span>
            </CardTitle>
            <CardDescription className="text-purple-100/80 relative z-10 text-base">
              Configure automatic field mapping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 rounded-b-lg pointer-events-none"></div>
            {[
              { label: 'Client ID Mapping', options: ['Client Name', 'Client Code', 'Facility ID'] },
              { label: 'SOW ID Mapping', options: ['Service Type', 'Department', 'SOW Code'] },
              { label: 'Priority Mapping', options: ['Aging Days', 'Claim Amount', 'Payer Type'] }
            ].map((mapping, index) => (
              <div key={index} className="relative">
                <label className="text-sm font-semibold text-white mb-3 block flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"></div>
                  <span>{mapping.label}</span>
                </label>
                <Select>
                  <SelectTrigger className="backdrop-blur-sm bg-white/10 border border-white/30 text-white hover:bg-white/15 transition-all duration-300 rounded-lg h-12 focus:ring-2 focus:ring-purple-400/50">
                    <SelectValue placeholder="Select field" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-gray-900/90 border border-white/20">
                    {mapping.options.map((option, optIndex) => (
                      <SelectItem 
                        key={optIndex} 
                        value={option.toLowerCase().replace(' ', '_')}
                        className="text-white hover:bg-white/10 focus:bg-white/20"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            
            <div className="pt-4 border-t border-white/20">
              <Button 
                variant="outline" 
                className="w-full backdrop-blur-sm bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-300 rounded-lg h-12 font-semibold"
              >
                <Settings className="h-4 w-4 mr-2" />
                Save Mapping Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UploadIntakeTab;