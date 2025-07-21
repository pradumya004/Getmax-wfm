// backend/src/models/system/notifications.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import plugin from '../../plugins/scopedIdPlugin.js';

const notificationsSchema = new mongoose.Schema({
    notificationId: {
        type: String,
        unique: true,
        // default: () => `NOTIF-${uuidv4().toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // MAIN RELATIONSHIPS
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    // NOTIFICATION CATEGORIZATION
    notificationInfo: {
        notificationType: {
            type: String,
            enum: [
                // System Notifications
                'System Alert', 'System Error', 'System Maintenance', 'System Update',
                // SLA & Performance
                'SLA Breach', 'SLA Warning', 'SLA Critical', 'Performance Alert',
                // Workflow & Tasks
                'Task Assignment', 'Task Completion', 'Task Escalation', 'Status Change',
                // Quality & Audit
                'QA Review', 'QA Failed', 'QA Passed', 'Rebuttal Submitted',
                // Employee & Management
                'Employee Alert', 'Management Alert', 'Team Update', 'Training Required',
                // Client Communications
                'Client Report', 'Client Escalation', 'Client Update', 'Client Issue',
                // Financial & Billing
                'Payment Alert', 'Invoice Generated', 'Revenue Report', 'Financial Warning',
                // Integration & API
                'API Error', 'Sync Failed', 'Integration Alert', 'Webhook Failed',
                // Compliance & Audit
                'Compliance Alert', 'Audit Required', 'Security Alert', 'Policy Update',
                // Business Intelligence
                'Trend Alert', 'Anomaly Detected', 'Target Missed', 'Goal Achieved',
                // Announcements & General
                'Announcement', 'News Update', 'Holiday Notice', 'General Info',

                // 🆕 RCM-Specific Notification Types
                // Claims Processing Notifications
                'Claim Received', 'Claim Processing Started', 'Claim Submitted', 'Claim Accepted',
                'Claim Rejected', 'Claim On Hold', 'Claim Cancelled', 'Claim Resubmitted',
                'Clean Claim Alert', 'Dirty Claim Alert', 'Claim Batch Ready', 'Claim Batch Submitted',
                'Claim Status Update', 'Claim Assignment', 'Claim Reassignment', 'Claim Deadline',

                // EDI Processing Notifications
                'EDI File Received', 'EDI File Processed', 'EDI File Error', 'EDI File Rejected',
                'EDI Batch Started', 'EDI Batch Completed', 'EDI Batch Failed', 'EDI Transmission Error',
                'ERA Received', 'ERA Processed', 'ERA Error', '835 Processing Complete',
                '837 Submitted', '837 Acknowledged', '837 Rejected', 'EDI Validation Failed',

                // Clearinghouse Notifications
                'CH Connection Error', 'CH Response Received', 'CH Status Update', 'CH Maintenance',
                'CH Configuration Changed', 'CH Credentials Expired', 'CH API Limit Reached',
                'CH File Upload Success', 'CH File Upload Failed', 'CH Acknowledgment Received',

                // QA & Review Notifications
                'QA Review Required', 'QA Review Assigned', 'QA Review Completed', 'QA Review Escalated',
                'QA Score Below Threshold', 'QA Calibration Required', 'QA Rebuttal Required',
                'QA Manager Review', 'QA Training Required', 'QA Certification Due',
                'QA Audit Started', 'QA Audit Completed', 'QA Improvement Plan',

                // Denial Management Notifications
                'Denial Received', 'Denial Analysis Required', 'Denial Appeal Needed', 'Denial Resolved',
                'Denial Pattern Alert', 'Denial Rate High', 'Denial Deadline Approaching',
                'Appeal Submitted', 'Appeal Response Received', 'Appeal Won', 'Appeal Lost',
                'Secondary Denial', 'Denial Trend Alert', 'Denial Training Required',

                // Prior Authorization Notifications
                'Auth Required', 'Auth Requested', 'Auth Approved', 'Auth Denied', 'Auth Expired',
                'Auth Pending', 'Auth Extension Needed', 'Auth Documents Required',
                'Auth Follow-up Required', 'Auth Retroactive Needed',

                // Eligibility & Verification Notifications
                'Eligibility Verified', 'Eligibility Failed', 'Eligibility Expired', 'Eligibility Pending',
                'Insurance Verification Required', 'Coverage Verification Failed', 'Benefits Updated',
                'Copay Information Updated', 'Deductible Information Updated',

                // Payment Processing Notifications
                'Payment Received', 'Payment Posted', 'Payment Denied', 'Payment Partial',
                'Payment Reversal', 'Payment Adjustment', 'Payment Reconciliation',
                'Check Received', 'EFT Received', 'Overpayment Detected', 'Underpayment Detected',
                'Payment Posting Error', 'Zero Payment', 'Payment Variance',

                // Collections & AR Notifications
                'Account Past Due', 'Collection Letter Sent', 'Collection Call Required',
                'Patient Statement Sent', 'Collection Agency Assignment', 'Payment Plan Setup',
                'Account Write-off', 'Account Transferred', 'Collection Follow-up',
                'AR Aging Alert', 'Bad Debt Alert', 'Collection Success',

                // Patient Communication Notifications
                'Patient Portal Message', 'Patient Appointment Reminder', 'Patient Payment Due',
                'Patient Registration Incomplete', 'Patient Information Updated',
                'Patient Complaint Received', 'Patient Satisfaction Survey',
                'Patient Follow-up Required', 'Patient No-show Alert',

                // Financial & Revenue Notifications
                'Revenue Target Met', 'Revenue Target Missed', 'Cash Flow Alert',
                'Month End Processing', 'Financial Report Ready', 'Budget Variance',
                'Contract Renewal Due', 'Rate Change Notification', 'Payer Contract Update',

                // Workflow & Process Notifications
                'Workflow Started', 'Workflow Completed', 'Workflow Stalled', 'Workflow Error',
                'Stage Transition', 'Approval Required', 'Document Required', 'Information Required',
                'Process Timeout', 'Manual Intervention Required', 'Workflow Optimized',

                // Performance & Gamification Notifications
                'Target Achieved', 'Target Missed', 'Streak Broken', 'Streak Milestone',
                'Achievement Unlocked', 'Badge Earned', 'Level Up', 'Leaderboard Update',
                'Competition Started', 'Competition Ended', 'Performance Review Due',
                'Recognition Earned', 'Bonus Earned', 'Certification Achieved',

                // SLA & Compliance Notifications
                'SLA Violation', 'SLA Warning', 'SLA Escalation', 'SLA Recovery',
                'Compliance Audit Required', 'HIPAA Violation', 'Audit Trail Alert',
                'Policy Violation', 'Training Compliance Due', 'Certification Expired',

                // Integration & System Notifications
                'EHR Sync Error', 'PM System Error', 'Data Sync Failed', 'API Rate Limit',
                'External System Down', 'Database Backup Complete', 'System Performance Alert',
                'Security Breach Alert', 'Login Failure Alert', 'Session Timeout',

                // Management & Reporting Notifications
                'Daily Report Ready', 'Weekly Summary', 'Monthly Dashboard Update',
                'KPI Alert', 'Executive Summary', 'Department Performance Report',
                'Client Scorecard', 'Employee Performance Alert', 'Trend Analysis Ready',

                // Emergency & Critical Notifications
                'Emergency Escalation', 'Critical System Failure', 'Data Loss Alert',
                'Security Incident', 'Compliance Emergency', 'Revenue Critical Alert',
                'Patient Safety Alert', 'Regulatory Alert', 'Disaster Recovery',

                // Automation & Job Notifications
                'Scheduled Job Started', 'Scheduled Job Completed', 'Scheduled Job Failed',
                'Batch Process Started', 'Batch Process Completed', 'Data Migration Complete',
                'Report Generation Started', 'Report Generation Complete', 'Backup Complete'
            ],
            required: [true, 'Notification type is required'],
            index: true
        },
        notificationCategory: {
            type: String,
            enum: [
                'Critical', 'Warning', 'Info', 'Success', 'Error',
                'Reminder', 'Update', 'Alert', 'Report', 'Announcement'
            ],
            required: [true, 'Notification category is required'],
            index: true
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical', 'Emergency'],
            required: [true, 'Priority is required'],
            default: 'Normal',
            index: true
        },
        severity: {
            type: String,
            enum: ['Info', 'Warning', 'Error', 'Critical', 'Fatal'],
            default: 'Info'
        },

        // Source tracking
        sourceModule: {
            type: String,
            enum: [
                'SLA_Tracking', 'ClaimTasks', 'QA_Audit', 'FloatingPool',
                'Employee', 'Client', 'SOW', 'Payer', 'Patient', 'Notes',
                'Company', 'Role', 'Department', 'Performance', 'System',
                'API', 'Scheduler', 'Reports', 'Dashboard', 'Integration',
                // 🆕 RCM-Specific Source Modules
                'Claims_Processing', 'EDI_Engine', 'Clearinghouse', 'QA_System',
                'Denial_Management', 'Prior_Auth', 'Eligibility', 'Payment_Processing',
                'Collections', 'Patient_Portal', 'Financial_System', 'Workflow_Engine',
                'Gamification', 'Compliance', 'Automation', 'Analytics'
            ],
            required: [true, 'Source module is required'],
            index: true
        },
        sourceRecordId: {
            type: mongoose.Schema.Types.ObjectId,
            index: true // ID of the record that triggered this notification
        },
        sourceAction: {
            type: String,
            trim: true // Action that triggered notification (e.g., 'SLA_BREACH', 'TASK_ASSIGNED')
        },

        // Related entities for context
        relatedEntities: [{
            entityType: {
                type: String,
                enum: [
                    'Claim', 'Employee', 'Client', 'SOW', 'Patient', 'Payer', 'QA', 'SLA', 'Note', 'Other',
                    // 🆕 RCM-Specific Entity Types
                    'ClaimBatch', 'EDIFile', 'ERA', 'Denial', 'Authorization', 'Payment',
                    'Collection', 'Eligibility', 'Workflow', 'Achievement', 'Performance'
                ],
                required: true
            },
            entityId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            entityName: String, // Display name for UI
            relationshipType: {
                type: String,
                enum: ['Primary', 'Secondary', 'Related', 'Reference']
            }
        }],

        // 🆕 RCM-Specific Context Information
        rcmContext: {
            claimId: String,
            patientId: String,
            payerId: String,
            batchId: String,
            workflowStage: String,
            slaType: String,
            qaCategory: String,
            denialReason: String,
            authorizationNumber: String,
            checkNumber: String,
            amount: Number,
            serviceDate: Date,
            processingDate: Date,
            dueDate: Date
        }
    },

    // NOTIFICATION CONTENT
    content: {
        title: {
            type: String,
            required: [true, 'Notification title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
            index: 'text'
        },
        message: {
            type: String,
            required: [true, 'Notification message is required'],
            trim: true,
            maxlength: [1000, 'Message cannot exceed 1000 characters']
        },
        actionUrl: {
            type: String,
            trim: true // URL to navigate when notification is clicked
        },
        actionButton: {
            text: String,
            url: String,
            action: String // Frontend action to trigger
        },

        // Rich content support
        htmlContent: {
            type: String,
            trim: true
        },
        attachments: [{
            fileName: String,
            fileType: String,
            fileUrl: String,
            fileSize: Number
        }],

        // Template information
        templateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NotificationTemplate'
        },
        templateVariables: {
            type: Map,
            of: String // Variables used to populate template
        }
    },

    // RECIPIENTS & TARGETING
    recipients: {
        // Primary recipient
        primaryRecipient: {
            recipientType: {
                type: String,
                enum: ['Employee', 'Client Contact', 'Manager', 'Admin', 'System', 'External'],
                required: true
            },
            recipientRef: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'recipients.primaryRecipient.recipientType'
            },
            recipientEmail: String,
            recipientName: String
        },

        // Additional recipients
        additionalRecipients: [{
            recipientType: {
                type: String,
                enum: ['Employee', 'Client Contact', 'Manager', 'Admin', 'System', 'External'],
                required: true
            },
            recipientRef: {
                type: mongoose.Schema.Types.ObjectId
            },
            recipientEmail: String,
            recipientName: String,
            notificationRole: {
                type: String,
                enum: ['To', 'CC', 'BCC', 'Escalation'],
                default: 'To'
            }
        }],

        // Group targeting
        targetGroups: [{
            groupType: {
                type: String,
                enum: ['Department', 'Role', 'SOW Team', 'Client Team', 'All Users', 'Custom Group'],
                required: true
            },
            groupRef: {
                type: mongoose.Schema.Types.ObjectId
            },
            groupName: String,
            memberCount: Number
        }]
    },

    // DELIVERY CONFIGURATION
    delivery: {
        deliveryChannels: [{
            channel: {
                type: String,
                enum: ['In-App', 'Email', 'SMS', 'Push', 'Webhook', 'Slack', 'Teams'],
                required: true
            },
            enabled: {
                type: Boolean,
                default: true
            },
            priority: {
                type: Number,
                min: 1,
                max: 10,
                default: 5
            },
            retryCount: {
                type: Number,
                default: 0
            },
            lastAttempt: Date,
            deliveryStatus: {
                type: String,
                enum: ['Pending', 'Sent', 'Delivered', 'Failed', 'Bounced'],
                default: 'Pending'
            },
            errorMessage: String
        }],

        scheduledFor: {
            type: Date,
            default: Date.now
        },
        deliveredAt: Date,
        readAt: Date,

        // Delivery preferences
        respectUserPreferences: {
            type: Boolean,
            default: true
        },
        bypassQuietHours: {
            type: Boolean,
            default: false
        }
    },

    // ** STATUS & LIFECYCLE **
    status: {
        notificationStatus: {
            type: String,
            enum: [
                'Draft', 'Scheduled', 'Sending', 'Delivered', 'Read',
                'Failed', 'Cancelled', 'Expired', 'Archived'
            ],
            default: 'Scheduled'
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isVisible: {
            type: Boolean,
            default: true,
            index: true
        },
        isUrgent: {
            type: Boolean,
            default: false,
            index: true
        },
        expiresAt: Date,

        // Processing information
        processingStarted: Date,
        processingCompleted: Date,
        processingErrors: [String]
    },

    // ** ESCALATION MANAGEMENT **
    escalation: {
        isEscalationEnabled: {
            type: Boolean,
            default: false
        },
        escalationTime: {
            type: Number, // Minutes after creation
            default: 60
        },
        escalationLevels: [{
            level: Number,
            recipientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            escalationTime: Number, // Minutes from previous level
            isTriggered: {
                type: Boolean,
                default: false
            },
            triggeredAt: Date
        }],
        isEscalated: {
            type: Boolean,
            default: false
        },
        escalatedAt: Date,
        escalatedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        escalationReason: String,
        lastEscalationDate: Date
    },

    // ** USER INTERACTION TRACKING **
    interaction: {
        // Read tracking
        readStatus: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            readAt: {
                type: Date,
                default: Date.now
            },
            device: String,
            ipAddress: String
        }],

        // Action tracking
        actionsTaken: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            action: {
                type: String,
                enum: ['Read', 'Clicked', 'Dismissed', 'Acted', 'Forwarded', 'Replied']
            },
            actionData: {
                type: Map,
                of: String
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],

        // Feedback and responses
        userResponses: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            responseType: {
                type: String,
                enum: ['Acknowledgment', 'Action Taken', 'Need Help', 'Escalate', 'Dismiss']
            },
            responseText: String,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }]
    },

    // ** AUDIT TRAIL **
    auditTrail: {
        events: [{
            eventType: {
                type: String,
                enum: [
                    'Created', 'Scheduled', 'Sent', 'Delivered', 'Read', 'Clicked',
                    'Dismissed', 'Escalated', 'Archived', 'Failed', 'Retried', 'Cancelled'
                ],
                required: true
            },
            performedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            performedAt: {
                type: Date,
                default: Date.now
            },
            details: String,
            ipAddress: String,
            userAgent: String,
            systemGenerated: {
                type: Boolean,
                default: false
            }
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
notificationsSchema.index({ companyRef: 1, 'status.notificationStatus': 1 });
notificationsSchema.index({ 'recipients.primaryRecipient.recipientRef': 1, 'status.isActive': 1 });
notificationsSchema.index({ 'notificationInfo.notificationType': 1, createdAt: -1 });
notificationsSchema.index({ 'notificationInfo.priority': 1, 'delivery.scheduledFor': 1 });
notificationsSchema.index({ 'escalation.isEscalated': 1, 'escalation.lastEscalationDate': 1 });

// 🆕 RCM-specific indexes
notificationsSchema.index({ 'notificationInfo.rcmContext.claimId': 1, createdAt: -1 });
notificationsSchema.index({ 'notificationInfo.rcmContext.patientId': 1, createdAt: -1 });
notificationsSchema.index({ 'notificationInfo.rcmContext.batchId': 1, createdAt: -1 });
notificationsSchema.index({ 'notificationInfo.sourceModule': 1, 'notificationInfo.notificationType': 1 });


// Compound indexes
notificationsSchema.index({
    companyRef: 1,
    'notificationInfo.sourceModule': 1,
    'notificationInfo.notificationType': 1,
    createdAt: -1
});

notificationsSchema.index({
    'recipients.primaryRecipient.recipientRef': 1,
    'status.isVisible': 1,
    'status.isActive': 1,
    createdAt: -1
});

// Text index for search
notificationsSchema.index({
    'content.title': 'text',
    'content.message': 'text',
});

// ** VIRTUAL FIELDS **
notificationsSchema.virtual('isUnread').get(function () {
    // Determine if notification is unread for a specific user
    // This would typically be calculated based on current user context
    return this.interaction.readStatus.length === 0;
});

notificationsSchema.virtual('isOverdue').get(function () {
    if (!this.delivery.scheduledFor) return false;
    return new Date() > this.delivery.scheduledFor && this.status.notificationStatus === 'Scheduled';
});

notificationsSchema.virtual('urgencyScore').get(function () {
    let score = 0;

    // Priority scoring
    switch (this.notificationInfo.priority) {
        case 'Emergency': score += 100; break;
        case 'Critical': score += 75; break;
        case 'High': score += 50; break;
        case 'Normal': score += 25; break;
        case 'Low': score += 10; break;
    }

    // Severity scoring
    switch (this.notificationInfo.severity) {
        case 'Fatal': score += 50; break;
        case 'Critical': score += 40; break;
        case 'Error': score += 30; break;
        case 'Warning': score += 20; break;
        case 'Info': score += 10; break;
    }

    // Time sensitivity
    if (this.escalation.isEscalationEnabled && this.escalation.isEscalated) {
        score += 25;
    }

    return score;
});

// ** STATIC METHODS **
notificationsSchema.statics.findUnreadByUser = function (userId, limit = 50) {
    return this.find({
        'recipients.primaryRecipient.recipientRef': userId,
        'status.isActive': true,
        'status.isVisible': true,
        'interaction.readStatus.userId': { $ne: userId }
    })
        .sort({ 'notificationInfo.priority': -1, createdAt: -1 })
        .limit(limit)
        .populate('notificationInfo.relatedEntities.entityId');
};

notificationsSchema.statics.findByType = function (companyRef, notificationType, fromDate = null, toDate = null) {
    const query = {
        companyRef,
        'notificationInfo.notificationType': notificationType,
        'status.isActive': true
    };

    if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) query.createdAt.$gte = new Date(fromDate);
        if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    return this.find(query)
        .sort({ createdAt: -1 })
        .populate('recipients.primaryRecipient.recipientRef', 'personalInfo.firstName personalInfo.lastName');
};

// 🆕 RCM-Specific Static Methods
notificationsSchema.statics.findByClaimId = function (claimId, limit = 20) {
    return this.find({
        'notificationInfo.rcmContext.claimId': claimId,
        'status.isActive': true
    })
        .sort({ createdAt: -1 })
        .limit(limit);
};

notificationsSchema.statics.findRcmAlerts = function (companyRef, alertTypes = []) {
    const rcmAlertTypes = alertTypes.length > 0 ? alertTypes : [
        'SLA Violation', 'QA Score Below Threshold', 'Denial Rate High',
        'Payment Posting Error', 'EDI File Error', 'Claim Deadline'
    ];

    return this.find({
        companyRef,
        'notificationInfo.notificationType': { $in: rcmAlertTypes },
        'status.isActive': true,
        'status.notificationStatus': { $in: ['Delivered', 'Read'] }
    })
        .sort({ 'notificationInfo.priority': -1, createdAt: -1 });
};

notificationsSchema.statics.findPendingDelivery = function (companyRef) {
    return this.find({
        companyRef,
        'status.notificationStatus': { $in: ['Scheduled', 'Sending'] },
        'delivery.scheduledFor': { $lte: new Date() },
        'status.isActive': true
    })
        .sort({ 'notificationInfo.priority': -1, 'delivery.scheduledFor': 1 });
};

notificationsSchema.statics.findEscalationRequired = function (companyRef) {
    const now = new Date();

    return this.find({
        companyRef,
        'escalation.isEscalationEnabled': true,
        'escalation.isEscalated': false,
        'status.notificationStatus': 'Delivered',
        'status.isActive': true,
        $expr: {
            $lt: [
                { $add: ['$createdAt', { $multiply: ['$escalation.escalationTime', 60000] }] },
                now
            ]
        }
    })
        .sort({ createdAt: 1 });
};

// ** INSTANCE METHODS **
notificationsSchema.methods.markAsRead = function (userId) {
    const existingRead = this.interaction.readStatus.find(
        r => r.userId.toString() === userId.toString()
    );

    if (!existingRead) {
        this.interaction.readStatus.push({
            userId,
            readAt: new Date()
        });

        if (this.status.notificationStatus === 'Delivered') {
            this.status.notificationStatus = 'Read';
        }
    }

    return this.save();
};

notificationsSchema.methods.escalate = function (escalatedTo, reason) {
    this.escalation.isEscalated = true;
    this.escalation.escalatedAt = new Date();
    this.escalation.escalatedTo = escalatedTo;
    this.escalation.escalationReason = reason;
    this.escalation.lastEscalationDate = new Date();

    // Add audit event
    this.auditTrail.events.push({
        eventType: 'Escalated',
        performedBy: escalatedTo,
        details: reason,
        systemGenerated: false
    });

    return this.save();
};

// 🆕 RCM-Specific Instance Methods
notificationsSchema.methods.updateRcmContext = function (contextData) {
    this.notificationInfo.rcmContext = {
        ...this.notificationInfo.rcmContext,
        ...contextData
    };
    return this.save();
};

notificationsSchema.methods.addRcmRelatedEntity = function (entityType, entityId, entityName, relationshipType = 'Related') {
    this.notificationInfo.relatedEntities.push({
        entityType,
        entityId,
        entityName,
        relationshipType
    });
    return this.save();
};

// PLUGINS
notificationsSchema.plugin(scopedIdPlugin, {
    idField: 'notificationId',
    prefix: 'NOTF',
    companyRefPath: 'companyRef'
});

export const Notification = mongoose.model('Notification', notificationsSchema, 'notifications');