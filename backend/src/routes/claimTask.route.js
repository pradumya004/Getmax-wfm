// backend/src/routes/claimtasks.routes.js

import express from 'express';
import {
  createClaimTask,
  getAllClaimTasks,
  getClaimTaskById,
  updateClaimTask,
  deactivateClaimTask,
  bulkUploadClaims
} from '../controllers//claimtask/claimTaskController.controller.js';

import {
  verifyEmployeeToken,
  requirePermission
} from '../middlewares/auth.middleware.js';

import {
  uploadBulkMiddleware,
  cleanupMiddleware
} from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(verifyEmployeeToken);

// CRUD // need to implement permission logic...
router.post('/', createClaimTask);
router.get('/', getAllClaimTasks);
router.get('/:id', getClaimTaskById);
router.put('/:id', updateClaimTask);
router.delete('/:id', deactivateClaimTask);

// Bulk upload
router.post(
  '/upload/bulk',
  uploadBulkMiddleware,
  bulkUploadClaims,
  cleanupMiddleware
);

export default router;
