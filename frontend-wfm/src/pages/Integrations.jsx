import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Accordion } from '@/components/ui/accordion';
import IntegrationCategory from '@/components/integrations/IntegrationCategory';
import ActivityLog from '@/components/integrations/ActivityLog';
import IntegrationModal from '@/components/integrations/IntegrationModal';
import { useToast } from '@/components/ui/use-toast';
import { DatabaseZap, MessageSquare, KeyRound, BrainCircuit, Webhook, Plug } from 'lucide-react';

const initialIntegrations = {
  'Billing & EHR APIs': {
    description: 'Connect with Electronic Health Record and billing systems.',
    icon: DatabaseZap,
    services: [
      { id: 'epic', name: 'Epic', status: 'Not Connected', scopes: ['Claim Intake', 'Eligibility', 'Status Check'] },
      { id: 'athenahealth', name: 'AthenaHealth', status: 'Not Connected', scopes: ['Claim Intake', 'Patient Records'] },
      { id: 'advancedmd', name: 'AdvancedMD', status: 'Not Connected', scopes: ['Claim Intake', 'Billing'] },
    ],
  },
  'Communication': {
    description: 'Enable SMS, WhatsApp, and email notifications.',
    icon: MessageSquare,
    services: [
      { id: 'twilio', name: 'Twilio', status: 'Active', scopes: ['SMS Alerts', 'Voice Calls'] },
      { id: 'sendgrid', name: 'SendGrid', status: 'Not Connected', scopes: ['Email Notifications'] },
    ],
  },
  'Authentication': {
    description: 'Enable Single Sign-On (SSO) for your team.',
    icon: KeyRound,
    services: [
      { id: 'google_sso', name: 'Google SSO', status: 'Not Connected', scopes: ['User Authentication'] },
      { id: 'azure_ad', name: 'Azure AD', status: 'Not Connected', scopes: ['User Authentication', 'Group Sync'] },
      { id: 'okta', name: 'Okta', status: 'Not Connected', scopes: ['User Authentication'] },
    ],
  },
  'AI/NLP Tools': {
    description: 'Leverage AI for advanced data processing.',
    icon: BrainCircuit,
    services: [
      { id: 'gpt4', name: 'GPT-4 API', status: 'Not Connected', scopes: ['Note Summarization', 'Denial Prediction'] },
    ],
  },
  'Webhooks & Custom': {
    description: 'Create custom triggers and integrations.',
    icon: Webhook,
    services: [
      { id: 'slack', name: 'Slack', status: 'Not Connected', scopes: ['QA Alerts', 'SLA Breach Notifications'] },
      { id: 'custom_webhook', name: 'Custom Webhook', status: 'Not Connected', scopes: ['Claim Intake', 'Task Updates'] },
    ],
  },
};

const initialActivityLog = [
    { id: 1, service: 'Twilio', status: 'Active', connectedOn: '12/06/2025', lastSync: '21/06/2025' },
    { id: 2, service: 'Epic EHR', status: 'Failed', connectedOn: '—', lastSync: '—' },
];

const Integrations = () => {
  const title = "Integrations";
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [activityLog, setActivityLog] = useState(initialActivityLog);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const handleConnectClick = (service, category) => {
    setSelectedIntegration({ ...service, category });
    setModalOpen(true);
  };

  const handleDisconnect = (serviceId) => {
    let serviceName = '';
    const newIntegrations = { ...integrations };
    for (const category in newIntegrations) {
        const service = newIntegrations[category].services.find(s => s.id === serviceId);
        if (service) {
            service.status = 'Not Connected';
            serviceName = service.name;
            break;
        }
    }
    setIntegrations(newIntegrations);
    setActivityLog(prev => prev.filter(log => log.service.toLowerCase().includes(serviceName.toLowerCase()) === false));
    toast({
        title: "Disconnected",
        description: `Successfully disconnected from ${serviceName}.`,
    });
  };

  const handleSaveIntegration = (serviceData) => {
    const { id, category } = serviceData;
    const newIntegrations = { ...integrations };
    const serviceIndex = newIntegrations[category].services.findIndex(s => s.id === id);
    
    if (serviceIndex !== -1) {
        newIntegrations[category].services[serviceIndex].status = 'Active';
        setIntegrations(newIntegrations);

        const existingLogIndex = activityLog.findIndex(log => log.service.toLowerCase().includes(serviceData.name.toLowerCase()));
        const newLogEntry = {
            id: activityLog.length + 1,
            service: serviceData.name,
            status: 'Active',
            connectedOn: new Date().toLocaleDateString(),
            lastSync: new Date().toLocaleDateString(),
        };

        if (existingLogIndex !== -1) {
            setActivityLog(prev => {
                const updatedLog = [...prev];
                updatedLog[existingLogIndex] = newLogEntry;
                return updatedLog;
            });
        } else {
            setActivityLog(prev => [newLogEntry, ...prev]);
        }
    }

    setModalOpen(false);
    toast({
        title: "✅ Connection Successful!",
        description: `Successfully connected to ${serviceData.name}.`,
        className: "bg-[#39ff14] text-black"
    });
  };

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content="Connect GetMax with 3rd-party EHRs, claim scrubbers, and more." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Plug className="h-8 w-8 text-brand-green" />
            {title}
          </h1>
          <p className="text-gray-300">Connect GetMax with your favorite tools for seamless workflow execution.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-0">
              {Object.entries(integrations).map(([category, data], index) => (
                <IntegrationCategory
                  key={category}
                  value={`item-${index}`}
                  title={category}
                  description={data.description}
                  icon={data.icon}
                  services={data.services}
                  onConnect={(service) => handleConnectClick(service, category)}
                />
              ))}
            </Accordion>
          </div>
          <div className="lg:col-span-1">
            <ActivityLog logs={activityLog} onDisconnect={handleDisconnect} />
          </div>
        </div>
      </div>
      {selectedIntegration && (
        <IntegrationModal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          integration={selectedIntegration}
          onSave={handleSaveIntegration}
        />
      )}
    </>
  );
};

export default Integrations;