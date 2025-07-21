// backend/src/models/edi/edi837.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { scopedIdPlugin } from './../../plugins/scopedIdPlugin';

const edi837Schema = new mongoose.Schema({
    // ** UNIQUE IDENTIFICATION **
    edi837Id: {
        type: String,
        unique: true,
        // default: () => `X12-${uuidv4().substring(0, 8).toUpperCase()}`,
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
    batchRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClaimBatch',
        index: true
    },

    // ** SUBMISSION INFORMATION **
    submissionInfo: {
        submissionType: {
            type: String,
            enum: ['Original', 'Replacement', 'Void', 'Corrected'],
            default: 'Original',
            index: true
        },
        claimType: {
            type: String,
            enum: ['Professional', 'Institutional', 'Dental'],
            required: [true, 'Claim type is required'],
            index: true
        },
        transactionType: {
            type: String,
            enum: ['837P', '837I', '837D'], // Professional, Institutional, Dental
            required: [true, 'Transaction type is required'],
            index: true
        },
        submissionMode: {
            type: String,
            enum: ['Batch', 'Real-time', 'Manual'],
            default: 'Batch',
            index: true
        },
        priority: {
            type: String,
            enum: ['Normal', 'High', 'Urgent', 'STAT'],
            default: 'Normal',
            index: true
        }
    },

    // ** FILE INFORMATION **
    fileInfo: {
        fileName: {
            type: String,
            required: [true, 'File name is required'],
            trim: true,
            index: true
        },
        generatedFileName: {
            type: String,
            trim: true // Auto-generated with timestamp and batch info
        },
        fileSize: {
            type: Number,
            min: [0, 'File size cannot be negative']
        },
        fileHash: {
            type: String,
            trim: true,
            index: true // For integrity verification
        },
        createdDate: {
            type: Date,
            default: Date.now,
            index: true
        },
        submittedDate: Date,
        fileUrl: {
            type: String,
            trim: true // Storage location
        },
        backupUrl: {
            type: String,
            trim: true // Backup storage location
        },
        compressionUsed: {
            type: Boolean,
            default: false
        },
        encryptionUsed: {
            type: Boolean,
            default: false
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
            default: 'HC', // Health Care Claim
            trim: true
        },
        versionNumber: {
            type: String,
            default: '005010X222A1', // Professional claims
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
        productionIndicator: {
            type: String,
            enum: ['P', 'T'], // P=Production, T=Test
            default: 'P'
        },
        usageIndicator: {
            type: String,
            enum: ['I', 'T'], // I=Information, T=Test
            default: 'I'
        }
    },

    // ** BILLING PROVIDER INFORMATION **
    billingProvider: {
        organizationName: {
            type: String,
            required: [true, 'Billing provider name is required'],
            trim: true
        },
        npi: {
            type: String,
            required: [true, 'Billing provider NPI is required'],
            trim: true,
            index: true
        },
        taxId: {
            type: String,
            required: [true, 'Tax ID is required'],
            trim: true
        },
        address: {
            addressLine1: {
                type: String,
                required: true,
                trim: true
            },
            addressLine2: {
                type: String,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            state: {
                type: String,
                required: true,
                trim: true
            },
            zipCode: {
                type: String,
                required: true,
                trim: true
            }
        },
        contactInfo: {
            phone: String,
            fax: String,
            email: String
        },
        taxonomy: {
            type: String,
            trim: true // Provider taxonomy code
        }
    },

    // ** CLAIMS INCLUDED **
    claims: [{
        claimRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClaimTasks',
            required: true,
            index: true
        },
        claimId: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        patientControlNumber: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        // ** CLAIM INFORMATION **
        claimInfo: {
            totalChargeAmount: {
                type: Number,
                required: true,
                min: [0, 'Charge amount cannot be negative']
            },
            placeOfService: {
                type: String,
                required: true,
                trim: true
            },
            claimFilingCode: {
                type: String,
                required: true,
                trim: true
            },
            frequencyCode: {
                type: String,
                enum: ['1', '7', '8'], // 1=Original, 7=Replacement, 8=Void
                default: '1'
            },
            delayReasonCode: String,
            assignmentOfBenefits: {
                type: String,
                enum: ['A', 'B', 'C'], // A=Assigned, B=Not Assigned, C=Not Applicable
                default: 'A'
            },
            releaseOfInformation: {
                type: String,
                enum: ['I', 'Y', 'M'], // I=Informed Consent, Y=Yes, M=Not Applicable
                default: 'Y'
            },
            patientSignatureOnFile: {
                type: String,
                enum: ['P', 'S', 'Y'], // P=Patient Signature on File, S=Signature on File, Y=Yes
                default: 'Y'
            }
        },

        // ** PATIENT INFORMATION **
        patient: {
            patientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient',
                required: true
            },
            memberId: {
                type: String,
                required: true,
                trim: true
            },
            name: {
                lastName: {
                    type: String,
                    required: true,
                    trim: true
                },
                firstName: {
                    type: String,
                    required: true,
                    trim: true
                },
                middleInitial: {
                    type: String,
                    trim: true
                },
                suffix: {
                    type: String,
                    trim: true
                }
            },
            dateOfBirth: {
                type: Date,
                required: true
            },
            gender: {
                type: String,
                enum: ['M', 'F'],
                required: true
            },
            address: {
                addressLine1: {
                    type: String,
                    required: true,
                    trim: true
                },
                addressLine2: {
                    type: String,
                    trim: true
                },
                city: {
                    type: String,
                    required: true,
                    trim: true
                },
                state: {
                    type: String,
                    required: true,
                    trim: true
                },
                zipCode: {
                    type: String,
                    required: true,
                    trim: true
                }
            },
            relationshipToSubscriber: {
                type: String,
                enum: ['18', '01', '19', '20', '21', '39', '53', 'G8'], // 18=Self, 01=Spouse, etc.
                default: '18'
            }
        },

        // ** INSURANCE INFORMATION **
        insurance: {
            primary: {
                payerRef: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Payer',
                    required: true
                },
                payerId: {
                    type: String,
                    required: true,
                    trim: true
                },
                payerName: {
                    type: String,
                    required: true,
                    trim: true
                },
                subscriberId: {
                    type: String,
                    required: true,
                    trim: true
                },
                groupNumber: {
                    type: String,
                    trim: true
                },
                planName: {
                    type: String,
                    trim: true
                },
                subscriber: {
                    name: {
                        lastName: String,
                        firstName: String,
                        middleInitial: String
                    },
                    dateOfBirth: Date,
                    gender: {
                        type: String,
                        enum: ['M', 'F']
                    },
                    address: {
                        addressLine1: String,
                        addressLine2: String,
                        city: String,
                        state: String,
                        zipCode: String
                    }
                },
                claimFilingIndicator: {
                    type: String,
                    required: true,
                    trim: true
                }
            },
            secondary: {
                payerRef: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Payer'
                },
                payerId: String,
                payerName: String,
                subscriberId: String,
                groupNumber: String,
                planName: String,
                claimFilingIndicator: String
            }
        },

        // ** SERVICE LINES **
        serviceLines: [{
            lineNumber: {
                type: Number,
                required: true,
                min: [1, 'Line number must be at least 1']
            },
            serviceDate: {
                type: Date,
                required: true
            },
            serviceEndDate: Date,
            placeOfService: {
                type: String,
                required: true,
                trim: true
            },
            procedureInfo: {
                procedureCode: {
                    type: String,
                    required: true,
                    trim: true
                },
                modifiers: [String],
                description: {
                    type: String,
                    trim: true
                }
            },
            chargeAmount: {
                type: Number,
                required: true,
                min: [0, 'Charge amount cannot be negative']
            },
            units: {
                type: Number,
                default: 1,
                min: [0, 'Units cannot be negative']
            },
            diagnosisPointers: [String], // Points to diagnosis codes
            emergencyIndicator: {
                type: String,
                enum: ['Y', 'N'],
                default: 'N'
            },
            cobIndicator: {
                type: String,
                enum: ['Y', 'N'],
                default: 'N'
            },
            renderingProvider: {
                npi: String,
                name: {
                    lastName: String,
                    firstName: String
                },
                taxonomy: String
            },
            referringProvider: {
                npi: String,
                name: {
                    lastName: String,
                    firstName: String
                }
            },
            facilityProvider: {
                npi: String,
                name: String,
                address: {
                    addressLine1: String,
                    city: String,
                    state: String,
                    zipCode: String
                }
            }
        }],

        // ** DIAGNOSIS CODES **
        diagnosisCodes: [{
            pointer: {
                type: String,
                required: true,
                trim: true
            },
            code: {
                type: String,
                required: true,
                trim: true
            },
            codeType: {
                type: String,
                enum: ['ABF', 'ABK'], // ABF=ICD-10, ABK=ICD-9
                default: 'ABF'
            },
            description: {
                type: String,
                trim: true
            },
            presentOnAdmission: {
                type: String,
                enum: ['Y', 'N', 'U', 'W'], // Y=Yes, N=No, U=Unknown, W=Not Applicable
                default: 'U'
            }
        }],

        // ** AUTHORIZATION INFORMATION **
        authorization: {
            authorizationNumber: String,
            effectiveDate: Date,
            expirationDate: Date,
            unitsAuthorized: Number,
            unitsUsed: Number
        },

        // ** CLAIM DATES **
        dates: [{
            qualifier: {
                type: String,
                enum: ['431', '454', '304', '453', '439'], // 431=Onset, 454=Initial Treatment, etc.
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }]
    }],

    // ** SUBMISSION STATUS **
    submissionStatus: {
        status: {
            type: String,
            enum: ['Draft', 'Ready', 'Validating', 'Valid', 'Generating', 'Generated', 'Queued', 'Transmitting', 'Transmitted', 'Acknowledged', 'Accepted', 'Rejected', 'Error'],
            default: 'Draft',
            index: true
        },
        stage: {
            type: String,
            enum: ['Preparation', 'Validation', 'Generation', 'Transmission', 'Acknowledgment', 'Processing', 'Completed'],
            default: 'Preparation',
            index: true
        },
        progressPercentage: {
            type: Number,
            default: 0,
            min: [0, 'Progress cannot be negative'],
            max: [100, 'Progress cannot exceed 100%']
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        submissionStarted: Date,
        submissionCompleted: Date,
        transmissionId: {
            type: String,
            trim: true,
            index: true
        },
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
        validationRules: [{
            ruleType: {
                type: String,
                enum: ['Syntax', 'Business', 'Payer_Specific', 'Clearinghouse', 'Compliance'],
                required: true
            },
            ruleName: String,
            status: {
                type: String,
                enum: ['Pass', 'Fail', 'Warning'],
                required: true
            },
            message: String,
            claimId: String,
            lineNumber: Number
        }],
        validationErrors: [{
            errorType: {
                type: String,
                enum: ['Critical', 'Error', 'Warning', 'Info'],
                required: true
            },
            errorCode: String,
            errorMessage: {
                type: String,
                required: true
            },
            claimId: String,
            segmentId: String,
            elementPosition: String,
            lineNumber: Number,
            fieldName: String
        }],
        preSubmissionCheck: {
            passed: {
                type: Boolean,
                default: false
            },
            checkedAt: Date,
            checkedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            checkResults: [{
                checkName: String,
                result: {
                    type: String,
                    enum: ['Pass', 'Fail', 'Warning']
                },
                details: String
            }]
        }
    },

    // ** TRANSMISSION DETAILS **
    transmission: {
        method: {
            type: String,
            enum: ['HTTPS', 'SFTP', 'FTP', 'AS2', 'Direct_Connect'],
            default: 'HTTPS'
        },
        endpoint: {
            type: String,
            trim: true
        },
        transmissionAttempts: [{
            attemptNumber: {
                type: Number,
                required: true,
                min: [1, 'Attempt number must be at least 1']
            },
            attemptedAt: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['Success', 'Failed', 'Timeout', 'Retry'],
                required: true
            },
            responseCode: String,
            responseMessage: String,
            transmissionId: String,
            duration: Number, // in milliseconds
            errorDetails: String
        }],
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
        lastAttemptAt: Date,
        successfulTransmission: {
            type: Boolean,
            default: false,
            index: true
        }
    },

    // ** ACKNOWLEDGMENTS **
    acknowledgments: [{
        ackType: {
            type: String,
            enum: ['TA1', '999', '997'], // TA1=Interchange Ack, 999=Implementation Ack, 997=Functional Ack
            required: true
        },
        receivedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Accepted', 'Accepted_With_Errors', 'Rejected'],
            required: true
        },
        controlNumber: String,
        errorCodes: [String],
        errorDescriptions: [String],
        rawContent: String, // Full acknowledgment content
        processedClaims: [{
            claimId: String,
            status: {
                type: String,
                enum: ['Accepted', 'Rejected', 'Pended']
            },
            errorCodes: [String]
        }]
    }],

    // ** STATISTICS & METRICS **
    statistics: {
        totalClaims: {
            type: Number,
            default: 0,
            min: [0, 'Total claims cannot be negative']
        },
        totalChargeAmount: {
            type: Number,
            default: 0,
            min: [0, 'Total charge amount cannot be negative']
        },
        averageClaimAmount: {
            type: Number,
            default: 0,
            min: [0, 'Average claim amount cannot be negative']
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
        acceptanceRate: {
            type: Number,
            default: 0,
            min: [0, 'Acceptance rate cannot be negative'],
            max: [100, 'Acceptance rate cannot exceed 100%']
        },
        processingTime: {
            preparation: Number, // minutes
            validation: Number,
            transmission: Number,
            acknowledgment: Number,
            total: Number
        },
        cleanClaimRate: {
            type: Number,
            default: 0,
            min: [0, 'Clean claim rate cannot be negative'],
            max: [100, 'Clean claim rate cannot exceed 100%']
        }
    },

    // ** COMPLIANCE & AUDIT **
    compliance: {
        hipaaCompliant: {
            type: Boolean,
            default: true
        },
        requiresAttestaton: {
            type: Boolean,
            default: false
        },
        attestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        attestedAt: Date,
        complianceNotes: String,
        auditTrail: [{
            action: {
                type: String,
                enum: ['Created', 'Modified', 'Validated', 'Submitted', 'Acknowledged', 'Reviewed'],
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
            ipAddress: String,
            userAgent: String
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
        retentionDate: Date, // When to delete (7 years for HIPAA)
        version: {
            type: String,
            default: '1.0'
        },
        environment: {
            type: String,
            enum: ['Development', 'Testing', 'Staging', 'Production'],
            default: 'Production',
            index: true
        },
        generatedBy: {
            type: String,
            enum: ['Manual', 'Batch_Job', 'API', 'Scheduled'],
            default: 'Manual'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
edi837Schema.index({ companyRef: 1, 'fileInfo.createdDate': -1 });
edi837Schema.index({ 'transactionHeader.isaControlNumber': 1, 'transactionHeader.gsControlNumber': 1 });
edi837Schema.index({ 'claims.claimRef': 1, 'submissionStatus.status': 1 });
edi837Schema.index({ 'submissionStatus.status': 1, 'submissionStatus.stage': 1 });
edi837Schema.index({ clearinghouseRef: 1, 'transmission.successfulTransmission': 1 });

// Compound indexes for complex queries
edi837Schema.index({
    companyRef: 1,
    'submissionInfo.claimType': 1,
    'submissionStatus.status': 1,
    'fileInfo.createdDate': -1
});

edi837Schema.index({
    'claims.claimRef': 1,
    'validation.isValid': 1,
    'systemInfo.isActive': 1
});

// ** VIRTUAL FIELDS **
edi837Schema.virtual('isReadyForSubmission').get(function () {
    return this.validation.isValid &&
        this.submissionStatus.status === 'Ready' &&
        this.claims.length > 0;
});

edi837Schema.virtual('hasErrors').get(function () {
    return this.validation.validationErrors &&
        this.validation.validationErrors.length > 0;
});

edi837Schema.virtual('isCompleted').get(function () {
    return this.submissionStatus.status === 'Acknowledged' &&
        this.transmission.successfulTransmission;
});

edi837Schema.virtual('ageInHours').get(function () {
    const now = new Date();
    const created = new Date(this.fileInfo.createdDate);
    return Math.floor((now - created) / (1000 * 60 * 60));
});

// ** INSTANCE METHODS **
edi837Schema.methods.calculateStatistics = function () {
    const totalClaims = this.claims.length;
    let totalChargeAmount = 0;
    let acceptedClaims = 0;
    let rejectedClaims = 0;

    this.claims.forEach(claim => {
        totalChargeAmount += claim.claimInfo.totalChargeAmount;
    });

    // Count accepted/rejected from acknowledgments
    this.acknowledgments.forEach(ack => {
        if (ack.processedClaims) {
            ack.processedClaims.forEach(claim => {
                if (claim.status === 'Accepted') acceptedClaims++;
                else if (claim.status === 'Rejected') rejectedClaims++;
            });
        }
    });

    this.statistics = {
        totalClaims,
        totalChargeAmount,
        averageClaimAmount: totalClaims > 0 ? Math.round(totalChargeAmount / totalClaims) : 0,
        acceptedClaims,
        rejectedClaims,
        acceptanceRate: totalClaims > 0 ? Math.round((acceptedClaims / totalClaims) * 100) : 0,
        cleanClaimRate: this.validation.isValid ? 100 : 0
    };

    return this.save();
};

edi837Schema.methods.updateSubmissionStatus = function (status, stage, progressPercentage, submittedBy) {
    this.submissionStatus.status = status;
    this.submissionStatus.stage = stage;
    this.submissionStatus.progressPercentage = progressPercentage;
    this.submissionStatus.submittedBy = submittedBy;
    this.submissionStatus.lastActivityAt = new Date();

    if (status === 'Transmitting' && !this.submissionStatus.submissionStarted) {
        this.submissionStatus.submissionStarted = new Date();
    }

    if (status === 'Transmitted' || status === 'Acknowledged') {
        this.submissionStatus.submissionCompleted = new Date();
    }

    // Add audit trail entry
    this.compliance.auditTrail.push({
        action: 'Modified',
        performedBy: submittedBy,
        details: `Status updated to ${status}, Stage: ${stage}`,
        timestamp: new Date()
    });

    return this.save();
};

edi837Schema.methods.validateClaims = function () {
    const errors = [];
    const warnings = [];

    this.claims.forEach((claim, index) => {
        // Validate required fields
        if (!claim.patient.memberId) {
            errors.push({
                errorType: 'Critical',
                errorCode: 'MISSING_MEMBER_ID',
                errorMessage: `Missing member ID for claim ${claim.claimId}`,
                claimId: claim.claimId,
                lineNumber: index + 1
            });
        }

        if (!claim.insurance.primary.payerId) {
            errors.push({
                errorType: 'Critical',
                errorCode: 'MISSING_PAYER_ID',
                errorMessage: `Missing primary payer ID for claim ${claim.claimId}`,
                claimId: claim.claimId,
                lineNumber: index + 1
            });
        }

        // Validate service lines
        claim.serviceLines.forEach((service, serviceIndex) => {
            if (!service.procedureInfo.procedureCode) {
                errors.push({
                    errorType: 'Critical',
                    errorCode: 'MISSING_PROCEDURE_CODE',
                    errorMessage: `Missing procedure code for service line ${serviceIndex + 1}`,
                    claimId: claim.claimId,
                    lineNumber: serviceIndex + 1
                });
            }

            if (service.chargeAmount <= 0) {
                errors.push({
                    errorType: 'Critical',
                    errorCode: 'INVALID_CHARGE_AMOUNT',
                    errorMessage: `Invalid charge amount for service line ${serviceIndex + 1}`,
                    claimId: claim.claimId,
                    lineNumber: serviceIndex + 1
                });
            }
        });

        // Validate diagnosis codes
        if (!claim.diagnosisCodes || claim.diagnosisCodes.length === 0) {
            warnings.push({
                errorType: 'Warning',
                errorCode: 'MISSING_DIAGNOSIS',
                errorMessage: `No diagnosis codes for claim ${claim.claimId}`,
                claimId: claim.claimId
            });
        }
    });

    this.validation.validationErrors = errors;
    this.validation.isValid = errors.length === 0;

    return this.save();
};

edi837Schema.methods.transmitToClearinghouse = async function (transmittedBy) {
    if (!this.validation.isValid) {
        throw new Error('Cannot transmit invalid file');
    }

    const attemptNumber = this.transmission.transmissionAttempts.length + 1;
    const startTime = new Date();

    try {
        // Implementation would handle actual transmission
        // For now, simulate transmission
        const transmissionId = `TXN-${Date.now()}`;

        this.transmission.transmissionAttempts.push({
            attemptNumber,
            attemptedAt: startTime,
            status: 'Success',
            responseCode: '200',
            responseMessage: 'Successfully transmitted',
            transmissionId,
            duration: 5000 // 5 seconds
        });

        this.transmission.successfulTransmission = true;
        this.transmission.lastAttemptAt = startTime;
        this.submissionStatus.transmissionId = transmissionId;

        await this.updateSubmissionStatus('Transmitted', 'Acknowledgment', 90, transmittedBy);

    } catch (error) {
        this.transmission.transmissionAttempts.push({
            attemptNumber,
            attemptedAt: startTime,
            status: 'Failed',
            responseCode: '500',
            responseMessage: error.message,
            errorDetails: error.stack
        });

        await this.updateSubmissionStatus('Error', 'Transmission', 50, transmittedBy);
        throw error;
    }

    return this.save();
};

edi837Schema.methods.processAcknowledgment = function (ackData) {
    this.acknowledgments.push({
        ackType: ackData.type,
        receivedAt: new Date(),
        status: ackData.status,
        controlNumber: ackData.controlNumber,
        errorCodes: ackData.errorCodes || [],
        errorDescriptions: ackData.errorDescriptions || [],
        rawContent: ackData.rawContent,
        processedClaims: ackData.processedClaims || []
    });

    // Update overall status based on acknowledgment
    if (ackData.status === 'Accepted') {
        this.submissionStatus.status = 'Acknowledged';
        this.submissionStatus.stage = 'Completed';
        this.submissionStatus.progressPercentage = 100;
    } else if (ackData.status === 'Rejected') {
        this.submissionStatus.status = 'Rejected';
        this.submissionStatus.stage = 'Completed';
        this.submissionStatus.progressPercentage = 100;
    }

    this.calculateStatistics();
    return this.save();
};

// ** STATIC METHODS **
edi837Schema.statics.findPendingTransmission = function (companyRef) {
    return this.find({
        companyRef,
        'submissionStatus.status': { $in: ['Ready', 'Queued'] },
        'validation.isValid': true,
        'systemInfo.isActive': true
    }).sort({ 'submissionInfo.priority': -1, 'fileInfo.createdDate': 1 });
};

edi837Schema.statics.findByDateRange = function (companyRef, startDate, endDate) {
    return this.find({
        companyRef,
        'fileInfo.createdDate': {
            $gte: startDate,
            $lte: endDate
        },
        'systemInfo.isActive': true
    }).sort({ 'fileInfo.createdDate': -1 });
};

edi837Schema.statics.findByClearinghouse = function (clearinghouseRef) {
    return this.find({
        clearinghouseRef,
        'systemInfo.isActive': true
    }).sort({ 'fileInfo.createdDate': -1 });
};

edi837Schema.statics.getSubmissionReport = function (companyRef, dateRange) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyRef),
                'fileInfo.createdDate': {
                    $gte: dateRange.start,
                    $lte: dateRange.end
                }
            }
        },
        {
            $group: {
                _id: '$clearinghouseRef',
                totalSubmissions: { $sum: 1 },
                totalClaims: { $sum: '$statistics.totalClaims' },
                totalCharges: { $sum: '$statistics.totalChargeAmount' },
                averageAcceptanceRate: { $avg: '$statistics.acceptanceRate' },
                successfulTransmissions: {
                    $sum: { $cond: ['$transmission.successfulTransmission', 1, 0] }
                }
            }
        }
    ]);
};

edi837Schema.plugin(scopedIdPlugin, {
    idField: 'edi837Id',
    prefix: 'EDI837',
    companyRefPath: 'companyRef'
})

// ** PRE-SAVE MIDDLEWARE **
edi837Schema.pre('save', function (next) {
    // Set retention date (7 years for HIPAA compliance)
    if (!this.systemInfo.retentionDate) {
        const retentionDate = new Date(this.fileInfo.createdDate);
        retentionDate.setFullYear(retentionDate.getFullYear() + 7);
        this.systemInfo.retentionDate = retentionDate;
    }

    // Generate file name if not provided
    if (!this.fileInfo.generatedFileName) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.fileInfo.generatedFileName = `${this.submissionInfo.transactionType}_${this.transactionHeader.gsControlNumber}_${timestamp}.x12`;
    }

    next();
});

export const EDI837 = mongoose.model('EDI837', edi837Schema, 'edi837');