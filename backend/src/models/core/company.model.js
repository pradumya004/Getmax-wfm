// backend/src/models/core/company.model.js

import mongoose from "mongoose";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { validate as validatePostalCode } from 'postal-codes-js';
import bcrypt from 'bcryptjs';
import {
    COMPANY_CONSTANTS,
    VALIDATION_MESSAGES,
    VALIDATION_PATTERNS
} from "../../../../shared/constants/modelConstants.js";

// Address Schema
const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
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
        enum: {
            values: COMPANY_CONSTANTS.COUNTRIES,
            message: '{VALUE} is not a supported country'
        }
    },
}, { _id: false });

// Revenue Tracking Schema
const revenueSchema = new mongoose.Schema({
    // Monthly Revenue Data
    monthlyRevenue: [{
        month: String,
        totalRevenue: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Total revenue', 0)]
        },
        recurringRevenue: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Recurring revenue', 0)]
        },
        oneTimeRevenue: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('One-time revenue', 0)]
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
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Target revenue', 0)]
        },
        achievedRevenue: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Achieved revenue', 0)]
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
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Total active clients', 0)]
        },
        newClientsThisMonth: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('New clients this month', 0)]
        },
        churnedClientsThisMonth: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Churned clients this month', 0)]
        },
        averageRevenuePerClient: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Average revenue per client', 0)]
        },
        clientRetentionRate: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Client retention rate', 0)],
            max: [100, VALIDATION_MESSAGES.MAX_VALUE('Client retention rate', 100)]
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
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Cost per employee', 0)]
        },
        revenuePerEmployee: {
            type: Number,
            default: 0,
            min: [0, VALIDATION_MESSAGES.MIN_VALUE('Revenue per employee', 0)]
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
        enum: {
            values: COMPANY_CONSTANTS.CURRENCIES,
            message: '{VALUE} is not a supported currency'
        }
    },

    // Last Updated
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

// Company Schema
const companySchema = new mongoose.Schema({
    // Company Info
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

    // Contact Info - Company Contact, Not Owner
    contactEmail: {
        type: String,
        required: [true, 'Contact email is required for sending company login credentials'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return VALIDATION_PATTERNS.EMAIL.test(v);
            },
            message: VALIDATION_MESSAGES.EMAIL_INVALID
        }
    },
    companyPassword: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, VALIDATION_MESSAGES.MIN_LENGTH('Password', 8)],
        select: false,
        trim: true,
    },
    contactPhone: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                try {
                    const countryMap = {
                        'India': 'IN',
                        'United States': 'US',
                        'Canada': 'CA',
                        'United Kingdom': 'GB'
                    };
                    const country = this.address?.country || 'India';
                    const countryCode = countryMap[country] || 'IN';
                    return isValidPhoneNumber(v, countryCode);
                } catch (error) {
                    return false;
                }
            },
            message: 'Invalid phone number format for this country'
        },
        required: [true, 'Contact phone is required'],
    },

    contactPerson: {
        type: String,
        trim: true,
    },

    // Billing Info
    billingContactName: {
        type: String,
        required: true,
        trim: true,
    },
    billingEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    // Address
    address: {
        type: addressSchema,
        default: () => ({})
    },

    // Subscription Details
    subscriptionPlan: {
        type: String,
        enum: COMPANY_CONSTANTS.SUBSCRIPTION_PLANS,
        default: 'Trial'
    },

    subscriptionStatus: {
        type: String,
        enum: COMPANY_CONSTANTS.SUBSCRIPTION_STATUS,
        default: 'Active'
    },
    subscriptionStartDate: {
        type: Date,
        default: Date.now
    },
    subscriptionEndDate: {
        type: Date,
        validate: [
            {
                validator: function (v) {
                    return !v || v > this.subscriptionStartDate;
                },
                message: 'Subscription end date must be after start date'
            },
            {
                validator: function (v) {
                    if (!v) return true;
                    const minDuration = 24 * 60 * 60 * 1000; // 24 hours minimum
                    return v.getTime() - this.subscriptionStartDate.getTime() >= minDuration;
                },
                message: 'Subscription duration must be at least 24 hours'
            },
            {
                validator: function (v) {
                    if (!v) return true;
                    const maxDuration = 5 * 365 * 24 * 60 * 60 * 1000; // 5 years maximum
                    return v.getTime() - this.subscriptionStartDate.getTime() <= maxDuration;
                },
                message: 'Subscription duration cannot exceed 5 years'
            }
        ]
    },
    paymentStatus: {
        type: String,
        enum: COMPANY_CONSTANTS.PAYMENT_STATUS,
        default: 'Pending'
    },

    // Business Details
    timeZone: {
        type: String,
        enum: COMPANY_CONSTANTS.TIME_ZONES,
        default: 'IST'
    },

    // Contract Details
    contractSettings: {
        specialtyType: {
            type: [String],
            required: true
        },
        clientType: {
            type: [String],
            required: true,
        },
        contractType: {
            type: [String],
            required: true,
        },
        scopeFormatID: {
            type: [String],
            required: true
        },
    },

    companySize: {
        type: String,
        enum: COMPANY_CONSTANTS.COMPANY_SIZES,
        default: COMPANY_CONSTANTS.COMPANY_SIZES[0]
    },

    // Revenue Tracking
    revenueTracking: {
        type: revenueSchema,
        default: () => ({})
    },

    // Security Settings
    securitySettings: {
        workingIPs: [{ ip: String, label: String }],
        remoteWorkEnabled: { type: Boolean, default: true },
        maxLoginAttempts: { type: Number, default: 5 },
        sessionTimeout: { type: Number, default: 480 }, // minutes
        twoFactorEnabled: { type: Boolean, default: false }
    },

    // Integration Settings
    integrationSettings: {
        sftpEnabled: { type: Boolean, default: false },
        sftpCredentials: {
            host: String,
            username: String,
            port: { type: Number, default: 22 },
            keyPath: String
        },
        webhookUrl: String,
        apiRateLimit: { type: Number, default: 1000 }, // requests per hour
        allowedOrigins: [String]
    },

    // Api Info
    isActive: {
        type: Boolean,
        default: true,
    },
    apiKey: {
        type: String,
        immutable: true,    // Api key cannot be changed
        select: false,
        sparse: true,
    },
    apiKeyCreatedAt: {
        type: Date,
        select: false,
    },
    apiEnabled: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
companySchema.index({ contactEmail: 1 }, { unique: true });
companySchema.index({ subscriptionStatus: 1, isActive: 1 });
companySchema.index({
    'revenueTracking.monthlyRevenue.month': 1,
    'revenueTracking.monthlyRevenue.totalRevenue': -1
});
companySchema.index({
    subscriptionPlan: 1,
    subscriptionStatus: 1,
    subscriptionEndDate: 1
});

// Virtuals
companySchema.virtual('subscriptionDaysRemaining').get(function () {
    if (!this.subscriptionEndDate) return null;
    const timeLeft = this.subscriptionEndDate - new Date();

    return Math.ceil(timeLeft / 24 * 60 * 60 * 1000);
});

companySchema.virtual('isSubscriptionExpired').get(function () {
    if (!this.subscriptionEndDate) return false;
    return this.subscriptionEndDate < new Date();
});

companySchema.virtual('currentMonthRevenue').get(function () {
    const currentMonth = new Date().toISOString().substring(0, 7); // "2024-01"
    const monthData = this.revenueTracking?.monthlyRevenue?.find(m => m.month === currentMonth);
    return monthData ? monthData.totalRevenue : 0;
});

companySchema.virtual('revenueGrowthThisMonth').get(function () {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 7);

    const currentData = this.revenueTracking?.monthlyRevenue?.find(m => m.month === currentMonth);
    const lastData = this.revenueTracking?.monthlyRevenue?.find(m => m.month === lastMonth);

    if (!currentData || !lastData || lastData.totalRevenue === 0) return 0;

    return ((currentData.totalRevenue - lastData.totalRevenue) / lastData.totalRevenue) * 100;
});


// Instance Methods
companySchema.methods.generateApiKey = async function () {
    const prefix = this.subscriptionPlan === 'Trial' ? 'gms_trial_' : 'gms_live_';

    let unique = false;
    let newKey;

    while (!unique) {
        const key = crypto.randomBytes(24).toString('hex');
        newKey = `${prefix}${key}`;

        const existing = await this.constructor.findOne({ apiKey: newKey });
        if (!existing) unique = true;
    }

    this.apiKey = newKey;
    this.apiKeyCreatedAt = new Date();
    return this.apiKey;
};

companySchema.methods.rotateApiKey = async function () {
    const oldApiKey = this.apiKey;
    const newKey = await this.generateApiKey();
    console.log(`API key rotated for company ${this.companyId}`);
    return { oldApiKey, newKey };
};

companySchema.methods.revokeApiKey = function () {
    this.apiKey = null;
    this.apiEnabled = false;
    this.apiKeyCreatedAt = null;
};

companySchema.methods.updateMonthlyRevenue = function (month, revenueData) {
    const existingMonth = this.revenueTracking.monthlyRevenue.find(m => m.month === month);

    if (existingMonth) {
        Object.assign(existingMonth, revenueData);
    } else {
        this.revenueTracking.monthlyRevenue.push({
            month,
            ...revenueData
        });
    }

    this.revenueTracking.lastUpdated = new Date();
};

companySchema.methods.calculateMetrics = async function () {
    const totalEmployees = await Employee.countDocuments({ companyRef: this._id });
    const currentRevenue = this.currentMonthRevenue;

    if (totalEmployees > 0) {
        this.revenueTracking.performanceMetrics.revenuePerEmployee = currentRevenue / totalEmployees;
    }

    // Update client metrics
    this.revenueTracking.clientMetrics.averageRevenuePerClient =
        this.revenueTracking.clientMetrics.totalActiveClients > 0
            ? currentRevenue / this.revenueTracking.clientMetrics.totalActiveClients
            : 0;
};

// Static Methods
companySchema.statics.findByCompanyId = function (companyId) {
    return this.findOne({ companyId, isActive: true });
};

companySchema.statics.findByApiKey = function (apiKey) {
    return this.findOne({
        apiKey,
        apiEnabled: true,
        isActive: true,
        subscriptionStatus: { $in: ['Active'] }
    }).select('+apiKey');
};

companySchema.statics.getRevenueReport = function (companyId, startMonth, endMonth) {
    return this.findOne({ companyId })
        .select('revenueTracking.monthlyRevenue')
        .then(company => {
            if (!company) return null;

            return company.revenueTracking.monthlyRevenue.filter(m =>
                m.month >= startMonth && m.month <= endMonth
            );
        });
};

// Methods
companySchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.companyPassword) return false;
    return await bcrypt.compare(candidatePassword, this.companyPassword);
};

// Pre-save middleware
companySchema.pre('save', async function (next) {
    // Auto-populate billing email if not provided
    if (!this.billingEmail && this.contactEmail) {
        this.billingEmail = this.contactEmail;
    }

    // Auto-populate billing contact if not provided
    if (!this.billingContactName && this.contactPerson) {
        this.billingContactName = this.contactPerson;
    }

    // Generate API key if enabled but not present
    if (this.apiEnabled && !this.apiKey) {
        await this.generateApiKey();
    }

    if (this.isModified("companyPassword")) {
        const salt = await bcrypt.genSalt(12);
        this.companyPassword = await bcrypt.hash(this.companyPassword, salt);
    }

    // Initialize current year revenue tracking
    if (this.isNew || !this.revenueTracking.currentYear?.year) {
        this.revenueTracking.currentYear = {
            ...this.revenueTracking.currentYear,
            year: new Date().getFullYear()
        };
    }

    // Calculate metrics if revenue data exists
    if (this.isModified('revenueTracking.monthlyRevenue')) {
        this.calculateMetrics();
    }

    // Enhanced subscription validation
    if (this.isModified('subscriptionStatus') || this.isModified('subscriptionEndDate')) {
        // Auto-expire subscription if end date has passed
        if (this.subscriptionEndDate && this.subscriptionEndDate < new Date() &&
            this.subscriptionStatus === 'Active') {
            this.subscriptionStatus = 'Inactive';
        }

        // Validate subscription plan transitions
        if (this.isModified('subscriptionPlan')) {
            const validTransitions = {
                'Trial': ['Basic', 'Professional', 'Enterprise'],
                'Basic': ['Professional', 'Enterprise', 'Trial'],
                'Professional': ['Enterprise', 'Basic'],
                'Enterprise': ['Professional', 'Basic']
            };

            const currentPlan = this.subscriptionPlan;
            const previousPlan = this.isNew ? null : this.constructor.findById(this._id).subscriptionPlan;

            if (previousPlan && !validTransitions[previousPlan]?.includes(currentPlan)) {
                return next(new Error(`Invalid subscription plan transition from ${previousPlan} to ${currentPlan}`));
            }
        }
    }

    next();
});

// Error handling for duplicates
companySchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern.contactEmail) {
            next(new Error('Company with this email already exists'));
        } else if (error.keyPattern.companyId) {
            next(new Error('Company ID already exists'));
        } else {
            next(new Error('Duplicate entry found'));
        }
    } else {
        next(error);
    }
});

export const Company = mongoose.model("Company", companySchema, "companies");