// backend/src/routes/index.route.js

import express from 'express';
import companyRoutes from './company.route.js';
import employeeRoutes from './employee.route.js';
import masterAdminRoutes from './masterAdmin.route.js';
import organizationRoutes from './organization.route.js';
import clientRoutes from './client.route.js';
import sowRoutes from './sow.route.js';
import patientRoutes from './patient.route.js';
import payerRoutes from './payer.route.js';
import claimTaskRoutes from './claimTask.route.js';
import adminRoutes from './admin.route.js';

const router = express.Router();

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'GetMax WFM API v1.0',
        version: '1.0.0',
        endpoints: {
            companies: '/api/companies',
            employees: '/api/employees'
        },
        documentation: 'https://docs.getmax.com/api',
        status: 'active'
    });
});

router.use('/company', companyRoutes);
router.use('/employees', employeeRoutes);
router.use('/master-admin', masterAdminRoutes);
router.use('/admin', adminRoutes);
router.use('/org-data', organizationRoutes);
router.use('/clients', clientRoutes);
router.use('/sows', sowRoutes);
router.use('/patients', patientRoutes);
router.use('/payers', payerRoutes);
router.use('/claim-tasks', claimTaskRoutes);

export default router;