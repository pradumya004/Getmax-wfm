// backend/src/routes/client.routes.js

import express from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deactivateClient,
  updateIntegrationConfig,
  updateProcessingConfig,
  updateFinancialInfo,
  getDecryptedCredentials,
  getClientsNeedingOnboarding,
  getActiveClients,
  getClientsByEHR,
  checkSOWReadiness,
  uploadAgreements,
  updateSyncStatus
} from '../controllers/client.controller.js';

import {
  verifyEmployeeToken,
  requirePermission,
  requireRoleLevel
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// 🔐 Protect all client routes with employee auth
router.use(verifyEmployeeToken);

// ===================
// 📁 CRUD Operations
// ===================
router.post(
  '/',
  requirePermission('client', 'Create'),
  createClient
);

router.get(
  '/',
  requirePermission('client', 'View'),
  getAllClients
);

router.get(
  '/:id',
  requirePermission('client', 'View'),
  getClientById
);

router.put(
  '/:id',
  requirePermission('client', 'Update'),
  updateClient
);

router.delete(
  '/:id',
  requirePermission('client', 'Delete'),
  deactivateClient
);

// ===================
// 🔧 Config Updates
// ===================
router.put(
  '/:id/integration',
  requirePermission('client', 'Update'),
  updateIntegrationConfig
);

router.put(
  '/:id/processing',
  requirePermission('client', 'Update'),
  updateProcessingConfig
);

router.put(
  '/:id/financial',
  requirePermission('client', 'Update'),
  updateFinancialInfo
);

router.put(
  '/:id/sync-status',
  requirePermission('client', 'Update'),
  updateSyncStatus
);

// ===================
// 📄 Agreements
// ===================
router.put(
  '/:id/agreements',
  requirePermission('client', 'Update'),
  uploadAgreements
);

// ===================
// 📊 Filtering
// ===================
router.get(
  '/ehr/:ehr',
  requirePermission('client', 'View'),
  getClientsByEHR
);

router.get(
  '/onboarding/pending',
  requirePermission('client', 'View'),
  getClientsNeedingOnboarding
);

router.get(
  '/active/list',
  requirePermission('client', 'View'),
  getActiveClients
);

router.get(
  '/:id/sow-ready',
  requirePermission('client', 'View'),
  checkSOWReadiness
);

// ===================
// 🔒 Sensitive Access (Decryption)
// ===================
router.get(
  '/:id/decrypted-creds',
  requirePermission('client', 'ManageCredentials'), // or use requireRoleLevel(9)
  getDecryptedCredentials
);

export default router;
