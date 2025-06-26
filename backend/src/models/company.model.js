import mongoose from "mongoose";
// import bcrypt from "bcrypt";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { validate as validatePostalCode } from 'postal-codes-js';

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
                const country = this.parent()?.address?.country || 'IN';
                return validatePostalCode(country, v);
            },
            message: 'Invalid postal code format for this country'
        }
    },
    country: {
        type: String,
        trim: true,
        default: 'India'
    },
}, { _id: false });

// Business Schema
// const businessSchema = new mongoose.Schema({
//     startTime: {
//         type: String,
//         default: '09:00',
//         match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format (e.g. - 09:00, 21:05, etc.)']
//     },
//     endTime: {
//         type: String,
//         default: '17:00',
//         match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format (e.g. - 09:00, 21:05, etc.)']
//     },
//     workingDays: {
//         type: [String],
//         enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//         default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
//     }
// }, { _id: false });

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
        // required: true,
        trim: true,
        // match: [/^\d{2}-\d{7}$/, 'Tax ID must be in format XX-XXXXXXX (e.g., 12-3456789)']
    },
    website: {
        type: String,
        trim: true,
        lowercase: true,
        // match: [/^https?:\/\/.+\..+/, 'Website must be a valid URL (e.g., https://example.com)']
    },

    // Contact Info - Company Contact, Not Owner
    contactEmail: {
        type: String,
        required: [true, 'Contact email is required'],
        // unique: true,
        trim: true,
        lowercase: true,
    },
    // ownerPassword: {
    //     type: String,
    //     required: true,
    //     trim: true,
    // },
    contactPhone: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                try {
                    const country = this.address?.country || 'India';
                    const countryCode = country === 'India' ? 'IN' : 'IN';
                    return isValidPhoneNumber(v, countryCode);
                } catch (error) {
                    return false;
                }
            },
            message: 'Invalid phone number format for this country'
        },
        required: true,
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
        // unique: true,
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
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue', 'Failed'],
        default: 'Pending'
    },

    // Business Details
    timeZone: {
        type: String,
        enum: ['IST', 'MST', 'GMT', 'CST'],
        default: 'IST'
    },
    // businessHours: {
    //     type: businessSchema,
    //     default: () => ({})
    // },

    // Contract Details
    contractSettings: {
        specialtyType: {
            type: [String],
            enum: ["Primary Care", "Specialty Care", "Dental", "Vision", "Mental Health", "Surgery Centers", "Hospitals", "Labs", "Multi Specialty", "DME"],
            default: ["Primary Care"]
        },
        clientType: {
            type: String,
            enum: ['Billing Company', 'Provider', 'Others'],
            required: true,
            default: 'Provider'
        },
        contractType: {
            type: String,
            enum: ['End to End', 'Transactional', 'FTE', 'Hybrid', 'Consulting'],
            required: true,
            default: 'Select Contract Type'
        },
        scopeFormatID: {
            type: String,
            enum: ['ClaimMD', 'Medisoft', 'Custom'],
            default: 'ClaimMD'
        },
    },

    companySize: {
        type: String,
        enum: ['1-10', '10-50', '50-200', '200-500', '500+'],
        default: '1-10'
    },

    // Api Info
    isActive: {
        type: Boolean,
        default: true,
    },
    sftpEnabled: {
        type: Boolean,
        default: false
    },
    apiKey: {
        type: String,
        immutable: true,    // Api key cannot be changed
        select: false
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
companySchema.index({ companyId: 1 }, { unique: true });
companySchema.index({ contactEmail: 1 });

// Virtuals
companySchema.virtual('subscriptionDaysRemaining').get(function () {
    if (!this.subscriptionEndDate) return null;
    const timeLeft = this.subscriptionEndDate - new Date();

    return Math.ceil(timeLeft / 24 * 60 * 60 * 1000);
});

companySchema.virtual('isSubscriptionExpired').get(function () {
    if (!this.subscriptionEndDate) return false;
    return this.subscriptionEndDate > new Date();
});

// Instance Methods
companySchema.methods.generateApiKey = async function () {
    const prefix = this.subscriptionPlan === 'Trial' ? 'gms_trial_' : 'gms_live_';

    let unique = false;
    let newKey;

    while (!unique) {
        const key = crypto.randomBytes(24).toString('hex');
        newKey = `${prefix}${key}`;

        const existing = await mongoose.models.companies.findOne({ apiKey: newKey });
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

// Static Methods
companySchema.statics.findByCompanyId = function (companyId) {
    return this.findOne({ companyId, isActive: true });
};

companySchema.statics.findByApiKey = function (apiKey) {
    return this.findOne({
        apiKey,
        apiEnabled: true,
        isActive: true,
        subscriptionStatus: { $in: ['Active', 'Trial'] }
    }).select('+apiKey');
};

companySchema.pre('save', async function (next) {
    if (!this.billingEmail && this.contactEmail) {
        this.billingEmail = this.contactEmail;
    }

    if (this.apiEnabled && !this.apiKey) {
        await this.generateApiKey();
    }

    next();
});

// Error handling for duplicates
companySchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Company with this email exists'));
    } else {
        next(error);
    }
});

const Company = mongoose.model("companies", companySchema);

export default Company;
