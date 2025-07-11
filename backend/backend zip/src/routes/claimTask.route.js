// backend/src/routes/claimtasks.routes.js

import express from 'express';
import {
  createClaimTask,
  getAllClaimTasks,
  getClaimTaskById,
  updateClaimTask,
  deactivateClaimTask,
  bulkUploadClaims
} from '../controllers/claimtasks.controller.js';

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

// CRUD
router.post('/', requirePermission('claim', 'Create'), createClaimTask);
router.get('/', requirePermission('claim', 'View'), getAllClaimTasks);
router.get('/:id', requirePermission('claim', 'View'), getClaimTaskById);
router.put('/:id', requirePermission('claim', 'Update'), updateClaimTask);
router.delete('/:id', requirePermission('claim', 'Delete'), deactivateClaimTask);

// Bulk upload
router.post(
  '/upload/bulk',
  uploadBulkMiddleware,
  requirePermission('claim', 'Create'),
  bulkUploadClaims,
  cleanupMiddleware
);

export default router;
