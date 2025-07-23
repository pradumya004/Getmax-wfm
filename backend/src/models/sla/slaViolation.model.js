// backend/src/models/sla/slaViolation.model.js

import mongoose from 'mongoose';
// import crypto from 'crypto';
import { SLA_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';
import { scopedIdPlugin } from './../../plugins/scopedIdPlugin';

const slaViolationSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    violationId: {
        type: String,
        unique: true,
        // default: () => `SLAV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
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

    slaRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SLA',
        required: [true, 'SLA reference is required'],
        index: true
    },

    employeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee reference is required'],
        index: true
    },

    // ** VIOLATION DETAILS **
    violationInfo: {
        violationType: {
            type: String,
            required: [true, 'Violation type is required'],
            enum: {
                values: [
                    'TARGET_MISS', 'TIME_OVERRUN', 'QUALITY_BREACH', 'RESPONSE_DELAY',
                    'RESOLUTION_DELAY', 'AVAILABILITY_BREACH', 'ESCALATION_TIMEOUT'
                ],
                message: 'Invalid violation type'
            },
            index: true
        },
        severity: {
            type: String,
            required: [true, 'Severity is required'],
            enum: {
                values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
                message: 'Invalid severity level'
            },
            index: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: [
                    'PERFORMANCE', 'QUALITY', 'AVAILABILITY', 'RESPONSIVENESS',
                    'PROCESS_COMPLIANCE', 'CUSTOMER_SERVICE'
                ],
                message: 'Invalid category'
            },
            index: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters']
        }
    },

    // ** VIOLATION METRICS **
    violationMetrics: {
        targetValue: {
            type: Number,
            required: [true, 'Target value is required'],
            min: [0, 'Target value cannot be negative']
        },
        actualValue: {
            type: Number,
            required: [true, 'Actual value is required'],
            min: [0, 'Actual value cannot be negative']
        },
        varianceValue: {
            type: Number,
            required: [true, 'Variance value is required']
        },
        variancePercentage: {
            type: Number,
            required: [true, 'Variance percentage is required']
        },
        unit: {
            type: String,
            required: [true, 'Unit is required'],
            enum: {
                values: ['HOURS', 'MINUTES', 'DAYS', 'PERCENTAGE', 'COUNT', 'CALLS_PER_HOUR', 'ACCURACY_RATE'],
                message: 'Invalid unit'
            }
        },

        // Impact Assessment
        impactAssessment: {
            businessImpact: {
                type: String,
                enum: ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'SEVERE'],
                default: 'LOW'
            },
            customerImpact: {
                type: String,
                enum: ['NONE', 'MINIMAL', 'MODERATE', 'SIGNIFICANT', 'CRITICAL'],
                default: 'NONE'
            },
            financialImpact: {
                type: mongoose.Schema.Types.Decimal128,
                default: 0.00
            },
            reputationalImpact: {
                type: String,
                enum: ['NONE', 'MINIMAL', 'MODERATE', 'SIGNIFICANT', 'SEVERE'],
                default: 'NONE'
            }
        }
    },

    // ** TIMING INFORMATION **
    timingInfo: {
        violationStartTime: {
            type: Date,
            required: [true, 'Violation start time is required'],
            index: true
        },
        violationEndTime: Date,
        detectedAt: {
            type: Date,
            required: [true, 'Detection time is required'],
            default: Date.now
        },
        reportedAt: Date,
        acknowledgedAt: Date,
        resolvedAt: Date,

        // Duration Metrics
        violationDuration: {
            type: Number, // minutes
            min: [0, 'Violation duration cannot be negative']
        },
        detectionDelay: {
            type: Number, // minutes
            min: [0, 'Detection delay cannot be negative']
        },
        resolutionTime: {
            type: Number, // minutes
            min: [0, 'Resolution time cannot be negative']
        }
    },

    // ** ROOT CAUSE ANALYSIS **
    rootCauseAnalysis: {
        primaryCause: {
            type: String,
            enum: [
                'WORKLOAD_OVERLOAD', 'SKILL_GAP', 'SYSTEM_FAILURE', 'PROCESS_ISSUE',
                'RESOURCE_SHORTAGE', 'TRAINING_DEFICIT', 'COMMUNICATION_BREAKDOWN',
                'EXTERNAL_DEPENDENCY', 'POLICY_UNCLEAR', 'TOOL_LIMITATION', 'OTHER'
            ]
        },
        contributingFactors: [{
            factor: {
                type: String,
                enum: [
                    'HIGH_VOLUME', 'COMPLEX_CASE', 'SYSTEM_SLOW', 'UNCLEAR_INSTRUCTIONS',
                    'MISSING_INFORMATION', 'PRIORITY_CONFLICT', 'INTERRUPTION', 'TECHNICAL_ISSUE'
                ]
            },
            impact: {
                type: String,
                enum: ['MINOR', 'MODERATE', 'MAJOR'],
                default: 'MINOR'
            },
            description: String
        }],
        analysisNotes: {
            type: String,
            trim: true,
            maxlength: [2000, 'Analysis notes cannot exceed 2000 characters']
        },
        analyzedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        analyzedAt: Date
    },

    // ** RELATED ENTITIES **
    relatedEntities: {
        taskRef: {
            entityType: String,
            entityId: mongoose.Schema.Types.ObjectId
        },
        claimRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Claim'
        },
        qaReviewRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QAReview'
        },
        chTransactionRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CHTransaction'
        },
        patientRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        },
        clientRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        }
    },

    // ** ESCALATION TRACKING **
    escalationInfo: {
        isEscalated: {
            type: Boolean,
            default: false,
            index: true
        },
        escalationLevel: {
            type: Number,
            min: [0, 'Escalation level cannot be negative'],
            default: 0
        },
        escalationHistory: [{
            level: {
                type: Number,
                required: true
            },
            escalatedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            escalatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            escalatedAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            reason: String,
            urgency: {
                type: String,
                enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
                default: 'MEDIUM'
            },
            acknowledgedAt: Date,
            responseTime: Number // minutes
        }],
        autoEscalationEnabled: {
            type: Boolean,
            default: true
        },
        maxEscalationLevel: {
            type: Number,
            default: 3
        }
    },

    // ** RESOLUTION DETAILS **
    resolutionInfo: {
        resolutionStatus: {
            type: String,
            required: [true, 'Resolution status is required'],
            enum: {
                values: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED', 'DEFERRED'],
                message: 'Invalid resolution status'
            },
            default: 'OPEN',
            index: true
        },
        resolutionMethod: {
            type: String,
            enum: [
                'IMMEDIATE_FIX', 'PROCESS_ADJUSTMENT', 'TRAINING_PROVIDED', 'SYSTEM_UPGRADE',
                'RESOURCE_ALLOCATION', 'POLICY_CLARIFICATION', 'WORKFLOW_OPTIMIZATION', 'OTHER'
            ]
        },
        resolutionDescription: {
            type: String,
            trim: true,
            maxlength: [2000, 'Resolution description cannot exceed 2000 characters']
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        resolutionEffectiveness: {
            type: String,
            enum: ['EXCELLENT', 'GOOD', 'SATISFACTORY', 'POOR'],
            index: true
        },

        // Action Items
        actionItems: [{
            action: {
                type: String,
                required: true,
                trim: true
            },
            assignedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            dueDate: {
                type: Date,
                required: true
            },
            priority: {
                type: String,
                enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
                default: 'MEDIUM'
            },
            status: {
                type: String,
                enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED'],
                default: 'PENDING'
            },
            completedAt: Date,
            completedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            notes: String
        }]
    },

    // ** PREVENTION MEASURES **
    preventionMeasures: {
        immediateActions: [{
            action: String,
            implementedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            implementedAt: Date,
            effectiveness: {
                type: String,
                enum: ['HIGH', 'MEDIUM', 'LOW']
            }
        }],
        longTermMeasures: [{
            measure: String,
            targetDate: Date,
            responsiblePerson: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            status: {
                type: String,
                enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
                default: 'PLANNED'
            },
            successMetrics: String
        }],
        policyChanges: [{
            changeDescription: String,
            affectedPolicies: [String],
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            implementationDate: Date
        }]
    },

    // ** RECURRENCE TRACKING **
    recurrenceInfo: {
        isRecurring: {
            type: Boolean,
            default: false,
            index: true
        },
        recurrencePattern: {
            type: String,
            enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'IRREGULAR', 'TREND_BASED']
        },
        previousOccurrences: [{
            violationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SLAViolation'
            },
            occurredAt: Date,
            severity: String,
            resolved: Boolean
        }],
        similarityScore: {
            type: Number,
            min: [0, 'Similarity score cannot be negative'],
            max: [100, 'Similarity score cannot exceed 100']
        },
        patternAnalysis: {
            frequency: Number,
            avgDuration: Number,
            commonCauses: [String],
            riskFactors: [String]
        }
    },

    // ** NOTIFICATIONS & COMMUNICATION **
    notificationInfo: {
        notificationsSent: [{
            notificationType: {
                type: String,
                enum: ['VIOLATION_ALERT', 'ESCALATION_NOTICE', 'RESOLUTION_UPDATE', 'FOLLOW_UP'],
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
            channel: {
                type: String,
                enum: ['EMAIL', 'SMS', 'IN_APP', 'WEBHOOK', 'PHONE'],
                default: 'IN_APP'
            },
            acknowledged: {
                type: Boolean,
                default: false
            },
            acknowledgedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            acknowledgedAt: Date
        }],

        communicationLog: [{
            timestamp: {
                type: Date,
                default: Date.now
            },
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            to: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }],
            message: String,
            messageType: {
                type: String,
                enum: ['UPDATE', 'INQUIRY', 'INSTRUCTION', 'CLARIFICATION'],
                default: 'UPDATE'
            }
        }]
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
        description: String,
        category: {
            type: String,
            enum: ['EVIDENCE', 'ANALYSIS', 'RESOLUTION', 'COMMUNICATION'],
            default: 'EVIDENCE'
        }
    }],

    // ** TAGS & CATEGORIZATION **
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],

    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'MEDIUM',
        index: true
    },

    // ** COMPLIANCE & AUDIT **
    complianceInfo: {
        regulatoryImpact: {
            type: Boolean,
            default: false
        },
        regulatoryBodies: [String],
        complianceRisk: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            default: 'LOW'
        },
        auditTrail: [{
            action: String,
            performedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            performedAt: {
                type: Date,
                default: Date.now
            },
            details: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES **
slaViolationSchema.index({ companyRef: 1, employeeRef: 1, 'timingInfo.violationStartTime': -1 });
slaViolationSchema.index({ slaRef: 1, 'violationInfo.severity': 1 });
slaViolationSchema.index({ 'resolutionInfo.resolutionStatus': 1, 'escalationInfo.isEscalated': 1 });
slaViolationSchema.index({ 'violationInfo.violationType': 1, 'violationInfo.category': 1 });
slaViolationSchema.index({ 'recurrenceInfo.isRecurring': 1, 'timingInfo.violationStartTime': -1 });

// ** VIRTUALS **
slaViolationSchema.virtual('isActive').get(function () {
    return ['OPEN', 'IN_PROGRESS'].includes(this.resolutionInfo?.resolutionStatus);
});

slaViolationSchema.virtual('ageInHours').get(function () {
    const start = this.timingInfo?.violationStartTime;
    const end = this.timingInfo?.resolvedAt || new Date();
    return start ? Math.floor((end - start) / (1000 * 60 * 60)) : 0;
});

slaViolationSchema.virtual('isOverdue').get(function () {
    const openTime = this.timingInfo?.violationStartTime;
    if (!openTime) return false;

    const hoursSinceOpen = (new Date() - openTime) / (1000 * 60 * 60);
    const thresholds = { LOW: 48, MEDIUM: 24, HIGH: 8, CRITICAL: 2 };

    return hoursSinceOpen > thresholds[this.violationInfo?.severity] || 0;
});

slaViolationSchema.virtual('riskScore').get(function () {
    let score = 0;

    // Severity impact
    const severityWeight = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
    score += severityWeight[this.violationInfo?.severity] || 0;

    // Business impact
    const impactWeight = { MINIMAL: 1, LOW: 2, MEDIUM: 3, HIGH: 4, SEVERE: 5 };
    score += impactWeight[this.violationMetrics?.impactAssessment?.businessImpact] || 0;

    // Recurrence factor
    if (this.recurrenceInfo?.isRecurring) score += 2;

    // Age factor
    if (this.ageInHours > 24) score += 1;
    if (this.ageInHours > 72) score += 2;

    return Math.min(10, score);
});

// ** STATIC METHODS **
slaViolationSchema.statics.findActiveViolations = function (companyId, employeeId = null) {
    const query = {
        companyRef: companyId,
        'resolutionInfo.resolutionStatus': { $in: ['OPEN', 'IN_PROGRESS'] }
    };

    if (employeeId) {
        query.employeeRef = employeeId;
    }

    return this.find(query)
        .populate('slaRef employeeRef')
        .sort({ 'violationInfo.severity': 1, 'timingInfo.violationStartTime': -1 });
};

slaViolationSchema.statics.getViolationTrends = function (companyId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'timingInfo.violationStartTime': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$timingInfo.violationStartTime' } },
                    severity: '$violationInfo.severity'
                },
                count: { $sum: 1 },
                avgResolutionTime: { $avg: '$timingInfo.resolutionTime' }
            }
        },
        {
            $group: {
                _id: '$_id.date',
                violations: {
                    $push: {
                        severity: '$_id.severity',
                        count: '$count',
                        avgResolutionTime: '$avgResolutionTime'
                    }
                },
                totalViolations: { $sum: '$count' }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
};

slaViolationSchema.statics.getRecurringViolations = function (companyId, threshold = 3) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'recurrenceInfo.isRecurring': true
            }
        },
        {
            $group: {
                _id: {
                    employee: '$employeeRef',
                    violationType: '$violationInfo.violationType'
                },
                count: { $sum: 1 },
                avgSeverity: {
                    $avg: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$violationInfo.severity', 'LOW'] }, then: 1 },
                                { case: { $eq: ['$violationInfo.severity', 'MEDIUM'] }, then: 2 },
                                { case: { $eq: ['$violationInfo.severity', 'HIGH'] }, then: 3 },
                                { case: { $eq: ['$violationInfo.severity', 'CRITICAL'] }, then: 4 }
                            ],
                            default: 1
                        }
                    }
                },
                lastOccurrence: { $max: '$timingInfo.violationStartTime' }
            }
        },
        {
            $match: {
                count: { $gte: threshold }
            }
        },
        {
            $lookup: {
                from: 'employees',
                localField: '_id.employee',
                foreignField: '_id',
                as: 'employee'
            }
        },
        {
            $sort: { count: -1, avgSeverity: -1 }
        }
    ]);
};

// ** INSTANCE METHODS **
slaViolationSchema.methods.escalate = function (escalatedBy, reason = '') {
    const currentLevel = this.escalationInfo?.escalationLevel || 0;
    const nextLevel = currentLevel + 1;

    if (nextLevel > this.escalationInfo?.maxEscalationLevel) {
        throw new Error('Maximum escalation level reached');
    }

    this.escalationInfo.isEscalated = true;
    this.escalationInfo.escalationLevel = nextLevel;
    this.escalationInfo.escalationHistory.push({
        level: nextLevel,
        escalatedBy,
        escalatedAt: new Date(),
        reason: reason || `Level ${nextLevel} escalation`
    });

    return this.save();
};

slaViolationSchema.methods.resolve = function (resolvedBy, resolutionDescription, resolutionMethod) {
    this.resolutionInfo.resolutionStatus = 'RESOLVED';
    this.resolutionInfo.resolvedBy = resolvedBy;
    this.resolutionInfo.resolutionDescription = resolutionDescription;
    this.resolutionInfo.resolutionMethod = resolutionMethod;
    this.timingInfo.resolvedAt = new Date();

    return this.save();
};

slaViolationSchema.methods.addActionItem = function (action, assignedTo, dueDate, priority = 'MEDIUM') {
    this.resolutionInfo.actionItems.push({
        action,
        assignedTo,
        dueDate,
        priority,
        status: 'PENDING'
    });

    return this.save();
};

slaViolationSchema.methods.checkForSimilarViolations = function () {
    return this.constructor.find({
        companyRef: this.companyRef,
        employeeRef: this.employeeRef,
        'violationInfo.violationType': this.violationInfo?.violationType,
        'rootCauseAnalysis.primaryCause': this.rootCauseAnalysis?.primaryCause,
        _id: { $ne: this._id }
    }).sort({ 'timingInfo.violationStartTime': -1 }).limit(5);
};

// ** PLUGINS **
slaViolationSchema.plugin(scopedIdPlugin, {
    idField: 'violationId',
    prefix: 'SLA-VLT',
    companyRefPath: 'companyRef'
})

// ** MIDDLEWARE **
slaViolationSchema.pre('save', function (next) {
    // Calculate variance
    if (this.violationMetrics?.targetValue && this.violationMetrics?.actualValue) {
        this.violationMetrics.varianceValue =
            this.violationMetrics.actualValue - this.violationMetrics.targetValue;
        this.violationMetrics.variancePercentage =
            Math.round((this.violationMetrics.varianceValue / this.violationMetrics.targetValue) * 100);
    }

    // Calculate durations
    if (this.timingInfo?.violationStartTime) {
        const start = this.timingInfo.violationStartTime;
        const detected = this.timingInfo.detectedAt;
        const resolved = this.timingInfo.resolvedAt;

        if (detected) {
            this.timingInfo.detectionDelay = Math.floor((detected - start) / (1000 * 60));
        }

        if (resolved) {
            this.timingInfo.violationDuration = Math.floor((resolved - start) / (1000 * 60));
            this.timingInfo.resolutionTime = Math.floor((resolved - detected) / (1000 * 60));
        }
    }

    // Auto-set severity based on variance
    if (!this.violationInfo?.severity && this.violationMetrics?.variancePercentage) {
        const variance = Math.abs(this.violationMetrics.variancePercentage);
        if (variance > 50) this.violationInfo.severity = 'CRITICAL';
        else if (variance > 25) this.violationInfo.severity = 'HIGH';
        else if (variance > 10) this.violationInfo.severity = 'MEDIUM';
        else this.violationInfo.severity = 'LOW';
    }

    next();
});

slaViolationSchema.post('save', async function (doc) {
    try {
        // Create escalation if needed
        if (doc.isNew && doc.violationInfo?.severity === 'CRITICAL') {
            // Auto-escalate critical violations
            const SLA = mongoose.model('SLA');
            const sla = await SLA.findById(doc.slaRef);

            if (sla?.escalationRules?.enableEscalation) {
                const firstLevel = sla.escalationRules.escalationLevels?.find(level => level.level === 1);
                if (firstLevel) {
                    doc.escalationInfo.isEscalated = true;
                    doc.escalationInfo.escalationLevel = 1;
                    doc.escalationInfo.escalationHistory.push({
                        level: 1,
                        escalatedTo: firstLevel.escalateTo[0]?.employeeRef,
                        escalatedBy: doc.employeeRef,
                        escalatedAt: new Date(),
                        reason: 'Auto-escalation for critical violation',
                        urgency: 'URGENT'
                    });
                    await doc.save();
                }
            }
        }

        // Create notification
        if (doc.isNew || doc.isModified('escalationInfo.isEscalated')) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.employeeRef,
                type: doc.escalationInfo?.isEscalated ? 'SLA_ESCALATION' : 'SLA_VIOLATION',
                title: doc.escalationInfo?.isEscalated ? 'SLA Violation Escalated' : 'SLA Violation Recorded',
                message: `${doc.violationInfo.violationType} violation - ${doc.violationInfo.description}`,
                priority: doc.violationInfo?.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
                relatedEntity: {
                    entityType: 'SLAViolation',
                    entityId: doc._id
                }
            });
        }

        // Deduct XP for violations
        if (doc.isNew) {
            const Employee = mongoose.model('Employee');
            const penaltyXP = {
                'LOW': -5,
                'MEDIUM': -10,
                'HIGH': -20,
                'CRITICAL': -50
            };

            await Employee.findByIdAndUpdate(
                doc.employeeRef,
                {
                    $inc: {
                        'gamification.experience.totalXP': penaltyXP[doc.violationInfo?.severity] || 0
                    }
                }
            );
        }

    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

export const SLAViolation = mongoose.model('SLAViolation', slaViolationSchema, 'slaViolations');