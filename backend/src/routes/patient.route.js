// backend/src/routes/patient.routes.js

import express from 'express';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deactivatePatient,
  bulkUploadPatients
} from '../controllers/patient.controller.js';

import {
  verifyEmployeeToken,
  requirePermission
} from '../middlewares/auth.middleware.js';

import { cleanupMiddleware, uploadBulkMiddleware } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(verifyEmployeeToken);

// CRUD Routes
router.post('/', requirePermission('patient', 'Create'), createPatient);
router.get('/', requirePermission('patient', 'View'), getAllPatients);
router.get('/:id', requirePermission('patient', 'View'), getPatientById);
router.put('/:id', requirePermission('patient', 'Update'), updatePatient);
router.delete('/:id', requirePermission('patient', 'Delete'), deactivatePatient);

// Bulk Upload
router.post(
  '/upload/bulk',
  uploadBulkMiddleware,  
  requirePermission('patient', 'Create'),
  bulkUploadPatients,
  cleanupMiddleware
);

export default router;
