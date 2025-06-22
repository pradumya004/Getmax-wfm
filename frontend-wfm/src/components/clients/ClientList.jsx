import React from 'react';
import ClientCard from '@/components/clients/ClientCard';

const ClientList = ({ clients }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {clients.map((client, index) => (
        <ClientCard key={client.id} client={client} index={index} />
      ))}
    </div>
  );
};

export default ClientList;