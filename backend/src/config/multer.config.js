// backend/src/config/multer.config.js

import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import {
    MULTER_AVATAR_PATH,
    MULTER_DOCUMENT_PATH,
    MULTER_BULK_PATH,
    MULTER_TEMP_PATH,
    MAX_AVATAR_SIZE,
    MAX_DOCUMENT_SIZE,
    MAX_BULK_FILE_SIZE,
    AVATAR_ALLOWED_TYPES,
    DOCUMENT_ALLOWED_TYPES,
    BULK_FILE_ALLOWED_TYPES
} from '../constants.js'
import { ApiError } from "../utils/ApiError.js";

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created Directory: ${dirPath}`);

    }
};

// Initialize upload directories
ensureDirectoryExists(MULTER_AVATAR_PATH);
ensureDirectoryExists(MULTER_DOCUMENT_PATH);
ensureDirectoryExists(MULTER_BULK_PATH);
ensureDirectoryExists(MULTER_TEMP_PATH);

// Storage Configuration
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = MULTER_AVATAR_PATH;
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const employeeId = req.employee?.employeeId || req.body.employeeId || 'unknown';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${employeeId}_${timestamp}${ext}`);
    }
});

const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const companyId = req.company?.companyId || req.employee?.companyId || 'default';
        const uploadPath = `${MULTER_DOCUMENT_PATH}/${companyId}`;
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}_${timestamp}_${randomString}${ext}`);
    }
});

const bulkUploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const companyId = req.company?.companyId || req.employee?.companyId || 'default';
        const uploadPath = `${MULTER_BULK_PATH}/${companyId}`;
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `bulk_upload_${timestamp}${ext}`);
    }
});

// Memory storage for temporary processing
const memoryStorage = multer.memoryStorage();

// File filters
const createFileFilter = (allowedTypes, errorMessage) => {
    return (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ApiError(400, errorMessage), false);
        }
    };
};

const imageFilter = createFileFilter(
    AVATAR_ALLOWED_TYPES,
    'Only image files (JPEG, PNG, GIF, WebP) are allowed'
);

const documentFilter = createFileFilter(
    DOCUMENT_ALLOWED_TYPES,
    'Only PDF, Word, Excel, CSV, and image files are allowed'
);

const bulkFileFilter = createFileFilter(
    BULK_FILE_ALLOWED_TYPES,
    'Only Excel and CSV files are allowed'
);

// Multer Configurations
export const avatarUpload = multer({
    storage: avatarStorage,
    limits: {
        fileSize: MAX_AVATAR_SIZE,
        files: 1
    },
    fileFilter: imageFilter
});

export const documentUpload = multer({
    storage: documentStorage,
    limits: {
        fileSize: MAX_DOCUMENT_SIZE,
        files: 5
    },
    fileFilter: documentFilter
});
export const bulkUpload = multer({
    storage: bulkUploadStorage,
    limits: {
        fileSize: MAX_BULK_FILE_SIZE,
        files: 1
    },
    fileFilter: bulkFileFilter
});

// Memory uploads for Cloudinary
export const memoryAvatarUpload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: MAX_AVATAR_SIZE,
        files: 1
    },
    fileFilter: imageFilter
});

export const memoryDocumentUpload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: MAX_DOCUMENT_SIZE,
        files: 5
    },
    fileFilter: documentFilter
});

export const memoryBulkUpload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: MAX_BULK_FILE_SIZE,
        files: 1
    },
    fileFilter: bulkFileFilter
});

// Error handling middleware
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let message = "Upload Error";

        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'File too large';
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Too many files';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Unexpected file field';
                break;
            default:
                message = err.message
        }

        return res.status(400).json({
            success: false,
            message,
            error: err.message
        });
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    next(err);
};

// Utility Functions
export const cleanupTempFiles = (filePaths) => {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

    paths.forEach(filePath => {
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Cleaned up: ${filePath}`);
            } catch (error) {
                console.error(`Failed to cleanup ${filePath}: ${error.message}`);

            }
        }
    })
};

// Get File Information
export const getFileInfo = (file) => {
    return {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        sizeFormatted: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        extension: path.extname(file.originalname),
        baseName: path.basename(file.originalname, path.extname(file.originalname))
    };
};