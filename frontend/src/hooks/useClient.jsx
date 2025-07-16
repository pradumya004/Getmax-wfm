// frontend/src/hooks/useClient.jsx

import { useState, useEffect } from "react";
import { useApi } from "./useApi.jsx";
import { clientAPI } from "../api/client.api.js";
import { toast } from "react-hot-toast";

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
  const { execute: bulkUploadClients } = useApi(clientAPI.bulkUpload);

  // Config Updaters
  const { execute: updateIntegration } = useApi(clientAPI.updateIntegration);
  const { execute: updateFinancial } = useApi(clientAPI.updateFinancial);
  const { execute: updateSyncStatus } = useApi(clientAPI.updateSyncStatus);

  // Agreements
  const { execute: updateAgreements } = useApi(clientAPI.updateAgreements);

  // Filtering
  const { execute: getClientsByEHR } = useApi(clientAPI.getByEHR);
  const { execute: getClientsNeedingOnboarding } = useApi(
    clientAPI.getNeedingOnboarding
  );
  const { execute: getActiveClients } = useApi(clientAPI.getActive);

  // SOW readiness
  const { execute: checkSOWReadiness } = useApi(clientAPI.checkSOWReadiness);

  // Decryption (admin-only)
  const { execute: getDecryptedCredentials } = useApi(
    clientAPI.getDecryptedCredentials
  );

  // Fetch client by ID
  const { execute: fetchClientById } = useApi(clientAPI.getClientById);

  const loadClients = async (params = {}) => {
    console.log("🔍 Fetching Clients...");
    console.log("Params:", params);
    const res = await fetchClients(params);
    console.log("Response:", res);
    const clientList = Array.isArray(res)
      ? res
      : res?.data ?? res?.clients ?? [];
    console.log("Setting clients:", clientList);
    setClients(clientList);
    return clientList;
  };

  const addClient = async (data) => {
    console.log("➕ Creating Client:", data);
    const res = await createClient(data);
    if (res) await loadClients();
    return res;
  };

  const editClient = async (id, data) => {
    console.log("✏️ Updating Client:", id, data);
    const res = await updateClient(id, data);
    if (res) await loadClients();
    return res;
  };

  const removeClient = async (id) => {
    console.log("🗑️ Deleting Client:", id);
    const res = await deleteClient(id);
    if (res) await loadClients();
    return res;
  };

  const uploadBulkClients = async (clientsData) => {
    console.log("📤 Bulk Uploading Clients:", clientsData);
    const res = await bulkUploadClients(clientsData);
    if (res) {
      await loadClients(); // Refresh the list
    }
    return res;
  };

  const updateClientIntegration = async (id, integrationData) => {
    console.log("🔧 Updating Integration:", id, integrationData);
    const res = await updateIntegration(id, integrationData);
    if (res) {
      await loadClients(); // Refresh the list
    }
    return res;
  };

  const updateClientFinancial = async (id, financialData) => {
    console.log("💰 Updating Financial:", id, financialData);
    const res = await updateFinancial(id, financialData);
    if (res) {
      await loadClients(); // Refresh the list
    }
    return res;
  };

  const updateClientSyncStatus = async (id, syncData) => {
    console.log("🔄 Updating Sync Status:", id, syncData);
    const res = await updateSyncStatus(id, syncData);
    if (res) {
      await loadClients(); // Refresh the list
    }
    return res;
  };

  const updateClientAgreements = async (id, agreements) => {
    console.log("📄 Updating Agreements:", id, agreements);
    const res = await updateAgreements(id, agreements);
    if (res) {
      await loadClients(); // Refresh the list
    }
    return res;
  };

  const getClientsByEHRSystem = async (ehrSystem) => {
    console.log("🏥 Getting Clients by EHR:", ehrSystem);
    return await getClientsByEHR(ehrSystem);
  };

  const getPendingOnboardingClients = async () => {
    console.log("📋 Getting Pending Onboarding Clients");
    return await getClientsNeedingOnboarding();
  };

  const getAllActiveClients = async () => {
    console.log("✅ Getting Active Clients");
    return await getActiveClients();
  };

  const validateSOWReadiness = async (id) => {
    console.log("✔️ Checking SOW Readiness:", id);
    return await checkSOWReadiness(id);
  };

  const getClientById = async (id) => {
    console.log("👁️ Fetching Client by ID:", id);
    return await fetchClientById(id);
  };

  const fetchDecryptedCredentials = async (id) => {
    console.log("🔐 Fetching Decrypted Credentials:", id);
    return await getDecryptedCredentials(id);
  };

  useEffect(() => {
    loadClients();
  }, []);

  return {
    // State
    clients,
    loading,
    error,

    // Functions
    loadClients,
    addClient,
    editClient,
    removeClient,
    uploadBulkClients,
    updateClientIntegration,
    updateClientFinancial,
    updateClientSyncStatus,
    updateClientAgreements,
    getClientsByEHRSystem,
    getPendingOnboardingClients,
    getAllActiveClients,
    validateSOWReadiness,
    getClientById,
    fetchDecryptedCredentials,

    // Direct execute functions (for advanced usage)
    execute: {
      fetchClients,
      createClient,
      updateClient,
      deleteClient,
      bulkUploadClients,
      updateIntegration,
      updateFinancial,
      updateSyncStatus,
      updateAgreements,
      getClientsByEHR,
      getClientsNeedingOnboarding,
      getActiveClients,
      checkSOWReadiness,
      getClientById,
      getDecryptedCredentials,
    },
  };
};
