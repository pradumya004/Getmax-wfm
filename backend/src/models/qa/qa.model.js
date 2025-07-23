// backend/src/models/qa/qa.model.js

import mongoose from 'mongoose';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { QA_CONSTANTS, SLA_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

const qaSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    qaId: {
        type: String,
        unique: true,
        // default: () => `QA-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
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

    // ** QA WORKFLOW CONFIGURATION **
    workflowInfo: {
        workflowName: {
            type: String,
            required: [true, 'Workflow name is required'],
            trim: true,
            maxlength: [100, 'Workflow name cannot exceed 100 characters']
        },
        workflowType: {
            type: String,
            required: [true, 'Workflow type is required'],
            enum: {
                values: ['CLAIM_REVIEW', 'CODING_REVIEW', 'DOCUMENTATION_REVIEW', 'PROCESS_REVIEW', 'CALIBRATION'],
                message: 'Invalid workflow type'
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
                    'CLAIMS_PROCESSING'
                ],
                message: 'Invalid service type'
            },
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        }
    },

    // ** QA CHECKLIST CONFIGURATION **
    checklistConfig: {
        checklistItems: [{
            itemId: {
                type: String,
                required: true,
                default: () => `QA-ITEM-${uuidv4().toUpperCase()}`
            },
            category: {
                type: String,
                enum: Object.values(QA_CONSTANTS.ERROR_CATEGORIES),
                required: true
            },
            checkPoint: {
                type: String,
                required: [true, 'Check point is required'],
                trim: true,
                maxlength: [200, 'Check point cannot exceed 200 characters']
            },
            description: {
                type: String,
                trim: true,
                maxlength: [300, 'Description cannot exceed 300 characters']
            },
            weight: {
                type: Number,
                required: [true, 'Weight is required'],
                min: [1, 'Weight must be at least 1'],
                max: [10, 'Weight cannot exceed 10'],
                default: 1
            },
            isCritical: {
                type: Boolean,
                default: false
            },
            isRequired: {
                type: Boolean,
                default: true
            },
            expectedValue: mongoose.Schema.Types.Mixed,
            validationRules: {
                type: String,
                trim: true
            },
            errorMessage: {
                type: String,
                trim: true,
                maxlength: [200, 'Error message cannot exceed 200 characters']
            }
        }],

        totalPoints: {
            type: Number,
            required: true,
            min: [1, 'Total points must be at least 1'],
            default: function () {
                return this.checklistConfig?.checklistItems?.reduce((sum, item) => sum + item.weight, 0) || 0;
            }
        },

        passingScore: {
            type: Number,
            required: [true, 'Passing score is required'],
            min: [50, 'Passing score must be at least 50'],
            max: [100, 'Passing score cannot exceed 100'],
            default: 85
        },

        criticalFailureThreshold: {
            type: Number,
            default: 1,
            min: [0, 'Critical failure threshold cannot be negative']
        }
    },

    // ** SAMPLING CONFIGURATION **
    samplingConfig: {
        samplingMethod: {
            type: String,
            required: [true, 'Sampling method is required'],
            enum: {
                values: ['RANDOM', 'SYSTEMATIC', 'STRATIFIED', 'TARGETED', 'MANUAL_SELECTION'],
                message: 'Invalid sampling method'
            },
            default: 'RANDOM'
        },
        samplingRate: {
            type: Number,
            required: [true, 'Sampling rate is required'],
            min: [1, 'Sampling rate must be at least 1%'],
            max: [100, 'Sampling rate cannot exceed 100%'],
            default: 10
        },
        minimumSamples: {
            type: Number,
            required: [true, 'Minimum samples is required'],
            min: [1, 'Minimum samples must be at least 1'],
            default: 5
        },
        maximumSamples: {
            type: Number,
            min: [1, 'Maximum samples must be at least 1'],
            default: 100
        },
        samplingPeriod: {
            type: String,
            enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'],
            default: 'WEEKLY'
        },
        targetAuditors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }]
    },

    // ** CALIBRATION SETTINGS **
    calibrationConfig: {
        isCalibrationEnabled: {
            type: Boolean,
            default: true
        },
        calibrationFrequency: {
            type: String,
            enum: ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY'],
            default: 'MONTHLY'
        },
        lastCalibrationDate: Date,
        nextCalibrationDate: Date,
        calibrationThreshold: {
            type: Number,
            min: [80, 'Calibration threshold must be at least 80%'],
            max: [100, 'Calibration threshold cannot exceed 100%'],
            default: 90
        },
        goldStandardSamples: [{
            sampleId: String,
            description: String,
            expectedScore: {
                type: Number,
                min: [0, 'Expected score cannot be negative'],
                max: [100, 'Expected score cannot exceed 100']
            },
            sampleData: mongoose.Schema.Types.Mixed,
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    },

    // ** SLA CONFIGURATION **
    slaConfig: {
        reviewSLA: {
            type: Number,
            required: [true, 'Review SLA is required'],
            min: [1, 'Review SLA must be at least 1 hour'],
            default: function () {
                return SLA_CONSTANTS.DEFAULT_SLA[this.workflowInfo?.serviceType] || 24;
            }
        },
        calibrationSLA: {
            type: Number,
            default: 72,
            min: [1, 'Calibration SLA must be at least 1 hour']
        },
        escalationRules: [{
            level: {
                type: Number,
                required: true,
                min: [1, 'Escalation level must be at least 1']
            },
            triggerCondition: {
                type: String,
                enum: ['SLA_BREACH', 'QUALITY_THRESHOLD', 'CRITICAL_ERROR', 'CALIBRATION_FAILURE'],
                required: true
            },
            escalateTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            notificationMethod: {
                type: String,
                enum: ['EMAIL', 'SMS', 'IN_APP', 'ALL'],
                default: 'IN_APP'
            }
        }]
    },

    // ** SCORING CONFIGURATION **
    scoringConfig: {
        scoringMethod: {
            type: String,
            required: [true, 'Scoring method is required'],
            enum: {
                values: ['WEIGHTED_AVERAGE', 'PASS_FAIL', 'DEDUCTION_BASED', 'CUSTOM_FORMULA'],
                message: 'Invalid scoring method'
            },
            default: 'WEIGHTED_AVERAGE'
        },
        customFormula: String,
        penaltyRules: [{
            errorType: {
                type: String,
                enum: Object.values(QA_CONSTANTS.ERROR_CATEGORIES),
                required: true
            },
            severity: {
                type: String,
                enum: Object.values(QA_CONSTANTS.SEVERITY_LEVELS),
                required: true
            },
            pointDeduction: {
                type: Number,
                required: true,
                min: [0, 'Point deduction cannot be negative']
            },
            isAutoFail: {
                type: Boolean,
                default: false
            }
        }],
        bonusPoints: [{
            achievement: String,
            points: {
                type: Number,
                min: [0, 'Bonus points cannot be negative']
            },
            description: String
        }]
    },

    // ** FEEDBACK CONFIGURATION **
    feedbackConfig: {
        feedbackRequired: {
            type: Boolean,
            default: true
        },
        feedbackTemplate: {
            type: String,
            trim: true
        },
        allowRebuttal: {
            type: Boolean,
            default: true
        },
        rebuttalDeadline: {
            type: Number,
            default: 48,
            min: [1, 'Rebuttal deadline must be at least 1 hour']
        },
        feedbackCategories: [{
            category: {
                type: String,
                required: true
            },
            isRequired: {
                type: Boolean,
                default: false
            },
            maxLength: {
                type: Number,
                default: 500
            }
        }]
    },

    // ** ANALYTICS CONFIGURATION **
    analyticsConfig: {
        trackTrends: {
            type: Boolean,
            default: true
        },
        benchmarkingEnabled: {
            type: Boolean,
            default: true
        },
        reportingFrequency: {
            type: String,
            enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'],
            default: 'WEEKLY'
        },
        kpiTargets: [{
            metric: {
                type: String,
                enum: [
                    'QUALITY_SCORE', 'REVIEW_TURNAROUND', 'CALIBRATION_ACCURACY',
                    'FIRST_PASS_RATE', 'REBUTTAL_RATE', 'CRITICAL_ERRORS'
                ],
                required: true
            },
            targetValue: {
                type: Number,
                required: true
            },
            unit: String,
            period: {
                type: String,
                enum: ['DAILY', 'WEEKLY', 'MONTHLY'],
                default: 'MONTHLY'
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
        isArchived: {
            type: Boolean,
            default: false
        },
        activatedAt: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type: Date,
            default: Date.now
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        version: {
            type: String,
            default: '1.0.0'
        }
    },

    // ** PERFORMANCE METRICS **
    performanceMetrics: {
        totalReviews: {
            type: Number,
            default: 0,
            min: [0, 'Total reviews cannot be negative']
        },
        averageScore: {
            type: Number,
            min: [0, 'Average score cannot be negative'],
            max: [100, 'Average score cannot exceed 100']
        },
        passRate: {
            type: Number,
            min: [0, 'Pass rate cannot be negative'],
            max: [100, 'Pass rate cannot exceed 100']
        },
        averageReviewTime: {
            type: Number,
            min: [0, 'Average review time cannot be negative']
        },
        criticalErrorRate: {
            type: Number,
            min: [0, 'Critical error rate cannot be negative'],
            max: [100, 'Critical error rate cannot exceed 100']
        },
        calibrationAccuracy: {
            type: Number,
            min: [0, 'Calibration accuracy cannot be negative'],
            max: [100, 'Calibration accuracy cannot exceed 100']
        },
        lastCalculated: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES **
qaSchema.index({ companyRef: 1, 'workflowInfo.serviceType': 1 });
qaSchema.index({ 'workflowInfo.workflowType': 1, 'statusInfo.isActive': 1 });
qaSchema.index({ createdBy: 1, createdAt: -1 });
qaSchema.index({ 'samplingConfig.targetAuditors': 1 });

// ** VIRTUALS **
qaSchema.virtual('isHealthy').get(function () {
    return this.statusInfo?.isActive &&
        this.performanceMetrics?.passRate >= this.checklistConfig?.passingScore &&
        this.performanceMetrics?.criticalErrorRate <= 5;
});

qaSchema.virtual('needsCalibration').get(function () {
    if (!this.calibrationConfig?.isCalibrationEnabled) return false;
    return !this.calibrationConfig?.nextCalibrationDate ||
        new Date() >= this.calibrationConfig.nextCalibrationDate;
});

// ** STATIC METHODS **
qaSchema.statics.findActiveByServiceType = function (companyId, serviceType) {
    return this.find({
        companyRef: companyId,
        'workflowInfo.serviceType': serviceType,
        'statusInfo.isActive': true
    }).populate('createdBy samplingConfig.targetAuditors');
};

qaSchema.statics.getQualityMetrics = function (companyId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'performanceMetrics.lastCalculated': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: '$workflowInfo.serviceType',
                totalWorkflows: { $sum: 1 },
                totalReviews: { $sum: '$performanceMetrics.totalReviews' },
                avgQualityScore: { $avg: '$performanceMetrics.averageScore' },
                avgPassRate: { $avg: '$performanceMetrics.passRate' },
                avgReviewTime: { $avg: '$performanceMetrics.averageReviewTime' },
                criticalErrorRate: { $avg: '$performanceMetrics.criticalErrorRate' }
            }
        }
    ]);
};

// ** INSTANCE METHODS **
qaSchema.methods.calculateScore = function (checklistResults) {
    let totalScore = 0;
    let maxPossibleScore = 0;
    let criticalErrors = 0;

    this.checklistConfig.checklistItems.forEach(item => {
        const result = checklistResults.find(r => r.itemId === item.itemId);
        maxPossibleScore += item.weight;

        if (result) {
            if (result.passed) {
                totalScore += item.weight;
            } else if (item.isCritical) {
                criticalErrors++;
            }
        }
    });

    // Check for critical failure
    if (criticalErrors >= this.checklistConfig.criticalFailureThreshold) {
        return {
            score: 0,
            passed: false,
            criticalFailure: true,
            criticalErrors
        };
    }

    const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    return {
        score: Math.round(percentage),
        passed: percentage >= this.checklistConfig.passingScore,
        criticalFailure: false,
        criticalErrors,
        totalScore,
        maxPossibleScore
    };
};

qaSchema.methods.updatePerformanceMetrics = function (reviewResults) {
    const scores = reviewResults.map(r => r.score);
    const passCount = reviewResults.filter(r => r.passed).length;
    const criticalCount = reviewResults.filter(r => r.criticalFailure).length;

    this.performanceMetrics.totalReviews += reviewResults.length;
    this.performanceMetrics.averageScore = scores.length > 0 ?
        Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
    this.performanceMetrics.passRate = reviewResults.length > 0 ?
        Math.round((passCount / reviewResults.length) * 100) : 0;
    this.performanceMetrics.criticalErrorRate = reviewResults.length > 0 ?
        Math.round((criticalCount / reviewResults.length) * 100) : 0;
    this.performanceMetrics.lastCalculated = new Date();

    return this.save();
};

// ** PLUGINS **
qaSchema.plugin(scopedIdPlugin, {
    idField: 'qaId',
    prefix: 'QA',
    companyRefPath: 'companyRef'
});

// ** MIDDLEWARE **
qaSchema.pre('save', function (next) {
    this.statusInfo.lastModified = new Date();

    // Recalculate total points
    if (this.checklistConfig?.checklistItems) {
        this.checklistConfig.totalPoints = this.checklistConfig.checklistItems
            .reduce((sum, item) => sum + item.weight, 0);
    }

    // Set next calibration date
    if (this.calibrationConfig?.isCalibrationEnabled && !this.calibrationConfig?.nextCalibrationDate) {
        const frequency = this.calibrationConfig.calibrationFrequency;
        const months = {
            'MONTHLY': 1,
            'QUARTERLY': 3,
            'SEMI_ANNUALLY': 6,
            'ANNUALLY': 12
        };

        this.calibrationConfig.nextCalibrationDate = new Date();
        this.calibrationConfig.nextCalibrationDate.setMonth(
            this.calibrationConfig.nextCalibrationDate.getMonth() + months[frequency]
        );
    }

    next();
});

qaSchema.post('save', async function (doc) {
    try {
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
    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

export const QA = mongoose.model('QA', qaSchema, 'qa');