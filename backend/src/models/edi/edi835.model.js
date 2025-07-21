// backend/src/models/edi/edi835.model.js

import { mongoose } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin';

const edi835Schema = new mongoose.Schema({
    // ** UNIQUE IDENTIFICATION **
    edi835Id: {
        type: String,
        unique: true,
        // default: () => `ERA-${uuidv4().substring(0, 8).toUpperCase()}`,
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
    payerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payer',
        required: [true, 'Payer reference is required'],
        index: true
    },

    // ** EDI FILE INFORMATION **
    fileInfo: {
        fileName: {
            type: String,
            required: [true, 'File name is required'],
            trim: true,
            index: true
        },
        originalFileName: {
            type: String,
            required: [true, 'Original file name is required'],
            trim: true
        },
        fileSize: {
            type: Number,
            required: [true, 'File size is required'],
            min: [0, 'File size cannot be negative']
        },
        fileHash: {
            type: String,
            trim: true,
            index: true // For duplicate detection and integrity verification
        },
        receivedDate: {
            type: Date,
            default: Date.now,
            index: true
        },
        processedDate: Date,
        fileUrl: {
            type: String,
            trim: true // Storage location
        },
        backupUrl: {
            type: String,
            trim: true // Backup storage location
        }
    },

    // ** EDI TRANSACTION HEADER (ISA/GS) **
    transactionHeader: {
        isaControlNumber: {
            type: String,
            required: [true, 'ISA control number is required'],
            trim: true,
            index: true
        },
        gsControlNumber: {
            type: String,
            required: [true, 'GS control number is required'],
            trim: true,
            index: true
        },
        functionalGroupCode: {
            type: String,
            default: 'HP', // Health Care Claim Payment/Advice
            trim: true
        },
        transactionSetId: {
            type: String,
            default: '835',
            trim: true
        },
        versionNumber: {
            type: String,
            default: '005010X221A1',
            trim: true
        },
        senderId: {
            type: String,
            required: [true, 'Sender ID is required'],
            trim: true
        },
        receiverId: {
            type: String,
            required: [true, 'Receiver ID is required'],
            trim: true
        },
        creationDate: {
            type: Date,
            required: [true, 'Creation date is required']
        },
        creationTime: {
            type: String,
            trim: true
        }
    },

    // ** PAYMENT INFORMATION (BPR SEGMENT) **
    paymentInfo: {
        transactionHandlingCode: {
            type: String,
            enum: ['C', 'D', 'I', 'P', 'U', 'X'], // C=Payment, D=Prenotification, etc.
            required: [true, 'Transaction handling code is required'],
            index: true
        },
        paymentAmount: {
            type: Number,
            required: [true, 'Payment amount is required'],
            min: [0, 'Payment amount cannot be negative']
        },
        creditOrDebit: {
            type: String,
            enum: ['C', 'D'], // C=Credit, D=Debit
            required: [true, 'Credit or debit indicator is required']
        },
        paymentMethod: {
            type: String,
            enum: ['ACH', 'CHK', 'FWT', 'NON'], // ACH, Check, Federal Wire Transfer, Non-payment
            required: [true, 'Payment method is required'],
            index: true
        },
        paymentFormatCode: {
            type: String,
            enum: ['CCP', 'CTX'], // CCP=Cash Concentration/Disbursement, CTX=Corporate Trade Exchange
            default: 'CCP'
        },
        effectiveDate: {
            type: Date,
            required: [true, 'Effective date is required'],
            index: true
        },
        checkNumber: {
            type: String,
            trim: true,
            index: true
        },
        traceNumber: {
            type: String,
            trim: true,
            index: true
        }
    },

    // ** PAYER INFORMATION (N1 SEGMENTS) **
    payerInfo: {
        payerName: {
            type: String,
            required: [true, 'Payer name is required'],
            trim: true
        },
        payerId: {
            type: String,
            required: [true, 'Payer ID is required'],
            trim: true,
            index: true
        },
        payerAddress: {
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            zipCode: String
        },
        contactInfo: {
            phone: String,
            fax: String,
            email: String,
            website: String
        }
    },

    // ** PAYEE INFORMATION **
    payeeInfo: {
        payeeName: {
            type: String,
            required: [true, 'Payee name is required'],
            trim: true
        },
        payeeId: {
            type: String,
            required: [true, 'Payee ID is required'],
            trim: true,
            index: true
        },
        npi: {
            type: String,
            trim: true,
            index: true
        },
        taxId: {
            type: String,
            trim: true
        },
        payeeAddress: {
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            zipCode: String
        }
    },

    // ** CLAIM PAYMENT DETAILS (CLP SEGMENTS) **
    claimPayments: [{
        claimId: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        claimRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClaimTasks',
            index: true
        },
        claimStatus: {
            type: String,
            enum: [
                '1', '2', '3', '4', '5', '19', '20', '21', '22', '23', '25'
                // 1=Processed as Primary, 2=Processed as Secondary, 3=Processed as Tertiary
                // 4=Denied, 5=Pended, 19=Processed as Primary/Forwarded, etc.
            ],
            required: true,
            index: true
        },
        totalChargeAmount: {
            type: Number,
            required: true,
            min: [0, 'Total charge amount cannot be negative']
        },
        paymentAmount: {
            type: Number,
            required: true,
            min: [0, 'Payment amount cannot be negative']
        },
        patientResponsibility: {
            type: Number,
            default: 0,
            min: [0, 'Patient responsibility cannot be negative']
        },
        claimFilingIndicator: {
            type: String,
            enum: ['11', '12', '13', '14', '15', '16', '17', 'AM', 'BL', 'CH', 'CI', 'DS', 'FI', 'HM', 'LM', 'MA', 'MB', 'MC', 'OF', 'TV', 'VA', 'WC', 'ZZ'],
            // 11=Other Non-Federal Programs, 12=Preferred Provider Organization, etc.
            trim: true
        },
        payerClaimNumber: {
            type: String,
            trim: true,
            index: true
        },
        facilityCode: {
            type: String,
            trim: true
        },

        // ** SERVICE LINE DETAILS (SVC SEGMENTS) **
        serviceLines: [{
            serviceLineNumber: {
                type: Number,
                required: true,
                min: [1, 'Service line number must be at least 1']
            },
            procedureCode: {
                type: String,
                required: true,
                trim: true
            },
            procedureModifiers: [String],
            chargeAmount: {
                type: Number,
                required: true,
                min: [0, 'Charge amount cannot be negative']
            },
            paidAmount: {
                type: Number,
                required: true,
                min: [0, 'Paid amount cannot be negative']
            },
            units: {
                type: Number,
                default: 1,
                min: [0, 'Units cannot be negative']
            },
            serviceDate: {
                type: Date,
                required: true
            },
            serviceEndDate: Date,

            // ** ADJUSTMENT DETAILS (CAS SEGMENTS) **
            adjustments: [{
                adjustmentGroup: {
                    type: String,
                    enum: ['CO', 'CR', 'OA', 'PI', 'PR'], // CO=Contractual, CR=Correction, OA=Other, PI=Payer Initiated, PR=Patient Responsibility
                    required: true
                },
                adjustmentCode: {
                    type: String,
                    required: true,
                    trim: true
                },
                adjustmentAmount: {
                    type: Number,
                    required: true
                },
                adjustmentQuantity: {
                    type: Number,
                    default: 0
                },
                adjustmentDescription: {
                    type: String,
                    trim: true
                }
            }],

            // ** REMARK CODES **
            remarkCodes: [{
                codeType: {
                    type: String,
                    enum: ['HE', 'N4'], // HE=Health Care, N4=Alert
                    default: 'HE'
                },
                code: {
                    type: String,
                    required: true,
                    trim: true
                },
                description: {
                    type: String,
                    trim: true
                }
            }],

            // ** DATES **
            dates: [{
                dateQualifier: {
                    type: String,
                    enum: ['150', '151', '232', '233', '472'], // 150=Service, 151=Admission, etc.
                    required: true
                },
                date: {
                    type: Date,
                    required: true
                }
            }],

            // ** PROVIDER INFORMATION **
            provider: {
                npi: String,
                name: String,
                taxId: String
            }
        }],

        // ** CLAIM-LEVEL ADJUSTMENTS **
        claimAdjustments: [{
            adjustmentGroup: {
                type: String,
                enum: ['CO', 'CR', 'OA', 'PI', 'PR'],
                required: true
            },
            adjustmentCode: {
                type: String,
                required: true,
                trim: true
            },
            adjustmentAmount: {
                type: Number,
                required: true
            },
            adjustmentQuantity: {
                type: Number,
                default: 0
            }
        }],

        // ** CLAIM DATES **
        claimDates: [{
            dateQualifier: {
                type: String,
                enum: ['232', '233', '050', '036'], // 232=Statement From, 233=Statement To, etc.
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }],

        // ** PATIENT INFORMATION **
        patientInfo: {
            patientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient'
            },
            patientName: {
                lastName: String,
                firstName: String,
                middleInitial: String
            },
            patientId: String,
            dateOfBirth: Date,
            gender: {
                type: String,
                enum: ['M', 'F', 'U'] // Male, Female, Unknown
            }
        }
    }],

    // ** PROCESSING STATUS **
    processingStatus: {
        status: {
            type: String,
            enum: ['Received', 'Parsing', 'Parsed', 'Validating', 'Validated', 'Processing', 'Processed', 'Posted', 'Error', 'Rejected'],
            default: 'Received',
            index: true
        },
        stage: {
            type: String,
            enum: ['File_Reception', 'EDI_Parsing', 'Data_Validation', 'Claim_Matching', 'Payment_Posting', 'Reporting', 'Completed'],
            default: 'File_Reception',
            index: true
        },
        progressPercentage: {
            type: Number,
            default: 0,
            min: [0, 'Progress cannot be negative'],
            max: [100, 'Progress cannot exceed 100%']
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        startedAt: Date,
        completedAt: Date,
        processingDuration: Number, // in milliseconds
        lastActivityAt: {
            type: Date,
            default: Date.now
        }
    },

    // ** VALIDATION RESULTS **
    validation: {
        isValid: {
            type: Boolean,
            default: false,
            index: true
        },
        validationErrors: [{
            errorType: {
                type: String,
                enum: ['Syntax', 'Semantic', 'Business_Rule', 'Data_Format', 'Missing_Data'],
                required: true
            },
            errorCode: String,
            errorMessage: {
                type: String,
                required: true
            },
            severity: {
                type: String,
                enum: ['Info', 'Warning', 'Error', 'Critical'],
                default: 'Error'
            },
            segmentId: String,
            elementPosition: String,
            lineNumber: Number
        }],
        validationWarnings: [{
            warningType: String,
            warningMessage: String,
            segmentId: String,
            lineNumber: Number
        }],
        validatedAt: Date,
        validatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    },

    // ** MATCHING RESULTS **
    matching: {
        totalClaims: {
            type: Number,
            default: 0,
            min: [0, 'Total claims cannot be negative']
        },
        matchedClaims: {
            type: Number,
            default: 0,
            min: [0, 'Matched claims cannot be negative']
        },
        unmatchedClaims: {
            type: Number,
            default: 0,
            min: [0, 'Unmatched claims cannot be negative']
        },
        matchingPercentage: {
            type: Number,
            default: 0,
            min: [0, 'Matching percentage cannot be negative'],
            max: [100, 'Matching percentage cannot exceed 100%']
        },
        unmatchedReasons: [{
            claimId: String,
            reason: {
                type: String,
                enum: ['Claim_Not_Found', 'Multiple_Matches', 'Date_Mismatch', 'Amount_Mismatch', 'Provider_Mismatch', 'Patient_Mismatch']
            },
            description: String
        }],
        autoMatchingEnabled: {
            type: Boolean,
            default: true
        },
        manualReviewRequired: {
            type: Boolean,
            default: false,
            index: true
        }
    },

    // ** POSTING RESULTS **
    posting: {
        isPosted: {
            type: Boolean,
            default: false,
            index: true
        },
        postingMethod: {
            type: String,
            enum: ['Automatic', 'Manual', 'Batch'],
            default: 'Automatic'
        },
        postedAmount: {
            type: Number,
            default: 0,
            min: [0, 'Posted amount cannot be negative']
        },
        postedClaims: {
            type: Number,
            default: 0,
            min: [0, 'Posted claims cannot be negative']
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        postedAt: Date,
        postingErrors: [{
            claimId: String,
            errorMessage: String,
            errorCode: String,
            amount: Number
        }],
        varianceAmount: {
            type: Number,
            default: 0 // Difference between expected and actual amounts
        },
        requiresReview: {
            type: Boolean,
            default: false,
            index: true
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        reviewedAt: Date,
        reviewNotes: String
    },

    // ** FINANCIAL SUMMARY **
    financialSummary: {
        totalChargeAmount: {
            type: Number,
            default: 0,
            min: [0, 'Total charge amount cannot be negative']
        },
        totalPaymentAmount: {
            type: Number,
            default: 0,
            min: [0, 'Total payment amount cannot be negative']
        },
        totalAdjustmentAmount: {
            type: Number,
            default: 0
        },
        totalPatientResponsibility: {
            type: Number,
            default: 0,
            min: [0, 'Total patient responsibility cannot be negative']
        },
        netCollectionAmount: {
            type: Number,
            default: 0
        },
        collectionRate: {
            type: Number,
            default: 0,
            min: [0, 'Collection rate cannot be negative'],
            max: [100, 'Collection rate cannot exceed 100%']
        }
    },
    // ** REPORTING & ANALYTICS **
    analytics: {
        denialRate: {
            type: Number,
            default: 0,
            min: [0, 'Denial rate cannot be negative'],
            max: [100, 'Denial rate cannot exceed 100%']
        },
        averagePaymentAmount: {
            type: Number,
            default: 0,
            min: [0, 'Average payment amount cannot be negative']
        },
        processingDays: {
            type: Number,
            default: 0,
            min: [0, 'Processing days cannot be negative']
        },
        topDenialReasons: [{
            code: String,
            description: String,
            count: Number,
            amount: Number
        }],
        performanceMetrics: {
            processingSpeed: Number, // claims per hour
            accuracyRate: Number, // percentage
            errorRate: Number // percentage
        }
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
        retentionDate: Date, // When to delete
        version: {
            type: String,
            default: '1.0'
        },
        sourceSystem: {
            type: String,
            enum: ['Manual_Upload', 'FTP', 'SFTP', 'API', 'Email', 'Clearinghouse_Portal'],
            default: 'Manual_Upload'
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Urgent'],
            default: 'Normal',
            index: true
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
edi835Schema.index({ companyRef: 1, 'fileInfo.receivedDate': -1 });
edi835Schema.index({ 'transactionHeader.isaControlNumber': 1, 'transactionHeader.gsControlNumber': 1 });
edi835Schema.index({ 'paymentInfo.checkNumber': 1, 'paymentInfo.effectiveDate': -1 });
edi835Schema.index({ 'claimPayments.claimId': 1, 'claimPayments.payerClaimNumber': 1 });
edi835Schema.index({ 'processingStatus.status': 1, 'processingStatus.stage': 1 });

// Compound indexes for complex queries
edi835Schema.index({
    companyRef: 1,
    payerRef: 1,
    'paymentInfo.effectiveDate': -1,
    'posting.isPosted': 1
});

edi835Schema.index({
    'claimPayments.claimRef': 1,
    'posting.isPosted': 1,
    'systemInfo.isActive': 1
});

// ** VIRTUAL FIELDS **
edi835Schema.virtual('totalClaimsCount').get(function () {
    return this.claimPayments ? this.claimPayments.length : 0;
});

edi835Schema.virtual('isCompletelyProcessed').get(function () {
    return this.processingStatus.status === 'Processed' &&
        this.posting.isPosted &&
        this.validation.isValid;
});

edi835Schema.virtual('hasErrors').get(function () {
    return this.validation.validationErrors && this.validation.validationErrors.length > 0;
});

edi835Schema.virtual('ageInDays').get(function () {
    const now = new Date();
    const received = new Date(this.fileInfo.receivedDate);
    return Math.floor((now - received) / (1000 * 60 * 60 * 24));
});

// ** INSTANCE METHODS **
edi835Schema.methods.calculateFinancialSummary = function () {
    let totalCharge = 0;
    let totalPayment = 0;
    let totalAdjustment = 0;
    let totalPatientResp = 0;

    this.claimPayments.forEach(claim => {
        totalCharge += claim.totalChargeAmount;
        totalPayment += claim.paymentAmount;
        totalPatientResp += claim.patientResponsibility;

        claim.serviceLines.forEach(service => {
            service.adjustments.forEach(adj => {
                totalAdjustment += adj.adjustmentAmount;
            });
        });
    });

    this.financialSummary = {
        totalChargeAmount: totalCharge,
        totalPaymentAmount: totalPayment,
        totalAdjustmentAmount: totalAdjustment,
        totalPatientResponsibility: totalPatientResp,
        netCollectionAmount: totalPayment,
        collectionRate: totalCharge > 0 ? Math.round((totalPayment / totalCharge) * 100) : 0
    };

    return this.save();
};

edi835Schema.methods.updateProcessingStatus = function (status, stage, progressPercentage, processedBy) {
    this.processingStatus.status = status;
    this.processingStatus.stage = stage;
    this.processingStatus.progressPercentage = progressPercentage;
    this.processingStatus.processedBy = processedBy;
    this.processingStatus.lastActivityAt = new Date();

    if (status === 'Processing' && !this.processingStatus.startedAt) {
        this.processingStatus.startedAt = new Date();
    }

    if (status === 'Processed' || status === 'Posted') {
        this.processingStatus.completedAt = new Date();
        if (this.processingStatus.startedAt) {
            this.processingStatus.processingDuration =
                this.processingStatus.completedAt - this.processingStatus.startedAt;
        }
    }

    return this.save();
};

edi835Schema.methods.matchClaims = async function () {
    const ClaimTasks = mongoose.model('ClaimTasks');
    let matched = 0;
    let unmatched = 0;
    const unmatchedReasons = [];

    for (const payment of this.claimPayments) {
        try {
            const claim = await ClaimTasks.findOne({
                claimTaskId: payment.claimId,
                companyRef: this.companyRef,
                'systemInfo.isActive': true
            });

            if (claim) {
                payment.claimRef = claim._id;
                payment.patientInfo.patientRef = claim.patientRef;
                matched++;
            } else {
                unmatched++;
                unmatchedReasons.push({
                    claimId: payment.claimId,
                    reason: 'Claim_Not_Found',
                    description: `No active claim found with ID ${payment.claimId}`
                });
            }
        } catch (error) {
            unmatched++;
            unmatchedReasons.push({
                claimId: payment.claimId,
                reason: 'System_Error',
                description: error.message
            });
        }
    }

    this.matching = {
        totalClaims: this.claimPayments.length,
        matchedClaims: matched,
        unmatchedClaims: unmatched,
        matchingPercentage: this.claimPayments.length > 0 ?
            Math.round((matched / this.claimPayments.length) * 100) : 0,
        unmatchedReasons,
        manualReviewRequired: unmatched > 0
    };

    return this.save();
};

edi835Schema.methods.postPayments = async function (postedBy) {
    if (!this.posting.isPosted && this.validation.isValid) {
        let postedAmount = 0;
        let postedClaims = 0;
        const postingErrors = [];

        try {
            for (const payment of this.claimPayments) {
                if (payment.claimRef) {
                    // Implementation would update claim payment status
                    postedAmount += payment.paymentAmount;
                    postedClaims++;
                }
            }

            this.posting = {
                isPosted: true,
                postingMethod: 'Automatic',
                postedAmount,
                postedClaims,
                postedBy,
                postedAt: new Date(),
                postingErrors,
                requiresReview: postingErrors.length > 0
            };

            await this.updateProcessingStatus('Posted', 'Completed', 100, postedBy);
        } catch (error) {
            this.posting.postingErrors.push({
                errorMessage: error.message,
                errorCode: 'POSTING_ERROR'
            });
        }
    }

    return this.save();
};

// ** STATIC METHODS **
edi835Schema.statics.findByDateRange = function (companyRef, startDate, endDate) {
    return this.find({
        companyRef,
        'paymentInfo.effectiveDate': {
            $gte: startDate,
            $lte: endDate
        },
        'systemInfo.isActive': true
    }).sort({ 'paymentInfo.effectiveDate': -1 });
};

edi835Schema.statics.findUnprocessed = function (companyRef) {
    return this.find({
        companyRef,
        'processingStatus.status': { $in: ['Received', 'Parsing', 'Validating'] },
        'systemInfo.isActive': true
    }).sort({ 'fileInfo.receivedDate': 1 });
};

edi835Schema.statics.findRequiringReview = function (companyRef) {
    return this.find({
        companyRef,
        $or: [
            { 'posting.requiresReview': true },
            { 'matching.manualReviewRequired': true },
            { 'validation.isValid': false }
        ],
        'systemInfo.isActive': true
    }).sort({ 'fileInfo.receivedDate': -1 });
};

edi835Schema.statics.generateReport = function (companyRef, dateRange) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyRef),
                'paymentInfo.effectiveDate': {
                    $gte: dateRange.start,
                    $lte: dateRange.end
                }
            }
        },
        {
            $group: {
                _id: '$payerRef',
                totalFiles: { $sum: 1 },
                totalPayments: { $sum: '$financialSummary.totalPaymentAmount' },
                totalClaims: { $sum: '$matching.totalClaims' },
                averageProcessingDays: { $avg: '$analytics.processingDays' }
            }
        }
    ]);
};

edi835Schema.plugin(scopedIdPlugin, {
    idField: 'edi835Id',
    prefix: 'EDI835',
    companyRefPath: 'companyRef'
});

// ** PRE-SAVE MIDDLEWARE **
edi835Schema.pre('save', function (next) {
    // Calculate financial summary if not already done
    if (this.isModified('claimPayments') && !this.financialSummary.totalPaymentAmount) {
        this.calculateFinancialSummary();
    }

    // Set retention date (7 years for HIPAA compliance)
    if (!this.systemInfo.retentionDate) {
        const retentionDate = new Date(this.fileInfo.receivedDate);
        retentionDate.setFullYear(retentionDate.getFullYear() + 7);
        this.systemInfo.retentionDate = retentionDate;
    }

    next();
});

export const EDI835 = mongoose.model('EDI835', edi835Schema, 'edi835');