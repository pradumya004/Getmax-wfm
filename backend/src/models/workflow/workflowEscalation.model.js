// backend/src/models/workflow/workflowEscalation.model.js

import mongoose from 'mongoose';
import crypto from 'crypto';
import { WORKFLOW_STATUS, SLA_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';

const workflowEscalationSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    escalationId: {
        type: String,
        unique: true,
        default: () => `WFE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
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

    templateRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkflowTemplate',
        required: [true, 'Workflow template reference is required'],
        index: true
    },

    instanceRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkflowInstance',
        required: [true, 'Workflow instance reference is required'],
        index: true
    },

    escalatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Escalated by employee is required']
    },

    // ** ESCALATION DETAILS **
    escalationInfo: {
        escalationType: {
            type: String,
            required: [true, 'Escalation type is required'],
            enum: {
                values: [
                    'SLA_BREACH', 'QUALITY_ISSUE', 'COMPLEX_CASE', 'RESOURCE_CONSTRAINT',
                    'TECHNICAL_ISSUE', 'POLICY_CLARIFICATION', 'APPROVAL_REQUIRED',
                    'CUSTOMER_COMPLAINT', 'MANUAL_REQUEST', 'SYSTEM_ERROR'
                ],
                message: 'Invalid escalation type'
            },
            index: true
        },
        escalationReason: {
            type: String,
            required: [true, 'Escalation reason is required'],
            trim: true,
            maxlength: [1000, 'Escalation reason cannot exceed 1000 characters']
        },
        priority: {
            type: String,
            required: [true, 'Priority is required'],
            enum: {
                values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'URGENT'],
                message: 'Invalid priority level'
            },
            default: 'MEDIUM',
            index: true
        },
        severity: {
            type: String,
            required: [true, 'Severity is required'],
            enum: {
                values: ['MINOR', 'MODERATE', 'MAJOR', 'CRITICAL'],
                message: 'Invalid severity level'
            },
            default: 'MODERATE',
            index: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: [
                    'OPERATIONAL', 'TECHNICAL', 'QUALITY', 'COMPLIANCE',
                    'CUSTOMER_SERVICE', 'FINANCIAL', 'ADMINISTRATIVE'
                ],
                message: 'Invalid category'
            },
            index: true
        }
    },

    // ** ESCALATION LEVELS **
    escalationLevels: {
        currentLevel: {
            type: Number,
            required: [true, 'Current level is required'],
            min: [1, 'Current level must be at least 1'],
            default: 1,
            index: true
        },
        maxLevel: {
            type: Number,
            default: 3,
            min: [1, 'Max level must be at least 1']
        },

        levelHistory: [{
            level: {
                type: Number,
                required: true,
                min: [1, 'Level must be at least 1']
            },
            escalatedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            escalatedFrom: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            escalatedAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            assignmentMethod: {
                type: String,
                enum: ['AUTO_ESCALATION', 'MANUAL_ESCALATION', 'ROLE_BASED', 'SKILL_BASED', 'LOAD_BALANCED'],
                default: 'MANUAL_ESCALATION'
            },
            escalationRules: [{
                ruleType: String,
                ruleValue: String,
                ruleMet: Boolean
            }],
            acknowledgedAt: Date,
            acknowledgedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            responseTime: Number, // minutes
            notes: String
        }],

        currentAssignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Current assignee is required'],
            index: true
        }
    },

    // ** ESCALATION CONTEXT **
    contextInfo: {
        originalStageId: {
            type: String,
            required: [true, 'Original stage ID is required']
        },
        originalStageName: String,
        originalAssignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        currentStageId: String,
        currentStageName: String,

        // Related Entities
        relatedEntities: {
            patientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient'
            },
            claimRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Claim'
            },
            clientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client'
            },
            payerRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payer'
            }
        },

        // Workflow Context
        workflowContext: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },

        // Environmental Factors
        environmentalFactors: [{
            factor: {
                type: String,
                enum: [
                    'HIGH_VOLUME', 'SYSTEM_DOWNTIME', 'STAFF_SHORTAGE', 'HOLIDAY_PERIOD',
                    'TRAINING_PERIOD', 'POLICY_CHANGE', 'CLIENT_DEADLINE', 'AUDIT_PERIOD'
                ]
            },
            impact: {
                type: String,
                enum: ['LOW', 'MEDIUM', 'HIGH'],
                default: 'MEDIUM'
            },
            description: String
        }]
    },

    // ** ESCALATION RULES & AUTOMATION **
    escalationRules: {
        autoEscalationEnabled: {
            type: Boolean,
            default: true
        },

        triggerConditions: [{
            conditionType: {
                type: String,
                enum: [
                    'TIME_BASED', 'SLA_THRESHOLD', 'ERROR_COUNT', 'QUALITY_SCORE',
                    'WORKLOAD_THRESHOLD', 'SKILL_MISMATCH', 'CUSTOM_RULE'
                ],
                required: true
            },
            operator: {
                type: String,
                enum: ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'GREATER_EQUAL', 'LESS_EQUAL'],
                required: true
            },
            value: {
                type: mongoose.Schema.Types.Mixed,
                required: true
            },
            unit: String,
            conditionMet: {
                type: Boolean,
                default: false
            },
            metAt: Date
        }],

        escalationMatrix: [{
            fromLevel: {
                type: Number,
                required: true
            },
            toLevel: {
                type: Number,
                required: true
            },
            escalationCriteria: [{
                criteria: String,
                threshold: mongoose.Schema.Types.Mixed,
                weight: {
                    type: Number,
                    min: [1, 'Weight must be at least 1'],
                    max: [10, 'Weight cannot exceed 10'],
                    default: 1
                }
            }],
            targetRoles: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }],
            targetEmployees: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }],
            skipConditions: [{
                condition: String,
                value: mongoose.Schema.Types.Mixed
            }]
        }],

        timeoutRules: [{
            level: Number,
            timeoutPeriod: {
                type: Number,
                min: [1, 'Timeout period must be at least 1 minute']
            },
            timeoutUnit: {
                type: String,
                enum: ['MINUTES', 'HOURS', 'DAYS'],
                default: 'HOURS'
            },
            timeoutAction: {
                type: String,
                enum: ['AUTO_ESCALATE', 'REASSIGN', 'NOTIFY_MANAGER', 'MARK_OVERDUE'],
                default: 'AUTO_ESCALATE'
            }
        }]
    },

    // ** TIMING INFORMATION **
    timingInfo: {
        escalatedAt: {
            type: Date,
            required: [true, 'Escalation time is required'],
            default: Date.now,
            index: true
        },
        acknowledgedAt: Date,
        assignedAt: Date,
        startedAt: Date,
        resolvedAt: Date,
        closedAt: Date,

        // Duration Tracking
        acknowledgmentTime: {
            type: Number, // minutes
            min: [0, 'Acknowledgment time cannot be negative']
        },
        responseTime: {
            type: Number, // minutes
            min: [0, 'Response time cannot be negative']
        },
        resolutionTime: {
            type: Number, // minutes
            min: [0, 'Resolution time cannot be negative']
        },
        totalEscalationTime: {
            type: Number, // minutes
            min: [0, 'Total escalation time cannot be negative']
        },

        // SLA Tracking
        escalationSLA: {
            acknowledgmentSLA: {
                type: Number,
                default: 30 // minutes
            },
            responseSLA: {
                type: Number,
                default: 120 // minutes
            },
            resolutionSLA: {
                type: Number,
                default: 480 // minutes
            },
            slaStatus: {
                type: String,
                enum: Object.values(SLA_CONSTANTS.SLA_STATUS),
                default: SLA_CONSTANTS.SLA_STATUS.ON_TRACK
            },
            breachedSLAs: [String]
        }
    },

    // ** STATUS TRACKING **
    statusInfo: {
        currentStatus: {
            type: String,
            required: [true, 'Current status is required'],
            enum: {
                values: [
                    'OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'PENDING_INFO',
                    'RESOLVED', 'CLOSED', 'CANCELLED', 'DEFERRED'
                ],
                message: 'Invalid status'
            },
            default: 'OPEN',
            index: true
        },

        statusHistory: [{
            status: {
                type: String,
                required: true
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            changedAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            reason: String,
            notes: String
        }],

        lastActivityAt: {
            type: Date,
            default: Date.now,
            index: true
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isOverdue: {
            type: Boolean,
            default: false,
            index: true
        }
    },

    // ** RESOLUTION DETAILS **
    resolutionInfo: {
        resolutionType: {
            type: String,
            enum: [
                'RESOLVED_BY_ESCALATEE', 'ESCALATED_FURTHER', 'RETURNED_TO_ORIGINAL',
                'TRANSFERRED_TO_SPECIALIST', 'CANCELLED', 'DEFERRED'
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
        }],

        // Follow-up Actions
        followUpRequired: {
            type: Boolean,
            default: false
        },
        followUpDate: Date,
        followUpAssignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        followUpNotes: String,
        followUpCompleted: {
            type: Boolean,
            default: false
        }
    },

    // ** COMMUNICATION LOG **
    communicationLog: [{
        timestamp: {
            type: Date,
            required: true,
            default: Date.now
        },
        communicationType: {
            type: String,
            enum: ['INTERNAL_NOTE', 'EMAIL', 'PHONE_CALL', 'MEETING', 'SMS', 'CHAT'],
            required: true
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        to: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }],
        subject: String,
        message: {
            type: String,
            required: true,
            trim: true
        },
        isInternal: {
            type: Boolean,
            default: true
        },
        attachments: [{
            fileName: String,
            filePath: String,
            fileSize: Number
        }],
        read: {
            type: Boolean,
            default: false
        },
        readBy: [{
            employee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            readAt: Date
        }]
    }],

    // ** ESCALATION METRICS **
    escalationMetrics: {
        escalationCount: {
            type: Number,
            default: 1,
            min: [1, 'Escalation count must be at least 1']
        },
        levelChanges: {
            type: Number,
            default: 0,
            min: [0, 'Level changes cannot be negative']
        },
        reassignmentCount: {
            type: Number,
            default: 0,
            min: [0, 'Reassignment count cannot be negative']
        },

        // Performance Metrics
        escalationEfficiency: {
            type: Number,
            min: [0, 'Escalation efficiency cannot be negative'],
            max: [100, 'Escalation efficiency cannot exceed 100']
        },
        resolutionSuccess: {
            type: Boolean,
            default: false
        },
        customerSatisfaction: {
            type: Number,
            min: [1, 'Customer satisfaction must be at least 1'],
            max: [5, 'Customer satisfaction cannot exceed 5']
        },

        // Impact Assessment
        businessImpact: {
            type: String,
            enum: ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            default: 'LOW'
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
    },

    // ** PREVENTION & LEARNING **
    preventionAnalysis: {
        rootCauseAnalysis: {
            primaryCause: {
                type: String,
                enum: [
                    'PROCESS_GAP', 'SKILL_GAP', 'RESOURCE_CONSTRAINT', 'SYSTEM_LIMITATION',
                    'COMMUNICATION_BREAKDOWN', 'UNCLEAR_REQUIREMENTS', 'EXTERNAL_DEPENDENCY',
                    'TIME_PRESSURE', 'COMPLEXITY', 'POLICY_AMBIGUITY'
                ]
            },
            contributingFactors: [String],
            analysisNotes: {
                type: String,
                trim: true
            },
            analyzedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            analyzedAt: Date
        },

        preventionMeasures: [{
            measureType: {
                type: String,
                enum: [
                    'PROCESS_IMPROVEMENT', 'TRAINING', 'RESOURCE_ALLOCATION',
                    'SYSTEM_ENHANCEMENT', 'POLICY_UPDATE', 'COMMUNICATION_IMPROVEMENT'
                ]
            },
            description: String,
            implementationPlan: String,
            responsiblePerson: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            targetDate: Date,
            status: {
                type: String,
                enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
                default: 'PLANNED'
            },
            effectiveness: {
                type: String,
                enum: ['HIGH', 'MEDIUM', 'LOW']
            }
        }],

        lessonsLearned: [{
            lesson: String,
            applicability: {
                type: String,
                enum: ['SPECIFIC_CASE', 'TEAM_LEVEL', 'DEPARTMENT_LEVEL', 'COMPANY_WIDE']
            },
            sharedWith: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }],
            documentedAt: Date
        }]
    },

    // ** TAGS & CLASSIFICATION **
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],

    // ** ATTACHMENTS **
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
            enum: ['EVIDENCE', 'ANALYSIS', 'RESOLUTION', 'COMMUNICATION', 'DOCUMENTATION'],
            default: 'EVIDENCE'
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES **
workflowEscalationSchema.index({ companyRef: 1, 'escalationLevels.currentAssignee': 1 });
workflowEscalationSchema.index({ instanceRef: 1, 'statusInfo.currentStatus': 1 });
workflowEscalationSchema.index({ 'escalationInfo.escalationType': 1, 'escalationInfo.priority': 1 });
workflowEscalationSchema.index({ 'timingInfo.escalatedAt': -1, 'statusInfo.isActive': 1 });
workflowEscalationSchema.index({ 'statusInfo.isOverdue': 1, 'escalationInfo.priority': 1 });

// ** VIRTUALS **
workflowEscalationSchema.virtual('isActive').get(function () {
    return ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'PENDING_INFO'].includes(this.statusInfo?.currentStatus);
});

workflowEscalationSchema.virtual('escalationAge').get(function () {
    return this.timingInfo?.escalatedAt ?
        Math.floor((new Date() - this.timingInfo.escalatedAt) / (1000 * 60 * 60)) : 0;
});

workflowEscalationSchema.virtual('isOverdue').get(function () {
    const slaInfo = this.timingInfo?.escalationSLA;
    if (!slaInfo) return false;

    const ageMinutes = Math.floor((new Date() - this.timingInfo?.escalatedAt) / (1000 * 60));

    if (!this.timingInfo?.acknowledgedAt && ageMinutes > slaInfo.acknowledgmentSLA) return true;
    if (!this.timingInfo?.startedAt && ageMinutes > slaInfo.responseSLA) return true;
    if (!this.timingInfo?.resolvedAt && ageMinutes > slaInfo.resolutionSLA) return true;

    return false;
});

workflowEscalationSchema.virtual('urgencyScore').get(function () {
    let score = 0;

    // Priority weight
    const priorityWeights = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4, URGENT: 5 };
    score += priorityWeights[this.escalationInfo?.priority] || 1;

    // Severity weight
    const severityWeights = { MINOR: 1, MODERATE: 2, MAJOR: 3, CRITICAL: 4 };
    score += severityWeights[this.escalationInfo?.severity] || 1;

    // Age factor
    const ageHours = this.escalationAge;
    if (ageHours > 48) score += 3;
    else if (ageHours > 24) score += 2;
    else if (ageHours > 8) score += 1;

    // Level factor
    score += (this.escalationLevels?.currentLevel || 1) - 1;

    // Overdue factor
    if (this.isOverdue) score += 2;

    return Math.min(10, score);
});

// ** MIDDLEWARE **
workflowEscalationSchema.pre('save', function (next) {
    // Update timing calculations
    if (this.timingInfo?.escalatedAt) {
        const escalatedAt = this.timingInfo.escalatedAt;

        if (this.timingInfo?.acknowledgedAt) {
            this.timingInfo.acknowledgmentTime = Math.floor(
                (this.timingInfo.acknowledgedAt - escalatedAt) / (1000 * 60)
            );
        }

        if (this.timingInfo?.startedAt) {
            this.timingInfo.responseTime = Math.floor(
                (this.timingInfo.startedAt - escalatedAt) / (1000 * 60)
            );
        }

        if (this.timingInfo?.resolvedAt) {
            this.timingInfo.resolutionTime = Math.floor(
                (this.timingInfo.resolvedAt - escalatedAt) / (1000 * 60)
            );
            this.timingInfo.totalEscalationTime = this.timingInfo.resolutionTime;
        }
    }

    // Update SLA status
    const slaInfo = this.timingInfo?.escalationSLA;
    if (slaInfo) {
        const breachedSLAs = [];

        if (this.timingInfo?.acknowledgmentTime > slaInfo.acknowledgmentSLA) {
            breachedSLAs.push('ACKNOWLEDGMENT');
        }
        if (this.timingInfo?.responseTime > slaInfo.responseSLA) {
            breachedSLAs.push('RESPONSE');
        }
        if (this.timingInfo?.resolutionTime > slaInfo.resolutionSLA) {
            breachedSLAs.push('RESOLUTION');
        }

        slaInfo.breachedSLAs = breachedSLAs;
        slaInfo.slaStatus = breachedSLAs.length > 0 ?
            SLA_CONSTANTS.SLA_STATUS.BREACHED : SLA_CONSTANTS.SLA_STATUS.ON_TRACK;
    }

    // Update overdue status
    this.statusInfo.isOverdue = this.isOverdue;
    this.statusInfo.lastActivityAt = new Date();

    next();
});

workflowEscalationSchema.post('save', async function (doc) {
    try {
        // Create notifications for new escalations
        if (doc.isNew) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.escalationLevels?.currentAssignee,
                type: 'WORKFLOW_ESCALATION',
                title: 'Workflow Escalation Assigned',
                message: `${doc.escalationInfo.escalationType} escalation requires your attention`,
                priority: doc.escalationInfo?.priority === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
                relatedEntity: {
                    entityType: 'WorkflowEscalation',
                    entityId: doc._id
                }
            });
        }

        // Award XP for resolving escalations
        if (doc.isModified('statusInfo.currentStatus') && doc.statusInfo?.currentStatus === 'RESOLVED') {
            const Employee = mongoose.model('Employee');
            const xpBonus = {
                'LOW': 15,
                'MEDIUM': 25,
                'HIGH': 40,
                'CRITICAL': 60,
                'URGENT': 80
            };

            await Employee.findByIdAndUpdate(
                doc.resolutionInfo?.resolvedBy || doc.escalationLevels?.currentAssignee,
                {
                    $inc: {
                        'gamification.experience.totalXP': xpBonus[doc.escalationInfo?.priority] || 25
                    }
                }
            );
        }

        // Create notifications for overdue escalations
        if (doc.isModified('statusInfo.isOverdue') && doc.statusInfo?.isOverdue) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.escalationLevels?.currentAssignee,
                type: 'ESCALATION_OVERDUE',
                title: 'Escalation Overdue',
                message: `Escalation ${doc.escalationId} is overdue and requires immediate attention`,
                priority: 'HIGH',
                relatedEntity: {
                    entityType: 'WorkflowEscalation',
                    entityId: doc._id
                }
            });
        }

    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

// ** STATIC METHODS **
workflowEscalationSchema.statics.findActiveByAssignee = function (employeeId) {
    return this.find({
        'escalationLevels.currentAssignee': employeeId,
        'statusInfo.isActive': true
    })
        .populate('instanceRef', 'instanceId instanceInfo')
        .populate('templateRef', 'templateInfo.templateName')
        .sort({ 'escalationInfo.priority': 1, 'timingInfo.escalatedAt': 1 });
};

workflowEscalationSchema.statics.findOverdueEscalations = function (companyId) {
    return this.find({
        companyRef: companyId,
        'statusInfo.isOverdue': true,
        'statusInfo.isActive': true
    })
        .populate('escalationLevels.currentAssignee', 'firstName lastName email')
        .populate('instanceRef', 'instanceId')
        .sort({ 'timingInfo.escalatedAt': 1 });
};

workflowEscalationSchema.statics.getEscalationMetrics = function (companyId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'timingInfo.escalatedAt': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: '$escalationInfo.escalationType',
                totalEscalations: { $sum: 1 },
                resolvedEscalations: {
                    $sum: { $cond: [{ $eq: ['$statusInfo.currentStatus', 'RESOLVED'] }, 1, 0] }
                },
                overdueEscalations: {
                    $sum: { $cond: ['$statusInfo.isOverdue', 1, 0] }
                },
                avgResolutionTime: { $avg: '$timingInfo.resolutionTime' },
                avgEscalationLevel: { $avg: '$escalationLevels.currentLevel' }
            }
        },
        {
            $project: {
                escalationType: '$_id',
                totalEscalations: 1,
                resolvedEscalations: 1,
                overdueEscalations: 1,
                resolutionRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$resolvedEscalations', '$totalEscalations'] }, 100] },
                        2
                    ]
                },
                overdueRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$overdueEscalations', '$totalEscalations'] }, 100] },
                        2
                    ]
                },
                avgResolutionTimeHours: {
                    $round: [{ $divide: ['$avgResolutionTime', 60] }, 2]
                },
                avgEscalationLevel: { $round: ['$avgEscalationLevel', 1] }
            }
        }
    ]);
};

// ** INSTANCE METHODS **
workflowEscalationSchema.methods.acknowledge = function (acknowledgedBy) {
    this.timingInfo.acknowledgedAt = new Date();
    this.statusInfo.currentStatus = 'ACKNOWLEDGED';

    this.statusInfo.statusHistory.push({
        status: 'ACKNOWLEDGED',
        changedBy: acknowledgedBy,
        changedAt: new Date(),
        reason: 'Escalation acknowledged'
    });

    return this.save();
};

workflowEscalationSchema.methods.startWork = function (startedBy) {
    this.timingInfo.startedAt = new Date();
    this.statusInfo.currentStatus = 'IN_PROGRESS';

    this.statusInfo.statusHistory.push({
        status: 'IN_PROGRESS',
        changedBy: startedBy,
        changedAt: new Date(),
        reason: 'Work started on escalation'
    });

    return this.save();
};

workflowEscalationSchema.methods.resolve = function (resolvedBy, resolutionDescription, resolutionType = 'RESOLVED_BY_ESCALATEE') {
    this.timingInfo.resolvedAt = new Date();
    this.statusInfo.currentStatus = 'RESOLVED';
    this.statusInfo.isActive = false;

    this.resolutionInfo.resolvedBy = resolvedBy;
    this.resolutionInfo.resolutionDescription = resolutionDescription;
    this.resolutionInfo.resolutionType = resolutionType;

    this.statusInfo.statusHistory.push({
        status: 'RESOLVED',
        changedBy: resolvedBy,
        changedAt: new Date(),
        reason: 'Escalation resolved'
    });

    return this.save();
};

workflowEscalationSchema.methods.escalateToNextLevel = function (escalatedBy, reason) {
    if (this.escalationLevels?.currentLevel >= this.escalationLevels?.maxLevel) {
        throw new Error('Maximum escalation level reached');
    }

    const nextLevel = this.escalationLevels.currentLevel + 1;

    this.escalationLevels.levelHistory.push({
        level: nextLevel,
        escalatedFrom: this.escalationLevels.currentAssignee,
        escalatedAt: new Date(),
        assignmentMethod: 'AUTO_ESCALATION',
        notes: reason
    });

    this.escalationLevels.currentLevel = nextLevel;
    this.escalationMetrics.levelChanges += 1;

    return this.save();
};

workflowEscalationSchema.methods.reassign = function (newAssignee, reassignedBy, reason) {
    this.escalationLevels.levelHistory.push({
        level: this.escalationLevels.currentLevel,
        escalatedFrom: this.escalationLevels.currentAssignee,
        escalatedTo: newAssignee,
        escalatedAt: new Date(),
        assignmentMethod: 'MANUAL_ESCALATION',
        notes: reason
    });

    this.escalationLevels.currentAssignee = newAssignee;
    this.escalationMetrics.reassignmentCount += 1;

    this.statusInfo.statusHistory.push({
        status: this.statusInfo.currentStatus,
        changedBy: reassignedBy,
        changedAt: new Date(),
        reason: `Reassigned: ${reason}`
    });

    return this.save();
};

workflowEscalationSchema.methods.addCommunication = function (communicationData) {
    this.communicationLog.push({
        timestamp: new Date(),
        ...communicationData
    });

    this.statusInfo.lastActivityAt = new Date();
    return this.save();
};

workflowEscalationSchema.methods.addActionItem = function (action, assignedTo, dueDate, priority = 'MEDIUM') {
    this.resolutionInfo.actionItems.push({
        action,
        assignedTo,
        dueDate,
        priority,
        status: 'PENDING'
    });

    return this.save();
};

workflowEscalationSchema.methods.updateStatus = function (newStatus, changedBy, reason = '', notes = '') {
    this.statusInfo.currentStatus = newStatus;
    this.statusInfo.lastActivityAt = new Date();

    if (['RESOLVED', 'CLOSED', 'CANCELLED'].includes(newStatus)) {
        this.statusInfo.isActive = false;
    }

    this.statusInfo.statusHistory.push({
        status: newStatus,
        changedBy,
        changedAt: new Date(),
        reason,
        notes
    });

    return this.save();
};

workflowEscalationSchema.methods.calculateEfficiency = function () {
    const slaInfo = this.timingInfo?.escalationSLA;
    if (!slaInfo || !this.timingInfo?.resolutionTime) return 0;

    const expectedTime = slaInfo.resolutionSLA;
    const actualTime = this.timingInfo.resolutionTime;

    if (actualTime <= expectedTime) {
        this.escalationMetrics.escalationEfficiency = 100;
    } else {
        this.escalationMetrics.escalationEfficiency = Math.max(0,
            Math.round((expectedTime / actualTime) * 100)
        );
    }

    return this.escalationMetrics.escalationEfficiency;
};

export const WorkflowEscalation = mongoose.model('WorkflowEscalation', workflowEscalationSchema, 'workflowEscalations');