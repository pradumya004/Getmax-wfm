// backend/src/models/core/company.model.js

// COMPLETE MODEL WITH ALL EXISTING FIELDS + NEW RCM CONFIGURATION

import mongoose from "mongoose";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { validate as validatePostalCode } from 'postal-codes-js';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import { SERVICE_TYPES, TIME_ZONES, CURRENCIES, PAYMENT_TERMS, BILLING_MODELS, CLIENT_TYPES } from '../../utils/constants.js';

// Address Schema (PRESERVED EXACTLY)
const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        trim: true,
        maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
        type: String,
        trim: true,
        maxlength: [100, 'City name cannot exceed 100 characters']
    },
    state: {
        type: String,
        trim: true,
        maxlength: [50, 'State name cannot exceed 200 characters']
    },
    zipCode: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                const country = this.parent()?.country || 'IN';
                return validatePostalCode(country, v);
            },
            message: 'Invalid postal code format for this country'
        }
    },
    country: {
        type: String,
        trim: true,
        default: 'India',
        enum: ['India', 'United States', 'Canada', 'United Kingdom']
    },
}, { _id: false });

// Revenue Tracking Schema (PRESERVED EXACTLY)
const revenueSchema = new mongoose.Schema({
    // Monthly Revenue Data
    monthlyRevenue: [{
        month: {
            type: String,
            // required: true // Format: "2024-01"
        },
        totalRevenue: {
            type: Number,
            default: 0,
            min: [0, 'Revenue cannot be negative']
        },
        recurringRevenue: {
            type: Number,
            default: 0,
            min: [0, 'Recurring revenue cannot be negative']
        },
        oneTimeRevenue: {
            type: Number,
            default: 0,
            min: [0, 'One-time revenue cannot be negative']
        },
        clientBreakdown: [{
            clientId: String,
            clientName: String,
            amount: Number,
            percentage: Number
        }],
        serviceBreakdown: [{
            serviceType: {
                type: String,
                enum: ['AR Calling', 'Coding', 'Prior Authorization', 'Denial Management', 'Patient Registration', 'Insurance Verification']
            },
            amount: Number,
            percentage: Number
        }]
    }],

    // Annual Metrics
    currentYear: {
        year: Number,
        targetRevenue: {
            type: Number,
            default: 0,
            min: [0, 'Target revenue cannot be negative']
        },
        achievedRevenue: {
            type: Number,
            default: 0,
            min: [0, 'Achieved revenue cannot be negative']
        },
        growthRate: {
            type: Number,
            default: 0 // Percentage growth from previous year
        }
    },

    // Client Metrics
    clientMetrics: {
        totalActiveClients: {
            type: Number,
            default: 0,
            min: [0, 'Client count cannot be negative']
        },
        newClientsThisMonth: {
            type: Number,
            default: 0,
            min: [0, 'New client count cannot be negative']
        },
        churnedClientsThisMonth: {
            type: Number,
            default: 0,
            min: [0, 'Churned client count cannot be negative']
        },
        averageRevenuePerClient: {
            type: Number,
            default: 0,
            min: [0, 'Average revenue cannot be negative']
        },
        clientRetentionRate: {
            type: Number,
            default: 0,
            min: [0, 'Retention rate cannot be negative'],
            max: [100, 'Retention rate cannot exceed 100%']
        }
    },

    // Performance Metrics
    performanceMetrics: {
        profitMargin: {
            type: Number,
            default: 0 // Percentage
        },
        costPerEmployee: {
            type: Number,
            default: 0,
            min: [0, 'Cost cannot be negative']
        },
        revenuePerEmployee: {
            type: Number,
            default: 0,
            min: [0, 'Revenue cannot be negative']
        },
        operationalEfficiency: {
            type: Number,
            default: 0 // Percentage
        }
    },

    // Currency
    currency: {
        type: String,
        default: 'INR',
        enum: ['USD', 'INR', 'EUR', 'GBP', 'CAD']
    },

    // Last Updated
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

// NEW RCM Configuration Schema (ADDED)
const rcmConfigurationSchema = new mongoose.Schema({
    // Clearinghouse Configurations
    clearinghouses: [{
        clearinghouseName: {
            type: String,
            enum: ['Availity', 'Change Healthcare', 'RelayHealth', 'Trizetto', 'Office Ally', 'Navicure', 'athenaCollector', 'NextGen', 'AllMeds', 'ClaimMD'],
            required: true
        },
        isActive: { type: Boolean, default: true },
        isPrimary: { type: Boolean, default: false },
        credentials: {
            username: { type: String, trim: true },
            password: { type: String }, // Encrypted
            submitterId: { type: String, trim: true },
            receiverId: { type: String, trim: true },
            apiEndpoint: { type: String, trim: true },
            testMode: { type: Boolean, default: true }
        },
        supportedTransactions: [{
            type: String,
            enum: ['270/271', '276/277', '837P', '837I', '835', '278', '999', '997']
        }],
        settings: {
            submissionMethod: { type: String, enum: ['API', 'SFTP', 'Web Portal'], default: 'API' },
            batchSize: { type: Number, default: 100, min: 1, max: 1000 },
            submissionFrequency: { type: String, enum: ['Real-time', 'Hourly', 'Daily', 'Weekly'], default: 'Real-time' },
            acknowledgmentTimeout: { type: Number, default: 60 }, // minutes
            retryAttempts: { type: Number, default: 3, min: 1, max: 10 }
        }
    }],

    // Default Workflow Configurations
    workflows: [{
        serviceType: {
            type: String,
            enum: Object.values(SERVICE_TYPES),
            required: true
        },
        workflowStages: [{
            stageName: { type: String, required: true, trim: true },
            stageOrder: { type: Number, required: true, min: 1 },
            isRequired: { type: Boolean, default: true },
            slaHours: { type: Number, required: true, min: 1 },
            assignmentRules: {
                autoAssign: { type: Boolean, default: false },
                requiredSkills: [String],
                requiredRoleLevel: { type: Number, min: 1, max: 10 },
                roundRobinGroup: String
            },
            qaRequired: { type: Boolean, default: false },
            qaPercentage: { type: Number, min: 0, max: 100, default: 10 }
        }],
        isActive: { type: Boolean, default: true },
        isDefault: { type: Boolean, default: false }
    }],

    // QA Settings
    qaSettings: {
        defaultQaPercentage: { type: Number, min: 0, max: 100, default: 10 },
        calibrationFrequency: { type: String, enum: ['Weekly', 'Bi-weekly', 'Monthly'], default: 'Monthly' },
        qualityThresholds: {
            excellent: { type: Number, min: 90, max: 100, default: 95 },
            good: { type: Number, min: 80, max: 94, default: 90 },
            satisfactory: { type: Number, min: 70, max: 89, default: 85 },
            needsImprovement: { type: Number, min: 0, max: 79, default: 80 }
        },
        escalationRules: {
            failureThreshold: { type: Number, min: 1, max: 5, default: 3 },
            managerNotification: { type: Boolean, default: true },
            trainingRequired: { type: Boolean, default: true }
        },
        scoringWeights: {
            accuracy: { type: Number, min: 0, max: 100, default: 40 },
            completeness: { type: Number, min: 0, max: 100, default: 30 },
            timeliness: { type: Number, min: 0, max: 100, default: 20 },
            compliance: { type: Number, min: 0, max: 100, default: 10 }
        }
    },

    // SLA Configuration
    slaSettings: {
        businessHours: {
            startTime: { type: String, default: '09:00', match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ },
            endTime: { type: String, default: '17:00', match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ },
            workingDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
            holidays: [Date]
        },
        escalationLevels: [{
            level: { type: Number, required: true, min: 1 },
            triggerPercentage: { type: Number, required: true, min: 50, max: 100 },
            notificationRoles: [String],
            actions: [{ type: String, enum: ['Email', 'SMS', 'In-App', 'Escalate'] }]
        }],
        defaultSlaHours: {
            type: Map,
            of: Number
        }
    },

    // Financial Settings
    financialSettings: {
        defaultCurrency: { type: String, enum: Object.keys(CURRENCIES), default: 'USD' },
        decimalPrecision: { type: Number, min: 2, max: 4, default: 2 },
        arAgingBuckets: [{
            bucketName: { type: String, required: true },
            startDays: { type: Number, required: true, min: 0 },
            endDays: { type: Number, required: true },
            alertThreshold: { type: Number, min: 0, max: 100 } // Percentage threshold for alerts
        }],
        collectionSettings: {
            firstNoticeDay: { type: Number, default: 30 },
            secondNoticeDay: { type: Number, default: 60 },
            finalNoticeDay: { type: Number, default: 90 },
            collectionAgencyDay: { type: Number, default: 120 },
            writeOffThreshold: { type: Number, default: 50 } // Dollar amount
        }
    },

    // Integration Settings
    integrationSettings: {
        enableEhrIntegration: { type: Boolean, default: false },
        enablePmIntegration: { type: Boolean, default: false },
        enableBankingIntegration: { type: Boolean, default: false },
        dataSync: {
            syncFrequency: { type: String, enum: ['Real-time', 'Hourly', 'Daily'], default: 'Daily' },
            lastSyncDate: Date,
            autoSyncEnabled: { type: Boolean, default: false }
        }
    },

    // Notification Preferences
    notificationPreferences: {
        slaBreachNotifications: { type: Boolean, default: true },
        qaFailureNotifications: { type: Boolean, default: true },
        denialAlerts: { type: Boolean, default: true },
        paymentAlerts: { type: Boolean, default: true },
        workflowEscalations: { type: Boolean, default: true },
        emailDigestFrequency: { type: String, enum: ['None', 'Daily', 'Weekly'], default: 'Daily' }
    },

    // Setup Status
    setupStatus: {
        clearinghousesConfigured: { type: Boolean, default: false },
        workflowsConfigured: { type: Boolean, default: false },
        qaConfigured: { type: Boolean, default: false },
        slaConfigured: { type: Boolean, default: false },
        financialConfigured: { type: Boolean, default: false },
        integrationConfigured: { type: Boolean, default: false },
        setupCompleted: { type: Boolean, default: false },
        setupCompletedDate: Date
    }
}, { _id: false });

// Company Schema (PRESERVING ALL EXISTING FIELDS)
const companySchema = new mongoose.Schema({
    // Company Info (PRESERVED EXACTLY)
    companyId: {
        type: String,
        unique: true,
        default: () => `COMP-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
    },
    companyCode: {
        type: String,
        unique: true,
        immutable: true,
        default: function () {
            return slugify(this.companyName, {
                lower: false,
                replacement: '',
                remove: /[*+~.()'"!:@]/g
            }).substring(0, 6).toUpperCase();
        }
    },
    legalName: {
        type: String,
        trim: true,
    },
    taxID: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
        lowercase: true,
    },

    // Contact Info - Company Contact, Not Owner (PRESERVED EXACTLY)
    contactEmail: {
        type: String,
        required: [true, 'Contact email is required for sending company login credentials'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(v);
            },
            message: 'Contact email must be a valid email address'
        }
    },
    contactPhone: {
        type: String,
        validate: {
            validator: function (v) {
                if (!v) return true; // Allow empty phone
                try {
                    return isValidPhoneNumber(v, 'IN'); // Default to India
                } catch (error) {
                    return false;
                }
            },
            message: 'Invalid phone number format'
        }
    },
    contactPerson: {
        type: String,
        trim: true,
    },

    // Business Info (PRESERVED EXACTLY)
    businessInfo: {
        industry: {
            type: String,
            trim: true,
            enum: ['Healthcare', 'Medical Billing', 'Technology', 'Consulting', 'Other']
        },
        companySize: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
            default: '1-10'
        },
        foundedYear: {
            type: Number,
            min: [1900, 'Founded year cannot be before 1900'],
            max: [new Date().getFullYear(), 'Founded year cannot be in the future']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        }
    },

    // Address (PRESERVED EXACTLY)
    address: {
        type: addressSchema,
        default: () => ({})
    },

    // Revenue Tracking (PRESERVED EXACTLY)
    revenueInfo: {
        type: revenueSchema,
        default: () => ({})
    },

    // Access Control & Security (PRESERVED EXACTLY)
    accessControl: {
        companyPassword: {
            type: String,
            select: false, // Exclude from queries by default
            validate: {
                validator: function (v) {
                    if (!v) return true; // Allow empty during creation
                    return v.length >= 8;
                },
                message: 'Password must be at least 8 characters long'
            }
        },
        loginAttempts: {
            type: Number,
            default: 0
        },
        accountLocked: {
            type: Boolean,
            default: false
        },
        lockUntil: Date,
        lastLogin: Date,
        lastLoginIP: String
    },

    // API & Integration (PRESERVED EXACTLY)
    apiConfig: {
        apiEnabled: {
            type: Boolean,
            default: false
        },
        apiKey: {
            type: String,
            select: false, // Exclude from queries by default
            index: true
        },
        apiSecretKey: {
            type: String,
            select: false // Exclude from queries by default
        },
        rateLimitPerMinute: {
            type: Number,
            default: 100,
            min: [1, 'Rate limit must be at least 1'],
            max: [1000, 'Rate limit cannot exceed 1000']
        },
        allowedIPs: [{
            type: String,
            validate: {
                validator: function (v) {
                    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                    return ipRegex.test(v);
                },
                message: 'Invalid IP address format'
            }
        }],
        webhookUrl: {
            type: String,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    const urlRegex = /^https?:\/\/.+/;
                    return urlRegex.test(v);
                },
                message: 'Webhook URL must be a valid HTTP/HTTPS URL'
            }
        }
    },

    // Billing Information (PRESERVED EXACTLY)
    billingInfo: {
        billingEmail: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(v);
                },
                message: 'Billing email must be a valid email address'
            }
        },
        billingContactName: {
            type: String,
            trim: true,
        },
        billingPhone: {
            type: String,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    try {
                        return isValidPhoneNumber(v, 'IN');
                    } catch (error) {
                        return false;
                    }
                },
                message: 'Invalid billing phone number'
            }
        },
        billingAddress: {
            type: addressSchema,
            default: () => ({})
        },
        paymentMethod: {
            type: String,
            enum: ['Credit Card', 'Bank Transfer', 'Check', 'Other'],
            default: 'Credit Card'
        },
        taxInformation: {
            taxId: String,
            gstNumber: String,
            taxExempt: {
                type: Boolean,
                default: false
            }
        }
    },

    // Subscription & Plan Management (PRESERVED EXACTLY)
    subscription: {
        planType: {
            type: String,
            enum: ['Trial', 'Basic', 'Professional', 'Enterprise', 'Custom'],
            default: 'Trial'
        },
        subscriptionStatus: {
            type: String,
            enum: ['Active', 'Inactive', 'Suspended', 'Cancelled', 'Expired'],
            default: 'Active'
        },
        subscriptionStartDate: {
            type: Date,
            default: Date.now
        },
        subscriptionEndDate: {
            type: Date,
            validate: {
                validator: function (v) {
                    return !v || v > this.subscription?.subscriptionStartDate;
                },
                message: 'Subscription end date must be after start date'
            }
        },
        trialEndDate: {
            type: Date,
            default: function () {
                const trialEnd = new Date();
                trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
                return trialEnd;
            }
        },
        billingCycle: {
            type: String,
            enum: ['Monthly', 'Quarterly', 'Annually'],
            default: 'Monthly'
        },
        nextBillingDate: Date,
        subscriptionAmount: {
            type: Number,
            min: [0, 'Subscription amount cannot be negative'],
            default: 0
        },
        paymentStatus: {
            type: String,
            enum: ['Paid', 'Pending', 'Failed', 'Overdue'],
            default: 'Pending'
        }
    },

    // Contract Settings (PRESERVED EXACTLY)
    contractSettings: [{
        serviceType: {
            type: String,
            enum: Object.values(SERVICE_TYPES), // Using the imported values
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        billingModel: {
            type: String,
            enum: Object.values(BILLING_MODELS), // Using the imported values
            required: true
        },
        rateStructure: {
            baseRate: {
                type: Number,
                min: [0, 'Base rate cannot be negative'],
                required: true
            },
            currency: {
                type: String,
                enum: Object.keys(CURRENCIES), // Using the imported keys
                default: 'USD'
            },
            rateType: {
                type: String,
                enum: ['Per Hour', 'Per Transaction', 'Per Claim', 'Percentage', 'Fixed Monthly'],
                required: true
            }
        },
        clientTypes: [{
            type: String,
            enum: Object.values(CLIENT_TYPES) // Using the imported values
        }],
        specialtyTypes: [{
            type: String,
            enum: ['Primary Care', 'Cardiology', 'Dermatology', 'Gastroenterology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery', 'Urology', 'Emergency Medicine', 'Anesthesiology', 'Pathology', 'Physical Therapy', 'Dental', 'Vision', 'Mental Health', 'Multi-Specialty', 'Other']
        }],
        paymentTerms: {
            type: String,
            enum: Object.values(PAYMENT_TERMS), // Using the imported values
            default: 'NET_30'
        },
        contractDuration: {
            type: String,
            enum: ['3 Months', '6 Months', '1 Year', '2 Years', '3 Years', 'Ongoing'],
            default: '1 Year'
        },
        minimumCommitment: {
            type: String,
            enum: ['None', '3 Months', '6 Months', '1 Year', '2 Years'],
            default: 'None'
        }
    }],

    // NEW RCM Configuration (ADDED)
    rcmConfiguration: {
        type: rcmConfigurationSchema,
        default: () => ({})
    },

    // System Status & Metadata (PRESERVED EXACTLY)
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isPlatformAdmin: {
            type: Boolean,
            default: false
        },
        timezone: {
            type: String,
            enum: Object.keys(TIME_ZONES), // Using the imported keys
            default: 'IST'
        },
        dateFormat: {
            type: String,
            enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
            default: 'MM/DD/YYYY'
        },
        timeFormat: {
            type: String,
            enum: ['12-hour', '24-hour'],
            default: '12-hour'
        },
        language: {
            type: String,
            enum: ['English', 'Spanish', 'French', 'German', 'Hindi'],
            default: 'English'
        },
        dataRetentionPeriod: {
            type: Number,
            default: 2555, // 7 years in days
            min: [365, 'Data retention period must be at least 1 year']
        }
    },

    // Compliance & Security (PRESERVED EXACTLY)
    compliance: {
        hipaaCompliant: {
            type: Boolean,
            default: true
        },
        soc2Compliant: {
            type: Boolean,
            default: false
        },
        iso27001Compliant: {
            type: Boolean,
            default: false
        },
        dataEncryption: {
            type: Boolean,
            default: true
        },
        backupFrequency: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly'],
            default: 'Daily'
        },
        lastSecurityAudit: Date,
        nextSecurityAudit: Date
    },

    // Audit Information (PRESERVED EXACTLY)
    auditInfo: {
        createdBy: {
            type: String,
            default: 'System'
        },
        lastModifiedBy: String,
        lastModifiedAt: Date,
        loginHistory: [{
            loginTime: Date,
            ipAddress: String,
            userAgent: String,
            success: Boolean,
            failureReason: String
        }],
        dataExports: [{
            exportTime: Date,
            exportedBy: String,
            dataType: String,
            recordCount: Number
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes (PRESERVED + NEW)
companySchema.index({ companyId: 1 }, { unique: true });
companySchema.index({ contactEmail: 1 }, { unique: true });
companySchema.index({ 'subscription.subscriptionStatus': 1 });
companySchema.index({ 'systemInfo.isActive': 1 });
companySchema.index({ 'apiConfig.apiKey': 1 }, { sparse: true });
// NEW RCM INDEXES
companySchema.index({ 'rcmConfiguration.setupStatus.setupCompleted': 1 });
companySchema.index({ 'rcmConfiguration.clearinghouses.clearinghouseName': 1 });

// Virtual Fields (PRESERVED + NEW)
companySchema.virtual('isTrialExpired').get(function () {
    return this.subscription?.trialEndDate && new Date() > this.subscription.trialEndDate;
});

companySchema.virtual('isSubscriptionActive').get(function () {
    return this.subscription?.subscriptionStatus === 'Active' &&
        (!this.subscription?.subscriptionEndDate || new Date() <= this.subscription.subscriptionEndDate);
});

companySchema.virtual('currentRevenue').get(function () {
    const currentMonth = new Date().toISOString().substr(0, 7); // Format: "2024-01"
    const monthlyData = this.revenueInfo?.monthlyRevenue?.find(m => m.month === currentMonth);
    return monthlyData?.totalRevenue || 0;
});

companySchema.virtual('averageRevenuePerClient').get(function () {
    const metrics = this.revenueInfo?.clientMetrics;
    return metrics?.totalActiveClients > 0 ?
        this.currentRevenue / metrics.totalActiveClients : 0;
});

// NEW RCM VIRTUAL FIELDS
companySchema.virtual('activeClearinghouses').get(function () {
    return this.rcmConfiguration?.clearinghouses?.filter(ch => ch.isActive) || [];
});

companySchema.virtual('primaryClearinghouse').get(function () {
    return this.rcmConfiguration?.clearinghouses?.find(ch => ch.isPrimary && ch.isActive) || null;
});

companySchema.virtual('setupProgress').get(function () {
    const status = this.rcmConfiguration?.setupStatus;
    if (!status) return 0;

    const steps = [
        status.clearinghousesConfigured,
        status.workflowsConfigured,
        status.qaConfigured,
        status.slaConfigured,
        status.financialConfigured,
        status.integrationConfigured
    ];

    const completedSteps = steps.filter(Boolean).length;
    return Math.round((completedSteps / steps.length) * 100);
});

// Static Methods (PRESERVED + NEW)
companySchema.statics.findByCompanyId = function (companyId) {
    return this.findOne({ companyId, 'systemInfo.isActive': true });
};

companySchema.statics.findByApiKey = function (apiKey) {
    return this.findOne({
        'apiConfig.apiKey': apiKey,
        'apiConfig.apiEnabled': true,
        'systemInfo.isActive': true,
        'subscription.subscriptionStatus': { $in: ['Active'] }
    }).select('+apiConfig.apiKey');
};

companySchema.statics.getRevenueReport = function (companyId, startMonth, endMonth) {
    return this.findOne({ companyId })
        .select('revenueInfo.monthlyRevenue')
        .then(company => {
            if (!company) return null;
            return company.revenueInfo.monthlyRevenue.filter(m =>
                m.month >= startMonth && m.month <= endMonth
            );
        });
};

// NEW RCM STATIC METHODS
companySchema.statics.findCompletedSetups = function () {
    return this.find({
        'rcmConfiguration.setupStatus.setupCompleted': true,
        'systemInfo.isActive': true
    });
};

companySchema.statics.findPendingSetups = function () {
    return this.find({
        'rcmConfiguration.setupStatus.setupCompleted': false,
        'systemInfo.isActive': true
    });
};

// Instance Methods (PRESERVED + NEW)
companySchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.accessControl?.companyPassword) return false;
    return await bcrypt.compare(candidatePassword, this.accessControl.companyPassword);
};

companySchema.methods.generateApiKey = async function () {
    const apiKey = `gm_${crypto.randomBytes(32).toString('hex')}`;
    const secretKey = crypto.randomBytes(32).toString('hex');

    this.apiConfig.apiKey = apiKey;
    this.apiConfig.apiSecretKey = secretKey;

    return { apiKey, secretKey };
};

companySchema.methods.calculateMetrics = function () {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toISOString().substr(0, 7);

    // Calculate annual revenue from monthly data
    const yearlyRevenue = this.revenueInfo?.monthlyRevenue
        ?.filter(m => m.month.startsWith(currentYear.toString()))
        ?.reduce((sum, m) => sum + (m.totalRevenue || 0), 0) || 0;

    if (!this.revenueInfo.currentYear) {
        this.revenueInfo.currentYear = {};
    }
    this.revenueInfo.currentYear.achievedRevenue = yearlyRevenue;

    // Calculate average revenue per client
    this.revenueInfo.clientMetrics.averageRevenuePerClient =
        this.revenueInfo.clientMetrics.totalActiveClients > 0 ?
            this.currentRevenue / this.revenueInfo.clientMetrics.totalActiveClients
            : 0;
};

// NEW RCM INSTANCE METHODS
companySchema.methods.getWorkflowForService = function (serviceType) {
    return this.rcmConfiguration?.workflows?.find(w =>
        w.serviceType === serviceType && w.isActive
    );
};

companySchema.methods.updateSetupProgress = function () {
    const config = this.rcmConfiguration;
    if (!config) return;

    // Check each setup component
    config.setupStatus.clearinghousesConfigured = config.clearinghouses?.length > 0;
    config.setupStatus.workflowsConfigured = config.workflows?.length > 0;
    config.setupStatus.qaConfigured = !!config.qaSettings;
    config.setupStatus.slaConfigured = !!config.slaSettings;
    config.setupStatus.financialConfigured = !!config.financialSettings;
    config.setupStatus.integrationConfigured = !!config.integrationSettings;

    // Mark as completed if all components are configured
    const allConfigured = [
        config.setupStatus.clearinghousesConfigured,
        config.setupStatus.workflowsConfigured,
        config.setupStatus.qaConfigured,
        config.setupStatus.slaConfigured,
        config.setupStatus.financialConfigured
    ].every(Boolean);

    if (allConfigured && !config.setupStatus.setupCompleted) {
        config.setupStatus.setupCompleted = true;
        config.setupStatus.setupCompletedDate = new Date();
    }
};

// Pre-save middleware (PRESERVED + NEW)
companySchema.pre('save', async function (next) {
    // Auto-populate billing email if not provided
    if (!this.billingInfo?.billingEmail && this.contactEmail) {
        if (!this.billingInfo) this.billingInfo = {};
        this.billingInfo.billingEmail = this.contactEmail;
    }

    // Auto-populate billing contact if not provided
    if (!this.billingInfo?.billingContactName && this.contactPerson) {
        if (!this.billingInfo) this.billingInfo = {};
        this.billingInfo.billingContactName = this.contactPerson;
    }

    // Generate API key if enabled but not present
    if (this.apiConfig?.apiEnabled && !this.apiConfig?.apiKey) {
        await this.generateApiKey();
    }

    // Hash password if modified
    if (this.isModified("accessControl.companyPassword") && this.accessControl?.companyPassword) {
        const salt = await bcrypt.genSalt(12);
        this.accessControl.companyPassword = await bcrypt.hash(this.accessControl.companyPassword, salt);
    }

    // Initialize current year revenue tracking
    if (this.isNew || !this.revenueInfo?.currentYear?.year) {
        if (!this.revenueInfo) this.revenueInfo = {};
        if (!this.revenueInfo.currentYear) this.revenueInfo.currentYear = {};
        this.revenueInfo.currentYear.year = new Date().getFullYear();
    }

    // Calculate metrics if revenue data exists
    if (this.isModified('revenueInfo.monthlyRevenue')) {
        this.calculateMetrics();
    }

    // NEW: Update RCM setup progress
    this.updateSetupProgress();

    next();
});

// Error handling for duplicates (PRESERVED)
companySchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern?.contactEmail) {
            next(new Error('Company with this email already exists'));
        } else if (error.keyPattern?.companyId) {
            next(new Error('Company ID already exists'));
        } else {
            next(new Error('Duplicate entry found'));
        }
    } else {
        next(error);
    }
});

export const Company = mongoose.model("Company", companySchema, "companies");