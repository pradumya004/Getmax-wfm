// backend/src/controllers/client.controller.js

import asyncHandler from 'express-async-handler';
import { Client } from '../models/client.model.js';
import { ApiError } from '../utils/ApiError.js';

// 1. Create Client
export const createClient = asyncHandler(async (req, res) => {
  const clientData = req.body;

  clientData.companyRef = req.companyId;
  clientData.auditInfo = {
    createdBy: req.employeeId,
    lastModifiedBy: req.employeeId,
  };

  const client = await Client.create(clientData);
  res.status(201).json({ success: true, data: client });
});

// 2. Get All Clients (with filters)
export const getAllClients = asyncHandler(async (req, res) => {
  const { search, status, ehr, workflowType } = req.query;
  const filter = { companyRef: req.companyId };

  if (status) filter['status.clientStatus'] = status;
  if (ehr) filter['integrationStrategy.ehrPmSystem.systemName'] = ehr;
  if (workflowType) filter['integrationStrategy.workflowType'] = workflowType;

  if (search) {
    filter.$or = [
      { 'clientInfo.clientName': { $regex: search, $options: 'i' } },
      { 'clientInfo.legalName': { $regex: search, $options: 'i' } },
      { 'contactInfo.primaryContact.email': { $regex: search, $options: 'i' } },
    ];
  }

  const clients = await Client.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: clients });
});

// 3. Get Client by ID
export const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id)
    .populate('serviceAgreements.activeSOWs')
    .populate('auditInfo.createdBy', 'personalInfo.firstName personalInfo.lastName')
    .populate('auditInfo.lastModifiedBy', 'personalInfo.firstName personalInfo.lastName');

  if (!client) throw new ApiError(404, 'Client not found');
  res.status(200).json({ success: true, data: client });
});

// 4. Update Client Info
export const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new ApiError(404, 'Client not found');

  Object.assign(client, req.body);
  client.auditInfo.lastModifiedBy = req.employeeId;
  await client.save();

  res.status(200).json({ success: true, data: client });
});

// 5. Deactivate Client (Soft Delete)
export const deactivateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new ApiError(404, 'Client not found');

  client.status.clientStatus = 'Terminated';
  client.systemInfo.isActive = false;
  client.auditInfo.lastModifiedBy = req.employeeId;

  await client.save();
  res.status(200).json({ success: true, message: 'Client deactivated' });
});

// 6. Update Integration Config
export const updateIntegrationConfig = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new ApiError(404, 'Client not found');

  client.integrationStrategy = req.body;
  client.auditInfo.lastModifiedBy = req.employeeId;
  await client.save();

  res.status(200).json({ success: true, data: client.integrationStrategy });
});

// 7. Update Data Processing Config
export const updateProcessingConfig = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new ApiError(404, 'Client not found');

  client.dataProcessingConfig = req.body;
  client.auditInfo.lastModifiedBy = req.employeeId;
  await client.save();

  res.status(200).json({ success: true, data: client.dataProcessingConfig });
});

// 8. Update Financial Info
export const updateFinancialInfo = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new ApiError(404, 'Client not found');

  client.financialInfo = req.body;
  client.auditInfo.lastModifiedBy = req.employeeId;
  await client.save();

  res.status(200).json({ success: true, data: client.financialInfo });
});

// 9. Upload Agreements (MSA or BAA)
export const uploadAgreements = asyncHandler(async (req, res) => {
  const { type, signed, signedDate, expiryDate, documentPath } = req.body;
  const client = await Client.findById(req.params.id);

  if (!client) throw new ApiError(404, 'Client not found');
  if (!['msa', 'baa'].includes(type)) throw new ApiError(400, 'Invalid agreement type');

  const agreement = { signed, signedDate, expiryDate, documentPath };

  if (type === 'msa') client.serviceAgreements.masterServiceAgreement = agreement;
  if (type === 'baa') client.serviceAgreements.hipaaBAA = agreement;

  client.auditInfo.lastModifiedBy = req.employeeId;
  await client.save();

  res.status(200).json({ success: true, message: `${type.toUpperCase()} uploaded successfully` });
});

// 10. Update Sync Status
export const updateSyncStatus = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new ApiError(404, 'Client not found');

  client.integrationStrategy.apiConfig.syncStatus = req.body.syncStatus;
  client.auditInfo.lastModifiedBy = req.employeeId;

  await client.save();
  res.status(200).json({ success: true, message: 'Sync status updated' });
});

// 11. Get Clients Needing Onboarding
export const getClientsNeedingOnboarding = asyncHandler(async (req, res) => {
  const clients = await Client.find({
    companyRef: req.companyId,
    'status.onboardingStatus': { $ne: 'Completed' },
  });

  res.status(200).json({ success: true, data: clients });
});

// 12. Get Active Clients
export const getActiveClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({
    companyRef: req.companyId,
    'systemInfo.isActive': true,
    'status.clientStatus': 'Active',
  });

  res.status(200).json({ success: true, data: clients });
});

// 13. Get Clients by EHR
export const getClientsByEHR = asyncHandler(async (req, res) => {
  const ehr = req.params.ehr;
  const clients = await Client.find({
    companyRef: req.companyId,
    'integrationStrategy.ehrPmSystem.systemName': ehr,
  });

  res.status(200).json({ success: true, data: clients });
});

// 14. Check if Client is Ready for SOW
export const checkSOWReadiness = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new ApiError(404, 'Client not found');

  const isReady =
    client.serviceAgreements.masterServiceAgreement?.signed &&
    client.serviceAgreements.hipaaBAA?.signed &&
    client.integrationStrategy?.workflowType &&
    client.status?.onboardingStatus === 'Go Live';

  res.status(200).json({ success: true, data: { ready: !!isReady } });
});

// 15. Get Decrypted API Credentials (Admins Only)
export const getDecryptedCredentials = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).select('+integrationStrategy.apiConfig.encryptedCredentials');
  if (!client) throw new ApiError(404, 'Client not found');

  const decrypted = client.decryptCredentials(); // method must exist in model
  res.status(200).json({ success: true, data: decrypted });
});
