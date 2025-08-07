// backend/src/services/fileService.service.js

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import xlsx from 'xlsx';
import { ApiError } from '../utils/ApiError.js';
import { uploadToCloudinary, uploadAvatar, uploadDocument, uploadBulkFile } from '../config/cloudinary.config.js';
import {
    MULTER_AVATAR_PATH,
    MULTER_DOCUMENT_PATH,
    MULTER_BULK_PATH,
    MULTER_TEMP_PATH,
    AVATAR_ALLOWED_TYPES,
    DOCUMENT_ALLOWED_TYPES,
    BULK_FILE_ALLOWED_TYPES
} from '../constants.js';
import { validateFileMiddleware } from '../middlewares/upload.middleware.js';
import { cleanupTempFiles } from '../config/multer.config.js';

// File Upload Service
export const uploadFile = async (file, uploadType, options = {}) => {
    try {
        if (!file) {
            throw new ApiError(400, 'No file provided');
        }

        // Validate file type
        const isValidType = validateFileType(file, uploadType);
        if (!isValidType) {
            throw new ApiError(400, `Invalid file type for ${uploadType}`);
        }

        let cloudinaryResult;

        switch (uploadType) {
            case 'avatar':
                cloudinaryResult = await uploadAvatar(file.path, options.employeeId);
                break;
            case 'document':
                cloudinaryResult = await uploadDocument(file.path, options.documentType, options.companyId);
                break;
            case 'bulk':
                cloudinaryResult = await uploadBulkFile(file.path, options.companyId);
                break;
            default:
                cloudinaryResult = await uploadToCloudinary(file.path, {
                    folder: `getmax-wfm/${uploadType}`,
                    ...options
                });
        }

        // Clean up local file
        await deleteLocalFile(file.path);

        return {
            success: true,
            url: cloudinaryResult.url,
            public_id: cloudinaryResult.public_id,
            originalName: file.originalname,
            size: cloudinaryResult.size,
            format: cloudinaryResult.format,
            uploadedAt: new Date()
        };

    } catch (error) {
        // Clean up local file on error
        if (file?.path) {
            await deleteLocalFile(file.path);
        }

        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `File upload failed: ${error.message}`);
    }
};

// Validate File Type
export const validateFileType = (file, uploadType) => {
    const allowedTypes = {
        avatar: AVATAR_ALLOWED_TYPES,
        document: DOCUMENT_ALLOWED_TYPES,
        bulk: BULK_FILE_ALLOWED_TYPES
    };

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileMimeType = file.mimetype.toLowerCase();

    const allowed = allowedTypes[uploadType] || [];

    return allowed.some(type =>
        fileExtension === type ||
        fileMimeType.includes(type.replace('.', ''))
    );
};

// Process Excel File For Bulk Upload
export const processExcelFile = async (filePath, sheetName = null) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const worksheetName = sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        if (!worksheet) {
            throw new ApiError(400, `Sheet "${worksheetName}" not found`);
        }

        // Convert to JSON with options
        const data = xlsx.utils.sheet_to_json(worksheet, {
            header: 1,  // Use array of arrays as headers
            defval: '', // Use empty string as default value
            blankrows: false    // Ignore empty rows
        });

        if (data.length === 0) {
            throw new ApiError(400, 'Excel file is empty');
        }

        // Extract headers and rows
        const headers = data[0];
        const rows = data.slice(1);

        // Clean headers (trim spaces, normalize)
        const cleanedHeaders = headers.map(header =>
            typeof header === 'string' ? header.trim() : header
        );

        // Convert rows to objects
        const processedData = rows.map(row => {
            const obj = {};
            cleanedHeaders.forEach((header, colIndex) => {
                if (header) {
                    obj[header] = row[colIndex] || '';
                }
            });
            obj._rowNumber = index + 2; // Excel row number (1-indexed + header)
            return obj;
        })

        return {
            success: true,
            headers: cleanedHeaders,
            data: processedData,
            totalRows: processedData.length,
            worksheetName
        }
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to process Excel file: ${error.message}`);
    }
};

// Generate Excel Template
export const generateExcelTemplate = (templateType, headers, sampleData = []) => {
    try {
        const workbook = xlsx.utils.book_new();

        // Create data array with headers
        const data = [headers];

        // Add sample data if provided
        if (sampleData.length > 0) {
            data.push(...sampleData);
        }

        // Create worksheet
        const worksheet = xlsx.utils.aoa_to_sheet(data);

        // Set column widths
        const columnWidths = headers.map(() => ({ wch: 20 }));
        worksheet['!cols'] = columnWidths;

        // Add worksheet to workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Template');

        // Generate filename
        const filename = `${templateType}_template_${Date.now()}.xlsx`;
        const filePath = path.join(MULTER_TEMP_PATH, filename);

        // Write file
        xlsx.writeFile(workbook, filePath);

        return {
            success: true,
            filePath,
            filename
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate Excel template: ${error.message}`);
    }
};

// Generate CSV from Data
export const generateCSV = (data, filename) => {
    try {
        if (!data || data.length === 0) {
            throw new ApiError(400, 'No data provided for CSV generation');
        }

        // Get headers from first object
        const headers = Object.keys(data[0]);

        // Create CSV content
        let csvContent = headers.join(',') + '\n';

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                // Escape commas and quotes
                return `"${value.toString().replace(/"/g, '""')}"`;
            });
            csvContent += values.join(',') + '\n';
        });

        // Generate filename if not provided
        const csvFilename = filename || `export_${Date.now()}.csv`;
        const filePath = path.join(MULTER_TEMP_PATH, csvFilename);

        // Write file
        fs.writeFileSync(filePath, csvContent);

        return {
            success: true,
            filePath,
            filename: csvFilename
        };

    } catch (error) {
        throw new ApiError(500, `Failed to generate CSV: ${error.message}`);
    }
};

// Delete Local File
export const deleteLocalFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted local file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Failed to delete local file ${filePath}:`, error);
    }
};

// Clean up old temporary files
export const cleanupTempFiles = async (maxAge = 24 * 60 * 60 * 1000) => { // 24 hours
    try {
        const tempPath = MULTER_TEMP_PATH;

        if (!fs.existsSync(tempPath)) {
            return { cleaned: 0 };
        }

        const files = fs.readdirSync(tempPath);
        let cleanedCount = 0;

        for (const file of files) {
            const filePath = path.join(tempPath, file);
            const stats = fs.statSync(filePath);
            const age = Date.now() - stats.mtime.getTime();

            if (age > maxAge) {
                fs.unlinkSync(filePath);
                cleanedCount++;
            }
        }

        console.log(`🧹 Cleaned ${cleanedCount} old temporary files`);
        return { cleaned: cleanedCount };

    } catch (error) {
        console.error('Failed to cleanup temp files:', error);
        return { cleaned: 0, error: error.message };
    }
};

// Get File Information
export const getFileInfo = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new ApiError(404, 'File not found');
        }

        const stats = fs.statSync(filePath);
        const fileInfo = {
            exists: true,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            extension: path.extname(filePath),
            basename: path.basename(filePath),
            directory: path.dirname(filePath)
        };

        return fileInfo;

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to get file info: ${error.message}`);
    }
};

// Create Directory if it doesn't exist
export const ensureDirectoryExists = (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created directory: ${dirPath}`);
        }
        return true;
    } catch (error) {
        console.error(`Failed to create directory ${dirPath}:`, error);
        return false;
    }
};