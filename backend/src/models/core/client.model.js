// backend/src/models/core/client.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { CLIENT_TYPES, SPECIALTY_TYPES, SERVICE_TYPES, CURRENCIES, BILLING_MODELS, TIME_ZONES } from '../../constants.js';

// NEW RCM Workflows Schema (ADDED)
const rcmWorkflowsSchema = new mongoose.Schema({
    workflowName: { type: String, required: true, trim: true },
    serviceType: { type: String, enum: Object.values(SERVICE_TYPES), required: true },
    workflowStages: [{
        stageName: { type: String, required: true, trim: true },
        stageOrder: { type: Number, required: true, min: 1 },
        isRequired: { type: Boolean, default: true },
        slaHours: { type: Number, required: true, min: 1 },
        description: { type: String, trim: true },
        assignmentRules: {
            autoAssign: { type: Boolean, default: false },
            requiredSkills: [String],
            requiredRoleLevel: { type: Number, min: 1, max: 10 },
            roundRobinGroup: String,
            skillCategory: String
        },
        qaRules: {
            qaRequired: { type: Boolean, default: false },
            qaPercentage: { type: Number, min: 0, max: 100, default: 10 },
            qaSkipConditions: [String]
        },
        escalationRules: {
            escalateAfterHours: Number, escalateTo: String, escalationCriteria: [String]
        },
        completionCriteria: {
            requiresApproval: { type: Boolean, default: false },
            approvalRole: String,
            requiredFields: [String],
            validationRules: [String]
        }
    }],
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    effectiveDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    version: { type: String, default: '1.0' },
    workflowMetrics: {
        averageCompletionTime: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 },
        totalExecutions: { type: Number, default: 0 },
        lastExecuted: Date
    }
}, { _id: false });

// Clearinghouse Configuration Schema
const clearinghouseConfigSchema = new mongoose.Schema({
    clearinghouseName: {
        type: String,
        enum: ['Availity', 'Change Healthcare', 'RelayHealth', 'Trizetto', 'Office Ally', 'Navicure', 'athenaCollector', 'NextGen', 'AllMeds', 'ClaimMD'],
        required: true
    },
    isActive: { type: Boolean, default: true },
    isPrimary: { type: Boolean, default: false },
    submitterId: { type: String, trim: true },
    receiverId: { type: String, trim: true },
    tradingPartnerId: { type: String, trim: true },
    connectionSettings: {
        connectionType: {
            type: String,
            enum: ['API', 'SFTP', 'Web Portal', 'Direct'],
            default: 'API'
        },
        endpoint: String,
        port: Number,
        username: String,
        password: String, // This should be encrypted
        apiKey: String,
        testMode: { type: Boolean, default: true }
    },
    supportedTransactions: [{
        transactionType: {
            type: String,
            enum: ['270/271', '276/277', '837P', '837I', '835', '278', '999', '997'],
            required: true
        },
        isEnabled: { type: Boolean, default: true },
        customMapping: String
    }],
    submissionSettings: {
        batchSize: {
            type: Number,
            default: 100,
            min: 1,
            max: 1000
        },
        submissionFrequency: {
            type: String,
            enum: ['Real-time', 'Hourly', 'Daily', 'Weekly'],
            default: 'Real-time'
        },
        submissionTimes: [String], // Array of times like "09:00", "15:00"
        acknowledgmentTimeout: {
            type: Number,
            default: 60 // minutes
        },
        retryAttempts: {
            type: Number,
            default: 3,
            min: 1,
            max: 10
        },
        retryDelayMinutes: {
            type: Number,
            default: 15
        }
    },
    mapping: {
        fieldMappings: [{
            sourceField: String,
            targetField: String,
            transformation: String,
            isRequired: Boolean
        }],
        customRules: [String]
    },
    performance: {
        averageResponseTime: Number, // in milliseconds
        successRate: Number, // percentage
        lastSuccessfulSubmission: Date,
        totalSubmissions: { type: Number, default: 0 },
        failedSubmissions: { type: Number, default: 0 }
    }
}, { _id: false });

// NEW QA Requirements Schema (ADDED)
const qaRequirementsSchema = new mongoose.Schema({
    // General QA Settings
    defaultQaPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 10
    },
    qualityThresholds: {
        excellent: { type: Number, min: 90, max: 100, default: 95 },
        good: { type: Number, min: 80, max: 94, default: 90 },
        satisfactory: { type: Number, min: 70, max: 89, default: 85 },
        needsImprovement: { type: Number, min: 0, max: 79, default: 80 }
    },

    // Service-Specific QA Requirements
    serviceQaRequirements: [{
        serviceType: {
            type: String,
            enum: Object.values(SERVICE_TYPES),
            required: true
        },
        qaPercentage: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },
        scoringCriteria: [{
            criteriaName: {
                type: String,
                required: true,
                trim: true
            },
            weight: {
                type: Number,
                min: 0,
                max: 100,
                required: true
            },
            description: String,
            isRequired: {
                type: Boolean,
                default: true
            }
        }],
        escalationRules: {
            failureThreshold: { type: Number, min: 1, max: 5, default: 3 },
            escalationSteps: [{
                stepOrder: Number,
                action: { type: String, enum: ['Email Manager', 'Training Required', 'Immediate Review', 'Account Review'] },
                triggerCondition: String
            }]
        },
        turnaroundTime: {
            type: Number,
            default: 24 // hours
        }
    }],

    // QA Team Settings
    qaTeamSettings: {
        dedicatedQaTeam: {
            type: Boolean,
            default: false
        },
        qaManagerRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        qaAnalysts: [{
            analystRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            serviceTypes: [String],
            workload: Number, // percentage allocation
            isLead: { type: Boolean, default: false }
        }],
        calibrationFrequency: {
            type: String,
            enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
            default: 'Monthly'
        }
    },

    // Reporting Requirements
    reportingRequirements: {
        frequencyRequired: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly'],
            default: 'Weekly'
        },
        metricsRequired: [String],
        deliveryFormat: {
            type: String,
            enum: ['Email', 'Dashboard', 'PDF Report', 'Excel'],
            default: 'Dashboard'
        },
        recipients: [{
            name: String,
            email: String,
            role: String
        }],
        customRequirements: [String]
    },

    // Compliance Requirements
    complianceRequirements: {
        regulatoryStandards: [String],
        auditFrequency: {
            type: String,
            enum: ['Monthly', 'Quarterly', 'Semi-annually', 'Annually']
        },
        documentationRequired: {
            type: Boolean,
            default: true
        },
        retentionPeriod: {
            type: Number,
            default: 7 // years
        }
    }
}, { _id: false });

// Main Client Schema (PRESERVING ALL EXISTING FIELDS)
const clientSchema = new mongoose.Schema({
    // EXISTING CLIENT ID (PRESERVED EXACTLY)
    clientId: {
        type: String,
        unique: true,
        default: () => `CLT-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // EXISTING MAIN RELATIONSHIPS (PRESERVED EXACTLY)
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // GetMax company managing this client
        required: [true, 'Company reference is required'],
        index: true
    },

    // EXISTING CLIENT BASIC INFORMATION (PRESERVED EXACTLY)
    clientInfo: {
        clientName: {
            type: String,
            required: [true, 'Client name is required'],
            trim: true,
            maxlength: [100, 'Client name cannot exceed 100 characters']
        },
        legalName: {
            type: String,
            trim: true,
            maxlength: [150, 'Legal name cannot exceed 150 characters']
        },
        clientType: {
            type: String,
            required: [true, 'Client type is required'],
            index: true
        },
        clientSubType: {
            type: String,
            trim: true,
            maxlength: [50, 'Client sub-type cannot exceed 50 characters']
        },
        taxId: {
            type: String,
            trim: true,
        },
        npiNumber: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        }
    },

    // EXISTING CONTACT INFORMATION (PRESERVED EXACTLY)
    contactInfo: {
        primaryContact: {
            name: {
                type: String,
                required: [true, 'Primary contact name is required'],
                trim: true
            },
            email: {
                type: String,
                required: [true, 'Primary contact email is required'],
                trim: true,
                lowercase: true,
                validate: {
                    validator: function (v) {
                        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                    },
                    message: 'Invalid email format'
                }
            },
            phone: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
                    },
                    message: 'Invalid phone number format'
                }
            }
        },
        billingContact: {
            name: String,
            email: {
                type: String,
                trim: true,
                lowercase: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                    },
                    message: 'Invalid email format'
                }
            },
            phone: String
        },
        technicalContact: {
            name: String,
            email: {
                type: String,
                trim: true,
                lowercase: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                    },
                    message: 'Invalid email format'
                }
            },
            phone: String
        }
    },

    // EXISTING ADDRESS INFORMATION (PRESERVED EXACTLY)
    addressInfo: {
        businessAddress: {
            street: {
                type: String,
                trim: true,
                maxlength: [200, 'Street address cannot exceed 200 characters']
            },
            city: {
                type: String,
                trim: true,
                maxlength: [100, 'City cannot exceed 100 characters']
            },
            state: {
                type: String,
                trim: true,
                maxlength: [50, 'State cannot exceed 50 characters']
            },
            zipCode: {
                type: String,
                trim: true,
            },
            country: {
                type: String,
                trim: true,
                default: 'India'
            }
        },
        billingAddress: {
            sameAsBusinessAddress: {
                type: Boolean,
                default: true
            },
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },

    // EXISTING INTEGRATION STRATEGY & EHR/PM SYSTEMS (PRESERVED EXACTLY)
    integrationStrategy: {
        workflowType: {
            type: String,
            enum: ['Manual Portal Entry', 'API Integration', 'FTP Transfer', 'Database Sync', 'Screen Scraping', 'Hybrid'],
            default: 'Manual Portal Entry'
        },
        ehrSystem: {
            systemName: {
                type: String,
                trim: true
            },
            version: String,
            vendor: String,
            lastUpdated: Date,
            customizations: [String],
            integrationMethod: {
                type: String,
                enum: ['API', 'HL7', 'Direct DB', 'File Export', 'Manual'],
                default: 'Manual'
            },
            connectionStatus: {
                type: String,
                enum: ['Connected', 'Disconnected', 'Testing', 'Not Configured'],
                default: 'Not Configured'
            }
        },
        pmSystem: {
            systemName: {
                type: String,
                trim: true
            },
            version: String,
            vendor: String,
            lastUpdated: Date,
            billingModule: {
                type: Boolean,
                default: true
            },
            integrationMethod: {
                type: String,
                enum: ['API', 'HL7', 'Direct DB', 'File Export', 'Manual'],
                default: 'Manual'
            },
            connectionStatus: {
                type: String,
                enum: ['Connected', 'Disconnected', 'Testing', 'Not Configured'],
                default: 'Not Configured'
            }
        },
        clearinghouseInfo: {
            primaryClearinghouse: String,
            secondaryClearinghouse: String,
            submissionMethod: {
                type: String,
                enum: ['Direct', 'Through EHR', 'Through PM', 'Manual Upload'],
                default: 'Manual Upload'
            },
            ediFormat: {
                type: String,
                enum: ['837P', '837I', '837D', 'Custom'],
                default: '837P'
            }
        },
        apiConfig: {
            hasApiAccess: {
                type: Boolean,
                default: false
            },
            apiDocumentationUrl: String,
            sandboxAvailable: {
                type: Boolean,
                default: false
            },
            rateLimits: String,
            authenticationMethod: {
                type: String,
                enum: ['API Key', 'OAuth', 'Basic Auth', 'Token', 'None'],
                default: 'None'
            },
            encryptedCredentials: {
                type: String,
                select: false // Don't return in queries by default
            },
            lastConnectionTest: Date,
            connectionTestResult: {
                type: String,
                enum: ['Success', 'Failed', 'Pending', 'Not Tested'],
                default: 'Not Tested'
            }
        }
    },

    // EXISTING SPECIALTIES & SERVICES (PRESERVED EXACTLY)
    specialtiesAndServices: {
        primarySpecialty: {
            type: String,
            enum: SPECIALTY_TYPES,
            default: 'Primary Care'
        },
        secondarySpecialties: [{
            type: String,
            enum: SPECIALTY_TYPES
        }],
        servicesOffered: [{
            serviceType: {
                type: String,
                enum: Object.values(SERVICE_TYPES),
                required: true
            },
            isActive: {
                type: Boolean,
                default: true
            },
            startDate: {
                type: Date,
                default: Date.now
            },
            endDate: Date,
            volumeExpected: {
                type: Number,
                min: [0, 'Volume cannot be negative'],
                default: 0
            },
            priority: {
                type: String,
                enum: ['Low', 'Normal', 'High', 'Critical'],
                default: 'Normal'
            },
            serviceNotes: {
                type: String,
                trim: true,
                maxlength: [500, 'Service notes cannot exceed 500 characters']
            }
        }],
        patientDemographics: {
            averageAge: Number,
            primaryInsuranceTypes: [{
                type: String,
                enum: ['Medicare', 'Medicaid', 'Commercial', 'Self-Pay', 'Workers Comp', 'Other']
            }],
            geographicRegions: [String],
            languagesSpoken: [String]
        }
    },

    // EXISTING BILLING & FINANCIAL (PRESERVED EXACTLY)
    billingAndFinancial: {
        billingModel: {
            type: String,
            enum: Object.values(BILLING_MODELS),
            required: [true, 'Billing model is required']
        },
        rateCard: {
            currency: {
                type: String,
                enum: Object.keys(CURRENCIES),
                default: 'USD'
            },
            rates: [{
                serviceType: {
                    type: String,
                    enum: Object.values(SERVICE_TYPES),
                    required: true
                },
                rateType: {
                    type: String,
                    enum: ['Per Transaction', 'Per Hour', 'Per Claim', 'Percentage', 'Fixed Monthly'],
                    required: true
                },
                rate: {
                    type: Number,
                    required: true,
                    min: [0, 'Rate cannot be negative']
                },
                effectiveDate: {
                    type: Date,
                    default: Date.now
                },
                expiryDate: Date,
                isActive: {
                    type: Boolean,
                    default: true
                }
            }],
            minimumMonthlyFee: {
                type: Number,
                min: [0, 'Minimum fee cannot be negative'],
                default: 0
            },
            setupFee: {
                type: Number,
                min: [0, 'Setup fee cannot be negative'],
                default: 0
            }
        },
        paymentTerms: {
            type: String,
            enum: Object.values(PAYMENT_TERMS),
            default: 'NET_30'
        },
        invoicingPreferences: {
            frequency: {
                type: String,
                enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
                default: 'Monthly'
            },
            deliveryMethod: {
                type: String,
                enum: ['Email', 'Portal', 'Mail', 'API'],
                default: 'Email'
            },
            consolidatedInvoice: {
                type: Boolean,
                default: true
            },
            detailLevel: {
                type: String,
                enum: ['Summary', 'Detailed', 'Line Item'],
                default: 'Detailed'
            }
        },
        financialMetrics: {
            monthlyRevenue: {
                type: Number,
                min: [0, 'Revenue cannot be negative'],
                default: 0
            },
            averageTransactionValue: {
                type: Number,
                min: [0, 'Transaction value cannot be negative'],
                default: 0
            },
            outstandingBalance: {
                type: Number,
                default: 0
            },
            creditLimit: {
                type: Number,
                min: [0, 'Credit limit cannot be negative'],
                default: 0
            },
            lastPaymentDate: Date,
            paymentHistory: [{
                amount: Number,
                date: Date,
                method: String,
                invoiceNumber: String
            }]
        }
    },

    // EXISTING OPERATIONAL PREFERENCES (PRESERVED EXACTLY)
    operationalPreferences: {
        workingHours: {
            timezone: {
                type: String,
                enum: Object.keys(TIME_ZONES),
                default: 'EST'
            },
            startTime: {
                type: String,
                default: '09:00',
                validate: {
                    validator: function (v) {
                        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                    },
                    message: 'Invalid time format. Use HH:MM'
                }
            },
            endTime: {
                type: String,
                default: '17:00',
                validate: {
                    validator: function (v) {
                        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                    },
                    message: 'Invalid time format. Use HH:MM'
                }
            },
            workingDays: [{
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            }],
            holidays: [Date],
            afterHoursSupport: {
                type: Boolean,
                default: false
            }
        },
        communicationPreferences: {
            primaryChannel: {
                type: String,
                enum: ['Email', 'Phone', 'Slack', 'Teams', 'Portal'],
                default: 'Email'
            },
            escalationChannel: {
                type: String,
                enum: ['Email', 'Phone', 'Slack', 'Teams', 'Portal'],
                default: 'Phone'
            },
            reportingFrequency: {
                type: String,
                enum: ['Daily', 'Weekly', 'Monthly', 'On-demand'],
                default: 'Weekly'
            },
            meetingFrequency: {
                type: String,
                enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
                default: 'Weekly'
            }
        },
        qualityRequirements: {
            accuracyTarget: {
                type: Number,
                min: [0, 'Accuracy target cannot be negative'],
                max: [100, 'Accuracy target cannot exceed 100'],
                default: 95
            },
            slaRequirements: [{
                metric: String,
                target: Number,
                measurement: String,
                penalty: String
            }],
            reportingRequirements: [String],
            auditFrequency: {
                type: String,
                enum: ['Monthly', 'Quarterly', 'Semi-annually', 'Annually'],
                default: 'Quarterly'
            }
        }
    },

    // EXISTING COMPLIANCE & SECURITY (PRESERVED EXACTLY)
    complianceAndSecurity: {
        hipaaCompliance: {
            required: {
                type: Boolean,
                default: true
            },
            baaSigned: {
                type: Boolean,
                default: false
            },
            baaSignedDate: Date,
            baaExpiryDate: Date,
            lastAuditDate: Date,
            nextAuditDate: Date,
            complianceNotes: String
        },
        dataRetention: {
            period: {
                type: Number,
                default: 7, // years
                min: [1, 'Retention period must be at least 1 year']
            },
            backupRequired: {
                type: Boolean,
                default: true
            },
            archiveMethod: {
                type: String,
                enum: ['Cloud', 'Physical', 'Hybrid'],
                default: 'Cloud'
            }
        },
        accessControl: {
            mfaRequired: {
                type: Boolean,
                default: false
            },
            passwordPolicy: String,
            ipWhitelist: [String],
            vpnRequired: {
                type: Boolean,
                default: false
            }
        },
        additionalCompliance: [{
            standard: String,
            required: Boolean,
            certificationDate: Date,
            expiryDate: Date,
            notes: String
        }]
    },

    // NEW RCM WORKFLOWS (ADDED)
    rcmWorkflows: [rcmWorkflowsSchema],

    // NEW CLEARINGHOUSE CONFIGURATION (ADDED)
    clearinghouseConfig: [clearinghouseConfigSchema],

    // NEW QA REQUIREMENTS (ADDED)
    qaRequirements: {
        type: qaRequirementsSchema,
        default: () => ({})
    },

    // EXISTING STATUS & LIFECYCLE (PRESERVED EXACTLY)
    status: {
        clientStatus: {
            type: String,
            enum: ['Prospect', 'Active', 'On Hold', 'Terminated', 'Suspended'],
            default: 'Prospect',
            index: true
        },
        onboardingStatus: {
            type: String,
            enum: ['Not Started', 'Documentation Pending', 'Technical Setup', 'Testing Phase', 'Training Phase', 'Go Live', 'Completed'],
            default: 'Not Started'
        },
        onboardingProgress: {
            type: Number,
            min: [0, 'Progress cannot be negative'],
            max: [100, 'Progress cannot exceed 100'],
            default: 0
        },
        goLiveDate: Date,
        lastActivityDate: {
            type: Date,
            default: Date.now
        },
        relationshipManager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        accountHealth: {
            type: String,
            enum: ['Excellent', 'Good', 'At Risk', 'Critical'],
            default: 'Good'
        },
        riskFactors: [String],
        statusNotes: String
    },

    // EXISTING DOCUMENTS & CONTRACTS (PRESERVED EXACTLY)
    documentsAndContracts: {
        contracts: [{
            contractType: {
                type: String,
                enum: ['Master Service Agreement', 'Statement of Work', 'NDA', 'BAA', 'Amendment'],
                required: true
            },
            contractNumber: String,
            signedDate: Date,
            effectiveDate: Date,
            expiryDate: Date,
            autoRenewal: {
                type: Boolean,
                default: false
            },
            renewalNoticePeriod: Number, // days
            documentPath: String,
            signedBy: String,
            status: {
                type: String,
                enum: ['Draft', 'Pending Signature', 'Signed', 'Expired', 'Terminated'],
                default: 'Draft'
            }
        }],
        policies: [{
            policyType: String,
            version: String,
            effectiveDate: Date,
            documentPath: String,
            acknowledged: Boolean,
            acknowledgedDate: Date,
            acknowledgedBy: String
        }],
        technicalDocuments: [{
            documentType: {
                type: String,
                enum: ['Integration Guide', 'API Documentation', 'Workflow Manual', 'Training Material', 'Other']
            },
            title: String,
            version: String,
            lastUpdated: Date,
            documentPath: String,
            accessLevel: {
                type: String,
                enum: ['Public', 'Client Only', 'Internal Only'],
                default: 'Client Only'
            }
        }]
    },

    // EXISTING SYSTEM INFO (PRESERVED EXACTLY)
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isTemplate: {
            type: Boolean,
            default: false
        },
        templateCategory: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        dataSource: {
            type: String,
            enum: ['Manual Entry', 'Import', 'API', 'Migration'],
            default: 'Manual Entry'
        },
        migrationInfo: {
            sourceSystem: String,
            migrationDate: Date,
            migrationBatch: String,
            validationStatus: {
                type: String,
                enum: ['Pending', 'Validated', 'Issues Found'],
                default: 'Pending'
            }
        }
    },

    // EXISTING AUDIT INFO (PRESERVED EXACTLY)
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
        changeHistory: [{
            modifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            modifiedAt: {
                type: Date,
                default: Date.now
            },
            changeType: {
                type: String,
                enum: ['Created', 'Updated', 'Status Changed', 'Archived', 'Deleted'],
                required: true
            },
            changedFields: [String],
            oldValues: mongoose.Schema.Types.Mixed,
            newValues: mongoose.Schema.Types.Mixed,
            reason: String,
            ipAddress: String
        }],
        accessLog: [{
            accessedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            accessTime: {
                type: Date,
                default: Date.now
            },
            action: {
                type: String,
                enum: ['View', 'Edit', 'Export', 'Print', 'Download'],
                required: true
            },
            ipAddress: String,
            userAgent: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// EXISTING INDEXES (PRESERVED) + NEW RCM INDEXES
clientSchema.index({ companyRef: 1, 'systemInfo.isActive': 1 });
clientSchema.index({ 'clientInfo.clientName': 1 });
clientSchema.index({ 'clientInfo.clientType': 1 });
clientSchema.index({ 'status.clientStatus': 1 });
clientSchema.index({ 'status.onboardingStatus': 1 });
clientSchema.index({ 'specialtiesAndServices.primarySpecialty': 1 });
clientSchema.index({ 'billingAndFinancial.billingModel': 1 });
// NEW RCM INDEXES
clientSchema.index({ 'rcmWorkflows.serviceType': 1 });
clientSchema.index({ 'clearinghouseConfig.clearinghouseName': 1 });
clientSchema.index({ 'clearinghouseConfig.isPrimary': 1 });

// EXISTING VIRTUAL FIELDS (PRESERVED)
clientSchema.virtual('displayName').get(function () {
    return this.clientInfo.legalName || this.clientInfo.clientName;
});

clientSchema.virtual('primaryContact').get(function () {
    return this.contactInfo.primaryContact;
});

clientSchema.virtual('isOnboarded').get(function () {
    return this.status.onboardingStatus === 'Completed';
});

clientSchema.virtual('daysToGoLive').get(function () {
    if (!this.status.goLiveDate) return null;
    const today = new Date();
    const goLive = new Date(this.status.goLiveDate);
    const diffTime = goLive - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

clientSchema.virtual('activeServices').get(function () {
    return this.specialtiesAndServices.servicesOffered.filter(service => service.isActive);
});

clientSchema.virtual('totalMonthlyRevenue').get(function () {
    return this.billingAndFinancial.financialMetrics.monthlyRevenue || 0;
});

// NEW RCM VIRTUAL FIELDS (ADDED)
clientSchema.virtual('activeWorkflows').get(function () {
    return this.rcmWorkflows?.filter(workflow => workflow.isActive) || [];
});

clientSchema.virtual('primaryClearinghouse').get(function () {
    return this.clearinghouseConfig?.find(ch => ch.isPrimary && ch.isActive) || null;
});

clientSchema.virtual('activeClearinghouses').get(function () {
    return this.clearinghouseConfig?.filter(ch => ch.isActive) || [];
});

clientSchema.virtual('workflowCompletionRate').get(function () {
    const workflows = this.rcmWorkflows || [];
    if (workflows.length === 0) return 0;

    const totalExecutions = workflows.reduce((sum, wf) => sum + (wf.workflowMetrics?.totalExecutions || 0), 0);
    const successfulExecutions = workflows.reduce((sum, wf) => {
        const successRate = wf.workflowMetrics?.successRate || 0;
        const executions = wf.workflowMetrics?.totalExecutions || 0;
        return sum + (executions * successRate / 100);
    }, 0);

    return totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0;
});

// EXISTING STATIC METHODS (PRESERVED)
clientSchema.statics.findActiveClients = function (companyRef) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'status.clientStatus': 'Active'
    }).populate('auditInfo.createdBy', 'personalInfo.firstName personalInfo.lastName');
};

clientSchema.statics.findByClientType = function (companyRef, clientType) {
    return this.find({
        companyRef,
        'clientInfo.clientType': clientType,
        'systemInfo.isActive': true
    });
};

clientSchema.statics.findBySpecialty = function (companyRef, specialty) {
    return this.find({
        companyRef,
        'specialtiesAndServices.primarySpecialty': specialty,
        'systemInfo.isActive': true
    });
};

clientSchema.statics.findPendingOnboarding = function (companyRef) {
    return this.find({
        companyRef,
        'status.onboardingStatus': { $ne: 'Completed' },
        'systemInfo.isActive': true
    });
};

clientSchema.statics.findByRevenue = function (companyRef, minRevenue) {
    return this.find({
        companyRef,
        'billingAndFinancial.financialMetrics.monthlyRevenue': { $gte: minRevenue },
        'systemInfo.isActive': true
    });
};

// NEW RCM STATIC METHODS (ADDED)
clientSchema.statics.findByServiceType = function (companyRef, serviceType) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'specialtiesAndServices.servicesOffered.serviceType': serviceType,
        'specialtiesAndServices.servicesOffered.isActive': true
    });
};

clientSchema.statics.findByClearinghouse = function (companyRef, clearinghouseName) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'clearinghouseConfig.clearinghouseName': clearinghouseName,
        'clearinghouseConfig.isActive': true
    });
};

clientSchema.statics.findNeedingWorkflowSetup = function (companyRef) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        $or: [
            { rcmWorkflows: { $size: 0 } },
            { rcmWorkflows: { $exists: false } }
        ]
    });
};

// EXISTING INSTANCE METHODS (PRESERVED)
clientSchema.methods.getOnboardingStatus = function () {
    const hasSignedMSA = this.documentsAndContracts.contracts.some(
        contract => contract.contractType === 'Master Service Agreement' &&
            contract.status === 'Signed'
    );

    const hasSignedBAA = this.complianceAndSecurity.hipaaCompliance.baaSigned;
    const isOnboarded = this.status.onboardingStatus === 'Completed';

    return {
        overall: this.status.onboardingStatus,
        progress: this.status.onboardingProgress,
        blockers: {
            msa: !hasSignedMSA,
            baa: !hasSignedBAA,
            onboarding: !isOnboarded
        }
    };
};

clientSchema.methods.encryptCredentials = function (credentials) {
    const algorithm = 'aes-256-gcm';
    const secretKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipher(algorithm, secretKey);
    let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
};

clientSchema.methods.decryptCredentials = function () {
    if (!this.integrationStrategy.apiConfig.encryptedCredentials) return null;

    try {
        const algorithm = 'aes-256-gcm';
        const secretKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

        const decipher = crypto.createDecipher(algorithm, secretKey);
        let decrypted = decipher.update(this.integrationStrategy.apiConfig.encryptedCredentials, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Failed to decrypt credentials:', error);
        return null;
    }
};

// NEW RCM INSTANCE METHODS (ADDED)
clientSchema.methods.getWorkflowForService = function (serviceType) {
    return this.rcmWorkflows?.find(workflow =>
        workflow.serviceType === serviceType && workflow.isActive
    );
};

clientSchema.methods.getActiveClearinghouses = function () {
    return this.clearinghouseConfig?.filter(ch => ch.isActive) || [];
};

clientSchema.methods.updateWorkflowMetrics = function (workflowName, metrics) {
    const workflow = this.rcmWorkflows?.find(wf => wf.workflowName === workflowName);
    if (workflow) {
        Object.assign(workflow.workflowMetrics, metrics);
        workflow.workflowMetrics.lastExecuted = new Date();
    }
};

clientSchema.methods.validateQaRequirements = function () {
    const qa = this.qaRequirements;
    const errors = [];

    if (qa?.serviceQaRequirements) {
        qa.serviceQaRequirements.forEach(serviceQa => {
            const totalWeight = serviceQa.scoringCriteria?.reduce((sum, criteria) => sum + criteria.weight, 0) || 0;
            if (totalWeight !== 100) {
                errors.push(`Scoring criteria weights for ${serviceQa.serviceType} must total 100%`);
            }
        });
    }

    return errors;
};

// EXISTING PRE-SAVE MIDDLEWARE (PRESERVED + NEW)
clientSchema.pre('save', function (next) {
    // Auto-set billing address if same as business address
    if (this.addressInfo.billingAddress.sameAsBusinessAddress) {
        this.addressInfo.billingAddress = {
            ...this.addressInfo.businessAddress,
            sameAsBusinessAddress: true
        };
    }

    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }

    // Update onboarding progress based on status
    const statusProgressMap = {
        'Not Started': 0,
        'Documentation Pending': 20,
        'Technical Setup': 40,
        'Testing Phase': 60,
        'Training Phase': 80,
        'Go Live': 90,
        'Completed': 100
    };

    if (this.status.onboardingStatus && statusProgressMap[this.status.onboardingStatus]) {
        this.status.onboardingProgress = statusProgressMap[this.status.onboardingStatus];
    }

    // NEW: Ensure only one primary clearinghouse
    const primaryClearinghouses = this.clearinghouseConfig?.filter(ch => ch.isPrimary) || [];
    if (primaryClearinghouses.length > 1) {
        this.clearinghouseConfig.forEach((ch, index) => {
            if (index > 0) ch.isPrimary = false;
        });
    }

    next();
});

// EXISTING POST-SAVE MIDDLEWARE (PRESERVED)
clientSchema.post('save', function (doc, next) {
    // Could trigger webhooks, notifications, etc.
    next();
});

export const Client = mongoose.model('Client', clientSchema, 'clients');