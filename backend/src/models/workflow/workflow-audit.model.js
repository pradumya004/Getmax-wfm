// backend/src/models/workflow/workflow-audit.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const workflowAuditSchema = new mongoose.Schema({
    auditId: {
        type: String,
        unique: true,
        default: () => `WF-AUDIT-${uuidv4().substring(0, 10).toUpperCase()}`,
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
    claimRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: '',
        required: [true, 'Claim reference is required'],
        index: true
    },
    sowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SOW',
        index: true
    },
    employeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee reference is required'],
        index: true
    },
    batchRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkflowBatch',
        index: true
    },

    // ** AUDIT CLASSIFICATION **
    auditInfo: {
        auditType: {
            type: String,
            enum: [
                'StatusChange', 'Assignment', 'DataUpdate', 'QualityReview',
                'Escalation', 'SLABreach', 'Payment', 'Denial', 'Appeal',
                'SystemChange', 'UserAction', 'BulkOperation', 'Integration',
                'ComplianceCheck', 'SecurityEvent', 'PerformanceMetric'
            ],
            required: [true, 'Audit type is required'],
            index: true
        },
        auditSubType: {
            type: String,
            trim: true,
            maxlength: [50, 'Audit sub-type cannot exceed 50 characters']
        },
        auditCategory: {
            type: String,
            enum: ['Workflow', 'Data', 'Security', 'Compliance', 'Performance', 'System', 'User'],
            required: [true, 'Audit category is required'],
            index: true
        },
        severity: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
            index: true
        },
        riskLevel: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None'
        },
        complianceImpact: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None'
        }
    },

    // ** ACTION DETAILS **
    actionDetails: {
        action: {
            type: String,
            required: [true, 'Action is required'],
            trim: true,
            maxlength: [200, 'Action cannot exceed 200 characters']
        },
        actionCode: {
            type: String,
            trim: true,
            maxlength: [20, 'Action code cannot exceed 20 characters'],
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters']
        },
        method: {
            type: String,
            enum: ['Manual', 'Automatic', 'Scheduled', 'Triggered', 'API', 'Batch', 'Import'],
            default: 'Manual'
        },
        source: {
            type: String,
            enum: ['Web UI', 'Mobile App', 'API', 'System', 'Batch Process', 'Integration', 'Scheduler'],
            default: 'Web UI'
        },
        reason: {
            type: String,
            trim: true,
            maxlength: [500, 'Reason cannot exceed 500 characters']
        },
        businessJustification: {
            type: String,
            trim: true,
            maxlength: [1000, 'Business justification cannot exceed 1000 characters']
        }
    },

    // ** CHANGE TRACKING **
    changeTracking: {
        hasDataChanges: {
            type: Boolean,
            default: false,
            index: true
        },
        fieldsChanged: [{
            fieldName: {
                type: String,
                required: true,
                trim: true
            },
            fieldPath: {
                type: String,
                required: true,
                trim: true
            },
            dataType: {
                type: String,
                enum: ['String', 'Number', 'Boolean', 'Date', 'Object', 'Array', 'ObjectId'],
                required: true
            },
            previousValue: {
                value: mongoose.Schema.Types.Mixed,
                displayValue: String,
                metadata: {
                    type: Map,
                    of: mongoose.Schema.Types.Mixed
                }
            },
            newValue: {
                value: mongoose.Schema.Types.Mixed,
                displayValue: String,
                metadata: {
                    type: Map,
                    of: mongoose.Schema.Types.Mixed
                }
            },
            changeType: {
                type: String,
                enum: ['Create', 'Update', 'Delete', 'Move', 'Copy'],
                required: true
            },
            impactLevel: {
                type: String,
                enum: ['Low', 'Medium', 'High', 'Critical'],
                default: 'Low'
            },
            validationStatus: {
                type: String,
                enum: ['Valid', 'Invalid', 'Warning', 'NotValidated'],
                default: 'NotValidated'
            }
        }],
        changesSummary: {
            totalFields: {
                type: Number,
                default: 0
            },
            fieldsAdded: {
                type: Number,
                default: 0
            },
            fieldsModified: {
                type: Number,
                default: 0
            },
            fieldsDeleted: {
                type: Number,
                default: 0
            },
            criticalChanges: {
                type: Number,
                default: 0
            }
        },
        fullDocumentBefore: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },
        fullDocumentAfter: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },
        documentVersion: {
            before: {
                type: Number,
                default: 1
            },
            after: {
                type: Number,
                default: 1
            }
        }
    },

    // ** CONTEXT INFORMATION **
    contextInfo: {
        sessionId: {
            type: String,
            trim: true,
            index: true
        },
        requestId: {
            type: String,
            trim: true,
            index: true
        },
        transactionId: {
            type: String,
            trim: true,
            index: true
        },
        workflowStep: {
            type: String,
            trim: true
        },
        workflowState: {
            type: String,
            trim: true
        },
        businessContext: {
            clientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client'
            },
            patientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient'
            },
            payerRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payer'
            },
            departmentRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Department'
            },
            projectId: String,
            campaignId: String
        },
        relatedRecords: [{
            recordType: {
                type: String,
                enum: ['ClaimTask', 'Patient', 'Client', 'SOW', 'Employee', 'Payer', 'Other'],
                required: true
            },
            recordId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            relationship: {
                type: String,
                enum: ['Parent', 'Child', 'Related', 'Dependent', 'Reference'],
                default: 'Related'
            },
            impactLevel: {
                type: String,
                enum: ['None', 'Low', 'Medium', 'High'],
                default: 'Low'
            }
        }]
    },

    // ** TECHNICAL DETAILS **
    technicalInfo: {
        userAgent: {
            type: String,
            trim: true
        },
        ipAddress: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return !v || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(v);
                },
                message: 'Invalid IP address format'
            }
        },
        geolocation: {
            country: String,
            region: String,
            city: String,
            latitude: Number,
            longitude: Number
        },
        deviceInfo: {
            deviceType: {
                type: String,
                enum: ['Desktop', 'Mobile', 'Tablet', 'Server', 'API', 'Unknown'],
                default: 'Unknown'
            },
            platform: String,
            browser: String,
            version: String,
            screenResolution: String
        },
        networkInfo: {
            connectionType: String,
            bandwidth: String,
            latency: Number
        },
        apiInfo: {
            endpoint: String,
            method: {
                type: String,
                enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
                sparse: true
            },
            statusCode: Number,
            responseTime: Number,
            requestSize: Number,
            responseSize: Number
        }
    },

    // ** PERFORMANCE METRICS **
    performanceMetrics: {
        executionTime: {
            type: Number, // milliseconds
            default: 0
        },
        queryTime: {
            type: Number, // milliseconds
            default: 0
        },
        validationTime: {
            type: Number, // milliseconds
            default: 0
        },
        totalTime: {
            type: Number, // milliseconds
            default: 0
        },
        memoryUsage: {
            type: Number, // bytes
            default: 0
        },
        cpuUsage: {
            type: Number, // percentage
            default: 0
        },
        databaseQueries: {
            type: Number,
            default: 0
        },
        cacheHits: {
            type: Number,
            default: 0
        },
        cacheMisses: {
            type: Number,
            default: 0
        }
    },

    // ** COMPLIANCE & REGULATORY **
    complianceInfo: {
        regulatoryRequirement: [{
            regulation: {
                type: String,
                enum: ['HIPAA', 'SOX', 'GDPR', 'PCI-DSS', 'SOC2', 'FDA', 'Other'],
                required: true
            },
            requirement: String,
            complianceStatus: {
                type: String,
                enum: ['Compliant', 'Non-Compliant', 'Partial', 'Unknown'],
                default: 'Unknown'
            },
            evidence: String,
            assessedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            assessedAt: Date
        }],
        retentionPeriod: {
            type: Number, // days
            default: 2555 // 7 years default
        },
        dataClassification: {
            type: String,
            enum: ['Public', 'Internal', 'Confidential', 'Restricted', 'PHI', 'PII'],
            default: 'Internal'
        },
        encryptionRequired: {
            type: Boolean,
            default: false
        },
        auditTrailRequired: {
            type: Boolean,
            default: true
        }
    },

    // ** SECURITY INFORMATION **
    securityInfo: {
        securityLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium'
        },
        accessLevel: {
            type: String,
            enum: ['Read', 'Write', 'Admin', 'System'],
            required: true
        },
        authenticationMethod: {
            type: String,
            enum: ['Password', 'SSO', 'API Key', 'Token', 'Certificate', 'Biometric'],
            default: 'Password'
        },
        permissions: [{
            resource: String,
            action: String,
            granted: Boolean,
            grantedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            grantedAt: Date
        }],
        securityFlags: [{
            flag: {
                type: String,
                enum: ['Suspicious', 'Privileged', 'Sensitive', 'Critical', 'Automated'],
                required: true
            },
            reason: String,
            severity: {
                type: String,
                enum: ['Low', 'Medium', 'High', 'Critical'],
                default: 'Medium'
            }
        }],
        threatLevel: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None'
        }
    },

    // ** NOTIFICATION & ALERTS **
    notificationInfo: {
        notificationRequired: {
            type: Boolean,
            default: false
        },
        notificationSent: {
            type: Boolean,
            default: false
        },
        notificationSentAt: Date,
        alertLevel: {
            type: String,
            enum: ['None', 'Info', 'Warning', 'Error', 'Critical'],
            default: 'None'
        },
        recipients: [{
            recipientType: {
                type: String,
                enum: ['Employee', 'Role', 'Department', 'External', 'System'],
                required: true
            },
            recipientRef: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'notificationInfo.recipients.recipientType'
            },
            notified: {
                type: Boolean,
                default: false
            },
            notifiedAt: Date,
            method: {
                type: String,
                enum: ['Email', 'SMS', 'InApp', 'Webhook', 'System']
            }
        }]
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isArchived: {
            type: Boolean,
            default: false,
            index: true
        },
        archivedAt: Date,
        archivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        processingStatus: {
            type: String,
            enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Skipped'],
            default: 'Completed'
        },
        version: {
            type: String,
            default: '1.0'
        },
        tags: [{
            type: String,
            trim: true,
            maxlength: [50, 'Tag cannot exceed 50 characters']
        }],
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
workflowAuditSchema.index({ companyRef: 1, claimRef: 1, createdAt: -1 });
workflowAuditSchema.index({ employeeRef: 1, 'auditInfo.auditType': 1, createdAt: -1 });
workflowAuditSchema.index({ 'auditInfo.auditCategory': 1, 'auditInfo.severity': 1 });
workflowAuditSchema.index({ 'contextInfo.sessionId': 1, createdAt: -1 });
workflowAuditSchema.index({ 'securityInfo.securityLevel': 1, 'securityInfo.threatLevel': 1 });
workflowAuditSchema.index({ 'complianceInfo.regulatoryRequirement.regulation': 1 });
workflowAuditSchema.index({ 'changeTracking.hasDataChanges': 1, 'auditInfo.auditType': 1 });

// ** VIRTUAL FIELDS **
workflowAuditSchema.virtual('hasHighRisk').get(function () {
    return ['High', 'Critical'].includes(this.auditInfo.riskLevel) ||
        ['High', 'Critical'].includes(this.securityInfo.threatLevel);
});

workflowAuditSchema.virtual('requiresAttention').get(function () {
    return this.hasHighRisk ||
        this.auditInfo.severity === 'Critical' ||
        this.securityInfo.securityFlags.some(flag => flag.severity === 'Critical');
});

workflowAuditSchema.virtual('changeCount').get(function () {
    return this.changeTracking.fieldsChanged ? this.changeTracking.fieldsChanged.length : 0;
});

workflowAuditSchema.virtual('criticalChangeCount').get(function () {
    return this.changeTracking.fieldsChanged ?
        this.changeTracking.fieldsChanged.filter(change => change.impactLevel === 'Critical').length : 0;
});

// ** INSTANCE METHODS **
workflowAuditSchema.methods.addFieldChange = function (fieldName, fieldPath, dataType, previousValue, newValue, changeType = 'Update', impactLevel = 'Low') {
    const change = {
        fieldName,
        fieldPath,
        dataType,
        previousValue: {
            value: previousValue,
            displayValue: this.formatValueForDisplay(previousValue, dataType)
        },
        newValue: {
            value: newValue,
            displayValue: this.formatValueForDisplay(newValue, dataType)
        },
        changeType,
        impactLevel,
        validationStatus: 'NotValidated'
    };

    this.changeTracking.fieldsChanged.push(change);
    this.changeTracking.hasDataChanges = true;

    // Update summary
    this.changeTracking.changesSummary.totalFields = this.changeTracking.fieldsChanged.length;
    if (changeType === 'Create') this.changeTracking.changesSummary.fieldsAdded++;
    if (changeType === 'Update') this.changeTracking.changesSummary.fieldsModified++;
    if (changeType === 'Delete') this.changeTracking.changesSummary.fieldsDeleted++;
    if (impactLevel === 'Critical') this.changeTracking.changesSummary.criticalChanges++;

    return change;
};

workflowAuditSchema.methods.formatValueForDisplay = function (value, dataType) {
    if (value === null || value === undefined) return 'null';

    switch (dataType) {
        case 'Date':
            return new Date(value).toISOString();
        case 'Boolean':
            return value ? 'true' : 'false';
        case 'Object':
        case 'Array':
            return JSON.stringify(value);
        case 'ObjectId':
            return value.toString();
        default:
            return String(value);
    }
};

workflowAuditSchema.methods.addSecurityFlag = function (flag, reason, severity = 'Medium') {
    this.securityInfo.securityFlags.push({
        flag,
        reason,
        severity
    });

    // Update threat level if needed
    if (severity === 'Critical' && this.securityInfo.threatLevel !== 'Critical') {
        this.securityInfo.threatLevel = 'High';
    }
};

workflowAuditSchema.methods.markForNotification = function (alertLevel = 'Info', recipients = []) {
    this.notificationInfo.notificationRequired = true;
    this.notificationInfo.alertLevel = alertLevel;

    recipients.forEach(recipient => {
        this.notificationInfo.recipients.push({
            recipientType: recipient.type,
            recipientRef: recipient.id,
            method: recipient.method || 'Email'
        });
    });
};

workflowAuditSchema.methods.archive = function (archivedBy, reason = '') {
    this.systemInfo.isArchived = true;
    this.systemInfo.archivedAt = new Date();
    this.systemInfo.archivedBy = archivedBy;
    this.systemInfo.metadata.set('archiveReason', reason);
};

// ** STATIC METHODS **
workflowAuditSchema.statics.findByClaimWorkflow = function (claimRef, auditTypes = [], limit = 100) {
    const query = {
        claimRef,
        'systemInfo.isActive': true
    };

    if (auditTypes.length > 0) {
        query['auditInfo.auditType'] = { $in: auditTypes };
    }

    return this.find(query)
        .populate('employeeRef', 'personalInfo.firstName personalInfo.lastName')
        .sort({ createdAt: -1 })
        .limit(limit);
};

workflowAuditSchema.statics.findHighRiskAudits = function (companyRef, dateRange = null) {
    const query = {
        companyRef,
        $or: [
            { 'auditInfo.riskLevel': { $in: ['High', 'Critical'] } },
            { 'securityInfo.threatLevel': { $in: ['High', 'Critical'] } },
            { 'auditInfo.severity': 'Critical' }
        ],
        'systemInfo.isActive': true
    };

    if (dateRange) {
        query.createdAt = {
            $gte: dateRange.start,
            $lte: dateRange.end
        };
    }

    return this.find(query)
        .sort({ 'auditInfo.severity': -1, createdAt: -1 });
};

workflowAuditSchema.statics.getAuditStatistics = function (companyRef, timeframe = 'month') {
    let dateMatch = {};
    const now = new Date();

    switch (timeframe) {
        case 'day':
            dateMatch = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
            break;
        case 'week':
            dateMatch = { $gte: new Date(now.setDate(now.getDate() - 7)) };
            break;
        case 'month':
            dateMatch = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
            break;
        case 'year':
            dateMatch = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
            break;
    }

    return this.aggregate([
        {
            $match: {
                companyRef: mongoose.Types.ObjectId(companyRef),
                createdAt: dateMatch,
                'systemInfo.isActive': true
            }
        },
        {
            $group: {
                _id: {
                    auditType: '$auditInfo.auditType',
                    severity: '$auditInfo.severity'
                },
                count: { $sum: 1 },
                avgExecutionTime: { $avg: '$performanceMetrics.executionTime' },
                dataChanges: { $sum: { $cond: ['$changeTracking.hasDataChanges', 1, 0] } },
                highRisk: { $sum: { $cond: [{ $in: ['$auditInfo.riskLevel', ['High', 'Critical']] }, 1, 0] } }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

// ** PRE-SAVE MIDDLEWARE **
workflowAuditSchema.pre('save', function (next) {
    // Set processing completion time
    if (this.isNew && !this.performanceMetrics.totalTime) {
        this.performanceMetrics.totalTime =
            this.performanceMetrics.executionTime +
            this.performanceMetrics.queryTime +
            this.performanceMetrics.validationTime;
    }

    // Auto-determine risk level based on changes and context
    if (this.changeTracking.hasDataChanges && this.changeTracking.changesSummary.criticalChanges > 0) {
        this.auditInfo.riskLevel = 'High';
    }

    // Set retention based on compliance requirements
    if (this.complianceInfo.regulatoryRequirement.some(req => req.regulation === 'HIPAA')) {
        this.complianceInfo.retentionPeriod = 2555; // 7 years for HIPAA
    }

    next();
});

export const WorkflowAudit = mongoose.model('WorkflowAudit', workflowAuditSchema, 'workflowaudits');

// ===== backend/src/models/system/audit-log.model.js =====
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const auditLogSchema = new mongoose.Schema({
    logId: {
        type: String,
        unique: true,
        default: () => `AUDIT-${uuidv4().substring(0, 12).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        index: true
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userType',
        required: [true, 'User reference is required'],
        index: true
    },
    userType: {
        type: String,
        enum: ['Employee', 'Company', 'System', 'API', 'Integration'],
        required: [true, 'User type is required'],
        index: true
    },

    // ** LOG CLASSIFICATION **
    logInfo: {
        logLevel: {
            type: String,
            enum: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'AUDIT'],
            default: 'AUDIT',
            required: true,
            index: true
        },
        logCategory: {
            type: String,
            enum: [
                'Authentication', 'Authorization', 'DataAccess', 'DataModification',
                'SystemAccess', 'ConfigurationChange', 'SecurityEvent', 'ComplianceEvent',
                'PerformanceEvent', 'ErrorEvent', 'BusinessEvent', 'IntegrationEvent'
            ],
            required: [true, 'Log category is required'],
            index: true
        },
        eventType: {
            type: String,
            enum: [
                'LOGIN', 'LOGOUT', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT',
                'IMPORT', 'PRINT', 'SHARE', 'APPROVE', 'REJECT', 'ESCALATE',
                'ASSIGN', 'UNASSIGN', 'LOCK', 'UNLOCK', 'ARCHIVE', 'RESTORE'
            ],
            required: [true, 'Event type is required'],
            index: true
        },
        severity: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
            index: true
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical', 'Emergency'],
            default: 'Normal'
        }
    },

    // ** TARGET ENTITY **
    entityInfo: {
        entityType: {
            type: String,
            enum: [
                'Company', 'Employee', 'Client', 'ClaimTask', 'SOW', 'Patient',
                'Payer', 'Department', 'Role', 'Designation', 'User', 'System',
                'Configuration', 'Report', 'Integration', 'API', 'File'
            ],
            required: [true, 'Entity type is required'],
            index: true
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Entity ID is required'],
            index: true
        },
        entityName: {
            type: String,
            trim: true,
            maxlength: [200, 'Entity name cannot exceed 200 characters']
        },
        entityDescription: {
            type: String,
            trim: true,
            maxlength: [500, 'Entity description cannot exceed 500 characters']
        },
        parentEntity: {
            entityType: String,
            entityId: mongoose.Schema.Types.ObjectId,
            entityName: String
        },
        relatedEntities: [{
            entityType: {
                type: String,
                required: true
            },
            entityId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            entityName: String,
            relationshipType: {
                type: String,
                enum: ['Parent', 'Child', 'Related', 'Dependent', 'Reference'],
                default: 'Related'
            }
        }]
    },

    // ** ACTION DETAILS **
    actionDetails: {
        action: {
            type: String,
            required: [true, 'Action is required'],
            trim: true,
            maxlength: [500, 'Action cannot exceed 500 characters']
        },
        actionResult: {
            type: String,
            enum: ['Success', 'Failure', 'Partial', 'Warning', 'Error'],
            required: [true, 'Action result is required'],
            index: true
        },
        actionDuration: {
            type: Number, // milliseconds
            default: 0
        },
        method: {
            type: String,
            enum: ['Manual', 'Automatic', 'Scheduled', 'API', 'Integration', 'System'],
            default: 'Manual'
        },
        source: {
            type: String,
            enum: ['WebUI', 'MobileApp', 'API', 'System', 'Integration', 'Scheduler', 'CLI'],
            default: 'WebUI'
        },
        reason: {
            type: String,
            trim: true,
            maxlength: [1000, 'Reason cannot exceed 1000 characters']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        }
    },

    // ** CHANGE TRACKING **
    changeInfo: {
        hasChanges: {
            type: Boolean,
            default: false,
            index: true
        },
        changeType: {
            type: String,
            enum: ['Create', 'Update', 'Delete', 'Move', 'Copy', 'Merge', 'Split'],
            sparse: true
        },
        changedFields: [{
            fieldName: String,
            fieldPath: String,
            oldValue: mongoose.Schema.Types.Mixed,
            newValue: mongoose.Schema.Types.Mixed,
            dataType: String,
            changeReason: String
        }],
        before: {
            snapshot: {
                type: Map,
                of: mongoose.Schema.Types.Mixed
            },
            checksum: String,
            version: Number
        },
        after: {
            snapshot: {
                type: Map,
                of: mongoose.Schema.Types.Mixed
            },
            checksum: String,
            version: Number
        },
        changesSummary: {
            fieldsAdded: { type: Number, default: 0 },
            fieldsModified: { type: Number, default: 0 },
            fieldsDeleted: { type: Number, default: 0 },
            totalChanges: { type: Number, default: 0 }
        }
    },

    // ** SESSION & CONTEXT **
    sessionInfo: {
        sessionId: {
            type: String,
            trim: true,
            index: true
        },
        requestId: {
            type: String,
            trim: true,
            index: true
        },
        correlationId: {
            type: String,
            trim: true,
            index: true
        },
        transactionId: {
            type: String,
            trim: true,
            index: true
        },
        batchId: {
            type: String,
            trim: true,
            index: true
        },
        workflowId: {
            type: String,
            trim: true
        },
        stepId: {
            type: String,
            trim: true
        }
    },

    // ** TECHNICAL CONTEXT **
    technicalInfo: {
        ipAddress: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return !v || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(v);
                },
                message: 'Invalid IP address format'
            }
        },
        userAgent: {
            type: String,
            trim: true,
            maxlength: [1000, 'User agent cannot exceed 1000 characters']
        },
        hostname: {
            type: String,
            trim: true
        },
        serverInfo: {
            serverId: String,
            serverName: String,
            environment: {
                type: String,
                enum: ['Development', 'Testing', 'Staging', 'Production'],
                default: 'Production'
            },
            version: String,
            buildNumber: String
        },
        requestInfo: {
            endpoint: String,
            httpMethod: {
                type: String,
                enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']
            },
            statusCode: Number,
            responseTime: Number,
            requestSize: Number,
            responseSize: Number,
            headers: {
                type: Map,
                of: String
            }
        },
        geolocation: {
            country: String,
            region: String,
            city: String,
            timezone: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            }
        }
    },

    // ** SECURITY INFORMATION **
    securityInfo: {
        authenticationMethod: {
            type: String,
            enum: ['Password', 'SSO', 'API_Key', 'Token', 'Certificate', 'Biometric', 'System'],
            default: 'Password'
        },
        authenticationResult: {
            type: String,
            enum: ['Success', 'Failed', 'Blocked', 'Expired', 'Invalid'],
            default: 'Success'
        },
        accessLevel: {
            type: String,
            enum: ['Guest', 'User', 'Admin', 'System', 'Root'],
            default: 'User'
        },
        permissionsUsed: [{
            resource: String,
            action: String,
            granted: Boolean,
            reason: String
        }],
        securityFlags: [{
            flag: {
                type: String,
                enum: ['Suspicious', 'Privileged', 'Sensitive', 'Anomalous', 'Automated'],
                required: true
            },
            severity: {
                type: String,
                enum: ['Low', 'Medium', 'High', 'Critical'],
                default: 'Medium'
            },
            reason: String,
            detected: {
                type: Date,
                default: Date.now
            }
        }],
        riskScore: {
            type: Number,
            min: [0, 'Risk score cannot be negative'],
            max: [100, 'Risk score cannot exceed 100'],
            default: 0
        },
        threatLevel: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None'
        }
    },

    // ** COMPLIANCE & REGULATORY **
    complianceInfo: {
        regulatoryFrameworks: [{
            framework: {
                type: String,
                enum: ['HIPAA', 'SOX', 'GDPR', 'PCI_DSS', 'SOC2', 'FDA', 'FISMA', 'ISO27001'],
                required: true
            },
            requirement: String,
            compliance: {
                type: String,
                enum: ['Compliant', 'Non_Compliant', 'Partial', 'Unknown'],
                default: 'Unknown'
            },
            evidence: String,
            assessor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            assessedAt: Date
        }],
        dataClassification: {
            type: String,
            enum: ['Public', 'Internal', 'Confidential', 'Restricted', 'PHI', 'PII'],
            default: 'Internal'
        },
        retentionPeriod: {
            type: Number, // days
            default: 2555 // 7 years
        },
        retentionReason: String,
        legalHold: {
            isActive: {
                type: Boolean,
                default: false
            },
            holdId: String,
            reason: String,
            startDate: Date,
            expectedEndDate: Date
        },
        privacyImpact: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None'
        }
    },

    // ** BUSINESS CONTEXT **
    businessInfo: {
        businessProcess: {
            type: String,
            trim: true,
            maxlength: [100, 'Business process cannot exceed 100 characters']
        },
        businessFunction: {
            type: String,
            enum: [
                'Claims Processing', 'Patient Management', 'Provider Management',
                'Revenue Cycle', 'Quality Assurance', 'Compliance', 'Reporting',
                'Administration', 'Integration', 'Support'
            ]
        },
        businessImpact: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'Low'
        },
        financialImpact: {
            amount: Number,
            currency: {
                type: String,
                default: 'USD'
            },
            impactType: {
                type: String,
                enum: ['Revenue', 'Cost', 'Savings', 'Loss', 'Risk']
            }
        },
        clientImpact: {
            clientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client'
            },
            impactLevel: {
                type: String,
                enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
                default: 'None'
            },
            description: String
        }
    },

    // ** PERFORMANCE METRICS **
    performanceInfo: {
        executionTime: {
            type: Number, // milliseconds
            default: 0
        },
        queryTime: {
            type: Number, // milliseconds
            default: 0
        },
        networkTime: {
            type: Number, // milliseconds
            default: 0
        },
        resourceUsage: {
            cpu: Number, // percentage
            memory: Number, // bytes
            disk: Number, // bytes
            network: Number // bytes
        },
        databaseMetrics: {
            queries: Number,
            insertions: Number,
            updates: Number,
            deletions: Number,
            indexScans: Number,
            fullTableScans: Number
        },
        cacheMetrics: {
            hits: Number,
            misses: Number,
            hitRatio: Number
        }
    },

    // ** SYSTEM STATUS **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isArchived: {
            type: Boolean,
            default: false,
            index: true
        },
        archivedAt: Date,
        processingStatus: {
            type: String,
            enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Ignored'],
            default: 'Completed'
        },
        alertGenerated: {
            type: Boolean,
            default: false
        },
        alertLevel: {
            type: String,
            enum: ['None', 'Info', 'Warning', 'Error', 'Critical'],
            default: 'None'
        },
        tags: [{
            type: String,
            trim: true,
            maxlength: [50, 'Tag cannot exceed 50 characters']
        }],
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** COMPREHENSIVE INDEXES **
auditLogSchema.index({ companyRef: 1, createdAt: -1 });
auditLogSchema.index({ userRef: 1, userType: 1, createdAt: -1 });
auditLogSchema.index({ 'logInfo.logLevel': 1, 'logInfo.severity': 1 });
auditLogSchema.index({ 'entityInfo.entityType': 1, 'entityInfo.entityId': 1 });
auditLogSchema.index({ 'sessionInfo.sessionId': 1, createdAt: -1 });
auditLogSchema.index({ 'actionDetails.actionResult': 1, 'logInfo.severity': 1 });
auditLogSchema.index({ 'securityInfo.threatLevel': 1, 'securityInfo.riskScore': -1 });
auditLogSchema.index({ 'complianceInfo.regulatoryFrameworks.framework': 1 });

// Compound indexes for complex queries
auditLogSchema.index({
    companyRef: 1,
    'logInfo.logCategory': 1,
    'logInfo.eventType': 1,
    createdAt: -1
});

auditLogSchema.index({
    'entityInfo.entityType': 1,
    'entityInfo.entityId': 1,
    'changeInfo.hasChanges': 1,
    createdAt: -1
});

// ** VIRTUAL FIELDS **
auditLogSchema.virtual('isHighRisk').get(function () {
    return this.securityInfo.riskScore > 70 ||
        ['High', 'Critical'].includes(this.securityInfo.threatLevel) ||
        this.logInfo.severity === 'Critical';
});

auditLogSchema.virtual('requiresAttention').get(function () {
    return this.isHighRisk ||
        this.actionDetails.actionResult === 'Failure' ||
        this.systemInfo.alertLevel === 'Critical';
});

auditLogSchema.virtual('totalChanges').get(function () {
    return this.changeInfo.changesSummary.totalChanges || 0;
});

// ** INSTANCE METHODS **
auditLogSchema.methods.addSecurityFlag = function (flag, severity = 'Medium', reason = '') {
    this.securityInfo.securityFlags.push({
        flag,
        severity,
        reason,
        detected: new Date()
    });

    // Update risk score based on new flag
    this.calculateRiskScore();
};

auditLogSchema.methods.calculateRiskScore = function () {
    let score = 0;

    // Base score by severity
    switch (this.logInfo.severity) {
        case 'Critical': score += 40; break;
        case 'High': score += 30; break;
        case 'Medium': score += 20; break;
        case 'Low': score += 10; break;
    }

    // Security flags impact
    this.securityInfo.securityFlags.forEach(flag => {
        switch (flag.severity) {
            case 'Critical': score += 25; break;
            case 'High': score += 15; break;
            case 'Medium': score += 10; break;
            case 'Low': score += 5; break;
        }
    });

    // Action result impact
    if (this.actionDetails.actionResult === 'Failure') score += 20;
    if (this.actionDetails.actionResult === 'Error') score += 15;

    // Cap at 100
    this.securityInfo.riskScore = Math.min(score, 100);

    // Set threat level based on score
    if (this.securityInfo.riskScore >= 80) this.securityInfo.threatLevel = 'Critical';
    else if (this.securityInfo.riskScore >= 60) this.securityInfo.threatLevel = 'High';
    else if (this.securityInfo.riskScore >= 40) this.securityInfo.threatLevel = 'Medium';
    else if (this.securityInfo.riskScore >= 20) this.securityInfo.threatLevel = 'Low';
    else this.securityInfo.threatLevel = 'None';

    return this.securityInfo.riskScore;
};

auditLogSchema.methods.archive = function (reason = 'Automated archival') {
    this.systemInfo.isArchived = true;
    this.systemInfo.archivedAt = new Date();
    this.systemInfo.metadata.set('archiveReason', reason);
};

// ** STATIC METHODS **
auditLogSchema.statics.findByEntity = function (entityType, entityId, limit = 100) {
    return this.find({
        'entityInfo.entityType': entityType,
        'entityInfo.entityId': entityId,
        'systemInfo.isActive': true
    })
        .sort({ createdAt: -1 })
        .limit(limit);
};

auditLogSchema.statics.findHighRiskEvents = function (companyRef, timeframe = 'day') {
    const dateRange = this.getDateRange(timeframe);

    return this.find({
        companyRef,
        createdAt: { $gte: dateRange.start, $lte: dateRange.end },
        $or: [
            { 'securityInfo.riskScore': { $gte: 70 } },
            { 'securityInfo.threatLevel': { $in: ['High', 'Critical'] } },
            { 'logInfo.severity': 'Critical' }
        ],
        'systemInfo.isActive': true
    })
        .sort({ 'securityInfo.riskScore': -1, createdAt: -1 });
};

auditLogSchema.statics.getComplianceReport = function (companyRef, framework, dateRange) {
    return this.aggregate([
        {
            $match: {
                companyRef: mongoose.Types.ObjectId(companyRef),
                'complianceInfo.regulatoryFrameworks.framework': framework,
                createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                'systemInfo.isActive': true
            }
        },
        {
            $group: {
                _id: '$complianceInfo.regulatoryFrameworks.compliance',
                count: { $sum: 1 },
                riskScore: { $avg: '$securityInfo.riskScore' },
                events: {
                    $push: {
                        logId: '$logId',
                        action: '$actionDetails.action',
                        result: '$actionDetails.actionResult',
                        timestamp: '$createdAt'
                    }
                }
            }
        }
    ]);
};

auditLogSchema.statics.getDateRange = function (timeframe) {
    const now = new Date();
    let start;

    switch (timeframe) {
        case 'hour':
            start = new Date(now.getTime() - (60 * 60 * 1000));
            break;
        case 'day':
            start = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            break;
        case 'week':
            start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            break;
        case 'month':
            start = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            break;
        default:
            start = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    }

    return { start, end: now };
};

// ** PRE-SAVE MIDDLEWARE **
auditLogSchema.pre('save', function (next) {
    // Calculate risk score if not set
    if (this.securityInfo.riskScore === 0) {
        this.calculateRiskScore();
    }

    // Set alert level based on risk score and severity
    if (this.securityInfo.riskScore >= 80 || this.logInfo.severity === 'Critical') {
        this.systemInfo.alertGenerated = true;
        this.systemInfo.alertLevel = 'Critical';
    } else if (this.securityInfo.riskScore >= 60 || this.logInfo.severity === 'High') {
        this.systemInfo.alertGenerated = true;
        this.systemInfo.alertLevel = 'Error';
    }

    // Set retention period based on compliance requirements
    const hipaaRequired = this.complianceInfo.regulatoryFrameworks.some(req => req.framework === 'HIPAA');
    if (hipaaRequired) {
        this.complianceInfo.retentionPeriod = 2555; // 7 years
    }

    next();
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema, 'auditlogs');