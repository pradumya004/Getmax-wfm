// backend/src/models/client.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

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
            enum: [
                'Healthcare Provider', 
                'Billing Company', 
                'Hospital System',
                'Multi-Specialty Clinic',
                'Individual Practice',
                'DME Company',
                'Laboratory',
                'Dental Practice',
                'Behavioral Health',
                'Other'
            ],
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
            title: {
                type: String,
                trim: true
            },
            email: {
                type: String,
                required: [true, 'Primary contact email is required'],
                trim: true,
                lowercase: true,
                validate: {
                    validator: function(v) {
                        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                    },
                    message: 'Invalid email format'
                }
            },
            phone: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
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
                    validator: function(v) {
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
                    validator: function(v) {
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
                validate: {
                    validator: function(v) {
                        return !v || /^\d{5}(-\d{4})?$/.test(v); // US ZIP format
                    },
                    message: 'Invalid ZIP code format'
                }
            },
            country: {
                type: String,
                trim: true,
                default: 'United States',
                enum: ['United States', 'Canada', 'India', 'United Kingdom', 'Other']
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
            enum: [
                'Manual Only', 
                'API Integration Only', 
                'Hybrid (Manual + API)',
                'SFTP Integration',
                'Email Integration'
            ],
            default: 'Manual Only',
            index: true
        },
        
        // ** EHR/PM SYSTEM DETAILS **
        ehrPmSystem: {
            systemName: {
                type: String,
                enum: [
                    'ClaimMD',
                    'Medisoft', 
                    'Epic',
                    'Cerner',
                    'AllScripts',
                    'eClinicalWorks',
                    'athenahealth',
                    'NextGen',
                    'Greenway',
                    'Practice Fusion',
                    'SimplePractice',
                    'Kareo',
                    'DrChrono',
                    'AdvancedMD',
                    'Custom/Other',
                    'None'
                ],
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
                enum: ['API Key', 'OAuth 2.0', 'Basic Auth', 'Bearer Token', 'Custom'],
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
                enum: ['Not Configured', 'Testing', 'Active', 'Failed', 'Suspended'],
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
            fileFormat: {
                type: String,
                enum: ['CSV', 'Excel', 'HL7', 'X12', 'JSON', 'XML'],
                default: 'CSV'
            },
            syncFrequency: {
                type: String,
                enum: ['Real-time', 'Hourly', 'Daily', 'Weekly', 'Manual'],
                default: 'Daily'
            }
        },

        // ** MANUAL UPLOAD CONFIGURATION **
        manualConfig: {
            allowedFileFormats: [{
                type: String,
                enum: ['CSV', 'Excel (.xlsx)', 'Excel (.xls)', 'Text (.txt)'],
                default: 'Excel (.xlsx)'
            }],
            maxFileSize: {
                type: Number, // in MB
                min: [1, 'Max file size must be at least 1MB'],
                max: [100, 'Max file size cannot exceed 100MB'],
                default: 25
            },
            templateRequired: {
                type: Boolean,
                default: true
            },
            customFieldMapping: {
                type: Map,
                of: String // Maps client fields to BET fields
            }
        }
    },

    // ** DATA FORMAT & PROCESSING **
    dataProcessingConfig: {
        claimDataFormat: {
            type: String,
            enum: ['Standard BET', 'ClaimMD Format', 'EMSMC Format', 'Custom Mapping'],
            required: [true, 'Claim data format is required'],
            default: 'Standard BET'
        },
        
        // Field mapping for different formats
        fieldMapping: {
            claimIdField: {
                type: String,
                default: 'claim_id'
            },
            patientNameField: {
                type: String,
                default: 'patient_name'
            },
            dosField: {
                type: String,
                default: 'date_of_service'
            },
            payerField: {
                type: String,
                default: 'payer_name'
            },
            cptField: {
                type: String,
                default: 'cpt_codes'
            },
            chargesField: {
                type: String,
                default: 'billed_amount'
            },
            customFields: {
                type: Map,
                of: String
            }
        },

        // Data validation rules
        validationRules: {
            requirePatientInfo: {
                type: Boolean,
                default: true
            },
            requireInsuranceInfo: {
                type: Boolean,
                default: true
            },
            allowDuplicateClaims: {
                type: Boolean,
                default: false
            },
            autoCorrectData: {
                type: Boolean,
                default: true
            }
        },

        // Processing preferences
        processingPreferences: {
            batchSize: {
                type: Number,
                min: [10, 'Batch size must be at least 10'],
                max: [1000, 'Batch size cannot exceed 1000'],
                default: 100
            },
            processingPriority: {
                type: String,
                enum: ['Low', 'Normal', 'High', 'Critical'],
                default: 'Normal'
            },
            notifyOnCompletion: {
                type: Boolean,
                default: true
            },
            errorHandling: {
                type: String,
                enum: ['Stop on Error', 'Skip and Continue', 'Manual Review'],
                default: 'Skip and Continue'
            }
        }
    },

    // ** SERVICE AGREEMENTS & SOWS **
    serviceAgreements: {
        masterServiceAgreement: {
            signed: {
                type: Boolean,
                default: false
            },
            signedDate: Date,
            expiryDate: Date,
            documentPath: String
        },
        hipaaBAA: {
            signed: {
                type: Boolean,
                default: false
            },
            signedDate: Date,
            expiryDate: Date,
            documentPath: String
        },
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
            enum: ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AED'],
            default: 'USD'
        },
        paymentTerms: {
            type: String,
            enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt'],
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
        lastInvoiceDate: Date,
        nextInvoiceDate: Date
    },

    // ** CLIENT STATUS & LIFECYCLE **
    status: {
        clientStatus: {
            type: String,
            enum: [
                'Prospect', 
                'Active', 
                'On Hold', 
                'Inactive', 
                'Terminated',
                'Under Review'
            ],
            default: 'Prospect',
            index: true
        },
        onboardingStatus: {
            type: String,
            enum: [
                'Not Started',
                'Documentation Pending',
                'Technical Setup',
                'Testing Phase', 
                'Training Phase',
                'Go Live',
                'Completed'
            ],
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
        },
        riskLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Low'
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
            enum: [
                'EST', 'CST', 'MST', 'PST', 'GMT', 'IST',
                'America/New_York', 'America/Chicago', 'America/Denver', 
                'America/Los_Angeles', 'UTC', 'Asia/Kolkata'
            ],
            default: 'EST'
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
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }]
        },
        dataRetentionPeriod: {
            type: Number, // in days
            min: [30, 'Data retention period must be at least 30 days'],
            default: 2555 // 7 years for healthcare compliance
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

clientSchema.virtual('isIntegrationReady').get(function() {
    if (this.integrationStrategy.workflowType === 'Manual Only') return true;
    if (this.integrationStrategy.workflowType === 'API Integration Only') {
        return this.integrationStrategy.apiConfig.syncStatus === 'Active';
    }
    if (this.integrationStrategy.workflowType === 'SFTP Integration') {
        return this.integrationStrategy.sftpConfig.enabled;
    }
    return false;
});

clientSchema.virtual('revenueThisMonth').get(function() {
    // This would be calculated from actual invoice data
    return this.financialInfo.totalRevenueGenerated || 0;
});

// ** STATIC METHODS **
clientSchema.statics.findActiveClients = function(companyRef) {
    return this.find({
        companyRef,
        'status.clientStatus': 'Active',
        'systemInfo.isActive': true
    }).populate('serviceAgreements.activeSOWs', 'sowName serviceDetails.serviceType')
      .populate('auditInfo.createdBy', 'personalInfo.firstName personalInfo.lastName');
};

clientSchema.statics.findClientsByIntegrationType = function(companyRef, integrationType) {
    return this.find({
        companyRef,
        'integrationStrategy.workflowType': integrationType,
        'systemInfo.isActive': true
    });
};

clientSchema.statics.findClientsNeedingOnboarding = function(companyRef) {
    return this.find({
        companyRef,
        'status.onboardingStatus': { 
            $nin: ['Completed'] 
        },
        'systemInfo.isActive': true
    });
};

clientSchema.statics.findClientsByEHRSystem = function(companyRef, ehrSystem) {
    return this.find({
        companyRef,
        'integrationStrategy.ehrPmSystem.systemName': ehrSystem,
        'systemInfo.isActive': true
    });
};

// ** INSTANCE METHODS **
clientSchema.methods.updatePerformanceMetrics = function(newMetrics) {
    if (newMetrics.claimsProcessed) this.performanceMetrics.averageClaimsPerMonth = newMetrics.claimsProcessed;
    if (newMetrics.processingTime) this.performanceMetrics.averageProcessingTime = newMetrics.processingTime;
    if (newMetrics.qualityScore) this.performanceMetrics.qualityScoreAverage = newMetrics.qualityScore;
    if (newMetrics.slaCompliance) this.performanceMetrics.slaComplianceRate = newMetrics.slaCompliance;
    if (newMetrics.satisfactionScore) this.performanceMetrics.clientSatisfactionScore = newMetrics.satisfactionScore;
    
    this.status.lastActivityDate = new Date();
};

clientSchema.methods.canStartSOW = function() {
    const hasSignedMSA = this.serviceAgreements.masterServiceAgreement.signed;
    const hasSignedBAA = this.serviceAgreements.hipaaBAA.signed;
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

clientSchema.methods.encryptCredentials = function(credentials) {
    const algorithm = 'aes-256-gcm';
    const secretKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, secretKey);
    let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
};

clientSchema.methods.decryptCredentials = function() {
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
clientSchema.pre('save', function(next) {
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
    
    next();
});

// ** POST-SAVE MIDDLEWARE **
clientSchema.post('save', function(doc, next) {
    // Could trigger webhooks, notifications, etc.
    next();
});

export const Client = mongoose.model('Client', clientSchema, 'clients');