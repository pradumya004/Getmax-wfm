// backend/src/models/edi/ediTransaction.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { scopedIdPlugin } from './../../plugins/scopedIdPlugin';

const ediTransactionSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFICATION **
    transactionId: {
        type: String,
        unique: true,
        // default: () => `TXN-${uuidv4().substring(0, 8).toUpperCase()}`,
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
    claimRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClaimTasks',
        index: true // Optional - some transactions not claim-specific
    },
    patientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient reference is required'],
        index: true
    },
    payerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payer',
        required: [true, 'Payer reference is required'],
        index: true
    },

    // ** TRANSACTION TYPE INFORMATION **
    transactionInfo: {
        transactionType: {
            type: String,
            enum: ['270', '271', '276', '277', '278'], // 270=Eligibility Inquiry, 271=Response, 276=Status Inquiry, 277=Response, 278=Authorization
            required: [true, 'Transaction type is required'],
            index: true
        },
        transactionSetId: {
            type: String,
            required: [true, 'Transaction set ID is required'],
            trim: true
        },
        purposeCode: {
            type: String,
            enum: ['1', '11', '13', '17', '18', '30'], // 1=Certification, 11=Inquiry, 13=Request, etc.
            required: [true, 'Purpose code is required']
        },
        direction: {
            type: String,
            enum: ['Outbound', 'Inbound'], // Outbound=Request, Inbound=Response
            required: [true, 'Transaction direction is required'],
            index: true
        },
        priority: {
            type: String,
            enum: ['Normal', 'High', 'Urgent', 'STAT'],
            default: 'Normal',
            index: true
        },
        isRealTime: {
            type: Boolean,
            default: true,
            index: true
        }
    },

    // ** EDI HEADER INFORMATION **
    ediHeader: {
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
        stControlNumber: {
            type: String,
            required: [true, 'ST control number is required'],
            trim: true,
            index: true
        },
        functionalGroupCode: {
            type: String,
            default: 'HS', // Health Care Services Review
            trim: true
        },
        versionNumber: {
            type: String,
            default: '005010X279A1', // Default for 270/271
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
            default: Date.now
        },
        creationTime: {
            type: String,
            trim: true
        }
    },

    // ** REQUEST INFORMATION (270/276/278) **
    requestInfo: {
        requestId: {
            type: String,
            trim: true,
            index: true
        },
        requestDate: {
            type: Date,
            default: Date.now
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },

        // ** PROVIDER INFORMATION **
        provider: {
            npi: {
                type: String,
                required: true,
                trim: true
            },
            name: {
                organizationName: String,
                lastName: String,
                firstName: String,
                middleInitial: String
            },
            taxonomyCode: String,
            address: {
                addressLine1: String,
                addressLine2: String,
                city: String,
                state: String,
                zipCode: String
            },
            contactInfo: {
                phone: String,
                fax: String,
                email: String
            }
        },

        // ** SUBSCRIBER/PATIENT INFORMATION **
        subscriber: {
            memberId: {
                type: String,
                required: true,
                trim: true,
                index: true
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
                middleInitial: String,
                suffix: String
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
            relationshipCode: {
                type: String,
                enum: ['18', '01', '19', '20', '21'], // 18=Self, 01=Spouse, etc.
                default: '18'
            },
            address: {
                addressLine1: String,
                addressLine2: String,
                city: String,
                state: String,
                zipCode: String
            }
        },

        // ** DEPENDENT INFORMATION (if different from subscriber) **
        dependent: {
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
            relationshipCode: String
        },

        // ** SERVICE TYPE CODES (270/271 specific) **
        serviceTypeCodes: [{
            type: String,
            enum: [
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                '21', '22', '23', '24', '25', '26', '27', '28', '30', '33',
                '35', '36', '37', '38', '39', '40', '41', '42', '43', '44',
                '45', '46', '47', '48', '49', '50', '51', '52', '53', '54',
                '55', '56', '57', '58', '59', '60', '61', '62', '63', '64',
                '65', '66', '67', '68', '69', '70', '71', '72', '73', '74',
                '75', '76', '77', '78', '79', '80', '81', '82', '83', '84',
                '85', '86', '87', '88', '89', '90', '91', '92', '93', '94',
                '95', '96', '97', '98', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5',
                'A6', 'A7', 'A8', 'A9', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF',
                'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AQ',
                'AR', 'B1', 'B2', 'B3', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF',
                'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BP', 'BQ',
                'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ', 'C1'
            ]
        }],

        // ** SERVICE INFORMATION (276/277 specific) **
        serviceInquiry: {
            claimSubmissionDate: Date,
            claimAmount: Number,
            procedureCodes: [String],
            serviceDate: Date,
            serviceEndDate: Date,
            placeOfService: String,
            statusRequestCode: {
                type: String,
                enum: ['1', '2', '3', '4', '5'], // 1=All, 2=Payer, 3=Claims, etc.
                default: '1'
            }
        },

        // ** AUTHORIZATION REQUEST (278 specific) **
        authorizationRequest: {
            requestCategory: {
                type: String,
                enum: ['AR', 'HS', 'SC'], // AR=Admission Review, HS=Health Services, SC=Specialty Care
                required: true
            },
            certificationAction: {
                type: String,
                enum: ['1', '2', '3', '4', '5', '6'], // 1=Request, 2=Cancel, 3=Suspend, etc.
                required: true
            },
            serviceTypeCodes: [String],
            diagnosisCodes: [String],
            procedureCodes: [String],
            requestedServices: [{
                procedureCode: String,
                modifiers: [String],
                quantity: Number,
                unitType: String,
                fromDate: Date,
                toDate: Date,
                description: String
            }],
            admissionInfo: {
                admissionDate: Date,
                dischargeDate: Date,
                admissionType: {
                    type: String,
                    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] // 1=Emergency, 2=Urgent, etc.
                },
                admissionSource: String,
                patientStatus: String
            }
        }
    },

    // ** RESPONSE INFORMATION (271/277/278) **
    responseInfo: {
        responseId: {
            type: String,
            trim: true,
            index: true
        },
        responseDate: {
            type: Date,
            index: true
        },
        traceNumber: {
            type: String,
            trim: true,
            index: true
        },

        // ** ELIGIBILITY RESPONSE (271 specific) **
        eligibilityResponse: {
            eligibilityStatus: {
                type: String,
                enum: ['1', '6', '7', '8', 'V', 'W', 'X', 'Y'], // 1=Active, 6=Inactive, etc.
                index: true
            },
            planStatus: String,
            planEffectiveDate: Date,
            planExpirationDate: Date,
            groupNumber: String,
            groupName: String,
            insuranceType: {
                type: String,
                enum: ['12', '13', '14', '15', '16', '17', '47', '53', 'HM', 'MB', 'MC', 'OF'] // 12=PPO, 13=POS, etc.
            },

            // ** BENEFITS INFORMATION **
            benefits: [{
                serviceTypeCode: String,
                coverageLevel: {
                    type: String,
                    enum: ['CHD', 'DEP', 'ECH', 'EMP', 'ESP', 'FAM', 'IND', 'SPC'] // CHD=Children Only, FAM=Family, etc.
                },
                timePeriod: {
                    type: String,
                    enum: ['1', '2', '3', '4', '5', '6', '7', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'] // 1=Day, 23=Year, etc.
                },
                monetaryAmounts: [{
                    amountQualifier: {
                        type: String,
                        enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] // A=Deductible, B=Benefit Amount, etc.
                    },
                    amount: Number,
                    creditDebitFlag: {
                        type: String,
                        enum: ['C', 'D'] // C=Credit, D=Debit
                    }
                }],
                percentageAmounts: [{
                    percentageQualifier: {
                        type: String,
                        enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                    },
                    percentage: Number
                }],
                quantityAmounts: [{
                    quantityQualifier: {
                        type: String,
                        enum: ['DY', 'FL', 'HS', 'MN', 'P6', 'S7', 'S8', 'VS', 'YY', 'ZZ'] // DY=Days, VS=Visits, etc.
                    },
                    quantity: Number
                }],
                insuranceTypeCode: String,
                planCoverage: String,
                benefitDescription: String,
                inPlanNetworkIndicator: {
                    type: String,
                    enum: ['Y', 'N', 'U', 'W'] // Y=Yes, N=No, U=Unknown, W=Not Applicable
                },
                authorizationRequired: {
                    type: String,
                    enum: ['Y', 'N', 'U'] // Y=Yes, N=No, U=Unknown
                },
                authorizationRequiredIndicator: String
            }],

            // ** ADDITIONAL INFORMATION **
            additionalInformation: [{
                informationType: String,
                informationValue: String,
                description: String
            }],

            // ** ERROR INFORMATION **
            errors: [{
                errorCode: String,
                errorDescription: String,
                followUpActionCode: String
            }]
        },

        // ** CLAIM STATUS RESPONSE (277 specific) **
        claimStatusResponse: {
            claimStatusCodes: [{
                entityCode: {
                    type: String,
                    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9']
                },
                statusCode: String,
                statusDate: Date,
                totalClaimChargeAmount: Number,
                totalClaimPaymentAmount: Number,
                claimPaymentDate: Date,
                remainingPatientLiability: Number
            }],
            serviceLineInformation: [{
                serviceLineNumber: Number,
                procedureCode: String,
                modifiers: [String],
                serviceDate: Date,
                chargeAmount: Number,
                paymentAmount: Number,
                adjustmentAmount: Number,
                statusCodes: [String],
                statusDates: [Date]
            }]
        },

        // ** AUTHORIZATION RESPONSE (278 specific) **
        authorizationResponse: {
            responseCode: {
                type: String,
                enum: ['A1', 'A2', 'A3', 'A4', 'A6', 'CT', 'M1', 'M2', 'M3', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'], // A1=Certified/Approved, M1=Modified, etc.
                required: true
            },
            authorizationNumber: {
                type: String,
                trim: true,
                index: true
            },
            effectiveDate: Date,
            expirationDate: Date,
            certificationIssueDate: Date,

            // ** AUTHORIZED SERVICES **
            authorizedServices: [{
                procedureCode: String,
                modifiers: [String],
                description: String,
                authorizedQuantity: Number,
                unitType: String,
                authorizedAmount: Number,
                fromDate: Date,
                toDate: Date,
                revenueCode: String
            }],

            // ** CERTIFICATION INFORMATION **
            certificationInfo: {
                certificationAction: String,
                certificationNumber: String,
                certificationIssueDate: Date,
                certificationExpirationDate: Date,
                certificationEffectiveDate: Date
            },

            // ** DENIAL/MODIFICATION INFORMATION **
            denialInformation: [{
                reasonCode: String,
                reasonDescription: String,
                followUpActionCode: String,
                secondOpinionRequired: {
                    type: Boolean,
                    default: false
                }
            }],

            // ** CONTACT INFORMATION **
            contactInformation: {
                contactName: String,
                phone: String,
                fax: String,
                email: String,
                contactTypeCode: String
            }
        }
    },

    // ** TRANSMISSION STATUS **
    transmissionStatus: {
        status: {
            type: String,
            enum: ['Draft', 'Ready', 'Queued', 'Transmitting', 'Transmitted', 'Acknowledged', 'Processed', 'Response_Received', 'Completed', 'Failed', 'Timeout', 'Cancelled'],
            default: 'Draft',
            index: true
        },
        stage: {
            type: String,
            enum: ['Preparation', 'Validation', 'Transmission', 'Processing', 'Response', 'Completed'],
            default: 'Preparation',
            index: true
        },
        progressPercentage: {
            type: Number,
            default: 0,
            min: [0, 'Progress cannot be negative'],
            max: [100, 'Progress cannot exceed 100%']
        },
        transmittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        transmissionDate: Date,
        responseReceivedDate: Date,
        processingDuration: Number, // milliseconds
        lastActivityAt: {
            type: Date,
            default: Date.now
        }
    },

    // ** TECHNICAL DETAILS **
    technicalInfo: {
        transmissionMethod: {
            type: String,
            enum: ['Real-time', 'Batch', 'HTTPS', 'SFTP', 'AS2'],
            default: 'Real-time'
        },
        endpoint: String,
        requestPayload: String, // Raw EDI content
        responsePayload: String, // Raw EDI response
        httpStatusCode: Number,
        transmissionId: {
            type: String,
            trim: true,
            index: true
        },
        correlationId: {
            type: String,
            trim: true,
            index: true
        },
        retryCount: {
            type: Number,
            default: 0,
            min: [0, 'Retry count cannot be negative']
        },
        maxRetries: {
            type: Number,
            default: 3,
            min: [1, 'Max retries must be at least 1']
        },
        timeout: {
            type: Number,
            default: 30000, // 30 seconds in milliseconds
            min: [5000, 'Timeout must be at least 5 seconds']
        }
    },

    // ** ERROR HANDLING **
    errors: [{
        errorType: {
            type: String,
            enum: ['Validation', 'Transmission', 'Processing', 'Business_Rule', 'Technical', 'Timeout'],
            required: true
        },
        errorCode: String,
        errorMessage: {
            type: String,
            required: true
        },
        errorDetails: String,
        segmentId: String,
        elementPosition: String,
        severity: {
            type: String,
            enum: ['Info', 'Warning', 'Error', 'Critical'],
            default: 'Error'
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        resolved: {
            type: Boolean,
            default: false
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        resolvedAt: Date,
        resolutionNotes: String
    }],

    // ** BUSINESS METRICS **
    businessMetrics: {
        responseTime: Number, // milliseconds
        turnaroundTime: Number, // hours from request to response
        successRate: Number, // percentage
        isSuccessful: {
            type: Boolean,
            index: true
        },
        requiresFollowUp: {
            type: Boolean,
            default: false,
            index: true
        },
        followUpDate: Date,
        followUpReason: String,
        businessValue: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium'
        },
        impactLevel: {
            type: String,
            enum: ['Critical', 'High', 'Medium', 'Low'],
            default: 'Medium'
        }
    },

    // ** AUDIT INFORMATION **
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        auditTrail: [{
            action: {
                type: String,
                enum: ['Created', 'Transmitted', 'Response_Received', 'Processed', 'Reviewed', 'Modified', 'Cancelled'],
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
        sourceSystem: {
            type: String,
            enum: ['Manual', 'Automated', 'Batch', 'API', 'Scheduled'],
            default: 'Manual'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
ediTransactionSchema.index({ companyRef: 1, 'transactionInfo.transactionType': 1, createdAt: -1 });
ediTransactionSchema.index({ 'requestInfo.subscriber.memberId': 1, payerRef: 1 });
ediTransactionSchema.index({ 'ediHeader.isaControlNumber': 1, 'ediHeader.gsControlNumber': 1 });
ediTransactionSchema.index({ 'transmissionStatus.status': 1, 'transmissionStatus.stage': 1 });
ediTransactionSchema.index({ claimRef: 1, 'transactionInfo.transactionType': 1 });

// Compound indexes for complex queries
ediTransactionSchema.index({
    companyRef: 1,
    'transactionInfo.transactionType': 1,
    'transmissionStatus.status': 1,
    'transmissionStatus.transmissionDate': -1
});

ediTransactionSchema.index({
    patientRef: 1,
    payerRef: 1,
    'transactionInfo.transactionType': 1,
    createdAt: -1
});

// ** VIRTUAL FIELDS **
ediTransactionSchema.virtual('isCompleted').get(function () {
    return this.transmissionStatus.status === 'Completed' &&
        this.businessMetrics.isSuccessful;
});

ediTransactionSchema.virtual('hasErrors').get(function () {
    return this.errors && this.errors.length > 0;
});

ediTransactionSchema.virtual('ageInHours').get(function () {
    const now = new Date();
    const created = new Date(this.createdAt);
    return Math.floor((now - created) / (1000 * 60 * 60));
});

ediTransactionSchema.virtual('isEligibilityTransaction').get(function () {
    return ['270', '271'].includes(this.transactionInfo.transactionType);
});

ediTransactionSchema.virtual('isClaimStatusTransaction').get(function () {
    return ['276', '277'].includes(this.transactionInfo.transactionType);
});

ediTransactionSchema.virtual('isAuthorizationTransaction').get(function () {
    return this.transactionInfo.transactionType === '278';
});

// ** INSTANCE METHODS **
ediTransactionSchema.methods.updateTransmissionStatus = function (status, stage, progressPercentage, transmittedBy) {
    this.transmissionStatus.status = status;
    this.transmissionStatus.stage = stage;
    this.transmissionStatus.progressPercentage = progressPercentage;
    this.transmissionStatus.transmittedBy = transmittedBy;
    this.transmissionStatus.lastActivityAt = new Date();

    if (status === 'Transmitted' && !this.transmissionStatus.transmissionDate) {
        this.transmissionStatus.transmissionDate = new Date();
    }

    if (status === 'Response_Received' && !this.transmissionStatus.responseReceivedDate) {
        this.transmissionStatus.responseReceivedDate = new Date();
        if (this.transmissionStatus.transmissionDate) {
            this.transmissionStatus.processingDuration =
                this.transmissionStatus.responseReceivedDate - this.transmissionStatus.transmissionDate;
        }
    }

    // Add audit trail entry
    this.auditInfo.auditTrail.push({
        action: status === 'Transmitted' ? 'Transmitted' : 'Modified',
        performedBy: transmittedBy,
        details: `Status updated to ${status}, Stage: ${stage}`,
        timestamp: new Date()
    });

    return this.save();
};

ediTransactionSchema.methods.processResponse = function (responseData) {
    this.responseInfo.responseDate = new Date();
    this.responseInfo.responseId = responseData.responseId;
    this.responseInfo.traceNumber = responseData.traceNumber;

    // Process based on transaction type
    if (this.transactionInfo.transactionType === '271') {
        this.responseInfo.eligibilityResponse = responseData.eligibilityResponse;
        this.businessMetrics.isSuccessful = responseData.eligibilityResponse.eligibilityStatus === '1';
    } else if (this.transactionInfo.transactionType === '277') {
        this.responseInfo.claimStatusResponse = responseData.claimStatusResponse;
        this.businessMetrics.isSuccessful = responseData.claimStatusResponse.claimStatusCodes.length > 0;
    } else if (this.transactionInfo.transactionType === '278') {
        this.responseInfo.authorizationResponse = responseData.authorizationResponse;
        this.businessMetrics.isSuccessful = responseData.authorizationResponse.responseCode.startsWith('A');
    }

    // Calculate metrics
    if (this.transmissionStatus.transmissionDate) {
        this.businessMetrics.responseTime = new Date() - this.transmissionStatus.transmissionDate;
        this.businessMetrics.turnaroundTime = this.businessMetrics.responseTime / (1000 * 60 * 60); // Convert to hours
    }

    this.transmissionStatus.status = 'Response_Received';
    this.transmissionStatus.stage = 'Response';
    this.transmissionStatus.progressPercentage = 90;

    return this.save();
};

ediTransactionSchema.methods.addError = function (errorType, errorCode, errorMessage, details) {
    this.errors.push({
        errorType,
        errorCode,
        errorMessage,
        errorDetails: details,
        timestamp: new Date()
    });

    // Update status if this is a critical error
    if (errorType === 'Critical' || errorType === 'Technical') {
        this.transmissionStatus.status = 'Failed';
        this.businessMetrics.isSuccessful = false;
    }

    return this.save();
};

ediTransactionSchema.methods.retry = async function (retryBy) {
    if (this.technicalInfo.retryCount >= this.technicalInfo.maxRetries) {
        throw new Error('Maximum retry attempts exceeded');
    }

    this.technicalInfo.retryCount++;
    this.transmissionStatus.status = 'Queued';
    this.transmissionStatus.stage = 'Transmission';
    this.transmissionStatus.progressPercentage = 25;

    this.auditInfo.auditTrail.push({
        action: 'Modified',
        performedBy: retryBy,
        details: `Retry attempt ${this.technicalInfo.retryCount}`,
        timestamp: new Date()
    });

    return this.save();
};

ediTransactionSchema.methods.cancel = function (cancelledBy, reason) {
    this.transmissionStatus.status = 'Cancelled';
    this.transmissionStatus.stage = 'Completed';
    this.transmissionStatus.progressPercentage = 100;
    this.businessMetrics.isSuccessful = false;

    this.auditInfo.auditTrail.push({
        action: 'Cancelled',
        performedBy: cancelledBy,
        details: reason,
        timestamp: new Date()
    });

    return this.save();
};

// ** STATIC METHODS **
ediTransactionSchema.statics.findPendingTransmission = function (companyRef) {
    return this.find({
        companyRef,
        'transmissionStatus.status': { $in: ['Ready', 'Queued'] },
        'systemInfo.isActive': true
    }).sort({ 'transactionInfo.priority': -1, createdAt: 1 });
};

ediTransactionSchema.statics.findByPatientAndPayer = function (patientRef, payerRef, transactionType) {
    return this.find({
        patientRef,
        payerRef,
        'transactionInfo.transactionType': transactionType,
        'systemInfo.isActive': true
    }).sort({ createdAt: -1 }).limit(10);
};

ediTransactionSchema.statics.findEligibilityHistory = function (patientRef, payerRef) {
    return this.find({
        patientRef,
        payerRef,
        'transactionInfo.transactionType': { $in: ['270', '271'] },
        'systemInfo.isActive': true
    }).sort({ createdAt: -1 }).limit(20);
};

ediTransactionSchema.statics.findFailedTransactions = function (companyRef, hours = 24) {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    return this.find({
        companyRef,
        'transmissionStatus.status': 'Failed',
        createdAt: { $gte: since },
        'systemInfo.isActive': true
    }).sort({ createdAt: -1 });
};

ediTransactionSchema.statics.getPerformanceReport = function (companyRef, dateRange) {
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
                _id: '$transactionInfo.transactionType',
                totalTransactions: { $sum: 1 },
                successfulTransactions: {
                    $sum: { $cond: ['$businessMetrics.isSuccessful', 1, 0] }
                },
                averageResponseTime: { $avg: '$businessMetrics.responseTime' },
                averageTurnaroundTime: { $avg: '$businessMetrics.turnaroundTime' }
            }
        },
        {
            $addFields: {
                successRate: {
                    $multiply: [
                        { $divide: ['$successfulTransactions', '$totalTransactions'] },
                        100
                    ]
                }
            }
        }
    ]);
};

ediTransactionSchema.plugin(scopedIdPlugin, {
    idField: 'transactionId',
    prefix: 'EDI-TXN',
    companyRefPath: 'companyRef'
})

// ** PRE-SAVE MIDDLEWARE **
ediTransactionSchema.pre('save', function (next) {
    // Set retention date (7 years for HIPAA compliance)
    if (!this.systemInfo.retentionDate) {
        const retentionDate = new Date();
        retentionDate.setFullYear(retentionDate.getFullYear() + 7);
        this.systemInfo.retentionDate = retentionDate;
    }

    // Generate transaction ID if not provided
    if (!this.responseInfo.responseId && this.transactionInfo.direction === 'Inbound') {
        this.responseInfo.responseId = `RSP-${Date.now()}`;
    }

    // Calculate success rate for metrics
    if (this.transmissionStatus.status === 'Completed') {
        this.businessMetrics.successRate = this.businessMetrics.isSuccessful ? 100 : 0;
    }

    next();
});

export const EDITransaction = mongoose.model('EDITransaction', ediTransactionSchema, 'ediTransactions');