// backend/src/models/core/client.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { ONBOARDING_STATUS_PROGRESS } from '../../../../shared/constants/clientConstants.js';

const clientSchema = new mongoose.Schema({
    clientId: {
        type: String,
        unique: true,
        default: () => `CLT-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // GetMax company managing this client
        required: [true, 'Company reference is required'],
        index: true
    },

    // ** CLIENT BASIC INFORMATION **
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
            // validate: {
            //     validator: function(v) {
            //         return !v || /^\d{2}-\d{7}$/.test(v); // Basic EIN format
            //     },
            //     message: 'Tax ID must be in XX-XXXXXXX format'
            // }
        },
        npiNumber: {
            type: String,
            trim: true,
            // validate: {
            //     validator: function(v) {
            //         return !v || /^\d{10}$/.test(v); // NPI is 10 digits
            //     },
            //     message: 'NPI must be 10 digits'
            // }
        },
        description: {
            type: String,
            trim: true,
        }
    },

    // ** CONTACT INFORMATION **
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

    // ** ADDRESS INFORMATION **
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

    // ** 🚀 INTEGRATION STRATEGY & EHR/PM SYSTEMS **
    integrationStrategy: {
        workflowType: {
            type: String,
            required: [true, 'Workflow type is required'],
            default: 'Manual Only',
            index: true
        },

        // ** EHR/PM SYSTEM DETAILS **
        ehrPmSystem: {
            systemName: {
                type: String,
                default: 'None'
            },
            systemVersion: {
                type: String,
                trim: true
            },
            vendorContact: {
                name: String,
                email: String,
                phone: String
            }
        },

        // ** API CONFIGURATION **
        apiConfig: {
            hasApiAccess: {
                type: Boolean,
                default: false
            },
            apiBaseUrl: {
                type: String,
                trim: true
            },
            apiVersion: {
                type: String,
                trim: true
            },
            authMethod: {
                type: String,
                default: 'API Key'
            },
            // Encrypted credentials - NEVER store in plain text
            encryptedCredentials: {
                type: String, // Will store encrypted JSON
                select: false // Never return in queries
            },
            testEndpoint: {
                type: String,
                trim: true
            },
            productionEndpoint: {
                type: String,
                trim: true
            },
            rateLimitPerHour: {
                type: Number,
                min: [1, 'Rate limit must be at least 1 per hour'],
                default: 100
            },
            lastSuccessfulSync: Date,
            lastFailedSync: Date,
            syncStatus: {
                type: String,
                default: 'Not Configured'
            }
        },

        // ** SFTP CONFIGURATION **
        sftpConfig: {
            enabled: {
                type: Boolean,
                default: false
            },
            host: {
                type: String,
                trim: true
            },
            port: {
                type: Number,
                min: [1, 'Port must be positive'],
                max: [65535, 'Port cannot exceed 65535'],
                default: 22
            },
            username: {
                type: String,
                trim: true
            },
            // Encrypted password/key
            encryptedAuth: {
                type: String,
                select: false
            },
            inboundPath: {
                type: String,
                trim: true,
                default: '/inbound/'
            },
            outboundPath: {
                type: String,
                trim: true,
                default: '/outbound/'
            },
            fileFormat: [{
                type: String,
                default: 'Excel (.xlsx)'
            }],
            syncFrequency: {
                type: String,
                default: 'Daily'
            }
        },

        // ** MANUAL UPLOAD CONFIGURATION **
        manualConfig: {
            allowedFileFormats: {
                type: [String],
                default: []
            },
            maxFileSize: {
                type: Number, // in MB
            },
            templateRequired: {
                type: Boolean,
                default: true
            },
        }
    },

    // ** SERVICE AGREEMENTS & SOWS **
    serviceAgreements: {
        serviceType: [{
            type: String,
        }],
        compliances: [{
            type: String,
            signed: {
                type: Boolean,
                default: false
            },
            signedDate: Date,
            expiryDate: Date,
            documentPath: String
        }],
        activeSOWs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SOW'
        }],
        totalSOWsCreated: {
            type: Number,
            default: 0
        }
    },

    // ** FINANCIAL INFORMATION **
    financialInfo: {
        billingCurrency: {
            type: String,
            default: 'INR'
        },
        paymentTerms: {
            type: String,
            default: 'Net 30'
        },
        creditLimit: {
            type: Number,
            min: [0, 'Credit limit cannot be negative'],
            default: 0
        },
        outstandingBalance: {
            type: Number,
            default: 0
        },
        totalRevenueGenerated: {
            type: Number,
            default: 0,
            min: [0, 'Total revenue cannot be negative']
        },
        invoiceFormat: {
            type: String,
            default: 'PDF'
        },
        lastInvoiceDate: Date,
        nextInvoiceDate: Date
    },

    // ** CLIENT STATUS & LIFECYCLE **
    status: {
        clientStatus: {
            type: String,
            default: 'Prospect',
            index: true
        },
        onboardingStatus: {
            type: String,
            default: 'Not Started'
        },
        onboardingProgress: {
            type: Number,
            min: [0, 'Onboarding progress cannot be negative'],
            max: [100, 'Onboarding progress cannot exceed 100%'],
            default: 0
        },
        lastActivityDate: {
            type: Date,
            default: Date.now
        }
    },

    // ** PERFORMANCE METRICS **
    performanceMetrics: {
        averageClaimsPerMonth: {
            type: Number,
            default: 0,
            min: [0, 'Average claims per month cannot be negative']
        },
        averageProcessingTime: {
            type: Number, // in hours
            default: 0,
            min: [0, 'Average processing time cannot be negative']
        },
        qualityScoreAverage: {
            type: Number,
            default: 0,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100%']
        },
        slaComplianceRate: {
            type: Number,
            default: 0,
            min: [0, 'SLA compliance cannot be negative'],
            max: [100, 'SLA compliance cannot exceed 100%']
        },
        clientSatisfactionScore: {
            type: Number,
            min: [1, 'Satisfaction score must be at least 1'],
            max: [10, 'Satisfaction score cannot exceed 10'],
            default: 8
        }
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        timezone: {
            type: String,
            default: 'IST'
        },
        businessHours: {
            start: {
                type: String,
                default: '09:00'
            },
            end: {
                type: String,
                default: '17:00'
            },
            workingDays: [{
                type: String,
                default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }]
        },
        dataRetentionPeriod: {
            type: Number, // in days
            min: [1, 'Data retention period must be at least 1 month'],
            default: 12
        }
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
        onboardedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        onboardedAt: Date,
        lastReviewBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastReviewAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
clientSchema.index({ companyRef: 1, 'status.clientStatus': 1 });
clientSchema.index({ 'clientInfo.clientType': 1, 'systemInfo.isActive': 1 });
clientSchema.index({ 'integrationStrategy.workflowType': 1 });
clientSchema.index({ 'integrationStrategy.ehrPmSystem.systemName': 1 });
clientSchema.index({ 'status.onboardingStatus': 1 });

// Compound indexes for complex queries
clientSchema.index({
    companyRef: 1,
    'status.clientStatus': 1,
    'systemInfo.isActive': 1
});

clientSchema.index({
    'integrationStrategy.workflowType': 1,
    'integrationStrategy.ehrPmSystem.systemName': 1
});

// ** VIRTUAL FIELDS **
clientSchema.virtual('totalActiveSOWs', {
    ref: 'SOW',
    localField: '_id',
    foreignField: 'clientCompanyRef',
    count: true,
    match: { 'status.sowStatus': 'Active', 'systemInfo.isActive': true }
});

clientSchema.virtual('isIntegrationReady').get(function () {
    if (this.integrationStrategy.workflowType === 'Manual Only') return true;
    if (this.integrationStrategy.workflowType === 'API Integration Only') {
        return this.integrationStrategy.apiConfig.syncStatus === 'Active';
    }
    if (this.integrationStrategy.workflowType === 'SFTP Integration') {
        return this.integrationStrategy.sftpConfig.enabled;
    }
    return false;
});

clientSchema.virtual('revenueThisMonth').get(function () {
    // This would be calculated from actual invoice data
    return this.financialInfo.totalRevenueGenerated || 0;
});

// ** STATIC METHODS **
clientSchema.statics.findActiveClients = function (companyRef) {
    return this.find({
        companyRef,
        'status.clientStatus': 'Active',
        'systemInfo.isActive': true
    }).populate('serviceAgreements.activeSOWs', 'sowName serviceDetails.serviceType')
        .populate('auditInfo.createdBy', 'personalInfo.firstName personalInfo.lastName');
};

clientSchema.statics.findClientsByIntegrationType = function (companyRef, integrationType) {
    return this.find({
        companyRef,
        'integrationStrategy.workflowType': integrationType,
        'systemInfo.isActive': true
    });
};

clientSchema.statics.findClientsNeedingOnboarding = function (companyRef) {
    return this.find({
        companyRef,
        'status.onboardingStatus': {
            $nin: ['Completed']
        },
        'systemInfo.isActive': true
    });
};

clientSchema.statics.findClientsByEHRSystem = function (companyRef, ehrSystem) {
    return this.find({
        companyRef,
        'integrationStrategy.ehrPmSystem.systemName': ehrSystem,
        'systemInfo.isActive': true
    });
};

// ** INSTANCE METHODS **
clientSchema.methods.updatePerformanceMetrics = function (newMetrics) {
    if (newMetrics.claimsProcessed) this.performanceMetrics.averageClaimsPerMonth = newMetrics.claimsProcessed;
    if (newMetrics.processingTime) this.performanceMetrics.averageProcessingTime = newMetrics.processingTime;
    if (newMetrics.qualityScore) this.performanceMetrics.qualityScoreAverage = newMetrics.qualityScore;
    if (newMetrics.slaCompliance) this.performanceMetrics.slaComplianceRate = newMetrics.slaCompliance;
    if (newMetrics.satisfactionScore) this.performanceMetrics.clientSatisfactionScore = newMetrics.satisfactionScore;

    this.status.lastActivityDate = new Date();
};

clientSchema.methods.canStartSOW = function () {
    // Helper to find a signed compliance document by its type/name
    const findCompliance = (name) =>
        this.serviceAgreements.compliances.find(c =>
            c.type?.toLowerCase().includes(name.toLowerCase()) && c.signed
        );

    const hasSignedMSA = !!findCompliance('master service agreement');
    const hasSignedBAA = !!findCompliance('hipaa'); // Check for 'hipaa' in the type
    const isOnboarded = this.status.onboardingStatus === 'Completed';

    return {
        canStart: hasSignedMSA && hasSignedBAA && isOnboarded,
        missingRequirements: {
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

// ** PRE-SAVE MIDDLEWARE **
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

    // Update onboarding progress using constant file
    if (this.isModified('status.onboardingStatus')) {
        const progress = ONBOARDING_STATUS_PROGRESS[this.status.onboardingStatus];

        // Check if the status is valid before assigning
        if (progress !== undefined) {
            this.status.onboardingProgress = progress;
        } else {
            // If an invalid status is somehow set, default to 0
            this.status.onboardingProgress = 0;
            console.warn(`Invalid onboarding status set for client ${this.clientId}: ${this.status.onboardingStatus}`);
        }
    }

    next();
});

// ** POST-SAVE MIDDLEWARE **
clientSchema.post('save', function (doc, next) {
    // Could trigger webhooks, notifications, etc.
    next();
});

export const Client = mongoose.model('Client', clientSchema, 'clients');