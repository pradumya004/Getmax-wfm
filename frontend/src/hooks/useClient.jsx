// frontend/src/hooks/useClient.jsx

import { useState, useEffect } from "react";
import { useApi } from "./useApi.jsx";
import { clientAPI } from "../api/client.api.js";

export const useClients = () => {
  const [clients, setClients] = useState([]);

  // Basic CRUD
  const {
    execute: fetchClients,
    loading,
    error,
  } = useApi(clientAPI.getAllClients);
  const { execute: createClient } = useApi(clientAPI.createClient);
  const { execute: updateClient } = useApi(clientAPI.updateClient);
  const { execute: deleteClient } = useApi(clientAPI.deleteClient);
  const { execute: bulkUploadClients } = useApi(clientAPI.bulkUploadClients);

  // Config Updaters
  const { execute: updateIntegrationConfig } = useApi(
    clientAPI.updateIntegrationConfig
  );
  const { execute: updateProcessingConfig } = useApi(
    clientAPI.updateProcessingConfig
  );
  const { execute: updateFinancialInfo } = useApi(
    clientAPI.updateFinancialInfo
  );
  const { execute: updateSyncStatus } = useApi(clientAPI.updateSyncStatus);

  // Agreements
  const { execute: uploadAgreements } = useApi(clientAPI.uploadAgreements);

  // Filtering
  const { execute: getClientsByEHR } = useApi(clientAPI.getClientsByEHR);
  const { execute: getPendingOnboardingClients } = useApi(
    clientAPI.getClientsNeedingOnboarding
  );
  const { execute: getActiveClients } = useApi(clientAPI.getActiveClients);

  // Decryption (admin-only)
  const { execute: getDecryptedCredentials } = useApi(
    clientAPI.getDecryptedCredentials
  );

  // Extra
  const { execute: checkSOWReadiness } = useApi(clientAPI.checkSOWReadiness);
  const { execute: getClientById } = useApi(clientAPI.getClientById);

  const loadClients = async (params = {}) => {
    console.log("🔍 Fetching Clients...");
    console.log("Params:", params);
    const res = await fetchClients(params);
    console.log("Response:", res);
    const clientList = Array.isArray(res) ? res : res?.data ?? [];
    setClients(clientList);
    return clientList;
  };

  useEffect(() => {
    loadClients();
  }, []);

  return {
    // 🔄 Client List
    clients,
    loading,
    error,
    refresh: loadClients,

    // ➕ CRUD
    addClient: async (data) => {
      console.log("🔍 Client Create Payload:", data); // 👈 Check this
      const res = await createClient(data);
      if (res) await loadClients();
      return res;
    },
    editClient: async (id, data) => {
      const res = await updateClient(id, data);
      if (res) await loadClients();
      return res;
    },
    removeClient: async (id) => {
      const res = await deleteClient(id);
      if (res) await loadClients();
      return res;
    },
    uploadClients: async (formData) => {
      const res = await bulkUploadClients(formData);
      if (res) await loadClients();
      return res;
    },

    // ⚙️ Config Updates
    updateIntegrationConfig,
    updateProcessingConfig,
    updateFinancialInfo,
    updateSyncStatus,

    // 📄 Agreements
    uploadAgreements,

    // 🔍 Filters
    getClientsByEHR,
    getPendingOnboardingClients,
    getActiveClients,

    // 🔐 Decryption
    getDecryptedCredentials,

    // 🧠 Insights
    checkSOWReadiness,
    getClientById,
  };
};
