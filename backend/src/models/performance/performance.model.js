// backend/src/models/performance/performance.model.js

import mongoose from 'mongoose';

// Performance Metrics Schema
const performanceMetricsSchema = new mongoose.Schema({
    // Daily Performance Tracking
    dailyMetrics: [{
        date: {
            type: Date,
            // required: true
        },
        tasksAssigned: {
            type: Number,
            default: 0,
            min: [0, 'Tasks assigned cannot be negative']
        },
        tasksCompleted: {
            type: Number,
            default: 0,
            min: [0, 'Tasks completed cannot be negative']
        },
        tasksInProgress: {
            type: Number,
            default: 0,
            min: [0, 'Tasks in progress cannot be negative']
        },
        qualityScore: {
            type: Number,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100%'],
            default: null
        },
        productivityRate: {
            type: Number,
            min: [0, 'Productivity rate cannot be negative'],
            default: 0 // Tasks per hour
        },
        hoursWorked: {
            type: Number,
            min: [0, 'Hours worked cannot be negative'],
            max: [24, 'Hours worked cannot exceed 24 in a day'],
            default: 0
        },
        overtimeHours: {
            type: Number,
            min: [0, 'Overtime hours cannot be negative'],
            default: 0
        },
        slaComplianceRate: {
            type: Number,
            min: [0, 'SLA compliance cannot be negative'],
            max: [100, 'SLA compliance cannot exceed 100%'],
            default: null
        },
        errorRate: {
            type: Number,
            min: [0, 'Error rate cannot be negative'],
            max: [100, 'Error rate cannot exceed 100%'],
            default: null
        },
        // 🆕 RCM Daily Metrics
        rcmMetrics: {
            // Claims Processing
            claimsReceived: {
                type: Number,
                default: 0,
                min: [0, 'Claims received cannot be negative']
            },
            claimsProcessed: {
                type: Number,
                default: 0,
                min: [0, 'Claims processed cannot be negative']
            },
            claimsSubmitted: {
                type: Number,
                default: 0,
                min: [0, 'Claims submitted cannot be negative']
            },
            cleanClaimsSubmitted: {
                type: Number,
                default: 0,
                min: [0, 'Clean claims cannot be negative']
            },
            claimsInProgress: {
                type: Number,
                default: 0,
                min: [0, 'Claims in progress cannot be negative']
            },
            claimsOnHold: {
                type: Number,
                default: 0,
                min: [0, 'Claims on hold cannot be negative']
            },

            // Quality Metrics
            firstPassRate: {
                type: Number,
                min: [0, 'First pass rate cannot be negative'],
                max: [100, 'First pass rate cannot exceed 100%'],
                default: null
            },
            cleanClaimRate: {
                type: Number,
                min: [0, 'Clean claim rate cannot be negative'],
                max: [100, 'Clean claim rate cannot exceed 100%'],
                default: null
            },
            qaScore: {
                type: Number,
                min: [0, 'QA score cannot be negative'],
                max: [100, 'QA score cannot exceed 100%'],
                default: null
            },
            qaReviews: {
                type: Number,
                default: 0,
                min: [0, 'QA reviews cannot be negative']
            },
            qaPassCount: {
                type: Number,
                default: 0,
                min: [0, 'QA pass count cannot be negative']
            },
            qaFailCount: {
                type: Number,
                default: 0,
                min: [0, 'QA fail count cannot be negative']
            },

            // Denial Management
            denialCount: {
                type: Number,
                default: 0,
                min: [0, 'Denial count cannot be negative']
            },
            denialRate: {
                type: Number,
                min: [0, 'Denial rate cannot be negative'],
                max: [100, 'Denial rate cannot exceed 100%'],
                default: null
            },
            denialResolved: {
                type: Number,
                default: 0,
                min: [0, 'Resolved denials cannot be negative']
            },
            denialResolutionRate: {
                type: Number,
                min: [0, 'Resolution rate cannot be negative'],
                max: [100, 'Resolution rate cannot exceed 100%'],
                default: null
            },

            // Financial Metrics
            totalBilledAmount: {
                type: Number,
                default: 0,
                min: [0, 'Billed amount cannot be negative']
            },
            totalCollectedAmount: {
                type: Number,
                default: 0,
                min: [0, 'Collected amount cannot be negative']
            },
            paymentsPosted: {
                type: Number,
                default: 0,
                min: [0, 'Payments posted cannot be negative']
            },
            adjustmentsPosted: {
                type: Number,
                default: 0
            },
            collectionRate: {
                type: Number,
                min: [0, 'Collection rate cannot be negative'],
                max: [100, 'Collection rate cannot exceed 100%'],
                default: null
            },

            // Patient Services
            eligibilityChecks: {
                type: Number,
                default: 0,
                min: [0, 'Eligibility checks cannot be negative']
            },
            authorizationsObtained: {
                type: Number,
                default: 0,
                min: [0, 'Authorizations cannot be negative']
            },
            patientRegistrations: {
                type: Number,
                default: 0,
                min: [0, 'Registrations cannot be negative']
            },
            patientCallsHandled: {
                type: Number,
                default: 0,
                min: [0, 'Patient calls cannot be negative']
            },
            patientSatisfactionScore: {
                type: Number,
                min: [0, 'Satisfaction score cannot be negative'],
                max: [10, 'Satisfaction score cannot exceed 10'],
                default: null
            },

            // EDI & Clearinghouse
            ediFilesProcessed: {
                type: Number,
                default: 0,
                min: [0, 'EDI files cannot be negative']
            },
            ediErrorCount: {
                type: Number,
                default: 0,
                min: [0, 'EDI errors cannot be negative']
            },
            clearinghouseResponseTime: {
                type: Number, // in minutes
                default: null,
                min: [0, 'Response time cannot be negative']
            },

            // SLA Performance
            slaViolations: {
                type: Number,
                default: 0,
                min: [0, 'SLA violations cannot be negative']
            },
            averageProcessingTime: {
                type: Number, // in hours
                default: null,
                min: [0, 'Processing time cannot be negative']
            },
            workflowCompletionRate: {
                type: Number,
                min: [0, 'Completion rate cannot be negative'],
                max: [100, 'Completion rate cannot exceed 100%'],
                default: null
            }
        }
    }],

    // Weekly Aggregated Metrics
    weeklyMetrics: [{
        weekStart: {
            type: Date,
            // required: true
        },
        weekEnd: {
            type: Date,
            // required: true
        },
        totalTasksCompleted: {
            type: Number,
            default: 0
        },
        averageQualityScore: {
            type: Number,
            min: [0, 'Average quality score cannot be negative'],
            max: [100, 'Average quality score cannot exceed 100%'],
            default: null
        },
        averageProductivityRate: {
            type: Number,
            default: 0
        },
        totalHoursWorked: {
            type: Number,
            default: 0
        },
        averageSlaCompliance: {
            type: Number,
            min: [0, 'Average SLA compliance cannot be negative'],
            max: [100, 'Average SLA compliance cannot exceed 100%'],
            default: null
        },
        weeklyRank: {
            type: Number,
            min: [1, 'Weekly rank must be at least 1'],
            default: null
        },
        // 🆕 RCM Weekly Metrics
        rcmWeeklyMetrics: {
            // Claims Summary
            totalClaimsProcessed: {
                type: Number,
                default: 0
            },
            totalClaimsSubmitted: {
                type: Number,
                default: 0
            },
            averageClaimsPerDay: {
                type: Number,
                default: 0
            },
            weeklyCleanClaimRate: {
                type: Number,
                min: [0, 'Clean claim rate cannot be negative'],
                max: [100, 'Clean claim rate cannot exceed 100%'],
                default: null
            },
            weeklyFirstPassRate: {
                type: Number,
                min: [0, 'First pass rate cannot be negative'],
                max: [100, 'First pass rate cannot exceed 100%'],
                default: null
            },

            // Quality Performance
            averageQaScore: {
                type: Number,
                min: [0, 'QA score cannot be negative'],
                max: [100, 'QA score cannot exceed 100%'],
                default: null
            },
            totalQaReviews: {
                type: Number,
                default: 0
            },
            qaPassRate: {
                type: Number,
                min: [0, 'QA pass rate cannot be negative'],
                max: [100, 'QA pass rate cannot exceed 100%'],
                default: null
            },

            // Denial Management
            totalDenials: {
                type: Number,
                default: 0
            },
            weeklyDenialRate: {
                type: Number,
                min: [0, 'Denial rate cannot be negative'],
                max: [100, 'Denial rate cannot exceed 100%'],
                default: null
            },
            denialResolutionRate: {
                type: Number,
                min: [0, 'Resolution rate cannot be negative'],
                max: [100, 'Resolution rate cannot exceed 100%'],
                default: null
            },

            // Financial Performance
            totalBilledAmount: {
                type: Number,
                default: 0
            },
            totalCollectedAmount: {
                type: Number,
                default: 0
            },
            weeklyCollectionRate: {
                type: Number,
                min: [0, 'Collection rate cannot be negative'],
                max: [100, 'Collection rate cannot exceed 100%'],
                default: null
            },
            averagePaymentPostingTime: {
                type: Number, // in hours
                default: null
            },

            // SLA & Efficiency
            slaComplianceRate: {
                type: Number,
                min: [0, 'SLA compliance cannot be negative'],
                max: [100, 'SLA compliance cannot exceed 100%'],
                default: null
            },
            averageProcessingTime: {
                type: Number, // in hours
                default: null
            },
            workflowEfficiencyScore: {
                type: Number,
                min: [0, 'Efficiency score cannot be negative'],
                max: [100, 'Efficiency score cannot exceed 100%'],
                default: null
            },

            // Rankings
            claimsVolumeRank: {
                type: Number,
                default: null
            },
            qualityRank: {
                type: Number,
                default: null
            },
            speedRank: {
                type: Number,
                default: null
            }
        }
    }],

    // Monthly Performance Summary
    monthlyMetrics: [{
        month: {
            type: String,
            // required: true // Format: "2024-01"
        },
        totalTasksCompleted: {
            type: Number,
            default: 0
        },
        averageQualityScore: {
            type: Number,
            min: [0, 'Average quality score cannot be negative'],
            max: [100, 'Average quality score cannot exceed 100%'],
            default: null
        },
        totalHoursWorked: {
            type: Number,
            default: 0
        },
        productivityImprovement: {
            type: Number,
            default: 0 // Percentage improvement from previous month
        },
        goalsAchieved: {
            type: Number,
            default: 0
        },
        goalsTotal: {
            type: Number,
            default: 0
        },
        monthlyRating: {
            type: String,
            enum: ["Outstanding", "Exceeds Expectations", "Meets Expectations", "Below Expectations", "Needs Improvement"],
            default: null
        },
        bonusEarned: {
            type: Number,
            default: 0,
            min: [0, 'Bonus cannot be negative']
        },
        // 🆕 RCM Monthly Metrics
        rcmMonthlyMetrics: {
            // Claims Processing Summary
            totalClaimsProcessed: {
                type: Number,
                default: 0
            },
            totalClaimsSubmitted: {
                type: Number,
                default: 0
            },
            averageClaimsPerDay: {
                type: Number,
                default: 0
            },
            monthlyCleanClaimRate: {
                type: Number,
                min: [0, 'Clean claim rate cannot be negative'],
                max: [100, 'Clean claim rate cannot exceed 100%'],
                default: null
            },
            monthlyFirstPassRate: {
                type: Number,
                min: [0, 'First pass rate cannot be negative'],
                max: [100, 'First pass rate cannot exceed 100%'],
                default: null
            },
            claimsValueProcessed: {
                type: Number,
                default: 0
            },

            // Quality & QA Summary
            averageQaScore: {
                type: Number,
                min: [0, 'QA score cannot be negative'],
                max: [100, 'QA score cannot exceed 100%'],
                default: null
            },
            totalQaReviews: {
                type: Number,
                default: 0
            },
            qaPassRate: {
                type: Number,
                min: [0, 'QA pass rate cannot be negative'],
                max: [100, 'QA pass rate cannot exceed 100%'],
                default: null
            },
            qualityImprovement: {
                type: Number,
                default: 0 // Percentage improvement from previous month
            },

            // Denial Management Summary
            totalDenials: {
                type: Number,
                default: 0
            },
            monthlyDenialRate: {
                type: Number,
                min: [0, 'Denial rate cannot be negative'],
                max: [100, 'Denial rate cannot exceed 100%'],
                default: null
            },
            denialResolutionRate: {
                type: Number,
                min: [0, 'Resolution rate cannot be negative'],
                max: [100, 'Resolution rate cannot exceed 100%'],
                default: null
            },
            averageDenialResolutionTime: {
                type: Number, // in days
                default: null
            },
            denialRecoveryAmount: {
                type: Number,
                default: 0
            },

            // Financial Performance Summary
            totalBilledAmount: {
                type: Number,
                default: 0
            },
            totalCollectedAmount: {
                type: Number,
                default: 0
            },
            monthlyCollectionRate: {
                type: Number,
                min: [0, 'Collection rate cannot be negative'],
                max: [100, 'Collection rate cannot exceed 100%'],
                default: null
            },
            arDaysImprovement: {
                type: Number,
                default: 0 // Improvement in AR days
            },
            revenueGenerated: {
                type: Number,
                default: 0
            },

            // Patient Services Summary
            totalEligibilityChecks: {
                type: Number,
                default: 0
            },
            totalAuthorizationsObtained: {
                type: Number,
                default: 0
            },
            totalPatientRegistrations: {
                type: Number,
                default: 0
            },
            averagePatientSatisfaction: {
                type: Number,
                min: [0, 'Satisfaction score cannot be negative'],
                max: [10, 'Satisfaction score cannot exceed 10'],
                default: null
            },

            // SLA & Compliance Summary
            slaComplianceRate: {
                type: Number,
                min: [0, 'SLA compliance cannot be negative'],
                max: [100, 'SLA compliance cannot exceed 100%'],
                default: null
            },
            slaViolationsCount: {
                type: Number,
                default: 0
            },
            averageProcessingTime: {
                type: Number, // in hours
                default: null
            },
            workflowEfficiencyScore: {
                type: Number,
                min: [0, 'Efficiency score cannot be negative'],
                max: [100, 'Efficiency score cannot exceed 100%'],
                default: null
            },

            // Performance Rankings
            monthlyOverallRank: {
                type: Number,
                default: null
            },
            claimsVolumeRank: {
                type: Number,
                default: null
            },
            qualityRank: {
                type: Number,
                default: null
            },
            speedRank: {
                type: Number,
                default: null
            },
            customerServiceRank: {
                type: Number,
                default: null
            },

            // Goals & Targets
            volumeTargetAchievement: {
                type: Number,
                min: [0, 'Target achievement cannot be negative'],
                default: null
            },
            qualityTargetAchievement: {
                type: Number,
                min: [0, 'Target achievement cannot be negative'],
                default: null
            },
            slaTargetAchievement: {
                type: Number,
                min: [0, 'Target achievement cannot be negative'],
                default: null
            },

            // Recognition & Achievements
            monthlyAchievements: [{
                achievementType: {
                    type: String,
                    enum: [
                        "Volume Leader", "Quality Champion", "Speed Star", "Zero Denials",
                        "Perfect SLA", "Customer Favorite", "Team Player", "Innovation Award"
                    ]
                },
                description: String,
                pointsAwarded: Number,
                earnedDate: {
                    type: Date,
                    default: Date.now
                }
            }]
        }
    }],

    // Overall Performance Stats
    overallStats: {
        totalTasksCompleted: {
            type: Number,
            default: 0
        },
        averageQualityScore: {
            type: Number,
            min: [0, 'Average quality score cannot be negative'],
            max: [100, 'Average quality score cannot exceed 100%'],
            default: null
        },
        currentStreak: {
            type: Number,
            default: 0 // Days of consecutive goal achievement
        },
        longestStreak: {
            type: Number,
            default: 0
        },
        totalExperiencePoints: {
            type: Number,
            default: 0,
            min: [0, 'Experience points cannot be negative']
        },
        currentLevel: {
            type: Number,
            default: 1,
            min: [1, 'Level must be at least 1']
        },
        badges: [{
            badgeName: {
                type: String,
                enum: [
                    "First Task", "Speed Demon", "Quality Champion", "Consistency King",
                    "Problem Solver", "Team Player", "Mentor", "Innovation Star",
                    "Customer Favorite", "Perfect Week", "Monthly Star", "Annual Champion"
                ]
            },
            earnedDate: {
                type: Date,
                default: Date.now
            },
            description: String
        }],
        performanceHistory: [{
            evaluationDate: {
                type: Date,
                // required: true
            },
            evaluatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
                // required: true
            },
            overallRating: {
                type: String,
                enum: ["Outstanding", "Exceeds Expectations", "Meets Expectations", "Below Expectations", "Needs Improvement"],
                // required: true
            },
            strengths: [String],
            improvementAreas: [String],
            goals: [String],
            feedback: String
        }],
        // 🆕 RCM Overall Performance Stats
        rcmOverallStats: {
            totalClaimsProcessed: {
                type: Number,
                default: 0
            },
            lifetimeCleanClaimRate: {
                type: Number,
                min: [0, 'Clean claim rate cannot be negative'],
                max: [100, 'Clean claim rate cannot exceed 100%'],
                default: null
            },
            lifetimeFirstPassRate: {
                type: Number,
                min: [0, 'First pass rate cannot be negative'],
                max: [100, 'First pass rate cannot exceed 100%'],
                default: null
            },
            totalQaReviews: {
                type: Number,
                default: 0
            },
            lifetimeQaScore: {
                type: Number,
                min: [0, 'QA score cannot be negative'],
                max: [100, 'QA score cannot exceed 100%'],
                default: null
            },
            totalDenialsHandled: {
                type: Number,
                default: 0
            },
            lifetimeDenialResolutionRate: {
                type: Number,
                min: [0, 'Resolution rate cannot be negative'],
                max: [100, 'Resolution rate cannot exceed 100%'],
                default: null
            },
            totalRevenueGenerated: {
                type: Number,
                default: 0
            },
            lifetimeCollectionRate: {
                type: Number,
                min: [0, 'Collection rate cannot be negative'],
                max: [100, 'Collection rate cannot exceed 100%'],
                default: null
            },
            totalPatientInteractions: {
                type: Number,
                default: 0
            },
            averagePatientSatisfaction: {
                type: Number,
                min: [0, 'Satisfaction score cannot be negative'],
                max: [10, 'Satisfaction score cannot exceed 10'],
                default: null
            },
            bestMonthlyRank: {
                type: Number,
                default: null
            },
            consecutiveMonthsTopPerformer: {
                type: Number,
                default: 0
            },
            specialistCertifications: [{
                specialization: {
                    type: String,
                    enum: [
                        "Claims Processing Expert", "Denial Management Specialist", "QA Champion",
                        "Patient Services Expert", "EDI Specialist", "Revenue Cycle Analyst",
                        "Compliance Expert", "Workflow Optimizer"
                    ]
                },
                earnedDate: {
                    type: Date,
                    default: Date.now
                },
                level: {
                    type: String,
                    enum: ["Bronze", "Silver", "Gold", "Platinum"],
                    default: "Bronze"
                }
            }]
        }
    }
}, { _id: false });

// 🆕 RCM Performance Calculation Methods
performanceMetricsSchema.methods.calculateDailyRcmMetrics = function (date) {
    const dailyMetric = this.dailyMetrics.find(m =>
        m.date.toDateString() === date.toDateString()
    );

    if (dailyMetric && dailyMetric.rcmMetrics) {
        const rcm = dailyMetric.rcmMetrics;

        // Calculate rates
        if (rcm.claimsSubmitted > 0) {
            rcm.cleanClaimRate = Math.round((rcm.cleanClaimsSubmitted / rcm.claimsSubmitted) * 100);
            rcm.firstPassRate = Math.round((rcm.cleanClaimsSubmitted / rcm.claimsSubmitted) * 100);
        }

        if (rcm.qaReviews > 0) {
            rcm.qaScore = Math.round((rcm.qaPassCount / rcm.qaReviews) * 100);
        }

        if (rcm.claimsProcessed > 0) {
            rcm.denialRate = Math.round((rcm.denialCount / rcm.claimsProcessed) * 100);
        }

        if (rcm.denialCount > 0) {
            rcm.denialResolutionRate = Math.round((rcm.denialResolved / rcm.denialCount) * 100);
        }

        if (rcm.totalBilledAmount > 0) {
            rcm.collectionRate = Math.round((rcm.totalCollectedAmount / rcm.totalBilledAmount) * 100);
        }
    }
};

performanceMetricsSchema.methods.updateWeeklyRcmSummary = function (weekStart, weekEnd) {
    const weeklyMetric = this.weeklyMetrics.find(w =>
        w.weekStart.getTime() === weekStart.getTime()
    );

    if (weeklyMetric) {
        const dailyMetricsInWeek = this.dailyMetrics.filter(d =>
            d.date >= weekStart && d.date <= weekEnd
        );

        let totalClaims = 0, totalCleanClaims = 0, totalQaReviews = 0, totalQaPasses = 0;
        let totalDenials = 0, totalBilled = 0, totalCollected = 0;

        dailyMetricsInWeek.forEach(daily => {
            if (daily.rcmMetrics) {
                totalClaims += daily.rcmMetrics.claimsSubmitted;
                totalCleanClaims += daily.rcmMetrics.cleanClaimsSubmitted;
                totalQaReviews += daily.rcmMetrics.qaReviews;
                totalQaPasses += daily.rcmMetrics.qaPassCount;
                totalDenials += daily.rcmMetrics.denialCount;
                totalBilled += daily.rcmMetrics.totalBilledAmount;
                totalCollected += daily.rcmMetrics.totalCollectedAmount;
            }
        });

        weeklyMetric.rcmWeeklyMetrics = {
            totalClaimsProcessed: totalClaims,
            totalClaimsSubmitted: totalClaims,
            averageClaimsPerDay: Math.round(totalClaims / 7),
            weeklyCleanClaimRate: totalClaims > 0 ? Math.round((totalCleanClaims / totalClaims) * 100) : null,
            weeklyFirstPassRate: totalClaims > 0 ? Math.round((totalCleanClaims / totalClaims) * 100) : null,
            averageQaScore: totalQaReviews > 0 ? Math.round((totalQaPasses / totalQaReviews) * 100) : null,
            totalQaReviews: totalQaReviews,
            qaPassRate: totalQaReviews > 0 ? Math.round((totalQaPasses / totalQaReviews) * 100) : null,
            totalDenials: totalDenials,
            weeklyDenialRate: totalClaims > 0 ? Math.round((totalDenials / totalClaims) * 100) : null,
            totalBilledAmount: totalBilled,
            totalCollectedAmount: totalCollected,
            weeklyCollectionRate: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : null
        };
    }
};

export default performanceMetricsSchema;