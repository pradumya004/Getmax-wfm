// backend/src/models/qa/qaReview.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { QA_CONSTANTS, SLA_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

const qaReviewSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    reviewId: {
        type: String,
        unique: true,
        // default: () => `QAR-${uuidv4().substring(0, 8).toUpperCase()}`,
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

    qaWorkflowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QA',
        required: [true, 'QA workflow reference is required'],
        index: true
    },

    reviewedEmployeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Reviewed employee reference is required'],
        index: true
    },

    auditorRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Auditor reference is required'],
        index: true
    },

    // ** REVIEWED ITEM INFORMATION **
    reviewedItem: {
        itemType: {
            type: String,
            required: [true, 'Item type is required'],
            enum: {
                values: [
                    'CLAIM', 'TASK', 'CALL', 'DOCUMENT', 'PROCESS',
                    'CODING', 'AUTHORIZATION', 'VERIFICATION', 'POSTING'
                ],
                message: 'Invalid item type'
            },
            index: true
        },
        itemId: {
            type: String,
            required: [true, 'Item ID is required'],
            trim: true,
            index: true
        },
        itemReference: {
            entityType: String,
            entityId: mongoose.Schema.Types.ObjectId
        },
        patientInfo: {
            patientId: String,
            patientName: String,
            mrn: String,
            dateOfService: Date
        },
        serviceInfo: {
            serviceType: String,
            procedureCodes: [String],
            diagnosisCodes: [String],
            claimAmount: mongoose.Schema.Types.Decimal128
        }
    },

    // ** REVIEW STATUS & TIMING **
    reviewStatus: {
        currentStatus: {
            type: String,
            required: [true, 'Current status is required'],
            enum: {
                values: Object.values(QA_CONSTANTS.QA_STATUS),
                message: 'Invalid review status'
            },
            default: QA_CONSTANTS.QA_STATUS.PENDING,
            index: true
        },
        assignedAt: {
            type: Date,
            required: [true, 'Assigned time is required'],
            default: Date.now,
            index: true
        },
        startedAt: Date,
        completedAt: Date,
        submittedAt: Date,

        // SLA Tracking
        expectedCompletionTime: {
            type: Date,
            required: [true, 'Expected completion time is required'],
            index: true
        },
        slaStatus: {
            type: String,
            enum: Object.values(SLA_CONSTANTS.SLA_STATUS),
            default: SLA_CONSTANTS.SLA_STATUS.ON_TRACK,
            index: true
        },
        isOverdue: {
            type: Boolean,
            default: false,
            index: true
        }
    },

    // ** REVIEW RESULTS **
    reviewResults: {
        overallScore: {
            type: Number,
            min: [0, 'Overall score cannot be negative'],
            max: [100, 'Overall score cannot exceed 100']
        },
        isPassed: {
            type: Boolean,
            index: true
        },
        isCriticalFailure: {
            type: Boolean,
            default: false,
            index: true
        },

        // Individual Checklist Results
        checklistResults: [{
            itemId: {
                type: String,
                required: true
            },
            checkPoint: String,
            category: {
                type: String,
                enum: Object.values(QA_CONSTANTS.ERROR_CATEGORIES),
                required: true
            },
            passed: {
                type: Boolean,
                required: true
            },
            pointsAwarded: {
                type: Number,
                min: [0, 'Points awarded cannot be negative']
            },
            maxPoints: {
                type: Number,
                min: [0, 'Max points cannot be negative']
            },
            notes: String,
            evidenceAttachments: [{
                fileName: String,
                filePath: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }]
        }],

        // Error Summary
        errorSummary: {
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
            errorsByCategory: {
                type: Map,
                of: Number,
                default: new Map()
            }
        },

        // Scoring Details
        scoringDetails: {
            totalPossiblePoints: {
                type: Number,
                min: [0, 'Total possible points cannot be negative']
            },
            totalEarnedPoints: {
                type: Number,
                min: [0, 'Total earned points cannot be negative']
            },
            bonusPoints: {
                type: Number,
                default: 0,
                min: [0, 'Bonus points cannot be negative']
            },
            penaltyPoints: {
                type: Number,
                default: 0,
                min: [0, 'Penalty points cannot be negative']
            }
        }
    },

    // ** FEEDBACK & COMMUNICATION **
    feedback: {
        overallFeedback: {
            type: String,
            trim: true,
            maxlength: [2000, 'Overall feedback cannot exceed 2000 characters']
        },
        strengthsNoted: [{
            type: String,
            trim: true,
            maxlength: [500, 'Strength note cannot exceed 500 characters']
        }],
        areasForImprovement: [{
            area: String,
            priority: {
                type: String,
                enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
                default: 'MEDIUM'
            },
            recommendation: String,
            trainingRequired: {
                type: Boolean,
                default: false
            }
        }],
        actionItems: [{
            item: {
                type: String,
                required: true,
                trim: true
            },
            dueDate: Date,
            assignedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            status: {
                type: String,
                enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'],
                default: 'PENDING'
            },
            completedAt: Date,
            completedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }]
    },

    // ** REBUTTAL PROCESS **
    rebuttal: {
        isRebuttalAllowed: {
            type: Boolean,
            default: true
        },
        rebuttalDeadline: Date,
        rebuttalSubmitted: {
            type: Boolean,
            default: false
        },
        rebuttalDetails: {
            submittedAt: Date,
            submittedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            rebuttalText: {
                type: String,
                trim: true,
                maxlength: [3000, 'Rebuttal text cannot exceed 3000 characters']
            },
            disputedItems: [{
                itemId: String,
                disputeReason: String,
                supportingEvidence: String,
                evidenceAttachments: [{
                    fileName: String,
                    filePath: String,
                    uploadedAt: {
                        type: Date,
                        default: Date.now
                    }
                }]
            }],
            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reviewedAt: Date,
            resolution: {
                type: String,
                enum: ['ACCEPTED', 'PARTIALLY_ACCEPTED', 'REJECTED', 'UNDER_REVIEW'],
                index: true
            },
            resolutionNotes: String,
            finalScore: Number
        }
    },

    // ** CALIBRATION DATA **
    calibrationInfo: {
        isCalibrationReview: {
            type: Boolean,
            default: false,
            index: true
        },
        goldStandardScore: {
            type: Number,
            min: [0, 'Gold standard score cannot be negative'],
            max: [100, 'Gold standard score cannot exceed 100']
        },
        calibrationAccuracy: {
            type: Number,
            min: [0, 'Calibration accuracy cannot be negative'],
            max: [100, 'Calibration accuracy cannot exceed 100']
        },
        calibrationSession: {
            sessionId: String,
            sessionDate: Date,
            participants: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }]
        },
        varianceAnalysis: {
            scoreVariance: Number,
            categoryVariances: {
                type: Map,
                of: Number
            },
            consistencyRating: {
                type: String,
                enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR']
            }
        }
    },

    // ** FOLLOW-UP TRACKING **
    followUpActions: {
        trainingRecommended: {
            type: Boolean,
            default: false
        },
        trainingCompleted: {
            type: Boolean,
            default: false
        },
        trainingCompletedAt: Date,
        coachingSession: {
            isRequired: {
                type: Boolean,
                default: false
            },
            scheduledAt: Date,
            completedAt: Date,
            completedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        },
        reReview: {
            isRequired: {
                type: Boolean,
                default: false
            },
            scheduledAt: Date,
            completedAt: Date,
            reReviewId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'QAReview'
            }
        }
    },

    // ** ATTACHMENTS & EVIDENCE **
    attachments: [{
        fileName: {
            type: String,
            required: true,
            trim: true
        },
        fileType: String,
        fileSize: Number,
        filePath: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        description: String
    }],

    // ** TAGS & CATEGORIZATION **
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],

    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM',
        index: true
    },

    // ** NOTIFICATIONS SENT **
    notificationsSent: [{
        type: {
            type: String,
            enum: ['ASSIGNMENT', 'REMINDER', 'ESCALATION', 'COMPLETION', 'REBUTTAL'],
            required: true
        },
        sentTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }],
        sentAt: {
            type: Date,
            default: Date.now
        },
        acknowledged: {
            type: Boolean,
            default: false
        },
        acknowledgedAt: Date
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES **
qaReviewSchema.index({ companyRef: 1, auditorRef: 1, 'reviewStatus.currentStatus': 1 });
qaReviewSchema.index({ reviewedEmployeeRef: 1, 'reviewStatus.assignedAt': -1 });
qaReviewSchema.index({ 'reviewStatus.expectedCompletionTime': 1, 'reviewStatus.isOverdue': 1 });
qaReviewSchema.index({ 'reviewedItem.itemType': 1, 'reviewStatus.currentStatus': 1 });
qaReviewSchema.index({ 'calibrationInfo.isCalibrationReview': 1, createdAt: -1 });

// ** VIRTUALS **
qaReviewSchema.virtual('reviewDuration').get(function () {
    if (!this.reviewStatus?.startedAt || !this.reviewStatus?.completedAt) return null;
    return Math.floor((this.reviewStatus.completedAt - this.reviewStatus.startedAt) / (1000 * 60));
});

qaReviewSchema.virtual('timeToCompletion').get(function () {
    if (!this.reviewStatus?.assignedAt || !this.reviewStatus?.completedAt) return null;
    return Math.floor((this.reviewStatus.completedAt - this.reviewStatus.assignedAt) / (1000 * 60));
});

qaReviewSchema.virtual('isOverdue').get(function () {
    return new Date() > this.reviewStatus?.expectedCompletionTime &&
        this.reviewStatus?.currentStatus !== QA_CONSTANTS.QA_STATUS.PASSED &&
        this.reviewStatus?.currentStatus !== QA_CONSTANTS.QA_STATUS.FAILED;
});

qaReviewSchema.virtual('needsAttention').get(function () {
    return this.reviewResults?.isCriticalFailure ||
        this.isOverdue ||
        (this.rebuttal?.rebuttalSubmitted && this.rebuttal?.rebuttalDetails?.resolution === 'UNDER_REVIEW');
});

// ** STATIC METHODS **
qaReviewSchema.statics.findOverdueReviews = function (companyId) {
    return this.find({
        companyRef: companyId,
        'reviewStatus.isOverdue': true,
        'reviewStatus.currentStatus': {
            $nin: [QA_CONSTANTS.QA_STATUS.PASSED, QA_CONSTANTS.QA_STATUS.FAILED]
        }
    }).populate('auditorRef reviewedEmployeeRef qaWorkflowRef');
};

qaReviewSchema.statics.getQualityMetrics = function (companyId, employeeId, startDate, endDate) {
    const matchStage = {
        companyRef: new mongoose.Types.ObjectId(companyId),
        'reviewStatus.completedAt': {
            $gte: startDate,
            $lte: endDate
        }
    };

    if (employeeId) {
        matchStage.reviewedEmployeeRef = new mongoose.Types.ObjectId(employeeId);
    }

    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: employeeId ? null : '$reviewedEmployeeRef',
                totalReviews: { $sum: 1 },
                passedReviews: {
                    $sum: { $cond: ['$reviewResults.isPassed', 1, 0] }
                },
                criticalFailures: {
                    $sum: { $cond: ['$reviewResults.isCriticalFailure', 1, 0] }
                },
                averageScore: { $avg: '$reviewResults.overallScore' },
                totalErrors: { $sum: '$reviewResults.errorSummary.totalErrors' },
                avgReviewTime: { $avg: '$timeToCompletion' }
            }
        },
        {
            $project: {
                employeeId: '$_id',
                totalReviews: 1,
                passedReviews: 1,
                criticalFailures: 1,
                passRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$passedReviews', '$totalReviews'] }, 100] },
                        2
                    ]
                },
                averageScore: { $round: ['$averageScore', 2] },
                errorRate: {
                    $round: [
                        { $divide: ['$totalErrors', '$totalReviews'] },
                        2
                    ]
                },
                avgReviewTimeHours: {
                    $round: [{ $divide: ['$avgReviewTime', 60] }, 2]
                }
            }
        }
    ]);
};

// ** INSTANCE METHODS **
qaReviewSchema.methods.calculateFinalScore = function () {
    if (!this.reviewResults?.checklistResults) return 0;

    let totalEarned = 0;
    let totalPossible = 0;

    this.reviewResults.checklistResults.forEach(result => {
        totalEarned += result.pointsAwarded || 0;
        totalPossible += result.maxPoints || 0;
    });

    // Add bonus points, subtract penalty points
    totalEarned += (this.reviewResults.scoringDetails?.bonusPoints || 0);
    totalEarned -= (this.reviewResults.scoringDetails?.penaltyPoints || 0);

    this.reviewResults.scoringDetails.totalEarnedPoints = totalEarned;
    this.reviewResults.scoringDetails.totalPossiblePoints = totalPossible;

    const finalScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
    this.reviewResults.overallScore = Math.max(0, Math.min(100, finalScore));

    return this.reviewResults.overallScore;
};

qaReviewSchema.methods.submitRebuttal = function (rebuttalData) {
    if (!this.rebuttal?.isRebuttalAllowed || new Date() > this.rebuttal?.rebuttalDeadline) {
        throw new Error('Rebuttal not allowed or deadline passed');
    }

    this.rebuttal.rebuttalSubmitted = true;
    this.rebuttal.rebuttalDetails = {
        ...rebuttalData,
        submittedAt: new Date(),
        resolution: 'UNDER_REVIEW'
    };

    return this.save();
};

qaReviewSchema.methods.completeReview = function (results) {
    this.reviewResults = {
        ...this.reviewResults,
        ...results
    };

    this.calculateFinalScore();

    this.reviewStatus.currentStatus = this.reviewResults.isPassed ?
        QA_CONSTANTS.QA_STATUS.PASSED : QA_CONSTANTS.QA_STATUS.FAILED;
    this.reviewStatus.completedAt = new Date();

    return this.save();
};

// ** PLUGINS **
qaReviewSchema.plugin(scopedIdPlugin, {
    idField: 'qaReviewId',
    prefix: 'QAR',
    companyRefPath: 'companyRef'
});

// ** MIDDLEWARE **
qaReviewSchema.pre('save', function (next) {
    // Update SLA status
    const now = new Date();
    if (this.reviewStatus?.expectedCompletionTime) {
        const timeRemaining = this.reviewStatus.expectedCompletionTime - now;
        const totalSLATime = this.reviewStatus.expectedCompletionTime - this.reviewStatus.assignedAt;
        const percentageRemaining = (timeRemaining / totalSLATime) * 100;

        if (timeRemaining <= 0 &&
            this.reviewStatus.currentStatus !== QA_CONSTANTS.QA_STATUS.PASSED &&
            this.reviewStatus.currentStatus !== QA_CONSTANTS.QA_STATUS.FAILED) {
            this.reviewStatus.slaStatus = SLA_CONSTANTS.SLA_STATUS.BREACHED;
            this.reviewStatus.isOverdue = true;
        } else if (percentageRemaining <= 25) {
            this.reviewStatus.slaStatus = SLA_CONSTANTS.SLA_STATUS.AT_RISK;
        } else {
            this.reviewStatus.slaStatus = SLA_CONSTANTS.SLA_STATUS.ON_TRACK;
        }
    }

    // Set rebuttal deadline
    if (this.rebuttal?.isRebuttalAllowed && !this.rebuttal?.rebuttalDeadline) {
        this.rebuttal.rebuttalDeadline = new Date(Date.now() + (48 * 60 * 60 * 1000)); // 48 hours
    }

    next();
});

qaReviewSchema.post('save', async function (doc) {
    try {
        // Award XP for completing reviews
        if (doc.isModified('reviewStatus.currentStatus') &&
            (doc.reviewStatus.currentStatus === QA_CONSTANTS.QA_STATUS.PASSED ||
                doc.reviewStatus.currentStatus === QA_CONSTANTS.QA_STATUS.FAILED)) {

            const Employee = mongoose.model('Employee');

            // XP for auditor completing review
            await Employee.findByIdAndUpdate(
                doc.auditorRef,
                {
                    $inc: {
                        'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.TASK_COMPLETED
                    }
                }
            );

            // Bonus XP for meeting SLA
            if (doc.reviewStatus.slaStatus === SLA_CONSTANTS.SLA_STATUS.RESOLVED) {
                await Employee.findByIdAndUpdate(
                    doc.auditorRef,
                    {
                        $inc: {
                            'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.SLA_MET
                        }
                    }
                );
            }

            // XP for reviewed employee if passed
            if (doc.reviewResults?.isPassed) {
                await Employee.findByIdAndUpdate(
                    doc.reviewedEmployeeRef,
                    {
                        $inc: {
                            'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.QUALITY_TARGET_MET
                        }
                    }
                );
            }
        }

        // Send notifications for critical failures or SLA breaches
        if (doc.reviewResults?.isCriticalFailure || doc.reviewStatus?.slaStatus === SLA_CONSTANTS.SLA_STATUS.BREACHED) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.reviewedEmployeeRef,
                type: doc.reviewResults?.isCriticalFailure ? 'CRITICAL_QA_FAILURE' : 'QA_SLA_BREACH',
                title: doc.reviewResults?.isCriticalFailure ? 'Critical QA Failure' : 'QA Review SLA Breach',
                message: `Review ${doc.reviewId} requires immediate attention`,
                priority: 'HIGH',
                relatedEntity: {
                    entityType: 'QAReview',
                    entityId: doc._id
                }
            });
        }

    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

export const QAReview = mongoose.model('QAReview', qaReviewSchema, 'qaReviews');