// backend/src/middlewares/auth.middleware.js

import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employee } from '../models/employee.model.js';
import { Company } from "../models/company.model.js";
import { Role } from "../models/role.model.js";
import { getClientIP } from "../utils/helpers.js";

// Verify Company Authentication Token
export const verifyCompanyToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.companyToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Access token is required");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedToken.type !== 'company') {
            throw new ApiError(401, "Invalid token type - company token required");
        }

        const company = await Company.findById(decodedToken?.id).select("-companyPassword");

        if (!company) {
            throw new ApiError(401, "Invalid company access token - company not found");
        }

        if (!company.isActive) {
            throw new ApiError(403, "Company account is suspended or inactive");
        }

        if (company.subscriptionStatus !== 'Active') {
            throw new ApiError(403, "Company subscription is not active");
        }

        req.company = company;
        next();
    } catch (error) {
        throw new ApiError(401, error || "Invalid access token");
    }
});

// Verify Employee Authentication Token
export const verifyEmployeeToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.employeeToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Employee access token is required");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedToken.type !== 'employee') {
            throw new ApiError(401, "Invalid token type - employee token required");
        }

        const employee = await Employee.findById(decodedToken.employeeId)
            .populate('companyRef', 'companyName subscriptionStatus isActive securitySettings')
            .populate('roleRef', 'roleName permissions roleLevel')
            .populate('departmentRef', 'departmentName')
            .populate('designationRef', 'designationName')
            .select("-authentication.passwordHash");

        if (!employee) {
            throw new ApiError(401, "Invalid employee access token - employee not found");
        }

        if (employee.status.employeeStatus !== 'Active') {
            throw new ApiError(403, `Employee account is ${employee.status.employeeStatus.toLowerCase()}`);
        }

        if (!employee.systemInfo.isActive) {
            throw new ApiError(403, "Employee account is deactivated");
        }

        if (!employee.companyRef.isActive) {
            throw new ApiError(403, "Company account is suspended");
        }

        if (employee.companyRef.subscriptionStatus !== 'Active') {
            throw new ApiError(403, "Company subscription is not active");
        }

        // IP-based security check (optional based on company settings)
        const clientIP = getClientIP(req);
        const securitySettings = employee.companyRef.securitySettings || {};

        if (securitySettings.workingIPs && securitySettings.workingIPs.length > 0) {
            const isFromOffice = securitySettings.workingIPs.some(ipObj =>
                clientIP.includes(ipObj.ip)
            );

            if (!isFromOffice && !securitySettings.remoteWorkEnabled) {
                throw new ApiError(403, "Access restricted to office network only");
            }
        }

        // Update last activity (optional - don't fail if this fails)
        try {
            employee.systemInfo.lastLogin = new Date();
            employee.systemInfo.lastLoginIP = clientIP;
            await employee.save({ validateBeforeSave: false });
        } catch (updateError) {
            console.warn('Failed to update employee last activity:', updateError.message);
        }

        req.employee = employee;
        req.company = employee.companyRef;
        next();
    } catch (error) {
        throw new ApiError(401, error || "Invalid access token");
    }
});

// Verify API Key (for external integrations)
export const verifyApiKey = asyncHandler(async (req, res, next) => {
    const apiKey = req.header("X-API-Key") || req.query.apiKey;

    if (!apiKey) {
        throw new ApiError(401, "API Key is required for this endpoint");
    }

    const company = await Company.findByApiKey(apiKey);

    if (!company) {
        throw new ApiError(401, "Invalid API Key");
    }

    if (!company.apiEnabled) {
        throw new ApiError(403, "API access is disabled for this company");
    }

    if (!company.isActive) {
        throw new ApiError(403, "Company account is suspended");
    }

    if (company.subscriptionStatus !== 'Active') {
        throw new ApiError(403, "Company subscription is not active");
    }

    req.company = company;
    req.isApiRequest = true;
    next();
});

// Role-based Permission Middleware
export const requirePermission = (resource, action) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.employee) {
            throw new ApiError(401, "Employee authentication required for permission check");
        }

        const employee = req.employee;
        const role = employee.roleRef;

        if (!role) {
            throw new ApiError(403, "No role assigned to employee");
        }

        // Check if role can perform the action on the resource
        const hasPermission = role.canPerform(resource, action);

        if (!hasPermission) {
            throw new ApiError(403, `Insufficient permissions: Cannot ${action} ${resource}`);
        }

        next();
    });
};

// Role Level Middleware
export const requireRoleLevel = (minLevel) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.employee) {
            throw new ApiError(401, "Employee authentication required for role level check");
        }

        const employee = req.employee;
        const roleLevel = employee.roleRef?.roleLevel || 0;

        if (roleLevel < minLevel) {
            throw new ApiError(403, `Insufficient role level: Required ${minLevel}, current ${roleLevel}`);
        }

        next();
    });
};

// Data Access Middleware
export const requireDataAccess = (dataType, scope = 'ViewOwn') => {
    return asyncHandler(async (req, res, next) => {
        if (!req.employee) {
            throw new ApiError(401, "Employee authentication required for data access check");
        }

        const employee = req.employee;
        const role = employee.roleRef;

        if (!role) {
            throw new ApiError(403, "No role assigned to employee");
        }

        const hasAccess = role.canAccessData(dataType, scope);

        if (!hasAccess) {
            throw new ApiError(403, `Insufficient data access: Cannot access ${dataType} with scope ${scope}`);
        }

        req.dataScope = scope;
        next();
    });
};

// Company Ownership Middleware
export const requireCompanyOwnership = asyncHandler(async (req, res, next) => {
    const requestedCompanyId = req.params.companyId || req.body.companyId;

    // For company tokens
    if (req.company && (req.company.companyId === requestedCompanyId || req.company._id.toString() === requestedCompanyId)) {
        return next();
    }

    // For employee tokens
    if (req.employee &&
        (req.employee.companyRef.companyId === requestedCompanyId ||
            req.employee.companyRef._id.toString() === requestedCompanyId)) {
        return next();
    }

    throw new ApiError(403, "Access denied: Cannot access this company's data");
});

// Employee Self-Access or Manager Access Middleware
export const requireEmployeeAccess = asyncHandler(async (req, res, next) => {
    const requestedEmployeeId = req.params.employeeId || req.body.employeeId;

    if (!req.employee) {
        throw new ApiError(401, "Employee authentication required for employee access check");
    }

    const currentEmployee = req.employee;

    // Employee can access their own data
    if (currentEmployee.employeeId === requestedEmployeeId ||
        currentEmployee._id.toString() === requestedEmployeeId) {
        req.accessScope = 'self';
        return next();
    }

    // Check if current employee is a manager of the requested employee
    const targetEmployee = await Employee.findOne({
        $or: [
            { employeeId: requestedEmployeeId.toUpperCase() },
            { _id: requestedEmployeeId }
        ],
        companyRef: currentEmployee.companyRef._id
    });

    if (!targetEmployee) {
        throw new ApiError(404, "Requested employee not found");
    }

    const isManager = targetEmployee.reportingStructure.directManager?.equals(currentEmployee._id);
    const isTeamLead = targetEmployee.reportingStructure.teamLead?.equals(currentEmployee._id);
    const hasManagePermission = currentEmployee.roleRef?.canPerform('employee', 'Manage');

    if (isManager || isTeamLead || hasManagePermission) {
        req.accessScope = 'manager';
        req.targetEmployee = targetEmployee;
        return next();
    }

    throw new ApiError(403, "Access denied: Cannot access this employee's data");
});

// Subscription Plan Middleware
export const requireSubscriptionPlan = (requiredPlans) => {
    return asyncHandler(async (req, res, next) => {
        const plans = Array.isArray(requiredPlans) ? requiredPlans : [requiredPlans];

        let company;
        if (req.company) {
            company = req.company;
        } else if (req.employee) {
            company = req.employee.companyRef;
        } else {
            throw new ApiError(401, "Authentication required for subscription check");
        }

        if (!plans.includes(company.subscriptionPlan)) {
            throw new ApiError(403, `This feature requires ${plans.join(' or ')} subscription plan. Current plan: ${company.subscriptionPlan}`);
        }

        if (company.subscriptionStatus !== 'Active') {
            throw new ApiError(403, `Subscription is ${company.subscriptionStatus}. Please contact support.`);
        }

        next();
    });
};

// Optional Authentication Middleware
export const optionalAuth = asyncHandler(async (req, res, next) => {
    const employeeToken = req.cookies?.employeeToken || req.header("Authorization")?.replace("Bearer ", "");
    const companyToken = req.cookies?.companyToken;

    // Try employee token first
    if (employeeToken) {
        try {
            const decodedToken = jwt.verify(employeeToken, process.env.JWT_SECRET);
            if (decodedToken.type === 'employee') {
                const employee = await Employee.findById(decodedToken.employeeId)
                    .populate('companyRef', 'companyName subscriptionStatus isActive')
                    .populate('roleRef', 'roleName permissions roleLevel')
                    .select("-authentication.passwordHash");

                if (employee &&
                    employee.status.employeeStatus === 'Active' &&
                    employee.companyRef.isActive) {
                    req.employee = employee;
                }
            }
        } catch (error) {
            // Silently fail for optional auth
            console.log('Optional employee auth failed:', error.message);
        }
    }

    // Try company token if no employee token worked
    if (!req.employee && companyToken) {
        try {
            const decodedToken = jwt.verify(companyToken, process.env.JWT_SECRET);
            if (decodedToken.type === 'company') {
                const company = await Company.findById(decodedToken.id).select("-companyPassword");

                if (company && company.isActive) {
                    req.company = company;
                }
            }
        } catch (error) {
            // Silently fail for optional auth
            console.log('Optional company auth failed:', error.message);
        }
    }

    next();
});

// Admin or Super Admin Only
export const requireAdminAccess = asyncHandler(async (req, res, next) => {
    // Check for company admin access
    if (req.company) {
        return next();
    }

    // Check for employee with admin permissions
    if (req.employee && req.employee.roleRef) {
        const roleLevel = req.employee.roleRef.roleLevel;
        if (roleLevel >= 8) { // Admin level or above
            return next();
        }
    }

    throw new ApiError(403, "Admin access required for this operation");
});

// Super Admin Only
export const requireSuperAdminAccess = asyncHandler(async (req, res, next) => {
    // Check for company super admin access (company owner)
    if (req.company) {
        return next();
    }

    // Check for employee with super admin permissions
    if (req.employee && req.employee.roleRef) {
        const roleLevel = req.employee.roleRef.roleLevel;
        if (roleLevel >= 10) { // Super Admin level
            return next();
        }
    }

    throw new ApiError(403, "Super Admin access required for this operation");
});