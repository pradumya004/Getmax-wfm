// backend/src/models/workflow/workflowInstance.model.js

import mongoose from 'mongoose';
import crypto from 'crypto';
import { WORKFLOW_STATUS, SLA_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';

const workflowInstanceSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    instanceId: {
        type: String,
        unique: true,
        default: () => `WFI-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
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

    initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Initiated by employee is required'],
        index: true
    },

    // ** INSTANCE INFORMATION **
    instanceInfo: {
        instanceName: {
            type: String,
            trim: true,
            maxlength: [100, 'Instance name cannot exceed 100 characters']
        },
        instanceType: {
            type: String,
            enum: {
                values: [
                    'CLAIMS_PROCESSING', 'PRIOR_AUTHORIZATION', 'DENIAL_MANAGEMENT',
                    'PAYMENT_POSTING', 'PATIENT_REGISTRATION', 'INSURANCE_VERIFICATION',
                    'AR_CALLING', 'MEDICAL_CODING', 'QA_REVIEW', 'ESCALATION_PROCESS'
                ],
                message: 'Invalid instance type'
            },
            index: true
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
            default: 'MEDIUM',
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },

        // Context Data
        contextData: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },

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
            },
            customEntities: [{
                entityType: String,
                entityId: mongoose.Schema.Types.ObjectId,
                entityName: String
            }]
        }
    },

    // ** CURRENT STATUS **
    currentStatus: {
        status: {
            type: String,
            required: [true, 'Status is required'],
            enum: {
                values: Object.values(WORKFLOW_STATUS),
                message: 'Invalid status'
            },
            default: WORKFLOW_STATUS.DRAFT,
            index: true
        },
        currentStageId: {
            type: String,
            index: true
        },
        currentStageName: String,
        currentAssignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            index: true
        },

        // Timing Information
        startedAt: Date,
        completedAt: Date,
        lastActivityAt: {
            type: Date,
            default: Date.now,
            index: true
        },

        // Progress Tracking
        totalStages: {
            type: Number,
            min: [1, 'Total stages must be at least 1']
        },
        completedStages: {
            type: Number,
            default: 0,
            min: [0, 'Completed stages cannot be negative']
        },
        progressPercentage: {
            type: Number,
            min: [0, 'Progress percentage cannot be negative'],
            max: [100, 'Progress percentage cannot exceed 100'],
            default: 0
        }
    },

    // ** STAGE EXECUTIONS **
    stageExecutions: [{
        executionId: {
            type: String,
            required: true,
            default: () => crypto.randomBytes(3).toString('hex').toUpperCase()
        },
        stageId: {
            type: String,
            required: [true, 'Stage ID is required']
        },
        stageName: String,
        stageType: {
            type: String,
            enum: [
                'START', 'TASK', 'DECISION', 'APPROVAL', 'REVIEW',
                'NOTIFICATION', 'WAIT', 'END', 'PARALLEL', 'MERGE'
            ]
        },

        // Assignment Information
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        assignedAt: Date,
        assignmentMethod: {
            type: String,
            enum: [
                'AUTO_ASSIGNED', 'MANUAL_ASSIGNMENT', 'ROLE_BASED',
                'SKILL_BASED', 'LOAD_BALANCED', 'ESCALATED'
            ]
        },

        // Execution Status
        executionStatus: {
            type: String,
            enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'FAILED', 'CANCELLED'],
            default: 'PENDING'
        },

        // Timing
        enteredAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        startedAt: Date,
        completedAt: Date,

        // SLA Tracking
        slaInfo: {
            expectedDuration: Number, // minutes
            expectedCompletionTime: Date,
            actualDuration: Number, // minutes
            slaStatus: {
                type: String,
                enum: Object.values(SLA_CONSTANTS.SLA_STATUS),
                default: SLA_CONSTANTS.SLA_STATUS.ON_TRACK
            },
            warningLevel: {
                type: String,
                enum: ['GREEN', 'YELLOW', 'RED'],
                default: 'GREEN'
            },
            isBreached: {
                type: Boolean,
                default: false
            },
            breachedAt: Date
        },

        // Execution Data
        inputData: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },
        outputData: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },
        formData: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },

        // Comments and Notes
        executionNotes: {
            type: String,
            trim: true,
            maxlength: [2000, 'Execution notes cannot exceed 2000 characters']
        },

        // Decision Information (for decision stages)
        decisionInfo: {
            decisionMade: String,
            decisionReason: String,
            selectedOption: String,
            decisionScore: Number
        },

        // Approval Information (for approval stages)
        approvalInfo: {
            approvalStatus: {
                type: String,
                enum: ['PENDING', 'APPROVED', 'REJECTED', 'DELEGATED']
            },
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            approvedAt: Date,
            rejectionReason: String,
            justification: String,
            delegatedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        },

        // Error Information
        errors: [{
            errorCode: String,
            errorMessage: String,
            timestamp: {
                type: Date,
                default: Date.now
            },
            severity: {
                type: String,
                enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL']
            },
            isResolved: {
                type: Boolean,
                default: false
            }
        }],

        // Attachments
        attachments: [{
            fileName: String,
            filePath: String,
            fileSize: Number,
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }]
    }],

    // ** TRANSITION HISTORY **
    transitionHistory: [{
        transitionId: String,
        fromStageId: String,
        toStageId: String,
        fromStageName: String,
        toStageName: String,

        triggeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        triggeredAt: {
            type: Date,
            required: true,
            default: Date.now
        },

        transitionType: {
            type: String,
            enum: ['AUTO', 'MANUAL', 'ESCALATION', 'SKIP', 'RETRY'],
            default: 'AUTO'
        },

        triggerConditions: [{
            condition: String,
            conditionMet: Boolean,
            conditionValue: mongoose.Schema.Types.Mixed
        }],

        transitionReason: String,
        transitionNotes: String
    }],

    // ** ESCALATION TRACKING **
    escalationInfo: {
        isEscalated: {
            type: Boolean,
            default: false,
            index: true
        },
        escalationLevel: {
            type: Number,
            default: 0,
            min: [0, 'Escalation level cannot be negative']
        },
        escalationHistory: [{
            level: {
                type: Number,
                required: true
            },
            escalatedFrom: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            escalatedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            escalatedAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            escalationReason: String,
            escalationType: {
                type: String,
                enum: ['SLA_BREACH', 'QUALITY_ISSUE', 'COMPLEX_CASE', 'MANUAL_REQUEST'],
                default: 'SLA_BREACH'
            },
            resolvedAt: Date,
            resolution: String
        }],

        currentEscalatee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        escalationDeadline: Date,
        autoEscalationEnabled: {
            type: Boolean,
            default: true
        }
    },

    // ** PARALLEL PROCESSING **
    parallelProcessing: {
        isParallelActive: {
            type: Boolean,
            default: false
        },
        parallelBranches: [{
            branchId: String,
            branchName: String,
            stageIds: [String],
            status: {
                type: String,
                enum: ['ACTIVE', 'COMPLETED', 'FAILED', 'WAITING'],
                default: 'ACTIVE'
            },
            assignedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            startedAt: Date,
            completedAt: Date
        }],
        synchronizationPoint: String,
        waitingForBranches: [String],
        allBranchesComplete: {
            type: Boolean,
            default: false
        }
    },

    // ** NOTIFICATIONS SENT **
    notificationsSent: [{
        notificationId: String,
        notificationType: {
            type: String,
            enum: [
                'ASSIGNMENT', 'REMINDER', 'ESCALATION', 'COMPLETION',
                'SLA_WARNING', 'ERROR', 'APPROVAL_REQUEST'
            ]
        },
        sentTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }],
        sentAt: {
            type: Date,
            default: Date.now
        },
        triggerStageId: String,
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

    // ** PERFORMANCE METRICS **
    performanceMetrics: {
        totalDuration: {
            type: Number, // minutes
            min: [0, 'Total duration cannot be negative']
        },
        activeDuration: {
            type: Number, // minutes (excluding wait times)
            min: [0, 'Active duration cannot be negative']
        },
        waitTime: {
            type: Number, // minutes
            min: [0, 'Wait time cannot be negative']
        },

        // SLA Performance
        slaPerformance: {
            totalSLAs: Number,
            metSLAs: Number,
            breachedSLAs: Number,
            complianceRate: {
                type: Number,
                min: [0, 'Compliance rate cannot be negative'],
                max: [100, 'Compliance rate cannot exceed 100']
            }
        },

        // Efficiency Metrics
        efficiencyMetrics: {
            stagesCompleted: Number,
            stagesSkipped: Number,
            stagesFailed: Number,
            reworkCount: Number,
            handoffCount: Number,
            averageStageTime: Number
        },

        // Quality Metrics
        qualityMetrics: {
            errorCount: Number,
            qualityScore: {
                type: Number,
                min: [0, 'Quality score cannot be negative'],
                max: [100, 'Quality score cannot exceed 100']
            },
            firstPassSuccess: {
                type: Boolean,
                default: true
            }
        }
    },

    // ** TAGS & CATEGORIZATION **
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],

    // ** CUSTOM FIELDS **
    customFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },

    // ** STATUS FLAGS **
    statusFlags: {
        isUrgent: {
            type: Boolean,
            default: false,
            index: true
        },
        needsAttention: {
            type: Boolean,
            default: false,
            index: true
        },
        isBlocked: {
            type: Boolean,
            default: false,
            index: true
        },
        blockingReason: String,
        isOnHold: {
            type: Boolean,
            default: false
        },
        holdReason: String,
        holdUntil: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES **
workflowInstanceSchema.index({ companyRef: 1, templateRef: 1, 'currentStatus.status': 1 });
workflowInstanceSchema.index({ 'currentStatus.currentAssignee': 1, 'currentStatus.status': 1 });
workflowInstanceSchema.index({ initiatedBy: 1, 'currentStatus.lastActivityAt': -1 });
workflowInstanceSchema.index({ 'instanceInfo.relatedEntities.patientRef': 1 });
workflowInstanceSchema.index({ 'instanceInfo.relatedEntities.claimRef': 1 });
workflowInstanceSchema.index({ 'escalationInfo.isEscalated': 1, 'escalationInfo.escalationDeadline': 1 });
workflowInstanceSchema.index({ 'statusFlags.isUrgent': 1, 'statusFlags.needsAttention': 1 });

// ** VIRTUALS **
workflowInstanceSchema.virtual('isActive').get(function () {
    return [WORKFLOW_STATUS.ACTIVE, WORKFLOW_STATUS.PAUSED].includes(this.currentStatus?.status);
});

workflowInstanceSchema.virtual('isCompleted').get(function () {
    return this.currentStatus?.status === WORKFLOW_STATUS.COMPLETED;
});

workflowInstanceSchema.virtual('duration').get(function () {
    if (!this.currentStatus?.startedAt) return 0;
    const end = this.currentStatus?.completedAt || new Date();
    return Math.floor((end - this.currentStatus.startedAt) / (1000 * 60));
});

workflowInstanceSchema.virtual('isOverdue').get(function () {
    const currentExecution = this.stageExecutions?.find(
        exec => exec.stageId === this.currentStatus?.currentStageId &&
            exec.executionStatus === 'IN_PROGRESS'
    );

    return currentExecution?.slaInfo?.isBreached || false;
});

workflowInstanceSchema.virtual('currentStageExecution').get(function () {
    return this.stageExecutions?.find(
        exec => exec.stageId === this.currentStatus?.currentStageId
    );
});

workflowInstanceSchema.virtual('timeRemaining').get(function () {
    const execution = this.currentStageExecution;
    if (!execution?.slaInfo?.expectedCompletionTime) return null;

    const remaining = execution.slaInfo.expectedCompletionTime - new Date();
    return Math.max(0, Math.floor(remaining / (1000 * 60)));
});

// ** MIDDLEWARE **
workflowInstanceSchema.pre('save', function (next) {
    // Update progress percentage
    if (this.currentStatus?.totalStages && this.currentStatus?.completedStages >= 0) {
        this.currentStatus.progressPercentage = Math.round(
            (this.currentStatus.completedStages / this.currentStatus.totalStages) * 100
        );
    }

    // Update last activity timestamp
    this.currentStatus.lastActivityAt = new Date();

    // Calculate performance metrics
    if (this.stageExecutions?.length > 0) {
        const completed = this.stageExecutions.filter(e => e.executionStatus === 'COMPLETED');
        const breached = this.stageExecutions.filter(e => e.slaInfo?.isBreached);

        this.performanceMetrics.efficiencyMetrics = {
            stagesCompleted: completed.length,
            stagesSkipped: this.stageExecutions.filter(e => e.executionStatus === 'SKIPPED').length,
            stagesFailed: this.stageExecutions.filter(e => e.executionStatus === 'FAILED').length,
            averageStageTime: completed.length > 0 ?
                completed.reduce((sum, e) => sum + (e.slaInfo?.actualDuration || 0), 0) / completed.length : 0
        };

        this.performanceMetrics.slaPerformance = {
            totalSLAs: this.stageExecutions.length,
            metSLAs: this.stageExecutions.length - breached.length,
            breachedSLAs: breached.length,
            complianceRate: this.stageExecutions.length > 0 ?
                Math.round(((this.stageExecutions.length - breached.length) / this.stageExecutions.length) * 100) : 0
        };
    }

    next();
});

workflowInstanceSchema.post('save', async function (doc) {
    try {
        // Award XP for completing workflow instances
        if (doc.isModified('currentStatus.status') && doc.currentStatus?.status === WORKFLOW_STATUS.COMPLETED) {
            const Employee = mongoose.model('Employee');
            await Employee.findByIdAndUpdate(
                doc.initiatedBy,
                {
                    $inc: {
                        'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.TASK_COMPLETED,
                        'performance.dailyMetrics.tasksCompleted': 1
                    }
                }
            );

            // Bonus XP for early completion
            if (doc.performanceMetrics?.slaPerformance?.complianceRate >= 100) {
                await Employee.findByIdAndUpdate(
                    doc.initiatedBy,
                    {
                        $inc: {
                            'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.SLA_MET
                        }
                    }
                );
            }
        }

        // Create notifications for escalations
        if (doc.isModified('escalationInfo.isEscalated') && doc.escalationInfo?.isEscalated) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.escalationInfo?.currentEscalatee,
                type: 'WORKFLOW_ESCALATION',
                title: 'Workflow Escalated',
                message: `Workflow instance ${doc.instanceId} has been escalated to your attention`,
                priority: 'HIGH',
                relatedEntity: {
                    entityType: 'WorkflowInstance',
                    entityId: doc._id
                }
            });
        }

        // Update template usage metrics
        if (doc.isModified('currentStatus.status') && doc.currentStatus?.status === WORKFLOW_STATUS.COMPLETED) {
            const WorkflowTemplate = mongoose.model('WorkflowTemplate');
            await WorkflowTemplate.findByIdAndUpdate(
                doc.templateRef,
                {
                    $inc: {
                        'usageMetrics.totalInstances': 1,
                        'usageMetrics.completedInstances': 1
                    }
                }
            );
        }

    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

// ** STATIC METHODS **
workflowInstanceSchema.statics.findActiveByAssignee = function (employeeId) {
    return this.find({
        'currentStatus.currentAssignee': employeeId,
        'currentStatus.status': { $in: [WORKFLOW_STATUS.ACTIVE, WORKFLOW_STATUS.PAUSED] }
    })
        .populate('templateRef', 'templateInfo')
        .populate('instanceInfo.relatedEntities.patientRef', 'firstName lastName mrn')
        .sort({ 'currentStatus.lastActivityAt': -1 });
};

workflowInstanceSchema.statics.findOverdueInstances = function (companyId) {
    return this.find({
        companyRef: companyId,
        'currentStatus.status': { $in: [WORKFLOW_STATUS.ACTIVE, WORKFLOW_STATUS.PAUSED] },
        'stageExecutions': {
            $elemMatch: {
                'slaInfo.isBreached': true,
                'executionStatus': 'IN_PROGRESS'
            }
        }
    })
        .populate('currentStatus.currentAssignee', 'firstName lastName email')
        .populate('templateRef', 'templateInfo.templateName')
        .sort({ 'stageExecutions.slaInfo.breachedAt': 1 });
};

workflowInstanceSchema.statics.getWorkflowMetrics = function (companyId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'currentStatus.startedAt': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: '$instanceInfo.instanceType',
                totalInstances: { $sum: 1 },
                completedInstances: {
                    $sum: { $cond: [{ $eq: ['$currentStatus.status', WORKFLOW_STATUS.COMPLETED] }, 1, 0] }
                },
                escalatedInstances: {
                    $sum: { $cond: ['$escalationInfo.isEscalated', 1, 0] }
                },
                avgDuration: { $avg: '$performanceMetrics.totalDuration' },
                avgSLACompliance: { $avg: '$performanceMetrics.slaPerformance.complianceRate' }
            }
        },
        {
            $project: {
                instanceType: '$_id',
                totalInstances: 1,
                completedInstances: 1,
                escalatedInstances: 1,
                completionRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$completedInstances', '$totalInstances'] }, 100] },
                        2
                    ]
                },
                escalationRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$escalatedInstances', '$totalInstances'] }, 100] },
                        2
                    ]
                },
                avgDurationHours: {
                    $round: [{ $divide: ['$avgDuration', 60] }, 2]
                },
                avgSLACompliance: { $round: ['$avgSLACompliance', 2] }
            }
        }
    ]);
};

// ** INSTANCE METHODS **
workflowInstanceSchema.methods.startWorkflow = function () {
    this.currentStatus.status = WORKFLOW_STATUS.ACTIVE;
    this.currentStatus.startedAt = new Date();
    this.currentStatus.lastActivityAt = new Date();

    return this.save();
};

workflowInstanceSchema.methods.completeWorkflow = function (completedBy) {
    this.currentStatus.status = WORKFLOW_STATUS.COMPLETED;
    this.currentStatus.completedAt = new Date();
    this.currentStatus.lastActivityAt = new Date();

    // Calculate total duration
    if (this.currentStatus.startedAt) {
        this.performanceMetrics.totalDuration = Math.floor(
            (this.currentStatus.completedAt - this.currentStatus.startedAt) / (1000 * 60)
        );
    }

    return this.save();
};

workflowInstanceSchema.methods.moveToStage = function (stageId, stageName, triggeredBy, reason = '') {
    // Complete current stage execution
    const currentExecution = this.stageExecutions?.find(
        exec => exec.stageId === this.currentStatus?.currentStageId
    );

    if (currentExecution) {
        currentExecution.executionStatus = 'COMPLETED';
        currentExecution.completedAt = new Date();

        if (currentExecution.startedAt) {
            currentExecution.slaInfo.actualDuration = Math.floor(
                (currentExecution.completedAt - currentExecution.startedAt) / (1000 * 60)
            );
        }
    }

    // Add transition to history
    this.transitionHistory.push({
        fromStageId: this.currentStatus?.currentStageId,
        toStageId: stageId,
        fromStageName: this.currentStatus?.currentStageName,
        toStageName: stageName,
        triggeredBy,
        triggeredAt: new Date(),
        transitionReason: reason
    });

    // Update current status
    this.currentStatus.currentStageId = stageId;
    this.currentStatus.currentStageName = stageName;
    this.currentStatus.completedStages += 1;
    this.currentStatus.lastActivityAt = new Date();

    return this.save();
};

workflowInstanceSchema.methods.assignStage = function (stageId, assigneeId, assignmentMethod = 'MANUAL_ASSIGNMENT') {
    let stageExecution = this.stageExecutions?.find(exec => exec.stageId === stageId);

    if (!stageExecution) {
        stageExecution = {
            executionId: crypto.randomBytes(3).toString('hex').toUpperCase(),
            stageId,
            executionStatus: 'PENDING',
            enteredAt: new Date()
        };
        this.stageExecutions.push(stageExecution);
    }

    stageExecution.assignedTo = assigneeId;
    stageExecution.assignedAt = new Date();
    stageExecution.assignmentMethod = assignmentMethod;

    // Update current assignee if this is the current stage
    if (stageId === this.currentStatus?.currentStageId) {
        this.currentStatus.currentAssignee = assigneeId;
    }

    return this.save();
};

workflowInstanceSchema.methods.escalate = function (escalatedTo, escalationReason, escalationType = 'MANUAL_REQUEST') {
    const currentLevel = this.escalationInfo?.escalationLevel || 0;
    const newLevel = currentLevel + 1;

    this.escalationInfo.isEscalated = true;
    this.escalationInfo.escalationLevel = newLevel;
    this.escalationInfo.currentEscalatee = escalatedTo;

    this.escalationInfo.escalationHistory.push({
        level: newLevel,
        escalatedFrom: this.currentStatus?.currentAssignee,
        escalatedTo,
        escalatedAt: new Date(),
        escalationReason,
        escalationType
    });

    // Update current assignee
    this.currentStatus.currentAssignee = escalatedTo;

    return this.save();
};

workflowInstanceSchema.methods.addStageExecution = function (stageData) {
    const execution = {
        executionId: crypto.randomBytes(3).toString('hex').toUpperCase(),
        ...stageData,
        enteredAt: new Date(),
        executionStatus: 'PENDING'
    };

    this.stageExecutions.push(execution);
    return this.save();
};

workflowInstanceSchema.methods.updateStageData = function (stageId, data) {
    const execution = this.stageExecutions?.find(exec => exec.stageId === stageId);
    if (!execution) {
        throw new Error(`Stage execution not found for stage ID: ${stageId}`);
    }

    Object.assign(execution, data);
    this.currentStatus.lastActivityAt = new Date();

    return this.save();
};

workflowInstanceSchema.methods.addComment = function (stageId, comment, commentBy) {
    const execution = this.stageExecutions?.find(exec => exec.stageId === stageId);
    if (execution) {
        execution.executionNotes = (execution.executionNotes || '') + `\n[${new Date().toISOString()}] ${commentBy}: ${comment}`;
    }

    return this.save();
};

workflowInstanceSchema.methods.clone = function (clonedBy) {
    const clonedInstance = this.toObject();
    delete clonedInstance._id;
    delete clonedInstance.instanceId;
    delete clonedInstance.createdAt;
    delete clonedInstance.updatedAt;

    clonedInstance.initiatedBy = clonedBy;
    clonedInstance.currentStatus.status = WORKFLOW_STATUS.DRAFT;
    clonedInstance.currentStatus.startedAt = null;
    clonedInstance.currentStatus.completedAt = null;
    clonedInstance.currentStatus.completedStages = 0;
    clonedInstance.currentStatus.progressPercentage = 0;

    // Reset stage executions
    clonedInstance.stageExecutions = [];
    clonedInstance.transitionHistory = [];
    clonedInstance.escalationInfo = { isEscalated: false, escalationLevel: 0 };
    clonedInstance.performanceMetrics = {};

    return this.constructor.create(clonedInstance);
};

export const WorkflowInstance = mongoose.model('WorkflowInstance', workflowInstanceSchema, 'workflowInstances');