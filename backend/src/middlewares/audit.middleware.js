// backend/src/middlewares/audit.middleware.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { getClientIP } from "../utils/helpers";

// In-memory audit log storage
let auditLogs = [];
const MAX_MEMORY_LOGS = 10000;  // Prevent memory leaks

// Create audit log entry
const createAuditLog = (req, action, resource, details = {}) => {
    const timestamp = new Date().toISOString();
    const ipAddress = getClientIP(req);

    const auditEntry = {
        id: `audit_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp,

        // User Information
        user: {
            type: req.employee ? 'employee' : req.company ? 'company' : 'anonymous',
            id: req.employee?._id || req.company?._id || null,
            identifier: req.employee?.employeeId || req.company?.companyEmail || 'unknown',
            name: req.employee?.fullName || req.company?.companyName || 'Unknown User',
            companyId: req.employee?.companyRef?._id || req.company?._id || null,
            roleLevel: req.employee?.roleRef?.roleLevel || null,
            roleName: req.employee?.roleRef?.roleName || null
        },

        // Request Information
        request: {
            method: req.method,
            url: req.originalUrl,
            path: req.path,
            userAgent: req.get('User-Agent') || 'Unknown',
            clientIP,
            sessionId: req.sessionID || null,
            apiKey: req.headers['x-api-key'] ? '***masked***' : null
        },

        // Action Information
        action: {
            type: action,
            resource,
            description: details.description || `${action} on ${resource}`,
            severity: details.severity || 'info', // info, warning, error, critical
            category: details.category || 'general', // auth, data, system, security, compliance
            subcategory: details.subcategory || null
        },

        // Additional Details
        details: {
            resourceId: details.resourceId || null,
            resourceName: details.resourceName || null,
            previousValues: details.previousValues || null,
            newValues: details.newValues || null,
            affectedCount: details.affectedCount || null,
            metadata: details.metadata || {},
            success: details.success !== false, // Default to true unless explicitly false
            errorMessage: details.errorMessage || null,
            duration: details.duration || null
        },

        // Compliance & Security
        compliance: {
            dataClassification: details.dataClassification || 'internal',
            requiresRetention: details.requiresRetention !== false,
            sensitiveData: details.sensitiveData || false,
            regulatoryFramework: details.regulatoryFramework || null // HIPAA, SOX, etc.
        }
    };

    return auditEntry;
};

// Store audit log (in production, this would write to database)
const storeAuditLog = async (auditEntry) => {
    try {
        // Add to in-memory audit log
        auditLogs.push(auditEntry);

        // Prevent memory leaks
        if (auditLogs.length > MAX_MEMORY_LOGS) {
            auditLogs = auditLogs.slice(-MAX_MEMORY_LOGS);
        }

        // Store audit log (in production, this would write to database)
        // await AuditLog.create(auditEntry);

        // console.log('Audit log entry stored:', auditEntry);

        // For critical actions, you might also send to external logging service
        if (['critical', 'error'].includes(auditEntry.action.severity)) {
            console.warn('CRITICAL AUDIT LOG:', auditEntry);
        }

        return true;
    } catch (error) {
        console.error('Failed to store audit log:', error);
        return false;
    }
};

// Main Audit Log Middleware
export const auditLog = (action, resource, options = {}) => {
    return asyncHandler(async (req, res, next) => {
        const startTime = Date.now();

        // Store original methods to capture response data
        const originalSend = res.send;
        const originalJson = res.json;

        let responseData = null;
        let responseStatus = null;

        // Override response methods to capture data
        res.send = function (data) {
            responseData = data;
            responseStatus = res.statusCode;
            return originalSend.call(this, data);
        };

        res.json = function (data) {
            responseData = data;
            responseStatus = res.statusCode;
            return originalJson.call(this, data);
        };

        // Continue with the request
        next();

        // Log after response is sent
        res.on('finish', async () => {
            const duration = Date.now() - startTime;
            const success = responseStatus < 400;

            const auditDetails = {
                ...options,
                duration,
                success,
                errorMessage: !success ? responseData?.message || 'Request failed' : null,
                metadata: {
                    ...options.metadata,
                    responseStatus,
                    requestBody: req.method !== 'GET' ? req.body : undefined,
                    queryParams: Object.keys(req.query).length > 0 ? req.query : undefined
                }
            };

            // Mask sensitive data
            if (auditDetails.metadata?.requestBody?.password) {
                auditDetails.metadata.requestBody.password = '***masked***';
            }

            const auditEntry = createAuditLog(req, action, resource, auditDetails);
            await storeAuditLog(auditEntry);
        });
    });
};

// Specific audit middleware for different operations

// Authentication audit
export const auditAuth = (action) => {
    return auditLog(action, 'authentication', {
        category: 'auth',
        severity: 'info',
        requiresRetention: true,
        description: `User ${action}`,
        dataClassification: 'internal'
    });
};

// Data modification audit
export const auditDataChange = (resource, action = 'modify') => {
    return auditLog(action, resource, {
        category: 'data',
        severity: 'info',
        requiresRetention: true,
        description: `${action} ${resource} data`,
        dataClassification: 'confidential'
    });
};

// Security-related audit
export const auditSecurity = (action, resource) => {
    return auditLog(action, resource, {
        category: 'security',
        severity: 'warning',
        requiresRetention: true,
        description: `Security action: ${action} on ${resource}`,
        dataClassification: 'restricted'
    });
};

// Compliance audit (HIPAA, etc.)
export const auditCompliance = (action, resource, framework = 'HIPAA') => {
    return auditLog(action, resource, {
        category: 'compliance',
        severity: 'info',
        requiresRetention: true,
        regulatoryFramework: framework,
        description: `${framework} compliance action: ${action} on ${resource}`,
        dataClassification: 'restricted',
        sensitiveData: true
    });
};

// System administration audit
export const auditSystem = (action, resource) => {
    return auditLog(action, resource, {
        category: 'system',
        severity: 'info',
        requiresRetention: true,
        description: `System administration: ${action} on ${resource}`,
        dataClassification: 'internal'
    });
};

// Bulk operation audit
export const auditBulkOperation = (action, resource, count) => {
    return auditLog(action, resource, {
        category: 'data',
        severity: 'info',
        requiresRetention: true,
        affectedCount: count,
        description: `Bulk ${action} on ${count} ${resource} records`,
        dataClassification: 'confidential'
    });
};

// Failed access attempt audit
export const auditFailedAccess = (resource, reason) => {
    return auditLog('access_denied', resource, {
        category: 'security',
        severity: 'warning',
        requiresRetention: true,
        success: false,
        errorMessage: reason,
        description: `Failed access attempt to ${resource}: ${reason}`,
        dataClassification: 'restricted'
    });
};

// Manual audit log function (for use in controllers)
export const createManualAuditLog = async (req, action, resource, details = {}) => {
    const auditEntry = createAuditLog(req, action, resource, details);
    return await storeAuditLog(auditEntry);
};

// Get audit logs (for admin interface)
export const getAuditLogs = (filters = {}) => {
    let filteredLogs = [...auditLogs];

    // Apply filters
    if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.user.id === filters.userId);
    }

    if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action.type === filters.action);
    }

    if (filters.resource) {
        filteredLogs = filteredLogs.filter(log => log.action.resource === filters.resource);
    }

    if (filters.category) {
        filteredLogs = filteredLogs.filter(log => log.action.category === filters.category);
    }

    if (filters.severity) {
        filteredLogs = filteredLogs.filter(log => log.action.severity === filters.severity);
    }

    if (filters.dateFrom) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= new Date(filters.dateTo));
    }

    if (filters.success !== undefined) {
        filteredLogs = filteredLogs.filter(log => log.details.success === filters.success);
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => b.timestamp - a.timestamp);

    return filteredLogs;
};

// Clear old audit logs (for memory management)
export const clearOldAuditLogs = (daysToKeep = 90) => {
    const cutoffDate = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000));
    const initialCount = auditLogs.length;

    auditLogs = auditLogs.filter(log => log.timestamp > cutoffDate);

    const removedCount = initialCount - auditLogs.length;
    console.log(`Cleaned up ${removedCount} old audit logs (kept ${auditLogs.length} logs)`);

    return { removed: removedCount, remaining: auditLogs.length };
};

// Export audit log statistics
export const getAuditStats = () => {
    const total = auditLogs.length;
    const last24h = auditLogs.filter(log =>
        log.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    const byCategory = auditLogs.reduce((acc, log) => {
        acc[log.action.category] = (acc[log.action.category] || 0) + 1;
        return acc;
    }, {});

    const bySeverity = auditLogs.reduce((acc, log) => {
        acc[log.action.severity] = (acc[log.action.severity] || 0) + 1;
        return acc;
    }, {});

    const failureRate = auditLogs.filter(log => !log.details.success).length / total;

    return {
        total,
        last24h,
        byCategory,
        bySeverity,
        failureRate: Math.round(failureRate * 100) / 100,
        oldestLog: auditLogs.length > 0 ? auditLogs[0].timestamp : null,
        newestLog: auditLogs.length > 0 ? auditLogs[auditLogs.length - 1].timestamp : null
    };
};

export default {
    auditLog,
    auditAuth,
    auditDataChange,
    auditSecurity,
    auditCompliance,
    auditSystem,
    auditBulkOperation,
    auditFailedAccess,
    createManualAuditLog,
    getAuditLogs,
    clearOldAuditLogs,
    getAuditStats
};