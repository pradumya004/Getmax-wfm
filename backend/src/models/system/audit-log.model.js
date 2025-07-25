// backend/src/models/system/audit-log.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const auditLogSchema = new mongoose.Schema({
    logId: {
        type: String,
        required: true,
        default: () => `AUD-${uuidv4().substring(0, 8).toUpperCase()}`,
        unique: true,
        index: true
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        index: true
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userType',
        required: true
    },
    userType: {
        type: String,
        enum: ['Employee', 'Company'],
        required: true
    },
    entityType: {
        type: String,
        enum: ['Company', 'Employee', 'Client', 'ClaimTasks', 'SOW', 'Patient', 'Payer', 'Department', 'Role'],
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    action: {
        type: String,
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'],
        required: true
    },
    changes: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed
    },
    metadata: {
        endpoint: String,
        method: String,
        userAgent: String,
        ipAddress: String,
        success: {
            type: Boolean,
            default: true
        },
        errorMessage: String
    }
}, {
    timestamps: true
});

auditLogSchema.index({ companyRef: 1, createdAt: -1 });
auditLogSchema.index({ userRef: 1, action: 1, createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema, 'audit-logs');