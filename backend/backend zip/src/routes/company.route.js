// backend/src/routes/company.route.js

import express from 'express';
import {
    registerCompany,
    loginCompany,
    logoutCompany,
    getCompanyProfile
} from '../controllers/company/companyController.controller.js';
import {
    getOrganizationalData,
    downloadEmployeeTemplate
} from '../controllers/company/orgController.controller.js';
import { verifyCompanyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Company Auth
router.post('/register', registerCompany);
router.post('/login', loginCompany);
router.post('/logout', verifyCompanyToken, logoutCompany);
router.get('/profile', verifyCompanyToken, getCompanyProfile);

// Organizational Utilities
router.get('/org-data', verifyCompanyToken, getOrganizationalData);
router.get('/employee-template', verifyCompanyToken, downloadEmployeeTemplate);

export default router;
