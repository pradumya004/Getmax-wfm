// backend/src/routes/employee.route.js

import express from 'express';
import {
    addEmployee,
    loginEmployee,
    logoutEmployee,
    getEmployeeProfile,
    updateEmployeeProfile,
    uploadEmployeeAvatar,
    bulkUploadEmployees,
    getCompanyEmployees,
    getEmployeeDetails,
    updateEmployee,
    deactivateEmployee,
    reactivateEmployee,
    resetEmployeePassword,
    deleteEmployee,
    getPerformanceLeaderboard
} from "../controllers/employee/empolyeeController.controller.js";
import {
    verifyEmployeeToken,
    verifyCompanyToken,
    requirePermission,
    requireEmployeeAccess,
    requireAdminAccess,
    optionalAuth
} from '../middlewares/auth.middleware.js';
import {
    uploadAvatarMiddleware,
    uploadBulkMiddleware,
    cleanupMiddleware
} from '../middlewares/upload.middleware.js';

const router = express.Router();


// ============= PUBLIC ROUTES =============
// Employee Authentication
router.post('/login', loginEmployee);

// ============= EMPLOYEE AUTHENTICATED ROUTES =============
// Employee Self-Service (requires employee token)
router.use('/me', verifyEmployeeToken);
router.post('/logout', verifyEmployeeToken, logoutEmployee);
router.get('/me', verifyEmployeeToken, getEmployeeProfile);
router.put('/me', verifyEmployeeToken, updateEmployeeProfile);
router.post('/me/avatar', verifyEmployeeToken, uploadAvatarMiddleware, uploadEmployeeAvatar);

// ============= COMPANY ADMIN ROUTES =============
// Employee Management (requires company token)
router.post('/', verifyCompanyToken, addEmployee);
router.post('/bulk', verifyCompanyToken, uploadBulkMiddleware, cleanupMiddleware, bulkUploadEmployees);

// Employee CRUD Operations
router.get('/', verifyCompanyToken, getCompanyEmployees);
router.get('/leaderboard', verifyCompanyToken, getPerformanceLeaderboard);
router.get('/:employeeId', verifyCompanyToken, getEmployeeDetails);
router.put('/:employeeId', verifyCompanyToken, updateEmployee);

// Employee Status Management
router.put('/:employeeId/deactivate', verifyCompanyToken, deactivateEmployee);
router.put('/:employeeId/reactivate', verifyCompanyToken, reactivateEmployee);
router.put('/:employeeId/reset-password', verifyCompanyToken, resetEmployeePassword);
router.delete('/:employeeId', verifyCompanyToken, deleteEmployee);

// ============= MIXED ACCESS ROUTES =============
// Routes that can be accessed by either employee (for self) or company admin (for any employee)
router.get('/:employeeId/profile', optionalAuth, requireEmployeeAccess, getEmployeeDetails);

export default router;