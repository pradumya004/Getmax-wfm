// backend/src/models/company.model.js

import mongoose from "mongoose";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { validate as validatePostalCode } from 'postal-codes-js';
import bcrypt from 'bcryptjs';

// Address Schema
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

// Revenue Tracking Schema
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
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    companyPassword: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
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
        enum: ['Trial', 'Basic', 'Professional', 'Enterprise'],
        default: 'Trial'
    },

    subscriptionStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Inactive', 'Terminated'],
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
                return !v || v > this.subscriptionStartDate;
            },
            message: 'Subscription end date must be after start date'
        }
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue', 'Failed'],
        default: 'Pending'
    },

    // Business Details
    timeZone: {
        type: String,
        enum: ['IST', 'EST', 'CST', 'MST', 'PST', 'GMT'],
        default: 'IST'
    },

    // Contract Details
    contractSettings: {
        specialtyType: {
            type: [String],
            // enum: ["Primary Care", "Specialty Care", "Dental", "Vision", "Mental Health", "Surgery Centers", "Hospitals", "Labs", "Multi Specialty", "DME"],
            // default: ["Primary Care"]
        },
        clientType: {
            type: [String],
            // enum: ['Billing Company', 'Provider', 'Others'],
            required: true,
            // default: 'Provider'
        },
        contractType: {
            type: [String],
            // enum: ['End to End', 'Transactional', 'FTE', 'Hybrid', 'Consulting'],
            required: true,
            // validate: {
            //     validator: function (v) {
            //         return v !== 'Select Contract Type';
            //     },
            //     message: 'Please select a valid contract type'
            // }
        },
        scopeFormatID: {
            type: [String],
            // enum: ['ClaimMD', 'Medisoft', 'Custom'],
            default: 'ClaimMD'
        },
    },

    companySize: {
        type: String,
        enum: ['1-10', '10-50', '50-200', '200-500', '500+'],
        default: '1-10'
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
// companySchema.index({ companyId: 1 }, { unique: true });
companySchema.index({ contactEmail: 1 }, { unique: true });
// companySchema.index({ apiKey: 1 }, { unique: true });
companySchema.index({ subscriptionStatus: 1, isActive: 1 });

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
    const existingMonth = this.revenueInfo.monthlyRevenue.find(m => m.month === month);

    if (existingMonth) {
        Object.assign(existingMonth, revenueData);
    } else {
        this.revenueInfo.monthlyRevenue.push({
            month,
            ...revenueData
        });
    }

    this.revenueInfo.lastUpdated = new Date();
};

companySchema.methods.calculateMetrics = function () {
    const totalEmployees = this.employeeCount || 0;
    const currentRevenue = this.currentMonthRevenue;

    if (totalEmployees > 0) {
        this.revenueInfo.performanceMetrics.revenuePerEmployee = currentRevenue / totalEmployees;
    }

    // Update client metrics
    this.revenueInfo.clientMetrics.averageRevenuePerClient =
        this.revenueInfo.clientMetrics.totalActiveClients > 0
            ? currentRevenue / this.revenueInfo.clientMetrics.totalActiveClients
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
        .select('revenueInfo.monthlyRevenue')
        .then(company => {
            if (!company) return null;

            return company.revenueInfo.monthlyRevenue.filter(m =>
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
    if (this.isModified('revenueInfo.monthlyRevenue')) {
        this.calculateMetrics();
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