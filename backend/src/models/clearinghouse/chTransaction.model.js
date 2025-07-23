// backend/src/models/clearinghouse/chTransaction.model.js

import mongoose from 'mongoose';
import crypto from 'crypto';
import { CLEARINGHOUSE_CONSTANTS, SLA_CONSTANTS, EDI_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

const chTransactionSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    transactionId: {
        type: String,
        unique: true,
        // default: () => `CHT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        immutable: true,
        index: true
    },

    // ** CORE RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    clearinghouseRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clearinghouse',
        required: [true, 'Clearinghouse reference is required'],
        index: true
    },

    initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Initiated by employee is required'],
        index: true
    },

    // ** TRANSACTION IDENTIFICATION **
    transactionInfo: {
        transactionType: {
            type: String,
            required: [true, 'Transaction type is required'],
            enum: {
                values: Object.values(CLEARINGHOUSE_CONSTANTS.TRANSACTION_TYPES),
                message: 'Invalid transaction type'
            },
            index: true
        },
        ediType: {
            type: String,
            required: function () {
                return this.transactionInfo?.transactionType === CLEARINGHOUSE_CONSTANTS.TRANSACTION_TYPES.EDI_SUBMISSION ||
                    this.transactionInfo?.transactionType === CLEARINGHOUSE_CONSTANTS.TRANSACTION_TYPES.EDI_RESPONSE;
            },
            enum: {
                values: Object.values(EDI_CONSTANTS.EDI_TYPES),
                message: 'Invalid EDI type'
            },
            index: true
        },
        batchId: {
            type: String,
            trim: true,
            index: true
        },
        submissionMethod: {
            type: String,
            enum: {
                values: Object.values(CLEARINGHOUSE_CONSTANTS.SUBMISSION_METHODS),
                message: 'Invalid submission method'
            },
            default: CLEARINGHOUSE_CONSTANTS.SUBMISSION_METHODS.API
        },
        correlationId: {
            type: String,
            trim: true,
            index: true
        }
    },

    // ** FILE INFORMATION **
    fileInfo: {
        fileName: {
            type: String,
            required: function () {
                return this.transactionInfo?.transactionType === CLEARINGHOUSE_CONSTANTS.TRANSACTION_TYPES.FILE_UPLOAD ||
                    this.transactionInfo?.transactionType === CLEARINGHOUSE_CONSTANTS.TRANSACTION_TYPES.FILE_DOWNLOAD;
            },
            trim: true
        },
        fileSize: {
            type: Number,
            min: [0, 'File size cannot be negative']
        },
        fileChecksum: {
            type: String,
            trim: true
        },
        recordCount: {
            type: Number,
            min: [0, 'Record count cannot be negative']
        },
        totalAmount: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.00
        },
        filePath: {
            type: String,
            trim: true,
            select: false // Don't include in queries by default
        },
        backupPath: {
            type: String,
            trim: true,
            select: false
        }
    },

    // ** TRANSACTION STATUS & TIMING **
    statusInfo: {
        currentStatus: {
            type: String,
            required: [true, 'Current status is required'],
            enum: {
                values: Object.values(CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS),
                message: 'Invalid transaction status'
            },
            default: CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.INITIATED,
            index: true
        },
        statusHistory: [{
            status: {
                type: String,
                enum: Object.values(CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS),
                required: true
            },
            timestamp: {
                type: Date,
                required: true,
                default: Date.now
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            notes: {
                type: String,
                trim: true
            },
            systemGenerated: {
                type: Boolean,
                default: false
            },
            errorDetails: {
                code: String,
                message: String,
                stack: String
            }
        }],

        // Timing Information
        initiatedAt: {
            type: Date,
            required: [true, 'Initiated time is required'],
            default: Date.now,
            index: true
        },
        submittedAt: Date,
        acknowledgedAt: Date,
        completedAt: Date,
        failedAt: Date,

        // Duration Tracking
        processingDuration: {
            type: Number, // milliseconds
            min: [0, 'Processing duration cannot be negative']
        },
        responseTime: {
            type: Number, // milliseconds  
            min: [0, 'Response time cannot be negative']
        }
    },

    // ** SLA TRACKING & MONITORING **
    slaTracking: {
        expectedSLA: {
            type: Number,
            required: [true, 'Expected SLA is required'],
            min: [1, 'SLA must be at least 1 minute'],
            default: function () {
                // Default SLA based on transaction type
                switch (this.transactionInfo?.transactionType) {
                    case CLEARINGHOUSE_CONSTANTS.TRANSACTION_TYPES.ELIGIBILITY_CHECK:
                        return SLA_CONSTANTS.DEFAULT_SLA.INSURANCE_VERIFICATION * 60; // Convert to minutes
                    case CLEARINGHOUSE_CONSTANTS.TRANSACTION_TYPES.CLAIM_SUBMISSION:
                        return SLA_CONSTANTS.DEFAULT_SLA.CLAIMS_PROCESSING * 60;
                    case CLEARINGHOUSE_CONSTANTS.TRANSACTION_TYPES.STATUS_CHECK:
                        return 15; // 15 minutes for status checks
                    default:
                        return SLA_CONSTANTS.DEFAULT_SLA.CLAIMS_PROCESSING * 60;
                }
            }
        },
        expectedCompletionTime: {
            type: Date,
            required: [true, 'Expected completion time is required'],
            index: true
        },
        actualCompletionTime: Date,
        slaStatus: {
            type: String,
            enum: {
                values: Object.values(SLA_CONSTANTS.SLA_STATUS),
                message: 'Invalid SLA status'
            },
            default: SLA_CONSTANTS.SLA_STATUS.ON_TRACK,
            index: true
        },
        timeRemaining: {
            type: Number, // minutes
            min: [0, 'Time remaining cannot be negative']
        },
        warningLevel: {
            type: String,
            enum: ['GREEN', 'YELLOW', 'RED'],
            default: 'GREEN',
            index: true
        },
        breachedAt: Date,
        breachReason: {
            type: String,
            enum: [
                'CH Timeout', 'Network Error', 'Processing Delay', 'Validation Error',
                'System Maintenance', 'High Volume', 'Authentication Issue', 'Other'
            ]
        },
        escalationRequired: {
            type: Boolean,
            default: false,
            index: true
        },
        escalatedAt: Date,
        escalatedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    },

    // ** REQUEST & RESPONSE DATA **
    requestData: {
        headers: {
            type: Map,
            of: String
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            select: false // Don't include in queries by default
        },
        payloadSize: {
            type: Number,
            min: [0, 'Payload size cannot be negative']
        },
        requestUrl: {
            type: String,
            trim: true
        },
        httpMethod: {
            type: String,
            enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            default: 'POST'
        }
    },

    responseData: {
        httpStatusCode: {
            type: Number,
            min: [100, 'HTTP status code must be at least 100'],
            max: [599, 'HTTP status code cannot exceed 599']
        },
        headers: {
            type: Map,
            of: String
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            select: false
        },
        payloadSize: {
            type: Number,
            min: [0, 'Payload size cannot be negative']
        },
        errorCode: String,
        errorMessage: String,
        warnings: [String]
    },

    // ** RETRY & ERROR HANDLING **
    retryInfo: {
        maxRetries: {
            type: Number,
            default: 3,
            min: [0, 'Max retries cannot be negative'],
            max: [10, 'Max retries cannot exceed 10']
        },
        currentRetryCount: {
            type: Number,
            default: 0,
            min: [0, 'Current retry count cannot be negative']
        },
        retryHistory: [{
            attemptNumber: {
                type: Number,
                required: true
            },
            attemptedAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            failureReason: String,
            nextRetryAt: Date,
            retryDelay: Number // milliseconds
        }],
        lastRetryAt: Date,
        nextRetryAt: Date,
        autoRetryEnabled: {
            type: Boolean,
            default: true
        }
    },

    // ** BUSINESS METRICS **
    businessMetrics: {
        claimsCount: {
            type: Number,
            default: 0,
            min: [0, 'Claims count cannot be negative']
        },
        totalClaimAmount: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.00
        },
        acceptedClaims: {
            type: Number,
            default: 0,
            min: [0, 'Accepted claims cannot be negative']
        },
        rejectedClaims: {
            type: Number,
            default: 0,
            min: [0, 'Rejected claims cannot be negative']
        },
        pendingClaims: {
            type: Number,
            default: 0,
            min: [0, 'Pending claims cannot be negative']
        },
        successRate: {
            type: Number,
            min: [0, 'Success rate cannot be negative'],
            max: [100, 'Success rate cannot exceed 100']
        }
    },

    // ** SECURITY & COMPLIANCE **
    securityInfo: {
        encryptionUsed: {
            type: Boolean,
            default: true
        },
        tlsVersion: String,
        certificateInfo: {
            issuer: String,
            expiryDate: Date,
            fingerprint: String
        },
        ipAddress: {
            type: String,
            trim: true
        },
        userAgent: {
            type: String,
            trim: true
        },
        sessionId: {
            type: String,
            trim: true
        }
    },

    // ** NOTIFICATIONS & ALERTS **
    notificationInfo: {
        alertsSent: [{
            alertType: {
                type: String,
                enum: ['SLA_WARNING', 'SLA_BREACH', 'ERROR', 'SUCCESS', 'RETRY'],
                required: true
            },
            sentTo: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }],
            sentAt: {
                type: Date,
                default: Date.now
            },
            channel: {
                type: String,
                enum: ['EMAIL', 'SMS', 'IN_APP', 'WEBHOOK'],
                default: 'IN_APP'
            },
            message: String,
            acknowledged: {
                type: Boolean,
                default: false
            },
            acknowledgedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            acknowledgedAt: Date
        }],
        escalationAlerts: [{
            level: {
                type: Number,
                required: true,
                min: [1, 'Escalation level must be at least 1']
            },
            escalatedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            escalatedAt: {
                type: Date,
                default: Date.now
            },
            reason: String,
            resolved: {
                type: Boolean,
                default: false
            },
            resolvedAt: Date,
            resolvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }]
    },

    // ** PERFORMANCE TRACKING **
    performanceMetrics: {
        networkLatency: {
            type: Number, // milliseconds
            min: [0, 'Network latency cannot be negative']
        },
        serverProcessingTime: {
            type: Number, // milliseconds
            min: [0, 'Server processing time cannot be negative']
        },
        throughput: {
            type: Number, // records per second
            min: [0, 'Throughput cannot be negative']
        },
        errorRate: {
            type: Number, // percentage
            min: [0, 'Error rate cannot be negative'],
            max: [100, 'Error rate cannot exceed 100']
        },
        qualityScore: {
            type: Number,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100']
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR OPTIMAL PERFORMANCE **
chTransactionSchema.index({ companyRef: 1, clearinghouseRef: 1 });
chTransactionSchema.index({ 'transactionInfo.transactionType': 1, 'statusInfo.currentStatus': 1 });
chTransactionSchema.index({ 'slaTracking.expectedCompletionTime': 1, 'slaTracking.slaStatus': 1 });
chTransactionSchema.index({ 'statusInfo.initiatedAt': -1 });
chTransactionSchema.index({ 'transactionInfo.batchId': 1 });
chTransactionSchema.index({ 'transactionInfo.correlationId': 1 });
chTransactionSchema.index({ 'slaTracking.escalationRequired': 1, 'slaTracking.slaStatus': 1 });
chTransactionSchema.index({ initiatedBy: 1, 'statusInfo.initiatedAt': -1 });

// ** VIRTUAL FIELDS **
chTransactionSchema.virtual('isCompleted').get(function () {
    return [
        CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.COMPLETED,
        CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.FAILED,
        CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.CANCELLED
    ].includes(this.statusInfo?.currentStatus);
});

chTransactionSchema.virtual('isSuccessful').get(function () {
    return this.statusInfo?.currentStatus === CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.COMPLETED &&
        this.responseData?.httpStatusCode >= 200 &&
        this.responseData?.httpStatusCode < 300;
});

chTransactionSchema.virtual('slaBreached').get(function () {
    return this.slaTracking?.slaStatus === SLA_CONSTANTS.SLA_STATUS.BREACHED;
});

chTransactionSchema.virtual('minutesElapsed').get(function () {
    const start = this.statusInfo?.initiatedAt;
    const end = this.statusInfo?.completedAt || new Date();
    return start ? Math.floor((end - start) / (1000 * 60)) : 0;
});

chTransactionSchema.virtual('slaPercentageUsed').get(function () {
    if (!this.slaTracking?.expectedSLA) return 0;
    const elapsed = this.minutesElapsed;
    return Math.min(100, (elapsed / this.slaTracking.expectedSLA) * 100);
});

// ** MIDDLEWARE **

// Pre-save middleware to calculate SLA metrics
chTransactionSchema.pre('save', function (next) {
    // Set expected completion time if not set
    if (!this.slaTracking?.expectedCompletionTime && this.slaTracking?.expectedSLA) {
        this.slaTracking.expectedCompletionTime = new Date(
            this.statusInfo.initiatedAt.getTime() + (this.slaTracking.expectedSLA * 60 * 1000)
        );
    }

    // Update SLA status and warning level
    if (this.statusInfo?.initiatedAt && this.slaTracking?.expectedCompletionTime) {
        const now = new Date();
        const timeRemaining = Math.max(0,
            Math.floor((this.slaTracking.expectedCompletionTime - now) / (1000 * 60))
        );

        this.slaTracking.timeRemaining = timeRemaining;

        // Determine SLA status
        if (this.isCompleted) {
            if (this.statusInfo.completedAt <= this.slaTracking.expectedCompletionTime) {
                this.slaTracking.slaStatus = SLA_CONSTANTS.SLA_STATUS.RESOLVED;
            } else {
                this.slaTracking.slaStatus = SLA_CONSTANTS.SLA_STATUS.BREACHED;
                if (!this.slaTracking.breachedAt) {
                    this.slaTracking.breachedAt = this.statusInfo.completedAt;
                }
            }
        } else {
            const percentageRemaining = (timeRemaining / this.slaTracking.expectedSLA) * 100;

            if (timeRemaining <= 0) {
                this.slaTracking.slaStatus = SLA_CONSTANTS.SLA_STATUS.BREACHED;
                if (!this.slaTracking.breachedAt) {
                    this.slaTracking.breachedAt = now;
                }
                this.slaTracking.warningLevel = 'RED';
                this.slaTracking.escalationRequired = true;
            } else if (percentageRemaining <= SLA_CONSTANTS.WARNING_THRESHOLDS.RED) {
                this.slaTracking.slaStatus = SLA_CONSTANTS.SLA_STATUS.AT_RISK;
                this.slaTracking.warningLevel = 'RED';
            } else if (percentageRemaining <= SLA_CONSTANTS.WARNING_THRESHOLDS.YELLOW) {
                this.slaTracking.slaStatus = SLA_CONSTANTS.SLA_STATUS.AT_RISK;
                this.slaTracking.warningLevel = 'YELLOW';
            } else {
                this.slaTracking.slaStatus = SLA_CONSTANTS.SLA_STATUS.ON_TRACK;
                this.slaTracking.warningLevel = 'GREEN';
            }
        }
    }

    // Calculate success rate for business metrics
    if (this.businessMetrics) {
        const totalClaims = this.businessMetrics.acceptedClaims + this.businessMetrics.rejectedClaims;
        if (totalClaims > 0) {
            this.businessMetrics.successRate =
                Math.round((this.businessMetrics.acceptedClaims / totalClaims) * 100);
        }
    }

    next();
});

// Post-save middleware for gamification and notifications
chTransactionSchema.post('save', async function (doc) {
    try {
        // Award XP for successful transactions
        if (doc.isSuccessful && doc.isModified('statusInfo.currentStatus')) {
            const Employee = mongoose.model('Employee');
            await Employee.findByIdAndUpdate(
                doc.initiatedBy,
                {
                    $inc: {
                        'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.TASK_COMPLETED,
                        'performance.dailyMetrics.transactionsCompleted': 1
                    }
                },
                { new: true }
            );

            // Bonus XP for meeting SLA
            if (doc.slaTracking?.slaStatus === SLA_CONSTANTS.SLA_STATUS.RESOLVED) {
                await Employee.findByIdAndUpdate(
                    doc.initiatedBy,
                    {
                        $inc: {
                            'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.SLA_MET
                        }
                    }
                );
            }
        }

        // Trigger notifications for SLA breaches
        if (doc.slaBreached && doc.isModified('slaTracking.slaStatus')) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.initiatedBy,
                type: 'SLA_BREACH',
                title: 'SLA Breached - Clearinghouse Transaction',
                message: `Transaction ${doc.transactionId} has breached its SLA`,
                priority: 'HIGH',
                relatedEntity: {
                    entityType: 'CHTransaction',
                    entityId: doc._id
                }
            });
        }

    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

// ** STATIC METHODS **

// Find transactions requiring escalation
chTransactionSchema.statics.findRequiringEscalation = function (companyId) {
    return this.find({
        companyRef: companyId,
        'slaTracking.escalationRequired': true,
        'statusInfo.currentStatus': {
            $nin: [
                CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.COMPLETED,
                CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.FAILED,
                CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.CANCELLED
            ]
        }
    }).populate('initiatedBy clearinghouseRef');
};

// Get SLA metrics for a date range
chTransactionSchema.statics.getSLAMetrics = function (companyId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'statusInfo.initiatedAt': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                completedOnTime: {
                    $sum: {
                        $cond: [
                            { $eq: ['$slaTracking.slaStatus', SLA_CONSTANTS.SLA_STATUS.RESOLVED] },
                            1,
                            0
                        ]
                    }
                },
                breachedSLA: {
                    $sum: {
                        $cond: [
                            { $eq: ['$slaTracking.slaStatus', SLA_CONSTANTS.SLA_STATUS.BREACHED] },
                            1,
                            0
                        ]
                    }
                },
                avgProcessingTime: { $avg: '$statusInfo.processingDuration' },
                avgResponseTime: { $avg: '$statusInfo.responseTime' }
            }
        },
        {
            $project: {
                totalTransactions: 1,
                completedOnTime: 1,
                breachedSLA: 1,
                slaComplianceRate: {
                    $round: [
                        {
                            $multiply: [
                                { $divide: ['$completedOnTime', '$totalTransactions'] },
                                100
                            ]
                        },
                        2
                    ]
                },
                avgProcessingTimeMinutes: {
                    $round: [{ $divide: ['$avgProcessingTime', 60000] }, 2]
                },
                avgResponseTimeMinutes: {
                    $round: [{ $divide: ['$avgResponseTime', 60000] }, 2]
                }
            }
        }
    ]);
};

// ** INSTANCE METHODS **

// Update transaction status
chTransactionSchema.methods.updateStatus = function (newStatus, updatedBy, notes = '') {
    this.statusInfo.currentStatus = newStatus;
    this.statusInfo.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        updatedBy,
        notes,
        systemGenerated: false
    });

    // Set completion timestamp
    if ([
        CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.COMPLETED,
        CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.FAILED,
        CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.CANCELLED
    ].includes(newStatus)) {
        this.statusInfo.completedAt = new Date();

        // Calculate processing duration
        if (this.statusInfo.initiatedAt) {
            this.statusInfo.processingDuration =
                this.statusInfo.completedAt - this.statusInfo.initiatedAt;
        }
    }

    return this.save();
};

// Check if retry is needed and possible
chTransactionSchema.methods.canRetry = function () {
    return this.retryInfo.currentRetryCount < this.retryInfo.maxRetries &&
        this.retryInfo.autoRetryEnabled &&
        this.statusInfo.currentStatus === CLEARINGHOUSE_CONSTANTS.TRANSACTION_STATUS.FAILED;
};

// Schedule next retry
chTransactionSchema.methods.scheduleRetry = function (delayMinutes = 5) {
    if (!this.canRetry()) {
        throw new Error('Transaction cannot be retried');
    }

    this.retryInfo.currentRetryCount += 1;
    this.retryInfo.lastRetryAt = new Date();
    this.retryInfo.nextRetryAt = new Date(Date.now() + (delayMinutes * 60 * 1000));

    this.retryInfo.retryHistory.push({
        attemptNumber: this.retryInfo.currentRetryCount,
        attemptedAt: new Date(),
        nextRetryAt: this.retryInfo.nextRetryAt,
        retryDelay: delayMinutes * 60 * 1000
    });

    return this.save();
};

chTransactionSchema.plugin(scopedIdPlugin, {
    idField: 'transactionId',
    prefix: 'CHT',
    companyRefPath: 'companyRef'
});

export const CHTransaction = mongoose.model('CHTransaction', chTransactionSchema, 'chTransactions');