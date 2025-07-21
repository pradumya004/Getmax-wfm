// backend/src/models/system/activityLog.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import plugin from '../../plugins/scopedIdPlugin.js';

const activityLogSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFICATION **
    activityId: {
        type: String,
        unique: true,
        // default: () => `ACT-${uuidv4().toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    // ** ACTIVITY DETAILS **
    activity: {
        actionType: {
            type: String,
            enum: [
                // CRUD Operations
                'CREATE', 'READ', 'UPDATE', 'DELETE', 'RESTORE',
                // Authentication & Authorization
                'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE', 'PERMISSION_CHANGE',
                // Data Access
                'VIEW', 'SEARCH', 'EXPORT', 'DOWNLOAD', 'PRINT',
                // Workflow Actions
                'ASSIGN', 'REASSIGN', 'APPROVE', 'REJECT', 'ESCALATE', 'COMPLETE',
                // System Actions
                'IMPORT', 'SYNC', 'BACKUP', 'RESTORE_BACKUP', 'SYSTEM_CONFIG',
                // RCM Specific Actions
                'CLAIM_SUBMIT', 'CLAIM_STATUS_CHANGE', 'PAYMENT_POST', 'DENIAL_PROCESS',
                'QA_REVIEW', 'SLA_BREACH', 'EDI_TRANSMISSION', 'AUTHORIZATION_REQUEST',
                // Compliance Actions
                'AUDIT_ACCESS', 'POLICY_VIEW', 'TRAINING_COMPLETE', 'INCIDENT_REPORT',
                // Communication Actions
                'EMAIL_SEND', 'NOTIFICATION_SEND', 'COMMENT_ADD', 'MENTION_USER',
                // File Operations
                'FILE_UPLOAD', 'FILE_DELETE', 'FILE_SHARE', 'FILE_ENCRYPT',
                // Administrative Actions
                'USER_CREATE', 'USER_DEACTIVATE', 'ROLE_ASSIGN', 'PERMISSION_GRANT'
            ],
            required: [true, 'Action type is required'],
            index: true
        },
        actionCategory: {
            type: String,
            enum: [
                'Authentication', 'Data_Access', 'Data_Modification', 'System_Administration',
                'Clinical_Data', 'Financial_Data', 'PHI_Access', 'Audit_Security',
                'Workflow_Management', 'Communication', 'Reporting', 'Integration'
            ],
            required: [true, 'Action category is required'],
            index: true
        },
        actionDescription: {
            type: String,
            required: [true, 'Action description is required'],
            trim: true,
            maxlength: [1000, 'Action description cannot exceed 1000 characters']
        },
        actionResult: {
            type: String,
            enum: ['SUCCESS', 'FAILURE', 'PARTIAL', 'WARNING', 'ERROR'],
            required: [true, 'Action result is required'],
            index: true
        },
        actionSeverity: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            default: 'MEDIUM',
            index: true
        }
    },

    // ** ACTOR INFORMATION **
    actor: {
        actorType: {
            type: String,
            enum: ['User', 'System', 'Service', 'Job', 'API', 'Integration'],
            required: [true, 'Actor type is required'],
            index: true
        },
        actorRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee', // When actorType is 'User'
            index: true
        },
        actorName: {
            type: String,
            required: [true, 'Actor name is required'],
            trim: true
        },
        actorRole: {
            type: String,
            trim: true
        },
        actorDepartment: {
            type: String,
            trim: true
        },
        impersonatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee' // If action was performed on behalf of another user
        },
        serviceAccount: {
            type: String,
            trim: true // For system/service actions
        }
    },

    // ** TARGET INFORMATION **
    target: {
        targetType: {
            type: String,
            enum: [
                'Claim', 'Patient', 'Employee', 'Client', 'SOW', 'Payer', 'Company',
                'ClaimBatch', 'EDIFile', 'QAReview', 'Workflow', 'SLA', 'Payment',
                'Denial', 'Authorization', 'Comment', 'Report', 'Dashboard',
                'System', 'Database', 'File', 'Configuration', 'Other'
            ],
            required: [true, 'Target type is required'],
            index: true
        },
        targetRef: {
            type: mongoose.Schema.Types.ObjectId,
            index: true
        },
        targetId: {
            type: String,
            trim: true,
            index: true // Business ID like claim number, patient ID, etc.
        },
        targetName: {
            type: String,
            trim: true // Display name for UI
        },
        parentTarget: {
            parentType: String,
            parentRef: mongoose.Schema.Types.ObjectId,
            parentId: String,
            parentName: String
        }
    },

    // ** PHI & HIPAA COMPLIANCE **
    phiInfo: {
        containsPHI: {
            type: Boolean,
            default: false,
            index: true
        },
        phiTypes: [{
            type: String,
            enum: [
                'Name', 'Address', 'Phone', 'Email', 'SSN', 'DOB', 'MRN',
                'Insurance_ID', 'Account_Number', 'Diagnosis', 'Treatment',
                'Financial_Info', 'Demographic', 'Other_Identifiers'
            ]
        }],
        dataClassification: {
            type: String,
            enum: ['Public', 'Internal', 'Confidential', 'Restricted', 'PHI'],
            default: 'Internal',
            index: true
        },
        accessJustification: {
            type: String,
            enum: [
                'Treatment', 'Payment', 'Healthcare_Operations', 'Legal_Requirement',
                'Patient_Request', 'Quality_Assurance', 'Billing', 'Administration',
                'Emergency', 'Other'
            ],
            index: true
        },
        minimumNecessary: {
            type: Boolean,
            default: true // Confirms minimum necessary standard was followed
        }
    },

    // ** SESSION & CONTEXT **
    sessionInfo: {
        sessionId: {
            type: String,
            trim: true,
            index: true
        },
        ipAddress: {
            type: String,
            required: [true, 'IP address is required'],
            trim: true,
            index: true
        },
        userAgent: {
            type: String,
            trim: true
        },
        deviceType: {
            type: String,
            enum: ['Desktop', 'Mobile', 'Tablet', 'API', 'System'],
            default: 'Desktop'
        },
        browserInfo: {
            browser: String,
            version: String,
            platform: String
        },
        geolocation: {
            country: String,
            region: String,
            city: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            },
            timezone: String
        }
    },

    // ** TECHNICAL DETAILS **
    technical: {
        method: {
            type: String,
            enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'SYSTEM', 'JOB'],
            index: true
        },
        endpoint: {
            type: String,
            trim: true,
            index: true
        },
        requestId: {
            type: String,
            trim: true,
            index: true
        },
        responseCode: {
            type: Number,
            index: true
        },
        responseTime: {
            type: Number, // in milliseconds
            min: [0, 'Response time cannot be negative']
        },
        dataSize: {
            type: Number, // in bytes
            min: [0, 'Data size cannot be negative']
        },
        sqlQueries: [{
            query: String,
            duration: Number,
            recordsAffected: Number
        }],
        errorDetails: {
            errorCode: String,
            errorMessage: String,
            stackTrace: String,
            errorType: {
                type: String,
                enum: ['System', 'Validation', 'Authorization', 'Network', 'Database', 'Business']
            }
        }
    },

    // ** DATA CHANGES **
    dataChanges: {
        hasChanges: {
            type: Boolean,
            default: false,
            index: true
        },
        changeType: {
            type: String,
            enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'BULK_OPERATION'],
            index: true
        },
        fieldsChanged: [String],
        recordsAffected: {
            type: Number,
            default: 0,
            min: [0, 'Records affected cannot be negative']
        },
        beforeState: {
            type: mongoose.Schema.Types.Mixed // Previous values (encrypted if sensitive)
        },
        afterState: {
            type: mongoose.Schema.Types.Mixed // New values (encrypted if sensitive)
        },
        changeReason: {
            type: String,
            trim: true
        },
        approvalRequired: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedAt: Date
    },

    // ** BUSINESS CONTEXT **
    businessContext: {
        workflowStage: {
            type: String,
            trim: true
        },
        businessProcess: {
            type: String,
            enum: [
                'Patient_Registration', 'Eligibility_Verification', 'Prior_Authorization',
                'Claims_Processing', 'Denial_Management', 'Payment_Posting', 'Collections',
                'QA_Review', 'Reporting', 'System_Administration', 'Training',
                'Compliance_Audit', 'Data_Migration', 'Integration_Sync'
            ]
        },
        clientContext: {
            clientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client'
            },
            sowRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SOW'
            }
        },
        financialImpact: {
            amount: Number,
            currency: {
                type: String,
                default: 'USD'
            }
        },
        urgencyLevel: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical', 'Emergency'],
            default: 'Normal'
        }
    },

    // ** COMPLIANCE & AUDIT **
    compliance: {
        regulatoryFramework: [{
            type: String,
            enum: ['HIPAA', 'SOX', 'PCI_DSS', 'GDPR', 'SOC2', 'HITECH', 'State_Law', 'Other']
        }],
        auditTrailRequired: {
            type: Boolean,
            default: true,
            index: true
        },
        retentionPeriod: {
            type: Number, // in years
            default: 7,
            min: [1, 'Retention period must be at least 1 year']
        },
        archiveDate: Date,
        legalHold: {
            isOnHold: {
                type: Boolean,
                default: false,
                index: true
            },
            holdReason: String,
            holdStartDate: Date,
            holdEndDate: Date,
            holdRequestedBy: String
        },
        riskLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Low',
            index: true
        }
    },

    // ** ALERTS & MONITORING **
    monitoring: {
        alertGenerated: {
            type: Boolean,
            default: false,
            index: true
        },
        alertType: {
            type: String,
            enum: [
                'Security_Breach', 'Unauthorized_Access', 'Data_Loss', 'System_Error',
                'Compliance_Violation', 'SLA_Breach', 'Unusual_Activity', 'Performance_Issue'
            ]
        },
        alertSeverity: {
            type: String,
            enum: ['Info', 'Warning', 'Error', 'Critical'],
            default: 'Info'
        },
        notificationsSent: [{
            recipient: String,
            channel: {
                type: String,
                enum: ['Email', 'SMS', 'In-App', 'Slack', 'Teams', 'Webhook']
            },
            sentAt: Date,
            delivered: Boolean
        }],
        followUpRequired: {
            type: Boolean,
            default: false
        },
        followUpBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        followUpDue: Date
    },

    // ** SECURITY CONTEXT **
    security: {
        authenticationMethod: {
            type: String,
            enum: ['Password', 'MFA', 'SSO', 'API_Key', 'Certificate', 'Token'],
            index: true
        },
        authorizationLevel: {
            type: String,
            enum: ['None', 'Basic', 'Elevated', 'Administrative', 'System'],
            default: 'Basic',
            index: true
        },
        securityClearance: {
            type: String,
            enum: ['Public', 'Internal', 'Confidential', 'Secret', 'Top_Secret'],
            default: 'Internal'
        },
        encryptionUsed: {
            type: Boolean,
            default: false
        },
        encryptionMethod: {
            type: String,
            enum: ['AES-256', 'RSA', 'TLS', 'None']
        },
        accessViolation: {
            type: Boolean,
            default: false,
            index: true
        },
        violationType: {
            type: String,
            enum: ['Unauthorized_Access', 'Data_Breach', 'Permission_Escalation', 'Time_Violation']
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE & COMPLIANCE **
activityLogSchema.index({ companyRef: 1, createdAt: -1 });
activityLogSchema.index({ 'actor.actorRef': 1, createdAt: -1 });
activityLogSchema.index({ 'target.targetType': 1, 'target.targetRef': 1, createdAt: -1 });
activityLogSchema.index({ 'activity.actionType': 1, 'activity.actionResult': 1 });
activityLogSchema.index({ 'phiInfo.containsPHI': 1, 'phiInfo.dataClassification': 1 });
activityLogSchema.index({ 'sessionInfo.ipAddress': 1, createdAt: -1 });

// Compliance-specific indexes
activityLogSchema.index({ 'compliance.auditTrailRequired': 1, 'compliance.legalHold.isOnHold': 1 });
activityLogSchema.index({ 'monitoring.alertGenerated': 1, 'monitoring.alertSeverity': 1 });
activityLogSchema.index({ 'security.accessViolation': 1, createdAt: -1 });

// Compound indexes for complex queries
activityLogSchema.index({
    companyRef: 1,
    'activity.actionCategory': 1,
    'phiInfo.containsPHI': 1,
    createdAt: -1
});

activityLogSchema.index({
    'actor.actorRef': 1,
    'target.targetType': 1,
    'activity.actionType': 1,
    createdAt: -1
});

activityLogSchema.index({
    'sessionInfo.ipAddress': 1,
    'security.authenticationMethod': 1,
    'activity.actionResult': 1,
    createdAt: -1
});

// ** VIRTUAL FIELDS **
activityLogSchema.virtual('isHighRisk').get(function () {
    return this.phiInfo.containsPHI ||
        this.compliance.riskLevel === 'Critical' ||
        this.security.accessViolation ||
        this.activity.actionSeverity === 'CRITICAL';
});

activityLogSchema.virtual('requiresReview').get(function () {
    return this.monitoring.alertGenerated ||
        this.monitoring.followUpRequired ||
        this.security.accessViolation ||
        this.compliance.legalHold.isOnHold;
});

activityLogSchema.virtual('ageInDays').get(function () {
    const now = new Date();
    const created = new Date(this.createdAt);
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
});

// ** INSTANCE METHODS **
activityLogSchema.methods.generateAlert = function (alertType, severity, recipients) {
    this.monitoring.alertGenerated = true;
    this.monitoring.alertType = alertType;
    this.monitoring.alertSeverity = severity;

    if (recipients && recipients.length > 0) {
        this.monitoring.notificationsSent = recipients.map(recipient => ({
            recipient: recipient.email || recipient.name,
            channel: recipient.channel || 'Email',
            sentAt: new Date(),
            delivered: false
        }));
    }

    return this.save();
};

activityLogSchema.methods.markForFollowUp = function (assignedTo, dueDate, reason) {
    this.monitoring.followUpRequired = true;
    this.monitoring.followUpBy = assignedTo;
    this.monitoring.followUpDue = dueDate;
    this.dataChanges.changeReason = reason;

    return this.save();
};

activityLogSchema.methods.addLegalHold = function (reason, requestedBy, endDate) {
    this.compliance.legalHold = {
        isOnHold: true,
        holdReason: reason,
        holdStartDate: new Date(),
        holdEndDate: endDate,
        holdRequestedBy: requestedBy
    };

    return this.save();
};

activityLogSchema.methods.flagSecurityViolation = function (violationType) {
    this.security.accessViolation = true;
    this.security.violationType = violationType;
    this.activity.actionSeverity = 'CRITICAL';
    this.compliance.riskLevel = 'Critical';

    // Auto-generate security alert
    this.generateAlert('Security_Breach', 'Critical', []);

    return this.save();
};

// ** STATIC METHODS **
activityLogSchema.statics.findByUser = function (userId, limit = 100) {
    return this.find({
        'actor.actorRef': userId,
        'compliance.auditTrailRequired': true
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('-dataChanges.beforeState -dataChanges.afterState'); // Exclude sensitive data
};

activityLogSchema.statics.findPHIAccess = function (companyRef, dateRange = {}) {
    const query = {
        companyRef,
        'phiInfo.containsPHI': true,
        'compliance.auditTrailRequired': true
    };

    if (dateRange.start || dateRange.end) {
        query.createdAt = {};
        if (dateRange.start) query.createdAt.$gte = new Date(dateRange.start);
        if (dateRange.end) query.createdAt.$lte = new Date(dateRange.end);
    }

    return this.find(query)
        .populate('actor.actorRef', 'personalInfo.firstName personalInfo.lastName')
        .sort({ createdAt: -1 });
};

activityLogSchema.statics.findSecurityEvents = function (companyRef, severity = 'Critical') {
    return this.find({
        companyRef,
        $or: [
            { 'security.accessViolation': true },
            { 'monitoring.alertSeverity': severity },
            { 'activity.actionResult': 'FAILURE' }
        ]
    })
        .sort({ createdAt: -1 })
        .populate('actor.actorRef', 'personalInfo.firstName personalInfo.lastName');
};

activityLogSchema.statics.findByTarget = function (targetType, targetId, limit = 50) {
    return this.find({
        'target.targetType': targetType,
        'target.targetRef': targetId
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('actor.actorRef', 'personalInfo.firstName personalInfo.lastName');
};

activityLogSchema.statics.generateComplianceReport = function (companyRef, framework, dateRange) {
    const query = {
        companyRef,
        'compliance.regulatoryFramework': framework,
        'compliance.auditTrailRequired': true
    };

    if (dateRange.start || dateRange.end) {
        query.createdAt = {};
        if (dateRange.start) query.createdAt.$gte = new Date(dateRange.start);
        if (dateRange.end) query.createdAt.$lte = new Date(dateRange.end);
    }

    return this.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$activity.actionCategory',
                count: { $sum: 1 },
                phiAccessCount: {
                    $sum: { $cond: ['$phiInfo.containsPHI', 1, 0] }
                },
                failureCount: {
                    $sum: { $cond: [{ $eq: ['$activity.actionResult', 'FAILURE'] }, 1, 0] }
                },
                securityViolations: {
                    $sum: { $cond: ['$security.accessViolation', 1, 0] }
                }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

// PLUGINS
activityLogSchema.plugin(scopedIdPlugin, {
    idField: 'activityId',
    prefix: 'ACT',
    companyRefPath: 'companyRef'
});

// ** PRE-SAVE MIDDLEWARE **
activityLogSchema.pre('save', function (next) {
    // Auto-calculate risk level based on activity
    if (this.phiInfo.containsPHI && this.compliance.riskLevel === 'Low') {
        this.compliance.riskLevel = 'Medium';
    }

    if (this.security.accessViolation) {
        this.compliance.riskLevel = 'Critical';
    }

    // Set retention period based on data classification
    if (this.phiInfo.dataClassification === 'PHI' && this.compliance.retentionPeriod < 7) {
        this.compliance.retentionPeriod = 7; // HIPAA minimum
    }

    // Calculate archive date
    if (!this.compliance.archiveDate) {
        const archiveDate = new Date();
        archiveDate.setFullYear(archiveDate.getFullYear() + this.compliance.retentionPeriod);
        this.compliance.archiveDate = archiveDate;
    }

    next();
});

// ** POST-SAVE MIDDLEWARE **
activityLogSchema.post('save', async function (doc) {
    // Generate alerts for high-risk activities
    if (doc.security.accessViolation && !doc.monitoring.alertGenerated) {
        await doc.generateAlert('Security_Breach', 'Critical', []);
    }

    if (doc.phiInfo.containsPHI && doc.activity.actionResult === 'FAILURE') {
        await doc.generateAlert('Data_Loss', 'Error', []);
    }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;