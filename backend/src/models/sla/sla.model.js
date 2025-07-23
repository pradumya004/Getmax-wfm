// backend/src/models/sla/sla.model.js

import mongoose from 'mongoose';
// import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SLA_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

const slaSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    slaId: {
        type: String,
        unique: true,
        // default: () => `SLA-${uuidv4().substring(0, 8).toUpperCase()}`,
        immutable: true,
        index: true
    },

    // ** CORE RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Created by employee is required']
    },

    // ** SLA TEMPLATE INFORMATION **
    templateInfo: {
        templateName: {
            type: String,
            required: [true, 'Template name is required'],
            trim: true,
            maxlength: [100, 'Template name cannot exceed 100 characters']
        },
        templateType: {
            type: String,
            required: [true, 'Template type is required'],
            enum: {
                values: ['SERVICE_LEVEL', 'RESPONSE_TIME', 'RESOLUTION_TIME', 'QUALITY_TARGET', 'AVAILABILITY'],
                message: 'Invalid template type'
            },
            index: true
        },
        serviceType: {
            type: String,
            required: [true, 'Service type is required'],
            enum: {
                values: [
                    'AR_CALLING', 'MEDICAL_CODING', 'PRIOR_AUTH', 'DENIAL_MANAGEMENT',
                    'PATIENT_REGISTRATION', 'INSURANCE_VERIFICATION', 'PAYMENT_POSTING',
                    'CLAIMS_PROCESSING', 'CLEARINGHOUSE_SUBMISSION', 'QA_REVIEW',
                    'CALL_HANDLING', 'DOCUMENT_PROCESSING'
                ],
                message: 'Invalid service type'
            },
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        version: {
            type: String,
            default: '1.0.0'
        }
    },

    // ** SLA TARGETS & THRESHOLDS **
    slaTargets: {
        primaryTarget: {
            targetName: {
                type: String,
                required: [true, 'Primary target name is required'],
                trim: true
            },
            targetValue: {
                type: Number,
                required: [true, 'Primary target value is required'],
                min: [0, 'Target value cannot be negative']
            },
            targetUnit: {
                type: String,
                required: [true, 'Target unit is required'],
                enum: {
                    values: ['HOURS', 'MINUTES', 'DAYS', 'PERCENTAGE', 'COUNT', 'CALLS_PER_HOUR', 'ACCURACY_RATE'],
                    message: 'Invalid target unit'
                }
            },
            targetOperator: {
                type: String,
                required: [true, 'Target operator is required'],
                enum: {
                    values: ['LESS_THAN', 'LESS_THAN_EQUAL', 'GREATER_THAN', 'GREATER_THAN_EQUAL', 'EQUAL'],
                    message: 'Invalid target operator'
                },
                default: 'LESS_THAN_EQUAL'
            }
        },

        secondaryTargets: [{
            targetName: {
                type: String,
                required: true,
                trim: true
            },
            targetValue: {
                type: Number,
                required: true,
                min: [0, 'Target value cannot be negative']
            },
            targetUnit: {
                type: String,
                required: true,
                enum: ['HOURS', 'MINUTES', 'DAYS', 'PERCENTAGE', 'COUNT', 'CALLS_PER_HOUR', 'ACCURACY_RATE']
            },
            weight: {
                type: Number,
                min: [1, 'Weight must be at least 1'],
                max: [10, 'Weight cannot exceed 10'],
                default: 1
            },
            isRequired: {
                type: Boolean,
                default: false
            }
        }],

        // Warning Thresholds
        warningThresholds: {
            green: {
                type: Number,
                min: [0, 'Green threshold cannot be negative'],
                max: [100, 'Green threshold cannot exceed 100'],
                default: function () { return SLA_CONSTANTS.WARNING_THRESHOLDS.GREEN; }
            },
            yellow: {
                type: Number,
                min: [0, 'Yellow threshold cannot be negative'],
                max: [100, 'Yellow threshold cannot exceed 100'],
                default: function () { return SLA_CONSTANTS.WARNING_THRESHOLDS.YELLOW; }
            },
            red: {
                type: Number,
                min: [0, 'Red threshold cannot be negative'],
                max: [100, 'Red threshold cannot exceed 100'],
                default: function () { return SLA_CONSTANTS.WARNING_THRESHOLDS.RED; }
            }
        }
    },

    // ** MEASUREMENT CONFIGURATION **
    measurementConfig: {
        measurementFrequency: {
            type: String,
            required: [true, 'Measurement frequency is required'],
            enum: {
                values: ['REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'],
                message: 'Invalid measurement frequency'
            },
            default: 'DAILY'
        },
        measurementWindow: {
            type: String,
            enum: {
                values: ['SLIDING', 'CALENDAR_PERIOD', 'BUSINESS_HOURS', 'CUSTOM'],
                message: 'Invalid measurement window'
            },
            default: 'CALENDAR_PERIOD'
        },
        businessHours: {
            timezone: {
                type: String,
                default: 'EST'
            },
            workingDays: [{
                type: String,
                enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
            }],
            startTime: String, // Format: "09:00"
            endTime: String,   // Format: "17:00"
            excludeHolidays: {
                type: Boolean,
                default: true
            }
        },
        dataSource: {
            type: String,
            required: [true, 'Data source is required'],
            enum: {
                values: [
                    'SYSTEM_LOGS', 'MANUAL_ENTRY', 'AUTOMATED_TRACKING',
                    'EXTERNAL_SYSTEM', 'WORKFLOW_ENGINE', 'TIME_TRACKING'
                ],
                message: 'Invalid data source'
            }
        },
        calculationMethod: {
            type: String,
            enum: {
                values: ['AVERAGE', 'MEDIAN', 'PERCENTILE', 'MINIMUM', 'MAXIMUM', 'SUM', 'COUNT'],
                message: 'Invalid calculation method'
            },
            default: 'AVERAGE'
        }
    },

    // ** ESCALATION RULES **
    escalationRules: {
        enableEscalation: {
            type: Boolean,
            default: true
        },
        escalationLevels: [{
            level: {
                type: Number,
                required: true,
                min: [1, 'Escalation level must be at least 1']
            },
            triggerCondition: {
                type: String,
                enum: [
                    'THRESHOLD_BREACH', 'TIME_BASED', 'CONSECUTIVE_FAILURES',
                    'CRITICAL_SERVICE', 'CUSTOMER_IMPACT', 'MANUAL_ESCALATION'
                ],
                required: true
            },
            triggerValue: Number,
            escalationDelay: {
                type: Number,
                min: [0, 'Escalation delay cannot be negative'],
                default: 0
            },
            escalateTo: [{
                employeeRef: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Employee',
                    required: true
                },
                roleRequired: String,
                notificationMethods: [{
                    type: String,
                    enum: ['EMAIL', 'SMS', 'IN_APP', 'PHONE', 'WEBHOOK']
                }]
            }],
            autoActions: [{
                actionType: {
                    type: String,
                    enum: ['REASSIGN_TASK', 'INCREASE_PRIORITY', 'TRIGGER_WORKFLOW', 'SEND_ALERT']
                },
                actionConfig: mongoose.Schema.Types.Mixed
            }]
        }],

        maxEscalationLevel: {
            type: Number,
            min: [1, 'Max escalation level must be at least 1'],
            default: 3
        }
    },

    // ** PENALTY & INCENTIVE CONFIGURATION **
    penaltyIncentiveConfig: {
        enablePenalties: {
            type: Boolean,
            default: false
        },
        penaltyRules: [{
            breachType: {
                type: String,
                enum: ['MINOR_BREACH', 'MAJOR_BREACH', 'CRITICAL_BREACH', 'REPEATED_BREACH'],
                required: true
            },
            penaltyType: {
                type: String,
                enum: ['XP_DEDUCTION', 'WARNING', 'PERFORMANCE_IMPACT', 'ESCALATION'],
                required: true
            },
            penaltyValue: Number,
            description: String
        }],

        enableIncentives: {
            type: Boolean,
            default: true
        },
        incentiveRules: [{
            achievementType: {
                type: String,
                enum: ['TARGET_MET', 'EARLY_COMPLETION', 'CONSISTENT_PERFORMANCE', 'EXCELLENCE'],
                required: true
            },
            incentiveType: {
                type: String,
                enum: ['XP_BONUS', 'RECOGNITION', 'BADGE', 'CERTIFICATE'],
                required: true
            },
            incentiveValue: Number,
            description: String
        }]
    },

    // ** REPORTING CONFIGURATION **
    reportingConfig: {
        reportingFrequency: {
            type: String,
            enum: ['REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'],
            default: 'DAILY'
        },
        reportRecipients: [{
            employeeRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reportTypes: [{
                type: String,
                enum: ['COMPLIANCE_SUMMARY', 'VIOLATION_ALERT', 'TREND_ANALYSIS', 'DETAILED_METRICS']
            }],
            deliveryMethod: {
                type: String,
                enum: ['EMAIL', 'IN_APP', 'DASHBOARD', 'SMS'],
                default: 'EMAIL'
            }
        }],

        dashboardConfig: {
            showRealTimeStatus: {
                type: Boolean,
                default: true
            },
            showTrends: {
                type: Boolean,
                default: true
            },
            showComparisons: {
                type: Boolean,
                default: true
            },
            autoRefreshInterval: {
                type: Number,
                min: [30, 'Auto refresh interval must be at least 30 seconds'],
                default: 300 // 5 minutes
            }
        }
    },

    // ** APPLICABILITY RULES **
    applicabilityRules: {
        appliesTo: {
            type: String,
            required: [true, 'Applies to is required'],
            enum: {
                values: ['ALL_EMPLOYEES', 'SPECIFIC_EMPLOYEES', 'DEPARTMENTS', 'ROLES', 'TEAMS', 'CUSTOM_CRITERIA'],
                message: 'Invalid applies to value'
            }
        },
        specificEmployees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }],
        departments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }],
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }],
        customCriteria: [{
            criteriaType: {
                type: String,
                enum: ['EXPERIENCE_LEVEL', 'SKILL_LEVEL', 'LOCATION', 'SHIFT', 'CLIENT']
            },
            criteriaValue: String,
            operator: {
                type: String,
                enum: ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'CONTAINS']
            }
        }],

        // Exclusion Rules
        exclusions: [{
            exclusionType: {
                type: String,
                enum: ['TRAINING_PERIOD', 'PROBATION', 'LEAVE', 'SPECIAL_CIRCUMSTANCES']
            },
            exclusionCriteria: String,
            startDate: Date,
            endDate: Date,
            isActive: {
                type: Boolean,
                default: true
            }
        }]
    },

    // ** STATUS & LIFECYCLE **
    statusInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isDraft: {
            type: Boolean,
            default: true
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedAt: Date,
        effectiveDate: {
            type: Date,
            default: Date.now
        },
        expiryDate: Date,
        lastReviewed: Date,
        nextReviewDate: Date,

        // Version Control
        versionHistory: [{
            version: String,
            changes: String,
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            changedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },

    // ** PERFORMANCE METRICS **
    performanceMetrics: {
        totalInstances: {
            type: Number,
            default: 0,
            min: [0, 'Total instances cannot be negative']
        },
        metInstances: {
            type: Number,
            default: 0,
            min: [0, 'Met instances cannot be negative']
        },
        violatedInstances: {
            type: Number,
            default: 0,
            min: [0, 'Violated instances cannot be negative']
        },
        complianceRate: {
            type: Number,
            min: [0, 'Compliance rate cannot be negative'],
            max: [100, 'Compliance rate cannot exceed 100'],
            default: 0
        },

        averagePerformance: {
            type: Number,
            min: [0, 'Average performance cannot be negative'],
            default: 0
        },

        trendAnalysis: {
            direction: {
                type: String,
                enum: ['IMPROVING', 'STABLE', 'DECLINING'],
                default: 'STABLE'
            },
            changeRate: Number,
            lastCalculated: Date
        },

        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// INDEXES
slaSchema.index({ companyRef: 1, 'templateInfo.serviceType': 1 });
slaSchema.index({ 'statusInfo.isActive': 1, 'statusInfo.isDraft': 1 });
slaSchema.index({ 'applicabilityRules.appliesTo': 1 });
slaSchema.index({ 'statusInfo.effectiveDate': 1, 'statusInfo.expiryDate': 1 });
slaSchema.index({ 'performanceMetrics.complianceRate': -1 });

// VIRTUALS
slaSchema.virtual('isExpired').get(function () {
    return this.statusInfo?.expiryDate && new Date() > this.statusInfo.expiryDate;
});

slaSchema.virtual('isEffective').get(function () {
    const now = new Date();
    return this.statusInfo?.isActive &&
        !this.statusInfo?.isDraft &&
        this.statusInfo?.isApproved &&
        (!this.statusInfo?.effectiveDate || now >= this.statusInfo.effectiveDate) &&
        (!this.statusInfo?.expiryDate || now <= this.statusInfo.expiryDate);
});

slaSchema.virtual('complianceStatus').get(function () {
    const rate = this.performanceMetrics?.complianceRate || 0;
    if (rate >= 95) return 'EXCELLENT';
    if (rate >= 90) return 'GOOD';
    if (rate >= 80) return 'SATISFACTORY';
    if (rate >= 70) return 'NEEDS_IMPROVEMENT';
    return 'POOR';
});

slaSchema.virtual('riskLevel').get(function () {
    const compliance = this.performanceMetrics?.complianceRate || 0;
    const violations = this.performanceMetrics?.violatedInstances || 0;
    const trend = this.performanceMetrics?.trendAnalysis?.direction || 'STABLE';

    if (compliance < 70 || violations > 10 || trend === 'DECLINING') return 'HIGH';
    if (compliance < 85 || violations > 5) return 'MEDIUM';
    return 'LOW';
});

// ** STATIC METHODS **
slaSchema.statics.findEffectiveForEmployee = function (companyId, employeeId) {
    return this.find({
        companyRef: companyId,
        'statusInfo.isActive': true,
        'statusInfo.isDraft': false,
        'statusInfo.isApproved': true,
        $or: [
            { 'applicabilityRules.appliesTo': 'ALL_EMPLOYEES' },
            { 'applicabilityRules.specificEmployees': employeeId }
        ]
    }).populate('applicabilityRules.specificEmployees applicabilityRules.departments applicabilityRules.roles');
};

slaSchema.statics.findByServiceType = function (companyId, serviceType) {
    return this.find({
        companyRef: companyId,
        'templateInfo.serviceType': serviceType,
        'statusInfo.isActive': true,
        'statusInfo.isDraft': false
    });
};

slaSchema.statics.getComplianceOverview = function (companyId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'statusInfo.isActive': true,
                'performanceMetrics.lastUpdated': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: '$templateInfo.serviceType',
                totalSLAs: { $sum: 1 },
                totalInstances: { $sum: '$performanceMetrics.totalInstances' },
                metInstances: { $sum: '$performanceMetrics.metInstances' },
                violatedInstances: { $sum: '$performanceMetrics.violatedInstances' },
                avgComplianceRate: { $avg: '$performanceMetrics.complianceRate' }
            }
        },
        {
            $project: {
                serviceType: '$_id',
                totalSLAs: 1,
                totalInstances: 1,
                metInstances: 1,
                violatedInstances: 1,
                overallComplianceRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$metInstances', '$totalInstances'] }, 100] },
                        2
                    ]
                },
                avgComplianceRate: { $round: ['$avgComplianceRate', 2] }
            }
        },
        {
            $sort: { overallComplianceRate: -1 }
        }
    ]);
};

// ** INSTANCE METHODS **
slaSchema.methods.checkCompliance = function (actualValue, targetOperator = null) {
    const target = this.slaTargets?.primaryTarget;
    if (!target) return false;

    const operator = targetOperator || target.targetOperator;
    const targetValue = target.targetValue;

    switch (operator) {
        case 'LESS_THAN':
            return actualValue < targetValue;
        case 'LESS_THAN_EQUAL':
            return actualValue <= targetValue;
        case 'GREATER_THAN':
            return actualValue > targetValue;
        case 'GREATER_THAN_EQUAL':
            return actualValue >= targetValue;
        case 'EQUAL':
            return actualValue === targetValue;
        default:
            return false;
    }
};

slaSchema.methods.updatePerformance = function (isMet) {
    this.performanceMetrics.totalInstances += 1;

    if (isMet) {
        this.performanceMetrics.metInstances += 1;
    } else {
        this.performanceMetrics.violatedInstances += 1;
    }

    // Recalculate compliance rate
    this.performanceMetrics.complianceRate = Math.round(
        (this.performanceMetrics.metInstances / this.performanceMetrics.totalInstances) * 100
    );

    this.performanceMetrics.lastUpdated = new Date();

    return this.save();
};

slaSchema.methods.getWarningLevel = function (actualValue) {
    const target = this.slaTargets?.primaryTarget;
    if (!target) return 'GREEN';

    const thresholds = this.slaTargets?.warningThresholds;
    const percentUsed = (actualValue / target.targetValue) * 100;

    if (percentUsed >= thresholds?.red) return 'RED';
    if (percentUsed >= thresholds?.yellow) return 'YELLOW';
    return 'GREEN';
};

slaSchema.methods.shouldEscalate = function (currentLevel, actualValue) {
    if (!this.escalationRules?.enableEscalation) return false;

    const nextLevel = this.escalationRules.escalationLevels?.find(
        level => level.level === currentLevel + 1
    );

    if (!nextLevel) return false;

    switch (nextLevel.triggerCondition) {
        case 'THRESHOLD_BREACH':
            return !this.checkCompliance(actualValue);
        case 'TIME_BASED':
            return true; // Would need additional time logic
        case 'CONSECUTIVE_FAILURES':
            return true; // Would need failure history
        default:
            return false;
    }
};

slaSchema.methods.approve = function (approvedBy) {
    this.statusInfo.isApproved = true;
    this.statusInfo.isDraft = false;
    this.statusInfo.approvedBy = approvedBy;
    this.statusInfo.approvedAt = new Date();

    if (!this.statusInfo.effectiveDate) {
        this.statusInfo.effectiveDate = new Date();
    }

    return this.save();
};

// PLUGINS
slaSchema.plugin(scopedIdPlugin, {
    idField: 'slaId',
    prefix: 'SLA',
    companyRefPath: 'companyRef'
});

// ** MIDDLEWARE **
slaSchema.pre('save', function (next) {
    // Calculate compliance rate
    const total = this.performanceMetrics?.totalInstances || 0;
    if (total > 0) {
        this.performanceMetrics.complianceRate = Math.round(
            (this.performanceMetrics.metInstances / total) * 100
        );
    }

    // Set next review date if not set
    if (!this.statusInfo?.nextReviewDate && this.statusInfo?.isApproved) {
        this.statusInfo.nextReviewDate = new Date();
        this.statusInfo.nextReviewDate.setMonth(this.statusInfo.nextReviewDate.getMonth() + 6);
    }

    // Validate escalation levels
    if (this.escalationRules?.escalationLevels?.length > 0) {
        const levels = this.escalationRules.escalationLevels.map(e => e.level);
        const uniqueLevels = [...new Set(levels)];
        if (levels.length !== uniqueLevels.length) {
            next(new Error('Escalation levels must be unique'));
            return;
        }
    }

    next();
});

slaSchema.post('save', async function (doc) {
    try {
        // Award XP for creating SLA templates
        if (doc.isNew) {
            const Employee = mongoose.model('Employee');
            await Employee.findByIdAndUpdate(
                doc.createdBy,
                {
                    $inc: {
                        'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.PROCESS_IMPROVEMENT
                    }
                }
            );
        }

        // Create notification for poor performance
        if (doc.performanceMetrics?.complianceRate < 70 && doc.isModified('performanceMetrics')) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.createdBy,
                type: 'SLA_PERFORMANCE_ALERT',
                title: 'SLA Performance Alert',
                message: `SLA ${doc.templateInfo.templateName} has compliance rate of ${doc.performanceMetrics.complianceRate}%`,
                priority: 'HIGH',
                relatedEntity: {
                    entityType: 'SLA',
                    entityId: doc._id
                }
            });
        }

    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

export const SLA = mongoose.model('SLA', slaSchema, 'slas');