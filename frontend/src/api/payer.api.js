
import { apiCall } from "./apiClient.js";

export const payerAPI = {
  getAllPayers: () => apiCall("get", "/payers/list"),
  syncClaimMDPayers: () => apiCall("get", "/payers/sync/claimmd")
};
