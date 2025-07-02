// backend/src/config/cloudinary.config.js

import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from '../utils/ApiError.js';

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Upload to Cloudinary
export const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const defaultOptions = {
            resource_type: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
            ...options
        };

        const result = await cloudinary.uploader.upload(filePath, defaultOptions);
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.bytes,
            created_at: result.created_at
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new ApiError(500, `Failed to upload file to Cloudinary: ${error.message}`);
    }
};

// Upload Avatar to Cloudinary
export const uploadAvatar = async (filePath, employeeId) => {
    try {
        const options = {
            folder: 'getmax-wfm/avatars',
            public_id: `avatar_${employeeId}`,
            transformation: [
                { width: 300, height: 300, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' }
            ],
            overwrite: true
        };
        return await uploadToCloudinary(filePath, options);
    } catch (error) {
        console.error('Avatar upload error:', error);
        throw new ApiError(500, `Failed to upload avatar: ${error.message}`);
    }
};

// Upload Document to Cloudinary
export const uploadDocument = async (filePath, documentType, companyId) => {
    try {
        const options = {
            folder: `getmax-wfm/documents/${companyId}/${documentType}`,
            resource_type: 'auto',
            public_id: `${documentType}_${Date.now()}`,
            overwrite: false
        }

        return await uploadToCloudinary(filePath, options);
    } catch (error) {
        console.error('Document upload error:', error);
        throw new ApiError(500, `Failed to upload document: ${error.message}`);
    }
};

// Upload Bulk File (Excel) to Cloudinary
export const uploadBulkFile = async (filePath, companyId) => {
    try {
        const options = {
            folder: `getmax-wfm/bulk-uploads/${companyId}`,
            resource_type: 'raw',
            public_id: `bulk-upload_${Date.now()}`,
            overwrite: false
        }

        return await uploadToCloudinary(filePath, options);
    } catch (error) {
        console.error('Bulk upload error:', error);
        throw new ApiError(500, `Failed to upload bulk file: ${error.message}`);
    }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);

        return {
            success: result.result === 'ok',
            result: result.result
        };
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new ApiError(500, `Failed to delete from Cloudinary: ${error.message}`);
    }
};

// Generate Cloudinary URL
export const generateCloudinaryUrl = (publicId, transformations = {}) => {
    try {
        return cloudinary.url(publicId, {
            secure: true,
            ...transformations
        });
    } catch (error) {
        console.error('Cloudinary URL Generation Error: ', error);
        return null;
    }
};

// Validate Cloudinary Connection
export const validateCloudinaryConnection = async () => {
    try {
        // Check if credentials are provided
        if (!process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            console.warn('⚠️ Cloudinary credentials not provided');
            return false;
        }

        const result = await cloudinary.api.ping();
        console.log('🟢 Cloudinary connection verified:', result.status);
        return true;
    } catch (error) {
        console.error(`🔴 Cloudinary Connection Failed: ${error}`);
        return false;
    }
}

export default cloudinary;