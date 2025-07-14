// backend/src/routes/sow.route.js

import express from 'express';
import {
  createSOW,
  getAllSOWs,
  getSOWById,
  updateSOW,
  assignEmployeesToSOW,
  changeSOWStatus,
  getClientSOWs
} from '../controllers/sow/sowController.controller.js';

import {
  verifyEmployeeToken,
  requirePermission
} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyEmployeeToken);

// CRUD + View
router.post('/', requirePermission('sow', 'Create'), createSOW);
router.get('/', requirePermission('sow', 'View'), getAllSOWs);
router.get('/:id', requirePermission('sow', 'View'), getSOWById);
router.put('/:id', requirePermission('sow', 'Update'), updateSOW);

// Assign employees
router.put('/:id/assign', requirePermission('sow', 'Update'), assignEmployeesToSOW);

// Status change
router.put('/:id/status', requirePermission('sow', 'Manage'), changeSOWStatus);

// Get all SOWs for a client
router.get('/client/:clientId', requirePermission('sow', 'View'), getClientSOWs);

export default router;
