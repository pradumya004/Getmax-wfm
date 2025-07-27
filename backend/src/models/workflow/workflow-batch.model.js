// backend/src/models/workflow/workflow-batch.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const workflowBatchSchema = new mongoose.Schema({
    batchId: {
        type: String,
        unique: true,
        default: () => `WF-BATCH-${uuidv4().substring(0, 10).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },
    sowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SOW',
        index: true
    },
    clientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Created by reference is required'],
        index: true
    },

    // ** BATCH CONFIGURATION **
    batchInfo: {
        batchName: {
            type: String,
            required: [true, 'Batch name is required'],
            trim: true,
            maxlength: [100, 'Batch name cannot exceed 100 characters']
        },
        batchType: {
            type: String,
            enum: [
                'ClaimSubmission', 'PaymentPosting', 'BulkAssignment',
                'BulkUpdate', 'QAReview', 'StatusUpdate', 'DataImport',
                'DataExport', 'ReportGeneration', 'Notification'
            ],
            required: [true, 'Batch type is required'],
            index: true
        },
        batchSubType: {
            type: String,
            trim: true,
            maxlength: [50, 'Batch sub-type cannot exceed 50 characters']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical', 'Emergency'],
            default: 'Normal',
            index: true
        },
        isScheduled: {
            type: Boolean,
            default: false,
            index: true
        },
        scheduledFor: {
            type: Date,
            index: true
        },
        expiresAt: {
            type: Date,
            validate: {
                validator: function (v) {
                    return !v || v > new Date();
                },
                message: 'Expiry date must be in the future'
            }
        }
    },

    // ** BATCH CONTENTS **
    batchContents: {
        claimRefs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClaimTask',
            required: true
        }],
        totalItems: {
            type: Number,
            required: [true, 'Total items count is required'],
            min: [1, 'Batch must contain at least 1 item'],
            max: [10000, 'Batch cannot exceed 10,000 items']
        },
        itemsAdded: {
            type: Date,
            default: Date.now
        },
        selectionCriteria: {
            filters: {
                type: Map,
                of: mongoose.Schema.Types.Mixed
            },
            includeCriteria: [{
                field: String,
                operator: {
                    type: String,
                    enum: ['equals', 'contains', 'startsWith', 'in', 'between', 'greaterThan', 'lessThan']
                },
                value: mongoose.Schema.Types.Mixed
            }],
            excludeCriteria: [{
                field: String,
                operator: {
                    type: String,
                    enum: ['equals', 'contains', 'startsWith', 'in', 'between', 'greaterThan', 'lessThan']
                },
                value: mongoose.Schema.Types.Mixed
            }]
        }
    },

    // ** PROCESSING STATUS **
    processingStatus: {
        currentStatus: {
            type: String,
            enum: [
                'Created', 'Queued', 'Processing', 'Paused', 'Completed',
                'Failed', 'PartiallyCompleted', 'Cancelled', 'Expired'
            ],
            default: 'Created',
            required: true,
            index: true
        },
        statusHistory: [{
            status: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reason: String,
            notes: String,
            systemGenerated: {
                type: Boolean,
                default: false
            }
        }],
        lastStatusUpdate: {
            type: Date,
            default: Date.now
        }
    },

    // ** PROCESSING METRICS **
    processingMetrics: {
        startTime: Date,
        endTime: Date,
        duration: {
            type: Number, // milliseconds
            default: 0
        },
        processedCount: {
            type: Number,
            default: 0,
            min: [0, 'Processed count cannot be negative']
        },
        successfulCount: {
            type: Number,
            default: 0,
            min: [0, 'Successful count cannot be negative']
        },
        failedCount: {
            type: Number,
            default: 0,
            min: [0, 'Failed count cannot be negative']
        },
        skippedCount: {
            type: Number,
            default: 0,
            min: [0, 'Skipped count cannot be negative']
        },
        warningCount: {
            type: Number,
            default: 0,
            min: [0, 'Warning count cannot be negative']
        },
        processingRate: {
            type: Number, // items per minute
            default: 0,
            min: [0, 'Processing rate cannot be negative']
        },
        estimatedCompletion: Date,
        actualCompletion: Date
    },

    // ** ERROR HANDLING **
    errorInfo: {
        hasErrors: {
            type: Boolean,
            default: false,
            index: true
        },
        errorCount: {
            type: Number,
            default: 0,
            min: [0, 'Error count cannot be negative']
        },
        criticalErrorCount: {
            type: Number,
            default: 0,
            min: [0, 'Critical error count cannot be negative']
        },
        errors: [{
            claimRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ClaimTask'
            },
            errorType: {
                type: String,
                enum: ['Validation', 'Business Rule', 'System', 'Integration', 'Permission', 'Data', 'Network'],
                required: true
            },
            errorCode: {
                type: String,
                trim: true,
                maxlength: [20, 'Error code cannot exceed 20 characters']
            },
            errorMessage: {
                type: String,
                required: true,
                trim: true,
                maxlength: [1000, 'Error message cannot exceed 1000 characters']
            },
            severity: {
                type: String,
                enum: ['Low', 'Medium', 'High', 'Critical'],
                default: 'Medium'
            },
            isResolved: {
                type: Boolean,
                default: false
            },
            resolvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            resolvedAt: Date,
            resolutionNotes: String,
            timestamp: {
                type: Date,
                default: Date.now
            },
            stackTrace: String,
            additionalData: {
                type: Map,
                of: mongoose.Schema.Types.Mixed
            }
        }],
        errorSummary: {
            validationErrors: { type: Number, default: 0 },
            businessRuleErrors: { type: Number, default: 0 },
            systemErrors: { type: Number, default: 0 },
            integrationErrors: { type: Number, default: 0 },
            permissionErrors: { type: Number, default: 0 },
            dataErrors: { type: Number, default: 0 },
            networkErrors: { type: Number, default: 0 }
        },
        lastError: {
            timestamp: Date,
            message: String,
            code: String
        }
    },

    // ** RETRY CONFIGURATION **
    retryConfig: {
        maxRetries: {
            type: Number,
            default: 3,
            min: [0, 'Max retries cannot be negative'],
            max: [10, 'Max retries cannot exceed 10']
        },
        retryCount: {
            type: Number,
            default: 0,
            min: [0, 'Retry count cannot be negative']
        },
        retryDelay: {
            type: Number, // milliseconds
            default: 5000,
            min: [1000, 'Retry delay must be at least 1 second']
        },
        backoffMultiplier: {
            type: Number,
            default: 2,
            min: [1, 'Backoff multiplier must be at least 1']
        },
        retryOnErrors: [{
            type: String,
            enum: ['Validation', 'Business Rule', 'System', 'Integration', 'Permission', 'Data', 'Network']
        }],
        retryHistory: [{
            attempt: Number,
            timestamp: {
                type: Date,
                default: Date.now
            },
            reason: String,
            result: {
                type: String,
                enum: ['Success', 'Failed', 'Partial']
            }
        }]
    },

    // ** NOTIFICATION SETTINGS **
    notificationSettings: {
        notifyOnCompletion: {
            type: Boolean,
            default: true
        },
        notifyOnError: {
            type: Boolean,
            default: true
        },
        notifyOnWarning: {
            type: Boolean,
            default: false
        },
        recipients: [{
            recipientType: {
                type: String,
                enum: ['Employee', 'Role', 'Department', 'External'],
                required: true
            },
            recipientRef: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'notificationSettings.recipients.recipientType'
            },
            notificationMethods: [{
                type: String,
                enum: ['Email', 'SMS', 'InApp', 'Slack', 'Teams', 'Webhook']
            }]
        }]
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isSystemGenerated: {
            type: Boolean,
            default: false,
            index: true
        },
        processingNode: {
            type: String,
            trim: true // For distributed processing
        },
        processId: {
            type: String,
            trim: true
        },
        version: {
            type: String,
            default: '1.0',
            trim: true
        },
        tags: [{
            type: String,
            trim: true,
            maxlength: [50, 'Tag cannot exceed 50 characters']
        }],
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    },

    // ** AUDIT TRAIL **
    auditInfo: {
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedAt: Date,
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        cancelledAt: Date,
        cancellationReason: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
workflowBatchSchema.index({ companyRef: 1, 'batchInfo.batchType': 1, createdAt: -1 });
workflowBatchSchema.index({ 'processingStatus.currentStatus': 1, 'batchInfo.priority': -1 });
workflowBatchSchema.index({ sowRef: 1, clientRef: 1, 'processingStatus.currentStatus': 1 });
workflowBatchSchema.index({ createdBy: 1, createdAt: -1 });
workflowBatchSchema.index({ 'batchInfo.scheduledFor': 1 });
workflowBatchSchema.index({ 'errorInfo.hasErrors': 1, 'processingStatus.currentStatus': 1 });

// ** VIRTUAL FIELDS **
workflowBatchSchema.virtual('successRate').get(function () {
    if (this.processingMetrics.processedCount === 0) return 0;
    return (this.processingMetrics.successfulCount / this.processingMetrics.processedCount) * 100;
});

workflowBatchSchema.virtual('failureRate').get(function () {
    if (this.processingMetrics.processedCount === 0) return 0;
    return (this.processingMetrics.failedCount / this.processingMetrics.processedCount) * 100;
});

workflowBatchSchema.virtual('isCompleted').get(function () {
    return ['Completed', 'PartiallyCompleted', 'Failed', 'Cancelled'].includes(this.processingStatus.currentStatus);
});

workflowBatchSchema.virtual('isInProgress').get(function () {
    return ['Queued', 'Processing'].includes(this.processingStatus.currentStatus);
});

workflowBatchSchema.virtual('estimatedTimeRemaining').get(function () {
    if (!this.processingMetrics.processingRate || this.processingMetrics.processingRate === 0) return null;
    const remaining = this.batchContents.totalItems - this.processingMetrics.processedCount;
    return Math.ceil(remaining / this.processingMetrics.processingRate); // minutes
});

workflowBatchSchema.virtual('progressPercentage').get(function () {
    if (this.batchContents.totalItems === 0) return 0;
    return (this.processingMetrics.processedCount / this.batchContents.totalItems) * 100;
});

// ** INSTANCE METHODS **
workflowBatchSchema.methods.updateStatus = function (newStatus, updatedBy, reason = '', notes = '') {
    const oldStatus = this.processingStatus.currentStatus;
    this.processingStatus.currentStatus = newStatus;
    this.processingStatus.lastStatusUpdate = new Date();

    // Add to status history
    this.processingStatus.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        changedBy: updatedBy,
        reason,
        notes,
        systemGenerated: !updatedBy
    });

    // Update processing times
    if (newStatus === 'Processing' && !this.processingMetrics.startTime) {
        this.processingMetrics.startTime = new Date();
    }

    if (['Completed', 'PartiallyCompleted', 'Failed', 'Cancelled'].includes(newStatus)) {
        this.processingMetrics.endTime = new Date();
        this.processingMetrics.actualCompletion = new Date();
        if (this.processingMetrics.startTime) {
            this.processingMetrics.duration = this.processingMetrics.endTime - this.processingMetrics.startTime;
        }
    }

    return { previousStatus: oldStatus, newStatus };
};

workflowBatchSchema.methods.addError = function (claimRef, errorType, errorMessage, errorCode = '', severity = 'Medium', additionalData = {}) {
    const error = {
        claimRef,
        errorType,
        errorCode,
        errorMessage,
        severity,
        timestamp: new Date(),
        additionalData
    };

    this.errorInfo.errors.push(error);
    this.errorInfo.errorCount = this.errorInfo.errors.length;
    this.errorInfo.hasErrors = true;

    // Update error summary
    const summaryKey = errorType.toLowerCase().replace(' ', '') + 'Errors';
    if (this.errorInfo.errorSummary[summaryKey] !== undefined) {
        this.errorInfo.errorSummary[summaryKey]++;
    }

    // Update critical error count
    if (severity === 'Critical') {
        this.errorInfo.criticalErrorCount++;
    }

    // Update last error
    this.errorInfo.lastError = {
        timestamp: new Date(),
        message: errorMessage,
        code: errorCode
    };

    return error;
};

workflowBatchSchema.methods.updateProgress = function (processedCount, successfulCount, failedCount, skippedCount = 0, warningCount = 0) {
    this.processingMetrics.processedCount = processedCount;
    this.processingMetrics.successfulCount = successfulCount;
    this.processingMetrics.failedCount = failedCount;
    this.processingMetrics.skippedCount = skippedCount;
    this.processingMetrics.warningCount = warningCount;

    // Calculate processing rate
    if (this.processingMetrics.startTime) {
        const elapsedMinutes = (new Date() - this.processingMetrics.startTime) / (1000 * 60);
        if (elapsedMinutes > 0) {
            this.processingMetrics.processingRate = processedCount / elapsedMinutes;
        }
    }

    // Update estimated completion
    if (this.processingMetrics.processingRate > 0) {
        const remainingItems = this.batchContents.totalItems - processedCount;
        const remainingMinutes = remainingItems / this.processingMetrics.processingRate;
        this.processingMetrics.estimatedCompletion = new Date(Date.now() + (remainingMinutes * 60 * 1000));
    }
};

workflowBatchSchema.methods.canRetry = function () {
    return this.retryConfig.retryCount < this.retryConfig.maxRetries &&
        ['Failed', 'PartiallyCompleted'].includes(this.processingStatus.currentStatus);
};

workflowBatchSchema.methods.scheduleRetry = function (reason = 'Manual retry') {
    if (!this.canRetry()) {
        throw new Error('Batch cannot be retried');
    }

    this.retryConfig.retryCount++;

    // Add to retry history
    this.retryConfig.retryHistory.push({
        attempt: this.retryConfig.retryCount,
        timestamp: new Date(),
        reason,
        result: 'Pending'
    });

    // Calculate delay with backoff
    const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, this.retryConfig.retryCount - 1);

    // Reset status
    this.updateStatus('Queued', null, 'Scheduled for retry', reason);

    return delay;
};

workflowBatchSchema.methods.cancel = function (cancelledBy, reason = '') {
    if (this.isCompleted) {
        throw new Error('Cannot cancel completed batch');
    }

    this.updateStatus('Cancelled', cancelledBy, 'Batch cancelled', reason);
    this.auditInfo.cancelledBy = cancelledBy;
    this.auditInfo.cancelledAt = new Date();
    this.auditInfo.cancellationReason = reason;
};

// ** STATIC METHODS **
workflowBatchSchema.statics.findPendingBatches = function (companyRef, batchType = null, limit = 100) {
    const query = {
        companyRef,
        'processingStatus.currentStatus': { $in: ['Created', 'Queued'] },
        'systemInfo.isActive': true
    };

    if (batchType) query['batchInfo.batchType'] = batchType;

    return this.find(query)
        .sort({ 'batchInfo.priority': -1, createdAt: 1 })
        .limit(limit);
};

workflowBatchSchema.statics.findBatchesWithErrors = function (companyRef, severity = null) {
    const query = {
        companyRef,
        'errorInfo.hasErrors': true,
        'systemInfo.isActive': true
    };

    if (severity) {
        query['errorInfo.errors.severity'] = severity;
    }

    return this.find(query)
        .sort({ 'errorInfo.criticalErrorCount': -1, createdAt: -1 });
};

workflowBatchSchema.statics.getBatchStatistics = function (companyRef, dateRange = null) {
    const matchStage = {
        companyRef: mongoose.Types.ObjectId(companyRef),
        'systemInfo.isActive': true
    };

    if (dateRange) {
        matchStage.createdAt = {
            $gte: dateRange.start,
            $lte: dateRange.end
        };
    }

    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$batchInfo.batchType',
                totalBatches: { $sum: 1 },
                completedBatches: {
                    $sum: { $cond: [{ $eq: ['$processingStatus.currentStatus', 'Completed'] }, 1, 0] }
                },
                failedBatches: {
                    $sum: { $cond: [{ $eq: ['$processingStatus.currentStatus', 'Failed'] }, 1, 0] }
                },
                totalItems: { $sum: '$batchContents.totalItems' },
                totalProcessed: { $sum: '$processingMetrics.processedCount' },
                totalErrors: { $sum: '$errorInfo.errorCount' },
                avgDuration: { $avg: '$processingMetrics.duration' },
                avgSuccessRate: { $avg: { $multiply: [{ $divide: ['$processingMetrics.successfulCount', '$processingMetrics.processedCount'] }, 100] } }
            }
        },
        { $sort: { totalBatches: -1 } }
    ]);
};

// ** PRE-SAVE MIDDLEWARE **
workflowBatchSchema.pre('save', function (next) {
    // Set lastModifiedAt if this is an update
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }

    // Validate batch contents
    if (this.batchContents.claimRefs.length !== this.batchContents.totalItems) {
        return next(new Error('Claim references count does not match total items'));
    }

    // Auto-set batch name if not provided
    if (!this.batchInfo.batchName) {
        this.batchInfo.batchName = `${this.batchInfo.batchType} - ${new Date().toISOString().split('T')[0]}`;
    }

    next();
});

// ** POST-SAVE MIDDLEWARE **
workflowBatchSchema.post('save', function (doc) {
    // Trigger notifications if needed
    if (doc.notificationSettings.notifyOnCompletion && doc.isCompleted) {
        // Trigger completion notification
        // This would be handled by a notification service
    }

    if (doc.notificationSettings.notifyOnError && doc.errorInfo.hasErrors) {
        // Trigger error notification  
        // This would be handled by a notification service
    }
});

export const WorkflowBatch = mongoose.model('WorkflowBatch', workflowBatchSchema, 'workflowbatches');