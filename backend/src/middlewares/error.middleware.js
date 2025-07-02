// backend/src/middlewares/error.middleware.js

// backend/src/middlewares/error.middleware.js

import { ApiError } from "../utils/ApiError.js";

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
    let error = err;

    // Log error details for debugging
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Convert non-ApiError instances to ApiError
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, [], err.stack);
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        error = new ApiError(400, "Validation Error", errors);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `${field} '${value}' already exists`;
        error = new ApiError(400, message);
    }

    // Mongoose Cast Error (Invalid ObjectId)
    if (err.name === 'CastError') {
        const message = `Invalid ${err.path}: ${err.value}`;
        error = new ApiError(400, message);
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error = new ApiError(401, "Invalid token");
    }

    if (err.name === 'TokenExpiredError') {
        error = new ApiError(401, "Token expired");
    }

    // Multer Errors (handled in multer config, but fallback)
    if (err.code === 'LIMIT_FILE_SIZE') {
        error = new ApiError(400, "File too large");
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        error = new ApiError(400, "Too many files");
    }

    // MongoDB Connection Errors
    if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
        error = new ApiError(503, "Database connection error");
    }

    // Send error response
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        errors: error.errors || [],
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            originalError: err.message
        }),
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
    });
};

// 404 Not Found Handler
export const notFoundHandler = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

// Async Error Wrapper (Alternative to asyncHandler)
export const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};