// backend/src/routes/patient.routes.js

import express from 'express';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deactivatePatient,
  bulkUploadPatients
} from '../controllers/patient/patientController.controller.js';

import {
  verifyEmployeeToken,
} from '../middlewares/auth.middleware.js';

import { cleanupMiddleware, uploadBulkMiddleware } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(verifyEmployeeToken);

// CRUD Routes
router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/:id',getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deactivatePatient);

// Bulk Upload
router.post(
  '/upload/bulk',
  uploadBulkMiddleware,  
  bulkUploadPatients,
  cleanupMiddleware
);

export default router;
