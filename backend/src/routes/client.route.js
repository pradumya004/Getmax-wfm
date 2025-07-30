// backend/src/routes/client.route.js

import express from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deactivateClient,
  updateIntegrationConfig,
  updateFinancialInfo,
  getDecryptedCredentials,
  getClientsNeedingOnboarding,
  getActiveClients,
  getClientsByEHR,
  checkSOWReadiness,
  uploadAgreements,
  updateSyncStatus,
  bulkUploadClients
} from '../controllers/client/clientController.controller.js';

import {
  verifyEmployeeToken,
  requirePermission,
  requireRoleLevel,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// 🔐 Protect all client routes with employee auth
router.use(verifyEmployeeToken);

// ===================
// 📁 CRUD Operations
// ===================
router.post(
  '/',
  createClient
);

router.post('/bulk-upload', bulkUploadClients);


router.get(
  '/',
  getAllClients
);

router.get(
  '/details/:id',
  getClientById
);

router.put(
  '/:id',
  updateClient
);

router.delete(
  '/:id',
  deactivateClient
);

// ===================
// 🔧 Config Updates
// ===================
router.put(
  '/:id/integration',
  updateIntegrationConfig
);

router.put(
  '/:id/financial',
  updateFinancialInfo
);

router.put(
  '/:id/sync-status',
  updateSyncStatus
);

// ===================
// 📄 Agreements
// ===================
router.put(
  '/:id/agreements',
  uploadAgreements
);

// ===================
// 📊 Filtering
// ===================
router.get(
  '/ehr/:ehr',
  getClientsByEHR
);

router.get(
  '/onboarding/pending',
  getClientsNeedingOnboarding
);

router.get(
  '/active/list',
  getActiveClients
);

router.get(
  '/:id/sow-ready',
  checkSOWReadiness
);

// ===================
// 🔒 Sensitive Access (Decryption)
// ===================
router.get(
  '/:id/decrypted-creds',
  getDecryptedCredentials
);



export default router;
