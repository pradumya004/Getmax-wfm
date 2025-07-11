// backend/src/routes/masterAdmin.route.js

import express from 'express';
import {
    // Authentication
    loginMasterAdmin,
    logoutMasterAdmin,
    getMasterAdminProfile,

    // Company Management
    getAllCompanies,
    getCompanyDetails,
    toggleCompanyStatus,
    changeSubscriptionPlan,

    // Platform Analytics
    getPlatformStats,
    getAllEmployeesAcrossPlatform
} from '../controllers/admin/masterAdminController.controller.js';

import {
    verifyMasterAdminLogin,
    verifyMasterAdminToken,
    requireMasterAdminPermission
} from '../middlewares/masterAdminAuth.middleware.js';

const router = express.Router();

// ============= PUBLIC ROUTES =============
// Master Admin Authentication (hardcoded credentials)
router.post('/login', verifyMasterAdminLogin, loginMasterAdmin);

// ============= PROTECTED ROUTES =============
// Apply master admin authentication to all routes below
router.use(verifyMasterAdminToken);

// Profile & Authentication Management
router.post('/logout', logoutMasterAdmin);
router.get('/profile', getMasterAdminProfile);

// ============= COMPANY MANAGEMENT =============
// View all companies using the platform
router.get('/companies',
    requireMasterAdminPermission('canViewAllCompanies'),
    getAllCompanies
);

// Get detailed company information with analytics
router.get('/companies/:companyId',
    requireMasterAdminPermission('canViewAllCompanies'),
    getCompanyDetails
);

// Suspend or activate companies
router.put('/companies/:companyId/status',
    requireMasterAdminPermission('canSuspendCompanies'),
    toggleCompanyStatus
);

// Change company subscription plans
router.put('/companies/:companyId/subscription',
    requireMasterAdminPermission('canManageSubscriptions'),
    changeSubscriptionPlan
);

// ============= PLATFORM ANALYTICS & MONITORING =============
// Get comprehensive platform statistics
router.get('/platform-stats',
    requireMasterAdminPermission('canViewPlatformStats'),
    getPlatformStats
);

// Shorter alias for stats
router.get('/stats',
    requireMasterAdminPermission('canViewPlatformStats'),
    getPlatformStats
);

// View all employees across all companies
router.get('/employees',
    requireMasterAdminPermission('canViewAllCompanies'),
    getAllEmployeesAcrossPlatform
);

// ============= SYSTEM MONITORING =============
// System health endpoint
router.get('/system-health', (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development"
    });
});

// ============= FINANCIAL ANALYTICS =============
// Revenue and financial data (placeholder for future implementation)
router.get('/financial-stats',
    requireMasterAdminPermission('canAccessFinancials'),
    (req, res) => {
        res.status(200).json({
            message: "Financial analytics endpoint - coming soon",
            placeholder: true,
            availableEndpoints: [
                "Monthly recurring revenue",
                "Subscription conversion rates",
                "Customer lifetime value",
                "Churn analysis"
            ]
        });
    }
);

// ============= DASHBOARD DATA AGGREGATION =============
// Combined dashboard data endpoint
router.get('/dashboard-data', async (req, res) => {
    try {
        // This would aggregate multiple endpoints for dashboard
        res.status(200).json({
            message: "Combined dashboard data endpoint",
            recommendation: "Use individual endpoints (/stats, /companies) for better performance"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Dashboard data aggregation failed"
        });
    }
});

// ============= BULK OPERATIONS =============
// Bulk company operations (future implementation)
router.put('/companies/bulk-status',
    requireMasterAdminPermission('canSuspendCompanies'),
    (req, res) => {
        res.status(200).json({
            message: "Bulk company status operations - coming soon",
            supportedOperations: ["bulk suspend", "bulk activate", "bulk plan change"]
        });
    }
);

export default router;