// backend/src/models/workflow/workflowTemplate.model.js

import mongoose from 'mongoose';
// import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { WORKFLOW_STATUS, SLA_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

const workflowTemplateSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    templateId: {
        type: String,
        unique: true,
        // default: () => `WFT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
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

    // ** TEMPLATE INFORMATION **
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
                values: [
                    'CLAIMS_PROCESSING', 'PRIOR_AUTHORIZATION', 'DENIAL_MANAGEMENT',
                    'PAYMENT_POSTING', 'PATIENT_REGISTRATION', 'INSURANCE_VERIFICATION',
                    'AR_CALLING', 'MEDICAL_CODING', 'QA_REVIEW', 'ESCALATION_PROCESS'
                ],
                message: 'Invalid template type'
            },
            index: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: [
                    'RCM_PROCESS', 'QUALITY_ASSURANCE', 'CUSTOMER_SERVICE',
                    'ADMINISTRATIVE', 'FINANCIAL', 'COMPLIANCE', 'ESCALATION'
                ],
                message: 'Invalid category'
            },
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters']
        },
        version: {
            type: String,
            default: '1.0.0'
        },

        // Template Properties
        isStandard: {
            type: Boolean,
            default: false
        },
        isCustomizable: {
            type: Boolean,
            default: true
        },
        complexity: {
            type: String,
            enum: ['SIMPLE', 'MODERATE', 'COMPLEX', 'ADVANCED'],
            default: 'MODERATE'
        }
    },

    // ** WORKFLOW STAGES **
    workflowStages: [{
        stageId: {
            type: String,
            required: true,
            // default: () => crypto.randomBytes(3).toString('hex').toUpperCase()
        },
        stageName: {
            type: String,
            required: [true, 'Stage name is required'],
            trim: true,
            maxlength: [100, 'Stage name cannot exceed 100 characters']
        },
        stageType: {
            type: String,
            required: [true, 'Stage type is required'],
            enum: {
                values: [
                    'START', 'TASK', 'DECISION', 'APPROVAL', 'REVIEW',
                    'NOTIFICATION', 'WAIT', 'END', 'PARALLEL', 'MERGE'
                ],
                message: 'Invalid stage type'
            }
        },
        order: {
            type: Number,
            required: [true, 'Stage order is required'],
            min: [1, 'Stage order must be at least 1']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Stage description cannot exceed 500 characters']
        },

        // Stage Configuration
        stageConfig: {
            isRequired: {
                type: Boolean,
                default: true
            },
            isSkippable: {
                type: Boolean,
                default: false
            },
            skipConditions: [{
                field: String,
                operator: {
                    type: String,
                    enum: ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'CONTAINS', 'IS_EMPTY']
                },
                value: mongoose.Schema.Types.Mixed
            }],
            autoAdvance: {
                type: Boolean,
                default: false
            },
            autoAdvanceDelay: Number, // minutes

            // Task-specific configuration
            taskConfig: {
                taskType: {
                    type: String,
                    enum: [
                        'DATA_ENTRY', 'VERIFICATION', 'REVIEW', 'APPROVAL',
                        'COMMUNICATION', 'CALCULATION', 'EXTERNAL_CALL', 'DOCUMENT_GENERATION'
                    ]
                },
                estimatedDuration: Number, // minutes
                requiredFields: [String],
                optionalFields: [String],
                validationRules: [{
                    field: String,
                    rule: String,
                    errorMessage: String
                }],
                formTemplate: String,
                instructions: String
            },

            // Decision configuration
            decisionConfig: {
                decisionType: {
                    type: String,
                    enum: ['BINARY', 'MULTIPLE_CHOICE', 'SCORED', 'CALCULATED']
                },
                decisionCriteria: String,
                options: [{
                    optionId: String,
                    optionText: String,
                    nextStageId: String,
                    conditions: [{
                        field: String,
                        operator: String,
                        value: mongoose.Schema.Types.Mixed
                    }]
                }],
                defaultOption: String
            },

            // Approval configuration
            approvalConfig: {
                approverRole: String,
                approverLevel: Number,
                requiresJustification: {
                    type: Boolean,
                    default: false
                },
                allowDelegation: {
                    type: Boolean,
                    default: true
                },
                escalationRules: [{
                    condition: String,
                    escalateTo: String,
                    delay: Number
                }]
            }
        },

        // Assignment Rules
        assignmentRules: {
            assignmentType: {
                type: String,
                required: [true, 'Assignment type is required'],
                enum: {
                    values: [
                        'ROLE_BASED', 'SKILL_BASED', 'LOAD_BALANCED',
                        'ROUND_ROBIN', 'MANUAL', 'AUTO_ASSIGN', 'POOL_ASSIGNMENT'
                    ],
                    message: 'Invalid assignment type'
                }
            },

            // Role-based assignment
            eligibleRoles: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }],
            eligibleDepartments: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Department'
            }],

            // Skill-based assignment
            requiredSkills: [{
                skill: String,
                level: {
                    type: Number,
                    min: [1, 'Skill level must be at least 1'],
                    max: [10, 'Skill level cannot exceed 10']
                },
                isRequired: {
                    type: Boolean,
                    default: true
                }
            }],

            // Load balancing
            loadBalancingMethod: {
                type: String,
                enum: ['CURRENT_WORKLOAD', 'HISTORICAL_PERFORMANCE', 'SKILL_MATCH', 'RANDOM']
            },
            maxConcurrentTasks: Number,

            // Pool assignment
            assignmentPool: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }],
            poolRotationMethod: {
                type: String,
                enum: ['ROUND_ROBIN', 'RANDOM', 'PERFORMANCE_BASED']
            }
        },

        // SLA Configuration
        slaConfig: {
            expectedDuration: {
                type: Number,
                min: [1, 'Expected duration must be at least 1 minute'],
                default: function () {
                    const stageType = this.stageType;
                    const defaults = {
                        'TASK': 60,
                        'REVIEW': 30,
                        'APPROVAL': 120,
                        'DECISION': 15,
                        'NOTIFICATION': 1
                    };
                    return defaults[stageType] || 30;
                }
            },
            warningThreshold: {
                type: Number,
                min: [10, 'Warning threshold must be at least 10%'],
                max: [90, 'Warning threshold cannot exceed 90%'],
                default: 75
            },
            escalationEnabled: {
                type: Boolean,
                default: true
            },
            escalationDelay: Number, // minutes after SLA breach
            businessHoursOnly: {
                type: Boolean,
                default: true
            }
        }
    }],

    // ** STAGE TRANSITIONS **
    stageTransitions: [{
        transitionId: {
            type: String,
            required: true,
            // default: () => crypto.randomBytes(3).toString('hex').toUpperCase()
        },
        fromStageId: {
            type: String,
            required: [true, 'From stage ID is required']
        },
        toStageId: {
            type: String,
            required: [true, 'To stage ID is required']
        },
        transitionName: String,

        // Transition Conditions
        transitionConditions: [{
            conditionType: {
                type: String,
                enum: ['FIELD_VALUE', 'USER_ACTION', 'TIME_BASED', 'CALCULATION', 'EXTERNAL_SYSTEM'],
                required: true
            },
            field: String,
            operator: {
                type: String,
                enum: ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'CONTAINS', 'IS_EMPTY']
            },
            value: mongoose.Schema.Types.Mixed,
            logicalOperator: {
                type: String,
                enum: ['AND', 'OR'],
                default: 'AND'
            }
        }],

        // Transition Actions
        transitionActions: [{
            actionType: {
                type: String,
                enum: [
                    'SET_FIELD', 'SEND_NOTIFICATION', 'CREATE_TASK', 'UPDATE_STATUS',
                    'CALCULATE_VALUE', 'EXTERNAL_API_CALL', 'GENERATE_DOCUMENT'
                ],
                required: true
            },
            actionConfig: mongoose.Schema.Types.Mixed,
            executeOrder: {
                type: Number,
                default: 1
            }
        }],

        isDefault: {
            type: Boolean,
            default: false
        },
        priority: {
            type: Number,
            default: 1
        }
    }],

    // ** WORKFLOW RULES **
    workflowRules: {
        // Entry Conditions
        entryConditions: [{
            field: String,
            operator: String,
            value: mongoose.Schema.Types.Mixed,
            isRequired: {
                type: Boolean,
                default: true
            }
        }],

        // Exit Conditions
        exitConditions: [{
            field: String,
            operator: String,
            value: mongoose.Schema.Types.Mixed
        }],

        // Business Rules
        businessRules: [{
            ruleName: String,
            ruleType: {
                type: String,
                enum: ['VALIDATION', 'CALCULATION', 'NOTIFICATION', 'ESCALATION', 'ASSIGNMENT']
            },
            ruleExpression: String,
            errorMessage: String,
            severity: {
                type: String,
                enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
                default: 'WARNING'
            }
        }],

        // Parallel Processing Rules
        parallelProcessing: {
            enabled: {
                type: Boolean,
                default: false
            },
            parallelStages: [String],
            synchronizationPoint: String,
            waitForAll: {
                type: Boolean,
                default: true
            }
        },

        // Loop Rules
        loopRules: [{
            loopStages: [String],
            maxIterations: {
                type: Number,
                default: 3
            },
            loopCondition: String,
            exitCondition: String
        }]
    },

    // ** NOTIFICATION CONFIGURATION **
    notificationConfig: {
        notifications: [{
            notificationId: String,
            triggerEvent: {
                type: String,
                enum: [
                    'WORKFLOW_START', 'STAGE_ENTER', 'STAGE_COMPLETE', 'STAGE_TIMEOUT',
                    'WORKFLOW_COMPLETE', 'ESCALATION', 'ERROR', 'APPROVAL_REQUIRED'
                ],
                required: true
            },
            targetStages: [String],

            // Recipients
            recipients: [{
                recipientType: {
                    type: String,
                    enum: ['ASSIGNEE', 'MANAGER', 'ROLE', 'SPECIFIC_USER', 'EXTERNAL'],
                    required: true
                },
                recipientId: String,
                notificationMethod: {
                    type: String,
                    enum: ['EMAIL', 'SMS', 'IN_APP', 'WEBHOOK'],
                    default: 'IN_APP'
                }
            }],

            // Message Configuration
            messageTemplate: {
                subject: String,
                body: String,
                priority: {
                    type: String,
                    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
                    default: 'MEDIUM'
                }
            },

            // Timing
            delay: Number, // minutes
            repeatInterval: Number, // minutes
            maxRepeats: {
                type: Number,
                default: 1
            }
        }]
    },

    // ** INTEGRATION CONFIGURATION **
    integrationConfig: {
        externalSystems: [{
            systemName: String,
            systemType: {
                type: String,
                enum: ['EHR', 'PMS', 'CLEARINGHOUSE', 'PAYER', 'API', 'DATABASE']
            },
            integrationPoint: String,
            authMethod: String,
            configParams: mongoose.Schema.Types.Mixed
        }],

        dataMapping: [{
            sourceField: String,
            targetField: String,
            transformation: String,
            isRequired: Boolean
        }],

        webhooks: [{
            eventType: String,
            url: String,
            method: {
                type: String,
                enum: ['GET', 'POST', 'PUT', 'DELETE'],
                default: 'POST'
            },
            headers: mongoose.Schema.Types.Mixed,
            retryPolicy: {
                maxRetries: Number,
                retryDelay: Number
            }
        }]
    },

    // ** TEMPLATE USAGE & PERFORMANCE **
    usageMetrics: {
        totalInstances: {
            type: Number,
            default: 0,
            min: [0, 'Total instances cannot be negative']
        },
        completedInstances: {
            type: Number,
            default: 0,
            min: [0, 'Completed instances cannot be negative']
        },
        averageCompletionTime: {
            type: Number,
            min: [0, 'Average completion time cannot be negative']
        },
        successRate: {
            type: Number,
            min: [0, 'Success rate cannot be negative'],
            max: [100, 'Success rate cannot exceed 100']
        },

        // Stage Performance
        stageMetrics: [{
            stageId: String,
            avgDuration: Number,
            completionRate: Number,
            bottleneckRating: {
                type: Number,
                min: [1, 'Bottleneck rating must be at least 1'],
                max: [10, 'Bottleneck rating cannot exceed 10']
            }
        }],

        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },

    // ** STATUS & LIFECYCLE **
    statusInfo: {
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
        isPublished: {
            type: Boolean,
            default: false
        },
        publishedAt: Date,
        publishedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },

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
            },
            isActive: {
                type: Boolean,
                default: false
            }
        }],

        // Approval Workflow
        approvalStatus: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVISION'],
            default: 'PENDING'
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedAt: Date,
        rejectionReason: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES **
workflowTemplateSchema.index({ companyRef: 1, 'templateInfo.templateType': 1 });
workflowTemplateSchema.index({ 'statusInfo.status': 1, 'statusInfo.isPublished': 1 });
workflowTemplateSchema.index({ 'templateInfo.category': 1, 'templateInfo.isStandard': 1 });
workflowTemplateSchema.index({ createdBy: 1, createdAt: -1 });
workflowTemplateSchema.index({ 'usageMetrics.successRate': -1 });

// ** VIRTUALS **
workflowTemplateSchema.virtual('totalStages').get(function () {
    return this.workflowStages?.length || 0;
});

workflowTemplateSchema.virtual('isActive').get(function () {
    return this.statusInfo?.status === WORKFLOW_STATUS.ACTIVE && this.statusInfo?.isPublished;
});

workflowTemplateSchema.virtual('estimatedDuration').get(function () {
    return this.workflowStages?.reduce((total, stage) => {
        return total + (stage.slaConfig?.expectedDuration || 0);
    }, 0) || 0;
});

workflowTemplateSchema.virtual('complexity').get(function () {
    const stageCount = this.totalStages;
    const transitionCount = this.stageTransitions?.length || 0;
    const ruleCount = this.workflowRules?.businessRules?.length || 0;

    const complexityScore = stageCount + (transitionCount * 0.5) + (ruleCount * 2);

    if (complexityScore <= 5) return 'SIMPLE';
    if (complexityScore <= 15) return 'MODERATE';
    if (complexityScore <= 30) return 'COMPLEX';
    return 'ADVANCED';
});

workflowTemplateSchema.virtual('efficiencyRating').get(function () {
    const successRate = this.usageMetrics?.successRate || 0;
    const avgTime = this.usageMetrics?.averageCompletionTime || 0;
    const estimatedTime = this.estimatedDuration;

    if (!avgTime || !estimatedTime) return 0;

    const timeEfficiency = Math.max(0, (estimatedTime / avgTime) * 100);
    return Math.round((successRate + timeEfficiency) / 2);
});

// ** STATIC METHODS **
workflowTemplateSchema.statics.findPublishedByType = function (companyId, templateType) {
    return this.find({
        companyRef: companyId,
        'templateInfo.templateType': templateType,
        'statusInfo.status': WORKFLOW_STATUS.ACTIVE,
        'statusInfo.isPublished': true
    }).populate('createdBy', 'firstName lastName');
};

workflowTemplateSchema.statics.findStandardTemplates = function (templateType = null) {
    const query = {
        'templateInfo.isStandard': true,
        'statusInfo.isPublished': true
    };

    if (templateType) {
        query['templateInfo.templateType'] = templateType;
    }

    return this.find(query).sort({ 'usageMetrics.successRate': -1 });
};

workflowTemplateSchema.statics.getUsageStatistics = function (companyId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'usageMetrics.lastUpdated': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: '$templateInfo.templateType',
                totalTemplates: { $sum: 1 },
                totalInstances: { $sum: '$usageMetrics.totalInstances' },
                completedInstances: { $sum: '$usageMetrics.completedInstances' },
                avgCompletionTime: { $avg: '$usageMetrics.averageCompletionTime' },
                avgSuccessRate: { $avg: '$usageMetrics.successRate' }
            }
        },
        {
            $project: {
                templateType: '$_id',
                totalTemplates: 1,
                totalInstances: 1,
                completedInstances: 1,
                overallSuccessRate: {
                    $round: [
                        { $multiply: [{ $divide: ['$completedInstances', '$totalInstances'] }, 100] },
                        2
                    ]
                },
                avgCompletionTimeHours: {
                    $round: [{ $divide: ['$avgCompletionTime', 60] }, 2]
                },
                avgSuccessRate: { $round: ['$avgSuccessRate', 2] }
            }
        }
    ]);
};

// ** INSTANCE METHODS **
workflowTemplateSchema.methods.addStage = function (stageData) {
    const maxOrder = Math.max(...this.workflowStages.map(s => s.order), 0);
    stageData.order = maxOrder + 1;
    stageData.stageId = stageData.stageId;

    this.workflowStages.push(stageData);
    return this.save();
};

workflowTemplateSchema.methods.addTransition = async function (fromStageId, toStageId, conditions = []) {
    const Company = mongoose.model(companyModel);
    const company = await Company.findById(this[companyRefPath]).select('companyCode');

    const code = company?.companyCode || 'GENERIC';
    const uid = uuidv4().slice(0, 6).toUpperCase();

    const transition = {
        transitionId: `TRANS-${code}-${uid}`,
        fromStageId,
        toStageId,
        transitionConditions: conditions
    };

    this.stageTransitions.push(transition);
    return this.save();
};

workflowTemplateSchema.methods.publish = function (publishedBy) {
    if (this.statusInfo?.status !== WORKFLOW_STATUS.ACTIVE) {
        throw new Error('Template must be active before publishing');
    }

    this.statusInfo.isPublished = true;
    this.statusInfo.publishedAt = new Date();
    this.statusInfo.publishedBy = publishedBy;

    return this.save();
};

workflowTemplateSchema.methods.createVersion = function (changes, changedBy) {
    const currentVersion = this.templateInfo?.version || '1.0.0';
    const versionParts = currentVersion.split('.').map(Number);
    versionParts[2] += 1; // Increment patch version

    const newVersion = versionParts.join('.');

    this.statusInfo.versionHistory.push({
        version: currentVersion,
        changes,
        changedBy,
        changedAt: new Date(),
        isActive: false
    });

    this.templateInfo.version = newVersion;
    return this.save();
};

workflowTemplateSchema.methods.updateUsageMetrics = function (instanceData) {
    this.usageMetrics.totalInstances += 1;

    if (instanceData.isCompleted) {
        this.usageMetrics.completedInstances += 1;

        // Update average completion time
        const currentAvg = this.usageMetrics.averageCompletionTime || 0;
        const completedCount = this.usageMetrics.completedInstances;
        this.usageMetrics.averageCompletionTime =
            ((currentAvg * (completedCount - 1)) + instanceData.completionTime) / completedCount;
    }

    // Update success rate
    this.usageMetrics.successRate =
        (this.usageMetrics.completedInstances / this.usageMetrics.totalInstances) * 100;

    this.usageMetrics.lastUpdated = new Date();

    return this.save();
};

workflowTemplateSchema.methods.getStageById = function (stageId) {
    return this.workflowStages?.find(stage => stage.stageId === stageId);
};

workflowTemplateSchema.methods.getNextStages = function (currentStageId) {
    const transitions = this.stageTransitions?.filter(t => t.fromStageId === currentStageId) || [];
    return transitions.map(t => this.getStageById(t.toStageId)).filter(Boolean);
};

workflowTemplateSchema.methods.validateWorkflow = function () {
    const errors = [];

    // Check for orphaned stages
    const stageIds = this.workflowStages?.map(s => s.stageId) || [];
    const transitionStageIds = new Set();

    this.stageTransitions?.forEach(t => {
        transitionStageIds.add(t.fromStageId);
        transitionStageIds.add(t.toStageId);
    });

    const orphanedStages = stageIds.filter(id => !transitionStageIds.has(id));
    if (orphanedStages.length > 0) {
        errors.push(`Orphaned stages detected: ${orphanedStages.join(', ')}`);
    }

    // Check for unreachable stages
    const startStages = this.workflowStages?.filter(s => s.stageType === 'START') || [];
    if (startStages.length === 0) {
        errors.push('No START stage defined');
    }

    const endStages = this.workflowStages?.filter(s => s.stageType === 'END') || [];
    if (endStages.length === 0) {
        errors.push('No END stage defined');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

workflowTemplateSchema.methods.clone = function (newName, clonedBy) {
    const clonedTemplate = this.toObject();
    delete clonedTemplate._id;
    delete clonedTemplate.templateId;
    delete clonedTemplate.createdAt;
    delete clonedTemplate.updatedAt;

    clonedTemplate.templateInfo.templateName = newName;
    clonedTemplate.createdBy = clonedBy;
    clonedTemplate.statusInfo.status = WORKFLOW_STATUS.DRAFT;
    clonedTemplate.statusInfo.isPublished = false;
    clonedTemplate.templateInfo.version = '1.0.0';
    clonedTemplate.usageMetrics = {
        totalInstances: 0,
        completedInstances: 0,
        averageCompletionTime: 0,
        successRate: 0
    };

    return this.constructor.create(clonedTemplate);
};

// ** PLUGINS **
workflowTemplateSchema.plugin(scopedIdPlugin, {
    idField: 'templateId',
    prefix: 'WFT',
    companyRefPath: 'companyRef'
})

workflowTemplateSchema.plugin(scopedIdPlugin, {
    idField: 'stageId',
    prefix: 'STG',
    companyRefPath: 'companyRef'
})

workflowTemplateSchema.plugin(scopedIdPlugin, {
    idField: 'transitionId',
    prefix: 'TRN',
    companyRefPath: 'companyRef'
})

// ** MIDDLEWARE **
workflowTemplateSchema.pre('save', function (next) {
    // Validate stage order
    const stages = this.workflowStages || [];
    const orders = stages.map(s => s.order).sort((a, b) => a - b);
    const expectedOrders = Array.from({ length: orders.length }, (_, i) => i + 1);

    if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) {
        next(new Error('Stage orders must be consecutive starting from 1'));
        return;
    }

    // Validate transitions
    const stageIds = stages.map(s => s.stageId);
    const invalidTransitions = this.stageTransitions?.filter(t =>
        !stageIds.includes(t.fromStageId) || !stageIds.includes(t.toStageId)
    );

    if (invalidTransitions?.length > 0) {
        next(new Error('All transitions must reference valid stage IDs'));
        return;
    }

    // Ensure START and END stages exist for published templates
    if (this.statusInfo?.isPublished) {
        const hasStart = stages.some(s => s.stageType === 'START');
        const hasEnd = stages.some(s => s.stageType === 'END');

        if (!hasStart || !hasEnd) {
            next(new Error('Published templates must have START and END stages'));
            return;
        }
    }

    next();
});

workflowTemplateSchema.post('save', async function (doc) {
    try {
        // Award XP for creating workflow templates
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

        // Create notification for published templates
        if (doc.isModified('statusInfo.isPublished') && doc.statusInfo?.isPublished) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.createdBy,
                type: 'WORKFLOW_PUBLISHED',
                title: 'Workflow Template Published',
                message: `Template ${doc.templateInfo.templateName} is now available for use`,
                priority: 'MEDIUM',
                relatedEntity: {
                    entityType: 'WorkflowTemplate',
                    entityId: doc._id
                }
            });
        }

    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

export const WorkflowTemplate = mongoose.model('WorkflowTemplate', workflowTemplateSchema, 'workflowTemplates');