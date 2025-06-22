import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, FileText, StickyNote, ListChecks, TrendingUp } from 'lucide-react';

const ClientSummaryPreview = ({ formData }) => {
  const { 
    clientName, 
    clientType, 
    contractType, 
    services, 
    notesTemplate,
    intakeFields,
    dailyClaimVolume,
    idealTeamSize
  } = formData;

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Building className="h-5 w-5 text-[#39ff14]" />
          <span>Contract Preview</span>
        </CardTitle>
        <CardDescription className="text-gray-300">
          A summary of the new client contract.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-white">{clientName || "Client Name"}</h4>
          <div className="flex gap-2 mt-1">
            {clientType && <Badge variant="outline">{clientType}</Badge>}
            {contractType && <Badge variant="outline">{contractType}</Badge>}
          </div>
        </div>
        
        <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-300">
                <FileText className="h-4 w-4 text-[#39ff14]" />
                <span className="text-sm font-medium text-white">Services & SOWs</span>
            </div>
            <p className="text-sm text-gray-400">
                {services.filter(s => s.serviceType).length} service(s) defined.
            </p>
        </div>

        <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-300">
                <StickyNote className="h-4 w-4 text-[#39ff14]" />
                <span className="text-sm font-medium text-white">Notes Templates</span>
            </div>
             <p className="text-sm text-gray-400">
                {notesTemplate.filter(n => n.categoryName).length} template field(s) configured.
            </p>
        </div>

        <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-300">
                <ListChecks className="h-4 w-4 text-[#39ff14]" />
                <span className="text-sm font-medium text-white">Intake Fields</span>
            </div>
            <p className="text-sm text-gray-400">
                {intakeFields.length} custom field(s) set up.
            </p>
        </div>
        
        <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-300">
                <TrendingUp className="h-4 w-4 text-[#39ff14]" />
                <span className="text-sm font-medium text-white">Volume & Ramp Plan</span>
            </div>
             <p className="text-sm text-gray-400">
                Daily volume: {dailyClaimVolume || "N/A"} | Team size: {idealTeamSize || "N/A"}
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSummaryPreview;