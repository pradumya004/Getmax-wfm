import React from 'react';
import { Helmet } from 'react-helmet';
import AddClientWizard from '@/components/clients/AddClientWizard';

const AddClient = () => {
  return (
    <>
      <Helmet>
        <title>Client Contract Setup - GetMax RCM</title>
        <meta name="description" content="A step-by-step wizard to onboard new clients and configure their contracts and SOWs." />
      </Helmet>
      <AddClientWizard />
    </>
  );
};

export default AddClient;