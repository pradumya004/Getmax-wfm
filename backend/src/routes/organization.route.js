// backend/src/routes/organization.route.js

import express from 'express';
import { verifyCompanyToken, verifyEmployeeToken } from '../middlewares/auth.middleware.js';
import { getAllRoles, createRole, updateRole, deleteRole } from '../controllers/organization/roleContoller.controller.js';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from '../controllers/organization/departmentContoller.controller.js';
import { getAllSubDepartments, createSubDepartment, updateSubDepartment, deleteSubDepartment } from '../controllers/organization/subDepartmentController.controller.js';
import { getAllDesignations, createDesignation, updateDesignation, deleteDesignation } from '../controllers/organization/designationController.controller.js';
import { getOrganizationEnums } from '../controllers/organization/organizationEnums.controller.js';

const router = express.Router();

// Organization Enums
router.get('/enums', verifyCompanyToken, getOrganizationEnums);

// roles routes
router.get('/roles', verifyCompanyToken, getAllRoles);
router.post('/roles', verifyCompanyToken, createRole);
router.put('/roles/:roleId', verifyCompanyToken, updateRole);
router.delete('/roles/:roleId', verifyCompanyToken, deleteRole);

// departments routes
router.get('/departments', verifyCompanyToken, getAllDepartments);
router.post('/departments', verifyCompanyToken, createDepartment);
router.put('/departments/:deptId', verifyCompanyToken, updateDepartment);
router.delete('/departments/:deptId', verifyCompanyToken, deleteDepartment);

// subDepartments routes
router.get('/subdepartments', verifyCompanyToken, getAllSubDepartments);
router.post('/subdepartments', verifyCompanyToken, createSubDepartment);
router.put('/subdepartments/:subdeptId', verifyCompanyToken, updateSubDepartment);
router.delete('/subdepartments/:subdeptId', verifyCompanyToken, deleteSubDepartment);

// Designation routes
router.get('/designations', verifyCompanyToken, getAllDesignations);
router.post('/designations', verifyCompanyToken, createDesignation);
router.put('/designations/:designationId', verifyCompanyToken, updateDesignation);
router.delete('/designations/:designationId', verifyCompanyToken, deleteDesignation);

export default router;