// backend/src/routes/index.route.js

import express from 'express';
import companyRoutes from './company.route.js';
import employeeRoutes from './employee.route.js';
import adminRoutes from './admin.route.js';
import masterAdminRoutes from './masterAdmin.route.js';

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

router.use('/companies', companyRoutes);
router.use('/employees', employeeRoutes);
router.use('/admin', adminRoutes);
router.use('/master-admin', masterAdminRoutes);

export default router;