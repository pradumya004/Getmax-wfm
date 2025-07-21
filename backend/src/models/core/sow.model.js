// backend/src/models/core/sow.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { SERVICE_TYPES, BILLING_MODELS, CURRENCIES } from '../../constants.js';

// RCM Metrics Schema 
const rcmMetricsSchema = new mongoose.Schema({
    // Volume Metrics
    volumeMetrics: {
        totalClaimsProcessed: {
            type: Number,
            default: 0,
            min: 0
        },
        totalClaimsAssigned: {
            type: Number,
            default: 0,
            min: 0
        },
        totalClaimsCompleted: {
            type: Number,
            default: 0,
            min: 0
        },
        averageDailyVolume: {
            type: Number,
            default: 0,
            min: 0
        },
        peakDailyVolume: {
            type: Number,
            default: 0,
            min: 0
        },
        weeklyVolumeTarget: {
            type: Number,
            default: 0,
            min: 0
        },
        monthlyVolumeTarget: {
            type: Number,
            default: 0,
            min: 0
        },
        lastVolumeUpdate: Date
    },

    // Performance Metrics
    performanceMetrics: {
        averageCompletionTimeHours: {
            type: Number,
            default: 0,
            min: 0
        },
        productivityRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 200 // Percentage of target
        },
        accuracyRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        firstPassSuccessRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        reworkRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        escalationRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },

    // Quality Metrics
    qualityMetrics: {
        currentQualityScoreAverage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        qualityTrend: {
            type: String,
            enum: ['Improving', 'Stable', 'Declining'],
            default: 'Stable'
        },
        defectRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        customerSatisfactionScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        qaPassRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        calibrationScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },

    // SLA Metrics
    slaMetrics: {
        currentSlaComplianceRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        slaBreaches: {
            type: Number,
            default: 0,
            min: 0
        },
        averageResponseTime: {
            type: Number,
            default: 0,
            min: 0
        },
        onTimeDeliveryRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        escalationCount: {
            type: Number,
            default: 0,
            min: 0
        }
    },

    // Financial Metrics
    financialMetrics: {
        monthlyRevenueGenerated: {
            type: Number,
            default: 0,
            min: 0
        },
        costPerTransaction: {
            type: Number,
            default: 0,
            min: 0
        },
        profitMargin: {
            type: Number,
            default: 0
        },
        billingAccuracy: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        collectionRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        denialRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },

    // Employee Metrics
    employeeMetrics: {
        totalAssignedEmployees: {
            type: Number,
            default: 0,
            min: 0
        },
        activeEmployees: {
            type: Number,
            default: 0,
            min: 0
        },
        averageExperienceMonths: {
            type: Number,
            default: 0,
            min: 0
        },
        employeeUtilizationRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        trainingHoursCompleted: {
            type: Number,
            default: 0,
            min: 0
        },
        certificationRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },

    // Historical Trends
    monthlyTrends: [{
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },
        volume: Number,
        quality: Number,
        slaCompliance: Number,
        revenue: Number,
        productivity: Number,
        satisfaction: Number
    }],

    // Benchmarking
    benchmarkData: {
        industryAverage: {
            quality: Number,
            productivity: Number,
            slaCompliance: Number,
            costPerTransaction: Number
        },
        clientTarget: {
            quality: Number,
            productivity: Number,
            slaCompliance: Number,
            costPerTransaction: Number
        },
        internalTarget: {
            quality: Number,
            productivity: Number,
            slaCompliance: Number,
            costPerTransaction: Number
        }
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    },
    nextReviewDate: Date
}, { _id: false });

// Workflow Configuration Schema 
const workflowConfigSchema = new mongoose.Schema({
    // Workflow Template Reference
    workflowTemplate: {
        templateName: {
            type: String,
            required: true,
            trim: true
        },
        templateVersion: {
            type: String,
            default: '1.0'
        },
        isCustomized: {
            type: Boolean,
            default: false
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },

    // Workflow Stages Configuration
    workflowStages: [{
        stageId: {
            type: String,
            required: true
        },
        stageName: {
            type: String,
            required: true,
            trim: true
        },
        stageOrder: {
            type: Number,
            required: true,
            min: 1
        },
        stageType: {
            type: String,
            enum: ['Input', 'Processing', 'Review', 'Approval', 'Output'],
            required: true
        },
        isRequired: {
            type: Boolean,
            default: true
        },
        isActive: {
            type: Boolean,
            default: true
        },

        // SLA Configuration
        slaConfiguration: {
            targetHours: {
                type: Number,
                required: true,
                min: 0.5
            },
            warningThresholdHours: Number,
            criticalThresholdHours: Number,
            businessHoursOnly: {
                type: Boolean,
                default: true
            },
            excludeWeekends: {
                type: Boolean,
                default: true
            },
            excludeHolidays: {
                type: Boolean,
                default: true
            }
        },

        // Assignment Rules
        assignmentRules: {
            assignmentType: {
                type: String,
                enum: ['Manual', 'Round Robin', 'Skill Based', 'Workload Based', 'Priority Based'],
                default: 'Manual'
            },
            autoAssign: {
                type: Boolean,
                default: false
            },
            requiredSkills: [String],
            requiredCertifications: [String],
            requiredRoleLevel: {
                type: Number,
                min: 1,
                max: 10
            },
            workloadCap: Number, // Maximum tasks per employee
            priorityWeighting: {
                type: Number,
                min: 0,
                max: 10,
                default: 5
            }
        },

        // QA Configuration
        qaConfiguration: {
            qaRequired: {
                type: Boolean,
                default: false
            },
            qaPercentage: {
                type: Number,
                min: 0,
                max: 100,
                default: 10
            },
            qaType: {
                type: String,
                enum: ['Random', 'Systematic', 'Risk Based', 'All'],
                default: 'Random'
            },
            qaSkipConditions: [String],
            scoreWeights: [{
                criterion: String,
                weight: {
                    type: Number,
                    min: 0,
                    max: 100
                }
            }],
            minimumPassScore: {
                type: Number,
                min: 0,
                max: 100,
                default: 80
            }
        },

        // Escalation Rules
        escalationRules: {
            enableEscalation: {
                type: Boolean,
                default: true
            },
            escalationTriggers: [{
                triggerType: {
                    type: String,
                    enum: ['Time Breach', 'Quality Failure', 'Volume Threshold', 'Error Rate', 'Custom'],
                    required: true
                },
                threshold: Number,
                action: {
                    type: String,
                    enum: ['Notify Manager', 'Reassign', 'Add Resources', 'Client Notification', 'Escalate to Senior'],
                    required: true
                },
                recipients: [String]
            }],
            escalationLevels: [{
                level: Number,
                triggerAfterHours: Number,
                assignTo: String,
                notificationMethod: String
            }]
        },

        // Validation Rules
        validationRules: {
            requiredFields: [String],
            conditionalFields: [{
                field: String,
                condition: String,
                requiredWhen: String
            }],
            businessRules: [{
                ruleName: String,
                condition: String,
                action: String,
                errorMessage: String
            }],
            dataValidation: [{
                field: String,
                validationType: String,
                parameters: mongoose.Schema.Types.Mixed
            }]
        },

        // Performance Targets
        performanceTargets: {
            targetCompletionTime: Number, // hours
            qualityTarget: Number, // percentage
            productivityTarget: Number, // tasks per hour/day
            accuracyTarget: Number, // percentage
            customerSatisfactionTarget: Number // percentage
        },

        // Stage Metrics
        stageMetrics: {
            averageCompletionTime: Number,
            totalCompleted: { type: Number, default: 0 },
            totalPending: { type: Number, default: 0 },
            totalEscalated: { type: Number, default: 0 },
            qualityScore: Number,
            slaComplianceRate: Number,
            lastUpdated: Date
        }
    }],

    // Workflow Rules
    workflowRules: {
        allowParallelProcessing: {
            type: Boolean,
            default: false
        },
        allowSkipStages: {
            type: Boolean,
            default: false
        },
        requireSequentialCompletion: {
            type: Boolean,
            default: true
        },
        autoProgressRules: [{
            condition: String,
            action: String,
            nextStage: String
        }],
        stopConditions: [String],
        restartConditions: [String]
    },

    // Notification Configuration
    notificationConfig: {
        enableNotifications: {
            type: Boolean,
            default: true
        },
        notificationEvents: [{
            event: {
                type: String,
                enum: ['Stage Start', 'Stage Complete', 'SLA Warning', 'SLA Breach', 'Quality Failure', 'Escalation'],
                required: true
            },
            recipients: [{
                recipientType: {
                    type: String,
                    enum: ['Assigned Employee', 'Manager', 'Client', 'QA Team', 'Custom'],
                    required: true
                },
                customRecipients: [String]
            }],
            notificationMethod: {
                type: String,
                enum: ['Email', 'SMS', 'In-App', 'Slack', 'Teams'],
                default: 'Email'
            },
            template: String,
            delay: Number // minutes
        }],
        digestSettings: {
            enabled: Boolean,
            frequency: String,
            recipients: [String]
        }
    },

    // Integration Settings
    integrationSettings: {
        externalSystemIntegrations: [{
            systemName: String,
            integrationType: String,
            endpoint: String,
            authMethod: String,
            dataMapping: mongoose.Schema.Types.Mixed,
            isActive: Boolean
        }],
        dataExchangeRules: [{
            trigger: String,
            action: String,
            targetSystem: String,
            dataFormat: String
        }],
        webhookConfig: [{
            event: String,
            endpoint: String,
            method: String,
            headers: mongoose.Schema.Types.Mixed,
            retryAttempts: Number
        }]
    },

    // Performance Monitoring
    performanceMonitoring: {
        enableMonitoring: {
            type: Boolean,
            default: true
        },
        monitoringFrequency: {
            type: String,
            enum: ['Real-time', 'Hourly', 'Daily', 'Weekly'],
            default: 'Daily'
        },
        kpiTargets: [{
            kpiName: String,
            target: Number,
            threshold: Number,
            unit: String
        }],
        alerting: {
            enabled: Boolean,
            alertRules: [{
                metric: String,
                condition: String,
                threshold: Number,
                action: String
            }]
        }
    },

    // Version Control
    versionControl: {
        currentVersion: {
            type: String,
            default: '1.0'
        },
        changeLog: [{
            version: String,
            changeDate: Date,
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            changeDescription: String,
            changeType: {
                type: String,
                enum: ['Created', 'Modified', 'Archived', 'Restored'],
                required: true
            }
        }],
        approvalRequired: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedDate: Date
    },

    lastConfigUpdate: {
        type: Date,
        default: Date.now
    },
    configuredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
}, { _id: false });

// Main SOW Schema (PRESERVING ALL  FIELDS + ENHANCEMENTS)
const sowSchema = new mongoose.Schema({
    //  SOW ID (PRESERVED EXACTLY)
    sowId: {
        type: String,
        unique: true,
        default: () => `SOW-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    //  MAIN RELATIONSHIPS (PRESERVED EXACTLY)
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

    //  SOW BASIC INFO (PRESERVED EXACTLY)
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

    //  SERVICE CONFIGURATION (PRESERVED EXACTLY)
    serviceDetails: {
        serviceType: {
            type: String,
            required: [true, 'Service type is required'],
            index: true
        },
        serviceSubType: {
            type: String,
            trim: true,
            maxlength: [50, 'Service sub-type cannot exceed 50 characters']
        },
        scopeFormatId: {
            type: String,
            required: true,
        }
    },

    //  CONTRACT & BILLING (PRESERVED EXACTLY)
    contractDetails: {
        contractType: {
            type: String,
            required: [true, 'Contract type is required']
        },
        billingModel: {
            type: String,
            required: [true, 'Billing model is required'],
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
        }
    },

    //  PERFORMANCE TARGETS & SLA (PRESERVED EXACTLY)
    performanceTargets: {
        dailyTargetPerEmp: {
            type: Number,
            min: [0, 'Daily target cannot be negative'],
            default: 0
        },
        weeklyTargetPerEmp: {
            type: Number,
            min: [0, 'Weekly target cannot be negative'],
            default: 0
        },
        monthlyTargetPerEmp: {
            type: Number,
            min: [0, 'Monthly target cannot be negative'],
            default: 0
        },
        qualityTarget: {
            type: Number,
            min: [0, 'Quality target cannot be negative'],
            max: [100, 'Quality target cannot exceed 100%'],
            default: 95
        },
        slaTarget: {
            type: Number,
            min: [0, 'SLA target cannot be negative'],
            max: [100, 'SLA target cannot exceed 100%'],
            default: 95
        },
        productivityTarget: {
            type: Number,
            min: [0, 'Productivity target cannot be negative'],
            max: [200, 'Productivity target cannot exceed 200%'],
            default: 100
        }
    },

    //  VOLUME FORECASTING (PRESERVED EXACTLY)
    volumeForecasting: {
        expectedDailyVolume: {
            type: Number,
            min: [0, 'Expected daily volume cannot be negative'],
            default: 0
        },
        expectedWeeklyVolume: {
            type: Number,
            min: [0, 'Expected weekly volume cannot be negative'],
            default: 0
        },
        expectedMonthlyVolume: {
            type: Number,
            min: [0, 'Expected monthly volume cannot be negative'],
            default: 0
        },
        peakPeriods: [{
            periodName: String,
            startDate: Date,
            endDate: Date,
            expectedIncrease: {
                type: Number,
                min: [0, 'Expected increase cannot be negative'],
                default: 0
            }
        }],
        seasonalVariations: [{
            season: String,
            variationPercentage: Number,
            description: String
        }]
    },

    //  RESOURCE PLANNING (PRESERVED EXACTLY)
    resourcePlanning: {
        requiredEmployeeCount: {
            type: Number,
            min: [0, 'Required employee count cannot be negative'],
            default: 1
        },
        requiredSkillSets: [String],
        requiredCertifications: [String],
        requiredRoleLevel: {
            type: Number,
            min: [1, 'Role level must be at least 1'],
            max: [10, 'Role level cannot exceed 10'],
            default: 1
        },
        trainingRequirements: [String],
        equipmentRequirements: [String],
        softwareRequirements: [String]
    },

    //  ACTIVITY METRICS (PRESERVED EXACTLY)
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
            max: [100, 'SLA compliance rate cannot exceed 100%']
        },
        currentQualityScoreAverage: {
            type: Number,
            default: 0,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100%']
        },
        monthlyRevenueGenerated: {
            type: Number,
            default: 0,
            min: [0, 'Monthly revenue cannot be negative']
        }
    },

    //  STATUS & LIFECYCLE (PRESERVED EXACTLY)
    status: {
        sowStatus: {
            type: String,
            enum: ['Draft', 'Active', 'On Hold', 'Completed', 'Terminated', 'Suspended'],
            default: 'Draft',
            index: true
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required']
        },
        endDate: Date,
        actualStartDate: Date,
        actualEndDate: Date,
        lastStatusUpdate: {
            type: Date,
            default: Date.now
        },
        statusNotes: {
            type: String,
            trim: true,
            maxlength: [500, 'Status notes cannot exceed 500 characters']
        }
    },

    // RCM METRICS 
    rcmMetrics: {
        type: rcmMetricsSchema,
        default: () => ({})
    },

    // WORKFLOW CONFIGURATION 
    workflowConfig: {
        type: workflowConfigSchema,
        default: () => ({})
    },

    //  SYSTEM INFO (PRESERVED EXACTLY)
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

    //  AUDIT TRAIL (PRESERVED EXACTLY)
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

//  INDEXES  + INDEXES
sowSchema.index({ companyRef: 1, clientRef: 1 });
sowSchema.index({ 'serviceDetails.serviceType': 1, 'status.sowStatus': 1 });
sowSchema.index({ 'status.startDate': 1, 'status.endDate': 1 });
sowSchema.index({ 'systemInfo.isActive': 1, 'systemInfo.autoAssignmentEnabled': 1 });
sowSchema.index({ 'activityMetrics.currentSlaComplianceRate': 1 });
sowSchema.index({ 'activityMetrics.currentQualityScoreAverage': 1 });
// RCM INDEXES
sowSchema.index({ 'rcmMetrics.performanceMetrics.productivityRate': 1 });
sowSchema.index({ 'rcmMetrics.qualityMetrics.currentQualityScoreAverage': 1 });
sowSchema.index({ 'workflowConfig.workflowTemplate.templateName': 1 });

// Compound index for assignment queries 
sowSchema.index({
    companyRef: 1,
    'serviceDetails.serviceType': 1,
    'status.sowStatus': 1,
    'systemInfo.isActive': 1
});

//  VIRTUAL FIELDS 
sowSchema.virtual('monthlyTargetVolume').get(function () {
    return this.volumeForecasting?.expectedDailyVolume * 22 || 0;
});

sowSchema.virtual('isExpiringSoon').get(function () {
    if (!this.status.endDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.status.endDate <= thirtyDaysFromNow;
});

sowSchema.virtual('currentCapacityUtilization').get(function () {
    if (this.volumeForecasting?.expectedDailyVolume === 0) return 0;
    return Math.round((this.activityMetrics.totalClaimsAssigned / this.volumeForecasting.expectedDailyVolume) * 100);
});

// RCM VIRTUAL FIELDS 
sowSchema.virtual('overallPerformanceScore').get(function () {
    const quality = this.rcmMetrics?.qualityMetrics?.currentQualityScoreAverage || 0;
    const sla = this.rcmMetrics?.slaMetrics?.currentSlaComplianceRate || 0;
    const productivity = this.rcmMetrics?.performanceMetrics?.productivityRate || 0;

    return Math.round((quality + sla + Math.min(productivity, 100)) / 3);
});

sowSchema.virtual('workflowEfficiency').get(function () {
    const stages = this.workflowConfig?.workflowStages || [];
    if (stages.length === 0) return 0;

    const avgSlaCompliance = stages.reduce((sum, stage) =>
        sum + (stage.stageMetrics?.slaComplianceRate || 0), 0) / stages.length;

    return Math.round(avgSlaCompliance);
});

sowSchema.virtual('riskScore').get(function () {
    let riskScore = 0;

    // Quality risk
    const quality = this.rcmMetrics?.qualityMetrics?.currentQualityScoreAverage || 0;
    if (quality < 80) riskScore += 30;
    else if (quality < 90) riskScore += 15;

    // SLA risk
    const sla = this.rcmMetrics?.slaMetrics?.currentSlaComplianceRate || 0;
    if (sla < 85) riskScore += 25;
    else if (sla < 95) riskScore += 10;

    // Volume risk
    const utilization = this.currentCapacityUtilization;
    if (utilization > 120) riskScore += 20;
    else if (utilization > 100) riskScore += 10;

    // Financial risk
    const denialRate = this.rcmMetrics?.financialMetrics?.denialRate || 0;
    if (denialRate > 15) riskScore += 15;
    else if (denialRate > 10) riskScore += 8;

    return Math.min(riskScore, 100);
});

sowSchema.virtual('projectionsVsActuals').get(function () {
    const expectedMonthly = this.volumeForecasting?.expectedMonthlyVolume || 0;
    const actualMonthly = this.rcmMetrics?.volumeMetrics?.totalClaimsProcessed || 0;

    if (expectedMonthly === 0) return { variance: 0, status: 'No Data' };

    const variance = ((actualMonthly - expectedMonthly) / expectedMonthly) * 100;
    let status = 'On Track';

    if (variance < -20) status = 'Significantly Below';
    else if (variance < -10) status = 'Below Expected';
    else if (variance > 20) status = 'Significantly Above';
    else if (variance > 10) status = 'Above Expected';

    return { variance: Math.round(variance), status };
});

// VIRTUAL POPULATION 
sowSchema.virtual('assignedEmployees', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'sowAssignments.sowRef',
    justOne: false,
});

//  STATIC METHODS 
sowSchema.statics.findActiveSOWsByCompany = function (companyRef) {
    return this.find({
        companyRef,
        'status.sowStatus': 'Active',
        'systemInfo.isActive': true
    }).populate('clientRef', 'clientInfo.clientName')
        .populate('auditInfo.createdBy', 'personalInfo.firstName personalInfo.lastName');
};

sowSchema.statics.findSOWsByServiceType = function (companyRef, serviceType) {
    return this.find({
        companyRef,
        'serviceDetails.serviceType': serviceType,
        'systemInfo.isActive': true
    });
};

sowSchema.statics.findSOWsNeedingAttention = function (companyRef) {
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

// RCM STATIC METHODS 
sowSchema.statics.findHighRiskSOWs = function (companyRef, riskThreshold = 50) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'status.sowStatus': 'Active'
    }).then(sows => {
        return sows.filter(sow => sow.riskScore >= riskThreshold);
    });
};

sowSchema.statics.findUnderperformingSOWs = function (companyRef, performanceThreshold = 70) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'status.sowStatus': 'Active'
    }).then(sows => {
        return sows.filter(sow => sow.overallPerformanceScore < performanceThreshold);
    });
};

sowSchema.statics.getPerformanceSummary = function (companyRef) {
    return this.aggregate([
        { $match: { companyRef: new mongoose.Types.ObjectId(companyRef), 'systemInfo.isActive': true } },
        {
            $group: {
                _id: '$serviceDetails.serviceType',
                totalSOWs: { $sum: 1 },
                avgQuality: { $avg: '$rcmMetrics.qualityMetrics.currentQualityScoreAverage' },
                avgSLA: { $avg: '$rcmMetrics.slaMetrics.currentSlaComplianceRate' },
                totalVolume: { $sum: '$rcmMetrics.volumeMetrics.totalClaimsProcessed' },
                totalRevenue: { $sum: '$rcmMetrics.financialMetrics.monthlyRevenueGenerated' }
            }
        }
    ]);
};

//  INSTANCE METHODS 
sowSchema.methods.updateActivityMetrics = function (claimsData) {
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

sowSchema.methods.canEmployeeBeAssigned = function (employee) {
    // Check if employee's role level meets requirement
    if (employee.roleRef.roleLevel < this.resourcePlanning.requiredRoleLevel) {
        return { canAssign: false, reason: 'Insufficient role level' };
    }

    // Check if employee has required skills
    const empSkills = employee.skillsAndQualifications.skills || [];
    const reqSkills = this.resourcePlanning.requiredSkillSets || [];
    const hasRequiredSkills = reqSkills.every(skill => empSkills.includes(skill));

    if (!hasRequiredSkills) {
        return { canAssign: false, reason: 'Missing required skills' };
    }

    return { canAssign: true, reason: 'Employee meets all requirements' };
};

// RCM INSTANCE METHODS 
sowSchema.methods.updateRcmMetrics = function (metricsData) {
    if (!this.rcmMetrics) this.rcmMetrics = {};

    // Update volume metrics
    if (metricsData.volume) {
        Object.assign(this.rcmMetrics.volumeMetrics || {}, metricsData.volume);
    }

    // Update performance metrics
    if (metricsData.performance) {
        Object.assign(this.rcmMetrics.performanceMetrics || {}, metricsData.performance);
    }

    // Update quality metrics
    if (metricsData.quality) {
        Object.assign(this.rcmMetrics.qualityMetrics || {}, metricsData.quality);
    }

    // Update SLA metrics
    if (metricsData.sla) {
        Object.assign(this.rcmMetrics.slaMetrics || {}, metricsData.sla);
    }

    // Update financial metrics
    if (metricsData.financial) {
        Object.assign(this.rcmMetrics.financialMetrics || {}, metricsData.financial);
    }

    this.rcmMetrics.lastUpdated = new Date();
};

sowSchema.methods.addMonthlyTrend = function (year, month, trendData) {
    if (!this.rcmMetrics) this.rcmMetrics = {};
    if (!this.rcmMetrics.monthlyTrends) this.rcmMetrics.monthlyTrends = [];

    // Remove existing trend for the same month/year
    this.rcmMetrics.monthlyTrends = this.rcmMetrics.monthlyTrends.filter(
        trend => !(trend.year === year && trend.month === month)
    );

    // Add new trend data
    this.rcmMetrics.monthlyTrends.push({
        year,
        month,
        ...trendData
    });

    // Keep only last 24 months
    this.rcmMetrics.monthlyTrends.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
    });

    if (this.rcmMetrics.monthlyTrends.length > 24) {
        this.rcmMetrics.monthlyTrends = this.rcmMetrics.monthlyTrends.slice(0, 24);
    }
};

sowSchema.methods.updateWorkflowStageMetrics = function (stageId, metricsData) {
    const stage = this.workflowConfig?.workflowStages?.find(s => s.stageId === stageId);
    if (stage) {
        if (!stage.stageMetrics) stage.stageMetrics = {};
        Object.assign(stage.stageMetrics, metricsData);
        stage.stageMetrics.lastUpdated = new Date();
    }
};

sowSchema.methods.getWorkflowStageByOrder = function (stageOrder) {
    return this.workflowConfig?.workflowStages?.find(stage => stage.stageOrder === stageOrder);
};

sowSchema.methods.getNextWorkflowStage = function (currentStageOrder) {
    const stages = this.workflowConfig?.workflowStages?.filter(stage => stage.isActive) || [];
    return stages.find(stage => stage.stageOrder === currentStageOrder + 1);
};

sowSchema.methods.calculateBenchmarkComparison = function () {
    const metrics = this.rcmMetrics;
    const benchmarks = metrics?.benchmarkData;

    if (!metrics || !benchmarks) return null;

    const comparison = {
        quality: {
            current: metrics.qualityMetrics?.currentQualityScoreAverage || 0,
            industry: benchmarks.industryAverage?.quality || 0,
            client: benchmarks.clientTarget?.quality || 0,
            internal: benchmarks.internalTarget?.quality || 0
        },
        productivity: {
            current: metrics.performanceMetrics?.productivityRate || 0,
            industry: benchmarks.industryAverage?.productivity || 0,
            client: benchmarks.clientTarget?.productivity || 0,
            internal: benchmarks.internalTarget?.productivity || 0
        },
        slaCompliance: {
            current: metrics.slaMetrics?.currentSlaComplianceRate || 0,
            industry: benchmarks.industryAverage?.slaCompliance || 0,
            client: benchmarks.clientTarget?.slaCompliance || 0,
            internal: benchmarks.internalTarget?.slaCompliance || 0
        }
    };

    return comparison;
};

//  PRE-SAVE MIDDLEWARE (PRESERVED + NEW)
sowSchema.pre('save', function (next) {
    // Update last modified info
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }

    // Validate date ranges
    if (this.status.startDate && this.status.endDate) {
        if (this.status.startDate >= this.status.endDate) {
            return next(new Error('End date must be after start date'));
        }
    }

    // Calculate monthly target volume from daily volume
    if (this.volumeForecasting?.expectedDailyVolume) {
        this.volumeForecasting.expectedMonthlyVolume = this.volumeForecasting.expectedDailyVolume * 22;
        this.volumeForecasting.expectedWeeklyVolume = this.volumeForecasting.expectedDailyVolume * 5;
    }

    // Update workflow stage metrics if workflow stages exist
    if (this.workflowConfig?.workflowStages) {
        this.workflowConfig.lastConfigUpdate = new Date();
    }

    // Update RCM metrics timestamp
    if (this.rcmMetrics && this.isModified('rcmMetrics')) {
        this.rcmMetrics.lastUpdated = new Date();
    }

    next();
});

//  POST-SAVE MIDDLEWARE 
sowSchema.post('save', function (doc, next) {
    // Could trigger notifications, updates to related documents, etc.
    next();
});

export const SOW = mongoose.model('SOW', sowSchema, 'sows');