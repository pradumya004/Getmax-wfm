// backend/src/models/performance/sla-tracking.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const slaTrackingSchema = new mongoose.Schema({
    slaId: {
        type: String,
        unique: true,
        default: () => `SLA-${uuidv4().substring(0, 10).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },
    
    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // GetMax company
        required: [true, 'Company reference is required'],
        index: true
    },
    claimRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClaimTask', // Claim being tracked
        required: [true, 'Claim reference is required'],
        index: true
    },
    clientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Client for SLA rules
        required: [true, 'Client reference is required'],
        index: true
    },
    sowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SOW', // SOW for SLA configuration
        required: [true, 'SOW reference is required'],
        index: true
    },
    assignedEmployeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Currently assigned employee
        index: true
    },

    // ** SLA CONFIGURATION **
    slaConfig: {
        slaType: {
            type: String,
            enum: [
                'Initial Review', 'Assignment', 'Processing', 'Follow-up',
                'QA Review', 'Appeal Processing', 'Payment Processing',
                'Resolution', 'Client Response', 'Custom'
            ],
            required: [true, 'SLA type is required'],
            index: true
        },
        slaDescription: {
            type: String,
            trim: true,
            maxlength: [200, 'SLA description cannot exceed 200 characters']
        },
        targetHours: {
            type: Number,
            required: [true, 'Target hours is required'],
            min: [0.5, 'Target hours must be at least 0.5 hours'],
            max: [8760, 'Target hours cannot exceed 8760 hours (1 year)'] // 1 year max
        },
        businessHoursOnly: {
            type: Boolean,
            default: true
        },
        workingDays: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }],
        excludeHolidays: {
            type: Boolean,
            default: true
        },
        timezone: {
            type: String,
            enum: [
                'EST', 'CST', 'MST', 'PST', 'GMT', 'IST',
                'America/New_York', 'America/Chicago', 'America/Denver', 
                'America/Los_Angeles', 'UTC', 'Asia/Kolkata'
            ],
            default: 'EST'
        }
    },

    // ** TRIGGER EVENTS **
    triggerInfo: {
        triggerEvent: {
            type: String,
            enum: [
                'Claim Import', 'Claim Assignment', 'Status Change', 
                'Note Addition', 'Manual Start', 'QA Assignment',
                'Escalation', 'Appeal Filing', 'Payment Request'
            ],
            required: [true, 'Trigger event is required'],
            index: true
        },
        triggerCondition: {
            type: String,
            trim: true // Additional conditions like "Status = In Progress"
        },
        autoTrigger: {
            type: Boolean,
            default: true
        },
        triggerSource: {
            type: String,
            enum: ['System', 'User', 'API', 'Workflow', 'Schedule'],
            default: 'System'
        },
        triggeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    },

    // ** TIMER INFORMATION **
    timerInfo: {
        startDateTime: {
            type: Date,
            required: [true, 'Start date time is required'],
            index: true
        },
        endDateTime: {
            type: Date,
            index: true
        },
        dueDateTime: {
            type: Date,
            required: [true, 'Due date time is required'],
            index: true
        },
        actualCompletionDateTime: Date,
        
        // Time calculations
        totalElapsedHours: {
            type: Number,
            default: 0,
            min: [0, 'Total elapsed hours cannot be negative']
        },
        businessHoursElapsed: {
            type: Number,
            default: 0,
            min: [0, 'Business hours elapsed cannot be negative']
        },
        timeRemaining: {
            type: Number,
            default: 0 // Can be negative if breached
        },
        businessHoursRemaining: {
            type: Number,
            default: 0 // Can be negative if breached
        },
        
        // Pause functionality
        isPaused: {
            type: Boolean,
            default: false,
            index: true
        },
        totalPausedHours: {
            type: Number,
            default: 0,
            min: [0, 'Total paused hours cannot be negative']
        },
        pauseHistory: [{
            pausedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            pausedAt: {
                type: Date,
                required: true
            },
            pauseReason: {
                type: String,
                enum: [
                    'Waiting for Client', 'Waiting for Payer', 'Waiting for Information',
                    'System Maintenance', 'Holiday', 'Technical Issue', 'Manual Hold',
                    'Patient Request', 'Provider Request', 'Other'
                ],
                required: true
            },
            pauseNotes: {
                type: String,
                trim: true
            },
            resumedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            resumedAt: Date,
            resumeNotes: {
                type: String,
                trim: true
            },
            pauseDurationHours: {
                type: Number,
                default: 0,
                min: [0, 'Pause duration cannot be negative']
            }
        }]
    },

    // ** SLA STATUS TRACKING **
    statusInfo: {
        currentStatus: {
            type: String,
            enum: [
                'Not Started', 'Active', 'Paused', 'At Risk', 'Breached', 
                'Completed', 'Cancelled', 'Reset', 'Escalated'
            ],
            required: [true, 'Current status is required'],
            default: 'Not Started',
            index: true
        },
        previousStatus: {
            type: String,
            enum: [
                'Not Started', 'Active', 'Paused', 'At Risk', 'Breached', 
                'Completed', 'Cancelled', 'Reset', 'Escalated'
            ]
        },
        
        // Warning thresholds
        warningThresholdPercent: {
            type: Number,
            min: [50, 'Warning threshold cannot be less than 50%'],
            max: [95, 'Warning threshold cannot exceed 95%'],
            default: 75
        },
        criticalThresholdPercent: {
            type: Number,
            min: [80, 'Critical threshold cannot be less than 80%'],
            max: [99, 'Critical threshold cannot exceed 99%'],
            default: 90
        },
        
        // Status change history
        statusHistory: [{
            status: {
                type: String,
                required: true
            },
            changedAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reason: {
                type: String,
                trim: true
            },
            notes: {
                type: String,
                trim: true
            },
            systemGenerated: {
                type: Boolean,
                default: false
            }
        }],
        
        lastStatusUpdate: {
            type: Date,
            default: Date.now,
            index: true
        }
    },

    // ** BREACH INFORMATION **
    breachInfo: {
        isBreached: {
            type: Boolean,
            default: false,
            index: true
        },
        breachDateTime: {
            type: Date,
            index: true
        },
        breachDurationHours: {
            type: Number,
            default: 0,
            min: [0, 'Breach duration cannot be negative']
        },
        breachSeverity: {
            type: String,
            enum: ['Minor', 'Moderate', 'Major', 'Critical'],
            default: 'Minor'
        },
        breachCategory: {
            type: String,
            enum: [
                'Processing Delay', 'Assignment Delay', 'Follow-up Delay',
                'QA Delay', 'System Issue', 'Resource Shortage',
                'Client Delay', 'External Dependency', 'Other'
            ]
        },
        breachReason: {
            type: String,
            trim: true
        },
        breachImpact: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Low'
        },
        clientNotified: {
            type: Boolean,
            default: false
        },
        clientNotificationDate: Date,
        managementNotified: {
            type: Boolean,
            default: false
        },
        managementNotificationDate: Date
    },

    // ** ESCALATION INFORMATION **
    escalationInfo: {
        isEscalated: {
            type: Boolean,
            default: false,
            index: true
        },
        escalationLevel: {
            type: Number,
            min: [1, 'Escalation level must be at least 1'],
            max: [5, 'Escalation level cannot exceed 5'],
            default: 1
        },
        escalatedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        escalatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        escalationDateTime: Date,
        escalationReason: {
            type: String,
            enum: [
                'SLA Breach', 'At Risk', 'Complex Case', 'Client Request',
                'Quality Issue', 'Resource Constraint', 'Technical Issue', 'Other'
            ]
        },
        escalationNotes: {
            type: String,
            trim: true
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
                required: true
            },
            reason: String,
            notes: String,
            resolvedAt: Date,
            resolvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            resolution: String
        }]
    },

    // ** RESOLUTION INFORMATION **
    resolutionInfo: {
        isResolved: {
            type: Boolean,
            default: false,
            index: true
        },
        resolutionDateTime: Date,
        resolutionMethod: {
            type: String,
            enum: [
                'Completed On Time', 'Completed Late', 'Cancelled', 'Transferred',
                'Escalated to Higher Level', 'Client Extension', 'System Override'
            ]
        },
        resolutionNotes: {
            type: String,
            trim: true
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        finalOutcome: {
            type: String,
            enum: [
                'Success', 'Partial Success', 'Failed', 'Cancelled',
                'Transferred', 'Extension Granted', 'Override Applied'
            ]
        },
        
        // Performance metrics
        performanceRating: {
            type: String,
            enum: ['Excellent', 'Good', 'Satisfactory', 'Poor', 'Failed'],
            default: 'Satisfactory'
        },
        meetsExpectation: {
            type: Boolean,
            default: true
        },
        lessonsLearned: {
            type: String,
            trim: true
        },
        improvementSuggestions: {
            type: String,
            trim: true
        }
    },

    // ** NOTIFICATIONS & ALERTS **
    notificationInfo: {
        warningAlertSent: {
            type: Boolean,
            default: false
        },
        warningAlertDateTime: Date,
        criticalAlertSent: {
            type: Boolean,
            default: false
        },
        criticalAlertDateTime: Date,
        breachAlertSent: {
            type: Boolean,
            default: false
        },
        breachAlertDateTime: Date,
        
        notificationRecipients: [{
            recipientType: {
                type: String,
                enum: ['Employee', 'Manager', 'Client', 'Admin', 'External'],
                required: true
            },
            recipientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            notificationMethod: {
                type: String,
                enum: ['Email', 'SMS', 'In-App', 'Slack', 'Teams', 'Webhook'],
                required: true
            },
            lastNotified: Date,
            notificationCount: {
                type: Number,
                default: 0
            }
        }],
        
        suppressNotifications: {
            type: Boolean,
            default: false
        },
        suppressionReason: {
            type: String,
            trim: true
        }
    },

    // ** COMPLIANCE & REPORTING **
    complianceInfo: {
        complianceType: {
            type: String,
            enum: ['Internal SLA', 'Client SLA', 'Regulatory', 'Industry Standard', 'Custom'],
            default: 'Internal SLA'
        },
        regulatoryRequirement: {
            type: String,
            trim: true
        },
        auditTrailRequired: {
            type: Boolean,
            default: true
        },
        reportingRequired: {
            type: Boolean,
            default: true
        },
        reportingFrequency: {
            type: String,
            enum: ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'As Needed'],
            default: 'Weekly'
        },
        lastReported: Date,
        complianceScore: {
            type: Number,
            min: [0, 'Compliance score cannot be negative'],
            max: [100, 'Compliance score cannot exceed 100'],
            default: 100
        }
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isSystemGenerated: {
            type: Boolean,
            default: true
        },
        automatedCalculations: {
            type: Boolean,
            default: true
        },
        manualOverride: {
            type: Boolean,
            default: false
        },
        overrideReason: {
            type: String,
            trim: true
        },
        overrideBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        overrideDate: Date,
        
        // Calculation metadata
        lastCalculationRun: {
            type: Date,
            default: Date.now
        },
        calculationVersion: {
            type: String,
            default: '1.0'
        },
        dataSource: {
            type: String,
            enum: ['Real-time', 'Scheduled Job', 'Manual Update', 'API Sync'],
            default: 'Real-time'
        }
    },

    // ** AUDIT TRAIL **
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Created by reference is required']
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        lastCalculatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastCalculatedAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
slaTrackingSchema.index({ companyRef: 1, 'statusInfo.currentStatus': 1 });
slaTrackingSchema.index({ claimRef: 1, 'systemInfo.isActive': 1 });
slaTrackingSchema.index({ assignedEmployeeRef: 1, 'statusInfo.currentStatus': 1 });
slaTrackingSchema.index({ 'timerInfo.dueDateTime': 1, 'statusInfo.currentStatus': 1 });
slaTrackingSchema.index({ 'breachInfo.isBreached': 1, 'breachInfo.breachDateTime': 1 });
slaTrackingSchema.index({ 'escalationInfo.isEscalated': 1 });

// Compound indexes for complex queries
slaTrackingSchema.index({
    companyRef: 1,
    'statusInfo.currentStatus': 1,
    'timerInfo.dueDateTime': 1
});

slaTrackingSchema.index({
    sowRef: 1,
    'slaConfig.slaType': 1,
    'systemInfo.isActive': 1
});

// ** VIRTUAL FIELDS **
slaTrackingSchema.virtual('isOverdue').get(function() {
    return new Date() > this.timerInfo.dueDateTime && 
           !['Completed', 'Cancelled'].includes(this.statusInfo.currentStatus);
});

slaTrackingSchema.virtual('urgencyLevel').get(function() {
    if (this.statusInfo.currentStatus === 'Breached') return 'Critical';
    if (this.statusInfo.currentStatus === 'At Risk') return 'High';
    
    const now = new Date();
    const timeRemainingPercent = (this.timerInfo.dueDateTime - now) / 
                                (this.timerInfo.dueDateTime - this.timerInfo.startDateTime) * 100;
    
    if (timeRemainingPercent <= 10) return 'Critical';
    if (timeRemainingPercent <= 25) return 'High';
    if (timeRemainingPercent <= 50) return 'Medium';
    return 'Low';
});

slaTrackingSchema.virtual('performanceCategory').get(function() {
    if (!this.resolutionInfo.isResolved) return 'In Progress';
    if (this.breachInfo.isBreached) return 'Failed';
    if (this.timerInfo.actualCompletionDateTime <= this.timerInfo.dueDateTime) return 'Met';
    return 'Missed';
});

slaTrackingSchema.virtual('claim', {
    ref: 'ClaimTask',
    localField: 'claimRef',
    foreignField: '_id',
    justOne: true
});

slaTrackingSchema.virtual('assignedEmployee', {
    ref: 'Employee',
    localField: 'assignedEmployeeRef',
    foreignField: '_id',
    justOne: true
});

// ** STATIC METHODS **
slaTrackingSchema.statics.findActiveByEmployee = function(employeeRef) {
    return this.find({
        assignedEmployeeRef: employeeRef,
        'statusInfo.currentStatus': { $in: ['Active', 'At Risk'] },
        'systemInfo.isActive': true
    })
    .populate('claimRef', 'claimId workflowStatus.currentStatus')
    .sort({ 'timerInfo.dueDateTime': 1 });
};

slaTrackingSchema.statics.findBreachedSLAs = function(companyRef, fromDate = null, toDate = null) {
    const query = {
        companyRef,
        'breachInfo.isBreached': true,
        'systemInfo.isActive': true
    };
    
    if (fromDate || toDate) {
        query['breachInfo.breachDateTime'] = {};
        if (fromDate) query['breachInfo.breachDateTime'].$gte = new Date(fromDate);
        if (toDate) query['breachInfo.breachDateTime'].$lte = new Date(toDate);
    }
    
    return this.find(query)
        .populate('claimRef', 'claimId workflowStatus.currentStatus')
        .populate('assignedEmployeeRef', 'personalInfo.firstName personalInfo.lastName')
        .sort({ 'breachInfo.breachDateTime': -1 });
};

slaTrackingSchema.statics.findAtRiskSLAs = function(companyRef, hoursAhead = 24) {
    const cutoffDateTime = new Date();
    cutoffDateTime.setHours(cutoffDateTime.getHours() + hoursAhead);
    
    return this.find({
        companyRef,
        'statusInfo.currentStatus': { $in: ['Active', 'At Risk'] },
        'timerInfo.dueDateTime': { $lte: cutoffDateTime },
        'systemInfo.isActive': true
    })
    .populate('claimRef', 'claimId workflowStatus.currentStatus')
    .populate('assignedEmployeeRef', 'personalInfo.firstName personalInfo.lastName')
    .sort({ 'timerInfo.dueDateTime': 1 });
};

slaTrackingSchema.statics.findBySOWAndType = function(sowRef, slaType, status = null) {
    const query = {
        sowRef,
        'slaConfig.slaType': slaType,
        'systemInfo.isActive': true
    };
    
    if (status) {
        query['statusInfo.currentStatus'] = status;
    }
    
    return this.find(query)
        .populate('claimRef', 'claimId workflowStatus.currentStatus')
        .sort({ 'timerInfo.startDateTime': -1 });
};

slaTrackingSchema.statics.getSLAPerformanceStats = function(companyRef, fromDate, toDate, sowRef = null) {
    const matchStage = {
        companyRef: mongoose.Types.ObjectId(companyRef),
        'resolutionInfo.isResolved': true,
        'timerInfo.startDateTime': {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        }
    };
    
    if (sowRef) matchStage.sowRef = mongoose.Types.ObjectId(sowRef);
    
    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$slaConfig.slaType',
                totalSLAs: { $sum: 1 },
                metSLAs: {
                    $sum: {
                        $cond: [{ $eq: ['$breachInfo.isBreached', false] }, 1, 0]
                    }
                },
                breachedSLAs: {
                    $sum: {
                        $cond: [{ $eq: ['$breachInfo.isBreached', true] }, 1, 0]
                    }
                },
                avgCompletionHours: { $avg: '$timerInfo.totalElapsedHours' },
                avgBreachDuration: { $avg: '$breachInfo.breachDurationHours' }
            }
        },
        {
            $addFields: {
                complianceRate: {
                    $multiply: [
                        { $divide: ['$metSLAs', '$totalSLAs'] },
                        100
                    ]
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

// ** INSTANCE METHODS **
slaTrackingSchema.methods.calculateTimeRemaining = function() {
    const now = new Date();
    const dueDate = this.timerInfo.dueDateTime;
    
    if (this.timerInfo.isPaused) {
        // If paused, time remaining stays the same as when paused
        return this.timerInfo.timeRemaining;
    }
    
    const remainingMs = dueDate.getTime() - now.getTime();
    this.timerInfo.timeRemaining = remainingMs / (1000 * 60 * 60); // Convert to hours
    
    return this.timerInfo.timeRemaining;
};

slaTrackingSchema.methods.updateStatus = function(newStatus, changedBy, reason = '', notes = '') {
    const oldStatus = this.statusInfo.currentStatus;
    
    this.statusInfo.previousStatus = oldStatus;
    this.statusInfo.currentStatus = newStatus;
    this.statusInfo.lastStatusUpdate = new Date();
    
    // Add to status history
    this.statusInfo.statusHistory.push({
        status: newStatus,
        changedBy,
        reason,
        notes,
        systemGenerated: !changedBy
    });
    
    // Handle specific status changes
    if (newStatus === 'Breached' && !this.breachInfo.isBreached) {
        this.handleBreach(reason);
    }
    
    if (newStatus === 'Completed') {
        this.complete(changedBy, notes);
    }
};

slaTrackingSchema.methods.handleBreach = function(reason = '') {
    const now = new Date();
    
    this.breachInfo.isBreached = true;
    this.breachInfo.breachDateTime = now;
    this.breachInfo.breachReason = reason;
    
    // Calculate breach duration
    const breachDurationMs = now.getTime() - this.timerInfo.dueDateTime.getTime();
    this.breachInfo.breachDurationHours = breachDurationMs / (1000 * 60 * 60);
    
    // Determine breach severity based on duration
    if (this.breachInfo.breachDurationHours <= 4) {
        this.breachInfo.breachSeverity = 'Minor';
    } else if (this.breachInfo.breachDurationHours <= 24) {
        this.breachInfo.breachSeverity = 'Moderate';
    } else if (this.breachInfo.breachDurationHours <= 72) {
        this.breachInfo.breachSeverity = 'Major';
    } else {
        this.breachInfo.breachSeverity = 'Critical';
    }
    
    // Update status
    this.updateStatus('Breached', null, 'Automatic breach detection');
    
    // Send breach alerts
    this.sendBreachAlert();
};

slaTrackingSchema.methods.pause = function(pausedBy, reason, notes = '') {
    if (this.timerInfo.isPaused) {
        throw new Error('SLA is already paused');
    }
    
    const now = new Date();
    this.timerInfo.isPaused = true;
    
    // Add to pause history
    this.timerInfo.pauseHistory.push({
        pausedBy,
        pausedAt: now,
        pauseReason: reason,
        pauseNotes: notes
    });
    
    this.updateStatus('Paused', pausedBy, reason, notes);
};

slaTrackingSchema.methods.resume = function(resumedBy, notes = '') {
    if (!this.timerInfo.isPaused) {
        throw new Error('SLA is not currently paused');
    }
    
    const now = new Date();
    this.timerInfo.isPaused = false;
    
    // Update the last pause entry
    const lastPause = this.timerInfo.pauseHistory[this.timerInfo.pauseHistory.length - 1];
    lastPause.resumedBy = resumedBy;
    lastPause.resumedAt = now;
    lastPause.resumeNotes = notes;
    
    // Calculate pause duration
    const pauseDurationMs = now.getTime() - lastPause.pausedAt.getTime();
    lastPause.pauseDurationHours = pauseDurationMs / (1000 * 60 * 60);
    
    // Update total paused time
    this.timerInfo.totalPausedHours += lastPause.pauseDurationHours;
    
    // Extend due date by pause duration
    this.timerInfo.dueDateTime = new Date(
        this.timerInfo.dueDateTime.getTime() + pauseDurationMs
    );
    
    this.updateStatus('Active', resumedBy, 'Resumed from pause', notes);
};

slaTrackingSchema.methods.complete = function(completedBy, notes = '') {
    const now = new Date();
    
    this.timerInfo.actualCompletionDateTime = now;
    this.timerInfo.endDateTime = now;
    
    // Calculate total elapsed time
    const totalElapsedMs = now.getTime() - this.timerInfo.startDateTime.getTime();
    this.timerInfo.totalElapsedHours = (totalElapsedMs / (1000 * 60 * 60)) - this.timerInfo.totalPausedHours;
    
    // Resolution info
    this.resolutionInfo.isResolved = true;
    this.resolutionInfo.resolutionDateTime = now;
    this.resolutionInfo.resolvedBy = completedBy;
    this.resolutionInfo.resolutionNotes = notes;
    
    // Determine resolution method and performance
    if (now <= this.timerInfo.dueDateTime) {
        this.resolutionInfo.resolutionMethod = 'Completed On Time';
        this.resolutionInfo.performanceRating = 'Excellent';
        this.resolutionInfo.finalOutcome = 'Success';
        this.resolutionInfo.meetsExpectation = true;
    } else {
        this.resolutionInfo.resolutionMethod = 'Completed Late';
        this.resolutionInfo.performanceRating = 'Poor';
        this.resolutionInfo.finalOutcome = 'Partial Success';
        this.resolutionInfo.meetsExpectation = false;
    }
    
    this.updateStatus('Completed', completedBy, 'SLA completed', notes);
};

slaTrackingSchema.methods.escalate = function(escalatedBy, escalatedTo, level, reason, notes = '') {
    this.escalationInfo.isEscalated = true;
    this.escalationInfo.escalationLevel = level;
    this.escalationInfo.escalatedTo = escalatedTo;
    this.escalationInfo.escalatedBy = escalatedBy;
    this.escalationInfo.escalationDateTime = new Date();
    this.escalationInfo.escalationReason = reason;
    this.escalationInfo.escalationNotes = notes;
    
    // Add to escalation history
    this.escalationInfo.escalationHistory.push({
        level,
        escalatedTo,
        escalatedBy,
        escalatedAt: new Date(),
        reason,
        notes
    });
    
    this.updateStatus('Escalated', escalatedBy, reason, notes);
};

slaTrackingSchema.methods.sendBreachAlert = function() {
    // Mark breach alert as sent
    this.notificationInfo.breachAlertSent = true;
    this.notificationInfo.breachAlertDateTime = new Date();
    
    // In a real implementation, this would trigger actual notifications
    // via email, SMS, Slack, etc. based on notification recipients
    console.log(`SLA Breach Alert: ${this.slaId} - Claim ${this.claimRef}`);
};

slaTrackingSchema.methods.checkAndSendAlerts = function() {
    const timeRemainingPercent = (this.timerInfo.timeRemaining / this.slaConfig.targetHours) * 100;
    
    // Send warning alert
    if (timeRemainingPercent <= this.statusInfo.warningThresholdPercent && 
        !this.notificationInfo.warningAlertSent) {
        this.notificationInfo.warningAlertSent = true;
        this.notificationInfo.warningAlertDateTime = new Date();
        this.updateStatus('At Risk', null, 'Automatic warning threshold reached');
    }
    
    // Send critical alert
    if (timeRemainingPercent <= this.statusInfo.criticalThresholdPercent && 
        !this.notificationInfo.criticalAlertSent) {
        this.notificationInfo.criticalAlertSent = true;
        this.notificationInfo.criticalAlertDateTime = new Date();
    }
};

// ** PRE-SAVE MIDDLEWARE **
slaTrackingSchema.pre('save', function(next) {
    // Calculate time remaining
    this.calculateTimeRemaining();
    
    // Check and send alerts if needed
    if (this.statusInfo.currentStatus === 'Active' && !this.timerInfo.isPaused) {
        this.checkAndSendAlerts();
    }
    
    // Auto-breach if overdue
    if (this.timerInfo.timeRemaining < 0 && 
        this.statusInfo.currentStatus === 'Active' && 
        !this.breachInfo.isBreached) {
        this.handleBreach('Automatic breach detection');
    }
    
    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }
    
    next();
});

export const SLATracking = mongoose.model('SLATracking', slaTrackingSchema, 'slatracking');