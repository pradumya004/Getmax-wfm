// backend/src/models/sow.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const sowSchema = new mongoose.Schema({
    sowId: {
        type: String,
        unique: true,
        default: () => `SOW-${uuidv4().substring(0, 8).toUpperCase()}`,
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
    clientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Client company reference is required'],
        index: true
    },

    // ** SOW BASIC INFO **
    sowName: {
        type: String,
        required: [true, 'SOW name is required'],
        trim: true,
        maxlength: [100, 'SOW name cannot exceed 100 characters']
    },
    sowDescription: {
        type: String,
        trim: true,
        maxlength: [500, 'SOW description cannot exceed 500 characters']
    },
    
    // ** SERVICE CONFIGURATION **
    serviceDetails: {
        serviceType: {
            type: String,
            required: [true, 'Service type is required'],
            enum: [
                'AR Calling',
                'Medical Coding', 
                'Prior Authorization',
                'Eligibility Verification',
                'Charge Entry',
                'Payment Posting',
                'Denial Management',
                'Quality Assurance',
                'Custom Service'
            ],
            index: true
        },
        serviceSubType: {
            type: String,
            trim: true,
            maxlength: [50, 'Service sub-type cannot exceed 50 characters']
        },
        scopeFormatId: {
            type: String,
            enum: ['EMSMC', 'ClaimMD', 'Medisoft', 'Epic', 'Cerner', 'AllScripts', 'Other'],
            required: [true, 'Scope format ID is required for claim processing'],
            default: 'EMSMC'
        }
    },

    // ** CONTRACT & BILLING **
    contractDetails: {
        contractType: {
            type: String,
            required: [true, 'Contract type is required'],
            enum: ['End-to-End', 'Transactional', 'FTE', 'Hybrid'],
            default: 'Transactional'
        },
        billingModel: {
            type: String,
            required: [true, 'Billing model is required'],
            enum: ['Per Transaction', 'Monthly Fixed', 'Hourly', 'Performance Based'],
            default: 'Per Transaction'
        },
        ratePerTransaction: {
            type: Number,
            min: [0, 'Rate per transaction cannot be negative'],
            default: 0
        },
        monthlyFixedRate: {
            type: Number,
            min: [0, 'Monthly fixed rate cannot be negative'],
            default: 0
        },
        currency: {
            type: String,
            enum: ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AED'],
            default: 'USD'
        }
    },

    // ** PERFORMANCE TARGETS & SLA **
    performanceTargets: {
        dailyTargetPerEmp: {
            type: Number,
            required: [true, 'Daily target per employee is required'],
            min: [1, 'Daily target must be at least 1'],
            max: [500, 'Daily target cannot exceed 500']
        },
        qualityBenchmark: {
            type: Number,
            required: [true, 'Quality benchmark is required'],
            min: [80, 'Quality benchmark cannot be less than 80%'],
            max: [100, 'Quality benchmark cannot exceed 100%'],
            default: 95
        },
        slaConfig: {
            slaHours: {
                type: Number,
                required: [true, 'SLA hours is required'],
                min: [1, 'SLA cannot be less than 1 hour'],
                max: [168, 'SLA cannot exceed 168 hours (1 week)'],
                default: 48
            },
            triggerEvent: {
                type: String,
                enum: ['Import Date', 'Assign Date', 'First Status Update'],
                required: [true, 'SLA trigger event is required'],
                default: 'Assign Date'
            },
            warningThresholdPercent: {
                type: Number,
                min: [50, 'Warning threshold cannot be less than 50%'],
                max: [95, 'Warning threshold cannot exceed 95%'],
                default: 85
            },
            resetOnReassign: {
                type: Boolean,
                default: false
            }
        }
    },

    // ** VOLUME FORECASTING **
    volumeForecasting: {
        expectedDailyVolume: {
            type: Number,
            required: [true, 'Expected daily volume is required'],
            min: [1, 'Daily volume must be at least 1'],
            default: 100
        },
        expectedMonthlyVolume: {
            type: Number,
            default: function() {
                return this.volumeForecasting?.expectedDailyVolume * 22 || 2200; // 22 working days
            }
        },
        peakSeasonMultiplier: {
            type: Number,
            min: [1, 'Peak season multipliplier must be at least 1'],
            max: [3, 'Peak season multipliplier cannot exceed 3'],
            default: 1.2
        }
    },

    // ** RESOURCE PLANNING **
    resourcePlanning: {
        plannedHeadcount: {
            type: Number,
            required: [true, 'Planned headcount is required'],
            min: [1, 'Planned headcount must be at least 1'],
            max: [500, 'Planned headcount cannot exceed 500']
        },
        requiredRoleLevel: {
            type: Number,
            min: [1, 'Required role level must be at least 1'],
            max: [10, 'Required role level cannot exceed 10'],
            default: 3 // Corresponds to roles in Role model
        },
        requiredSkills: [{
            skill: {
                type: String,
                enum: [
                    "Medical Coding", "ICD-10", "CPT", "HCPCS", "Prior Auth", 
                    "AR Calling", "Denial Management", "Payment Posting", 
                    "Eligibility Verification", "Insurance Knowledge", "EMR Systems",
                    "Excel Advanced", "Data Entry", "Customer Service", "Healthcare RCM"
                ]
            },
            proficiencyLevel: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
                default: "Intermediate"
            }
        }],
        minExperienceYears: {
            type: Number,
            min: [0, 'Minimum experience cannot be negative'],
            max: [20, 'Minimum experience cannot exceed 20 years'],
            default: 1
        }
    },

    // ** WORK ALLOCATION CONFIGURATION **
    allocationConfig: {
        allocationMode: {
            type: String,
            enum: ['Round Robin', 'Capacity Based', 'Priority Based', 'Skill Based'],
            required: [true, 'Allocation mode is required'],
            default: 'Capacity Based'
        },
        priorityFormula: {
            agingWeight: {
                type: Number,
                min: [0, 'Aging weight cannot be negative'],
                max: [1, 'Aging weight cannot exceed 1'],
                default: 0.4
            },
            payerWeight: {
                type: Number,
                min: [0, 'Payer weight cannot be negative'],
                max: [1, 'Payer weight cannot exceed 1'],
                default: 0.3
            },
            denialWeight: {
                type: Number,
                min: [0, 'Denial weight cannot be negative'],
                max: [1, 'Denial weight cannot exceed 1'],
                default: 0.3
            }
        },
        floatingPoolConfig: {
            enabled: {
                type: Boolean,
                default: true
            },
            maxClaimsInPool: {
                type: Number,
                min: [1, 'Max claims in floating pool must be at least 1'],
                default: 50
            },
            autoReassignAfterHours: {
                type: Number,
                min: [1, 'Auto reassign time must be at least 1 hour'],
                default: 4
            }
        },
        maxClaimsPerEmp: {
            type: Number,
            min: [1, 'Max claims per employee must be at least 1'],
            max: [200, 'Max claims per employee cannot exceed 200'],
            default: 50
        }
    },

    // ** QA CONFIGURATION **
    qaConfig: {
        qaRequired: {
            type: Boolean,
            default: true
        },
        qaPercentage: {
            type: Number,
            min: [5, 'QA percentage cannot be less than 5%'],
            max: [100, 'QA percentage cannot exceed 100%'],
            default: 10 // 10% of completed claims go to QA
        },
        errorCategories: [{
            category: {
                type: String,
                enum: ['Clinical', 'Administrative', 'Technical', 'Compliance', 'Documentation'],
                required: true
            },
            weightage: {
                type: Number,
                min: [0, 'Error category weightage cannot be negative'],
                max: [100, 'Error category weightage cannot exceed 100'],
                default: 20
            }
        }],
        passingScore: {
            type: Number,
            min: [70, 'Passing score cannot be less than 70%'],
            max: [100, 'Passing score cannot exceed 100%'],
            default: 85
        }
    },

    // ** NOTES & TEMPLATES CONFIGURATION **
    notesConfig: {
        useStructuredNotes: {
            type: Boolean,
            default: true
        },
        requiredNoteCategories: [{
            categoryName: {
                type: String,
                required: true,
                trim: true
            },
            isRequired: {
                type: Boolean,
                default: true
            },
            fieldType: {
                type: String,
                enum: ['Text', 'Dropdown', 'Multi-select', 'Date', 'Number', 'Textarea'],
                default: 'Textarea'
            },
            options: [String] // For dropdown/multi-select
        }],
        notesMandatory: {
            type: Boolean,
            default: true
        }
    },

    // ** SOW STATUS & DATES **
    status: {
        sowStatus: {
            type: String,
            enum: ['Draft', 'Active', 'On Hold', 'Completed', 'Cancelled'],
            default: 'Draft',
            index: true
        },
        startDate: {
            type: Date,
            required: [true, 'SOW start date is required']
        },
        endDate: {
            type: Date,
            validate: {
                validator: function(v) {
                    return !v || v > this.status.startDate;
                },
                message: 'End date must be after start date'
            }
        },
        lastReviewDate: Date,
        nextReviewDate: Date
    },

    // ** ACTIVITY METRICS (Auto-calculated) **
    activityMetrics: {
        totalClaimsAssigned: {
            type: Number,
            default: 0,
            min: [0, 'Total claims assigned cannot be negative']
        },
        totalClaimsCompleted: {
            type: Number,
            default: 0,
            min: [0, 'Total claims completed cannot be negative']
        },
        averageCompletionTimeHours: {
            type: Number,
            default: 0,
            min: [0, 'Average completion time cannot be negative']
        },
        currentSlaComplianceRate: {
            type: Number,
            default: 0,
            min: [0, 'SLA compliance rate cannot be negative'],
            max: [100, 'SLA compliance rate cannot exceed 100']
        },
        currentQualityScoreAverage: {
            type: Number,
            default: 0,
            min: [0, 'Quality score average cannot be negative'],
            max: [100, 'Quality score average cannot exceed 100']
        },
        monthlyRevenueGenerated: {
            type: Number,
            default: 0,
            min: [0, 'Revenue generated cannot be negative']
        }
    },

    // ** SYSTEM INFO **
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
        autoAssignmentEnabled: {
            type: Boolean,
            default: true
        }
    },

    // ** AUDIT TRAIL **
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee', // Links to Employee who created this SOW
            required: [true, 'Created by reference is required']
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee' // Links to Employee who last modified
        },
        lastModifiedAt: Date,
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee' // Links to Employee who approved
        },
        approvedAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
sowSchema.index({ companyRef: 1, clientCompanyRef: 1 });
sowSchema.index({ 'serviceDetails.serviceType': 1, 'status.sowStatus': 1 });
sowSchema.index({ 'status.startDate': 1, 'status.endDate': 1 });
sowSchema.index({ 'systemInfo.isActive': 1, 'systemInfo.autoAssignmentEnabled': 1 });

// Compound index for assignment queries
sowSchema.index({ 
    companyRef: 1, 
    'serviceDetails.serviceType': 1, 
    'status.sowStatus': 1,
    'systemInfo.isActive': 1
});

// ** VIRTUAL FIELDS **
sowSchema.virtual('monthlyTargetVolume').get(function() {
    return this.volumeForecasting?.expectedDailyVolume * 22 || 0;
});

sowSchema.virtual('isExpiringSoon').get(function() {
    if (!this.status.endDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.status.endDate <= thirtyDaysFromNow;
});

sowSchema.virtual('currentCapacityUtilization').get(function() {
    if (this.volumeForecasting?.expectedDailyVolume === 0) return 0;
    return Math.round((this.activityMetrics.totalClaimsAssigned / this.volumeForecasting.expectedDailyVolume) * 100);
});

sowSchema.virtual('assignedEmployeesCount', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'sowAssignments.sowRef',
    count: true,
    match: { 'sowAssignments.isActive': true }
});

// ** STATIC METHODS **
sowSchema.statics.findActiveSOWsByCompany = function(companyRef) {
    return this.find({
        companyRef,
        'status.sowStatus': 'Active',
        'systemInfo.isActive': true
    }).populate('clientCompanyRef', 'companyName companyType')
      .populate('auditInfo.createdBy', 'personalInfo.firstName personalInfo.lastName');
};

sowSchema.statics.findSOWsByServiceType = function(companyRef, serviceType) {
    return this.find({
        companyRef,
        'serviceDetails.serviceType': serviceType,
        'systemInfo.isActive': true
    });
};

sowSchema.statics.findSOWsNeedingAttention = function(companyRef) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        $or: [
            { 'status.endDate': { $lte: thirtyDaysFromNow } }, // Expiring soon
            { 'activityMetrics.currentSlaComplianceRate': { $lt: 85 } }, // Poor SLA
            { 'activityMetrics.currentQualityScoreAverage': { $lt: 90 } } // Poor quality
        ]
    });
};

// ** INSTANCE METHODS **
sowSchema.methods.updateActivityMetrics = function(claimsData) {
    if (claimsData.totalAssigned) this.activityMetrics.totalClaimsAssigned += claimsData.totalAssigned;
    if (claimsData.totalCompleted) this.activityMetrics.totalClaimsCompleted += claimsData.totalCompleted;
    if (claimsData.avgCompletionTime) this.activityMetrics.averageCompletionTimeHours = claimsData.avgCompletionTime;
    if (claimsData.slaCompliance) this.activityMetrics.currentSlaComplianceRate = claimsData.slaCompliance;
    if (claimsData.qualityScore) this.activityMetrics.currentQualityScoreAverage = claimsData.qualityScore;
    
    // Calculate revenue based on billing model
    if (this.contractDetails.billingModel === 'Per Transaction' && claimsData.totalCompleted) {
        const revenue = claimsData.totalCompleted * this.contractDetails.ratePerTransaction;
        this.activityMetrics.monthlyRevenueGenerated += revenue;
    }
};

sowSchema.methods.canEmployeeBeAssigned = function(employee) {
    // Check if employee's role level meets requirement
    if (employee.roleRef.roleLevel < this.resourcePlanning.requiredRoleLevel) {
        return { canAssign: false, reason: 'Insufficient role level' };
    }
    
    // Check if employee has required skills
    const empSkills = employee.skillsAndQualifications.technicalSkills.map(s => s.skill);
    const reqSkills = this.resourcePlanning.requiredSkills.map(s => s.skill);
    const hasRequiredSkills = reqSkills.every(skill => empSkills.includes(skill));
    
    if (!hasRequiredSkills) {
        return { canAssign: false, reason: 'Missing required skills' };
    }
    
    return { canAssign: true, reason: 'Eligible for assignment' };
};

// ** PRE-SAVE MIDDLEWARE **
sowSchema.pre('save', function(next) {
    // Auto-calculate monthly volume if not set
    if (this.volumeForecasting && !this.volumeForecasting.expectedMonthlyVolume) {
        this.volumeForecasting.expectedMonthlyVolume = this.volumeForecasting.expectedDailyVolume * 22;
    }
    
    // Validate priority weights sum to 1
    const { agingWeight, payerWeight, denialWeight } = this.allocationConfig.priorityFormula;
    const totalWeight = agingWeight + payerWeight + denialWeight;
    if (Math.abs(totalWeight - 1) > 0.01) {
        return next(new Error('Priority weights must sum to 1.0'));
    }
    
    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }
    
    next();
});

// ** POST-SAVE MIDDLEWARE **
sowSchema.post('save', function(doc, next) {
    // Update company's SOW count or other aggregations if needed
    next();
});

export const SOW = mongoose.model('SOW', sowSchema, 'sows');