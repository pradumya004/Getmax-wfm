// backend/src/models/payer.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const payerSchema = new mongoose.Schema({
    payerId: {
        type: String,
        unique: true,
        default: () => `PAY-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },
    
    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // GetMax company managing this payer
        required: [true, 'Company reference is required'],
        index: true
    },

    // ** PAYER BASIC INFORMATION **
    payerInfo: {
        payerName: {
            type: String,
            required: [true, 'Payer name is required'],
            trim: true,
            maxlength: [100, 'Payer name cannot exceed 100 characters'],
            index: true
        },
        payerType: {
            type: String,
            enum: [
                'Commercial Insurance',
                'Medicare',
                'Medicaid', 
                'Medicare Advantage',
                'Medicaid Managed Care',
                'Workers Compensation',
                'Auto Insurance',
                'Liability Insurance',
                'Self Pay',
                'Government',
                'Other'
            ],
            required: [true, 'Payer type is required'],
            index: true
        },
        payerCategory: {
            type: String,
            enum: ['Primary', 'Secondary', 'Tertiary', 'Government', 'Commercial', 'Self Pay'],
            required: [true, 'Payer category is required'],
            default: 'Commercial'
        },
        legalName: {
            type: String,
            trim: true,
            maxlength: [150, 'Legal name cannot exceed 150 characters']
        },
        doingBusinessAs: [String], // DBA names/aliases
        federalTaxId: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return !v || /^\d{2}-\d{7}$/.test(v);
                },
                message: 'Federal Tax ID must be in XX-XXXXXXX format'
            }
        },
        naic: {
            type: String, // National Association of Insurance Commissioners code
            trim: true,
            validate: {
                validator: function(v) {
                    return !v || /^\d{5}$/.test(v);
                },
                message: 'NAIC code must be 5 digits'
            }
        }
    },

    // ** CONTACT INFORMATION **
    contactInfo: {
        primaryContact: {
            name: String,
            title: String,
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
            phone: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
                    },
                    message: 'Invalid phone number format'
                }
            },
            fax: String
        },
        customerService: {
            phone: {
                type: String,
                trim: true
            },
            hours: {
                type: String,
                default: 'Monday-Friday 8AM-5PM'
            },
            email: String,
            website: String
        },
        providerServices: {
            phone: String,
            email: String,
            website: String,
            portalUrl: String
        },
        claimsSubmission: {
            phone: String,
            email: String,
            fax: String,
            mailingAddress: {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: {
                    type: String,
                    default: 'United States'
                }
            }
        }
    },

    // ** BUSINESS ADDRESS **
    addressInfo: {
        corporateHeadquarters: {
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
                        return !v || /^\d{5}(-\d{4})?$/.test(v);
                    },
                    message: 'Invalid ZIP code format'
                }
            },
            country: {
                type: String,
                default: 'United States'
            }
        },
        regionalOffices: [{
            officeName: String,
            region: String,
            address: {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: String
            },
            servicesOffered: [String]
        }]
    },

    // ** PAYER IDENTIFIERS & CODES **
    identifiers: {
        payerIdNumber: {
            type: String,
            unique: true,
            trim: true,
            index: true
        },
        clearinghouseIds: [{
            clearinghouseName: {
                type: String,
                enum: [
                    'Availity', 'Change Healthcare', 'RelayHealth', 'Trizetto',
                    'Office Ally', 'Navicure', 'athenaCollector', 'NextGen',
                    'AllMeds', 'ClaimMD', 'Other'
                ],
                required: true
            },
            payerId: {
                type: String,
                required: true,
                trim: true
            },
            isActive: {
                type: Boolean,
                default: true
            }
        }],
        x12PayerId: {
            type: String,
            trim: true,
            index: true
        },
        medicareContractNumber: {
            type: String,
            trim: true
        },
        medicaidPlanId: {
            type: String,
            trim: true
        }
    },

    // ** COVERAGE & PLANS **
    coverageInfo: {
        linesOfBusiness: [{
            type: String,
            enum: [
                'Individual Health',
                'Group Health', 
                'Medicare Supplement',
                'Medicare Advantage',
                'Medicaid',
                'Dental',
                'Vision',
                'Life Insurance',
                'Disability',
                'Workers Compensation',
                'Auto Insurance',
                'Property & Casualty'
            ]
        }],
        marketSegments: [{
            type: String,
            enum: ['Individual', 'Small Group', 'Large Group', 'Government', 'Medicare', 'Medicaid']
        }],
        serviceAreas: [{
            state: {
                type: String,
                required: true
            },
            counties: [String],
            zipCodes: [String],
            isStatewide: {
                type: Boolean,
                default: false
            }
        }],
        planTypes: [{
            planType: {
                type: String,
                enum: ['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'Indemnity', 'Other'],
                required: true
            },
            description: String,
            isActive: {
                type: Boolean,
                default: true
            }
        }]
    },

    // ** CLAIMS PROCESSING INFORMATION **
    claimsProcessing: {
        claimsAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        electronicSubmission: {
            isSupported: {
                type: Boolean,
                default: true
            },
            clearinghouses: [String],
            directConnect: {
                isAvailable: {
                    type: Boolean,
                    default: false
                },
                endpoint: String,
                apiVersion: String
            }
        },
        claimsTimelines: {
            initialClaimProcessing: {
                type: Number, // in days
                default: 30,
                min: [1, 'Initial claim processing must be at least 1 day']
            },
            cleanClaimPayment: {
                type: Number, // in days
                default: 14,
                min: [1, 'Clean claim payment must be at least 1 day']
            },
            appealProcessing: {
                type: Number, // in days
                default: 60,
                min: [1, 'Appeal processing must be at least 1 day']
            }
        },
        priorAuthRequired: {
            type: Boolean,
            default: false
        },
        priorAuthTimeline: {
            type: Number, // in days
            default: 14
        }
    },

    // ** PAYMENT INFORMATION **
    paymentInfo: {
        paymentMethods: [{
            type: String,
            enum: ['ACH', 'Check', 'Wire Transfer', 'Virtual Card', 'EFT'],
            default: 'ACH'
        }],
        eraSupported: {
            type: Boolean,
            default: true
        },
        eobDelivery: {
            type: String,
            enum: ['Electronic', 'Paper', 'Both'],
            default: 'Electronic'
        },
        paymentCycles: [{
            cycle: {
                type: String,
                enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Bi-monthly'],
                required: true
            },
            dayOfWeek: String, // For weekly payments
            dayOfMonth: Number, // For monthly payments
            description: String
        }],
        averagePaymentTime: {
            type: Number, // in days
            default: 30,
            min: [1, 'Average payment time must be at least 1 day']
        }
    },

    // ** PERFORMANCE METRICS **
    performanceMetrics: {
        priorityScore: {
            type: Number,
            min: [1, 'Priority score must be at least 1'],
            max: [10, 'Priority score cannot exceed 10'],
            default: 5,
            index: true
        },
        paymentRating: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Unknown'],
            default: 'Unknown'
        },
        avgDaysToPayment: {
            type: Number,
            default: 0,
            min: [0, 'Average days to payment cannot be negative']
        },
        denialRate: {
            type: Number,
            min: [0, 'Denial rate cannot be negative'],
            max: [100, 'Denial rate cannot exceed 100%'],
            default: 0
        },
        appealSuccessRate: {
            type: Number,
            min: [0, 'Appeal success rate cannot be negative'],
            max: [100, 'Appeal success rate cannot exceed 100%'],
            default: 0
        },
        totalClaimsProcessed: {
            type: Number,
            default: 0,
            min: [0, 'Total claims processed cannot be negative']
        },
        totalAmountPaid: {
            type: Number,
            default: 0,
            min: [0, 'Total amount paid cannot be negative']
        },
        lastPerformanceUpdate: {
            type: Date,
            default: Date.now
        }
    },

    // ** CONTRACTS & AGREEMENTS **
    contractInfo: {
        hasContract: {
            type: Boolean,
            default: false
        },
        contractEffectiveDate: Date,
        contractExpirationDate: Date,
        contractType: {
            type: String,
            enum: ['In-Network', 'Out-of-Network', 'Partial Network', 'No Contract'],
            default: 'No Contract'
        },
        feeSchedule: {
            type: String,
            enum: ['Medicare', 'Medicaid', 'Contracted Rates', 'Usual & Customary', 'Other'],
            default: 'Usual & Customary'
        },
        paymentTerms: {
            type: String,
            enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Net 90'],
            default: 'Net 30'
        },
        contractNotes: {
            type: String,
            trim: true
        }
    },

    // ** SPECIALTIES & COVERAGE RULES **
    coverageRules: {
        coveredSpecialties: [{
            specialtyCode: String,
            specialtyName: String,
            requiresPriorAuth: {
                type: Boolean,
                default: false
            },
            reimbursementRate: Number,
            notes: String
        }],
        excludedServices: [{
            serviceCode: String,
            serviceName: String,
            exclusionReason: String,
            effectiveDate: Date
        }],
        specialRequirements: [{
            requirement: String,
            applicableServices: [String],
            description: String
        }]
    },

    // ** ACTIVITY TRACKING **
    activityMetrics: {
        lastClaimDate: {
            type: Date,
            index: true
        },
        lastPaymentDate: {
            type: Date,
            index: true
        },
        monthlyClaimVolume: {
            type: Number,
            default: 0,
            min: [0, 'Monthly claim volume cannot be negative']
        },
        monthlyPaymentVolume: {
            type: Number,
            default: 0,
            min: [0, 'Monthly payment volume cannot be negative']
        },
        yearToDateStats: {
            claimsSubmitted: {
                type: Number,
                default: 0
            },
            claimsPaid: {
                type: Number,
                default: 0
            },
            claimsDenied: {
                type: Number,
                default: 0
            },
            totalAmountSubmitted: {
                type: Number,
                default: 0
            },
            totalAmountPaid: {
                type: Number,
                default: 0
            },
            totalAmountDenied: {
                type: Number,
                default: 0
            }
        }
    },

    // ** SYSTEM CONFIGURATION **
    systemConfig: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isPreferred: {
            type: Boolean,
            default: false,
            index: true
        },
        riskLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Do Not Use'],
            default: 'Medium',
            index: true
        },
        internalNotes: {
            type: String,
            trim: true
        },
        tags: [String], // For categorization and filtering
        lastVerified: {
            type: Date,
            index: true
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        dataSource: {
            type: String,
            enum: ['Manual Entry', 'NPPES Import', 'Payer Portal', 'API Sync', 'Other'],
            default: 'Manual Entry'
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
        lastReviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastReviewedAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
payerSchema.index({ companyRef: 1, 'payerInfo.payerType': 1 });
payerSchema.index({ 'payerInfo.payerName': 'text' });
payerSchema.index({ 'identifiers.payerIdNumber': 1 });
payerSchema.index({ 'identifiers.x12PayerId': 1 });
payerSchema.index({ 'performanceMetrics.priorityScore': -1 });
payerSchema.index({ 'systemConfig.isActive': 1, 'systemConfig.isPreferred': 1 });

// Compound indexes
payerSchema.index({
    companyRef: 1,
    'payerInfo.payerType': 1,
    'systemConfig.isActive': 1
});

payerSchema.index({
    'coverageInfo.serviceAreas.state': 1,
    'systemConfig.isActive': 1
});

// ** VIRTUAL FIELDS **
payerSchema.virtual('totalActivePlans').get(function() {
    return this.coverageInfo.planTypes.filter(plan => plan.isActive).length;
});

payerSchema.virtual('totalServiceStates').get(function() {
    return this.coverageInfo.serviceAreas.length;
});

payerSchema.virtual('isContractCurrent').get(function() {
    if (!this.contractInfo.hasContract || !this.contractInfo.contractExpirationDate) {
        return false;
    }
    return this.contractInfo.contractExpirationDate > new Date();
});

payerSchema.virtual('paymentScore').get(function() {
    // Calculate payment score based on metrics
    let score = 5; // Base score
    
    if (this.performanceMetrics.avgDaysToPayment <= 15) score += 2;
    else if (this.performanceMetrics.avgDaysToPayment <= 30) score += 1;
    else if (this.performanceMetrics.avgDaysToPayment > 60) score -= 2;
    
    if (this.performanceMetrics.denialRate <= 5) score += 1;
    else if (this.performanceMetrics.denialRate > 20) score -= 2;
    
    if (this.performanceMetrics.appealSuccessRate >= 80) score += 1;
    
    return Math.max(1, Math.min(10, score));
});

payerSchema.virtual('totalActivePatients', {
    ref: 'Patient',
    localField: '_id',
    foreignField: 'insuranceInfo.primaryInsurance.payerRef',
    count: true,
    match: { 
        'insuranceInfo.primaryInsurance.isActive': true,
        'activityInfo.patientStatus': 'Active',
        'systemInfo.isActive': true 
    }
});

// ** STATIC METHODS **
payerSchema.statics.findByPayerType = function(companyRef, payerType) {
    return this.find({
        companyRef,
        'payerInfo.payerType': payerType,
        'systemConfig.isActive': true
    }).sort({ 'performanceMetrics.priorityScore': -1 });
};

payerSchema.statics.findByState = function(companyRef, state) {
    return this.find({
        companyRef,
        'coverageInfo.serviceAreas.state': state,
        'systemConfig.isActive': true
    });
};

payerSchema.statics.findPreferredPayers = function(companyRef) {
    return this.find({
        companyRef,
        'systemConfig.isPreferred': true,
        'systemConfig.isActive': true
    }).sort({ 'performanceMetrics.priorityScore': -1 });
};

payerSchema.statics.findHighPerformancePayers = function(companyRef, minScore = 7) {
    return this.find({
        companyRef,
        'performanceMetrics.priorityScore': { $gte: minScore },
        'systemConfig.isActive': true
    });
};

payerSchema.statics.findPayersNeedingReview = function(companyRef, daysSinceLastReview = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastReview);
    
    return this.find({
        companyRef,
        $or: [
            { 'systemConfig.lastVerified': { $lt: cutoffDate } },
            { 'systemConfig.lastVerified': null },
            { 'contractInfo.contractExpirationDate': { $lt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) } } // Expiring in 90 days
        ],
        'systemConfig.isActive': true
    });
};

payerSchema.statics.findByClearinghouse = function(companyRef, clearinghouseName, payerId) {
    return this.findOne({
        companyRef,
        'identifiers.clearinghouseIds': {
            $elemMatch: {
                clearinghouseName: clearinghouseName,
                payerId: payerId,
                isActive: true
            }
        },
        'systemConfig.isActive': true
    });
};

// ** INSTANCE METHODS **
payerSchema.methods.updatePerformanceMetrics = function(metricsData) {
    if (metricsData.avgDaysToPayment !== undefined) {
        this.performanceMetrics.avgDaysToPayment = metricsData.avgDaysToPayment;
    }
    if (metricsData.denialRate !== undefined) {
        this.performanceMetrics.denialRate = metricsData.denialRate;
    }
    if (metricsData.appealSuccessRate !== undefined) {
        this.performanceMetrics.appealSuccessRate = metricsData.appealSuccessRate;
    }
    if (metricsData.totalClaimsProcessed !== undefined) {
        this.performanceMetrics.totalClaimsProcessed = metricsData.totalClaimsProcessed;
    }
    if (metricsData.totalAmountPaid !== undefined) {
        this.performanceMetrics.totalAmountPaid = metricsData.totalAmountPaid;
    }
    
    // Recalculate priority score based on performance
    this.calculatePriorityScore();
    
    this.performanceMetrics.lastPerformanceUpdate = new Date();
    this.activityMetrics.lastPaymentDate = new Date();
};

payerSchema.methods.calculatePriorityScore = function() {
    let score = 5; // Base score
    
    // Payment speed (40% weight)
    if (this.performanceMetrics.avgDaysToPayment <= 15) score += 2;
    else if (this.performanceMetrics.avgDaysToPayment <= 30) score += 1;
    else if (this.performanceMetrics.avgDaysToPayment > 45) score -= 1;
    else if (this.performanceMetrics.avgDaysToPayment > 60) score -= 2;
    
    // Denial rate (30% weight)
    if (this.performanceMetrics.denialRate <= 5) score += 1.5;
    else if (this.performanceMetrics.denialRate <= 10) score += 0.5;
    else if (this.performanceMetrics.denialRate > 20) score -= 1.5;
    
    // Appeal success rate (20% weight)
    if (this.performanceMetrics.appealSuccessRate >= 80) score += 1;
    else if (this.performanceMetrics.appealSuccessRate >= 60) score += 0.5;
    else if (this.performanceMetrics.appealSuccessRate < 40) score -= 1;
    
    // Contract status (10% weight)
    if (this.contractInfo.contractType === 'In-Network') score += 0.5;
    else if (this.contractInfo.contractType === 'Out-of-Network') score -= 0.5;
    
    // Ensure score is within valid range
    this.performanceMetrics.priorityScore = Math.max(1, Math.min(10, Math.round(score * 10) / 10));
    
    return this.performanceMetrics.priorityScore;
};

payerSchema.methods.addClearinghouseId = function(clearinghouseName, payerId) {
    const existingId = this.identifiers.clearinghouseIds.find(
        id => id.clearinghouseName === clearinghouseName
    );
    
    if (existingId) {
        existingId.payerId = payerId;
        existingId.isActive = true;
    } else {
        this.identifiers.clearinghouseIds.push({
            clearinghouseName,
            payerId,
            isActive: true
        });
    }
};

payerSchema.methods.addServiceArea = function(state, counties = [], zipCodes = [], isStatewide = false) {
    const existingArea = this.coverageInfo.serviceAreas.find(area => area.state === state);
    
    if (existingArea) {
        existingArea.counties = [...new Set([...existingArea.counties, ...counties])];
        existingArea.zipCodes = [...new Set([...existingArea.zipCodes, ...zipCodes])];
        existingArea.isStatewide = isStatewide || existingArea.isStatewide;
    } else {
        this.coverageInfo.serviceAreas.push({
            state,
            counties,
            zipCodes,
            isStatewide
        });
    }
};

payerSchema.methods.isEligibleForServices = function(state, zipCode = null) {
    const serviceArea = this.coverageInfo.serviceAreas.find(area => area.state === state);
    
    if (!serviceArea) return false;
    if (serviceArea.isStatewide) return true;
    if (zipCode && serviceArea.zipCodes.includes(zipCode)) return true;
    
    return false;
};

// ** PRE-SAVE MIDDLEWARE **
payerSchema.pre('save', function(next) {
    // Calculate priority score if performance metrics changed
    if (this.isModified('performanceMetrics')) {
        this.calculatePriorityScore();
    }
    
    // Update YTD stats if activity metrics changed
    if (this.isModified('activityMetrics')) {
        // This would typically be done by a background job
        // that processes actual claim data
    }
    
    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }
    
    next();
});

// ** POST-SAVE MIDDLEWARE **
payerSchema.post('save', function(doc, next) {
    // Could trigger cache updates, notifications, etc.
    next();
});

export const Payer = mongoose.model('Payer', payerSchema, 'payers');