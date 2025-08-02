// backend/src/models/workflow/claimtasks.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const claimTasksSchema = new mongoose.Schema({
    claimId: {
        type: String,
        unique: true,
        default: () => `CLM-${uuidv4().substring(0, 10).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** MAIN RELATIONSHIPS - Core Links **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // GetMax company processing this claim
        required: [true, 'Company reference is required'],
        index: true
    },
    clientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Client who owns this claim
        required: [true, 'Client reference is required'],
        index: true
    },
    sowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SOW', // Which SOW this claim belongs to
        required: [true, 'SOW reference is required'],
        index: true
    },
    assignedEmployeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Currently assigned employee
        index: true,
        default: null // null = unassigned (floating pool)
    },
    patientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient', // Patient this claim is for
        required: [true, 'Patient reference is required'],
        index: true
    },
    primaryPayerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payer', // Primary insurance payer
        // required: [true, 'Primary payer reference is required'],
        index: true,
        default: null
    },
    secondaryPayerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payer', // Secondary insurance (optional)
        default: null
    },

    // ** CLAIM BASIC INFORMATION **
    claimInfo: {
        // External/Client claim ID (their system's ID)
        externalClaimId: {
            type: String,
            trim: true,
            index: true
        },
        // Claim type and service details
        claimType: {
            type: String,
            enum: [
                'Professional', 'Institutional', 'Dental', 'Vision',
                'DME', 'Pharmacy', 'Behavioral Health', 'Other'
            ],
            required: [true, 'Claim type is required'],
            default: 'Professional'
        },
        dateOfService: {
            type: Date,
            required: [true, 'Date of service is required'],
            index: true
        },
        dateOfServiceEnd: {
            type: Date, // For multi-day services
            validate: {
                validator: function (v) {
                    return !v || v >= this.claimInfo.dateOfService;
                },
                message: 'End date must be after or equal to start date'
            }
        },
        placeOfService: {
            type: String,
            trim: true,
            maxlength: [2, 'Place of service must be 2 characters'],
            validate: {
                validator: function (v) {
                    return !v || /^\d{2}$/.test(v);
                },
                message: 'Place of service must be 2 digits'
            }
        },
        // Service codes
        procedureCodes: [{
            cptCode: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: function (v) {
                        return /^\d{5}$|^[A-Z]\d{4}$/.test(v); // CPT or HCPCS format
                    },
                    message: 'Invalid CPT/HCPCS code format'
                }
            },
            modifier: {
                type: String,
                trim: true,
                maxlength: [2, 'Modifier cannot exceed 2 characters']
            },
            units: {
                type: Number,
                min: [1, 'Units must be at least 1'],
                default: 1
            },
            chargeAmount: {
                type: Number,
                min: [0, 'Charge amount cannot be negative'],
                required: true
            }
        }],
        diagnosisCodes: [{
            icdCode: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: function (v) {
                        return /^[A-Z]\d{2}(\.\d{1,3})?$/.test(v); // ICD-10 format
                    },
                    message: 'Invalid ICD-10 code format'
                }
            },
            isPrimary: {
                type: Boolean,
                default: false
            },
            description: {
                type: String,
                trim: true
            }
        }],
        // Provider information
        renderingProvider: {
            npi: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\d{10}$/.test(v);
                    },
                    message: 'NPI must be 10 digits'
                }
            },
            name: {
                type: String,
                trim: true
            },
            taxonomy: {
                type: String,
                trim: true
            }
        },
        billingProvider: {
            npi: String,
            name: String,
            taxId: String
        }
    },

    // ** FINANCIAL BREAKDOWN **
    financialInfo: {
        // Original charges
        grossCharges: {
            type: Number,
            required: [true, 'Gross charges is required'],
            min: [0, 'Gross charges cannot be negative']
        },
        // Contractual adjustments
        contractualDiscount: {
            type: Number,
            default: 0,
            min: [0, 'Contractual discount cannot be negative']
        },
        // Net charges after contractual
        netCharges: {
            type: Number,
            default: function () {
                return this.financialInfo.grossCharges - (this.financialInfo.contractualDiscount || 0);
            },
            min: [0, 'Net charges cannot be negative']
        },
        // Payments received
        paymentsPosted: [{
            paymentDate: {
                type: Date,
                required: true
            },
            amount: {
                type: Number,
                required: true,
                min: [0, 'Payment amount cannot be negative']
            },
            paymentMethod: {
                type: String,
                enum: ['Check', 'ACH', 'Credit Card', 'Cash', 'EFT', 'Wire Transfer'],
                required: true
            },
            payerType: {
                type: String,
                enum: ['Primary Insurance', 'Secondary Insurance', 'Patient', 'Other'],
                required: true
            },
            referenceNumber: {
                type: String,
                trim: true
            },
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }],
        totalPaymentsPosted: {
            type: Number,
            default: 0,
            min: [0, 'Total payments cannot be negative']
        },
        // Adjustments
        adjustments: [{
            adjustmentDate: {
                type: Date,
                required: true
            },
            amount: {
                type: Number,
                required: true,
                min: [0, 'Adjustment amount cannot be negative']
            },
            adjustmentType: {
                type: String,
                enum: ['Write-off', 'Contractual', 'Small Balance', 'Courtesy', 'Admin', 'Other'],
                required: true
            },
            reason: {
                type: String,
                trim: true,
                required: true
            },
            adjustedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }],
        totalAdjustments: {
            type: Number,
            default: 0,
            min: [0, 'Total adjustments cannot be negative']
        },
        // Patient responsibility
        patientResponsibility: {
            copay: {
                type: Number,
                default: 0,
                min: [0, 'Copay cannot be negative']
            },
            coinsurance: {
                type: Number,
                default: 0,
                min: [0, 'Coinsurance cannot be negative']
            },
            deductible: {
                type: Number,
                default: 0,
                min: [0, 'Deductible cannot be negative']
            },
            totalPatientResponsibility: {
                type: Number,
                default: function () {
                    const pr = this.financialInfo.patientResponsibility;
                    return (pr.copay || 0) + (pr.coinsurance || 0) + (pr.deductible || 0);
                }
            }
        },
        // Outstanding balance
        outstandingBalance: {
            type: Number,
            default: function () {
                const fi = this.financialInfo;
                return (fi.netCharges || 0) - (fi.totalPaymentsPosted || 0) - (fi.totalAdjustments || 0);
            },
            min: [0, 'Outstanding balance cannot be negative']
        }
    },

    // ** CLAIM STATUS & WORKFLOW **
    workflowStatus: {
        currentStatus: {
            type: String,
            enum: [
                'New', 'Assigned', 'In Progress', 'Pending Info', 'On Hold',
                'Pending Payment', 'Appealed', 'Denied', 'Completed',
                'QA Review', 'QA Failed', 'Closed'
            ],
            required: [true, 'Current status is required'],
            default: 'New',
            index: true
        },
        subStatus: [{
            type: String,
            trim: true
        }],
        actionCode: {
            type: String,
            enum: [
                'Initial Review', 'Sent to Payer', 'Follow Up Call', 'Appeal Submitted',
                'Info Requested', 'Payment Posted', 'Denied - File Appeal',
                'Collect from Patient', 'Write Off', 'Close Claim'
            ]
        },
        lastStatusUpdate: {
            date: {
                type: Date,
                default: Date.now
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            previousStatus: String,
            notes: String
        },
        isEscalated: {
            type: Boolean,
            default: false,
            index: true
        },
        escalationReason: {
            type: String,
            trim: true
        },
        escalatedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        escalatedDate: Date
    },

    // ** ASSIGNMENT & ALLOCATION **
    assignmentInfo: {
        assignmentDate: {
            type: Date,
            index: true
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        assignmentMethod: {
            type: String,
            enum: ['Auto', 'Manual', 'Escalation', 'Reassignment'],
            default: 'Auto'
        },
        isInFloatingPool: {
            type: Boolean,
            default: true, // New claims start in floating pool
            index: true
        },
        floatingPoolEntry: {
            type: Date,
            default: Date.now
        },
        reassignmentHistory: [{
            fromEmployee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            toEmployee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reassignedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reassignmentDate: {
                type: Date,
                default: Date.now
            },
            reason: {
                type: String,
                trim: true
            }
        }],
        workloadPriority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical', 'Urgent'],
            default: 'Normal',
            index: true
        }
    },

    // ** PRIORITY SCORING SYSTEM **
    priorityInfo: {
        priorityScore: {
            type: Number,
            default: 0,
            min: [0, 'Priority score cannot be negative'],
            index: true
        },
        agingDays: {
            type: Number,
            default: function () {
                const today = new Date();
                const dos = this.claimInfo.dateOfService;
                return Math.floor((today - dos) / (1000 * 60 * 60 * 24));
            },
            min: [0, 'Aging days cannot be negative']
        },
        payerScore: {
            type: Number,
            default: 5, // Default payer score (1-10 scale)
            min: [1, 'Payer score must be at least 1'],
            max: [10, 'Payer score cannot exceed 10']
        },
        isDenied: {
            type: Boolean,
            default: false,
            index: true
        },
        denialInfo: {
            denialDate: Date,
            denialReason: {
                type: String,
                trim: true
            },
            denialCode: {
                type: String,
                trim: true
            },
            isAppealable: {
                type: Boolean,
                default: true
            },
            appealDeadline: Date
        },
        lastPriorityUpdate: {
            type: Date,
            default: Date.now
        }
    },

    slaTrackingRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SLATracking',
        index: true
    },
    qaAuditRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QAAudit',
        index: true
    },

    // ** NOTES & COMMUNICATIONS **
    notesInfo: {
        lastNoteDate: Date,
        totalNotesCount: {
            type: Number,
            default: 0
        },
        lastNotePreview: {
            type: String,
            maxlength: [200, 'Note preview cannot exceed 200 characters']
        },
        hasStructuredNotes: {
            type: Boolean,
            default: false
        },
        requiresNotes: {
            type: Boolean,
            default: true
        }
    },

    // ** SUBMISSION & PROCESSING INFO **
    submissionInfo: {
        initialSubmissionDate: Date,
        submissionType: {
            type: String,
            enum: ['Electronic', 'Paper', 'Portal', 'Phone'],
            default: 'Electronic'
        },
        clearinghouseUsed: {
            type: String,
            trim: true
        },
        batchNumber: {
            type: String,
            trim: true
        },
        resubmissionCount: {
            type: Number,
            default: 0,
            min: [0, 'Resubmission count cannot be negative']
        },
        lastResubmissionDate: Date
    },

    // ** DATA SOURCE & INTEGRATION **
    sourceInfo: {
        dataSource: {
            type: String,
            enum: ['Manual Upload', 'API Sync', 'SFTP', 'Email', 'Direct Entry'],
            required: [true, 'Data source is required'],
            index: true
        },
        sourceReference: {
            type: String,
            trim: true // File name, API call ID, etc.
        },
        importBatchId: {
            type: String,
            trim: true,
            index: true
        },
        importDate: {
            type: Date,
            default: Date.now,
            index: true
        },
        lastSyncDate: Date,
        originalDataFormat: {
            type: String,
            enum: ['BET Standard', 'ClaimMD', 'EMSMC', 'Medisoft', 'Custom']
        }
    },

    // ** ACTIVITY METRICS **
    activityMetrics: {
        totalTimeSpent: {
            type: Number, // in minutes
            default: 0,
            min: [0, 'Total time spent cannot be negative']
        },
        lastActivityDate: {
            type: Date,
            default: Date.now,
            index: true
        },
        touchCount: {
            type: Number,
            default: 0,
            min: [0, 'Touch count cannot be negative']
        },
        statusChangeCount: {
            type: Number,
            default: 0,
            min: [0, 'Status change count cannot be negative']
        },
        followUpCount: {
            type: Number,
            default: 0,
            min: [0, 'Follow-up count cannot be negative']
        },
        nextFollowUpDate: Date
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isTestClaim: {
            type: Boolean,
            default: false,
            index: true
        },
        isDuplicate: {
            type: Boolean,
            default: false,
            index: true
        },
        duplicateCheckSum: {
            type: String,
            trim: true,
            index: true
        },
        version: {
            type: Number,
            default: 1,
            min: [1, 'Version must be at least 1']
        },
        lockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lockedAt: Date,
        archiveFlag: {
            type: Boolean,
            default: false
        },
        archiveDate: Date
    },

    // ** AUDIT TRAIL **
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Created by reference is required']
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        completedAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE OPTIMIZATION **
// Basic indexes
claimTasksSchema.index({ companyRef: 1, clientRef: 1, sowRef: 1 });
claimTasksSchema.index({ assignedEmployeeRef: 1, 'workflowStatus.currentStatus': 1 });
claimTasksSchema.index({ 'claimInfo.dateOfService': 1 });
claimTasksSchema.index({ 'financialInfo.outstandingBalance': 1 });
claimTasksSchema.index({ 'priorityInfo.priorityScore': -1 });

// Compound indexes for complex queries
claimTasksSchema.index({
    companyRef: 1,
    'workflowStatus.currentStatus': 1,
    'assignmentInfo.isInFloatingPool': 1
});

claimTasksSchema.index({
    sowRef: 1,
    assignedEmployeeRef: 1,
    'systemInfo.isActive': 1
});


// ** VIRTUALS **

claimTasksSchema.virtual('totalClaimValue').get(function () {
    return this.financialInfo.grossCharges || 0;
});

claimTasksSchema.virtual('netCollectable').get(function () {
    return this.financialInfo.netCharges - (this.financialInfo.totalPaymentsPosted || 0);
});

claimTasksSchema.virtual('isHighValue').get(function () {
    return this.financialInfo.grossCharges > 1000; // Configurable threshold
});

claimTasksSchema.virtual('isPastDue').get(function () {
    const agingThreshold = 90; // 90 days
    return this.priorityInfo.agingDays > agingThreshold;
});

// Populate references for common queries
claimTasksSchema.virtual('assignedEmployee', {
    ref: 'Employee',
    localField: 'assignedEmployeeRef',
    foreignField: '_id',
    justOne: true
});

claimTasksSchema.virtual('client', {
    ref: 'Client',
    localField: 'clientRef',
    foreignField: '_id',
    justOne: true
});

claimTasksSchema.virtual('sow', {
    ref: 'SOW',
    localField: 'sowRef',
    foreignField: '_id',
    justOne: true
});

// ** STATIC METHODS **
claimTasksSchema.statics.findFloatingPoolClaims = function (companyRef, sowRef = null) {
    const query = {
        companyRef,
        'assignmentInfo.isInFloatingPool': true,
        'systemInfo.isActive': true,
        'workflowStatus.currentStatus': { $nin: ['Completed', 'Closed'] }
    };

    if (sowRef) query.sowRef = sowRef;

    return this.find(query)
        .populate('clientRef', 'clientInfo.clientName')
        .populate('patientRef', 'personalInfo.firstName personalInfo.lastName')
        .sort({ 'priorityInfo.priorityScore': -1, 'assignmentInfo.floatingPoolEntry': 1 });
};

claimTasksSchema.statics.findEmployeeWorkload = function (employeeRef) {
    return this.find({
        assignedEmployeeRef: employeeRef,
        'systemInfo.isActive': true,
        'workflowStatus.currentStatus': { $nin: ['Completed', 'Closed'] }
    })
        .populate('clientRef', 'clientInfo.clientName')
        .populate('sowRef', 'sowName serviceDetails.serviceType')
        .sort({ 'priorityInfo.priorityScore': -1 });
};

claimTasksSchema.statics.findHighValueClaims = function (companyRef, minValue = 1000) {
    return this.find({
        companyRef,
        'financialInfo.grossCharges': { $gte: minValue },
        'financialInfo.outstandingBalance': { $gt: 0 },
        'systemInfo.isActive': true
    });
};

// ** INSTANCE METHODS **
claimTasksSchema.methods.calculatePriorityScore = function () {
    const sow = this.populated('sowRef') || this.sowRef;

    if (!sow || !sow.allocationConfig) {
        // Default weights if SOW not available
        const agingWeight = 0.4;
        const payerWeight = 0.3;
        const denialWeight = 0.3;

        this.priorityInfo.priorityScore =
            (this.priorityInfo.agingDays * agingWeight) +
            (this.priorityInfo.payerScore * payerWeight) +
            ((this.priorityInfo.isDenied ? 10 : 0) * denialWeight);
    } else {
        const weights = sow.allocationConfig.priorityFormula;
        this.priorityInfo.priorityScore =
            (this.priorityInfo.agingDays * weights.agingWeight) +
            (this.priorityInfo.payerScore * weights.payerWeight) +
            ((this.priorityInfo.isDenied ? 10 : 0) * weights.denialWeight);
    }

    this.priorityInfo.lastPriorityUpdate = new Date();
    return this.priorityInfo.priorityScore;
};

claimTasksSchema.methods.assignToEmployee = function (employeeRef, assignedBy, method = 'Manual') {
    this.assignedEmployeeRef = employeeRef;
    this.assignmentInfo.assignmentDate = new Date();
    this.assignmentInfo.assignedBy = assignedBy;
    this.assignmentInfo.assignmentMethod = method;
    this.assignmentInfo.isInFloatingPool = false;

    // Update status if it's still 'New'
    if (this.workflowStatus.currentStatus === 'New') {
        this.workflowStatus.currentStatus = 'Assigned';
        this.workflowStatus.lastStatusUpdate = {
            date: new Date(),
            updatedBy: assignedBy,
            previousStatus: 'New'
        };
    }
};

claimTasksSchema.methods.moveToFloatingPool = function (reason = 'Auto-reassignment') {
    this.assignedEmployeeRef = null;
    this.assignmentInfo.isInFloatingPool = true;
    this.assignmentInfo.floatingPoolEntry = new Date();

    // Add to reassignment history
    this.assignmentInfo.reassignmentHistory.push({
        fromEmployee: this.assignedEmployeeRef,
        toEmployee: null,
        reassignmentDate: new Date(),
        reason: reason
    });
};

claimTasksSchema.methods.updateFinancials = function (financialData) {
    if (financialData.payment) {
        this.financialInfo.paymentsPosted.push(financialData.payment);
        this.financialInfo.totalPaymentsPosted = this.financialInfo.paymentsPosted.reduce(
            (sum, payment) => sum + payment.amount, 0
        );
    }

    if (financialData.adjustment) {
        this.financialInfo.adjustments.push(financialData.adjustment);
        this.financialInfo.totalAdjustments = this.financialInfo.adjustments.reduce(
            (sum, adj) => sum + adj.amount, 0
        );
    }

    // Recalculate outstanding balance
    this.financialInfo.outstandingBalance =
        this.financialInfo.netCharges -
        this.financialInfo.totalPaymentsPosted -
        this.financialInfo.totalAdjustments;

    // Update activity
    this.activityMetrics.lastActivityDate = new Date();
    this.activityMetrics.touchCount += 1;
};

claimTasksSchema.methods.canBeCompleted = function () {
    const hasZeroBalance = this.financialInfo.outstandingBalance <= 0;
    const hasResolution = ['Paid', 'Denied', 'Written Off'].includes(this.workflowStatus.actionCode);

    return {
        canComplete: hasZeroBalance || hasResolution,
        reason: hasZeroBalance ? 'Zero balance' : hasResolution ? 'Resolution recorded' : 'Outstanding balance or no resolution'
    };
};

// ** PRE-SAVE MIDDLEWARE **
claimTasksSchema.pre('save', function (next) {
    // Calculate aging days
    if (this.claimInfo.dateOfService) {
        const today = new Date();
        this.priorityInfo.agingDays = Math.floor((today - this.claimInfo.dateOfService) / (1000 * 60 * 60 * 24));
    }

    // Calculate net charges
    this.financialInfo.netCharges = this.financialInfo.grossCharges - (this.financialInfo.contractualDiscount || 0);

    // Calculate outstanding balance
    this.financialInfo.outstandingBalance = Math.max(0,
        this.financialInfo.netCharges -
        (this.financialInfo.totalPaymentsPosted || 0) -
        (this.financialInfo.totalAdjustments || 0)
    );

    // Update priority score
    this.calculatePriorityScore();

    // Generate duplicate checksum for duplicate detection
    if (!this.systemInfo.duplicateCheckSum) {
        const checksumData = `${this.claimInfo.externalClaimId}-${this.patientRef}-${this.claimInfo.dateOfService}-${this.financialInfo.grossCharges}`;
        this.systemInfo.duplicateCheckSum = crypto
            .createHash('md5')
            .update(checksumData)
            .digest('hex');
    }

    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }

    next();
});

// ** POST-SAVE MIDDLEWARE **
claimTasksSchema.post('save', function (doc, next) {
    // Could trigger real-time notifications, webhook calls, etc.
    next();
});

export const ClaimTask = mongoose.model('ClaimTask', claimTasksSchema, 'claimtasks');