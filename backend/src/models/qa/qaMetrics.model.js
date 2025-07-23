// backend/src/models/qa/qaMetrics.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { QA_CONSTANTS } from '../../utils/constants.js';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

const qaMetricsSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    metricsId: {
        type: String,
        unique: true,
        // default: () => `QAM-${uuidv4().substring(0, 8).toUpperCase()}`,
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

    employeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        index: true
    },

    qaWorkflowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QA',
        index: true
    },

    // ** METRICS PERIOD **
    period: {
        periodType: {
            type: String,
            required: [true, 'Period type is required'],
            enum: {
                values: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'],
                message: 'Invalid period type'
            },
            index: true
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
            index: true
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
            index: true
        },
        year: {
            type: Number,
            required: true,
            index: true
        },
        month: Number,
        week: Number,
        quarter: Number
    },

    // ** CORE QA METRICS **
    qualityMetrics: {
        totalReviews: {
            type: Number,
            default: 0,
            min: [0, 'Total reviews cannot be negative']
        },
        reviewsCompleted: {
            type: Number,
            default: 0,
            min: [0, 'Reviews completed cannot be negative']
        },
        reviewsPassed: {
            type: Number,
            default: 0,
            min: [0, 'Reviews passed cannot be negative']
        },
        reviewsFailed: {
            type: Number,
            default: 0,
            min: [0, 'Reviews failed cannot be negative']
        },

        // Calculated Quality Rates
        passRate: {
            type: Number,
            min: [0, 'Pass rate cannot be negative'],
            max: [100, 'Pass rate cannot exceed 100'],
            default: 0
        },
        qualityScore: {
            type: Number,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100'],
            default: 0
        },
        firstPassRate: {
            type: Number,
            min: [0, 'First pass rate cannot be negative'],
            max: [100, 'First pass rate cannot exceed 100'],
            default: 0
        },

        // Score Distribution
        scoreDistribution: {
            excellent: { type: Number, default: 0 }, // 95-100
            good: { type: Number, default: 0 },      // 90-94
            satisfactory: { type: Number, default: 0 }, // 85-89
            needsImprovement: { type: Number, default: 0 }, // 80-84
            unsatisfactory: { type: Number, default: 0 }    // 0-79
        }
    },

    // ** ERROR ANALYSIS **
    errorMetrics: {
        totalErrors: {
            type: Number,
            default: 0,
            min: [0, 'Total errors cannot be negative']
        },
        criticalErrors: {
            type: Number,
            default: 0,
            min: [0, 'Critical errors cannot be negative']
        },
        majorErrors: {
            type: Number,
            default: 0,
            min: [0, 'Major errors cannot be negative']
        },
        minorErrors: {
            type: Number,
            default: 0,
            min: [0, 'Minor errors cannot be negative']
        },

        // Error Rates
        errorRate: {
            type: Number,
            min: [0, 'Error rate cannot be negative'],
            default: 0
        },
        criticalErrorRate: {
            type: Number,
            min: [0, 'Critical error rate cannot be negative'],
            max: [100, 'Critical error rate cannot exceed 100'],
            default: 0
        },

        // Errors by Category
        errorsByCategory: {
            clinical: { type: Number, default: 0 },
            administrative: { type: Number, default: 0 },
            technical: { type: Number, default: 0 },
            compliance: { type: Number, default: 0 },
            documentation: { type: Number, default: 0 }
        },

        // Top Error Types
        topErrorTypes: [{
            errorType: String,
            count: Number,
            percentage: Number
        }]
    },

    // ** PRODUCTIVITY METRICS **
    productivityMetrics: {
        averageReviewTime: {
            type: Number,
            min: [0, 'Average review time cannot be negative'],
            default: 0
        },
        totalReviewTime: {
            type: Number,
            min: [0, 'Total review time cannot be negative'],
            default: 0
        },
        reviewsPerDay: {
            type: Number,
            min: [0, 'Reviews per day cannot be negative'],
            default: 0
        },
        reviewsPerHour: {
            type: Number,
            min: [0, 'Reviews per hour cannot be negative'],
            default: 0
        },

        // Time Distribution
        timeDistribution: {
            under15Minutes: { type: Number, default: 0 },
            minutes15to30: { type: Number, default: 0 },
            minutes30to60: { type: Number, default: 0 },
            over60Minutes: { type: Number, default: 0 }
        }
    },

    // ** SLA METRICS **
    slaMetrics: {
        totalSLATargets: {
            type: Number,
            default: 0,
            min: [0, 'Total SLA targets cannot be negative']
        },
        slasMet: {
            type: Number,
            default: 0,
            min: [0, 'SLAs met cannot be negative']
        },
        slasBreached: {
            type: Number,
            default: 0,
            min: [0, 'SLAs breached cannot be negative']
        },
        slaComplianceRate: {
            type: Number,
            min: [0, 'SLA compliance rate cannot be negative'],
            max: [100, 'SLA compliance rate cannot exceed 100'],
            default: 0
        },
        averageSLAUsage: {
            type: Number,
            min: [0, 'Average SLA usage cannot be negative'],
            default: 0
        },

        // SLA Performance by Time
        slaPerformanceByHour: [{
            hour: { type: Number, min: 0, max: 23 },
            complianceRate: Number,
            averageTime: Number
        }]
    },

    // ** CALIBRATION METRICS **
    calibrationMetrics: {
        calibrationSessions: {
            type: Number,
            default: 0,
            min: [0, 'Calibration sessions cannot be negative']
        },
        calibrationAccuracy: {
            type: Number,
            min: [0, 'Calibration accuracy cannot be negative'],
            max: [100, 'Calibration accuracy cannot exceed 100'],
            default: 0
        },
        averageVariance: {
            type: Number,
            min: [0, 'Average variance cannot be negative'],
            default: 0
        },
        consistencyRating: {
            type: String,
            enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'],
            default: 'FAIR'
        },

        // Calibration Trends
        varianceTrend: {
            type: String,
            enum: ['IMPROVING', 'STABLE', 'DECLINING'],
            default: 'STABLE'
        }
    },

    // ** REBUTTAL METRICS **
    rebuttalMetrics: {
        totalRebuttals: {
            type: Number,
            default: 0,
            min: [0, 'Total rebuttals cannot be negative']
        },
        rebuttalsAccepted: {
            type: Number,
            default: 0,
            min: [0, 'Rebuttals accepted cannot be negative']
        },
        rebuttalsRejected: {
            type: Number,
            default: 0,
            min: [0, 'Rebuttals rejected cannot be negative']
        },
        rebuttalRate: {
            type: Number,
            min: [0, 'Rebuttal rate cannot be negative'],
            max: [100, 'Rebuttal rate cannot exceed 100'],
            default: 0
        },
        rebuttalSuccessRate: {
            type: Number,
            min: [0, 'Rebuttal success rate cannot be negative'],
            max: [100, 'Rebuttal success rate cannot exceed 100'],
            default: 0
        }
    },

    // ** TREND ANALYSIS **
    trendAnalysis: {
        qualityTrend: {
            type: String,
            enum: ['IMPROVING', 'STABLE', 'DECLINING'],
            default: 'STABLE'
        },
        productivityTrend: {
            type: String,
            enum: ['IMPROVING', 'STABLE', 'DECLINING'],
            default: 'STABLE'
        },
        errorTrend: {
            type: String,
            enum: ['IMPROVING', 'STABLE', 'DECLINING'],
            default: 'STABLE'
        },

        // Comparison with Previous Period
        previousPeriodComparison: {
            qualityScoreChange: Number,
            passRateChange: Number,
            errorRateChange: Number,
            productivityChange: Number,
            slaComplianceChange: Number
        }
    },

    // ** BENCHMARK METRICS **
    benchmarkMetrics: {
        industryComparison: {
            qualityScorePercentile: Number,
            passRatePercentile: Number,
            errorRatePercentile: Number,
            productivityPercentile: Number
        },
        companyComparison: {
            qualityScoreRank: Number,
            passRateRank: Number,
            errorRateRank: Number,
            productivityRank: Number,
            totalEmployees: Number
        },
        teamComparison: {
            qualityScoreRank: Number,
            passRateRank: Number,
            errorRateRank: Number,
            productivityRank: Number,
            totalTeamMembers: Number
        }
    },

    // ** ALERTS & NOTIFICATIONS **
    alerts: [{
        alertType: {
            type: String,
            enum: [
                'QUALITY_DECLINE', 'SLA_BREACH_PATTERN', 'HIGH_ERROR_RATE',
                'LOW_PRODUCTIVITY', 'CALIBRATION_ISSUE', 'BENCHMARK_CONCERN'
            ],
            required: true
        },
        severity: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            default: 'MEDIUM'
        },
        threshold: Number,
        actualValue: Number,
        message: String,
        triggeredAt: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        },
        acknowledgedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        acknowledgedAt: Date
    }],

    // ** CALCULATION METADATA **
    calculationInfo: {
        calculatedAt: {
            type: Date,
            required: [true, 'Calculated time is required'],
            default: Date.now
        },
        calculatedBy: {
            type: String,
            default: 'SYSTEM'
        },
        dataSource: {
            type: String,
            default: 'QA_REVIEWS'
        },
        calculationMethod: {
            type: String,
            default: 'STANDARD_AGGREGATION'
        },
        totalRecordsProcessed: {
            type: Number,
            min: [0, 'Total records processed cannot be negative']
        }
    },

    // ** STATUS **
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
        archivedAt: Date,
        archivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES **
qaMetricsSchema.index({ companyRef: 1, employeeRef: 1, 'period.periodType': 1 });
qaMetricsSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
qaMetricsSchema.index({ 'period.year': 1, 'period.month': 1 });
qaMetricsSchema.index({ qaWorkflowRef: 1, 'period.periodType': 1 });
qaMetricsSchema.index({ 'qualityMetrics.passRate': -1 });
qaMetricsSchema.index({ 'slaMetrics.slaComplianceRate': -1 });

// ** VIRTUALS **
qaMetricsSchema.virtual('overallPerformanceGrade').get(function () {
    const qualityScore = this.qualityMetrics?.qualityScore || 0;
    const passRate = this.qualityMetrics?.passRate || 0;
    const slaCompliance = this.slaMetrics?.slaComplianceRate || 0;
    const errorRate = this.errorMetrics?.criticalErrorRate || 0;

    const weightedScore = (qualityScore * 0.4) + (passRate * 0.3) + (slaCompliance * 0.2) - (errorRate * 0.1);

    if (weightedScore >= 90) return 'A';
    if (weightedScore >= 80) return 'B';
    if (weightedScore >= 70) return 'C';
    if (weightedScore >= 60) return 'D';
    return 'F';
});

qaMetricsSchema.virtual('needsAttention').get(function () {
    return this.qualityMetrics?.passRate < 85 ||
        this.slaMetrics?.slaComplianceRate < 90 ||
        this.errorMetrics?.criticalErrorRate > 10 ||
        this.alerts?.some(alert => alert.isActive && alert.severity === 'CRITICAL');
});

qaMetricsSchema.virtual('performanceInsights').get(function () {
    const insights = [];

    if (this.qualityMetrics?.passRate >= 95) {
        insights.push('Excellent quality performance');
    } else if (this.qualityMetrics?.passRate < 80) {
        insights.push('Quality improvement needed');
    }

    if (this.slaMetrics?.slaComplianceRate >= 95) {
        insights.push('Outstanding SLA compliance');
    } else if (this.slaMetrics?.slaComplianceRate < 85) {
        insights.push('SLA compliance below target');
    }

    if (this.errorMetrics?.criticalErrorRate === 0) {
        insights.push('Zero critical errors - exceptional work');
    } else if (this.errorMetrics?.criticalErrorRate > 5) {
        insights.push('Critical error rate needs attention');
    }

    return insights;
});

// ** STATIC METHODS **
qaMetricsSchema.statics.getCompanyMetrics = function (companyId, periodType, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'period.periodType': periodType,
                'period.startDate': { $gte: startDate },
                'period.endDate': { $lte: endDate },
                'statusInfo.isActive': true
            }
        },
        {
            $group: {
                _id: null,
                totalEmployees: { $addToSet: '$employeeRef' },
                totalReviews: { $sum: '$qualityMetrics.totalReviews' },
                totalPassed: { $sum: '$qualityMetrics.reviewsPassed' },
                totalFailed: { $sum: '$qualityMetrics.reviewsFailed' },
                totalErrors: { $sum: '$errorMetrics.totalErrors' },
                totalCriticalErrors: { $sum: '$errorMetrics.criticalErrors' },
                avgQualityScore: { $avg: '$qualityMetrics.qualityScore' },
                avgPassRate: { $avg: '$qualityMetrics.passRate' },
                avgSLACompliance: { $avg: '$slaMetrics.slaComplianceRate' },
                avgReviewTime: { $avg: '$productivityMetrics.averageReviewTime' }
            }
        },
        {
            $project: {
                totalEmployees: { $size: '$totalEmployees' },
                totalReviews: 1,
                totalPassed: 1,
                totalFailed: 1,
                overallPassRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$totalPassed', '$totalReviews'] }, 100] },
                        2
                    ]
                },
                overallErrorRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$totalErrors', '$totalReviews'] }, 100] },
                        2
                    ]
                },
                criticalErrorRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$totalCriticalErrors', '$totalReviews'] }, 100] },
                        2
                    ]
                },
                avgQualityScore: { $round: ['$avgQualityScore', 2] },
                avgPassRate: { $round: ['$avgPassRate', 2] },
                avgSLACompliance: { $round: ['$avgSLACompliance', 2] },
                avgReviewTimeMinutes: { $round: ['$avgReviewTime', 2] }
            }
        }
    ]);
};

qaMetricsSchema.statics.getTopPerformers = function (companyId, periodType, limit = 10) {
    return this.find({
        companyRef: companyId,
        'period.periodType': periodType,
        'statusInfo.isActive': true,
        employeeRef: { $exists: true }
    })
        .populate('employeeRef', 'firstName lastName email')
        .sort({ 'qualityMetrics.qualityScore': -1, 'qualityMetrics.passRate': -1 })
        .limit(limit);
};

qaMetricsSchema.statics.getBottomPerformers = function (companyId, periodType, limit = 10) {
    return this.find({
        companyRef: companyId,
        'period.periodType': periodType,
        'statusInfo.isActive': true,
        employeeRef: { $exists: true }
    })
        .populate('employeeRef', 'firstName lastName email')
        .sort({ 'qualityMetrics.qualityScore': 1, 'errorMetrics.criticalErrorRate': -1 })
        .limit(limit);
};

// ** INSTANCE METHODS **
qaMetricsSchema.methods.generateAlert = function (alertType, threshold, actualValue, message) {
    const severity = this._determineSeverity(alertType, threshold, actualValue);

    this.alerts.push({
        alertType,
        severity,
        threshold,
        actualValue,
        message: message || this._generateAlertMessage(alertType, actualValue)
    });

    return this.save();
};

qaMetricsSchema.methods._determineSeverity = function (alertType, threshold, actualValue) {
    const deviation = Math.abs(actualValue - threshold);
    const percentDeviation = (deviation / threshold) * 100;

    if (percentDeviation > 50) return 'CRITICAL';
    if (percentDeviation > 25) return 'HIGH';
    if (percentDeviation > 10) return 'MEDIUM';
    return 'LOW';
};

qaMetricsSchema.methods._generateAlertMessage = function (alertType, actualValue) {
    const messages = {
        'QUALITY_DECLINE': `Quality score dropped to ${actualValue}%`,
        'SLA_BREACH_PATTERN': `SLA compliance at ${actualValue}%`,
        'HIGH_ERROR_RATE': `Error rate increased to ${actualValue}%`,
        'LOW_PRODUCTIVITY': `Productivity below target at ${actualValue} reviews/hour`,
        'CALIBRATION_ISSUE': `Calibration accuracy at ${actualValue}%`,
        'BENCHMARK_CONCERN': `Performance below benchmark at ${actualValue} percentile`
    };

    return messages[alertType] || `Alert triggered for ${alertType}`;
};

qaMetricsSchema.methods.compareWithPrevious = function (previousMetrics) {
    if (!previousMetrics) return null;

    this.trendAnalysis.previousPeriodComparison = {
        qualityScoreChange: this.qualityMetrics.qualityScore - previousMetrics.qualityMetrics.qualityScore,
        passRateChange: this.qualityMetrics.passRate - previousMetrics.qualityMetrics.passRate,
        errorRateChange: previousMetrics.errorMetrics.errorRate - this.errorMetrics.errorRate, // Lower is better
        productivityChange: this.productivityMetrics.reviewsPerHour - previousMetrics.productivityMetrics.reviewsPerHour,
        slaComplianceChange: this.slaMetrics.slaComplianceRate - previousMetrics.slaMetrics.slaComplianceRate
    };

    // Determine trends
    this.trendAnalysis.qualityTrend = this._determineTrend(this.trendAnalysis.previousPeriodComparison.qualityScoreChange);
    this.trendAnalysis.productivityTrend = this._determineTrend(this.trendAnalysis.previousPeriodComparison.productivityChange);
    this.trendAnalysis.errorTrend = this._determineTrend(-this.trendAnalysis.previousPeriodComparison.errorRateChange); // Negative because lower error is better

    return this.save();
};

qaMetricsSchema.methods._determineTrend = function (change) {
    if (change > 2) return 'IMPROVING';
    if (change < -2) return 'DECLINING';
    return 'STABLE';
};

// ** PLUGINS **
qaMetricsSchema.plugin(scopedIdPlugin, {
    idField: 'metricsId',
    prefix: 'QAM',
    companyRefPath: 'companyRef'
});

// ** MIDDLEWARE **
qaMetricsSchema.pre('save', function (next) {
    // Calculate derived metrics
    const totalReviews = this.qualityMetrics?.totalReviews || 0;

    if (totalReviews > 0) {
        // Calculate pass rate
        this.qualityMetrics.passRate = Math.round(
            (this.qualityMetrics.reviewsPassed / totalReviews) * 100
        );

        // Calculate first pass rate (assumes no rebuttals for first pass)
        this.qualityMetrics.firstPassRate = Math.round(
            ((this.qualityMetrics.reviewsPassed - this.rebuttalMetrics.rebuttalsAccepted) / totalReviews) * 100
        );

        // Calculate error rate
        this.errorMetrics.errorRate = Math.round(
            (this.errorMetrics.totalErrors / totalReviews) * 100
        );

        // Calculate critical error rate
        this.errorMetrics.criticalErrorRate = Math.round(
            (this.errorMetrics.criticalErrors / totalReviews) * 100
        );

        // Calculate rebuttal rate
        this.rebuttalMetrics.rebuttalRate = Math.round(
            (this.rebuttalMetrics.totalRebuttals / totalReviews) * 100
        );

        // Calculate rebuttal success rate
        if (this.rebuttalMetrics.totalRebuttals > 0) {
            this.rebuttalMetrics.rebuttalSuccessRate = Math.round(
                (this.rebuttalMetrics.rebuttalsAccepted / this.rebuttalMetrics.totalRebuttals) * 100
            );
        }
    }

    // Calculate SLA compliance rate
    const totalSLAs = this.slaMetrics?.totalSLATargets || 0;
    if (totalSLAs > 0) {
        this.slaMetrics.slaComplianceRate = Math.round(
            (this.slaMetrics.slasMet / totalSLAs) * 100
        );
    }

    // Calculate productivity metrics
    const totalTime = this.productivityMetrics?.totalReviewTime || 0;
    if (totalReviews > 0) {
        this.productivityMetrics.averageReviewTime = Math.round(totalTime / totalReviews);
    }

    // Set period-specific fields
    const startDate = this.period?.startDate;
    if (startDate) {
        this.period.year = startDate.getFullYear();
        this.period.month = startDate.getMonth() + 1;
        this.period.week = Math.ceil(startDate.getDate() / 7);
        this.period.quarter = Math.ceil(this.period.month / 3);
    }

    next();
});

export const QAMetrics = mongoose.model('QAMetrics', qaMetricsSchema, 'qaMetrics');