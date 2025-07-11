// backend/src/utils/jwtHelper.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { MASTER_ADMIN_CREDENTIALS } from '../constants.js';

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET Loaded:", JWT_SECRET);


// Generate Company Token
export const generateCompanyToken = (companyId) => {
    return jwt.sign(
        {
            id: companyId,
            type: 'company'
        },
        JWT_SECRET,
        { expiresIn: process.env.COMPANY_TOKEN_EXPIRY || '7d' }
    );
};

// Generate Employee Token with role and company info
export const generateEmployeeToken = (payload) => {
    return jwt.sign(
        {
            employeeId: payload.employeeId,
            companyId: payload.companyId,
            role: payload.role,
            email: payload.email,
            type: 'employee'
        },
        JWT_SECRET,
        { expiresIn: process.env.EMPLOYEE_TOKEN_EXPIRY || '8h' }
    );
};

// Verify Company Token
export const verifyCompanyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'company') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Verify Employee Token
export const verifyEmployeeToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'employee') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Generate Master Admin JWT Token
export const generateMasterAdminToken = () => {
    return jwt.sign(
        {
            email: MASTER_ADMIN_CREDENTIALS.email,
            name: MASTER_ADMIN_CREDENTIALS.name,
            role: MASTER_ADMIN_CREDENTIALS.role,
            type: 'master_admin',
            permissions: {
                canViewAllCompanies: true,
                canManageSubscriptions: true,
                canViewPlatformStats: true,
                canSuspendCompanies: true,
                canAccessFinancials: true
            }
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY || "24h"
        }
    );
};

// Verify Master Admin Credentials
export const verifyMasterAdminCredentials = (email, password) => {
    return email.toLowerCase() === MASTER_ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === MASTER_ADMIN_CREDENTIALS.password;
};

// Verify Master Admin JWT Token
export const verifyMasterAdminToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if it's a master admin token
        if (decoded.type !== 'master_admin' ||
            decoded.email !== MASTER_ADMIN_CREDENTIALS.email) {
            throw new Error('Invalid master admin token');
        }

        return decoded;
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

// Get Master Admin Info (for responses)
export const getMasterAdminInfo = () => {
    return {
        email: MASTER_ADMIN_CREDENTIALS.email,
        name: MASTER_ADMIN_CREDENTIALS.name,
        role: MASTER_ADMIN_CREDENTIALS.role,
        userType: 'master_admin',
        permissions: {
            canViewAllCompanies: true,
            canManageSubscriptions: true,
            canViewPlatformStats: true,
            canSuspendCompanies: true,
            canAccessFinancials: true
        }
    };
};

// Check if email belongs to master admin
export const isMasterAdminEmail = (email) => {
    return email?.toLowerCase() === MASTER_ADMIN_CREDENTIALS.email.toLowerCase();
};

// Get Master Admin Display Name
export const getMasterAdminDisplayName = () => {
    return MASTER_ADMIN_CREDENTIALS.name;
};

// Export credentials for reference (without password)
export const MASTER_ADMIN_PUBLIC_INFO = {
    email: MASTER_ADMIN_CREDENTIALS.email,
    name: MASTER_ADMIN_CREDENTIALS.name,
    role: MASTER_ADMIN_CREDENTIALS.role
};