// backend/src/middlewares/masterAdminAuth.middleware.js

import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateMasterAdminToken, verifyMasterAdminCredentials } from "../utils/jwtHelper.js";

// Verify Master Admin Login Credentials
export const verifyMasterAdminLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Verify against hardcoded credentials
    const isValid = verifyMasterAdminCredentials(email, password);
    if (!isValid) {
        throw new ApiError(401, "Invalid master admin credentials");
    }

    // Generate token
    const token = generateMasterAdminToken();

    // Set secure cookie
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    res.cookie("masterAdminToken", token, cookieOptions);

    // Attach master admin info to request
    req.masterAdmin = {
        email: "sriram@getmaxsolutions.com",
        name: "Sriram",
        role: "MASTER_ADMIN",
        permissions: {
            canViewAllCompanies: true,
            canManageSubscriptions: true,
            canViewPlatformStats: true,
            canSuspendCompanies: true,
            canAccessFinancials: true
        },
        userType: 'master_admin'
    };

    next();
});

// Verify Master Admin Token (for protected routes)
export const verifyMasterAdminToken = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookies or header
        const token = req.cookies?.masterAdminToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Master admin access token is required");
        }

        // Verify token using JWT helper
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is for master admin
        if (decodedToken.type !== 'master_admin' ||
            decodedToken.email !== "sriram@getmaxsolutions.com") {
            throw new ApiError(401, "Invalid master admin token");
        }

        // Attach master admin info to request
        req.masterAdmin = {
            email: "sriram@getmaxsolutions.com",
            name: "Sriram",
            role: "MASTER_ADMIN",
            permissions: {
                canViewAllCompanies: true,
                canManageSubscriptions: true,
                canViewPlatformStats: true,
                canSuspendCompanies: true,
                canAccessFinancials: true
            },
            userType: 'master_admin'
        };

        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid master admin access token");
    }
});

// Check Master Admin Permission
export const requireMasterAdminPermission = (permission) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.masterAdmin) {
            throw new ApiError(401, "Master admin authentication required");
        }

        if (!req.masterAdmin.permissions[permission]) {
            throw new ApiError(403, `Permission '${permission}' required for this operation`);
        }

        next();
    });
};

// Optional Master Admin Auth (for endpoints that can show more data if master admin)
export const optionalMasterAdminAuth = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.masterAdminToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            if (decodedToken.type === 'master_admin' &&
                decodedToken.email === "sriram@getmaxsolutions.com") {
                req.masterAdmin = {
                    email: "sriram@getmaxsolutions.com",
                    name: "Sriram",
                    role: "MASTER_ADMIN",
                    permissions: {
                        canViewAllCompanies: true,
                        canManageSubscriptions: true,
                        canViewPlatformStats: true,
                        canSuspendCompanies: true,
                        canAccessFinancials: true
                    },
                    userType: 'master_admin'
                };
            }
        }
    } catch (error) {
        // Silently fail for optional auth
        console.log('Optional master admin auth failed:', error.message);
    }

    next();
});