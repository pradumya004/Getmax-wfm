// backend/src/routes/admin.route.js

import express from 'express';
import {
    getAllCompanies,
    suspendCompany,
    changeSubscriptionPlan,
    getPlatformStats
} from '../controllers/admin/adminController.controller.js';
import { verifyCompanyToken, requireRoleLevel } from '../middlewares/auth.middleware.js';
import { ROLE_LEVELS } from '../constants.js';

const router = express.Router();

// Protect all routes with Super Admin level
router.use(verifyCompanyToken);
router.use(requireRoleLevel(ROLE_LEVELS.SUPER_ADMIN));

// Admin Features
router.get('/companies', getAllCompanies);
router.put('/companies/:companyId/suspend', suspendCompany);
router.put('/companies/:companyId/plan', changeSubscriptionPlan);
router.get('/stats', getPlatformStats);

export default router;
