import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import IntegrationCard from '@/components/integrations/IntegrationCard';

const IntegrationCategory = ({ value, title, description, icon: Icon, services, onConnect }) => {
  return (
    <AccordionItem value={value} className="bg-glass-dark border border-[#39ff14]/20 rounded-xl px-6">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-4">
          <Icon className="h-8 w-8 text-brand-green" />
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {services.map((service) => (
            <IntegrationCard key={service.id} service={service} onConnect={() => onConnect(service)} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default IntegrationCategory;