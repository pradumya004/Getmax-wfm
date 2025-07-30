// backend/src/middlewares/upload.middleware.js

import {
    memoryAvatarUpload,
    memoryBulkUpload,
    memoryDocumentUpload,
    cleanupTempFiles,
    handleMulterError,
    getFileInfo
} from "../config/multer.config.js";
import {
    uploadAvatar as cloudinaryUploadAvatar,
    uploadDocument as cloudinaryUploadDocument,
    uploadBulkFile as cloudinaryUploadBulkFile
} from "../config/cloudinary.config.js";
import { MULTER_TEMP_PATH } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";

// Avatar upload middleware with Cloudinary
export const uploadAvatarMiddleware = [
    memoryAvatarUpload.single('avatar'),
    handleMulterError,
    asyncHandler(async (req, res, next) => {
        if (!req.file) {
            throw new ApiError(400, 'Avatar image is required');
        }

        try {
            const employeeId = req.employee?.employeeId || req.body.employeeId;

            if (!employeeId) {
                throw new ApiError(400, 'Employee Id is required');
            }

            const tempFileName = `avatar_${employeeId}_${Date.now()}.jpg`;
            const tempFilePath = path.join(MULTER_TEMP_PATH, tempFileName);

            if (!fs.existsSync(MULTER_TEMP_PATH)) {
                fs.mkdirSync(MULTER_TEMP_PATH, { recursive: true });
            }

            fs.writeFileSync(tempFilePath, req.file.buffer);

            const uploadResult = await cloudinaryUploadAvatar(tempFilePath, employeeId);

            cleanupTempFiles(tempFilePath);

            req.uploadResult = uploadResult;
            req.fileInfo = getFileInfo(req.file);

            next();
        } catch (error) {
            // Clean up any temp files on error
            if (fs.existsSync(path.join(MULTER_TEMP_PATH, `avatar_${req.employee?.employeeId || req.body.employeeId}_${Date.now()}.jpg`))) {
                cleanupTempFiles(path.join(MULTER_TEMP_PATH, `avatar_${req.employee?.employeeId || req.body.employeeId}_${Date.now()}.jpg`));
            }
            throw error;
        }
    })
];

// Single document upload middleware with Cloudinary
export const uploadSingleDocumentMiddleware = [
    memoryDocumentUpload.single('document'),
    handleMulterError,
    asyncHandler(async (req, res, next) => {
        if (!req.file) {
            throw new ApiError(400, 'Document is required');
        }

        let tempFilePath = null;

        try {
            const companyId = req.company?.companyId || req.employee?.companyId;
            const documentType = req.body.documentType || 'general';

            if (!companyId) {
                throw new ApiError(400, 'companyId Id is required');
            }

            const fileExtension = path.extname(req.file.originalname);
            const tempFileName = `doc_${companyId}_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
            tempFilePath = path.join(MULTER_TEMP_PATH, tempFileName);

            if (!fs.existsSync(MULTER_TEMP_PATH)) {
                fs.mkdirSync(MULTER_TEMP_PATH, { recursive: true });
            }

            fs.writeFileSync(tempFilePath, req.file.buffer);

            const uploadResult = await cloudinaryUploadDocument(tempFilePath, documentType, companyId);

            cleanupTempFiles(tempFilePath);

            req.uploadResult = {
                ...uploadResult,
                originalName: req.file.originalname,
                fileInfo: getFileInfo(req.file)
            };

            next();
        } catch (error) {
            // Clean up temp file on error
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                cleanupTempFiles(tempFilePath);
            }
            throw error;
        }
    })
];

// Bulk upload middleware with Cloudinary backup
export const uploadBulkMiddleware = [
    memoryBulkUpload.single('bulkFile'),
    handleMulterError,
    asyncHandler(async (req, res, next) => {
        console.log('Bulk upload middleware triggered.... with file:', req);
        if (!req.file) {
            throw new ApiError(400, 'Bulk upload file is required');
        }

        try {
            const companyId = req.company?.id || req.employee?.companyId;
            if (!companyId) {
                throw new ApiError(400, 'Company ID is required');
            }

            // Create temporary file for processing
            const tempFileName = `bulk_${companyId}_${Date.now()}.${req.file.originalname.split('.').pop()}`;
            const tempFilePath = path.join(MULTER_TEMP_PATH, tempFileName);

            // Ensure temp directory exists
            if (!fs.existsSync(MULTER_TEMP_PATH)) {
                fs.mkdirSync(MULTER_TEMP_PATH, { recursive: true });
            }

            // Write buffer to temp file
            fs.writeFileSync(tempFilePath, req.file.buffer);

            // Upload to Cloudinary for backup (optional)
            try {
                const uploadResult = await cloudinaryUploadBulkFile(tempFilePath, companyId);
                req.cloudinaryBackup = uploadResult;
            } catch (cloudinaryError) {
                console.warn('Cloudinary backup failed:', cloudinaryError.message);
                // Continue without Cloudinary backup
            }

            // Keep temp file for processing (will be cleaned up after processing)
            req.tempFilePath = tempFilePath;
            req.fileInfo = getFileInfo(req.file);

            next();
        } catch (error) {
            // Clean up temp file on error
            if (req.tempFilePath) {
                cleanupTempFiles(req.tempFilePath);
            }
            throw error;
        }
    })
];

// Cleanup middleware (use after processing)
export const cleanupMiddleware = asyncHandler(async (req, res, next) => {
    // Clean up temp files after request processing
    res.on('finish', () => {
        if (req.tempFilePath) {
            cleanupTempFiles(req.tempFilePath);
        }
        if (req.tempFiles) {
            cleanupTempFiles(req.tempFiles);
        }
    });

    next();
});

// File validation middleware
export const validateFileMiddleware = (maxSize, allowedTypes) => {
    return asyncHandler(async (req, res, next) => {
        if (req.file) {
            validateFile(req.file, maxSize, allowedTypes);
        } else if (req.files && req.files.length > 0) {
            req.files.forEach(file => validateFile(file, maxSize, allowedTypes));
        }
        next();
    });
};

// Validate individual file
const validateFile = (file, maxSize, allowedTypes) => {
    if (!file) {
        throw new ApiError(400, 'No file provided');
    }

    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
        throw new ApiError(400, `File size exceeds ${maxSizeMB}MB limit`);
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        throw new ApiError(400, `File type ${file.mimetype} not allowed`);
    }

    return true;
};