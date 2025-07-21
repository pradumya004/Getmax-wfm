// backend/src/models/edi/ediBatch.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin';

const ediBatchSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFICATION **
    batchId: {
        type: String,
        unique: true,
        // default: () => `BATCH-${uuidv4().substring(0, 8).toUpperCase()}`,
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
    clearinghouseRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clearinghouse',
        required: [true, 'Clearinghouse reference is required'],
        index: true
    },

    // ** BATCH INFORMATION **
    batchInfo: {
        batchName: {
            type: String,
            required: [true, 'Batch name is required'],
            trim: true,
            index: true
        },
        batchType: {
            type: String,
            enum: ['Claims_837', 'Eligibility_270', 'Authorization_278', 'Status_Inquiry_276', 'Payment_835', 'Mixed'],
            required: [true, 'Batch type is required'],
            index: true
        },
        batchCategory: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly', 'Adhoc', 'Emergency', 'Resubmission'],
            default: 'Daily',
            index: true
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical', 'Emergency'],
            default: 'Normal',
            index: true
        },
        scheduledProcessing: {
            type: Boolean,
            default: false,
            index: true
        },
        scheduledDate: Date,
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        }
    },

    // ** BATCH COMPOSITION **
    composition: {
        totalTransactions: {
            type: Number,
            default: 0,
            min: [0, 'Total transactions cannot be negative']
        },
        transactionTypes: [{
            transactionType: {
                type: String,
                enum: ['837P', '837I', '837D', '270', '271', '276', '277', '278', '835'],
                required: true
            },
            count: {
                type: Number,
                required: true,
                min: [0, 'Count cannot be negative']
            },
            totalAmount: {
                type: Number,
                default: 0,
                min: [0, 'Total amount cannot be negative']
            }
        }],
        claimRefs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClaimTasks'
        }],
        edi837Refs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EDI837'
        }],
        ediTransactionRefs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EDITransaction'
        }],
        payerBreakdown: [{
            payerRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payer',
                required: true
            },
            payerName: String,
            transactionCount: {
                type: Number,
                required: true,
                min: [0, 'Transaction count cannot be negative']
            },
            totalAmount: {
                type: Number,
                default: 0,
                min: [0, 'Total amount cannot be negative']
            }
        }],
        clientBreakdown: [{
            clientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client',
                required: true
            },
            clientName: String,
            transactionCount: {
                type: Number,
                required: true,
                min: [0, 'Transaction count cannot be negative']
            },
            totalAmount: {
                type: Number,
                default: 0,
                min: [0, 'Total amount cannot be negative']
            }
        }]
    },

    // ** PROCESSING STATUS **
    processingStatus: {
        status: {
            type: String,
            enum: [
                'Draft', 'Building', 'Ready', 'Validating', 'Validated', 'Queued',
                'Processing', 'Generating', 'Generated', 'Transmitting', 'Transmitted',
                'Acknowledged', 'Processed', 'Completed', 'Failed', 'Cancelled', 'Archived'
            ],
            default: 'Draft',
            index: true
        },
        stage: {
            type: String,
            enum: [
                'Initialization', 'Data_Collection', 'Validation', 'File_Generation',
                'Pre_Transmission', 'Transmission', 'Acknowledgment', 'Post_Processing',
                'Reporting', 'Archival', 'Completed'
            ],
            default: 'Initialization',
            index: true
        },
        progressPercentage: {
            type: Number,
            default: 0,
            min: [0, 'Progress cannot be negative'],
            max: [100, 'Progress cannot exceed 100%']
        },
        currentTask: {
            type: String,
            trim: true
        },
        estimatedCompletion: Date,
        startedAt: Date,
        completedAt: Date,
        processingDuration: Number, // in milliseconds
        lastActivityAt: {
            type: Date,
            default: Date.now
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    },

    // ** VALIDATION RESULTS **
    validation: {
        isValid: {
            type: Boolean,
            default: false,
            index: true
        },
        validationStarted: Date,
        validationCompleted: Date,
        validationDuration: Number, // in milliseconds

        // ** VALIDATION SUMMARY **
        validationSummary: {
            totalItemsValidated: {
                type: Number,
                default: 0
            },
            validItems: {
                type: Number,
                default: 0
            },
            invalidItems: {
                type: Number,
                default: 0
            },
            warningItems: {
                type: Number,
                default: 0
            },
            validationSuccessRate: {
                type: Number,
                default: 0,
                min: [0, 'Success rate cannot be negative'],
                max: [100, 'Success rate cannot exceed 100%']
            }
        },

        // ** VALIDATION RULES **
        validationRules: [{
            ruleId: String,
            ruleName: {
                type: String,
                required: true
            },
            ruleType: {
                type: String,
                enum: ['Syntax', 'Business', 'Payer_Specific', 'Clearinghouse', 'Compliance', 'Data_Quality'],
                required: true
            },
            severity: {
                type: String,
                enum: ['Info', 'Warning', 'Error', 'Critical'],
                required: true
            },
            passCount: {
                type: Number,
                default: 0
            },
            failCount: {
                type: Number,
                default: 0
            },
            warningCount: {
                type: Number,
                default: 0
            }
        }],

        // ** VALIDATION ERRORS **
        validationErrors: [{
            errorId: String,
            errorType: {
                type: String,
                enum: ['Syntax', 'Business_Rule', 'Data_Format', 'Missing_Data', 'Invalid_Value', 'Cross_Reference'],
                required: true
            },
            severity: {
                type: String,
                enum: ['Info', 'Warning', 'Error', 'Critical'],
                required: true
            },
            errorCode: String,
            errorMessage: {
                type: String,
                required: true
            },
            affectedTransactions: [String], // Transaction IDs
            affectedCount: {
                type: Number,
                default: 1
            },
            firstOccurrence: String, // First transaction where error occurred
            recommendation: String,
            canAutoFix: {
                type: Boolean,
                default: false
            },
            autoFixApplied: {
                type: Boolean,
                default: false
            }
        }],

        // ** PRE-TRANSMISSION CHECKS **
        preTransmissionChecks: [{
            checkName: {
                type: String,
                required: true
            },
            checkType: {
                type: String,
                enum: ['File_Format', 'Content_Validation', 'Business_Rules', 'Compliance', 'Security'],
                required: true
            },
            status: {
                type: String,
                enum: ['Pass', 'Fail', 'Warning', 'Skipped'],
                required: true
            },
            details: String,
            checkedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },

    // ** FILE GENERATION **
    fileGeneration: {
        generateFiles: {
            type: Boolean,
            default: true
        },
        outputFormat: {
            type: String,
            enum: ['X12', 'XML', 'JSON', 'CSV'],
            default: 'X12'
        },
        compressionEnabled: {
            type: Boolean,
            default: false
        },
        encryptionEnabled: {
            type: Boolean,
            default: false
        },

        // ** GENERATED FILES **
        generatedFiles: [{
            fileId: String,
            fileName: {
                type: String,
                required: true
            },
            fileType: {
                type: String,
                enum: ['837P', '837I', '837D', '270', '276', '278', 'Mixed'],
                required: true
            },
            fileSize: {
                type: Number,
                min: [0, 'File size cannot be negative']
            },
            recordCount: {
                type: Number,
                min: [0, 'Record count cannot be negative']
            },
            fileHash: String,
            filePath: String,
            backupPath: String,
            generatedAt: {
                type: Date,
                default: Date.now
            },
            isaControlNumber: String,
            gsControlNumber: String,
            stControlNumbers: [String]
        }],

        // ** GENERATION STATISTICS **
        generationStats: {
            totalFilesGenerated: {
                type: Number,
                default: 0
            },
            totalFileSize: {
                type: Number,
                default: 0
            },
            generationStarted: Date,
            generationCompleted: Date,
            generationDuration: Number, // in milliseconds
            averageFileSize: {
                type: Number,
                default: 0
            },
            largestFile: {
                fileName: String,
                fileSize: Number
            }
        }
    },

    // ** TRANSMISSION DETAILS **
    transmission: {
        transmissionMethod: {
            type: String,
            enum: ['HTTPS', 'SFTP', 'FTP', 'AS2', 'Email', 'Portal_Upload'],
            default: 'HTTPS'
        },
        endpoint: String,
        credentials: {
            username: String,
            // password stored separately in encrypted form
            certificateId: String,
            keyId: String
        },

        // ** TRANSMISSION ATTEMPTS **
        transmissionAttempts: [{
            attemptNumber: {
                type: Number,
                required: true,
                min: [1, 'Attempt number must be at least 1']
            },
            startedAt: {
                type: Date,
                default: Date.now
            },
            completedAt: Date,
            status: {
                type: String,
                enum: ['In_Progress', 'Success', 'Failed', 'Timeout', 'Cancelled'],
                required: true
            },
            filesTransmitted: [{
                fileName: String,
                transmissionId: String,
                status: {
                    type: String,
                    enum: ['Success', 'Failed', 'Timeout']
                },
                responseCode: String,
                responseMessage: String,
                transmissionTime: Number // milliseconds
            }],
            overallResponseCode: String,
            overallResponseMessage: String,
            duration: Number, // milliseconds
            errorDetails: String,
            retryReason: String
        }],

        // ** TRANSMISSION SETTINGS **
        settings: {
            maxRetries: {
                type: Number,
                default: 3,
                min: [1, 'Max retries must be at least 1'],
                max: [10, 'Max retries cannot exceed 10']
            },
            retryInterval: {
                type: Number,
                default: 300, // seconds
                min: [60, 'Retry interval must be at least 60 seconds']
            },
            timeout: {
                type: Number,
                default: 300000, // 5 minutes in milliseconds
                min: [30000, 'Timeout must be at least 30 seconds']
            },
            batchSizeLimit: {
                type: Number,
                default: 100,
                min: [1, 'Batch size must be at least 1']
            }
        },

        // ** TRANSMISSION STATUS **
        transmissionStatus: {
            isTransmitted: {
                type: Boolean,
                default: false,
                index: true
            },
            transmissionId: String,
            transmittedAt: Date,
            transmittedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            acknowledgmentReceived: {
                type: Boolean,
                default: false,
                index: true
            },
            acknowledgmentDate: Date,
            currentRetryCount: {
                type: Number,
                default: 0
            }
        }
    },

    // ** ACKNOWLEDGMENTS & RESPONSES **
    acknowledgments: [{
        acknowledgmentType: {
            type: String,
            enum: ['TA1', '999', '997', 'Custom'],
            required: true
        },
        acknowledgmentId: String,
        receivedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Accepted', 'Accepted_With_Errors', 'Rejected', 'Partially_Accepted'],
            required: true
        },
        controlNumber: String,

        // ** ACKNOWLEDGMENT DETAILS **
        details: {
            totalTransactionsAcknowledged: Number,
            acceptedTransactions: Number,
            rejectedTransactions: Number,
            errorCodes: [String],
            errorDescriptions: [String],
            warningCodes: [String],
            warningDescriptions: [String]
        },

        // ** TRANSACTION-LEVEL STATUS **
        transactionStatus: [{
            transactionId: String,
            controlNumber: String,
            status: {
                type: String,
                enum: ['Accepted', 'Rejected', 'Accepted_With_Errors']
            },
            errorCodes: [String],
            errorDescriptions: [String]
        }],

        rawContent: String, // Full acknowledgment content
        processedAt: Date,
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    }],

    // ** BUSINESS METRICS **
    metrics: {
        // ** PERFORMANCE METRICS **
        performance: {
            totalProcessingTime: Number, // milliseconds
            validationTime: Number,
            generationTime: Number,
            transmissionTime: Number,
            acknowledgmentTime: Number,

            throughput: {
                transactionsPerMinute: Number,
                transactionsPerHour: Number,
                megabytesPerMinute: Number
            },

            efficiency: {
                cpuUtilization: Number, // percentage
                memoryUtilization: Number, // percentage
                networkUtilization: Number // percentage
            }
        },

        // ** QUALITY METRICS **
        quality: {
            firstPassSuccessRate: {
                type: Number,
                default: 0,
                min: [0, 'Success rate cannot be negative'],
                max: [100, 'Success rate cannot exceed 100%']
            },
            errorRate: {
                type: Number,
                default: 0,
                min: [0, 'Error rate cannot be negative'],
                max: [100, 'Error rate cannot exceed 100%']
            },
            reprocessingRequired: {
                type: Boolean,
                default: false
            },
            dataQualityScore: {
                type: Number,
                default: 0,
                min: [0, 'Quality score cannot be negative'],
                max: [100, 'Quality score cannot exceed 100%']
            }
        },

        // ** BUSINESS IMPACT **
        businessImpact: {
            totalClaimAmount: {
                type: Number,
                default: 0,
                min: [0, 'Total claim amount cannot be negative']
            },
            potentialRevenue: {
                type: Number,
                default: 0,
                min: [0, 'Potential revenue cannot be negative']
            },
            costSavings: {
                type: Number,
                default: 0
            },
            timeToMarket: Number, // hours from creation to transmission
            businessPriority: {
                type: String,
                enum: ['Low', 'Medium', 'High', 'Critical'],
                default: 'Medium'
            }
        }
    },

    // ** ERROR TRACKING **
    errorTracking: {
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

        // ** ERROR CATEGORIZATION **
        errorCategories: [{
            category: {
                type: String,
                enum: ['Data_Quality', 'Business_Rules', 'Technical', 'Compliance', 'Integration'],
                required: true
            },
            count: {
                type: Number,
                required: true,
                min: [0, 'Count cannot be negative']
            },
            severity: {
                type: String,
                enum: ['Info', 'Warning', 'Error', 'Critical'],
                required: true
            },
            resolution: {
                type: String,
                enum: ['Auto_Fixed', 'Manual_Fix_Required', 'Escalated', 'Ignored', 'Pending'],
                default: 'Pending'
            }
        }],

        // ** ERROR RESOLUTION **
        resolutionTracking: {
            autoFixedErrors: {
                type: Number,
                default: 0
            },
            manualFixedErrors: {
                type: Number,
                default: 0
            },
            escalatedErrors: {
                type: Number,
                default: 0
            },
            pendingErrors: {
                type: Number,
                default: 0
            },
            resolutionStarted: Date,
            resolutionCompleted: Date,
            resolvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }
    },

    // ** SCHEDULING & AUTOMATION **
    scheduling: {
        isScheduled: {
            type: Boolean,
            default: false,
            index: true
        },
        scheduleType: {
            type: String,
            enum: ['One_Time', 'Daily', 'Weekly', 'Monthly', 'Custom_Cron'],
            default: 'One_Time'
        },
        cronExpression: String,
        nextRunDate: Date,
        lastRunDate: Date,
        runCount: {
            type: Number,
            default: 0,
            min: [0, 'Run count cannot be negative']
        },
        maxRuns: {
            type: Number,
            min: [1, 'Max runs must be at least 1']
        },
        autoRetry: {
            type: Boolean,
            default: true
        },
        notifyOnSuccess: {
            type: Boolean,
            default: false
        },
        notifyOnFailure: {
            type: Boolean,
            default: true
        },
        notificationRecipients: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }]
    },

    // ** AUDIT INFORMATION **
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        modifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedAt: Date,

        // ** AUDIT TRAIL **
        auditTrail: [{
            action: {
                type: String,
                enum: [
                    'Created', 'Modified', 'Validated', 'Generated', 'Transmitted',
                    'Acknowledged', 'Completed', 'Failed', 'Cancelled', 'Archived',
                    'Reprocessed', 'Approved', 'Rejected'
                ],
                required: true
            },
            performedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            details: String,
            oldValues: mongoose.Schema.Types.Mixed,
            newValues: mongoose.Schema.Types.Mixed,
            ipAddress: String,
            userAgent: String,
            systemGenerated: {
                type: Boolean,
                default: false
            }
        }]
    },

    // ** SYSTEM INFORMATION **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isArchived: {
            type: Boolean,
            default: false,
            index: true
        },
        archiveDate: Date,
        retentionDate: Date,
        version: {
            type: String,
            default: '1.0'
        },
        environment: {
            type: String,
            enum: ['Development', 'Testing', 'Staging', 'Production'],
            default: 'Production'
        },
        processServer: String,
        processId: String,
        memoryUsage: Number, // in MB
        cpuUsage: Number, // percentage
        tags: [String] // For categorization and filtering
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
ediBatchSchema.index({ companyRef: 1, 'batchInfo.batchType': 1, createdAt: -1 });
ediBatchSchema.index({ 'processingStatus.status': 1, 'processingStatus.stage': 1 });
ediBatchSchema.index({ 'scheduling.isScheduled': 1, 'scheduling.nextRunDate': 1 });
ediBatchSchema.index({ 'validation.isValid': 1, 'errorTracking.hasErrors': 1 });
ediBatchSchema.index({ clearinghouseRef: 1, 'transmission.transmissionStatus.isTransmitted': 1 });

// Compound indexes for complex queries
ediBatchSchema.index({
    companyRef: 1,
    'batchInfo.batchType': 1,
    'processingStatus.status': 1,
    'batchInfo.priority': -1,
    createdAt: -1
});

ediBatchSchema.index({
    'composition.claimRefs': 1,
    'processingStatus.status': 1,
    'systemInfo.isActive': 1
});

// ** VIRTUAL FIELDS **
ediBatchSchema.virtual('isCompleted').get(function () {
    return this.processingStatus.status === 'Completed' &&
        this.transmission.transmissionStatus.isTransmitted &&
        this.transmission.transmissionStatus.acknowledgmentReceived;
});

ediBatchSchema.virtual('hasErrors').get(function () {
    return this.errorTracking.hasErrors ||
        this.errorTracking.errorCount > 0;
});

ediBatchSchema.virtual('isReadyForTransmission').get(function () {
    return this.validation.isValid &&
        this.processingStatus.status === 'Generated' &&
        this.fileGeneration.generatedFiles.length > 0;
});

ediBatchSchema.virtual('ageInHours').get(function () {
    const now = new Date();
    const created = new Date(this.createdAt);
    return Math.floor((now - created) / (1000 * 60 * 60));
});

// ** INSTANCE METHODS **
ediBatchSchema.methods.updateStatus = function (status, stage, progressPercentage, currentTask, updatedBy) {
    this.processingStatus.status = status;
    this.processingStatus.stage = stage;
    this.processingStatus.progressPercentage = progressPercentage;
    this.processingStatus.currentTask = currentTask;
    this.processingStatus.lastActivityAt = new Date();

    if (status === 'Processing' && !this.processingStatus.startedAt) {
        this.processingStatus.startedAt = new Date();
    }

    if (['Completed', 'Failed', 'Cancelled'].includes(status)) {
        this.processingStatus.completedAt = new Date();
        if (this.processingStatus.startedAt) {
            this.processingStatus.processingDuration =
                this.processingStatus.completedAt - this.processingStatus.startedAt;
        }
    }

    // Add audit trail entry
    this.auditInfo.auditTrail.push({
        action: 'Modified',
        performedBy: updatedBy,
        details: `Status updated to ${status}, Stage: ${stage}`,
        timestamp: new Date()
    });

    return this.save();
};

ediBatchSchema.methods.addTransactions = function (transactions, addedBy) {
    transactions.forEach(transaction => {
        if (transaction.type === 'claim') {
            this.composition.claimRefs.push(transaction.ref);
        } else if (transaction.type === 'edi837') {
            this.composition.edi837Refs.push(transaction.ref);
        } else if (transaction.type === 'ediTransaction') {
            this.composition.ediTransactionRefs.push(transaction.ref);
        }
    });

    this.composition.totalTransactions += transactions.length;

    // Add audit trail entry
    this.auditInfo.auditTrail.push({
        action: 'Modified',
        performedBy: addedBy,
        details: `Added ${transactions.length} transactions to batch`,
        timestamp: new Date()
    });

    return this.save();
};

ediBatchSchema.methods.validateBatch = async function (validatedBy) {
    this.validation.validationStarted = new Date();
    this.processingStatus.status = 'Validating';
    this.processingStatus.stage = 'Validation';
    this.processingStatus.progressPercentage = 25;

    try {
        // Implementation would perform actual validation
        // For now, simulate validation
        let totalItems = this.composition.totalTransactions;
        let validItems = Math.floor(totalItems * 0.95); // 95% success rate
        let invalidItems = totalItems - validItems;

        this.validation.validationSummary = {
            totalItemsValidated: totalItems,
            validItems,
            invalidItems,
            warningItems: Math.floor(totalItems * 0.1),
            validationSuccessRate: Math.round((validItems / totalItems) * 100)
        };

        this.validation.isValid = invalidItems === 0;
        this.validation.validationCompleted = new Date();
        this.validation.validationDuration =
            this.validation.validationCompleted - this.validation.validationStarted;

        if (this.validation.isValid) {
            this.processingStatus.status = 'Validated';
            this.processingStatus.progressPercentage = 50;
        } else {
            this.processingStatus.status = 'Failed';
            this.errorTracking.hasErrors = true;
            this.errorTracking.errorCount = invalidItems;
        }

        await this.save();
    } catch (error) {
        this.processingStatus.status = 'Failed';
        this.errorTracking.hasErrors = true;
        throw error;
    }

    return this.validation.isValid;
};

ediBatchSchema.methods.generateFiles = async function (generatedBy) {
    if (!this.validation.isValid) {
        throw new Error('Cannot generate files for invalid batch');
    }

    this.fileGeneration.generationStats.generationStarted = new Date();
    this.processingStatus.status = 'Generating';
    this.processingStatus.stage = 'File_Generation';
    this.processingStatus.progressPercentage = 70;

    try {
        // Implementation would generate actual EDI files
        // For now, simulate file generation
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${this.batchInfo.batchType}_${this.batchId}_${timestamp}.x12`;

        this.fileGeneration.generatedFiles.push({
            fileId: `FILE-${Date.now()}`,
            fileName,
            fileType: this.batchInfo.batchType.split('_')[1] || this.batchInfo.batchType,
            fileSize: 1024 * 100, // 100KB
            recordCount: this.composition.totalTransactions,
            fileHash: `hash-${Date.now()}`,
            filePath: `/files/generated/${fileName}`,
            backupPath: `/files/backup/${fileName}`,
            isaControlNumber: `ISA-${Date.now()}`,
            gsControlNumber: `GS-${Date.now()}`
        });

        this.fileGeneration.generationStats = {
            totalFilesGenerated: this.fileGeneration.generatedFiles.length,
            totalFileSize: this.fileGeneration.generatedFiles.reduce((sum, file) => sum + file.fileSize, 0),
            generationCompleted: new Date(),
            averageFileSize: this.fileGeneration.generatedFiles.reduce((sum, file) => sum + file.fileSize, 0) / this.fileGeneration.generatedFiles.length
        };

        this.fileGeneration.generationStats.generationDuration =
            this.fileGeneration.generationStats.generationCompleted - this.fileGeneration.generationStats.generationStarted;

        this.processingStatus.status = 'Generated';
        this.processingStatus.progressPercentage = 80;

        await this.save();
    } catch (error) {
        this.processingStatus.status = 'Failed';
        throw error;
    }

    return this.fileGeneration.generatedFiles;
};

ediBatchSchema.methods.transmit = async function (transmittedBy) {
    if (!this.isReadyForTransmission) {
        throw new Error('Batch is not ready for transmission');
    }

    const attemptNumber = this.transmission.transmissionAttempts.length + 1;
    const startTime = new Date();

    try {
        // Implementation would handle actual transmission
        // For now, simulate transmission
        const filesTransmitted = this.fileGeneration.generatedFiles.map(file => ({
            fileName: file.fileName,
            transmissionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'Success',
            responseCode: '200',
            responseMessage: 'Successfully transmitted',
            transmissionTime: 2000 // 2 seconds
        }));

        this.transmission.transmissionAttempts.push({
            attemptNumber,
            startedAt: startTime,
            completedAt: new Date(),
            status: 'Success',
            filesTransmitted,
            overallResponseCode: '200',
            overallResponseMessage: 'Batch successfully transmitted',
            duration: 5000 // 5 seconds
        });

        this.transmission.transmissionStatus = {
            isTransmitted: true,
            transmissionId: `BATCH-TXN-${Date.now()}`,
            transmittedAt: new Date(),
            transmittedBy
        };

        this.processingStatus.status = 'Transmitted';
        this.processingStatus.stage = 'Acknowledgment';
        this.processingStatus.progressPercentage = 90;

        await this.save();

    } catch (error) {
        this.transmission.transmissionAttempts.push({
            attemptNumber,
            startedAt: startTime,
            completedAt: new Date(),
            status: 'Failed',
            overallResponseCode: '500',
            overallResponseMessage: error.message,
            errorDetails: error.stack
        });

        this.transmission.transmissionStatus.currentRetryCount++;
        this.processingStatus.status = 'Failed';
        throw error;
    }

    return this.transmission.transmissionStatus.transmissionId;
};

ediBatchSchema.methods.processAcknowledgment = function (ackData) {
    this.acknowledgments.push({
        acknowledgmentType: ackData.type,
        acknowledgmentId: ackData.id,
        receivedAt: new Date(),
        status: ackData.status,
        controlNumber: ackData.controlNumber,
        details: ackData.details,
        transactionStatus: ackData.transactionStatus || [],
        rawContent: ackData.rawContent,
        processedAt: new Date()
    });

    this.transmission.transmissionStatus.acknowledgmentReceived = true;
    this.transmission.transmissionStatus.acknowledgmentDate = new Date();

    if (ackData.status === 'Accepted') {
        this.processingStatus.status = 'Completed';
        this.processingStatus.stage = 'Completed';
        this.processingStatus.progressPercentage = 100;
    } else if (ackData.status === 'Rejected') {
        this.processingStatus.status = 'Failed';
        this.errorTracking.hasErrors = true;
        this.errorTracking.errorCount += (ackData.details?.rejectedTransactions || 0);
    }

    return this.save();
};

// ** STATIC METHODS **
ediBatchSchema.statics.findPendingProcessing = function (companyRef) {
    return this.find({
        companyRef,
        'processingStatus.status': { $in: ['Draft', 'Ready', 'Queued'] },
        'systemInfo.isActive': true
    }).sort({ 'batchInfo.priority': -1, createdAt: 1 });
};

ediBatchSchema.statics.findScheduledBatches = function () {
    const now = new Date();
    return this.find({
        'scheduling.isScheduled': true,
        'scheduling.nextRunDate': { $lte: now },
        'systemInfo.isActive': true
    }).sort({ 'scheduling.nextRunDate': 1 });
};

ediBatchSchema.statics.findByDateRange = function (companyRef, startDate, endDate) {
    return this.find({
        companyRef,
        createdAt: {
            $gte: startDate,
            $lte: endDate
        },
        'systemInfo.isActive': true
    }).sort({ createdAt: -1 });
};

ediBatchSchema.statics.getBatchReport = function (companyRef, dateRange) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyRef),
                createdAt: {
                    $gte: dateRange.start,
                    $lte: dateRange.end
                }
            }
        },
        {
            $group: {
                _id: '$batchInfo.batchType',
                totalBatches: { $sum: 1 },
                totalTransactions: { $sum: '$composition.totalTransactions' },
                successfulBatches: {
                    $sum: { $cond: [{ $eq: ['$processingStatus.status', 'Completed'] }, 1, 0] }
                },
                failedBatches: {
                    $sum: { $cond: [{ $eq: ['$processingStatus.status', 'Failed'] }, 1, 0] }
                },
                averageProcessingTime: { $avg: '$processingStatus.processingDuration' },
                totalErrors: { $sum: '$errorTracking.errorCount' }
            }
        },
        {
            $addFields: {
                successRate: {
                    $multiply: [
                        { $divide: ['$successfulBatches', '$totalBatches'] },
                        100
                    ]
                }
            }
        }
    ]);
};

ediBatchSchema.plugin(scopedIdPlugin, {
    idField: 'batchId',
    prefix: 'EDI-BATCH',
    companyRefPath: 'companyRef'
});

// ** PRE-SAVE MIDDLEWARE **
ediBatchSchema.pre('save', function (next) {
    // Set retention date (7 years for HIPAA compliance)
    if (!this.systemInfo.retentionDate) {
        const retentionDate = new Date();
        retentionDate.setFullYear(retentionDate.getFullYear() + 7);
        this.systemInfo.retentionDate = retentionDate;
    }

    // Update error tracking
    if (this.validation.validationErrors) {
        this.errorTracking.errorCount = this.validation.validationErrors.length;
        this.errorTracking.hasErrors = this.errorTracking.errorCount > 0;
        this.errorTracking.criticalErrorCount = this.validation.validationErrors.filter(
            error => error.severity === 'Critical'
        ).length;
    }

    next();
});

export const EDIBatch = mongoose.model('EDIBatch', ediBatchSchema, 'ediBatches');