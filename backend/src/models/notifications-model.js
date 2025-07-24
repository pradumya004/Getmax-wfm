// backend/src/models/notifications.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const notificationsSchema = new mongoose.Schema({
    notificationId: {
        type: String,
        unique: true,
        default: () => `NOTIF-${uuidv4().substring(0, 10).toUpperCase()}`,
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

    // ** NOTIFICATION CATEGORIZATION **
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
                'Announcement', 'News Update', 'Holiday Notice', 'General Info'
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
                'API', 'Scheduler', 'Reports', 'Dashboard', 'Integration'
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
                enum: ['Claim', 'Employee', 'Client', 'SOW', 'Patient', 'Payer', 'QA', 'SLA', 'Note', 'Other'],
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
        }]
    },

    // ** NOTIFICATION CONTENT **
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
        shortMessage: {
            type: String,
            trim: true,
            maxlength: [100, 'Short message cannot exceed 100 characters']
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

    // ** RECIPIENTS & TARGETING **
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
            filterCriteria: {
                type: Map,
                of: String // Additional filtering within group
            }
        }],
        
        // Broadcasting options
        isBroadcast: {
            type: Boolean,
            default: false
        },
        broadcastScope: {
            type: String,
            enum: ['Company Wide', 'Department', 'Role', 'SOW', 'Client', 'Custom'],
            default: 'Company Wide'
        }
    },

    // ** DELIVERY CHANNELS & METHODS **
    delivery: {
        // Channel configuration
        deliveryChannels: [{
            channel: {
                type: String,
                enum: [
                    'In-App', 'Email', 'SMS', 'Push', 'Slack', 'Teams', 
                    'Webhook', 'WhatsApp', 'Phone Call', 'Portal'
                ],
                required: true
            },
            isEnabled: {
                type: Boolean,
                default: true
            },
            priority: {
                type: Number,
                min: [1, 'Priority must be at least 1'],
                max: [10, 'Priority cannot exceed 10'],
                default: 5
            },
            deliveryStatus: {
                type: String,
                enum: ['Pending', 'Sent', 'Delivered', 'Failed', 'Bounced', 'Opened', 'Clicked'],
                default: 'Pending',
                index: true
            },
            attemptCount: {
                type: Number,
                default: 0,
                min: [0, 'Attempt count cannot be negative']
            },
            lastAttempt: Date,
            deliveredAt: Date,
            failureReason: String,
            externalMessageId: String, // ID from external service (email provider, SMS, etc.)
            
            // Channel-specific settings
            channelSettings: {
                type: Map,
                of: mongoose.Schema.Types.Mixed // Flexible settings per channel
            }
        }],
        
        // Scheduling
        scheduledFor: {
            type: Date,
            index: true
        },
        deliverImmediately: {
            type: Boolean,
            default: true
        },
        retryPolicy: {
            maxRetries: {
                type: Number,
                default: 3,
                min: [0, 'Max retries cannot be negative']
            },
            retryInterval: {
                type: Number, // in minutes
                default: 5
            },
            backoffMultiplier: {
                type: Number,
                default: 2,
                min: [1, 'Backoff multiplier must be at least 1']
            }
        },
        
        // Delivery tracking
        totalRecipients: {
            type: Number,
            default: 0
        },
        successfulDeliveries: {
            type: Number,
            default: 0
        },
        failedDeliveries: {
            type: Number,
            default: 0
        },
        deliveryRate: {
            type: Number,
            min: [0, 'Delivery rate cannot be negative'],
            max: [100, 'Delivery rate cannot exceed 100%'],
            default: 0
        }
    },

    // ** USER INTERACTION & ENGAGEMENT **
    interaction: {
        // Read status per user
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
            readMethod: {
                type: String,
                enum: ['In-App', 'Email', 'SMS', 'Push', 'Other'],
                default: 'In-App'
            }
        }],
        
        // Acknowledgment tracking
        requiresAcknowledgment: {
            type: Boolean,
            default: false
        },
        acknowledgments: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            acknowledgedAt: {
                type: Date,
                default: Date.now
            },
            acknowledgmentMethod: String,
            notes: String
        }],
        
        // Action tracking
        actionsTaken: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            action: {
                type: String,
                enum: ['Clicked', 'Dismissed', 'Archived', 'Escalated', 'Responded', 'Custom'],
                required: true
            },
            actionData: {
                type: Map,
                of: String
            },
            actionAt: {
                type: Date,
                default: Date.now
            }
        }],
        
        // Engagement metrics
        clickThroughRate: {
            type: Number,
            min: [0, 'Click through rate cannot be negative'],
            max: [100, 'Click through rate cannot exceed 100%'],
            default: 0
        },
        responseRate: {
            type: Number,
            min: [0, 'Response rate cannot be negative'],
            max: [100, 'Response rate cannot exceed 100%'],
            default: 0
        }
    },

    // ** ESCALATION & FOLLOW-UP **
    escalation: {
        isEscalationEnabled: {
            type: Boolean,
            default: false
        },
        escalationLevel: {
            type: Number,
            min: [1, 'Escalation level must be at least 1'],
            max: [5, 'Escalation level cannot exceed 5'],
            default: 1
        },
        escalationTrigger: {
            type: String,
            enum: ['Time Based', 'No Response', 'No Acknowledgment', 'Manual', 'System Event'],
            default: 'Time Based'
        },
        escalationTime: {
            type: Number, // in minutes
            default: 60
        },
        escalationPath: [{
            level: {
                type: Number,
                required: true
            },
            escalateTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            escalationMethod: {
                type: String,
                enum: ['Same Channels', 'Email Only', 'Phone + Email', 'All Channels'],
                default: 'Email Only'
            },
            waitTime: {
                type: Number, // minutes to wait before next escalation
                default: 30
            }
        }],
        
        currentEscalationLevel: {
            type: Number,
            default: 0
        },
        lastEscalationDate: Date,
        isEscalated: {
            type: Boolean,
            default: false,
            index: true
        }
    },

    // ** BUSINESS RULES & AUTOMATION **
    businessRules: {
        autoArchiveAfterDays: {
            type: Number,
            default: 30,
            min: [1, 'Auto archive must be at least 1 day']
        },
        suppressDuplicates: {
            type: Boolean,
            default: true
        },
        duplicateWindowMinutes: {
            type: Number,
            default: 60 // Don't send same notification within 60 minutes
        },
        
        // User preferences override
        respectUserPreferences: {
            type: Boolean,
            default: true
        },
        allowUserOptOut: {
            type: Boolean,
            default: true
        },
        
        // Quiet hours
        respectQuietHours: {
            type: Boolean,
            default: true
        },
        quietHoursStart: {
            type: String,
            default: '22:00'
        },
        quietHoursEnd: {
            type: String,
            default: '08:00'
        },
        
        // Frequency limits
        maxNotificationsPerHour: {
            type: Number,
            default: 10
        },
        maxNotificationsPerDay: {
            type: Number,
            default: 50
        }
    },

    // ** STATUS & LIFECYCLE **
    status: {
        notificationStatus: {
            type: String,
            enum: [
                'Draft', 'Scheduled', 'Sending', 'Sent', 'Delivered', 
                'Failed', 'Cancelled', 'Archived', 'Expired'
            ],
            required: [true, 'Notification status is required'],
            default: 'Draft',
            index: true
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isVisible: {
            type: Boolean,
            default: true
        },
        expiryDate: {
            type: Date,
            index: true
        },
        archivedDate: Date,
        
        // Lifecycle tracking
        statusHistory: [{
            status: {
                type: String,
                required: true
            },
            changedAt: {
                type: Date,
                default: Date.now
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reason: String,
            systemGenerated: {
                type: Boolean,
                default: false
            }
        }]
    },

    // ** ANALYTICS & REPORTING **
    analytics: {
        impressions: {
            type: Number,
            default: 0
        },
        clicks: {
            type: Number,
            default: 0
        },
        responses: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        
        // Performance metrics
        deliveryTime: {
            type: Number, // milliseconds from creation to delivery
            default: 0
        },
        responseTime: {
            type: Number, // milliseconds from delivery to first response
            default: 0
        },
        
        // Segmentation data
        audienceSegment: String,
        campaignId: String,
        conversionTracking: {
            type: Map,
            of: String
        }
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isSystemGenerated: {
            type: Boolean,
            default: true,
            index: true
        },
        generatedBy: {
            type: String,
            enum: ['System', 'User', 'API', 'Scheduler', 'Webhook', 'Integration'],
            default: 'System'
        },
        batchId: {
            type: String,
            trim: true,
            index: true // For bulk notifications
        },
        
        // Processing info
        processedAt: Date,
        processingDuration: Number, // milliseconds
        
        // Error tracking
        errorCount: {
            type: Number,
            default: 0
        },
        lastError: String,
        lastErrorAt: Date,
        
        // Versioning
        version: {
            type: String,
            default: '1.0'
        },
        
        // External references
        externalReferences: [{
            system: String,
            referenceId: String,
            referenceType: String
        }]
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
        
        // Detailed audit log
        auditLog: [{
            action: {
                type: String,
                enum: [
                    'Created', 'Sent', 'Delivered', 'Read', 'Acknowledged', 
                    'Escalated', 'Archived', 'Failed', 'Retried', 'Cancelled'
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
    'content.shortMessage': 'text'
});

// ** VIRTUAL FIELDS **
notificationsSchema.virtual('isUnread').get(function() {
    // Determine if notification is unread for a specific user
    // This would typically be calculated based on current user context
    return this.interaction.readStatus.length === 0;
});

notificationsSchema.virtual('isOverdue').get(function() {
    if (!this.delivery.scheduledFor) return false;
    return new Date() > this.delivery.scheduledFor && this.status.notificationStatus === 'Scheduled';
});

notificationsSchema.virtual('urgencyScore').get(function() {
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
notificationsSchema.statics.findUnreadByUser = function(userId, limit = 50) {
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

notificationsSchema.statics.findByType = function(companyRef, notificationType, fromDate = null, toDate = null) {
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

notificationsSchema.statics.findPendingDelivery = function(companyRef) {
    return this.find({
        companyRef,
        'status.notificationStatus': { $in: ['Scheduled', 'Sending'] },
        'delivery.scheduledFor': { $lte: new Date() },
        'status.isActive': true
    })
    .sort({ 'notificationInfo.priority': -1, 'delivery.scheduledFor': 1 });
};

notificationsSchema.statics.findEscalationRequired = function(companyRef) {
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

notificationsSchema.statics.getDeliveryStats = function(companyRef, fromDate, toDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: mongoose.Types.ObjectId(companyRef),
                createdAt: {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate)
                }
            }
        },
        {
            $group: {
                _id: '$notificationInfo.notificationType',
                totalSent: { $sum: 1 },
                totalDelivered: {
                    $sum: {
                        $cond: [{ $eq: ['$status.notificationStatus', 'Delivered'] }, 1, 0]
                    }
                },
                totalFailed: {
                    $sum: {
                        $cond: [{ $eq: ['$status.notificationStatus', 'Failed'] }, 1, 0]
                    }
                },
                avgDeliveryTime: { $avg: '$analytics.deliveryTime' },
                avgResponseTime: { $avg: '$analytics.responseTime' }
            }
        },
        {
            $addFields: {
                deliveryRate: {
                    $multiply: [
                        { $divide: ['$totalDelivered', '$totalSent'] },
                        100
                    ]
                }
            }
        }
    ]);
};

// ** INSTANCE METHODS **
notificationsSchema.methods.markAsRead = function(userId, readMethod = 'In-App') {
    const existingRead = this.interaction.readStatus.find(
        read => read.userId.equals(userId)
    );
    
    if (!existingRead) {
        this.interaction.readStatus.push({
            userId,
            readAt: new Date(),
            readMethod
        });
        
        // Update analytics
        this.analytics.impressions += 1;
        
        // Add to audit log
        this.auditInfo.auditLog.push({
            action: 'Read',
            performedBy: userId,
            details: `Read via ${readMethod}`
        });
    }
};

notificationsSchema.methods.acknowledge = function(userId, notes = '', method = 'In-App') {
    const existingAck = this.interaction.acknowledgments.find(
        ack => ack.userId.equals(userId)
    );
    
    if (!existingAck) {
        this.interaction.acknowledgments.push({
            userId,
            acknowledgedAt: new Date(),
            acknowledgmentMethod: method,
            notes
        });
        
        // Add to audit log
        this.auditInfo.auditLog.push({
            action: 'Acknowledged',
            performedBy: userId,
            details: notes || 'Acknowledged by user'
        });
    }
};

notificationsSchema.methods.triggerEscalation = function() {
    if (!this.escalation.isEscalationEnabled) return false;
    
    this.escalation.currentEscalationLevel += 1;
    this.escalation.isEscalated = true;
    this.escalation.lastEscalationDate = new Date();
    
    // Create escalation notification
    const escalationPath = this.escalation.escalationPath.find(
        path => path.level === this.escalation.currentEscalationLevel
    );
    
    if (escalationPath) {
        // Create new notification for escalated recipient
        // This would typically be handled by the notification service
        console.log(`Escalating to level ${this.escalation.currentEscalationLevel}`);
    }
    
    // Add to audit log
    this.auditInfo.auditLog.push({
        action: 'Escalated',
        details: `Escalated to level ${this.escalation.currentEscalationLevel}`,
        systemGenerated: true
    });
    
    return true;
};

notificationsSchema.methods.updateDeliveryStatus = function(channel, status, deliveredAt = null, failureReason = null) {
    const deliveryChannel = this.delivery.deliveryChannels.find(
        ch => ch.channel === channel
    );
    
    if (deliveryChannel) {
        deliveryChannel.deliveryStatus = status;
        deliveryChannel.lastAttempt = new Date();
        
        if (status === 'Delivered' && deliveredAt) {
            deliveryChannel.deliveredAt = deliveredAt;
            this.delivery.successfulDeliveries += 1;
        } else if (status === 'Failed') {
            deliveryChannel.failureReason = failureReason;
            deliveryChannel.attemptCount += 1;
            this.delivery.failedDeliveries += 1;
        }
        
        // Update overall delivery rate
        const totalAttempts = this.delivery.successfulDeliveries + this.delivery.failedDeliveries;
        if (totalAttempts > 0) {
            this.delivery.deliveryRate = (this.delivery.successfulDeliveries / totalAttempts) * 100;
        }
        
        // Update notification status
        const allDelivered = this.delivery.deliveryChannels.every(
            ch => ch.deliveryStatus === 'Delivered' || ch.deliveryStatus === 'Failed'
        );
        
        if (allDelivered) {
            const hasSuccessful = this.delivery.deliveryChannels.some(
                ch => ch.deliveryStatus === 'Delivered'
            );
            this.status.notificationStatus = hasSuccessful ? 'Delivered' : 'Failed';
        }
    }
};

notificationsSchema.methods.archive = function(archivedBy, reason = '') {
    this.status.notificationStatus = 'Archived';
    this.status.archivedDate = new Date();
    this.status.isVisible = false;
    
    // Add to audit log
    this.auditInfo.auditLog.push({
        action: 'Archived',
        performedBy: archivedBy,
        details: reason
    });
};

// ** PRE-SAVE MIDDLEWARE **
notificationsSchema.pre('save', function(next) {
    // Auto-expire old notifications
    if (this.businessRules.autoArchiveAfterDays && !this.status.archivedDate) {
        const autoArchiveDate = new Date();
        autoArchiveDate.setDate(autoArchiveDate.getDate() - this.businessRules.autoArchiveAfterDays);
        
        if (this.createdAt < autoArchiveDate) {
            this.status.notificationStatus = 'Archived';
            this.status.archivedDate = new Date();
            this.status.isVisible = false;
        }
    }
    
    // Set expiry if not set
    if (!this.status.expiryDate && this.businessRules.autoArchiveAfterDays) {
        this.status.expiryDate = new Date();
        this.status.expiryDate.setDate(this.status.expiryDate.getDate() + this.businessRules.autoArchiveAfterDays);
    }
    
    // Set default scheduled time if immediate delivery
    if (this.delivery.deliverImmediately && !this.delivery.scheduledFor) {
        this.delivery.scheduledFor = new Date();
    }
    
    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }
    
    next();
});

export const Notifications = mongoose.model('Notifications', notificationsSchema, 'notifications');