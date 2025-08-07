// backend/src/utils/logger.js

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Tell winston about our custom colors
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
    ),
);

// Define which transports the logger must use
const transports = [
    // Console transport
    new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
        format: format
    }),

    // File transport for errors
    new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
        ),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),

    // File transport for all logs
    new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
        ),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
];

// Create the logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    levels,
    format,
    transports,
    exitOnError: false,
});

// Create a stream object for Morgan (HTTP request logging)
const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

// Helper functions for different log types
export const logError = (message, error = null, metadata = {}) => {
    logger.error(message, { error: error?.stack || error, ...metadata });
};

export const logWarn = (message, metadata = {}) => {
    logger.warn(message, metadata);
};

export const logInfo = (message, metadata = {}) => {
    logger.info(message, metadata);
};

export const logHttp = (message, metadata = {}) => {
    logger.http(message, metadata);
};

export const logDebug = (message, metadata = {}) => {
    logger.debug(message, metadata);
};

// Specialized logging functions
export const logAuth = (action, user, metadata = {}) => {
    logger.info(`AUTH: ${action}`, {
        category: 'authentication',
        user: user?.id || user?.email || 'unknown',
        action,
        ...metadata
    });
};

export const logSecurity = (event, severity = 'warn', metadata = {}) => {
    logger[severity](`SECURITY: ${event}`, {
        category: 'security',
        event,
        severity,
        ...metadata
    });
};

export const logDatabase = (operation, collection, metadata = {}) => {
    logger.debug(`DB: ${operation} on ${collection}`, {
        category: 'database',
        operation,
        collection,
        ...metadata
    });
};

export const logAPI = (method, endpoint, statusCode, duration, metadata = {}) => {
    const level = statusCode >= 400 ? 'warn' : 'info';
    logger[level](`API: ${method} ${endpoint} - ${statusCode} (${duration}ms)`, {
        category: 'api',
        method,
        endpoint,
        statusCode,
        duration,
        ...metadata
    });
};

export const logPerformance = (operation, duration, metadata = {}) => {
    const level = duration > 1000 ? 'warn' : 'info';
    logger[level](`PERF: ${operation} took ${duration}ms`, {
        category: 'performance',
        operation,
        duration,
        ...metadata
    });
};

export const logBusiness = (event, data = {}) => {
    logger.info(`BUSINESS: ${event}`, {
        category: 'business',
        event,
        ...data
    });
};

// Audit logging (for compliance)
export const logAudit = (action, user, resource, details = {}) => {
    logger.info(`AUDIT: ${action} on ${resource}`, {
        category: 'audit',
        action,
        user: user?.id || user?.email || 'system',
        resource,
        timestamp: new Date().toISOString(),
        ...details
    });
};

// System events logging
export const logSystem = (event, metadata = {}) => {
    logger.info(`SYSTEM: ${event}`, {
        category: 'system',
        event,
        ...metadata
    });
};

// Error tracking with context
export const logErrorWithContext = (error, context = {}) => {
    logger.error(`ERROR: ${error.message}`, {
        category: 'error',
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code || error.statusCode
        },
        context
    });
};

// Log application startup
export const logStartup = (service, port, environment) => {
    logger.info(`🚀 ${service} started`, {
        category: 'startup',
        service,
        port,
        environment,
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform
    });
};

// Log graceful shutdown
export const logShutdown = (service, reason = 'normal') => {
    logger.info(`🛑 ${service} shutting down`, {
        category: 'shutdown',
        service,
        reason,
        timestamp: new Date().toISOString()
    });
};

// Create request ID for request tracing
export const createRequestId = () => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Middleware to add request ID to logger context
export const addRequestId = (req, res, next) => {
    req.requestId = createRequestId();
    req.logger = logger.child({ requestId: req.requestId });
    next();
};

// Development helpers
export const logDev = (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
        logger.debug(`DEV: ${message}`, data);
    }
};

export const logSQL = (query, duration, metadata = {}) => {
    if (process.env.NODE_ENV === 'development') {
        logger.debug(`SQL: ${query} (${duration}ms)`, {
            category: 'sql',
            query,
            duration,
            ...metadata
        });
    }
};

// Export the main logger and stream
export { logger, stream };

export default logger;